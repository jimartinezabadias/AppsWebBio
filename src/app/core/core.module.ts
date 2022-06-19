import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataDbService } from './services/db/data-db.service';
import { EncodeFirestoreService } from './encodeFirestore.service';
import { EncodeStorageService } from './encodeStorage.service';
import { RulitFirestoreService } from './rulitFirestore.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ DataDbService, RulitFirestoreService, EncodeFirestoreService, EncodeStorageService ]
})
export class CoreModule { }
