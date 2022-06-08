import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataDbService } from './services/db/data-db.service';
import { EncodeFirestoreService } from './encodeFirestore.service';
import { EncodeStorageService } from './encodeStorage.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ DataDbService, EncodeFirestoreService, EncodeStorageService ]
})
export class CoreModule { }
