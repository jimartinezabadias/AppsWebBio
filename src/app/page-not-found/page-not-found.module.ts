import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PageNotFoundComponent } from './components/page-not-found.component';
import { SharedModule } from './../shared/shared.module';

import { PageNotFoundRoutingModule } from './page-not-found-routing';
import { MaterialModule } from './../material/material.module';
import { from } from 'rxjs';

@NgModule({
    declarations: [
        PageNotFoundComponent
    ],
    imports: [
        CommonModule,
        PageNotFoundRoutingModule,
        FormsModule,
        MaterialModule,
        SharedModule
    ]
})

export class PageNotFoundModule {}
