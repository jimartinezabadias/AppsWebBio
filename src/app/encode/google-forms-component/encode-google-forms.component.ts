import { Component } from '@angular/core';

@Component({
    selector: 'app-encode-google-forms',
    templateUrl: './encode-google-forms.component.html',
    styleUrls: ['encode-google-forms.component.scss','../encode.component.scss']
})

export class EncodeGoogleFormsComponent{
  
  public googleForms: Array<string> = new Array<string>();

  constructor() 
  {
    this.googleForms.push("hjhkjsdf");
    this.googleForms.push("hjhkjsdf");
  }
  
}
