import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/https.service';
import { StateCodeMap } from '../constants/state-map';
import { CountyCodeMapCA } from '../constants/county-map-ca';
import { Subject } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Socket } from 'ngx-socket-io';
import { SocketIOService } from '../services/socketio.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-machine-learning',
    templateUrl: './machine-learning.component.html'
})
export class MachineLearningComponent implements OnInit {

    listStates = StateCodeMap.sort((x, y) => x.name > y.name ? 1 : -1);
    listCounty = CountyCodeMapCA.sort((x, y) => x.code > y.code ? 1 : -1);

    epcochI: number = 0;
    location: string;
    epochs: number = 450;
    learningRate: number = 6e-5;
    isLoading: boolean = false;
    isState: boolean = true;


    //ng-chart
    single: any[];
    //multi: any[];
    epochGraph = [
        {
            'name': 'Validation Loss',
            'series': []
        }
    ];

    validationGraph = [
        {
            'name': 'History Values',
            'series': []
        },
        {
            'name': 'Predicted Values',
            'series': []
        }
    ];

    // options
    animations = true;
    gradient = false;

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    onSelect(event) {
        console.log(event);
    }

    count = 0;

    interval;


    initData() {
        for (let i = 0; i < 20; i++) {

            let val = 0;

            this.epochGraph[0].series.push({
                'name': i,
                'value': 0,
            });
        }
        for (let i = 2008; i < 2022; i++) {

            let val = 0;

            this.validationGraph[0].series.push({
                'name': i.toString(),
                'value': 0,
            });
            this.validationGraph[1].series.push({
                'name': i.toString(),
                'value': 0,
            });
        }
    }
    //ng-chart

    constructor(private httpService: HttpService, private socketService: SocketIOService) {
        // Object.assign(this, { multi });
    }
    ngOnInit() {
        let onComplete: Subject<number> = new Subject<number>();
        this.epcochI = 1;
        //this.initData();
        onComplete.subscribe(r => {
            this.epochGraph[0].series.push({
                'name': this.epcochI++,
                'value': r,
                'min': 0
            });

        })
        this.socketService.setupSocketConnection(onComplete);
    }


    startLiveData() {
        this.epochGraph[0].series = [];
        this.interval = setInterval(() => {
            this.count++;
            this.epochGraph = [...this.epochGraph];
        }, 1000);
    }

    stopLiveData() {
        clearInterval(this.interval);
        console.log('Live data stopped');
    }

    onTrainButtonClick(): void {
        this.isLoading = true;
        this.epcochI = 1;
        let type = this.isState ? 'state' : 'county';

        this.startLiveData();
        this.validationGraph[0].series = [];
        this.validationGraph[1].series = [];
        this.httpService.get(environment.coreServiceUrl + 'train/' + type + '/' + this.location + '/' + this.epochs + '/' + this.learningRate)
            .then((res: any) => {
                if (res) {
                    for (let i = 2008; i <= 2021; i++) {
                        if (i <= 2018) {
                            this.validationGraph[0].series.push({
                                'name': (i).toString(),
                                'value': res.original[i - 2008]
                            });
                        }
                        if (i >= 2018) {
                            this.validationGraph[1].series.push({
                                'name': (i).toString(),
                                'value': res.prediction[i - 2018]
                            });
                        }

                    }
                    this.validationGraph = [...this.validationGraph];
                }
                this.isLoading = false;
                this.stopLiveData();
            }).catch(err => {
                console.error(err);
                this.isLoading = false;
                this.stopLiveData();
            })
    }




}
