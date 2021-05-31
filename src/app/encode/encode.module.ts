import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { MaterialModule } from '../material/material.module';

import { EncodeRoutingModule } from './encode-routing.module';
import { EncodeAboutComponent } from './about-component/encode-about.component';
import { EncodeWellcomeComponent } from './wellcome-component/encode-wellcome.component';

@NgModule({
    declarations: [
        EncodeAboutComponent,
        EncodeWellcomeComponent
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


