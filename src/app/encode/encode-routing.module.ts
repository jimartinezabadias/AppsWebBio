import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EncodeAboutComponent } from './about-component/encode-about.component';
import { EncodeWellcomeComponent } from './wellcome-component/encode-wellcome.component';
import { AuthGuard } from "./auth.guard";

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
