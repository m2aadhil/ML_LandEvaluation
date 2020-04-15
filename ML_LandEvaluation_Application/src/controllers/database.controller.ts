import { Request, Response } from "express";
import { DBManager } from "../database/database.manager";
import { StateValues } from "../database/models/db.statevalues";
import { DBService } from "../services/database.service";
import { CountyValues } from "../database/models/dn.countyvalues";

export const testDBConnection = async (req: Request, res: Response) => {
    let dbManager: DBManager = new DBManager();

    await dbManager.connect('land_evaluation');
    let doc = new StateValues();
    for (let i = 2008; i <= 2020; i++) {
        let ins: CountyValues = new CountyValues();
        ins.Year = i.toString();
        await dbManager.insertDocument('db.countyvalues', ins);

    }
    //await dbManager.updateDocument('db.statevalues', { Year: "2008" }, doc);
    res.json({ res: "success" });
}

export const getAllStateValues = async (req: Request, res: Response) => {
    let dbService: DBService = new DBService();

    let result = await dbService.getStateValuesAll()
    console.log(result);
    res.json(result.sort((x, y) => { return x.Year - y.Year }));
}

export const getAllCountyValues = async (req: Request, res: Response) => {
    let dbService: DBService = new DBService();

    let result = await dbService.getCountyValuesAll();
    console.log(result);
    res.json(result.sort((x, y) => { return x.Year - y.Year }));
}