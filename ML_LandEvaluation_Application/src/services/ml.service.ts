import { DataSets } from "../data/data";
import { trainingData } from "./tenserflow.service";
import * as tf from '@tensorflow/tfjs';
import { RNNModel } from "../models/RNNModel";

let model: RNNModel;

export const run = async () => {
    let dataSet = new DataSets('arizona');
    let data = await dataSet.getTrainingData();
    model = new RNNModel();
    let ml = model.rnnModel(data);

}

let callBack = function (epoch, log, model_params) {

}