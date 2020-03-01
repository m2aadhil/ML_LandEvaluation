import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CountryViewComponent } from './country-view/country-view.component';
import { StateViewComponent } from './state-view/state-view.component';
import { CityViewComponent } from './city-view/city-view.component';
import { MachineLearningComponent } from './machine-learning/machine-learning.component';
import { HttpService } from './services/https.service';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';




@NgModule({
  declarations: [
    AppComponent,
    CountryViewComponent,
    StateViewComponent,
    CityViewComponent,
    MachineLearningComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    InputsModule,
    DropDownsModule,
    ButtonsModule,
    ChartsModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
