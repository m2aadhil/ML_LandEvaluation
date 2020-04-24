import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import * as  convert from 'color-convert'; import { StateResponseDTO } from '../model/states.response.dto';
import { DataMapService } from '../services/data.map.service';
import { ViewModel } from '../model/view.model';
import { StateCodeMap } from '../constants/state-map';
import { Subscription } from 'rxjs';
;
declare var jQuery: any;
declare var jvm: any;

@Component({
  selector: 'app-country-view',
  templateUrl: './country-view.component.html',
  styleUrls: ['./country-view.component.css']
})
export class CountryViewComponent implements OnInit, AfterViewInit, OnDestroy {
  public value: number;
  @Input() data: StateResponseDTO[] = [];
  @Output() public viewChange: EventEmitter<any> = new EventEmitter<any>();
  item: StateResponseDTO;
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
    //this.setColorRange();
  }

  ngOnDestroy(): void {
    this.yearSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    //'/js/us-counties/jquery-jvectormap-data-'
    let minMax = this.getMinMax();
    console.log(minMax);
    jQuery(
      this.map = new jvm.MultiMap({
        container: jQuery('#vmap'),
        regionLabelStyle: {
          initial: {
            fill: '#B90E32'
          },
          hover: {
            fill: 'black'
          }
        },
        maxLevel: 1,
        regionsSelectable: true,
        main: {
          map: 'us_lcc',
          backgroundColor: 'transparent',
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
        },
      })

    );
    this.map.maps.us_lcc.series.regions[0].setValues(this.getValues(this.item));

  }

  sliderChange(e): void {
    console.log(e);
    this.item = this.data.find(x => x.Year == e.toString());
    this.map.maps.us_lcc.series.regions[0].setValues(this.getValues(this.item));
    let view: ViewModel = new ViewModel();
    view.value = this.item[this.code];
    this.dataService.viewModel.next(view);
  }

  drillDown(e): void {
    if (e) {
      let mapData = this.map.params.mapNameByCode('us_lcc', this.map);
      this.map.drillDown('us_lcc', this.code);
    }
  }

  onRegionSelected = (e, code, isSelected, selectedRegions) => {
    let view: ViewModel = new ViewModel();
    this.code = code.replace('-', '_');
    view.location = StateCodeMap.find(i => i.code == this.code).name;
    view.value = this.item[this.code];
    this.dataService.viewModel.next(view);
    // if (this.code != 'US_CA') {

    // }
    e.stopImmediatePropagation();

  }

  private onRegionTipShow = (e, el, code) => {
    let index = code.replace("-", "_");
    let value = this.item[index] ? (Number(this.item[index])).toFixed(2) : null;
    el.html(el.html() + ' ($ ' + value + ')');
  }

  private valueRange: number[] = [];

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

  // setColorRange(): void {
  //   let max: number = 0;
  //   let min: number = 0;
  //   this.valueRange = [];
  //   this.data.forEach(item => {
  //     for (let key of Object.keys(item)) {
  //       let val = item[key];
  //       if (key == 'Year' || isNaN(val)) {
  //         continue;
  //       }
  //       if (val > max) {
  //         max = val;
  //       }
  //       if (val < min || min == 0) {
  //         min = val;
  //       }
  //     }
  //   })
  //   console.log(max)
  //   console.log(min)
  //   let range: number = (max - min) / 100;
  //   let value: number = min;
  //   for (let i = 0; i <= 100; i++) {
  //     this.valueRange.push(value);
  //     value += range;
  //   }
  //   console.log(range)
  //   console.log(this.valueRange)
  // }

  // getIndexOfValue(value: number): number {
  //   console.log(value);
  //   for (let i = 0; i < this.valueRange.length; i++) {
  //     if (this.valueRange[i] > value) {
  //       return i;
  //     }
  //   }
  //   return -1;
  // }

  getValues = (data: StateResponseDTO) => {
    let mapData = {};
    for (let key of Object.keys(data)) {
      mapData[key.replace("_", "-")] = data[key];
    }
    console.log(mapData)
    return mapData;
  }

  // generateColors = (map) => {
  //   var colors = {},
  //     key;

  //   let i = 0;
  //   for (key in map.regions) {
  //     let index = key.replace("-", "_");
  //     i = 210 - (this.getIndexOfValue(this.item[index]) * 2);
  //     colors[key] = i <= 210 ? '#' + convert.rgb.hex(255, i, 0) : '#FFFFFF';
  //   }
  //   console.log(colors);
  //   return colors;
  // }
}
