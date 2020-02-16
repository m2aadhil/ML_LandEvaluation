import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CountryViewComponent } from './country-view/country-view.component';
import { StateViewComponent } from './state-view/state-view.component';
import { CityViewComponent } from './city-view/city-view.component';

@NgModule({
  declarations: [
    AppComponent,
    CountryViewComponent,
    StateViewComponent,
    CityViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }