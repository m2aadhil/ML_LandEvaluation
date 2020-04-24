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
const city_service_1 = require("../services/city.service");
exports.getInit = (req, res) => {
    res.json({ res: true });
};
exports.train = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    let mlService = new ml_service_1.MLService();
    let dbService = new database_service_1.DBService();
    let price = yield mlService.executeTrainin(req.params.location, Number(req.params.epochs), req.params.type, Number(req.params.learningr));
    let values = yield mlService.getOrigianlPrices();
    let predictions = [];
    let step1 = yield mlService.predictStep(req.params.type);
    let step2 = yield mlService.predictStep(req.params.type);
    let step3 = yield mlService.predictStep(req.params.type);
    predictions.push(price);
    predictions.push(step1);
    predictions.push(step2);
    predictions.push(step3);
    if (req.params.type == 'state') {
        yield dbService.addStateValues(req.params.location, predictions);
    }
    else {
        yield dbService.addCountyValues(req.params.location, predictions);
    }
    res.json({ original: values, prediction: predictions });
});
exports.trainAll = () => {
    let mlService = new ml_service_1.MLService();
    mlService.trainAll();
};
exports.getPriceforLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cityService = new city_service_1.CityService();
    let response = yield cityService.getPriceLocation(req.params.address, req.params.lat, req.params.lng, req.params.year, req.params.citycode);
    res.json({ price: response });
});
exports.getCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cityService = new city_service_1.CityService();
    let response = yield cityService.getCitiesofCounty(req.params.county);
    res.json(response);
});
//# sourceMappingURL=home.controller.js.map