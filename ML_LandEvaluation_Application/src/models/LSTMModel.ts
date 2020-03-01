import * as tf from '@tensorflow/tfjs';

export class LSTMModel {

    private model: tf.Sequential;
    features = 3;
    columnLength: number;
    private populations = [];
    private rdpis = [];
    private employments = [];
    constructor() {
        this.model = tf.sequential();
    }

    createModel = async (featureCount, learningRate) => {
        this.model.add(tf.layers.lstm({
            inputShape: [featureCount, 1],
            units: 100
        }));
        //model.weights.forEach(x => console.log(x));
        this.model.add(tf.layers.dense({
            units: 1
        }));
        //tf.train.rmsprop(learningRate)
        this.model.compile({
            optimizer: tf.train.rmsprop(learningRate),
            loss: 'meanSquaredError'
        });
    }

    trainModel = async (data, epochs) => {
        await this.model.fitDataset(data, { epochs: epochs });
    }

    predictPrice = async (data) => {
        let price;
        await data.take(3).forEachAsync(i => {
            const { xs, ys } = i;
            const a = (this.model.predict(xs) as tf.Tensor);
            a.array().then((array: any) => {
                console.log();
                price = array[0];
                //console.log(deNormalizeData(array[0], PriceMin, PriceMax));
                // array.forEach(x => {
                //     console.log(deNormalizeData(x, PriceMin, PriceMax));
                // })

            });
        })

        return price;
    }

    feedData(data) {
        data[0].forEach(d => {
            this.populations.push(d[0]);
            this.rdpis.push(d[1]);
            this.employments.push(d[2]);
        })
    }

    predictNextStep = async (tensor) => {
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
            [tensor.normalizeValue(popDev, tensor.PopulationMin, tensor.PopulationMax)],
            [tensor.normalizeValue(rdpDev, tensor.RDPIMin, tensor.RDPIMax)],
            [tensor.normalizeValue(empDev, tensor.EmploymentMin, tensor.EmploymentMax)]
        ];

        let tens = tf.tensor3d([values]);

        // let tens = tf.tensor3d([[[this.calcNextStep(populations[9], popDev, step)],
        // [this.calcNextStep(rdpis[9], rdpDev, step)],
        // [this.calcNextStep(employments[9], empDev, step)]]]);

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

        // this.normalizedData = [];
        // for (let i = 0; i < this.numRows; ++i) {
        //     const row = [];
        //     for (let j = 0; j < this.numCols; ++j) {
        //         row.push((this.data[i][j] - this.means[j]) / this.stddevs[j]);
        //     }
        //     this.normalizedData.push(row);
        // }

        return { mean: means, stdDev: stddevs }
    }

}