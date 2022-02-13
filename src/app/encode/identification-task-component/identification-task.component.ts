import { Component, ComponentFactoryResolver, ComponentRef, ViewChild } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { UrlTree } from '@angular/router';
import { OnExit } from '../exit.guard';
import { Observable } from 'rxjs';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { ROOM_1_TITLE, PerpetratorCondition, ABSENT_SUSPECT_ID } from '../constants';
import { IEncodeSuspect } from '../models/IEncodeSuspect';
import { DocumentReference } from '@angular/fire/firestore';
import { EncodeIdentificationRoom } from './identification-room-component/identification-room.component';
import { EncodeIdentificationRoomDirective } from './identification-room.directive';
import { IEncodeIdentificationResponse } from '../models/IEncodeIdentificationResponse';

@Component({
    selector: 'app-identification-task',
    templateUrl: './identification-task.component.html',
    styleUrls: ['identification-task.component.scss','../encode.component.scss']
})
export class EncodeIdentificationTaskComponent implements OnExit {
  
  private _actualRoomRef: ComponentRef<EncodeIdentificationRoom>;
  
  public isIdentifing: boolean = false;

  @ViewChild(EncodeIdentificationRoomDirective, {static: true}) identificationRoomHost!: EncodeIdentificationRoomDirective;
  
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
    const perp1suspects = await this._getSuspectsOfBeing(taskResources.perpetrator1Suspects); 
    const perp2suspects = await this._getSuspectsOfBeing(taskResources.perpetrator2Suspects); 
    
    console.log(perp1suspects)
    console.log(perp2suspects)

    taskResources.perpetrator1Suspects.forEach( (suspectDocRef, index: number) => {
      perp1suspects[index].id = suspectDocRef.id;
    });
    
    taskResources.perpetrator2Suspects.forEach( (suspectDocRef, index: number) => {
      perp2suspects[index].id = suspectDocRef.id;
    });
    
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
    firstLineup.sort((a, b) => 0.5 - Math.random());
    secondLineup.sort((a, b) => 0.5 - Math.random());

    // primer lineup: se quita uno de los sospechosos de relleno
    const fillerIndex = firstLineup.findIndex(suspect => suspect.isPerpetrator == false && suspect.id != ABSENT_SUSPECT_ID);
    if (fillerIndex > -1) {
      firstLineup.splice(fillerIndex, 1);
    }

    // segundo lineup: el perpetrador esta siempre ausente
    secondLineup = secondLineup.filter(suspect => suspect.isPerpetrator == false && suspect.id != ABSENT_SUSPECT_ID);
    
    const viewContainerRef = this.identificationRoomHost.viewContainerRef;
    viewContainerRef.clear();

    const componentFactory = this._cfr.resolveComponentFactory(EncodeIdentificationRoom);
    this._actualRoomRef = viewContainerRef.createComponent<EncodeIdentificationRoom>(componentFactory);
    this._actualRoomRef.instance.roomTitle = ROOM_1_TITLE;
    this._actualRoomRef.instance.lineup = firstLineup;
    this._actualRoomRef.instance.suspectIdentified.subscribe(this.onSuspectIdentified);

    this.isIdentifing = true; 
  }

  // todo
  // recibir respuesta en vez de id
  // response: IEncodeIdentificationResponse
  private onSuspectIdentified = (suspectId: string): void => {
    console.log("respuesta identification: " + suspectId);
    this._actualRoomRef.destroy();
    this.isIdentifing = false;
    // todo
    // guardar respuesta
    // abrir proximo room
  }

  private _getSuspectsOfBeing(suspectDocuments: Array<DocumentReference<IEncodeSuspect>>): Promise<Array<IEncodeSuspect>> {
    let suspects = new Array<Promise<IEncodeSuspect>>();
   
    suspectDocuments.forEach( async docRef => {
      const suspectId = docRef.id;
      const suspect = this._dbService.getEncodeSuspect(suspectId);
      suspects.push(suspect);
    });

    return Promise.all(suspects);
  }
}
