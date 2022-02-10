import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncodeUserService } from '../services/EncodeUserService';
import { SelectionScreenshots } from 'src/app/encode/constants';
import { IEncodeImageSelection } from "../models/IEncodeImageSelection";

@Component({
    selector: 'app-encode-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['selection.component.scss','../encode.component.scss']
})
export class EncodeSelectionComponent implements OnInit {
  public imagesPairs;
  public steps = 12;
  public random_pairs = [];
  public currentStep = 0;
  public selectionMade = false;
  public userChoices: Array<IEncodeImageSelection> = [];
  public userChoice: IEncodeImageSelection;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private _userService: EncodeUserService) 
  {
  }

  ngOnInit() 
  {
    this.imagesPairs = Object.entries(SelectionScreenshots.selectionPairs).map(([type, value]) => ({type, value}));

    for (let i = 0; i <= this.steps; i++) {
      this.random_pairs.push(Math.floor(Math.random() * (1 - 0 + 1) + 0));
    }
    console.log(this.imagesPairs);
    console.log(this.random_pairs);
  }

  onSelection(selectionValue, isReal): any
  {
    this.userChoice = { pairNumber: this.currentStep, isReal: isReal, imageURL: selectionValue };
    this.selectionMade = true;
  }

  onConfirm(): any 
  {
    if (this.currentStep < 13) {
      this.userChoices.push(this.userChoice);
      this.currentStep = this.currentStep + 1;
      this.selectionMade = false;
    } else if (this.currentStep == 13) {
      this._userService.user.sessionTwo.imageSelections = this.userChoices;
      //routear a ordenamiento
      //this._router.navigate(["../consent"], { relativeTo: this._route });
    }
  }

}
