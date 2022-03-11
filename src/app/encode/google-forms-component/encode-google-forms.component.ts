import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IEncodeGoogleFormResponse } from '../models/IEncodeGoogleFormResponse';
import { EncodeUserService } from '../services/EncodeUserService';
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { GoogleFormValidator } from './google-form-validator';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ExitConfirmComponent } from '../exit-confirm-component/exit-confirm.component';
import { Observable } from 'rxjs';
import { OnExit } from '../exit.guard';


@Component({
    selector: 'app-encode-google-forms',
    templateUrl: './encode-google-forms.component.html',
    styleUrls: ['encode-google-forms.component.scss','../encode.component.scss']
})

export class EncodeGoogleFormsComponent implements OnInit, OnExit, AfterViewInit {

  @ViewChild('stepper') stepper: MatStepper;

  private _userResponses: Array<IEncodeGoogleFormResponse> = null;
  
  public userForms: FormGroup;

  constructor(
    private _userService: EncodeUserService, 
    private _formBuilder: FormBuilder, 
    private _router: Router, 
    private _route: ActivatedRoute,
    private _dialog: MatDialog) 
  {
    this._userResponses = this._userService.user.googleFormsResponses;
  }

  private _exitDialogClosed$ = async (response: boolean): Promise<boolean> => {
    if (response == true){ 
      console.log("a");
      this._userService.user.abandonedByUser = true;
      if (this._userService.session == 'session_1') {
        this._userService.user.sessionOne.completed = true;
      } else if (this._userService.session == 'session_2') {
        this._userService.user.sessionTwo.completed = true;
      }

      await this._userService.updateUserInDB();
      this._router.navigate(["/"]);
      return true;
    } 

    return false;
  }

  onExit(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const exitDialogRef = this._dialog.open(ExitConfirmComponent);
    exitDialogRef.afterClosed().subscribe(this._exitDialogClosed$);
    return exitDialogRef.afterClosed().toPromise<boolean>();
  }
  
  get googleForms(): FormArray {
    return this.userForms.get('googleForms') as FormArray; 
  }

  public navigateToVideo() {
    this.onExit = () => true;
    this._router.navigate(["../video"], { relativeTo: this._route });
  }

  
  ngOnInit(): void {
    this.userForms = this._formBuilder.group({
      googleForms: this._formBuilder.array([])
    });
  }

  ngAfterViewInit(): void {
    this._userResponses.forEach(preFilledResp => {
      let newControl = this._formBuilder.control({ preFilledURL: preFilledResp.preFilledURL }, null, GoogleFormValidator.googleFormResponse(this._userService));
      newControl.statusChanges.subscribe(() => {
        if (newControl.status == 'VALID'){
          this.stepper.next();
        }
      })

      this.googleForms.push(newControl);
    });
  }

  // public submitForms(): void {
  //   console.log('navigating to video component');
    // if (this.userForms.valid)
    // {
      // this._router.navigate(["../video"], { relativeTo: this._route });
    // }

    // Error: Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value for 'ng-valid': 'true'. 
  // }

}