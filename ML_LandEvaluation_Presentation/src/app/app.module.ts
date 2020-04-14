import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
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
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { SharedComponent } from './shared/shared.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ViewWindowComponent } from './view-window/view-window.component';
import { DataMapService } from './services/data.map.service';




@NgModule({
  declarations: [
    AppComponent,
    CountryViewComponent,
    StateViewComponent,
    CityViewComponent,
    MachineLearningComponent,
    FooterComponent,
    HomeComponent,
    SharedComponent,
    ErrorPageComponent,
    ViewWindowComponent
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
    ChartsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBHGoQ0VuaijrL6_ibz33L_Ie4BNNW00hQ'
    }),
  ],
  providers: [HttpService, DataMapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
