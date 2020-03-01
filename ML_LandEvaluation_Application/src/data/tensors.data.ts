import * as tf from '@tensorflow/tfjs';

//const DATA_PATH = "file://C://Users/MusthaqAa/source/repos/ML_LandEvaluation/ML_LandEvaluation_Application/datasets/arizona_data.csv";
const DATA_PATH = "file://C://Users/MusthaqAa/source/repos/ML_LandEvaluation/ML_LandEvaluation_Application/datasets/";

export class TensorData {

    public featureCount: number = 3;
    private csvData;
    private trainingData;
    private validationData;
    private filePath: string;

    PopulationMax = 7171646;
    RDPIMax = 39955;
    EmploymentMax = 3859137;
    PopulationMin = 6280362;
    RDPIMin = 30844;
    EmploymentMin = 3181571;
    PriceMax = 247449.5833;
    PriceMin = 140399.6667;

    constructor(location: string) {
        this.filePath = DATA_PATH + location + '.csv';
    }

    loadCSV = async () => {
        this.csvData = await tf.data.csv(this.filePath, { columnConfigs: { Price: { isLabel: true } } });
        await this.mapMaxData();
    }

    loadData = async () => {
        let data = await this.csvData.map(this.csvTransform);
        this.trainingData = await data.batch(10);
        this.validationData = await data.skip(10).batch(1);
    }

    mapMaxData = async () => {
        let maxData = await this.csvData.map((i: any) => {
            const { xs, ys } = i;
            return {
                xs: [xs.PopulationMin, xs.PopulationMax, xs.RDPIMin, xs.RDPIMax, xs.EmploymentMin, xs.EmploymentMax],
                ys: [xs.PriceMin, xs.PriceMax]
            };
        }).batch(1);
        await maxData.take(3).forEachAsync(i => {
            const { xs, ys } = i;
            (xs as tf.Tensor).array().then((v: any) => {
                let val = v[0];
                console.log(v[0])
                this.PopulationMin = val[0];
                this.PopulationMax = val[1];
                this.RDPIMin = val[2];
                this.RDPIMax = val[3];
                this.EmploymentMin = val[4];
                this.EmploymentMax = val[5];
            });
            (ys as tf.Tensor).array().then(val => {
                console.log(val[0][0])

                this.PriceMin = val[0][0];
                this.PriceMax = val[0][1];
            });
        })
    }

    normalizeValue = (value, min, max) => {
        return (value - min) / (max - min);
    }

    deNormalizeValue = (value, min, max) => {
        return value * (max - min) + min;
    }

    csvTransform = (val: any) => {
        const { xs, ys } = val
        const values = [
            [this.normalizeValue(xs.Population, this.PopulationMin, this.PopulationMax)],
            [this.normalizeValue(xs.RDPI, this.RDPIMin, this.RDPIMax)],
            [this.normalizeValue(xs.Employment, this.EmploymentMin, this.EmploymentMax)]
        ];
        return { xs: values, ys: this.normalizeValue(ys.Price, this.PriceMin, this.PriceMax) };
    }

    getTrainingData() {
        return this.trainingData;
    }

    getValidationData() {
        return this.validationData;
    }

    getOrigianlPrices = async () => {
        let prices;
        await this.csvData.map((val: any) => {
            const { xs, ys } = val;
            return { xs: xs.Population, ys: ys.Price }
        }).batch(15).forEachAsync(i => {
            const { xs, ys } = i;
            (ys as tf.Tensor).array().then(val => {
                prices = val;
            });
        })
        return prices;
    }

    getOrigianlValues = async () => {
        let values = [];
        await this.csvData.map((val: any) => {
            const { xs, ys } = val;
            return { xs: [xs.Population, xs.RDPI, xs.Employment], ys: ys.Price }
        }).batch(15).forEachAsync(i => {
            const { xs, ys } = i;
            (xs as tf.Tensor).array().then(val => {
                values.push(val);
            });
        })
        return values;
    }
}