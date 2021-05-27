import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MoreInfoRoutingModule } from './more-info-routing.module';
import { MoreInfoComponent } from './components/more-info.component';
import { BioComponent } from './components/bio/bio.component';

import { MaterialModule } from './../material/material.module';


@NgModule({
  declarations: [MoreInfoComponent, BioComponent],
  imports: [
    CommonModule,
    MoreInfoRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class MoreInfoModule { }
