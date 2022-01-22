import { Component } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyDialogService } from '../services/lazy-dialog.service';
import { OnExit } from '../exit.guard';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';
import { VIDEO_PATH } from '../constants';

@Component({
    selector: 'app-encode-video',
    templateUrl: './video.component.html',
    styleUrls: ['video.component.scss','../encode.component.scss']
})
export class EncodeVideoComponent implements OnExit {

  private _canNavigateToNextComponent: boolean = false;

  constructor(
    private _userService: EncodeUserService, 
    private _router: Router, 
    private _route: ActivatedRoute, 
    private _lazyDialog: LazyDialogService, 
    private _dialog: MatDialog)
  {
  }

  onExit() {
    if(this._canNavigateToNextComponent == true) {
      return true;
    }
    
    this._openDialog();
  }

  get videoSource(): string {
    return VIDEO_PATH;
  } 

  async onVideoLaunched()
  {
    const dialogRef = await this._lazyDialog.openDialog('video-dialog');

    dialogRef.afterClosed().subscribe( () => {
      this._canNavigateToNextComponent = true;
      this._router.navigate(["../audios"], { relativeTo: this._route });
    });
  }

  skipVideo()
  {
    this._canNavigateToNextComponent = true;
    this._router.navigate(["../audios"], { relativeTo: this._route });
  }

  private async _openDialog() {
    const dialogRef = this._dialog.open(ExitConfirmComponent, {});
    dialogRef.afterClosed().subscribe(this._dialogClosedObserver);
  }

  private _dialogClosedObserver = async (response: boolean): Promise<void> => {
    if(response == true) {
      this._userService.user.abandonedByUser = true;
      this._userService.user.sessionOne.completed = true;
      await this._userService.updateUserInDB();
      this._canNavigateToNextComponent = true;
      this._router.navigate(["/"]);
    }
    
    this._lazyDialog.closeDialog();
  }
  
}
