import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EncodeAboutComponent } from './about-component/encode-about.component';
import { EncodeWellcomeComponent } from './wellcome-component/encode-wellcome.component';
import { AuthGuard } from "./auth.guard";
import { EncodeMicTestComponent } from './mic-test-component/mic-test.component';

const routes: Routes = [
    {
        path: '',
        component: EncodeAboutComponent
    },
    {
        path: ':userId',
        canActivate: [ AuthGuard ],
        children: [
            {
                path: 'bienvenido',
                component: EncodeWellcomeComponent
            },
            {
                path: 'mic-test',
                component: EncodeMicTestComponent
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
