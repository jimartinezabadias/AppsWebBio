import { Component, ComponentFactoryResolver, ComponentRef, ViewChild } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
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
    private _cfr: ComponentFactoryResolver,
    private _router: Router,
    private _route: ActivatedRoute)
  {
  }

  onExit(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return true;
  }

  async openIdentificaton() {
    this.isIdentifing = true; 
    const userPerpetratorCondition = this._userService.user.sessionTwo.perpetratorCondition;
    const taskResources = await this._dbService.getEncodeTasksResources();
    const perp1suspects = await this._getSuspectsOfBeing(taskResources.perpetrator1Suspects); 
    const perp2suspects = await this._getSuspectsOfBeing(taskResources.perpetrator2Suspects); 

    this._getSuspectsPhotos(taskResources.perpetrator1Suspects, perp1suspects);
    this._getSuspectsPhotos(taskResources.perpetrator2Suspects, perp2suspects);
   
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
    
    const identifySuspect1 = this._actualRoomRef.instance.suspectIdentifiedEvent;
    identifySuspect1.subscribe(this.onSuspectIdentified);
    
    await identifySuspect1.toPromise();
    
    // todo
    // abrir proximo room
  }

  public skipIdentificaton(): void {
    this._router.navigate(["../audios"], { relativeTo: this._route });
  }

  private onSuspectIdentified = (response: IEncodeIdentificationResponse): void => {
    response.selectedSuspect.photoImageUrl = null;
    if (this._userService.user.sessionTwo.identificationResponse == null) {
      this._userService.user.sessionTwo.identificationResponse = new Array<IEncodeIdentificationResponse>();
    }

    this._userService.user.sessionTwo.identificationResponse.push(response);
    this._actualRoomRef.destroy();
    this.isIdentifing = false;
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

  private _getSuspectsPhotos(perpSuspectsDocs: DocumentReference<IEncodeSuspect>[], perpSuspects: IEncodeSuspect[]): void {
    perpSuspectsDocs.forEach( async (suspectDocRef, index: number) => {
      const suspect = perpSuspects[index];
      suspect.id = suspectDocRef.id;
      suspect.photoImageUrl = await this._dbService.getCloudStorageFileRef(suspect.photoStorageRef).getDownloadURL().toPromise<string>();
    });
  }
}
