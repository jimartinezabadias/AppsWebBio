import { Component, ComponentFactoryResolver, ComponentRef, ViewChild } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { OnExit } from '../exit.guard';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { ROOM_1_TITLE, PerpetratorCondition, ABSENT_SUSPECT_ID, ROOM_2_TITLE } from '../constants';
import { IEncodeSuspect } from '../models/IEncodeSuspect';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { EncodeIdentificationRoom } from './identification-room-component/identification-room.component';
import { EncodeIdentificationRoomDirective } from './identification-room.directive';
import { IEncodeIdentificationResponse } from '../models/IEncodeIdentificationResponse';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';

@Component({
    selector: 'app-identification-task',
    templateUrl: './identification-task.component.html',
    styleUrls: ['identification-task.component.scss','../encode.component.scss']
})
export class EncodeIdentificationTaskComponent implements OnExit {
  
  public isIdentifing: boolean = false;
  public isLoadingLineups: boolean = false;
  public currentRoom: number = 1;

  @ViewChild(EncodeIdentificationRoomDirective, {static: true}) identificationRoomHost!: EncodeIdentificationRoomDirective;
  
  constructor(
    private _dbService: DataDbService,
    private _userService: EncodeUserService, 
    private _cfr: ComponentFactoryResolver,
    private _router: Router,
    private _route: ActivatedRoute,
    private _dialog: MatDialog)
  {
  }

  onExit(): Observable<boolean> | Promise<boolean> | boolean {
    const exitDialogRef = this._dialog.open(ExitConfirmComponent);
    exitDialogRef.afterClosed().subscribe(this._exitDialogClosed$);
    return exitDialogRef.afterClosed().toPromise<boolean>();
  }

  private _exitDialogClosed$ = async (response: boolean): Promise<boolean> => {
    if (response == true){ 
      await this._userService.abandonTest();
      this._router.navigate(["/"]);
    } 

    return false;
  }

  async openIdentificaton() {
    this.isLoadingLineups = true;
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
    secondLineup = secondLineup.filter(suspect => suspect.isPerpetrator == false);
    
    // cargo el primer room
    let actualRoomRef = this._createRoomComponent(ROOM_1_TITLE, firstLineup); 
    const firstRoomResult = actualRoomRef.instance.suspectIdentifiedEvent;
    firstRoomResult.subscribe(this.saveIdentificationResponse);
    
    this.isLoadingLineups = false;
    this.isIdentifing = true; 
    await firstRoomResult.toPromise();
    
    this.isIdentifing = false;
    actualRoomRef.destroy();

    // cargo el segundo room
    this.isLoadingLineups = true;
    this.currentRoom = 2;
    
    setTimeout(async () => {
      actualRoomRef = this._createRoomComponent(ROOM_2_TITLE, secondLineup); 
      const secondRoomResult = actualRoomRef.instance.suspectIdentifiedEvent;
      secondRoomResult.subscribe(this.saveIdentificationResponse);
      
      this.isIdentifing = true;
      await secondRoomResult.toPromise();

      this.isIdentifing = false;
      actualRoomRef.destroy();
  
      this.onExit = () => true;
      this._router.navigate(["../audios"], { relativeTo: this._route });
    }, 2000)
  }

  private saveIdentificationResponse = (response: IEncodeIdentificationResponse): void => {
    response.selectedSuspect.photoImageUrl = null;
    if (this._userService.user.sessionTwo.identificationResponse == null) {
      this._userService.user.sessionTwo.identificationResponse = new Array<IEncodeIdentificationResponse>();
    }

    this._userService.user.sessionTwo.identificationResponse.push(response);
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

  private _createRoomComponent(
    roomTitle: typeof ROOM_1_TITLE | typeof ROOM_2_TITLE, 
    firstLineup: Array<IEncodeSuspect>): ComponentRef<EncodeIdentificationRoom> 
  {
    const componentFactory = this._cfr.resolveComponentFactory(EncodeIdentificationRoom);
    const viewContainerRef = this.identificationRoomHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<EncodeIdentificationRoom>(componentFactory);
    componentRef.instance.roomTitle = roomTitle;
    componentRef.instance.lineup = firstLineup;

    return componentRef;
  }
}