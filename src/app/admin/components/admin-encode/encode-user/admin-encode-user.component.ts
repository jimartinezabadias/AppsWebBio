import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { IEncodeUser } from 'src/app/encode/models/IEncodeUser';
import { IEncodeSessionTwo } from 'src/app/encode/models/IEncodeSessionTwo';
import { EncodeUserService } from 'src/app/encode/services/EncodeUserService';
import { from, Observable } from 'rxjs';
import { Gender, EducationLevel, SomnolenceDegree, PerpetratorCondition } from 'src/app/encode/constants';

@Component({
  selector: 'app-admin-encode-user',
  templateUrl: './admin-encode-user.component.html',
  styleUrls: ['admin-encode-user.component.scss','../../admin.component.scss'],
})
export class AdminEncodeUserComponent implements OnInit {

  // Columnas de la tabla que se van a mostrar
  public displayedColumns: string[] = ["email", "link", "creationDate" ];
  public user$ : Observable<IEncodeUser>;
  public genders = Gender;
  public educationLevels = EducationLevel;
  public somnolenceDegrees = SomnolenceDegree;

  constructor(
    private _dbService: DataDbService,
    private _route: ActivatedRoute,
    private _userService: EncodeUserService) {}

  async ngOnInit(): Promise<void> 
  {
    let userIdParam = this._route.snapshot.paramMap.get('userId');
    this.user$ = from(this._dbService.getEncodeUser(userIdParam));
    this._userService.loadUser(userIdParam);
  }

  public startDayTwo(perpetratorCondition: PerpetratorCondition) 
  {
    const dayTwoData: IEncodeSessionTwo = { completed: false, perpetratorCondition: perpetratorCondition, somnolenceDegree: null };
    this._userService.user.sessionTwo = dayTwoData;
    this._userService.saveSessionOneResults();
    this.ngOnInit();
  }

}