import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataDbService } from './services/db/data-db.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ DataDbService ]
})
export class CoreModule { }
