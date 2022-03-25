import { Component, ViewChild } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { ActivatedRoute, Router } from '@angular/router';
import { OnExit } from '../exit.guard';
import { MatDialog } from '@angular/material/dialog';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';
import { EncodeAudioListComponent } from './audios-list-component/audio-list.component';
import { ExtendedRecallComponent } from './extended-recall-component/extended-recall.component';
import { Observable, of } from 'rxjs';
import { SessionsEnum } from '../constants';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-encode-audios',
    templateUrl: './audios.component.html',
    styleUrls: ['audios.component.scss','../encode.component.scss']
})
export class EncodeAudiosComponent implements OnExit {

  @ViewChild('audioList') private audioListComponent: EncodeAudioListComponent;
  
  private _wantsToExtend: boolean = true;

  get continueButtonDisabled$(): Observable<boolean> {
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

  public onExit(): Observable<boolean> | Promise<boolean> | boolean {
    const exitDialogRef = this._dialog.open(ExitConfirmComponent);
    exitDialogRef.afterClosed().subscribe(this._exitDialogClosed$);
    return exitDialogRef.afterClosed().toPromise<boolean>();
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

  private async _navigateToEndComponent(): Promise<void> {
    this.onExit = () => true;
    
    if (this._userService.session == SessionsEnum.SessionTwo) {
      this._router.navigate(["../selection"], { relativeTo: this._route });
      return;
    }  
    
    if (this._userService.session == SessionsEnum.SessionOne) {
      //si estamos en sesion 1
      this._router.navigate(["../end"], { relativeTo: this._route });
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