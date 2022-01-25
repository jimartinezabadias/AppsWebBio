import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-encode-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['selection.component.scss','../encode.component.scss']
})
export class EncodeSelectionComponent {

  constructor(private _router: Router,
              private _route: ActivatedRoute) 
  {
  }

  ngOnInit(): void 
  {

  }

  onConfirm(): any 
  {
    this._router.navigate(["../consent"], { relativeTo: this._route });
  }

}
