
import * as tf from '@tensorflow/tfjs'; import { async } from '@angular/core/testing';
export class MachineLearningModel {


    public model;

    constructor() {
        this.model = tf.sequential();
        // hidden layer
        this.model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
        // output layer
        this.model.add(tf.layers.dense({ units: 1, useBias: true }));
    }

    trainModel = async (inputs, labels) => {

        // Prepare the model for training.  
        this.model.compile({
            optimizer: tf.train.adam(),
            loss: tf.losses.meanSquaredError,
            metrics: ['mse'],
        });
        return await this.model.fit(inputs, labels, {
            epochs: 20
        });
    }

    testModel = async (normalizationData) => {

        const { inputMax, inputMin, labelMin, labelMax } = normalizationData;


        const [xs, preds] = tf.tidy(() => {

            const xs = tf.linspace(0, 1, 10);
            const preds = this.model.predict(xs.reshape([10, 1]));

            const unNormXs = xs
                .mul(inputMax.sub(inputMin))
                .add(inputMin);

            const unNormPreds = preds
                .mul(labelMax.sub(labelMin))
                .add(labelMin);

            // Un-normalize the data
            return [unNormXs.dataSync(), unNormPreds.dataSync()];
        });


        const predictedPoints = Array.from(xs).map((val, i) => {
            return { x: val, y: preds[i] }
        });

        // const originalPoints = inputData.map(d => ({
        //   x: d.horsepower, y: d.mpg,
        // }));

        console.log(predictedPoints);
        // tfvis.render.scatterplot(
        //   {name: 'Model Predictions vs Original Data'}, 
        //   {values: [originalPoints, predictedPoints], series: ['original', 'predicted']}, 
        //   {
        //     xLabel: 'Horsepower',
        //     yLabel: 'MPG',
        //     height: 300
        //   }
        // );
    }
}