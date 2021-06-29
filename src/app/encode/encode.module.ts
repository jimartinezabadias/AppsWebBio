import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { MaterialModule } from '../material/material.module';

import { EncodeRoutingModule } from './encode-routing.module';
import { EncodeAboutComponent } from './about-component/encode-about.component';
import { EncodeWellcomeComponent } from './wellcome-component/encode-wellcome.component';
import { AudioRecorderComponent } from './audio-recorder-component/audio-recorder.component';
import { EncodeMicTestComponent } from './mic-test-component/mic-test.component';
import { AudioConfirmComponent } from './mic-test-component/audio-confirm-component/audio-confirm.component';
import { EncodeVideoTestComponent } from './video-test-component/video-test.component';
import { EncodeConsentComponent } from './consent-component/encode-consent.component';
import { GoogleFormComponent } from './google-form-component/google-form.component';

@NgModule({
    declarations: [
        EncodeAboutComponent,
        EncodeWellcomeComponent,
        EncodeMicTestComponent,
        AudioRecorderComponent,
        AudioConfirmComponent,
        EncodeVideoTestComponent,
        EncodeConsentComponent,
        GoogleFormComponent
    ],
    imports: [
        SharedModule,
        EncodeRoutingModule,
        FormsModule,
        MaterialModule,
        CommonModule
    ],
    exports: [],
    providers: []
})

export class EncodeModule {}


