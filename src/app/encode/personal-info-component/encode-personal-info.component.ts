import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncodeUserService } from '../services/EncodeUserService';
import { Gender, EducationLevel } from '../constants';
import { IEncodeUserPersonalInfo } from '../models/IEncodeUserPersonalInfo';

@Component({
    selector: 'app-encode-personal-info',
    templateUrl: './encode-personal-info.component.html',
    styleUrls: ['../encode.component.scss','encode-personal-info.component.scss']
})

export class EncodePersonalInfoComponent implements OnInit {

  public personalInfoFormGroup: FormGroup;
  public genders = Gender;
  public educationLevels = EducationLevel;

  get age()
  {
    return this.personalInfoFormGroup.get('age');
  }
  
  get gender()
  {
    return this.personalInfoFormGroup.get('gender');
  }

  constructor(private _router: Router,
    private _route: ActivatedRoute,
    private _userService: EncodeUserService,
    private _location: Location) 
  {
    this.personalInfoFormGroup = this._buildPersonalInfoFormGroup();
  }
  
  ngOnInit(): void 
  {
  }

  back(): void {
    this._location.back();
  }

  onSaveForm($event: any)
  {
    if (this.personalInfoFormGroup.valid)
    {
        const formData: IEncodeUserPersonalInfo = this.personalInfoFormGroup.value;
        this._userService.user.personalInfo = formData;
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
