import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/https.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private httpService: HttpService, private router: Router) { }

  address: string;

  ngOnInit() {
  }

  getPlace = async () => {
    let url: string = environment.googleMaps.geoCodeAPI + 'address=' + encodeURI(this.address) + '&key=' + environment.googleMaps.apiKey;
    let address: string;
    let county: string;
    let state: string;
    let city: string;
    this.httpService.get(url).then(res => {
      if (res.status == 'OK') {
        address = res.results[0].formatted_address.split(',')[0];
        city = res.results[0].address_components[2].long_name;
        county = res.results[0].address_components[3].long_name;
        state = res.results[0].address_components[4].short_name;
        console.log(res.results[0]);
      }
      if (state != 'CA') {
        console.log('Sorry currenlty we are only supporting for California State');
      }
      let route: string = 'mapview/' + state + '/' + encodeURI(county) + '/' + encodeURI(city) + '/' + encodeURI(address);
      this.router.navigate([route]);
      console.log(address, city, county, state);
    }).catch(err => {
      console.error(err);
    })
  }


}
