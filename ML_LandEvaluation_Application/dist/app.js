"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
//controllers
const HomeController = __importStar(require("./controllers/home.controller"));
const DatabaseController = __importStar(require("./controllers/database.controller"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//configs
require('custom-env').env('dev');
app.set("port", process.env.PORT);
//application routes
app.get('/', (req, res) => {
    res.send('app works..!');
});
app.get("/home", HomeController.getInit);
//app.get("/load", HomeController.load);
app.get("/train/:type/:location/:epochs", HomeController.train);
app.get("/testdb", DatabaseController.testDBConnection);
HomeController.trainStates();
exports.default = app;
//# sourceMappingURL=app.js.map