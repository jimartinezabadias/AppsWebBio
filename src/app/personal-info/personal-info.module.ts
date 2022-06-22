import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { PersonalInfoRoutingModule } from './personal-info-routing.module';
import { MaterialModule } from '../material/material.module';

import { PersonalInfoComponent } from './components/personal-info.component';
import { FormComponent } from './components/form/form.component';

@NgModule({
  declarations: [
    PersonalInfoComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    PersonalInfoRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    PersonalInfoComponent
  ]
})

export class PersonalInfoModule { }
