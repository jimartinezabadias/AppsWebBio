import { Component, OnInit } from '@angular/core';
import { IEncodeGoogleFormResponse } from '../models/IEncodeGoogleFormResponse';
import { IEncodeUser } from '../models/IEncodeUser';
import { EncodeUserService } from '../services/EncodeUserService';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";


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
    
    // this._userService.loadUser$(this._userService.user.uid);
    // this._userService.user$().subscribe(this._userObserver);
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
      this.googleForms.push(this._formBuilder.control({
        preFilledURL: preFilledResp.preFilledURL
      }));
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
