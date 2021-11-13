import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncodeUserService } from '../services/EncodeUserService';
import { SomnolenceDegrees } from "../constants";
import { IEncodeDayOne } from '../models/IEncodeDayOne';

@Component({
    selector: 'app-encode-somnolence-degree',
    templateUrl: './somnolence-degree.component.html',
    styleUrls: ['somnolence-degree.component.scss','../encode.component.scss']
})

export class EncodeSomnolenceDegreeComponent implements OnInit {

  public somnolenceDegreeFormGroup: FormGroup;
  
  get somnolenceDegrees() 
  {
    return SomnolenceDegrees;
  }

  constructor(private _router: Router,
    private _route: ActivatedRoute,
    private _userService: EncodeUserService) 
  {
    this.somnolenceDegreeFormGroup = this._buildSomnolenceDegreeFormGroup();
  }
  

  ngOnInit(): void 
  {
  }
  
  onSaveForm($event: any)
  {
    const formData: string = this.somnolenceDegreeFormGroup.value;
    this._userService.storeSomnolenceDayOne(formData);
    console.log("todo: - save in DB.");
    this._router.navigate(["../google-forms"], { relativeTo: this._route });
  }

  private _buildSomnolenceDegreeFormGroup(): FormGroup {
    const somnolenceFormFields = new FormGroup({
      somnolenceDegree: new FormControl(this.somnolenceDegrees.totallyAwake, [ Validators.required ]),
    });
   
    return somnolenceFormFields;
  }
  
}
