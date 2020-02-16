import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var jQuery: any;
declare var jvm: any;

@Component({
  selector: 'app-country-view',
  templateUrl: './country-view.component.html',
  styleUrls: ['./country-view.component.css']
})
export class CountryViewComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery(
      new jvm.MultiMap({
        container: jQuery('#vmap'),
        maxLevel: 1,
        main: {
          map: 'us_lcc'
        },
        mapUrlByCode: function (code, multiMap) {
          return '/js/us-counties/jquery-jvectormap-data-' +
            code.toLowerCase() + '-' +
            multiMap.defaultProjection + '-en.js';
        }
      })
    );
    // jQuery('#vmap').vectorMap({ map: 'usa_en' });

  }
}
