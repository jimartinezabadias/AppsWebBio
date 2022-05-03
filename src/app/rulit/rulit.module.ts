import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { RulitRoutingModule } from './rulit-routing.module';
import { RulitTestComponent } from './components/rulit-test/rulit-test.component';
import { RulitInstructionsComponent } from './components/rulit-instructions/rulit-instructions.component';
import { RulitUserService } from './bits/RulitUserService';
import { RulitUserFormComponent } from './components/rulit-user-form/rulit-user-form.component';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { ScreenOrientationDialogComponent } from './components/rulit-test/dialogs/orientation-dialog.component';
import { LongMemoryWellcomeDialogComponent } from './components/rulit-test/dialogs/long-memory-wellcome-dialog.component';
import { FinishTestDialogComponent } from './components/rulit-test/dialogs/finish-test-dialog.component';
import { CarouselComponent } from './components/rulit-instructions/components/carousel/carousel.component';
import { NotConnectedNodeDialogComponent } from './components/rulit-test/dialogs/not-connected-node-dialog.component';
import { RulitTestService } from './bits/RulitTestService';

@NgModule({
    declarations: [
        RulitInstructionsComponent,
        RulitUserFormComponent,
        RulitTestComponent,
        ScreenOrientationDialogComponent,
        FinishTestDialogComponent,
        LongMemoryWellcomeDialogComponent,
        NotConnectedNodeDialogComponent,
        CarouselComponent,
    ],
    imports: [
        SharedModule,
        RulitRoutingModule,
        ReactiveFormsModule,
        MaterialModule,
        CommonModule
    ],
    exports: [],
    providers: [RulitUserService, RulitTestService]
})

export class RulitModule {}


