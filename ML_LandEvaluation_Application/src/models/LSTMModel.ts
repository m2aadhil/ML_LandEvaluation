import * as tf from '@tensorflow/tfjs';
import { TensorData } from '../data/tensors.data';
import { io } from '../server';

export class LSTMModel {

    private model: tf.Sequential;
    features = 3;
    columnLength: number;
    private populations = [];
    private rdpis = [];
    private employments = [];

    private crimeIncidents = [];
    private perCapitaPersonalIncome = [];
    private medianHouseholdIncome = [];

    constructor() {
        this.model = tf.sequential();
    }


    /**
     * Creates the LSTM model
     * 
     * @param {number} featureCount (factor count affecting lanf value)
     * @param {number} learningRate (learning rate of the model)
     * @memberof LSTMModel
     */
    createModel = async (featureCount, learningRate) => {
        //Input layer
        this.model.add(tf.layers.lstm({
            inputShape: [featureCount, 1],
            units: 10
        }));

        //Output layer
        this.model.add(tf.layers.dense({
            units: 1
        }));

        this.model.compile({
            optimizer: tf.train.rmsprop(learningRate),
            loss: 'meanSquaredError'
        });
    }


    /**
     * Train the created model
     * 
     * @param {any} data (training data set)
     * @param {number} epochs (training iteration count)
     *
     * @memberof LSTMModel
     */
    trainModel = async (data, epochs) => {
        await this.model.fitDataset(data, {
            epochs: epochs,
            callbacks: { onEpochEnd: (epoch, logs) => { console.log(logs); io.emit('my broadcast', { server: logs }); } }
        });
    }


    /**
     * Predict Price
     * 
     * @param {any} data (last data row)
     *
     * @memberof LSTMModel
     */
    predictPrice = async (data) => {
        let price;
        await data.take(3).forEachAsync(i => {
            const { xs, ys } = i;
            const a = (this.model.predict(xs) as tf.Tensor);
            a.array().then((array: any) => {
                console.log();
                price = array[0];
            });
        })
        return price;
    }

    feedData(data, type) {
        switch (type) {
            case ("state"): {
                data[0].forEach(d => {
                    this.populations.push(d[0]);
                    this.rdpis.push(d[1]);
                    this.employments.push(d[2]);
                })
            }; break;
            case ("county"): {
                data[0].forEach(d => {
                    this.crimeIncidents.push(d[0]);
                    this.populations.push(d[1]);
                    this.perCapitaPersonalIncome.push(d[2]);
                    this.medianHouseholdIncome.push(d[2]);
                })
            }; break;
        }
    }

    //Predict next step from last step -- County Data
    predictNextStepCounty = async (tensor: TensorData) => {
        let price = null;
        this.columnLength = this.populations.length;
        let crimeDevs = (await this.calculateMeansNStddevs(this.crimeIncidents.slice(this.columnLength - (this.columnLength / 2))));
        let popDevs = (await this.calculateMeansNStddevs(this.populations.slice(this.columnLength - (this.columnLength / 2))));
        let perCapDevs = (await this.calculateMeansNStddevs(this.perCapitaPersonalIncome.slice(this.columnLength - (this.columnLength / 2))));
        let medianDevs = (await this.calculateMeansNStddevs(this.medianHouseholdIncome.slice(this.columnLength - (this.columnLength / 2))));

        let crimeDev = this.calcNextStep(this.crimeIncidents[this.columnLength - 1], crimeDevs.stdDev);
        let popDev = this.calcNextStep(this.populations[this.columnLength - 1], popDevs.stdDev);
        let perCapDev = this.calcNextStep(this.perCapitaPersonalIncome[this.columnLength - 1], perCapDevs.stdDev);
        let medianDev = this.calcNextStep(this.medianHouseholdIncome[this.columnLength - 1], medianDevs.stdDev);

        this.crimeIncidents.push(crimeDev); this.populations.push(popDev); this.perCapitaPersonalIncome.push(perCapDev); this.medianHouseholdIncome.push(medianDev);

        const values = [
            [tensor.normalizeValue(crimeDev, tensor.countyMinMax.CrimeIncidentsMin, tensor.countyMinMax.CrimeIncidentsMax)],
            [tensor.normalizeValue(popDev, tensor.countyMinMax.PopulationMin, tensor.countyMinMax.PopulationMax)],
            [tensor.normalizeValue(perCapDev, tensor.countyMinMax.PerCapitaPersonalIncomeMin, tensor.countyMinMax.PerCapitaPersonalIncomeMax)],
            [tensor.normalizeValue(medianDev, tensor.countyMinMax.MedianHouseholdIncomeMin, tensor.countyMinMax.MedianHouseholdIncomeMax)]
        ];

        let tens = tf.tensor3d([values]);

        const a = (await this.model.predict(tens) as tf.Tensor);
        tens = null;
        await a.array().then((array: any) => {
            console.log('pred');
            console.log(array);
            price = array[0];
        });
        return price;
    }

