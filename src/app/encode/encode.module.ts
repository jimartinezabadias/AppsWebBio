import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { EncodePersonalInfoComponent } from './personal-info-component/encode-personal-info.component';
import { EncodeHealthInfoComponent } from './health-info-component/health-info.component';
import { EncodeSomnolenceDegreeComponent } from './somnolence-degree-component/somnolence-degree.component';
import { EncodeVideoComponent } from './video-component/video.component';
import { EncodeFormListComponent } from './form-list-component/form-list.component';
import { EncodeAudiosComponent } from './audios-component/audios.component';
import { EncodeEndComponent } from './end-component/encode-end.component';

@NgModule({
    declarations: [
        EncodeAboutComponent,
        EncodeWellcomeComponent,
        EncodeMicTestComponent,
        AudioRecorderComponent,
        AudioConfirmComponent,
        EncodeVideoTestComponent,
        EncodeConsentComponent,
        EncodePersonalInfoComponent,
        EncodeHealthInfoComponent,
        EncodeSomnolenceDegreeComponent,
        EncodeVideoComponent,
        EncodeFormListComponent,
        EncodeAudiosComponent,
        EncodeEndComponent
    ],
    imports: [
        SharedModule,
        EncodeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CommonModule
    ],
    exports: [],
    providers: []
})

export class EncodeModule {}


