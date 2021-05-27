import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { AfterTestRoutingModule } from './after-test-routing.module';
import { AfterTestComponent } from './components/after-test.component';

@NgModule({
  declarations: [
    AfterTestComponent
  ],
  imports: [
    CommonModule,
    AfterTestRoutingModule,
    SharedModule
  ]
})
export class AfterTestModule { }
