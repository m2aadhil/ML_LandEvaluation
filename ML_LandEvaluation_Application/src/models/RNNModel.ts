import * as tf from '@tensorflow/tfjs';

export class RNNModel {

    private model;
    constructor() {
        this.model = tf.sequential();
    }

    trainModel = async (source, target, callBack: (epoch, log) => any) => {

        let n_epochs = 10;
        let learning_rate = 0.000001;
        let n_layers = 2;

        const input_layer_shape = 8;
        const input_layer_neurons = 6;

        const rnn_input_layer_features = 3;
        const rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features;

        const rnn_input_shape = [rnn_input_layer_features, rnn_input_layer_timesteps];
        const rnn_output_neurons = 4;

        const rnn_batch_size = 8;

        const output_layer_shape = rnn_output_neurons;
        const output_layer_neurons = 1;

        let X = source.slice(0, 8).map(x => x[0]);
        let Y = target.slice(0, 8);

        const xs = tf.tensor2d(X, [X.length, X[0].length]).div(tf.scalar(10));
        const ys = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1]).div(tf.scalar(10));



        this.model.add(tf.layers.dense({ units: input_layer_neurons, inputShape: [input_layer_shape] }));
        this.model.add(tf.layers.reshape({ targetShape: rnn_input_shape }));

        let lstm_cells = [];
        for (let index = 0; index < n_layers; index++) {
            lstm_cells.push(tf.layers.lstmCell({ units: rnn_output_neurons }));
        }

        this.model.add(tf.layers.rnn({
            cell: lstm_cells,
            inputShape: rnn_input_shape,
            returnSequences: false
        }));

        this.model.add(tf.layers.dense({ units: output_layer_neurons, inputShape: [output_layer_shape] }));

        this.model.compile({
            optimizer: tf.train.adam(learning_rate),
            loss: 'meanSquaredError'
        });

        const hist = await this.model.fit(xs, ys,
            {
                batchSize: rnn_batch_size, epochs: n_epochs, callbacks: {
                    onEpochEnd: async (epoch, log) => {
                        callBack(epoch, log);
                    }
                }
            });

        return { model: this.model, stats: hist };

    }

    trainModelTest = async (source, target, callBack: (epoch, log) => any) => {
        const inputs = source.map(d => d[0]);
        const labels = target;

        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));


        // Add a single hidden layer
        this.model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
        // Add an output layer
        this.model.add(tf.layers.dense({ units: 1, useBias: true }));
        // Prepare the model for training.  
        this.model.compile({
            optimizer: tf.train.adam(),
            loss: tf.losses.meanSquaredError,
            metrics: ['mse'],
        });

        const batchSize = 8;
        const epochs = 50;

        return await this.model.fit(normalizedInputs, normalizedLabels, {
            batchSize,
            epochs,
            shuffle: true
        });
    }

    rnnModel = async (data) => {

        const inputShape = [8, 3];

        const rnnUnits = 32;

        this.model.add(tf.layers.simpleRNN({
            units: rnnUnits,
            inputShape
        }));
        this.model.add(tf.layers.dense({ units: 1 }));

        this.model.compile({ loss: 'meanAbsoluteError', optimizer: 'rmsprop' });
        this.model.summary();

        const batchSize = 8;
        const epochs = 50;

        return await this.model.fitDataset(data, { epochs: 5 });
    }
}