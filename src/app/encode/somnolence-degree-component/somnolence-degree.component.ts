import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncodeUserService } from '../services/EncodeUserService';

@Component({
    selector: 'app-encode-somnolence-degree',
    templateUrl: './somnolence-degree.component.html',
    styleUrls: ['somnolence-degree.component.scss','../encode.component.scss']
})

export class EncodeSomnolenceDegreeComponent implements OnInit {

  public somnolenceDegreeFormGroup: FormGroup;

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
  }

  private _buildSomnolenceDegreeFormGroup(): FormGroup {
    const somnolenceFormFields = new FormGroup({
      somnolenceDegree: new FormControl(false, [ Validators.required ]),
    });
   
    return somnolenceFormFields;
  }
  
}
