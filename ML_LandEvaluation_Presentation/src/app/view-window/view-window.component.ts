import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/https.service';
import { environment } from 'src/environments/environment';
import { StateResponseDTO } from '../model/states.response.dto';
import { DataMapService } from '../services/data.map.service';
import { ViewModel } from '../model/view.model';
import { CountyResponseDTO } from '../model/county.response.dto';

@Component({
  selector: 'app-view-window',
  templateUrl: './view-window.component.html',
  styleUrls: ['./view-window.component.css']
})
export class ViewWindowComponent implements OnInit {
  header = 'USA';
  description = 'Land Value Index';
  public value: number = 2008;
  isLoading: boolean = false;
  statusMessage: string = "";
  view: string;
  stateData: StateResponseDTO[] = [];
  countyData: CountyResponseDTO[] = [];
  viewModel: ViewModel = new ViewModel();
  constructor(private dataService: DataMapService) {
    this.dataService.viewModel.subscribe((e: ViewModel) => {
      if (e.location) {
        this.viewModel.location = e.location;
      }
      if (e.value) {
        this.viewModel.value = e.value;
      }
    })
  }

  ngOnInit() {
    this.init();
  }


  private init = async () => {
    this.isLoading = true;
    this.statusMessage = 'Please wait while the map loads...';
    this.stateData = await this.dataService.getStateData();
    this.view = 'country';
    this.isLoading = false;
    this.statusMessage = "";
    this.sliderAnimation();
  }

  sliderAnimation = () => {

    if (this.value < 2019) {
      setTimeout(() => {
        this.value++;
        this.sliderChange(this.value);
        this.sliderAnimation();
      }, 150);
    }
  }

  title = value => {
    return value;
  };

  sliderChange($event): void {
    this.dataService.selectedYear.next($event);
  }

  viewChange(view: string): void {
    this.view = view;
    if (this.view == 'country') {
      this.header = 'USA';
      this.description = 'Land Value Index';
    } else {
      this.header = 'California';
      this.description = 'Value per purch';
    }
  }

  navigate = async () => {
    if (this.viewModel.location == 'California') {
      //this.dataService.drillDrown.next(true);
      this.isLoading = true;
      this.countyData = await this.dataService.getCountyData('California');
      this.viewChange('state');
      this.isLoading = false;
    } else {
      this.statusMessage = "Sorry... Currently we have trained data only for California..."

    }
    this.viewModel = new ViewModel();
    setTimeout(function () {
      this.statusMessage = "";
    }.bind(this), 4000);
  }

}
