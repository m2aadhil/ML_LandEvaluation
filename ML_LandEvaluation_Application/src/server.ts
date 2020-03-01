import app from "./app";
require('@tensorflow/tfjs-node');
const http = require('http');
const socketio = require('socket.io');
const tenserflow = require('./services/tenserflow.service');
const mlService = require('./services/ml.service');


const TIMEOUT_BETWEEN_EPOCHS_MS = 500;
const PORT = 8001;

// util function to sleep for a given ms
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Main function to start server, perform model training, and emit stats via the socket connection
// async function run() {
//     const port = app.get('port');
//     const server = http.createServer();
//     const io = socketio(server);

//     server.listen(port, () => {
//         console.log(`  > Running socket on port: ${port}`);
//     });

//     io.on('connection', (socket) => {
//         socket.on('predictSample', async (sample) => {
//             // io.emit('predictResult', await pitch_type.predictSample(sample));
//         });
//     });

//     let numTrainingIterations = 10;
//     for (var i = 0; i < numTrainingIterations; i++) {
//         console.log(`Training iteration : ${i + 1} / ${numTrainingIterations}`);
//         // await tenserflow.createModel(tenserflow.trainingData, { epochs: 1 });
//         // console.log('accuracyPerClass', await pitch_type.evaluate(true));
//         await sleep(TIMEOUT_BETWEEN_EPOCHS_MS);
//     }

//     io.emit('trainingComplete', true);
// }

//mlService.run();
//const train = tenserflow.trainingData();
//tenserflow.createModel();
//tenserflow.createModelTest();
//tenserflow.run();
//yconsole.log(train);
/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

export default server;