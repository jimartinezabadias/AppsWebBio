import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { MaterialModule } from '../material/material.module';

import { EncodeRoutingModule } from './encode-routing.module';
import { AboutEncodeComponent } from './about-component/about-encode.component';

@NgModule({
    declarations: [
        AboutEncodeComponent
    ],
    imports: [
        SharedModule,
        EncodeRoutingModule,
        ReactiveFormsModule,
        MaterialModule,
        CommonModule
    ],
    exports: [],
    providers: []
})

export class EncodeModule {}


