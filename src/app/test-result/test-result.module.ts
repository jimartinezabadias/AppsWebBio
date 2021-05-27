import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestResultComponent } from './components/test-result/test-result.component';

import { TestResultRoutingModule } from './test-result-routing.module';
import { MaterialModule } from './../material/material.module';
import { SharedModule } from './../shared/shared.module';
// import { ProposalComponent } from './../testCreativity/components/proposal/proposal.component';
@NgModule({
  declarations: [
    TestResultComponent,
    // ProposalComponent
  ],
  imports: [
    CommonModule,
    TestResultRoutingModule,
    MaterialModule,
    SharedModule,
  ]
})
export class TestResultModule { }
