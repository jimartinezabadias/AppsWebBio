import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { IEncodeUser } from 'src/app/encode/models/IEncodeUser';
import { Gender, EducationLevel, SomnolenceDegree, PerpetratorCondition } from 'src/app/encode/constants';
import { Observable, from } from "rxjs";
import { take, tap } from "rxjs/operators";

@Component({
  selector: 'app-admin-encode-user',
  templateUrl: './admin-encode-user.component.html',
  styleUrls: ['admin-encode-user.component.scss','../../admin.component.scss'],
})
export class AdminEncodeUserComponent implements OnInit {

  private _user: IEncodeUser | null = null;
  
  // Columnas de la tabla que se van a mostrar
  public displayedColumns: string[] = ["email", "link", "creationDate" ];
  public user$ : Observable<IEncodeUser>;
  public genders = Gender;
  public educationLevels = EducationLevel;
  public somnolenceDegrees = SomnolenceDegree;
  public selectedPerpetratorCondition: PerpetratorCondition | null = null;

  constructor(
    private _dbService: DataDbService,
    private _route: ActivatedRoute) {}

  get perpetratorConditions() 
  {
    return PerpetratorCondition;
  }

  async ngOnInit(): Promise<void> 
  {
    let userIdParam = this._route.snapshot.paramMap.get('userId');
    this.user$ = from(this._dbService.getEncodeUser(userIdParam));
    const userSubject = this.user$.pipe(
      take(1), 
      tap( (userData: IEncodeUser) => {
        this._user = userData;
        if (this._user.sessionTwo != null){
          this.selectedPerpetratorCondition = this._user.sessionTwo.perpetratorCondition;
        }

        userSubject.unsubscribe();
      } ))
      .subscribe();
  }

  public applyPerpetratorCondition(): void {
    this._user.sessionTwo.perpetratorCondition = this.selectedPerpetratorCondition;
    this._dbService.updateEncodeUser(this._user);
  }

}