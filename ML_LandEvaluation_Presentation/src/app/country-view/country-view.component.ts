import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as  convert from 'color-convert';
declare var jQuery: any;
declare var jvm: any;

@Component({
  selector: 'app-country-view',
  templateUrl: './country-view.component.html',
  styleUrls: ['./country-view.component.css']
})
export class CountryViewComponent implements OnInit, AfterViewInit {

  palette = ['#66C2A5', '#FC8D62', '#8DA0CB', '#E78AC3', '#A6D854'];
  view: string = 'country';
  private path = '/assets/packages/maps/counties';
  map;
  private code;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    //'/js/us-counties/jquery-jvectormap-data-'
    jQuery(
      this.map = new jvm.MultiMap({
        container: jQuery('#vmap'),
        maxLevel: 1,
        main: {
          map: 'us_lcc',
          backgroundColor: 'transparent',
          series: {
            regions: [{
              attribute: 'fill',
              values: '#f6f6f6'
            }]
          },
          onRegionClick: this.onRegionSelected,
        }
      })

    );
    this.map.maps.us_lcc.series.regions[0].setValues(this.generateColors(this.map.maps.us_lcc));
    // jQuery('#vmap').vectorMap({ map: 'usa_en' });

  }

  loadCountyMap = (code, multiMap) => {
    return this.path + '/jquery-jvectormap-data-' +
      code.toLowerCase() + '-' +
      multiMap.defaultProjection + '-en.js';
  }

  onRegionSelected = (e, code, isSelected, selectedRegions) => {
    /* Here We are getting Map Object */

    //console.log(this.map.maps[code.toLowerCase() + '_lcc_en']);
    setTimeout(function () {
      this.view = 'county';
      jQuery(
        this.map = new jvm.MultiMap({
          container: jQuery('#vmap2'),
          maxLevel: 1,
          main: {
            map: code.toLowerCase() + '_lcc_en',
            backgroundColor: 'transparent',
            series: {
              regions: [{
                attribute: 'fill',
                values: '#f6f6f6'
              }]
            },
            onRegionClick: this.onRegionSelected,
          }
        })

      );
    }, 3000);

  }

  temp = (e, code) => {
    console.log(code);
  }

  generateColors = (map) => {
    var colors = {},
      key;

    let i = 0;
    let j = 1;
    for (key in map.regions) {
      colors[key] = '#' + convert.rgb.hex(255, i += 4, 0);
    }
    console.log(colors);
    return colors;
  }
}
