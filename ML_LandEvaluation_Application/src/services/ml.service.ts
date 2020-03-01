import { DataSets } from "../data/data";
import { trainingData } from "./tenserflow.service";
import * as tf from '@tensorflow/tfjs';
import { TensorData } from "../data/tensors.data";
import { LSTMModel } from "../models/LSTMModel";

export class MLService {


    private tensors: TensorData;
    private mlModel: LSTMModel;

    executeTrainin = async (location: string, epochs: number) => {
        this.tensors = new TensorData(location);
        await this.tensors.loadCSV();
        await this.tensors.loadData();
        let trainingData = this.tensors.getTrainingData();
        let validationData = this.tensors.getValidationData();

        let learningRate = 4e-5;
        this.mlModel = new LSTMModel();
        await this.mlModel.createModel(this.tensors.featureCount, learningRate);
        await this.mlModel.trainModel(trainingData, epochs);
        let price = await this.mlModel.predictPrice(validationData);
        price = this.tensors.deNormalizeValue(Number(price), this.tensors.PriceMin, this.tensors.PriceMax);
        this.mlModel.feedData(await this.tensors.getOrigianlValues());
        //this.mlModel.predictPriceStep(await this.tensors.getOrigianlValues(), 1);
        return price;
    }

    predictStep = async () => {
        let price = await this.mlModel.predictNextStep(this.tensors);
        return await this.tensors.deNormalizeValue(Number(price), this.tensors.PriceMin, this.tensors.PriceMax);
    }

    getOrigianlPrices = async () => {
        return await this.tensors.getOrigianlPrices();
    }

}