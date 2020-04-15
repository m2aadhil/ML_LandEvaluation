import { Component, OnInit } from '@angular/core';
import { multi } from './data';
import { HttpService } from '../services/https.service';
import { StateCodeMap } from '../constants/state-map';
import { CountyCodeMapCA } from '../constants/county-map-ca';

@Component({
    selector: 'app-machine-learning',
    templateUrl: './machine-learning.component.html'
})
export class MachineLearningComponent implements OnInit {

    private host: string = "http://localhost:3600/";
    listStates = StateCodeMap.sort((x, y) => x.name > y.name ? 1 : -1);
    listCounty = CountyCodeMapCA.sort((x, y) => x.code > y.code ? 1 : -1);

    location: string;
    epochs: number = 450;

    isLoading: boolean = false;
    isState: boolean = true;

    truePrices: number[] = [];
    predictedPrices: number[] = [];

    colorScheme = {
        domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };

    constructor(private httpService: HttpService) {
        Object.assign(this, { multi });
    }
    ngOnInit() {
        console.log(this.listCounty);
    }

    onTrainButtonClick(): void {
        this.isLoading = true;
        this.truePrices = [];
        this.predictedPrices = [null, null, null, null, null, null, null, null, null, null];
        let type = this.isState ? 'state' : 'county';
        this.httpService.get(this.host + 'train/' + type + '/' + this.location + '/' + this.epochs)
            .then((res: any) => {
                if (res) {
                    this.truePrices = res.values;
                    this.predictedPrices.push(res.valid);
                    this.predictedPrices.push(res.step1);
                    this.predictedPrices.push(res.step2);
                }
                this.isLoading = false;
            }).catch(err => {
                console.error(err);
                this.isLoading = false;
            })
    }

}
