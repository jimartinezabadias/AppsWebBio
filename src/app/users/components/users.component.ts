import { Component, OnInit } from '@angular/core';

import { CreativeUser } from './../../core/models/creative-user.interface';
import { DataDbService } from '../../core/services/db/data-db.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users = [];
  displayedColumns: string[] = ['name', 'lastName', 'age', 'points'];

  constructor(
    private dataDbService: DataDbService // inyecta dependencia
  ) { }

  ngOnInit() { }


}
