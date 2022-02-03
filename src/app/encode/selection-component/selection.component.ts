import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncodeUserService } from '../services/EncodeUserService';
import { SelectionScreenshots } from 'src/app/encode/constants';

@Component({
    selector: 'app-encode-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['selection.component.scss','../encode.component.scss']
})
export class EncodeSelectionComponent implements OnInit {
  public imagesPairs;
  public steps = 12;
  public currentStep = 0;
  public selectionMade = false;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private _userService: EncodeUserService) 
  {
  }

  ngOnInit() 
  {
    this.imagesPairs = Object.entries(SelectionScreenshots.selectionPairs).map(([type, value]) => ({type, value}));
  }

  onSelection(selectionValue): any
  {
    //guardar selectionValue en interface
    //this._userService.user 
    this.selectionMade = true;
  }

  onConfirm(): any 
  {
    if (this.currentStep < 12) {
      this.currentStep = this.currentStep + 1;
      this.selectionMade = false;
    } else if (this.currentStep == 12) {
      //this._router.navigate(["../consent"], { relativeTo: this._route });
    }
  }

}
