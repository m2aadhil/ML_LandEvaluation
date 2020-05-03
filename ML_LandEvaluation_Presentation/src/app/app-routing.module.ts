import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryViewComponent } from './country-view/country-view.component';
import { MachineLearningComponent } from './machine-learning/machine-learning.component';
import { HomeComponent } from './home/home.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { CityViewComponent } from './city-view/city-view.component';
import { ViewWindowComponent } from './view-window/view-window.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'heatmap', component: ViewWindowComponent },
  { path: 'mapview', component: CityViewComponent },
  { path: 'mapview/:state/:county/:city/:address', component: CityViewComponent },
  { path: 'train', component: MachineLearningComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
