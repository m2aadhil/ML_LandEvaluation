import { Component, OnInit } from '@angular/core';
import * as  convert from 'color-convert';
declare var jQuery: any;
declare var jvm: any;

@Component({
  selector: 'app-state-view',
  templateUrl: './state-view.component.html',
  styleUrls: ['./state-view.component.css']
})
export class StateViewComponent implements OnInit {


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
    let map = new jvm.Map({
      map: 'us-az_lcc_en',
      backgroundColor: 'transperent',
      container: jQuery('#vmap2'),
      series: {
        regions: [{
          attribute: 'fill'
        }]
      }
    });
    // let map = jQuery('#vmap2').vectorMap({
    //   map: 'us_lcc',
    //   backgroundColor: 'transperent',
    //   series: {
    //     regions: [{
    //       attribute: 'fill',
    //       values: '#A9A9A9'
    //     }]
    //   }
    // });
    map.series.regions[0].setValues(this.generateColors(map));
    // jQuery('#vmap').vectorMap({ map: 'usa_en' });

  }

  loadCountyMap = (code, multiMap) => {
    return this.path + '/jquery-jvectormap-data-' +
      code.toLowerCase() + '-' +
      multiMap.defaultProjection + '-en.js';
  }

  onRegionSelected = (e, code, isSelected, selectedRegions) => {
    /* Here We are getting Map Object */
    //this.switchMap(code);
    // console.log(this.map.maps[code.toLowerCase() + '_lcc_en']);

    setTimeout(function () {
      //let map = jQuery('#vmap div').vectorMap('get', 'mapObject'); data("mapObject");
      //let map = jQuery('#vmap .jvectormap-container', 0).data("mapObject");
      let map;
      jQuery(
        map = new jvm.MultiMap({
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
          },
          mapUrlByCode: this.loadCountyMap
        })

      );

      // let mString = code.toLowerCase() + '_lcc_en';
      // let map = jQuery('#vmap').vectorMap({
      //   map: mString,
      //   series: {
      //     regions: [{
      //       attribute: 'fill',
      //       values: '#A9A9A9'
      //     }]
      //   }
      // });
      // jQuery('#vmap').vectorMap({ map: 'us_lcc' }).remove();

      //this.view = 'county';
      //console.log(map.maps[mString].regions[0].setValues(this.generateColors(map.maps[mString])));
      // jQuery('#vmap').vectorMap('get', 'mapObject').remove();
      // jQuery('#vmap').vectorMap().reset();
      //console.log(jQuery('#vmap div .jvectormap-container', 1).data("mapObject"));
      // map.setBackgroundColor('transperent');
      //console.log(this.map.maps[code.toLowerCase() + '_lcc_en'])

      //vectorMap({ map: 'us_lcc' })
    }.bind(this), 3000);

  }

  switchMap = (code) => {
    jQuery.getScript(this.path + '/jquery-jvectormap-data-' +
      code.toLowerCase() + '-lcc-en.js', function (data) {
        jQuery('#vmap div').vectorMap({ map: code + '_lcc_en' });
      });
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
