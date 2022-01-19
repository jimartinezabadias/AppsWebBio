import { Component, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { EncodeUserService } from '../services/EncodeUserService';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-encode-consent',
    templateUrl: './encode-consent.component.html',
    styleUrls: ['encode-consent.component.scss','../encode.component.scss']
})

export class EncodeConsentComponent {

  @ViewChild('list_of_agreement') private _agreements: MatSelectionList;
  
  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private _userService: EncodeUserService,
              public datepipe: DatePipe) 
  {
  }

  onConsent()
  {
    const selectedOptionsNumber = this._agreements.selectedOptions.selected.length;
    if ( selectedOptionsNumber < 4)
    {
      console.log("falta checkear opciones");
    } 
    else
    {
      let date = new Date();
      this._userService.user.consent.hasAccepted = true; 
      let currentDate = this.datepipe.transform(date, 'yyyy-MM-dd');
      this._userService.user.consent.date = currentDate; 
      this._router.navigate(["../personal-info"], { relativeTo: this._route });
    }
  }
}
