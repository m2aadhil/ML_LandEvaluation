import { Request, Response } from "express";
import { DBManager } from "../database/database.manager";
import { StateValues } from "../database/models/db.statevalues";
import { DBService } from "../services/database.service";

export const testDBConnection = async (req: Request, res: Response) => {
    let dbManager: DBManager = new DBManager();

    await dbManager.connect('land_evaluation');
    let doc = new StateValues();
    doc.US_AK = "1000";
    await dbManager.updateDocument('db.statevalues', { Year: "2008" }, doc);
    res.json({ res: "success" });
}

export const getAllStateValues = async (req: Request, res: Response) => {
    let dbService: DBService = new DBService();

    let result = await dbService.getStateValuesAll()
    console.log(result);
    res.json(result.sort((x, y) => { return x.Year - y.Year }));
}