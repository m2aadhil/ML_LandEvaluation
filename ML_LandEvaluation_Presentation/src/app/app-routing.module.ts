import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryViewComponent } from './country-view/country-view.component';


const routes: Routes = [
  { path: "map", component: CountryViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
