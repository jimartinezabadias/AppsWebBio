import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyDialogService } from '../services/lazy-dialog.service';
import { OnExit } from '../exit.guard';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';

@Component({
    selector: 'app-encode-video',
    templateUrl: './video.component.html',
    styleUrls: ['video.component.scss','../encode.component.scss']
})

export class EncodeVideoComponent implements OnInit, OnExit {

  public videoSource = "assets/videos/videoEncode.mp4";
  private dialogClosed;
  private exitValue;
    
  constructor(
    private _userService: EncodeUserService, 
    private _router: Router, 
    private _route: ActivatedRoute, 
    private lazyDialog: LazyDialogService, 
    private dialog: MatDialog)
  {
  }

  ngOnInit(): void 
  {
    this.dialogClosed = false;
    this.exitValue = false;
  }

  onExit() {
    if(this.dialogClosed == false) {
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
      this.lazyDialog.closeDialog();
      this._router.navigate(["/"]);
    } else {
      this.exitValue = false;
    }
  }

  async onVideoLaunched()
  {
    const dialogRef = await this.lazyDialog.openDialog('video-dialog');

    dialogRef.afterClosed().subscribe(result => {
      console.log("cerró");
      this.dialogClosed = true;
      this._router.navigate(["/encode/"+location.pathname.split('/').slice()[2]+"/audios"]);
    });
  }

  skipVideo()
  {
    this.dialogClosed = true;
    this._router.navigate(["../audios"], { relativeTo: this._route });
  }
  
}
