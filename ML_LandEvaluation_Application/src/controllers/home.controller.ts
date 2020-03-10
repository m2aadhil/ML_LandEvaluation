import { Request, Response } from "express";
import { MLService } from "../services/ml.service";

export const getInit = (req: Request, res: Response) => {
    res.json({ res: true });
}

export const train = async (req: Request, res: Response) => {
    console.log(req.params);
    let location
    let mlService: MLService = new MLService();

    let price = await mlService.executeTrainin(req.params.location, Number(req.params.epochs), req.params.type);
    let values = await mlService.getOrigianlPrices();
    let step1 = await mlService.predictStep(req.params.type);
    let step2 = await mlService.predictStep(req.params.type);
    res.json({ values: values, valid: price, step1: step1, step2: step2 });
}
