import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoreInfoComponent } from './components/more-info.component';

const routes: Routes = [
  {
    path: '',
    component: MoreInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoreInfoRoutingModule { }
