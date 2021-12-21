import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IEncodeGoogleFormResponse } from '../models/IEncodeGoogleFormResponse';
import { EncodeUserService } from '../services/EncodeUserService';
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { GoogleFormValidator } from './google-form-validator';


@Component({
    selector: 'app-encode-google-forms',
    templateUrl: './encode-google-forms.component.html',
    styleUrls: ['encode-google-forms.component.scss','../encode.component.scss']
})

export class EncodeGoogleFormsComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') stepper: MatStepper;

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

  submitForms(): void {
    console.log('bla');
  }

}