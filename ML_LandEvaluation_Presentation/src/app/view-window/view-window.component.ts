import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/https.service';
import { environment } from 'src/environments/environment';
import { StateResponseDTO } from '../model/states.response.dto';
import { DataMapService } from '../services/data.map.service';
import { ViewModel } from '../model/view.model';

@Component({
  selector: 'app-view-window',
  templateUrl: './view-window.component.html',
  styleUrls: ['./view-window.component.css']
})
export class ViewWindowComponent implements OnInit {

  public value: number;
  isLoading: boolean = false;
  statusMessage: string = "";
  view: string;
  stateData: StateResponseDTO[] = [];
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

  viewChange(e) {
    console.log(e);
    this.view = e;
  }

  private init = async () => {
    this.isLoading = true;
    this.statusMessage = 'Please wait while the map loads...';
    this.stateData = await this.dataService.getStateData();
    this.view = 'country';
    this.isLoading = false;
    this.statusMessage = "";
  }

  title = value => {
    return value;
  };

  sliderChange($event): void {
    this.dataService.selectedYear.next($event);
  }

  navigate(): void {
    if (this.viewModel.location == 'Arizona') {
      //this.dataService.drillDrown.next(true);
      this.view = 'state';
    } else {
      this.statusMessage = "Sorry... Currently we have trained data only for Arizona..."

    }
    setTimeout(function () {
      this.statusMessage = "";
    }.bind(this), 4000);
  }

}
