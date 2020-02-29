import { Component, OnInit } from '@angular/core';
import { DataSets } from './data/data';
import { MachineLearningModel } from './model/ml.model';
//import * as tfvis from '@tensorflow/tfjs-vis';


@Component({
    selector: 'app-machine-learning',
    templateUrl: './machine-learning.component.html'
})
export class MachineLearningComponent implements OnInit {


    private dataSet: DataSets;
    constructor() {
        this.dataSet = new DataSets('app-machine-learning');
    }
    private dataChartContainer = document.getElementById('data-chart');

    ngOnInit() {
        this.init();
    }

    init = async () => {
        await this.dataSet.loadData();
        let values = [{ x: 9, y: 9 }, { x: 9, y: 9 }];

        let model = new MachineLearningModel();

        let tensors = this.dataSet.getTensors();
        const { inputs, labels } = tensors;

        await model.trainModel(inputs, labels);
        console.log('Done Training');
        //model.model.summary();
        await model.testModel(tensors);

    }

}
