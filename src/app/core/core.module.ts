import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EncodeFirestoreService } from './encodeFirestore.service';
import { EncodeStorageService } from './encodeStorage.service';
import { RulitFirestoreService } from './rulitFirestore.service';
import { CreativityFirestoreService } from './creativityFirestore.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ CreativityFirestoreService, RulitFirestoreService, EncodeFirestoreService, EncodeStorageService ]
})
export class CoreModule { }
