import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EncodeAboutComponent } from './about-component/encode-about.component';
import { EncodeWellcomeComponent } from './wellcome-component/encode-wellcome.component';
import { EncodeAuthGuard } from "./encode-auth.guard";
import { EncodeMicTestComponent } from './mic-test-component/mic-test.component';
import { EncodeVideoTestComponent } from './video-test-component/video-test.component';
import { EncodeConsentComponent } from './consent-component/encode-consent.component';
import { EncodePersonalInfoComponent } from './personal-info-component/encode-personal-info.component';
import { EncodeHealthInfoComponent } from './health-info-component/health-info.component';
import { EncodeSomnolenceDegreeComponent } from './somnolence-degree-component/somnolence-degree.component';
import { EncodeVideoComponent } from './video-component/video.component';
import { EncodeVideoDialogComponent } from './video-dialog-component/video-dialog.component';
import { EncodeFormListComponent } from './form-list-component/form-list.component';
import { EncodeAudiosComponent } from './audios-component/audios.component';
import { EncodeEndComponent } from './end-component/encode-end.component';
import { ExitGuard } from './exit.guard';


const routes: Routes = [
    {
        path: '',
        component: EncodeAboutComponent
    },
    {
        path: ':userId',
        canActivate: [ EncodeAuthGuard ],
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
                path: 'form-list',
                component: EncodeFormListComponent
            },
            {
                path: 'video',
                canDeactivate: [ExitGuard],
                component: EncodeVideoComponent
            },
            {
                path: 'video-dialog',
                canDeactivate: [ExitGuard],
                component: EncodeVideoDialogComponent
            },
            {
                path: 'audios',
                component: EncodeAudiosComponent
            },
            {
                path: 'end',
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
