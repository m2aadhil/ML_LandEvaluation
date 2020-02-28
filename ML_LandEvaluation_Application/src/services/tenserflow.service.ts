import * as tf from '@tensorflow/tfjs';

const DATA_PATH = "file://C://Users/MusthaqAa/source/repos/ML_LandEvaluation/ML_LandEvaluation_Application/datasets/arizona_data.csv";


const normalizeData = (value, min, max) => {
    // min = min ? min : 0;
    // max = max ? max : 1;

    return (value - min) / (max - min);
}

const csvTransform = (val: any) => {
    const { xs, ys } = val
    const values = [
        [normalizeData(xs.Population, 6000000, 7000000)],
        [normalizeData(xs.RDPI, 30000, 40000)],
        [normalizeData(xs.Employment, 3000000, 36000000)]
    ];
    return { xs: values, ys: ys.Price };
}

var nFeatures;
var x = []; var y = [];
export const trainingData = async () => {
    const data = await tf.data.csv(DATA_PATH, { columnConfigs: { Price: { isLabel: true } } });
    //data.forEach(x => console.log(x));
    nFeatures = (await data.columnNames()).length - 1;

    const converted = await data.map((r: any) => {
        const { xs, ys } = r;
        return { xs: [[xs.Population], [xs.RDPI], [xs.Employment]], ys: ys.Price };
    }).batch(10);
    //const converted = await data.map(csvTransform).shuffle(5).batch(10);
    return converted;
    // return tf.data.csv(DATA_PATH, { columnConfigs: { Price: { isLabel: true } } }).map(csvTransform)
    //     .shuffle(8).batch(10);
}

export const createModel = async () => {
    const model = tf.sequential();
    const data = await trainingData();
    const learningRate = 4e-3;
    model.add(tf.layers.lstm({
        inputShape: [3, 1],
        units: 10
    }));
    //model.weights.forEach(x => console.log(x));
    model.add(tf.layers.dense({
        units: 1
    }));
    //tf.train.rmsprop(learningRate)
    model.compile({
        optimizer: tf.train.rmsprop(learningRate),
        loss: 'meanSquaredError'
    });

    await model.fitDataset(data, { epochs: 5 });

    data.take(1).forEachAsync((i: any) => {
        const { xs, ys } = i;
        (xs as tf.Tensor).print();
        (ys as tf.Tensor).print();
        (model.predict(xs) as tf.Tensor).print();
    })

}

export const createModelTest = async () => {
    var data = tf.tensor([
        [[100], [86], [105], [122], [118], [96], [107], [118], [100], [85]],
        [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]],
        [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]],
        [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]],
        [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]],
        [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]],
        [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]],
        [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]]
    ]);

    var y = tf.tensor([[100], [90], [90], [90], [90], [90], [90], [90]]);
    //var mod = {x: data, y:y};
    const model = tf.sequential();
    const learningRate = 4e-3;
    model.add(
        tf.layers.lstm({
            units: 1,
            inputShape: [10, 1]
        })
    );
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    model.compile({ loss: "meanSquaredError", optimizer: tf.train.rmsprop(learningRate) });

    model.fit(data, y, { epochs: 1000 }).then(() => {
        // Use the model to do inference on a data point the model hasnt 
        // seen before:
        console.log(model.predict(
            tf.tensor([
                [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]]
            ])
        ).toString());
    });
}


const getMultivariateDate = (dataset, target, start_index, end_index, history_size,
    target_size, step, single_step) => {

    let data = [];
    let labels = [];

    start_index = start_index + history_size;

    if (!end_index) {
        end_index = dataset.length - target_size;
    }

    for (let i = start_index; i < end_index; i++) {
        for (let j = i - history_size; j < i; j += step) {
            data.push(dataset[j]);
        }

        labels.push(target[i + target_size]);
    }

    return { data: data, labels: labels };
}

const csvUrl = 'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';

export const run = async () => {
    // We want to predict the column "medv", which represents a median value of a
    // home (in $1000s), so we mark it as a label.
    const csvDataset = tf.data.csv(
        csvUrl, {
        columnConfigs: {
            medv: {
                isLabel: true
            }
        }
    });
    // Number of features is the number of column names minus one for the label
    // column.
    const numOfFeatures = (await csvDataset.columnNames()).length - 1;

    // Prepare the Dataset for training.
    const flattenedDataset =
        csvDataset
            .map((val: any) => {
                const { xs, ys } = val
                // Convert xs(features) and ys(labels) from object form (keyed by column
                // name) to array form.
                return { xs: Object.values(xs), ys: Object.values(ys) };
            })
            .batch(10);

    // Define the model.
    const model = tf.sequential();
    model.add(tf.layers.dense({
        inputShape: [numOfFeatures],
        units: 1
    }));
    model.compile({
        optimizer: tf.train.sgd(0.000001),
        loss: 'meanSquaredError'
    });

    // Fit the model using the prepared Dataset
    return model.fitDataset(flattenedDataset, {
        epochs: 10,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
                console.log(epoch, logs.loss);
            }
        }
    });
}
