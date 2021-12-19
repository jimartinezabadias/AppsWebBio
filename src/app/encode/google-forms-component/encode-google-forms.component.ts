import { Component, OnInit } from '@angular/core';
import { IEncodeGoogleFormResponse } from '../models/IEncodeGoogleFormResponse';
import { EncodeUserService } from '../services/EncodeUserService';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';


@Component({
    selector: 'app-encode-google-forms',
    templateUrl: './encode-google-forms.component.html',
    styleUrls: ['encode-google-forms.component.scss','../encode.component.scss']
})

export class EncodeGoogleFormsComponent implements OnInit {

  private _userResponses: Array<IEncodeGoogleFormResponse> = null;
  
  public userForms: FormGroup;

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

    this._userResponses.forEach(preFilledResp => {
      let newControl = this._formBuilder.control({ preFilledURL: preFilledResp.preFilledURL }, null, CustomValidator.googleFormResponse(this._userService));
      this.googleForms.push(newControl);
    });

  }

  submitForms(): void {
    console.log('bla');
  }

}

export class CustomValidator {
  
  static googleFormResponse(userService: EncodeUserService){
    
    return (control: FormControl): Observable<ValidationErrors | null>  => {

      const actualResponseURL: string = control.value.preFilledURL;

      return userService.googleForms$.pipe(
        switchMap(arr => { 
          arr = arr.filter(resp => (resp.preFilledURL == actualResponseURL) && resp.isResponded );

          if (arr.length > 0){
            return of(null);
          }

          return of({'error': 'error'});
        }), 
        catchError(() => of({'error': 'error'}))
        );
      }
    }    
  }
  

function next(next: any, arg1: () => void): any {
  throw new Error('Function not implemented.');
}
  // console.log('actual form url: ');
  // console.log(responseURL);
  // console.log('actual resp to compare: ');
  // console.log(resp.preFilledURL);
  // console.log('is responded: ');
  // console.log(resp.isResponded);