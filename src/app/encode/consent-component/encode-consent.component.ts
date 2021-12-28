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
    if (this._agreements.selectedOptions.selected.length < 4)
    {
      console.log("falta checkear opciones");
    } 
    else
    {
      let date =new Date();
      let latest_date =this.datepipe.transform(date, 'yyyy-MM-dd');
      this._userService.user.consent = latest_date; 
      this._router.navigate(["../personal-info"], { relativeTo: this._route });
    }
  }
}
