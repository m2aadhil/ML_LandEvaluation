"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ml_service_1 = require("../services/ml.service");
const database_service_1 = require("../services/database.service");
exports.getInit = (req, res) => {
    res.json({ res: true });
};
exports.train = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    let mlService = new ml_service_1.MLService();
    let dbService = new database_service_1.DBService();
    let price = yield mlService.executeTrainin(req.params.location, Number(req.params.epochs), req.params.type);
    let values = yield mlService.getOrigianlPrices();
    let step1 = yield mlService.predictStep(req.params.type);
    let step2 = yield mlService.predictStep(req.params.type);
    values.push(step1);
    values.push(step2);
    yield dbService.addStateValues(req.params.location, values);
    res.json({ values: values, valid: price, step1: step1, step2: step2 });
});
exports.trainStates = () => {
    let mlService = new ml_service_1.MLService();
    mlService.trainAllStates();
};
//# sourceMappingURL=home.controller.js.map