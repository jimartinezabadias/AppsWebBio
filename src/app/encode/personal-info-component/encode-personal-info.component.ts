import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EncodeUserService } from '../services/EncodeUserService';

@Component({
    selector: 'app-encode-personal-info',
    templateUrl: './encode-personal-info.component.html',
    styleUrls: ['encode-personal-info.component.scss','../encode.component.scss']
})

export class EncodePersonalInfoComponent implements OnInit {

  personalInfoFormGroup: FormGroup;

  constructor(private _userService: EncodeUserService) 
  {
    this.personalInfoFormGroup = this._buildPersonalInfoFormGroup();
  }
  
  ngOnInit(): void 
  {
    
  }

  get age(){
    return this.personalInfoFormGroup.get('age');
  }

  onSaveForm($event: any)
  {
      console.log("saving form");
  }

  private _buildPersonalInfoFormGroup(): FormGroup
  {
    const userFormFields = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(30)
        ]),
        email: new FormControl('',[
            Validators.required,
            Validators.email
        ]),
        age: new FormControl('', [
          Validators.required,
          Validators.min(18),
          Validators.max(100)
        ]),
    });
    return userFormFields;
  }

}
