import * as tf from '@tensorflow/tfjs';
import { StateMinMax } from './models/state.min-max.model';
import { CountyMinMax } from './models/county.min-max.model';

//const DATA_PATH = "file://C://Users/MusthaqAa/source/repos/ML_LandEvaluation/ML_LandEvaluation_Application/datasets/arizona_data.csv";
const DATA_PATH = "file://C://Users/MusthaqAa/source/repos/ML_LandEvaluation/ML_LandEvaluation_Application/datasets/";

export class TensorData {

    public featureCount: number;
    private csvData;
    private trainingData;
    private validationData;
    private filePath: string;

    stateMinMax: StateMinMax = new StateMinMax();
    countyMinMax: CountyMinMax = new CountyMinMax();

    constructor(location: string, type: string) {
        this.filePath = DATA_PATH + type + '/' + location + '.csv';
    }

    loadCSV = async (type: string) => {
        this.csvData = await tf.data.csv(this.filePath, { columnConfigs: { Price: { isLabel: true } } });
        await this.mapMaxData(type);
    }

    loadData = async (type: string) => {
        let data;
        switch (type) {
            case ("state"): {
                this.featureCount = 3;
                data = await this.csvData.map(this.csvTransformStates);
            }; break;
            case ("county"): {
                this.featureCount = 4;
                data = await this.csvData.map(this.csvTransformCounties);
            }; break;
        }

        this.trainingData = await data.batch(10);
        this.validationData = await data.skip(10).batch(1);
    }

    mapMaxData = async (type: string) => {
        switch (type) {
            case ("state"): {
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
                        console.log(v[0]);
                        this.stateMinMax.PopulationMin = val[0];
                        this.stateMinMax.PopulationMax = val[1];
                        this.stateMinMax.RDPIMin = val[2];
                        this.stateMinMax.RDPIMax = val[3];
                        this.stateMinMax.EmploymentMin = val[4];
                        this.stateMinMax.EmploymentMax = val[5];
                    });
                    (ys as tf.Tensor).array().then(val => {
                        console.log(val[0][0]);

                        this.stateMinMax.PriceMin = val[0][0];
                        this.stateMinMax.PriceMax = val[0][1];
                    });
                })
            }; break;
            case ("county"): {
                let maxData = await this.csvData.map((i: any) => {
                    const { xs, ys } = i;
                    return {
                        xs: [xs.CrimeIncidentsMin, xs.CrimeIncidentsMax, xs.PopulationMin, xs.PopulationMax, xs.PerCapitaPersonalIncomeMin, xs.PerCapitaPersonalIncomeMax,
                        xs.MedianHouseholdIncomeMin, xs.MedianHouseholdIncomeMax],
                        ys: [xs.PriceMin, xs.PriceMax]
                    };
                }).batch(1);
                await maxData.take(3).forEachAsync(i => {
                    const { xs, ys } = i;
                    (xs as tf.Tensor).array().then((v: any) => {
                        let val = v[0];
                        console.log(v[0]);
                        this.countyMinMax.CrimeIncidentsMin = val[0];
                        this.countyMinMax.CrimeIncidentsMax = val[1];
                        this.countyMinMax.PopulationMin = val[2];
                        this.countyMinMax.PopulationMax = val[3];
                        this.countyMinMax.PerCapitaPersonalIncomeMin = val[4];
                        this.countyMinMax.PerCapitaPersonalIncomeMax = val[5];
                        this.countyMinMax.MedianHouseholdIncomeMin = val[6];
                        this.countyMinMax.MedianHouseholdIncomeMax = val[7];
                    });
                    (ys as tf.Tensor).array().then(val => {
                        this.countyMinMax.PriceMin = val[0][0];
                        this.countyMinMax.PriceMax = val[0][1];
                    });
                })
            }; break;
        }

    }

    normalizeValue = (value, min, max) => {
        return (value - min) / (max - min);
    }

    deNormalizeValue = (value, min, max) => {
        return value * (max - min) + min;
    }

    csvTransformStates = (val: any) => {
        const { xs, ys } = val
        const values = [
            [this.normalizeValue(xs.Population, this.stateMinMax.PopulationMin, this.stateMinMax.PopulationMax)],
            [this.normalizeValue(xs.RDPI, this.stateMinMax.RDPIMin, this.stateMinMax.RDPIMax)],
            [this.normalizeValue(xs.Employment, this.stateMinMax.EmploymentMin, this.stateMinMax.EmploymentMax)]
        ];
        return { xs: values, ys: this.normalizeValue(ys.Price, this.stateMinMax.PriceMin, this.stateMinMax.PriceMax) };
    }

    csvTransformCounties = (val: any) => {
        const { xs, ys } = val
        const values = [
            [this.normalizeValue(xs.CrimeIncidents, this.countyMinMax.CrimeIncidentsMin, this.countyMinMax.CrimeIncidentsMax)],
            [this.normalizeValue(xs.Population, this.countyMinMax.PopulationMin, this.countyMinMax.PopulationMax)],
            [this.normalizeValue(xs.PerCapitaPersonalIncome, this.countyMinMax.PerCapitaPersonalIncomeMin, this.countyMinMax.PerCapitaPersonalIncomeMax)],
            [this.normalizeValue(xs.MedianHouseholdIncome, this.countyMinMax.MedianHouseholdIncomeMin, this.countyMinMax.MedianHouseholdIncomeMax)]
        ];
        return { xs: values, ys: this.normalizeValue(ys.Price, this.countyMinMax.PriceMin, this.countyMinMax.PriceMax) };
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

    getOrigianlValues = async (type) => {
        switch (type) {
            case ("state"): {
                return await this.getOrigianlValuesState();
            };
            case ("county"): {
                this.featureCount = 4;
                return await this.getOrigianlValuesCounty();
            };
        }
    }

    private getOrigianlValuesState = async () => {
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

    private getOrigianlValuesCounty = async () => {
        let values = [];
        await this.csvData.map((val: any) => {
            const { xs, ys } = val;
            return { xs: [xs.CrimeIncidents, xs.Population, xs.PerCapitaPersonalIncome, xs.MedianHouseholdIncome], ys: ys.Price }
        }).batch(15).forEachAsync(i => {
            const { xs, ys } = i;
            (xs as tf.Tensor).array().then(val => {
                values.push(val);
            });
        })
        return values;
    }
}