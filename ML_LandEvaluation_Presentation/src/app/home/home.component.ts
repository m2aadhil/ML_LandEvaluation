import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/https.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NotificationService } from '@progress/kendo-angular-notification';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private httpService: HttpService, private router: Router, private notificationService: NotificationService) { }

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
        console.log(res.results[0].formatted_address.split(','))
        let formattedAdd = res.results[0].formatted_address.split(',');
        address = formattedAdd[0];
        city = formattedAdd[1].trimLeft();
        county = this.findMatch(res.results[0].address_components, 'county')[0].long_name;//res.results[0].address_components[3].long_name;
        state = (formattedAdd[2].trimLeft()).slice(0, 2);
        console.log(res.results[0]);
      }
      if (state.trim() != 'CA') {
        console.log(address, city, county, state);
        console.log('Sorry currenlty we are only supporting for California, USA');
        this.notificationService.show({
          content: 'Sorry! currenlty we are only supporting for California, USA',
          cssClass: 'button-notification',
          animation: { type: 'slide', duration: 200 },
          position: { horizontal: 'center', vertical: 'bottom' },
          type: { style: 'success', icon: false }
        });
      } else {
        let route: string = 'mapview/' + state + '/' + encodeURI(county) + '/' + encodeURI(city) + '/' + encodeURI(address);
        this.router.navigate([route]);
        console.log(address, city, county, state);
      }
    }).catch(err => {
      console.error(err);
    })
  }

  findMatch = (query: any[], value: string) => {
    return query.filter(
      s => s.long_name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
}
