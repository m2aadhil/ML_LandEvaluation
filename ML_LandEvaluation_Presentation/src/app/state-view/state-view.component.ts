import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import * as  convert from 'color-convert';
import { CountyResponseDTO } from '../model/county.response.dto';
import { DataMapService } from '../services/data.map.service';
import { ViewModel } from '../model/view.model';
import { CountyCodeMapCA } from '../constants/county-map-ca';
import { Subscription } from 'rxjs';
declare var jQuery: any;
declare var jvm: any;

@Component({
  selector: 'app-state-view',
  templateUrl: './state-view.component.html',
  styleUrls: ['./state-view.component.css']
})
export class StateViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() year: number = 2008;
  @Input() data: CountyResponseDTO[] = [];
  @Output() public viewChange: EventEmitter<any> = new EventEmitter<any>();
  item: CountyResponseDTO;
  map;
  private code;
  private yearSubscription: Subscription;

  constructor(private dataService: DataMapService) {
    this.yearSubscription = this.dataService.selectedYear.subscribe(year => {
      this.sliderChange(year);
    });
    this.dataService.drillDrown.subscribe(drill => {
      this.drillDown(drill);
    });
  }

  ngOnInit() {
    this.item = this.data[this.year - 2008];
  }

  ngOnDestroy(): void {
    this.yearSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    let minMax = this.getMinMax();
    this.map = new jvm.Map({
      map: 'us-ca_lcc_en',
      backgroundColor: 'transperent',
      container: jQuery('#vmap2'),
      regionLabelStyle: {
        initial: {
          fill: '#B90E32'
        },
        hover: {
          fill: 'black'
        }
      },
      series: {
        regions: [{
          attribute: 'fill',
          values: this.getValues(this.item),
          max: minMax.max,
          min: minMax.min,
          scale: ['#ffd505', '#ff0d05'],
          legend: {
            vertical: true
          }
        }]
      },
      onRegionClick: this.onRegionSelected,
      onRegionTipShow: this.onRegionTipShow
    });

    this.map.series.regions[0].setValues(this.getValues(this.item));

  }

  //year slider change
  sliderChange(e): void {
    console.log(e);
    this.item = this.data.find(x => x.Year == e.toString());
    this.map.series.regions[0].setValues(this.getValues(this.item));
    let view: ViewModel = new ViewModel();
    view.value = this.item[this.code];
    this.dataService.viewModel.next(view);
  }

  //map zoom
  drillDown(e): void {
    if (e) {
      let mapData = this.map.params.mapNameByCode('us_ca_lcc_en', this.map);
      this.map.drillDown('us_ca_lcc_en', this.code);
    }
  }

  //region selection
  onRegionSelected = (e, code, isSelected, selectedRegions) => {
    let view: ViewModel = new ViewModel();
    this.code = code.replace('0', '');
    view.location = CountyCodeMapCA.find(i => i.code == this.code).name;
    view.value = this.item[this.code];
    this.dataService.viewModel.next(view);
    if (this.code != 'US_CA') {
      e.stopImmediatePropagation();
    }

  }

  //load values on map
  getValues = (data: CountyResponseDTO) => {
    let mapData = {};
    for (let key of Object.keys(data)) {
      if (!isNaN(Number(key))) {
        mapData['0' + key] = data[key];
      }
    }
    console.log(mapData)
    return mapData;
  }

  //tool tip
  private onRegionTipShow = (e, el, code) => {
    let index = code.replace("0", "");
    let value = this.item[index] ? (Number(this.item[index])).toFixed(2) : null;
    el.html(el.html() + ' ($ ' + value + ')');
  }

  //minimum and maximum values
  getMinMax() {
    let max: number = 0;
    let min: number = 0;
    this.data.forEach(item => {
      for (let key of Object.keys(item)) {
        let val = item[key];
        if (key == 'Year' || isNaN(val)) {
          continue;
        }
        if (val > max) {
          max = val;
        }
        if (val < min || min == 0) {
          min = val;
        }
      }
    })
    return { min: min, max: max };
  }

}
