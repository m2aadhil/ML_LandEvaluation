import * as tf from '@tensorflow/tfjs';
const LOCAL_LAND_DATA_CSV_PATH = './assets/datasets/arizona.csv';
const DATA_PATH = "file://C://Users/MusthaqAa/source/repos/ML_LandEvaluation/ML_LandEvaluation_Application/datasets/arizona_data.csv";

export class DataSets {

    private filePath: string;
    private indexCol: number;

    public data: any[] = [];
    public normalizedData: any[] = [];

    public target: any[] = [];
    public normalizedTarget: any[] = [];

    private yearColIndex: number;
    private targetColIndex: number;

    private indexColumns: string[] = [];
    private dataColumnNames: string[] = [];

    private numRows: number;
    private numCols: number;
    private numOfFeatures: number;

    constructor(fileName: string) {
        //arizona
        this.filePath = LOCAL_LAND_DATA_CSV_PATH + fileName + '.csv';
    }

    loadData = async () => {
        let response;
        console.log('Loading data...');
        try {
            response = await fetch(LOCAL_LAND_DATA_CSV_PATH);

            console.log(response)
            const csvData = await response.text();

            // Parse CSV file.
            const csvLines = csvData.split('\r\n');

            // Parse header.
            const columnNames = csvLines[0].split(',');
            for (let i = 0; i < columnNames.length; ++i) {
                columnNames[i] = columnNames[i].slice(0, columnNames[i].length);
            }

            console.log(columnNames);
            this.yearColIndex = columnNames.indexOf('Year');
            if (this.yearColIndex === 0) {
                console.error(`Unexpected year column index`);
            }
            //tf.util.assert(, `Unexpected year column index`);

            this.dataColumnNames = columnNames.slice(2);

            this.targetColIndex = this.dataColumnNames.indexOf('Price');
            //console.log(this.priceCol)
            if (this.targetColIndex >= 1) {
                console.error('Unexpected Price column index');
            }
            // tf.util.assert(, 'Unexpected Price column index' as (() =>string));

            this.data = [];  // Unnormalized data.

            for (let i = 1; i < csvLines.length; ++i) {
                const line = csvLines[i].trim();
                if (line.length === 0) {
                    continue;
                }
                const items = line.split(',');
                this.indexColumns.push(items[0]);
                this.target.push(items.slice(0, 1).map(x => +x))
                this.data.push(items.slice(2).map(x => +x));
            }
            console.log(this.target)
            this.numRows = this.data.length;
            this.numCols = this.data[0].length;
            this.numOfFeatures = this.data[0].length;
            console.log(
                `this.numOfFeatures = ${this.numOfFeatures}`);

            await this.calculateMeansNStddevs_();
        } catch (err) {
            console.log(err)
        }

    }

    private means;
    private stddevs;

    async calculateMeansNStddevs_() {
        tf.tidy(() => {
            this.means = [];
            this.stddevs = [];
            for (const columnName of this.dataColumnNames) {
                // TODO
                const data =
                    tf.tensor1d(this.getColumnData(columnName, false).slice(0, this.numRows));
                const moments = tf.moments(data);
                this.means.push(moments.mean.dataSync());
                this.stddevs.push(Math.sqrt(Number(moments.variance.dataSync())));
            }
            console.log('means:', this.means);
            console.log('stddevs:', this.stddevs);
        });

        this.normalizedData = [];
        for (let i = 0; i < this.numRows; ++i) {
            const row = [];
            for (let j = 0; j < this.numCols; ++j) {
                row.push((this.data[i][j] - this.means[j]) / this.stddevs[j]);
            }
            this.normalizedData.push(row);
        }
    }

    getCleanedSource() {
        let cleaned = this.data.map(i => i[0]).filter(x => x[0] != null)
    }

    getColumnData(columnName: string, normalize: boolean) {
        const columnIndex = this.dataColumnNames.indexOf(columnName);
        //tf.util.assert(columnIndex >= 0, `Invalid column name: ${columnName}`);
        if (columnIndex <= 0) {
            console.log(`Invalid column name: ${columnName}`);
        }

        let beginIndex = 0;
        let length = this.numRows - beginIndex;
        let stride = 1;
        const out = [];
        for (let i = beginIndex; i < beginIndex + length && i < this.numRows;
            i += stride) {
            let value = normalize ? this.normalizedData[i][columnIndex] :
                this.data[i][columnIndex];
            out.push(value);
        }
        return out;
    }

    getDataColumnNames() {
        return this.dataColumnNames;
    }

    getYear(index) {
        return this.yearColIndex[index];
    }

    getMeanNStddev(dataColumn) {
        if (this.means == null || this.stddevs == null) {
            throw new Error('Means and stddevs have not calculated yet.');
        }

        const index = this.getDataColumnNames().indexOf(dataColumn);
        if (index === -1) {
            throw new Error(`Invalid data column : ${dataColumn}`);
        }
        return {
            mean: this.means[index], stddev: this.stddevs[index]
        }
    }

    getTensors() {
        return tf.tidy(() => {
            tf.util.shuffle(this.data);

            // Convert to Tensor
            const inputs = this.data.slice(0, 10).map(x => x.map(y => [y]));
            //console.log(inputs)
            const labels = this.target.slice(0, 10).map(x => x);

            const inputT = tf.tensor(inputs);
            const labelT = tf.tensor(labels);

            //Normalize the data to the range 0 - 1
            const inputMax = inputT.max();
            const inputMin = inputT.min();
            const labelMax = labelT.max();
            const labelMin = labelT.min();

            const nInputs = inputT.sub(inputMin).div(inputMax.sub(inputMin));
            const nLabels = labelT.sub(labelMin).div(labelMax.sub(labelMin));

            return {
                inputs: nInputs,
                labels: nLabels,
                inputMax,
                inputMin,
                labelMax,
                labelMin,
            }
        });
    }


    csvTransform = (val: any) => {
        const { xs, ys } = val
        const values = [
            xs.Population,
            xs.RDPI,
            xs.Employment
        ];
        return { xs: values, ys: ys.Price };
    }

    getTrainingData = async () => {
        const data = await tf.data.csv(DATA_PATH, { columnConfigs: { Price: { isLabel: true } } });
        const converted = await data.map(this.csvTransform).batch(10);
        return converted;
    }
}