import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EncodeUserService } from '../services/EncodeUserService';
import { Genders, EducationLevels } from '../constants';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-encode-personal-info',
    templateUrl: './encode-personal-info.component.html',
    styleUrls: ['encode-personal-info.component.scss','../encode.component.scss']
})

export class EncodePersonalInfoComponent implements OnInit {

  public personalInfoFormGroup: FormGroup;
  public genders = Genders;
  public educationLevels = EducationLevels;

  constructor(private _router: Router,
    private _route: ActivatedRoute,
    private _userService: EncodeUserService) 
  {
    this.personalInfoFormGroup = this._buildPersonalInfoFormGroup();
  }
  
  ngOnInit(): void 
  {
  }

  get age(){
    return this.personalInfoFormGroup.get('age');
  }
  
  get gender(){
    return this.personalInfoFormGroup.get('gender');
  }

  onSaveForm($event: any)
  {
    if (this.personalInfoFormGroup.valid)
    {
        console.log("saving form and navigating");
        this._router.navigate(["../health-info"], { relativeTo: this._route });
      }
  }

  private _buildPersonalInfoFormGroup(): FormGroup
  {
    const userFormFields = new FormGroup({
        age: new FormControl('', [
          Validators.required,
          Validators.min(18),
          Validators.max(100)
        ]),
        gender: new FormControl('', [
          Validators.required
        ]),
        educationLevel: new FormControl('', [
          Validators.required
        ]),
        ongoingCareer: new FormControl(''),
        occupation: new FormControl('')
    });

    return userFormFields;
  }

}
