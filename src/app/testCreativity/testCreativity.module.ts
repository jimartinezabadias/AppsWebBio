import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TestCreativityRoutingModule } from './testCreativity-routing.module';
import { MaterialModule } from './../material/material.module';
import { SharedModule } from './../shared/shared.module';
import { PersonalInfoModule } from './../personal-info/personal-info.module';

import { TestCreativityComponent } from './components/testCreativity.component';
import { DataDbService } from '../core/services/db/data-db.service';

@NgModule({
    declarations: [
        TestCreativityComponent
    ],
    imports: [
        CommonModule,
        TestCreativityRoutingModule,
        FormsModule,
        MaterialModule,
        SharedModule,
        PersonalInfoModule,
    ],
    exports: [
        TestCreativityComponent
    ],
    providers: [DataDbService]
})

export class TestCreativityModule {}


