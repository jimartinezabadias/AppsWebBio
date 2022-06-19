import { Component, ViewChild } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { ActivatedRoute, Router } from '@angular/router';
import { OnExit } from '../exit.guard';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';
import { EncodeAudioListComponent } from './audios-list-component/audio-list.component';
import { ExtendedRecallComponent } from './extended-recall-component/extended-recall.component';
import { SessionsEnum } from '../constants';
import { IEncodeUser } from '../models/IEncodeUser';
import { lastValueFrom, map, Observable, of } from "rxjs";
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-encode-audios',
    templateUrl: './audios.component.html',
    styleUrls: ['audios.component.scss','../encode.component.scss']
})
export class EncodeAudiosComponent implements OnExit {

  @ViewChild('audioList') private audioListComponent: EncodeAudioListComponent;
  
  private _wantsToExtend: boolean = true;
  public user: IEncodeUser;

  get sessionsEnum(): typeof SessionsEnum {
    return SessionsEnum;
  }

  get currentSession(): SessionsEnum {
    return this._userService.session;
  }

  get finishButtonDisabled$(): Observable<boolean> {
    return (this.audioListComponent) ? this.audioListComponent.isUploadingNewAudio$
      .pipe(
        map((isUploading: boolean) => {
          return isUploading || this.audioListComponent.audios.length == 0
        })
      )
      : 
      of(true);
  }

  constructor(
    private _userService: EncodeUserService,
    private _router: Router, 
    private _route: ActivatedRoute,
    private _dialog: MatDialog) 
  {
  }

  ngOnInit(): void 
  {
    this.user = this._userService.user;
  }

  public async onExit(): Promise<any> {
    const exitDialogRef = this._dialog.open(ExitConfirmComponent);
    exitDialogRef.afterClosed().subscribe(this._exitDialogClosed$);
    const afterClosed$ = exitDialogRef.afterClosed() as unknown as Observable<unknown>;
    return await lastValueFrom(afterClosed$);
  }

  public onAudiosReady(): void
  {
    if (this.audioListComponent.isUploadingNewAudio$.getValue() == false && this.audioListComponent.audios.length > 0) {
      if (this._wantsToExtend) {
        const extendDialogRef = this._dialog.open(ExtendedRecallComponent, {});
        extendDialogRef.afterClosed().subscribe(async (response: boolean): Promise<void> => {
          if(response == true) {
            this._wantsToExtend = false;
          } else if (response == false) {
            this._navigateToEndComponent();
          }
          
          extendDialogRef.close();
        }
        );
      }
  
      if (!this._wantsToExtend) {
        this._navigateToEndComponent();
      } 
    }
  }

  private _navigateToEndComponent(): void {
    this.onExit = async () => true;
    
    if (this._userService.session == SessionsEnum.SessionOne) {
      //si estamos en sesion 1
      this._router.navigate(["../end"], { relativeTo: this._route });
      return;
    }
    
    if (this._userService.session == SessionsEnum.SessionTwo) {
      this._router.navigate(["../selection"], { relativeTo: this._route });
      return;
    }  
  }

  private _exitDialogClosed$ = async (response: boolean): Promise<boolean> => {
    if (response == true){ 
      await this._userService.abandonTest();
      this._router.navigate(["/"]);
    } 

    return false;
  }

}