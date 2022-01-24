import { Component } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { OnExit } from '../exit.guard';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';
import { VIDEO_PATH } from '../constants';
import { EncodeVideoPlayer } from './video-dialog/video-dialog.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-encode-video',
    templateUrl: './video.component.html',
    styleUrls: ['video.component.scss','../encode.component.scss']
})
export class EncodeVideoComponent implements OnExit {
  
  private _videoPlayerRef: MatDialogRef<EncodeVideoPlayer>;

  constructor(
    private _userService: EncodeUserService, 
    private _router: Router, 
    private _route: ActivatedRoute,
    private _dialog: MatDialog)
  {
  }

  public onExit(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // TODO: agegar play/pausa cuando aparece el dialogo exit
    // this._video.nativeElement.pause();
    const exitDialogRef = this._dialog.open(ExitConfirmComponent);
    exitDialogRef.afterClosed().subscribe(this._exitDialogClosed$);
    return exitDialogRef.afterClosed().toPromise<boolean>();
  }

  get videoSource(): string {
    return VIDEO_PATH;
  } 

  async onVideoLaunched()
  {
    const videoPlayerDialogConfig = { 
      disableClose: true, 
      closeOnNavigation: false,
      backdropClass: 'backdropBackground',
      panelClass: 'custom-background' 
    };

    this._videoPlayerRef = this._dialog.open(EncodeVideoPlayer, videoPlayerDialogConfig);
    this._videoPlayerRef.afterClosed().subscribe(this._videoPlayerDialogClosed$);
  }
  
  skipVideo()
  {
    this._navigateToAudios();
  }

  private async _abandonTest() {
    this._userService.user.abandonedByUser = true;
    this._userService.user.sessionOne.completed = true;
    await this._userService.updateUserInDB();
    this._router.navigate(["/"]);
  }
  
  private _navigateToAudios() {
    this.onExit = () => true;
    this._router.navigate(["../audios"], { relativeTo: this._route });
  }

  private _videoPlayerDialogClosed$ = (result: boolean) => {
    (result == true) ? this._navigateToAudios() : this._abandonTest();
  }
  
  private _exitDialogClosed$ = async (response: boolean): Promise<boolean> => {
    if (response == true){ 
      this._videoPlayerRef.close(false);
      return true;
    } 

    return false;
  }
}
