import { Request, Response } from "express";
import { MLService } from "../services/ml.service";
const tenserflow = require('../services/tenserflow.service');

export const getInit = (req: Request, res: Response) => {
    res.json({ res: true });
}

export const train = async (req: Request, res: Response) => {
    console.log(req.params);
    let location
    let mlService: MLService = new MLService();

    let price = await mlService.executeTrainin(req.params.location, Number(req.params.epochs));
    let values = await mlService.getOrigianlPrices();
    let step1 = await mlService.predictStep();
    let step2 = await mlService.predictStep();
    res.json({ values: values, 2018: price, 2019: step1, 2020: step2 });
}
