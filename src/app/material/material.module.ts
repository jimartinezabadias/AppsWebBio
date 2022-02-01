import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from '@angular/cdk/layout';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorIntlES } from './custom/mat-paginator-intl_ES';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatBadgeModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatSortModule,
    LayoutModule,
    ClipboardModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    MatTabsModule,
    MatStepperModule,
    MatButtonToggleModule
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatBadgeModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatSortModule,
    LayoutModule,
    ClipboardModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    MatTabsModule,
    MatStepperModule,
    MatButtonToggleModule
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlES}]
})
export class MaterialModule { }
