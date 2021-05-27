import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectTestComponent } from './components/select-test.component';

const routes: Routes = [
    {
        path: '',
        component: SelectTestComponent
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

export class SelectTestRoutingModule {}
