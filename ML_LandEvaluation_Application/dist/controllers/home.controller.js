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
const tenserflow = require('../services/tenserflow.service');
exports.getInit = (req, res) => {
    res.json({ res: true });
};
exports.train = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    let location;
    let mlService = new ml_service_1.MLService();
    let price = yield mlService.executeTrainin(req.params.location, Number(req.params.epochs));
    let values = yield mlService.getOrigianlPrices();
    let step1 = yield mlService.predictStep();
    let step2 = yield mlService.predictStep();
    res.json({ values: values, 2018: price, 2019: step1, 2020: step2 });
});
//# sourceMappingURL=home.controller.js.map