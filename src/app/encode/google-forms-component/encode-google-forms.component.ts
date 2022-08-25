import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IEncodeGoogleFormResponse } from '../models/IEncodeGoogleFormResponse';
import { EncodeUserService } from '../services/EncodeUserService';
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { googleForValidator } from './google-form-validator';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-encode-google-forms',
    templateUrl: './encode-google-forms.component.html',
    styleUrls: ['encode-google-forms.component.scss','../encode.component.scss']
})

export class EncodeGoogleFormsComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') stepper: MatStepper;

  private _userResponses: Array<IEncodeGoogleFormResponse> = null;
  
  public userForms: FormGroup;

  constructor(
    private _userService: EncodeUserService, 
    private _formBuilder: FormBuilder, 
    private _router: Router, 
    private _route: ActivatedRoute) 
  {
    this._userResponses = this._userService.user.googleFormsResponses;
  }

  get googleForms(): FormArray {
    return this.userForms.get('googleForms') as FormArray; 
  }

  navigateToVideo(): void {
    let puntos_consigna:string[] = [
      'A continuación vas a visualizar un video corto  y te pedimos por favor que le prestes atención.',
      'Asegúrate de estar en un lugar tranquilo y sin interrupciones.',
      'Tené en cuenta que una vez que comience no podrás detenerlo.'
    ];

    this._router.navigate(['../consigna'], { 
      relativeTo: this._route,
      queryParams: { 
        titulo: 'Video',
        descripcion: null,
        puntos_consigna: puntos_consigna,
        ruta: '../video'
    } });
  }
  
  ngOnInit(): void {
    this.userForms = this._formBuilder.group({
      googleForms: this._formBuilder.array([])
    });
  }

  ngAfterViewInit(): void {
    this._userResponses.forEach(preFilledResp => {
      const asyncValidatorFn = googleForValidator(this._userService);
      let newControl = this._formBuilder.control({ preFilledURL: preFilledResp.preFilledURL }, null, asyncValidatorFn);
      
      newControl.statusChanges.subscribe(() => {
        if (newControl.valid) {
          this.stepper.next();
          let response = this._userService.user.googleFormsResponses.find(resp => resp.formID == preFilledResp.formID);
          response.isResponded = true;
        }
      })

      this.googleForms.push(newControl);
    });
  }
}