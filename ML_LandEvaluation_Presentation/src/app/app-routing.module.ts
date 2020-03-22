import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryViewComponent } from './country-view/country-view.component';
import { MachineLearningComponent } from './machine-learning/machine-learning.component';


const routes: Routes = [
  { path: "map", component: CountryViewComponent },
  { path: "ml", component: MachineLearningComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
