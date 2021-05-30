import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutEncodeComponent } from './about-component/about-encode.component';

const routes: Routes = [
    {
        path: '',
        component: AboutEncodeComponent,
        pathMatch: 'full'
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
