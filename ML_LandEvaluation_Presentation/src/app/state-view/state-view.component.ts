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
    this.item = this.data[0];
    this.setColorRange();
  }

  ngOnDestroy(): void {
    this.yearSubscription.unsubscribe();
  }

  ngAfterViewInit() {
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
          values: '#f6f6f6',
          render: function (code) {

          },
        }]
      },
      onRegionClick: this.onRegionSelected,
      onRegionTipShow: this.onRegionTipShow
    });

    this.map.series.regions[0].setValues(this.generateColors(this.map));

  }

  sliderChange(e): void {
    console.log(e);
    this.item = this.data.find(x => x.Year == e.toString());
    this.map.series.regions[0].setValues(this.generateColors(this.map));
    let view: ViewModel = new ViewModel();
    view.value = this.item[this.code];
    this.dataService.viewModel.next(view);
  }

  drillDown(e): void {
    if (e) {
      let mapData = this.map.params.mapNameByCode('us_ca_lcc_en', this.map);
      this.map.drillDown('us_ca_lcc_en', this.code);
    }
  }

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

  private onRegionTipShow = (e, el, code) => {
    let index = code.replace("0", "");
    let value = this.item[index] ? (Number(this.item[index])).toFixed(2) : null;
    el.html(el.html() + ' ($ ' + value + ')');
  }


  private valueRange: number[] = [];
  setColorRange(): void {
    let max: number = 0;
    let min: number = 0;
    this.valueRange = [];
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

    let range: number = (max - min) / 100;
    let value: number = min;
    for (let i = 0; i <= 100; i++) {
      this.valueRange.push(value);
      value += range;
    }
    console.log(this.valueRange);
  }

  getIndexOfValue(value: number): number {
    for (let i = 0; i < this.valueRange.length; i++) {
      if (this.valueRange[i] > value) {
        return i;
      }
    }
    return -1;
  }

  generateColors = (map) => {
    var colors = {},
      key;

    let i = 0;
    for (key in map.regions) {
      let index = key.replace("0", "");
      i = 210 - (this.getIndexOfValue(this.item[index]) * 2);
      colors[key] = i <= 210 ? '#' + convert.rgb.hex(255, i, 0) : '#FFFFFF';
    }
    console.log(colors);
    return colors;
  }

}
