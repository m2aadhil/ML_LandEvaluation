import * as tf from '@tensorflow/tfjs';

const DATA_PATH = "file://C://Users/MusthaqAa/source/repos/ML_LandEvaluation/ML_LandEvaluation_Application/datasets/arizona.csv";

const PopulationMax = 7171646;
const RDPIMax = 39955;
const EmploymentMax = 3859137;
const PopulationMin = 6280362;
const RDPIMin = 30844;
const EmploymentMin = 3181571;
const PriceMax = 247449.5833;
const PriceMin = 140399.6667;

const normalizeData = (value, min, max) => {
    // min = min ? min : 0;
    // max = max ? max : 1;

    return (value - min) / (max - min);
}

const deNormalizeData = (value, min, max) => {

    return value * (max - min) + min;
}

const csvTransform = (val: any) => {
    const { xs, ys } = val
    const values = [
        [normalizeData(xs.Population, PopulationMin, PopulationMax)],
        [normalizeData(xs.RDPI, RDPIMin, RDPIMax)],
        [normalizeData(xs.Employment, EmploymentMin, EmploymentMax)]
    ];
    return { xs: values, ys: normalizeData(ys.Price, PriceMin, PriceMax) };
}

var nFeatures;
var x = []; var y = [];
export const trainingData = async () => {
    const data = await tf.data.csv(DATA_PATH, { columnConfigs: { Price: { isLabel: true } } });
    //data.forEach(x => console.log(x));
    nFeatures = (await data.columnNames()).length - 1;

    const converted = await data.map(csvTransform).batch(10);
    //const converted = await data.map(csvTransform).shuffle(5).batch(10);
    return converted;
    // return tf.data.csv(DATA_PATH, { columnConfigs: { Price: { isLabel: true } } }).map(csvTransform)
    //     .shuffle(8).batch(10);
}

export const createModel = async () => {
    const model = tf.sequential();
    const data = await trainingData();
    const learningRate = 4e-5;
    model.add(tf.layers.lstm({
        inputShape: [3, 1],
        units: 100
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

    await model.fitDataset(data, { epochs: 10 });

    data.take(3).forEachAsync((i: any) => {
        const { xs, ys } = i;
        //(xs as tf.Tensor).print();
        //(ys as tf.Tensor).print();
        const a = (model.predict(xs) as tf.Tensor);
        //deNormalizeData(array, PriceMin, PriceMax)
        a.array().then((array: any) => {
            console.log(deNormalizeData(array[0], PriceMin, PriceMax));
            // array.forEach(x => {
            //     console.log(deNormalizeData(x, PriceMin, PriceMax));
            // })
            //console.log(array); console.log('n')
        });

        //(model.predict(xs) as tf.Tensor).print();
    });

    // const a = (model.predict(tf.tensor([[[normalizeData(7171646, PopulationMin, PopulationMax)],
    // [normalizeData(39955, RDPIMin, RDPIMax)],
    // [normalizeData(3859137, EmploymentMin, EmploymentMax)]]])) as tf.Tensor);
    // a.array().then((array: any) => {
    //     array.forEach(x => {
    //         console.log(deNormalizeData(x, PriceMin, PriceMax));
    //     })
    //     //console.log(array); console.log('n')
    // }); a.array().then()

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
    model.compile({ loss: "meanSquaredError", optimizer: tf.train.adam() });

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
