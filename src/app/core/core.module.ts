import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataDbService } from './services/db/data-db.service';
import { FirestoreService } from './firestore.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ DataDbService, FirestoreService ]
})
export class CoreModule { }
