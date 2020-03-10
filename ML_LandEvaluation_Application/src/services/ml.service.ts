import { TensorData } from "../data/tensors.data";
import { LSTMModel } from "../models/LSTMModel";

export class MLService {


    private tensors: TensorData;
    private mlModel: LSTMModel;

    executeTrainin = async (location: string, epochs: number, type: string) => {
        this.tensors = new TensorData(location, type);

        await this.tensors.loadCSV(type);
        await this.tensors.loadData(type);

        let trainingData = this.tensors.getTrainingData();
        let validationData = this.tensors.getValidationData();

        let learningRate = 4e-5;
        this.mlModel = new LSTMModel();
        await this.mlModel.createModel(this.tensors.featureCount, learningRate);
        await this.mlModel.trainModel(trainingData, epochs);
        let price = await this.mlModel.predictPrice(validationData);
        if (type == "state") {
            price = this.tensors.deNormalizeValue(Number(price), this.tensors.stateMinMax.PriceMin, this.tensors.stateMinMax.PriceMax);
        } else {
            price = this.tensors.deNormalizeValue(Number(price), this.tensors.countyMinMax.PriceMin, this.tensors.countyMinMax.PriceMax);
        }
        this.mlModel.feedData(await this.tensors.getOrigianlValues(type), type);
        //this.mlModel.predictPriceStep(await this.tensors.getOrigianlValues(), 1);
        return price;
    }

    predictStep = async (type: string) => {
        let price;
        let response;
        switch (type) {
            case ("state"): {
                price = await this.mlModel.predictNextStepState(this.tensors);
                response = await this.tensors.deNormalizeValue(Number(price), this.tensors.stateMinMax.PriceMin, this.tensors.stateMinMax.PriceMax);
            }; break;
            case ("county"): {
                price = await this.mlModel.predictNextStepCounty(this.tensors);
                response = await this.tensors.deNormalizeValue(Number(price), this.tensors.countyMinMax.PriceMin, this.tensors.countyMinMax.PriceMax);
            }; break;
        }
        return response;
    }

    getOrigianlPrices = async () => {
        return await this.tensors.getOrigianlPrices();
    }

}