import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { MaterialModule } from '../material/material.module';

import { EncodeRoutingModule } from './encode-routing.module';
import { EncodeAboutComponent } from './encode-about/encode-about.component';

@NgModule({
    declarations: [
        EncodeAboutComponent
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


