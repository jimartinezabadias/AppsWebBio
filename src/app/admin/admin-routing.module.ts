import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminCreativityComponent } from './components/admin-creativity/admin-creativity.component';
import { AdminRulitComponent } from './components/admin-rulit/admin-rulit.component';

import { AdminComponent } from './components/admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent
  },
  {
    path: 'creativity',
    component: AdminCreativityComponent
  },
  {
    path: 'rulit',
    component: AdminRulitComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
