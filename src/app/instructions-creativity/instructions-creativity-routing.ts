import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstructionsCreativityComponent } from './components/instructionsCreativity.component';

const routes: Routes = [
    {
        path: '',
        component: InstructionsCreativityComponent
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

export class InstructionsCreativityRoutingModule {}
