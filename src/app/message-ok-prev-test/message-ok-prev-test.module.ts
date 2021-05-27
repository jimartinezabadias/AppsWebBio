import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './../material/material.module';
import { SharedModule } from './../shared/shared.module';

import { MessageOkPrevTestRoutingModule } from './message-ok-prev-test-routing.module';
import { MessageOkPrevTestComponent } from './components/message-ok-prev-test.component';


@NgModule({
  declarations: [
    MessageOkPrevTestComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    MessageOkPrevTestRoutingModule
  ]
})
export class MessageOkPrevTestModule { }
