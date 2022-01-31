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
import { EncodeSuspectIdentification } from './suspect-identification-component/suspect-identification.component';

@Component({
    selector: 'app-identification-task',
    templateUrl: './identification-task.component.html',
    styleUrls: ['identification-task.component.scss','../encode.component.scss']
})
export class EncodeIdentificationTaskComponent implements OnExit {
  
  constructor(
    private _dbService: DataDbService,
    private _userService: EncodeUserService, 
    private _router: Router, 
    private _route: ActivatedRoute,
    private _dialog: MatDialog)
  {
  }

  onExit(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return true;
  }

  async openIdentificaton() {
    const userPerpetratorCondition = this._userService.user.sessionTwo.perpetratorCondition;
    const taskResources = await this._dbService.getEncodeTasksResources();
    const perp1suspects = await this._getPerpetratorSuspects(taskResources.perpetrator1Suspects); 
    const perp2suspects = await this._getPerpetratorSuspects(taskResources.perpetrator2Suspects); 
    
    let firstLineup: Array<IEncodeSuspect>;
    let secondLineup: Array<IEncodeSuspect>;
    
    if(userPerpetratorCondition == PerpetratorCondition.A) {
      firstLineup = perp1suspects;
      secondLineup = perp2suspects;
    }
    
    if(userPerpetratorCondition == PerpetratorCondition.B) {
      firstLineup = perp2suspects;
      secondLineup = perp1suspects;
    }

    // shuffle
    firstLineup = firstLineup.sort((a, b) => 0.5 - Math.random());
    secondLineup = secondLineup.sort((a, b) => 0.5 - Math.random());

    // primer lineup: se quita uno de los sospechosos de relleno
    const fillerIndex = firstLineup.findIndex(suspect => suspect.isPerpetrator == false);
    if (fillerIndex > -1) {
      firstLineup.splice(fillerIndex, 1);
    }

    // segundo lineup: el perpetrador esta siempre ausente
    secondLineup = secondLineup.filter(suspect => suspect.isPerpetrator == false);

    console.log("firstLineup");
    console.log(firstLineup);
    console.log("secondLineup");
    console.log(secondLineup);

    secondLineup.forEach(async suspect => {
      const suspectImageUrl = await this._dbService.getCloudStorageFileRef(suspect.photo).getDownloadURL().toPromise<string>();
      console.log(suspectImageUrl);
    });
    
    // open dialog

    // const identificationDialogConfig = { 
    //   disableClose: true, 
    //   closeOnNavigation: false,
    //   backdropClass: 'backdropBackground',
    //   panelClass: 'custom-background'
    // };

    // const identificationComponentRef = this._dialog.open(EncodeSuspectIdentification, identificationDialogConfig);
    // identificationComponentRef.componentInstance.lineup = firstLineup;
    // antes de cerrar mostar nivel de confianza
    // identificationComponentRef.beforeClosed().subscribe();
    // despues de cerrar abrir la segunda ronda con el otro lineup
    // identificationComponentRef.afterClosed().subscribe();
  }

  private _getPerpetratorSuspects(suspectDocuments: Array<DocumentReference<IEncodeSuspect>>): Promise<Array<IEncodeSuspect>> {
    let suspects = new Array<Promise<IEncodeSuspect>>();
   
    suspectDocuments.forEach( docRef => {
      const suspectId = docRef.id;
      const suspect = this._dbService.getEncodeSuspect(suspectId);
      suspects.push(suspect);
    });

    return Promise.all(suspects);
  }

}
