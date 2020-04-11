import { DBManager } from "../database/database.manager";
import { StateValues } from "../database/models/db.statevalues";

export class DBService {

    constructor() { }

    addStateValues = async (stateCode: string, values: any[]) => {
        let dbManager: DBManager = new DBManager();

        console.log(await dbManager.connect('land_evaluation'));
        let doc = new StateValues();
        doc[stateCode] = values[0];
        await dbManager.updateDocument('db.statevalues', { Year: (2008).toString() }, doc);
        console.log(1);
        doc[stateCode] = values[1];
        await dbManager.updateDocument('db.statevalues', { Year: (2009).toString() }, doc);
        console.log(2);
        doc[stateCode] = values[2];
        await dbManager.updateDocument('db.statevalues', { Year: (2010).toString() }, doc);
        console.log(3);
        doc[stateCode] = values[3];
        await dbManager.updateDocument('db.statevalues', { Year: (2011).toString() }, doc);
        console.log(4);
        doc[stateCode] = values[4];
        await dbManager.updateDocument('db.statevalues', { Year: (2012).toString() }, doc);
        console.log(5);
        doc[stateCode] = values[5];
        await dbManager.updateDocument('db.statevalues', { Year: (2013).toString() }, doc);
        console.log(6);
        doc[stateCode] = values[6];
        await dbManager.updateDocument('db.statevalues', { Year: (2014).toString() }, doc);
        console.log(7);
        doc[stateCode] = values[7];
        await dbManager.updateDocument('db.statevalues', { Year: (2015).toString() }, doc);
        console.log(8);
        doc[stateCode] = values[8];
        await dbManager.updateDocument('db.statevalues', { Year: (2016).toString() }, doc);
        console.log(9);
        doc[stateCode] = values[9];
        await dbManager.updateDocument('db.statevalues', { Year: (2017).toString() }, doc);
        console.log(10);
        doc[stateCode] = values[10];
        await dbManager.updateDocument('db.statevalues', { Year: (2018).toString() }, doc);
        console.log(11);
        doc[stateCode] = values[11];
        await dbManager.updateDocument('db.statevalues', { Year: (2019).toString() }, doc);
        console.log(12);
        await dbManager.closeConnection();
        return await true;

    }

}