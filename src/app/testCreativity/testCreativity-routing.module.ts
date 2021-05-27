import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestCreativityComponent } from './components/testCreativity.component';
import { FormComponent } from '../personal-info/components/form/form.component';
// import { FormComponent } from './../personal-info/components/form/form.component';

const routes: Routes = [
    {
        path: '',
        component: TestCreativityComponent,
        children: [
            {
                path: 'personal-info',
                component: FormComponent
            }
        ]
    },

];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class TestCreativityRoutingModule {}
