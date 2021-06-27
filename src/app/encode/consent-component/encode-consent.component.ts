import { Component, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';

@Component({
    selector: 'app-encode-consent',
    templateUrl: './encode-consent.component.html',
    styleUrls: ['../encode.component.scss']
})

export class EncodeConsentComponent {

  @ViewChild('list_of_agreement') private _agreements: MatSelectionList;
  
  constructor() 
  {
  }

  onConsent()
  {
    if (this._agreements.selectedOptions.selected.length < 4)
    {
      console.log("falta checkear opciones");
    } 
    else
    {
      console.log("guardar el consentimiento y navegar al primer googleform");
    }
  }
}
