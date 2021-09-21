import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataDbService } from 'src/app/core/services/db/data-db.service';

@Component({
  selector: 'app-admin-encode-user',
  templateUrl: './admin-encode-user.component.html',
  styleUrls: ['admin-encode-user.component.scss','../admin.component.scss'],
})
export class AdminEncodeUserComponent implements OnInit {

  // Columnas de la tabla que se van a mostrar
  public displayedColumns: string[] = ["email", "link", "creationDate" ];
  public userData: any;

  constructor(
    private _dbService: DataDbService,
    private route: ActivatedRoute) {}

  ngOnInit(): void 
  {
    let userIdParam = this.route.snapshot.paramMap.get('userId');
    this._dbService.getEncodeUser(userIdParam).then(data => this.userData = data);
    console.log(this.userData);
  }

}
