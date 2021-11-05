import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { IEncodeUser } from 'src/app/encode/models/IEncodeUser';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-admin-encode-user',
  templateUrl: './admin-encode-user.component.html',
  styleUrls: ['admin-encode-user.component.scss','../../admin.component.scss'],
})
export class AdminEncodeUserComponent implements OnInit {

  // Columnas de la tabla que se van a mostrar
  public displayedColumns: string[] = ["email", "link", "creationDate" ];
  public user$ : Observable<IEncodeUser>;

  constructor(
    private _dbService: DataDbService,
    private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> 
  {
    let userIdParam = this.route.snapshot.paramMap.get('userId');
    this.user$ = from(this._dbService.getEncodeUser(userIdParam));
  }

}
