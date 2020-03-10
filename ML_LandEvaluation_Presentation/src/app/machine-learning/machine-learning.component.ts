import { Component, OnInit } from '@angular/core';
import { multi } from './data';
import { HttpService } from '../services/https.service';

@Component({
    selector: 'app-machine-learning',
    templateUrl: './machine-learning.component.html'
})
export class MachineLearningComponent implements OnInit {

    private host: string = "http://localhost:3600/";
    listStates: string[] = ["alabama", "alaska", "arizona", "arkansas", "califonia", "colorado", "connecticut", "delaware", "districtofcolumbia", "florida", "georgia", "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky",
        "louisiana", "maine", "maryland", "massachusetts", "michigan", "minnesota", "mississippi", "missouri", "montana", "nebraska", "nevada", "newhamshire", "newjersey", "newmexico", "newyork",
        "northcarolina", "northdakota", "ohio", "oklahoma", "oregon", "pennsylvania", "rhodeisland", "southcarolina", "southdakota", "tennessee", "texas", "utah", "vermont", "virginia",
        "washington", "westvirginia", "wisconsin", "wyoming"];
    listCounty: string[] = ["alameda"]

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
