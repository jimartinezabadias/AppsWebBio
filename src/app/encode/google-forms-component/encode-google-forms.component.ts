import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IEncodeGoogleFormResponse } from '../models/IEncodeGoogleFormResponse';
import { EncodeUserService } from '../services/EncodeUserService';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
    selector: 'app-encode-google-forms',
    templateUrl: './encode-google-forms.component.html',
    styleUrls: ['encode-google-forms.component.scss','../encode.component.scss'],
    providers: [
      {
        provide: STEPPER_GLOBAL_OPTIONS,
        useValue: {showError: true},
      },
    ]
})

export class EncodeGoogleFormsComponent{
  
  public userForms: IEncodeGoogleFormResponse[] = null;
  
  public embeddedParameter: string = "embedded=true"; 

  constructor(private _userService: EncodeUserService, private _sanitizer: DomSanitizer) 
  {
    this.userForms = this._userService.user().googleFormsResponses;
    // console.log(this.userForms);
  }
  
}

// https://desa.local:4200/encode/BzgDblC111Wc7HCc4lx6


//             "https://docs.google.com/forms/d/e/1FAIpQLSf3hQ7SIgqmEH1cu126f5Yt9hNoaE472hhgI_cBAaufVQ7t_A/viewform?usp=pp_url&entry.103590893=dsg@gasdg.com"
// <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdQwFHeG7ZqL5M2ODDnMMHIViSYTYMddx1tYTHjmXEnYXy7lg/viewform?embedded=true" width="640" height="740" frameborder="0" marginheight="0" marginwidth="0">Cargando…</iframe>
