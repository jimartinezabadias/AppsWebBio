import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TestCreativityRoutingModule } from './testCreativity-routing.module';
import { MaterialModule } from './../material/material.module';
import { SharedModule } from './../shared/shared.module';
import { PersonalInfoModule } from './../personal-info/personal-info.module';

import { TestCreativityComponent } from './components/testCreativity.component';
import { ClockComponent } from './components/clock/clock.component';
import { ElementComponent } from './components/element/element.component';
import { CreativeUserComponent } from './components/creative-user/creative-user.component';
import { DataDbService } from '../core/services/db/data-db.service';

@NgModule({
    declarations: [
        TestCreativityComponent,
        ClockComponent,
        ElementComponent,
        CreativeUserComponent,
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
        TestCreativityComponent,
        ClockComponent,
        ElementComponent,
        CreativeUserComponent,
    ],
    providers: [DataDbService]
})

export class TestCreativityModule {}


