import { Component, ViewChild } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { OnExit } from '../exit.guard';
import { MatDialog } from '@angular/material/dialog';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';
import { EncodeAudioListComponent } from './audios-list-component/audio-list.component';
import { ExtendedRecallComponent } from './extended-recall-component/extended-recall.component';
import { Observable } from 'rxjs';
import { SessionsEnum } from '../constants';

@Component({
    selector: 'app-encode-audios',
    templateUrl: './audios.component.html',
    styleUrls: ['audios.component.scss','../encode.component.scss']
})
export class EncodeAudiosComponent implements OnExit {

  @ViewChild('audioList') public audioListComponent: EncodeAudioListComponent;
  
  private _wantsToExtend: boolean = true;
  public noAudiosRecorded: boolean = false;

  constructor(
    private _userService: EncodeUserService,
    private _router: Router, 
    private _route: ActivatedRoute,
    private _dialog: MatDialog) 
  {
  }

  public onExit(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const exitDialogRef = this._dialog.open(ExitConfirmComponent);
    exitDialogRef.afterClosed().subscribe(this._exitDialogClosed$);
    return exitDialogRef.afterClosed().toPromise<boolean | UrlTree>();
  }

  public onAudiosReady(): void
  {
    if (this.audioListComponent.audios.length <= 0) {
      this.noAudiosRecorded = true;
    } else if (this.audioListComponent.audios.length > 0) {
      this.noAudiosRecorded = false;

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

  private _exitDialogClosed$ = async (response: boolean): Promise<boolean | UrlTree> => {
    if (response == true){ 
      await this._userService.abandonTest();
      const redirectUrl: UrlTree = this._router.parseUrl('/');
      return redirectUrl;
    } 

    return false;
  }

}