import express from 'express';
import bodyParser from 'body-parser';

//controllers
import * as HomeController from "./controllers/home.controller";

const app = express();
const port = 3000;
app.get('/', (req, res) => {
    res.send('app works..!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//application routes
app.get("/home", HomeController.getInit);

// start the Express server
app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});