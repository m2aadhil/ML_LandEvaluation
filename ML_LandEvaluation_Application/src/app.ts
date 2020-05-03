import express from 'express';
import bodyParser from 'body-parser';

//controllers
import * as ModelController from "./controllers/model.controller";
import * as DatabaseController from "./controllers/database.controller";
import { AppConfig } from './config';

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//configs
app.set("port", Number(process.env.PORT) || 3600);

//application routes
app.get('/', (req, res) => {
    res.send('app works..!');
});
app.get("/home", ModelController.getInit);
app.get("/train/:type/:location/:epochs/:learningr", ModelController.train);
app.get("/getstatevalues", DatabaseController.getAllStateValues);
app.get("/getcountyvalues/:state", DatabaseController.getAllCountyValues);
app.get("/getpriceforloc/:address/:lat/:lng/:year/:citycode", ModelController.getPriceforLocation);
app.get("/getcities/:county", ModelController.getCities);

//ModelController.trainAll();

export default app;
