import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { UsersService } from './services/users/users.service';
import { DataDbService } from './services/db/data-db.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    // UsersService,
    DataDbService
  ]
})
export class CoreModule { }
