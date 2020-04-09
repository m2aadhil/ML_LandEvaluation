import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryViewComponent } from './country-view/country-view.component';
import { MachineLearningComponent } from './machine-learning/machine-learning.component';
import { HomeComponent } from './home/home.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { CityViewComponent } from './city-view/city-view.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'country', component: CountryViewComponent },
  { path: 'city', component: CityViewComponent },
  { path: 'prediction', component: MachineLearningComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