    //Predict next step from last step - State Data
    predictNextStepState = async (tensor: TensorData) => {
        let price = null;
        this.columnLength = this.populations.length;
        let popDevs = (await this.calculateMeansNStddevs(this.populations.slice(this.columnLength - (this.columnLength / 2))));
        let rdpDevs = (await this.calculateMeansNStddevs(this.rdpis.slice(this.columnLength - (this.columnLength / 2))));
        let empDevs = (await this.calculateMeansNStddevs(this.employments.slice(this.columnLength - (this.columnLength / 2))));
        let popDev = this.calcNextStep(this.populations[this.columnLength - 1], popDevs.stdDev);
        let rdpDev = this.calcNextStep(this.rdpis[this.columnLength - 1], rdpDevs.stdDev);
        let empDev = this.calcNextStep(this.employments[this.columnLength - 1], empDevs.stdDev);
        // let popDev = this.calcDiff(this.populations.slice(this.columnLength - (this.columnLength / 2)));
        // let rdpDev = this.calcDiff(this.rdpis.slice(this.columnLength - (this.columnLength / 2)));
        // let empDev = this.calcDiff(this.employments.slice(this.columnLength - (this.columnLength / 2)));
        this.populations.push(popDev); this.rdpis.push(rdpDev); this.employments.push(empDev);

        const values = [
            [tensor.normalizeValue(popDev, tensor.stateMinMax.PopulationMin, tensor.stateMinMax.PopulationMax)],
            [tensor.normalizeValue(rdpDev, tensor.stateMinMax.RDPIMin, tensor.stateMinMax.RDPIMax)],
            [tensor.normalizeValue(empDev, tensor.stateMinMax.EmploymentMin, tensor.stateMinMax.EmploymentMax)]
        ];

        let tens = tf.tensor3d([values]);

        const a = (await this.model.predict(tens) as tf.Tensor);
        tens = null;
        await a.array().then((array: any) => {
            console.log('pred');
            console.log(array);
            price = array[0];
        });
        return price;
    }

    calcDiff(values) {
        let diff = [];
        let val = 0;
        for (let i = 1; i < values.length; i++) {
            diff.push(values[i] - values[i - 1]);
        }
        diff.forEach(x => {
            val += x;
        })
        return values[values.length - 1] + (val / values.length)
    }

    calcNextStep(value, std) {
        let val = value + (std / this.features) * Math.sqrt(this.columnLength);
        return val;
    }

    //Calculate STD Deviation
    calculateMeansNStddevs = async (dataColumns) => {
        let means;
        let stddevs;
        await tf.tidy(() => {
            let data = tf.tensor1d(dataColumns);
            let moments = tf.moments(data);
            means = moments.mean.dataSync();
            stddevs = Math.sqrt(Number(moments.variance.dataSync()));
            console.log('means:', means);
            console.log('stddevs:', stddevs);
        });

        return { mean: means, stdDev: stddevs }
    }

}