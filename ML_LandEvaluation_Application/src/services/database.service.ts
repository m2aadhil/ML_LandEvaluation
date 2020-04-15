import { DBManager } from "../database/database.manager";
import { StateValues } from "../database/models/db.statevalues";
import { CountyValues } from "../database/models/dn.countyvalues";

export class DBService {

    constructor() { }

    addStateValues = async (stateCode: string, values: any[]) => {
        let dbManager: DBManager = new DBManager();

        console.log(await dbManager.connect('land_evaluation'));
        let doc = new StateValues();
        doc[stateCode] = values[0];
        await dbManager.updateDocument('db.statevalues', { Year: (2008).toString() }, doc);;
        doc[stateCode] = values[1];
        await dbManager.updateDocument('db.statevalues', { Year: (2009).toString() }, doc);
        doc[stateCode] = values[2];
        await dbManager.updateDocument('db.statevalues', { Year: (2010).toString() }, doc);
        doc[stateCode] = values[3];
        await dbManager.updateDocument('db.statevalues', { Year: (2011).toString() }, doc);
        doc[stateCode] = values[4];
        await dbManager.updateDocument('db.statevalues', { Year: (2012).toString() }, doc);
        doc[stateCode] = values[5];
        await dbManager.updateDocument('db.statevalues', { Year: (2013).toString() }, doc);
        doc[stateCode] = values[6];
        await dbManager.updateDocument('db.statevalues', { Year: (2014).toString() }, doc);
        doc[stateCode] = values[7];
        await dbManager.updateDocument('db.statevalues', { Year: (2015).toString() }, doc);
        doc[stateCode] = values[8];
        await dbManager.updateDocument('db.statevalues', { Year: (2016).toString() }, doc);
        doc[stateCode] = values[9];
        await dbManager.updateDocument('db.statevalues', { Year: (2017).toString() }, doc);
        doc[stateCode] = values[10];
        await dbManager.updateDocument('db.statevalues', { Year: (2018).toString() }, doc);
        doc[stateCode] = values[11];
        await dbManager.updateDocument('db.statevalues', { Year: (2019).toString() }, doc);
        doc[stateCode] = values[12];
        await dbManager.updateDocument('db.statevalues', { Year: (2020).toString() }, doc);
        await dbManager.closeConnection();
        return await true;

    }

    addCountyValues = async (countyCode: string, values: any[]) => {
        let dbManager: DBManager = new DBManager();

        console.log(await dbManager.connect('land_evaluation'));
        let doc = new CountyValues();
        doc[countyCode] = values[0];
        await dbManager.updateDocument('db.countyvalues', { Year: (2008).toString() }, doc);;
        doc[countyCode] = values[1];
        await dbManager.updateDocument('db.countyvalues', { Year: (2009).toString() }, doc);
        doc[countyCode] = values[2];
        await dbManager.updateDocument('db.countyvalues', { Year: (2010).toString() }, doc);
        doc[countyCode] = values[3];
        await dbManager.updateDocument('db.countyvalues', { Year: (2011).toString() }, doc);
        doc[countyCode] = values[4];
        await dbManager.updateDocument('db.countyvalues', { Year: (2012).toString() }, doc);
        doc[countyCode] = values[5];
        await dbManager.updateDocument('db.countyvalues', { Year: (2013).toString() }, doc);
        doc[countyCode] = values[6];
        await dbManager.updateDocument('db.countyvalues', { Year: (2014).toString() }, doc);
        doc[countyCode] = values[7];
        await dbManager.updateDocument('db.countyvalues', { Year: (2015).toString() }, doc);
        doc[countyCode] = values[8];
        await dbManager.updateDocument('db.countyvalues', { Year: (2016).toString() }, doc);
        doc[countyCode] = values[9];
        await dbManager.updateDocument('db.countyvalues', { Year: (2017).toString() }, doc);
        doc[countyCode] = values[10];
        await dbManager.updateDocument('db.countyvalues', { Year: (2018).toString() }, doc);
        doc[countyCode] = values[11];
        await dbManager.updateDocument('db.countyvalues', { Year: (2019).toString() }, doc);
        doc[countyCode] = values[12];
        await dbManager.updateDocument('db.countyvalues', { Year: (2020).toString() }, doc);
        await dbManager.closeConnection();
        return await true;

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

}