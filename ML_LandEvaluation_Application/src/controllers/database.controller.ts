import { Request, Response } from "express";
import { DBManager } from "../database/database.manager";
import { StateValues } from "../database/models/db.statevalues";

export const testDBConnection = async (req: Request, res: Response) => {
    let dbManager: DBManager = new DBManager();

    await dbManager.connect('land_evaluation');
    let doc = new StateValues();
    doc.US_AK = "1000";
    await dbManager.updateDocument('db.statevalues', { Year: "2008" }, doc);
    res.json({ res: "success" });
}