import { Request, Response } from "express";
import { DBService } from "../services/database.service";

//Get State Trained Data for Heat Map
export const getAllStateValues = async (req: Request, res: Response) => {
    let dbService: DBService = new DBService();

    let result = await dbService.getStateValuesAll()
    console.log(result);
    res.json(result.sort((x, y) => { return x.Year - y.Year }));
}

//Get County Trained Data for Heat Map
export const getAllCountyValues = async (req: Request, res: Response) => {
    let dbService: DBService = new DBService();

    let result = await dbService.getCountyValuesAll();
    console.log(result);
    res.json(result.sort((x, y) => { return x.Year - y.Year }));
}