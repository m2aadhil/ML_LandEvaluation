import * as tf from '@tensorflow/tfjs';

export class LSTMModel {

    private model: tf.Sequential;
    featureCount = 8;
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
        //let popMean = (await this.calculateMeansNStddevs(populations)).mean;
        // let popDev = (await this.calculateMeansNStddevs(populations));
        // let rdpDev = (await this.calculateMeansNStddevs(rdpis));
        // let empDev = (await this.calculateMeansNStddevs(employments));
        let popDev = this.calcDiff(this.populations);
        let rdpDev = this.calcDiff(this.rdpis);
        let empDev = this.calcDiff(this.employments);;
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

    calcNextStep(value, std, step) {
        let dev = std / this.featureCount;
        return value + dev;
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