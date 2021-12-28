import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './components/admin.component';

import { SharedModule } from '../shared/shared.module';

import { HttpClientModule } from '@angular/common/http';
import { FileSaverModule } from 'ngx-filesaver';

import { DataDbService } from '../core/services/db/data-db.service';


import { MatTableModule } from "@angular/material/table";
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';

import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AdminCreativityComponent } from './components/admin-creativity/admin-creativity.component';
import { AdminRulitComponent } from './components/admin-rulit/admin-rulit.component';
import { AdminEncodeComponent } from './components/admin-encode/admin-encode.component';
import { AudiosDownload } from './components/admin-encode/audios-download/audios-download';
import { AdminEncodeUserComponent } from './components/admin-encode/encode-user/admin-encode-user.component';
import { InviteFormComponent } from './components/admin-encode/invite-form-component/invite-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { EncodeLinkPipe } from './components/admin-encode/encode-link.pipe';
@NgModule({
  providers: [
    DataDbService
  ],
  declarations: [
    AdminComponent,
    AdminCreativityComponent,
    AdminRulitComponent,
    AdminEncodeComponent,
    AdminEncodeUserComponent,
    InviteFormComponent,
    EncodeLinkPipe,
    AudiosDownload
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    HttpClientModule,
    FileSaverModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})

export class AdminModule { }
