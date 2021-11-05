import { Component, OnInit } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { Router } from "@angular/router";
import { OnExit } from '../exit.guard';
import { MatDialog } from '@angular/material/dialog';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';

@Component({
    selector: 'app-encode-end',
    templateUrl: './encode-end.component.html',
    styleUrls: ['../encode.component.scss','end.component.scss']
})

export class EncodeEndComponent implements OnInit, OnExit {

  public userName: string;
  private exitValue = false;

  constructor(private _userService: EncodeUserService, private dialog: MatDialog, private _router: Router) 
  {
  }

  ngOnInit(): void 
  {
    this.userName = this._userService.user().name;
    this.exitValue = false;
  }

  onExit() {
    if(this.exitValue == false) {
      this._openDialog();
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

}
