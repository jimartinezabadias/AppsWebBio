import { Component, ViewChild } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { ActivatedRoute, Router } from '@angular/router';
import { OnExit } from '../exit.guard';
import { MatDialog } from '@angular/material/dialog';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';
import { EncodeAudioListComponent } from './audios-list-component/audio-list.component';
import { LazyDialogService } from '../services/lazy-dialog.service';

@Component({
    selector: 'app-encode-audios',
    templateUrl: './audios.component.html',
    styleUrls: ['audios.component.scss','../encode.component.scss']
})
export class EncodeAudiosComponent implements OnExit {

  @ViewChild('audioList') public audioListComponent: EncodeAudioListComponent;

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

  onAudiosReady()
  {
    this._canNavigateToNextComponent = true;
    this._router.navigate(["../end"], { relativeTo: this._route });
  }
  
}
