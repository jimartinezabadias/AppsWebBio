import { Component } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { OnExit } from '../exit.guard';
import { Observable } from 'rxjs';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { PerpetratorCondition } from '../constants';
import { IEncodeSuspect } from '../models/IEncodeSuspect';
import { DocumentReference } from '@angular/fire/firestore';

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
    const perpetratorCondition = this._userService.user.sessionTwo.perpetratorCondition;
    const taskResources = await this._dbService.getEncodeTasksResources();
    const perp1suspects = this._getPerpetratorSuspects(taskResources.perpetrator1Suspects); 
    const perp2suspects = this._getPerpetratorSuspects(taskResources.perpetrator2Suspects); 
    let firstLineup: Array<IEncodeSuspect>;
    let secondLineup: Array<IEncodeSuspect>;
    
    if(perpetratorCondition == PerpetratorCondition.A){
      firstLineup = perp1suspects;
      // quitar uno de los de relleno
      secondLineup = perp2suspects.filter( suspect => suspect.isPerpetrator == false );
    }
    
    if(perpetratorCondition == PerpetratorCondition.B){
      firstLineup = perp2suspects;
      // quitar uno de los de relleno
      secondLineup = perp1suspects.filter( suspect => suspect.isPerpetrator == false );
    }
    
    console.log(firstLineup);
    console.log(secondLineup);
  }

  private _getPerpetratorSuspects(suspectDocuments: DocumentReference<IEncodeSuspect>[]): Array<IEncodeSuspect> {
    let suspects = new Array<IEncodeSuspect>();
   
    suspectDocuments.forEach( async docRef => {
      const suspectId = docRef.id;
      const suspect = await this._dbService.getEncodeSuspect(suspectId);
      suspects.push(suspect);
    });

    return suspects;
  }

}
