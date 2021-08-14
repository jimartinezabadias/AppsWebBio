import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EncodeUserService } from '../services/EncodeUserService';

@Component({
    selector: 'app-encode-health-info',
    templateUrl: './health-info.component.html',
    styleUrls: ['health-info.component.scss','../encode.component.scss']
})

export class EncodeHealthInfoComponent implements OnInit {

  private _cronicMedicinesValidator = [ ];

  public healthInfoFormGroup: FormGroup;

  constructor(private _userService: EncodeUserService) 
  {
    this.healthInfoFormGroup = this._buildhealthInfoFormGroup();
  }
  
  ngOnInit(): void 
  {
    this.healthInfoFormGroup.get('takesCronicMedicine').valueChanges
      .subscribe(value => {
        if(value) {
          this.healthInfoFormGroup.get('cronicMedicines').setValidators(this._cronicMedicinesValidator.concat(Validators.required))
        } else {
          this.healthInfoFormGroup.get('cronicMedicines').setValidators(this._cronicMedicinesValidator);
        }
      });
  }

  get takesCronicMedicine(){
    return this.healthInfoFormGroup.get('takesCronicMedicine');
  }

  get cronicMedicines(){
    return this.healthInfoFormGroup.get('cronicMedicines');
  }
  
  onSaveForm($event: any)
  {
    if (this.healthInfoFormGroup.valid)
    {
      console.log("saving form and navigating");
    }
  }
  
  private _buildhealthInfoFormGroup(): FormGroup {
    const healthFormFields = new FormGroup({
      takesCronicMedicine: new FormControl(false, [ Validators.required ]),
      cronicMedicines: new FormControl('', this._cronicMedicinesValidator)
    });
   
    return healthFormFields;
  }

}
