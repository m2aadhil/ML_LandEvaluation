import { Request, Response } from "express";
import { MLService } from "../services/ml.service";
import { DBService } from "../services/database.service";

export const getInit = (req: Request, res: Response) => {
    res.json({ res: true });
}

export const train = async (req: Request, res: Response) => {
    console.log(req.params);
    let mlService: MLService = new MLService();
    let dbService: DBService = new DBService();
    let price = await mlService.executeTrainin(req.params.location, Number(req.params.epochs), req.params.type);
    let values: any[] = await mlService.getOrigianlPrices();
    let step1 = await mlService.predictStep(req.params.type);
    let step2 = await mlService.predictStep(req.params.type);
    values.push(step1); values.push(step2);
    await dbService.addStateValues(req.params.location, values)
    res.json({ values: values, valid: price, step1: step1, step2: step2 });
}

export const trainStates = () => {
    let mlService: MLService = new MLService();
    mlService.trainAllStates();
}


