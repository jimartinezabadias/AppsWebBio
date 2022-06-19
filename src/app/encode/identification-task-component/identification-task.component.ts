import { Component, ComponentRef, ViewChild } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { ActivatedRoute, Router } from '@angular/router';
import { OnExit } from '../exit.guard';
import { MatDialog } from '@angular/material/dialog';
import { ROOM_1_TITLE, PerpetratorCondition, ABSENT_SUSPECT_ID, ROOM_2_TITLE } from '../constants';
import { IEncodeSuspect } from '../models/IEncodeSuspect';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { EncodeIdentificationRoom } from './identification-room-component/identification-room.component';
import { EncodeIdentificationRoomDirective } from './identification-room.directive';
import { IEncodeIdentificationResponse } from '../models/IEncodeIdentificationResponse';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';
import { lastValueFrom } from 'rxjs';
import { EncodeFirestoreService } from 'src/app/core/encodeFirestore.service';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { EncodeStorageService } from 'src/app/core/encodeStorage.service';


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
    // private _dbService: DataDbService,
    private _encodeFirestoreService: EncodeFirestoreService,
    private _encodeStorageService: EncodeStorageService,
    private _userService: EncodeUserService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _dialog: MatDialog)
  {
  }

  async onExit(): Promise<any> {
    const exitDialogRef = this._dialog.open(ExitConfirmComponent);
    exitDialogRef.afterClosed().subscribe(this._exitDialogClosed$);
    const exit$ = exitDialogRef.afterClosed();
    return await lastValueFrom(exit$);
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

    if (this._userService.encodeTasksResources == null) {
      this._userService.encodeTasksResources = (await this._encodeFirestoreService.getEncodeTasksResources()).data();
    }

    const taskResources = this._userService.encodeTasksResources;
    const perp1suspects = (await this._getSuspectsOfBeing(taskResources.perpetrator1Suspects)).map(snap => snap.data()); 
    const perp2suspects = (await this._getSuspectsOfBeing(taskResources.perpetrator2Suspects)).map(snap => snap.data()); 
    
    this._getSuspectsPhotos(taskResources.perpetrator1Suspects, perp1suspects);
    this._getSuspectsPhotos(taskResources.perpetrator2Suspects, perp2suspects);
    
    let firstLineup: Array<IEncodeSuspect>;
    let secondLineup: Array<IEncodeSuspect>;
    
    if (userPerpetratorCondition == PerpetratorCondition.A) {
      firstLineup = perp1suspects;
      secondLineup = perp2suspects;
    }
    
    if (userPerpetratorCondition == PerpetratorCondition.B) {
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
    await lastValueFrom(firstRoomResult);
    
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
      await lastValueFrom(secondRoomResult);

      this.isIdentifing = false;
      actualRoomRef.destroy();
  
      this.onExit = async () => true;
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

  private _getSuspectsOfBeing(suspectDocuments: Array<DocumentReference<IEncodeSuspect>>): Promise<DocumentSnapshot<IEncodeSuspect>[]> {
    let suspects = new Array<Promise<DocumentSnapshot<IEncodeSuspect>>>();
   
    suspectDocuments.forEach( async docRef => {
      const suspectId = docRef.id;
      const suspect = this._encodeFirestoreService.getEncodeSuspect(suspectId);
      suspects.push(suspect);
    });

    return Promise.all(suspects);
  }

  private _getSuspectsPhotos(perpSuspectsDocs: DocumentReference<IEncodeSuspect>[], perpSuspects: IEncodeSuspect[]): void {
    perpSuspectsDocs.forEach( async (suspectDocRef, index: number) => {
      const suspect = perpSuspects[index];
      suspect.id = suspectDocRef.id;
      const fileRef = this._encodeStorageService.getCloudStorageFileRef(suspect.photoStorageRef);
      suspect.photoImageUrl = await this._encodeStorageService.getDownloadURL(fileRef);
    });
  }

  private _createRoomComponent(
    roomTitle: typeof ROOM_1_TITLE | typeof ROOM_2_TITLE, 
    firstLineup: Array<IEncodeSuspect>): ComponentRef<EncodeIdentificationRoom> 
  {
    const viewContainerRef = this.identificationRoomHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(EncodeIdentificationRoom);
    componentRef.instance.roomTitle = roomTitle;
    componentRef.instance.lineup = firstLineup;

    return componentRef;
  }
}