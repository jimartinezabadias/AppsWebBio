import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { EncodeRoutingModule } from './encode-routing.module';
import { EncodeAboutComponent } from './about-component/encode-about.component';
import { EncodeWellcomeComponent } from './wellcome-component/encode-wellcome.component';
import { AudioRecorderComponent } from './audio-recorder-component/audio-recorder.component';
import { EncodeMicTestComponent } from './mic-test-component/mic-test.component';
import { AudioConfirmComponent } from './mic-test-component/audio-confirm-component/audio-confirm.component';
import { AudioDisclaimerComponent } from './audio-recorder-component/audio-disclaimer-component/audio-disclaimer.component';
import { EncodeVideoTestComponent } from './video-test-component/video-test.component';
import { EncodeConsentComponent } from './consent-component/encode-consent.component';
import { EncodePersonalInfoComponent } from './personal-info-component/encode-personal-info.component';
import { EncodeHealthInfoComponent } from './health-info-component/health-info.component';
import { EncodeSomnolenceDegreeComponent } from './somnolence-degree-component/somnolence-degree.component';
import { EncodeVideoComponent } from './video-component/video.component';
import { MyVideoComponent } from './video-component/dialogs/video-dialog/video-dialog.component';
import { EncodeAudiosComponent } from './audios-component/audios.component';
import { EncodeEndComponent } from './end-component/encode-end.component';
import { ExitConfirmComponent } from './exit-confirm-component/exit-confirm.component';
import { EncodeGoogleFormsComponent } from './google-forms-component/encode-google-forms.component';
import { ByPassSecurityPipe } from './google-forms-component/by-pass-security.pipe';
import { EncodeAudioListComponent } from './audios-component/audios-list-component/audio-list.component';
import { ExtendedRecallComponent } from './audios-component/extended-recall-component/extended-recall.component';
import { EncodeAbandonedComponent } from './abandoned-component/encode-abandoned.component';

@NgModule({
    declarations: [
        EncodeAboutComponent,
        EncodeAbandonedComponent,
        EncodeWellcomeComponent,
        EncodeMicTestComponent,
        AudioRecorderComponent,
        AudioConfirmComponent,
        AudioDisclaimerComponent,
        EncodeVideoTestComponent,
        EncodeConsentComponent,
        EncodePersonalInfoComponent,
        EncodeHealthInfoComponent,
        EncodeSomnolenceDegreeComponent,
        EncodeVideoComponent,
        MyVideoComponent,
        EncodeAudiosComponent,
        EncodeEndComponent,
        ExitConfirmComponent,
        EncodeGoogleFormsComponent,
        ByPassSecurityPipe,
        EncodeAudioListComponent,
        ExtendedRecallComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        EncodeRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [],
    providers: []
})

export class EncodeModule {}


