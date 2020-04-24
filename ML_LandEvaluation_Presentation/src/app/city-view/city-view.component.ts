import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { } from 'googlemaps';
import { CountyCodeMapCA } from '../constants/county-map-ca';
import { HttpService } from '../services/https.service';
import { environment } from 'src/environments/environment';
declare var jQuery: any;

@Component({
  selector: 'app-city-view',
  templateUrl: './city-view.component.html',
  styleUrls: ['./city-view.component.css']
})

export class CityViewComponent implements OnInit, AfterViewInit {

  //@Input() stateName: string;
  constructor(private httpService: HttpService) { }
  listYears = ["2019", "2020", "2021"];
  estimatedValue: string = "";
  selectedYear: string;
  longitude = 34.048927;
  latitude = -111.093735;
  listCounty = CountyCodeMapCA.sort((x, y) => x.code > y.code ? 1 : -1);
  listCities = [];
  location;
  county;

  @ViewChild('map', { static: true }) mapElement: any;
  map: google.maps.Map;
  marker: google.maps.Marker;

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    const mapProperties = {
      center: new google.maps.LatLng(this.longitude, this.latitude),
      zoom: 10
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    this.map.addListener('click', this.onClickMap);

  }

  onClickMap = ($event) => {
    console.log($event)
    if (this.marker) {
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
      position: $event.latLng,
      map: this.map,
      title: 'Hello World!'
    });
    this.getAddress($event.latLng);
  }

  getAddress = (latLng) => {
    let geocoder = new google.maps.Geocoder;
    geocoder.geocode({ 'location': latLng }, function (results) {
      if (results[0]) {
        console.log(results[0].formatted_address);
        this.getPredictedPrice(results[0].formatted_address, results[0].geometry.location.lat(), results[0].geometry.location.lng());
      } else {
        console.log('No results found');
      }
    }.bind(this));
  }

  cityChange($event): void {
    let address = $event.CityName;
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'address': address
    }, this.changeLocation);

  }

  valueChange($event): void {
    let address = $event.name;
    this.getCities($event.code);
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'address': address
    }, this.changeLocation);
  }

  changeLocation = (results, status) => {
    if (status == google.maps.GeocoderStatus.OK) {
      let Lat = results[0].geometry.location.lat();
      let Lng = results[0].geometry.location.lng();
      var myOptions = {
        zoom: 11,
        center: new google.maps.LatLng(Lat, Lng)
      };
      this.map.setOptions(myOptions);
    } else {
      alert("Something got wrong " + status);
    }
  }

  getCities = async (countyCode: string) => {
    let url: string = environment.coreServiceUrl + "getcities/" + countyCode;
    this.listCities = [];
    await this.httpService.get(url).then((res: any[]) => {
      if (res) {
        this.listCities = res;
      }
    })
  }

  getPredictedPrice = async (address: string, lat: string, lng: string) => {
    address = address.slice(0, address.length - 5);
    address = address.split('/,').join('/')
    let url: string = environment.coreServiceUrl + "getpriceforloc/" + encodeURI(address) + '/' + lat + '/' + lng + '/' + this.selectedYear + '/' + this.location.CityCode;
    await this.httpService.get(url).then((res: any) => {
      if (res) {
        console.log(res);
        this.estimatedValue = Number(res.price).toFixed(4);
      }
    })
  }

}
