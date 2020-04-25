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
  address: string = "";
  isLoading: boolean = false;
  isLoadingCities: boolean = false;
  listYears = ["2019", "2020", "2021"];
  listStates = ["California"];
  state = "California";
  estimatedValue: string = "";
  selectedYear: string = "2020";
  longitude = 36.47244485158913;
  latitude = -119.79590870616853;
  listCounty = CountyCodeMapCA.sort((x, y) => x.code > y.code ? 1 : -1);
  listCities = [];
  location = "00386";
  county = "6059";
  zoomLevel = 7;
  setMarker: boolean = false;

  @ViewChild('map', { static: true }) mapElement: any;
  map: google.maps.Map;
  marker: google.maps.Marker;

  ngOnInit() {


  }

  ngAfterViewInit(): void {
    const mapProperties = {
      center: new google.maps.LatLng(this.longitude, this.latitude),
      zoom: this.zoomLevel
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    this.map.addListener('click', this.onClickMap);
    this.init();
  }

  constructor(private httpService: HttpService) { }

  init = async () => {
    await this.getCities(this.county).then(() => {
      this.cityChange({});
    })
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
    this.isLoading = true;
    geocoder.geocode({ 'location': latLng }, function (results) {
      if (results[0]) {
        console.log(results[0].formatted_address);
        this.getPredictedPrice(results[0].formatted_address, results[0].geometry.location.lat(), results[0].geometry.location.lng());
        this.setAddress(results[0].formatted_address);
      } else {
        console.log('No results found');
      }
    }.bind(this));
  }

  setAddress = (address) => {
    this.address = address.split(',')[0];
  }
  cityChange($event): void {
    this.setMarker = false;
    let address = this.listCities.find(i => i.CityCode == this.location).CityName;
    this.zoomLevel = 15;
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'address': address
    }, this.changeLocation);

  }

  countyChange($event): void {
    this.setMarker = false;
    let address = this.listCounty.find(i => i.code == this.county).name;
    this.zoomLevel = 12;
    this.getCities(this.county);
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'address': address
    }, this.changeLocation);
  }

  onClickSubmit = () => {
    if (this.address && this.location && this.county) {
      this.setMarker = true;
      this.zoomLevel = 18;
      let location = this.listCities.find(i => i.CityCode == this.location).CityName;
      let address = this.address + ', ' + location + ', CA, USA';
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'address': address
      }, this.changeLocation);
    }
  }

  changeLocation = (results, status) => {
    if (status == google.maps.GeocoderStatus.OK) {
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
      var myOptions = {
        zoom: this.zoomLevel,
        center: new google.maps.LatLng(this.latitude, this.longitude)
      };
      this.map.setOptions(myOptions);
      if (this.setMarker) {
        if (this.marker) {
          this.marker.setMap(null);
        }
        this.marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
          title: 'Hello World!'
        });
        this.getAddress(results[0].geometry.location);
      }
    } else {
      alert("Something got wrong " + status);
    }
  }

  getCities = async (countyCode: string) => {
    this.isLoadingCities = true;
    let url: string = environment.coreServiceUrl + "getcities/" + countyCode;
    this.listCities = [];
    await this.httpService.get(url).then((res: any[]) => {
      this.isLoadingCities = false;
      if (res) {
        this.listCities = res.sort((x, y) => x.CityName > y.CityName ? 1 : -1);;
      }
    })
  }

  getPredictedPrice = async (address: string, lat: string, lng: string) => {
    address = address.slice(0, address.length - 5);
    address = address.split('/,').join('/');
    let url: string = environment.coreServiceUrl + "getpriceforloc/" + encodeURI(address) + '/' + lat + '/' + lng + '/' + this.selectedYear + '/' + this.location;
    await this.httpService.get(url).then((res: any) => {
      if (res) {
        console.log(res);
        this.estimatedValue = Number(res.price).toFixed(4);
      }
      this.isLoading = false;
    })
  }

}
