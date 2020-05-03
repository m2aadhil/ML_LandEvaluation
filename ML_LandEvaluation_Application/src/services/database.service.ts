import { DBManager } from "../database/database.manager";
import { StateValues } from "../database/models/db.statevalues";
import { CountyValues } from "../database/models/dn.countyvalues";
import { CountyCodeMapCA } from "../data/models/county-map-ca";
const csv = require('csvtojson');

export class DBService {

    addDatatoDB = async (file) => {
        let dbManager: DBManager = new DBManager();
        await dbManager.connect('land_evaluation');

        for (let i = 0; i < file.length; i++) {
            let value: string = file[i]['County|Code'];
            await dbManager.insertDocument('db.citycodes', { State: 'CA', County: value.split('|')[0], CityCode: value.split('|')[1], CityName: '' })
        }

        await dbManager.closeConnection();
    }

    addStateValues = async (stateCode: string, values: any[]) => {
        let dbManager: DBManager = new DBManager();

        console.log(await dbManager.connect('land_evaluation'));
        let doc = new StateValues();
        doc[stateCode] = values[1];
        await dbManager.updateDocument('db.statevalues', { Year: (2019).toString() }, doc);
        doc[stateCode] = values[2];
        await dbManager.updateDocument('db.statevalues', { Year: (2020).toString() }, doc);
        doc[stateCode] = values[3];
        await dbManager.updateDocument('db.statevalues', { Year: (2021).toString() }, doc);
        await dbManager.closeConnection();
        return await true;

    }

    addCountyValues = async (countyCode: string, values: any[]) => {
        let dbManager: DBManager = new DBManager();

        console.log(await dbManager.connect('land_evaluation'));
        let doc = new CountyValues();
        doc[countyCode] = values[1];
        await dbManager.updateDocument('db.countyvalues', { Year: (2019).toString() }, doc);
        doc[countyCode] = values[2];
        await dbManager.updateDocument('db.countyvalues', { Year: (2020).toString() }, doc);
        doc[countyCode] = values[3];
        await dbManager.updateDocument('db.countyvalues', { Year: (2021).toString() }, doc);
        await dbManager.closeConnection();
        this.addCityValues(countyCode, values);
        return await true;

    }

    addCityValues = async (countyCode: string, values: any[]) => {
        let county: string = CountyCodeMapCA.find(i => i.code == countyCode).name;
        let name = county.slice(0, county.length - 7);
        let cities = [];
        let dbManager: DBManager = new DBManager();
        await dbManager.connect('land_evaluation');
        await Promise.resolve(await this.getCityCodes()).then(res => {
            cities = res.filter(i => i.County == name);
        });

        for (let i = 0; i < cities.length; i++) {
            if (cities[i].MedianSoldPrice['2018']) {
                let value1: number = cities[i].MedianSoldPrice['2018'] * (values[1] - values[0]) / values[0];
                let step1 = cities[i].MedianSoldPrice['2018'] + value1;
                cities[i].MedianSoldPrice['2019'] = step1;

                let value2: number = step1 * (values[2] - values[1]) / values[1];
                let step2 = step1 + value2;
                cities[i].MedianSoldPrice['2020'] = step2;

                let value3: number = step2 * (values[3] - values[2]) / values[2];
                let step3 = step2 + value3;
                cities[i].MedianSoldPrice['2021'] = step3;

                await dbManager.updateDocument('db.citycodes', { CityCode: cities[i].CityCode }, { MedianSoldPrice: cities[i].MedianSoldPrice });

            }

        }
        await dbManager.closeConnection();
        console.log("updated -- citites");
    }

    getStateValuesAll = async () => {
        let dbManager: DBManager = new DBManager();
        await dbManager.connect('land_evaluation');
        return await dbManager.getAllDocuments('db.statevalues');
    }

    getCountyValuesAll = async () => {
        let dbManager: DBManager = new DBManager();
        await dbManager.connect('land_evaluation');
        return await dbManager.getAllDocuments('db.countyvalues');
    }

    getCityCodes = async () => {
        let dbManager: DBManager = new DBManager();
        await dbManager.connect('land_evaluation');
        return await dbManager.getDocuments('db.citycodes', { CityName: { $not: { $eq: '' } } })
    }

}