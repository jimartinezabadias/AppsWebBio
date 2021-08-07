import { Component, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-encode-consent',
    templateUrl: './encode-consent.component.html',
    styleUrls: ['encode-consent.component.scss','../encode.component.scss']
})

export class EncodeConsentComponent {

  @ViewChild('list_of_agreement') private _agreements: MatSelectionList;
  
  constructor(private _router: Router,
              private _route: ActivatedRoute) 
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
      this._router.navigate(["../personal-info"], { relativeTo: this._route });
    }
  }
}
