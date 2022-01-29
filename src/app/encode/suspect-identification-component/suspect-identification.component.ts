import { Component } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { OnExit } from '../exit.guard';
import { Observable } from 'rxjs';
import { DataDbService } from 'src/app/core/services/db/data-db.service';

@Component({
    selector: 'app-suspect-identification',
    templateUrl: './suspect-identification.component.html',
    styleUrls: ['suspect-identification.component.scss','../encode.component.scss']
})
export class EncodeSuspectIdentificationComponent implements OnExit {
  
  constructor(
    private _dbService: DataDbService,
    private _userService: EncodeUserService, 
    private _router: Router, 
    private _route: ActivatedRoute,
    private _dialog: MatDialog)
  {
  }

  onExit(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>{
    return true;
  }

  async openIdentificaton() {
    const suspects = await this._dbService.getEncodeSuspects();
    const perpetratorCondition = this._userService.user.sessionTwo.perpetratorCondition;
  }
  
}
