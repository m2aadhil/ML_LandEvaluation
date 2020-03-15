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
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let map;
    jQuery(
      map = new jvm.MultiMap({
        container: jQuery('#vmap'),
        maxLevel: 1,
        main: {
          map: 'us_lcc',
          series: {
            regions: [{
              attribute: 'fill',
              values: '#4E7387'
            }]
          }
        },

        mapUrlByCode: function (code, multiMap) {
          return '/js/us-counties/jquery-jvectormap-data-' +
            code.toLowerCase() + '-' +
            multiMap.defaultProjection + '-en.js';
        }
      })

    );
    console.log(map.maps.us_lcc)
    map.maps.us_lcc.series.regions[0].setValues(this.generateColors(map.maps.us_lcc));
    // jQuery('#vmap').vectorMap({ map: 'usa_en' });

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
