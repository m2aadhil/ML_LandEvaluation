import * as tf from '@tensorflow/tfjs-node'

const LOCAL_STATE_DATA_CSV_PATH = './datasets/arizona.csv';

export class LandDataSet {


    yearCol: any;
    async loadData() {
        let dataSet;
        try {
            dataSet = await fetch(LOCAL_STATE_DATA_CSV_PATH);
        } catch (err) {

        }

        if (dataSet != null && (dataSet.statusCode === 200 || dataSet.statusCode === 304)) {
            console.log('Loading data set from local file path');
        }

        const csvLandData = await dataSet.text();
        //parse lines
        const dataLines = csvLandData.split('\n');

        //parse header.
        const columnNames = dataLines[0].split(',');
        for (let i = 0; i < columnNames.length; ++i) {
            columnNames[i] = columnNames[i].slice(1, columnNames[i].length - 1);
        }

        this.yearCol = columnNames.indexOf('Year');
        tf.util.assert(this.yearCol === 0, Unexpected date - time column index');

    }
}