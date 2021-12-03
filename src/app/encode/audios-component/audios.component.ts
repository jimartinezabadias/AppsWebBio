import { Component } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { ActivatedRoute, Router } from '@angular/router';
import { OnExit } from '../exit.guard';
import { MatDialog } from '@angular/material/dialog';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';
import { AudioRecorderService } from '../services/AudioRecorderService';

@Component({
    selector: 'app-encode-audios',
    templateUrl: './audios.component.html',
    styleUrls: ['audios.component.scss','../encode.component.scss']
})

export class EncodeAudiosComponent implements OnExit {

  private audiosReady = false;
  private exitValue = false;

  constructor(
    private _userService: EncodeUserService,
    private _router: Router, 
    private _route: ActivatedRoute, 
    private dialog: MatDialog, 
    private _recorderService: AudioRecorderService) 
  {
  }

  onExit() {
    if(this.audiosReady == false) {
      if(this.exitValue == false) {
        this._openDialog();
      } else {
        this._userService.user.abandonedByUser = true;
        this._userService.saveDayOneResults();
        return true;
      }
    } else {
      return true;
    }
  }

  private async _openDialog() {
    const dialogRef = this.dialog.open(ExitConfirmComponent, {});
    dialogRef.afterClosed().subscribe(this._dialogClosedObserver);
  }

  private _dialogClosedObserver = (result) => {
    if(result) {
      this.exitValue = true;
      this._router.navigate(["/"]);
    } else {
      this.exitValue = false;
    }
  }

  onAudiosReady()
  {
    //falta chequear por audios
    this.audiosReady = true;
    this._router.navigate(["../end"], { relativeTo: this._route });
  }
  
}
