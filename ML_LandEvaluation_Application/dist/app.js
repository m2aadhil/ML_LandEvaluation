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
const ModelController = __importStar(require("./controllers/model.controller"));
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
exports.default = app;
//# sourceMappingURL=app.js.map