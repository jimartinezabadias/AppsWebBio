import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EncodeAboutComponent } from './about-component/encode-about.component';
import { EncodeAbandonedComponent } from './abandoned-component/encode-abandoned.component';
import { EncodeWellcomeComponent } from './wellcome-component/encode-wellcome.component';
import { EncodeAuthGuard } from "./encode-auth.guard";
import { EncodeMicTestComponent } from './mic-test-component/mic-test.component';
import { EncodeVideoTestComponent } from './video-test-component/video-test.component';
import { EncodeConsentComponent } from './consent-component/encode-consent.component';
import { EncodePersonalInfoComponent } from './personal-info-component/encode-personal-info.component';
import { EncodeHealthInfoComponent } from './health-info-component/health-info.component';
import { EncodeSomnolenceDegreeComponent } from './somnolence-degree-component/somnolence-degree.component';
import { EncodeVideoComponent } from './video-component/video.component';
import { EncodeAudiosComponent } from './audios-component/audios.component';
import { EncodeEndComponent } from './end-component/encode-end.component';
import { ExitGuard } from './exit.guard';
import { EncodeGoogleFormsComponent } from './google-forms-component/encode-google-forms.component';
import { EncodeAbandonedGuard } from './encode-abandoned.guard';


const routes: Routes = [
    {
        path: '',
        component: EncodeAboutComponent
    },
    {
        path: 'abandono',
        component: EncodeAbandonedComponent
    },
    {
        path: ':userId',
        canActivate: [ EncodeAuthGuard, EncodeAbandonedGuard ], 
        children: [
            {
                path: 'bienvenido',
                component: EncodeWellcomeComponent
            },
            {
                path: 'mic-test',
                component: EncodeMicTestComponent
            },
            {
                path: 'video-test',
                component: EncodeVideoTestComponent
            },
            {
                path: 'consent',
                component: EncodeConsentComponent
            },
            {
                path: 'personal-info',
                component: EncodePersonalInfoComponent
            },
            {
                path: 'health-info',
                component: EncodeHealthInfoComponent
            },
            {
                path: 'somnolence-degree',
                component: EncodeSomnolenceDegreeComponent
            },
            {
                path: 'google-forms',
                component: EncodeGoogleFormsComponent
            },
            {
                path: 'video',
                canDeactivate: [ExitGuard],
                component: EncodeVideoComponent
            },
            {
                path: 'audios',
                canDeactivate: [ExitGuard],
                component: EncodeAudiosComponent
            },
            {
                path: 'end',
                canDeactivate: [ExitGuard],
                component: EncodeEndComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class EncodeRoutingModule {}
