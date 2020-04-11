import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {  } from 'googlemaps';

@Component({
  selector: 'app-city-view',
  templateUrl: './city-view.component.html',
  styleUrls: ['./city-view.component.css']
})

export class CityViewComponent implements OnInit {

  @Input() stateName: string;

  longitude = 34.048927;
  latitude = -111.093735;

  @ViewChild('map', {static: true}) mapElement: any;
  map: google.maps.Map;

  ngOnInit() {

    const mapProperties = {

      center: new google.maps.LatLng(this.longitude, this.latitude),
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);

  }

}
