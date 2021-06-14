import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { MaterialModule } from '../material/material.module';

import { EncodeRoutingModule } from './encode-routing.module';
import { EncodeAboutComponent } from './about-component/encode-about.component';
import { EncodeWellcomeComponent } from './wellcome-component/encode-wellcome.component';
import { AudioRecorderComponent } from './audio-recorder-component/audio-recorder.component';
import { EncodeMicTestComponent } from './mic-test-component/mic-test.component';

@NgModule({
    declarations: [
        EncodeAboutComponent,
        EncodeWellcomeComponent,
        EncodeMicTestComponent,
        AudioRecorderComponent
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


