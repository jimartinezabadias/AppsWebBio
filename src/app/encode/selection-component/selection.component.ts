import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SelectionScreenshots } from 'src/app/encode/constants';

@Component({
    selector: 'app-encode-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['selection.component.scss','../encode.component.scss']
})
export class EncodeSelectionComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  public imagesPairs;
  public steps = 12;
  public currentStep = 0;
  public selectionMade = false;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private _formBuilder: FormBuilder) 
  {
  }

  ngOnInit() 
  {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: '',
    });

    this.imagesPairs = Object.entries(SelectionScreenshots.selectionPairs).map(([type, value]) => ({type, value}));
    console.log(this.imagesPairs);
  }

  onSelection(selectionValue): any
  {
    console.log(selectionValue);
    this.selectionMade = true;
  }

  onConfirm(): any 
  {
    if (this.currentStep < 12) {
      console.log("hola");
      this.currentStep = this.currentStep + 1;
      this.selectionMade = false;
    } else if (this.currentStep == 12) {
      //this._router.navigate(["../consent"], { relativeTo: this._route });
    }
  }

}
