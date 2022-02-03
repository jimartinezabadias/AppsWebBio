import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { UrlTree } from '@angular/router';
import { OnExit } from '../exit.guard';
import { Observable } from 'rxjs';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { IdentificationTitle1, PerpetratorCondition } from '../constants';
import { IEncodeSuspect } from '../models/IEncodeSuspect';
import { DocumentReference } from '@angular/fire/firestore';
import { EncodeSuspectIdentification } from './suspect-identification-component/suspect-identification.component';
import { EncodeIdentificationDirective } from './identification.directive';

@Component({
    selector: 'app-identification-task',
    templateUrl: './identification-task.component.html',
    styleUrls: ['identification-task.component.scss','../encode.component.scss']
})
export class EncodeIdentificationTaskComponent implements OnExit {
  
  public isIdentifing: boolean = false;

  @ViewChild(EncodeIdentificationDirective, {static: true}) identificationHost!: EncodeIdentificationDirective;
  
  constructor(
    private _dbService: DataDbService,
    private _userService: EncodeUserService, 
    private _cfr: ComponentFactoryResolver)
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
    // firstLineup = firstLineup.sort((a, b) => 0.5 - Math.random());
    // secondLineup = secondLineup.sort((a, b) => 0.5 - Math.random());

    // primer lineup: se quita uno de los sospechosos de relleno
    const fillerIndex = firstLineup.findIndex(suspect => suspect.isPerpetrator == false);
    if (fillerIndex > -1) {
      firstLineup.splice(fillerIndex, 1);
    }

    // segundo lineup: el perpetrador esta siempre ausente
    secondLineup = secondLineup.filter(suspect => suspect.isPerpetrator == false);
    
    const viewContainerRef = this.identificationHost.viewContainerRef;
    viewContainerRef.clear();

    const componentFactory = this._cfr.resolveComponentFactory(EncodeSuspectIdentification);
    const componentRef = viewContainerRef.createComponent<EncodeSuspectIdentification>(componentFactory);
    componentRef.instance.identificationTitle = IdentificationTitle1;
    componentRef.instance.lineup = firstLineup;

    this.isIdentifing = true; 
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
