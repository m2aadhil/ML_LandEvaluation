import express from 'express';
import bodyParser from 'body-parser';

//controllers
import * as HomeController from "./controllers/home.controller";
import * as tenser from "./services/tenserflow.service";


const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//configs
require('custom-env').env('dev')
app.set("port", process.env.PORT);

//application routes
app.get('/', (req, res) => {
    res.send('app works..!');
});
app.get("/home", HomeController.getInit);
//app.get("/load", HomeController.load);
app.get("/train/:location/:epochs", HomeController.train);


//tenser.createModel(tenser.trainingData);

//run();

export default app;
