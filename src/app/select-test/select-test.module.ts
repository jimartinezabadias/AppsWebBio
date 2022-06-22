import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SelectTestComponent } from './components/select-test.component';

import { SelectTestRoutingModule } from './select-test-routing';
import { MaterialModule } from './../material/material.module';
import { SharedModule } from './../shared/shared.module';

@NgModule({
    declarations: [
        SelectTestComponent,
    ],
    imports: [
        CommonModule,
        SelectTestRoutingModule,
        FormsModule,
        MaterialModule,
        SharedModule
    ]
})

export class SelectTestModule {}
