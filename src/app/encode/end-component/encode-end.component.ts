import { Component, OnInit } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { Router } from "@angular/router";
import { OnExit } from '../exit.guard';
import { MatDialog } from '@angular/material/dialog';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';
import { LazyDialogService } from '../services/lazy-dialog.service';

@Component({
    selector: 'app-encode-end',
    templateUrl: './encode-end.component.html',
    styleUrls: ['../encode.component.scss','end.component.scss']
})
export class EncodeEndComponent implements OnInit, OnExit {

  private _canNavigateToNextComponent: boolean = false;
  
  public userName: string;

  constructor(private _userService: EncodeUserService, 
    private _router: Router,
    private _lazyDialog: LazyDialogService,
    private _dialog: MatDialog) 
  {
  }

  ngOnInit(): void 
  {
    this.userName = this._userService.user.name;
    this._userService.user.sessionOne.completed = true;
    this.saveResults();
  }

  onExit() {
    if(this._canNavigateToNextComponent == true) {
      return true;
    }
    
    this._openDialog();
  }

  private async saveResults() {
    await this._userService.saveSessionOneResults();
  }

  private async _openDialog() {
    const dialogRef = this._dialog.open(ExitConfirmComponent, {});
    dialogRef.afterClosed().subscribe(this._dialogClosedObserver);
  }

  private _dialogClosedObserver = async (response: boolean): Promise<void> => {
    if(response == true) {
      this._userService.user.abandonedByUser = true;
      this._userService.user.sessionOne.completed = true;
      await this._userService.saveSessionOneResults();
      this._canNavigateToNextComponent = true;
      this._router.navigate(["/"]);
    }
    
    this._lazyDialog.closeDialog();
  }

}
