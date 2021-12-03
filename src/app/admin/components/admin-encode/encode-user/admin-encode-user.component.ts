import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { IEncodeUser } from 'src/app/encode/models/IEncodeUser';
import { EncodeUserService } from 'src/app/encode/services/EncodeUserService';
import { from, Observable } from 'rxjs';
import { Genders, EducationLevels, SomnolenceDegrees } from 'src/app/encode/constants';

@Component({
  selector: 'app-admin-encode-user',
  templateUrl: './admin-encode-user.component.html',
  styleUrls: ['admin-encode-user.component.scss','../../admin.component.scss'],
})
export class AdminEncodeUserComponent implements OnInit {

  // Columnas de la tabla que se van a mostrar
  public displayedColumns: string[] = ["email", "link", "creationDate" ];
  public user$ : Observable<IEncodeUser>;
  public genders = Genders;
  public educationLevels = EducationLevels;
  public somnolenceDegrees = SomnolenceDegrees;

  constructor(
    private _dbService: DataDbService,
    private route: ActivatedRoute,
    private _userService: EncodeUserService) {}

  async ngOnInit(): Promise<void> 
  {
    let userIdParam = this.route.snapshot.paramMap.get('userId');
    this.user$ = from(this._dbService.getEncodeUser(userIdParam));
  }

  public async startDayTwo(perpetrator: boolean) 
  {
    this._userService.user.dayTwo.hasPerpetrator = perpetrator;
    this._userService.user.dayTwo.completed = false;
  }

}
