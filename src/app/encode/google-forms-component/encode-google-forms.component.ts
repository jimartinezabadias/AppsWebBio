import { Component, OnInit } from '@angular/core';
import { IEncodeGoogleFormResponse } from '../models/IEncodeGoogleFormResponse';
import { EncodeUserService } from '../services/EncodeUserService';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
    selector: 'app-encode-google-forms',
    templateUrl: './encode-google-forms.component.html',
    styleUrls: ['encode-google-forms.component.scss','../encode.component.scss']
})

export class EncodeGoogleFormsComponent implements OnInit {

  private _userResponses: Array<IEncodeGoogleFormResponse> = null;
  
  public userForms: FormGroup;
  
  // public embeddedParameter: string = "embedded=true"; 

  constructor(private _userService: EncodeUserService, private _formBuilder: FormBuilder) 
  {
    this._userResponses = this._userService.user.googleFormsResponses;
  }
  
  get googleForms(): FormArray {
    return this.userForms.get('googleForms') as FormArray; 
  }
  
  ngOnInit(): void {
    this.userForms = this._formBuilder.group({
      googleForms: this._formBuilder.array([])
    });

    console.log(this.googleForms);

    this._userResponses.forEach(preFilledResp => {
      this.googleForms.push(this._formBuilder.control({ preFilledURL: preFilledResp.preFilledURL }, null, CustomValidator.googleFormResponse(this._userService)));
    });

  }

  submitForms(): void {
    console.log('bla');
  }

  // public openForm(formURL: string): void
  // {
  //   let windowRef: Window;
  //   windowRef = window.open(formURL,"formPopup","width=600,height=600");
  // }

  // public isFormDisabled(formIndex: number): boolean
  // {
  //   const isEnabled = this.userForms[formIndex - 1] ? this.userForms[formIndex - 1].isResponded : true;  
  //   return !isEnabled;
  // }

  // private _userObserver = (user: IEncodeUser) => {
  //   this.userForms = user.googleFormsResponses;
  // }
  
}

export class CustomValidator {
  static googleFormResponse(userService: EncodeUserService){
    return (control: FormControl): Observable<ValidationErrors | null>  => {

      const responseURL: string = control.value.preFilledURL;

      return userService.googleForms$.pipe(
        map(arr => arr.filter(resp => {
          // console.log('actual form url: ');
          // console.log(responseURL);
          // console.log('actual resp to compare: ');
          // console.log(resp.preFilledURL);
          // console.log('is responded: ');
          // console.log(resp.isResponded);
          if ((resp.preFilledURL == responseURL) && resp.isResponded) {
            console.log('form has been responded');
            return of(null);
          } 
         
          return of({ 'error': 'bla'});
        }))
      );
    }
  }
}
