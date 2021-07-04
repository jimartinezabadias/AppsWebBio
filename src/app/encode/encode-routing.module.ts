import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EncodeAboutComponent } from './about-component/encode-about.component';
import { EncodeWellcomeComponent } from './wellcome-component/encode-wellcome.component';
import { EncodeAuthGuard } from "./encode-auth.guard";
import { EncodeMicTestComponent } from './mic-test-component/mic-test.component';
import { EncodeVideoTestComponent } from './video-test-component/video-test.component';
import { EncodeConsentComponent } from './consent-component/encode-consent.component';
import { GoogleFormComponent } from './google-form-component/google-form.component';

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
                path: 'google-form',
                component: GoogleFormComponent
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
