import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { EncodeUserService } from '../services/EncodeUserService';

@Component({
    selector: 'app-encode-health-info',
    templateUrl: './health-info.component.html',
    styleUrls: ['health-info.component.scss','../encode.component.scss']
})

export class EncodeHealthInfoComponent implements OnInit {

  public healthInfoFormGroup: FormGroup;

  get takesCronicMedicine(): AbstractControl
  {
    return this.healthInfoFormGroup.get('takesCronicMedicine');
  }

  get cronicMedicines(): AbstractControl
  {
    return this.healthInfoFormGroup.get('cronicMedicines');
  }
  
  get hasSleepDisorder(): AbstractControl
  {
    return this.healthInfoFormGroup.get('hasSleepDisorder');
  }

  get sleepDisorders(): AbstractControl
  {
    return this.healthInfoFormGroup.get('sleepDisorders');
  }

  constructor(private _userService: EncodeUserService) 
  {
    this.healthInfoFormGroup = this._buildhealthInfoFormGroup();
  }
  
  ngOnInit(): void 
  {
    this.takesCronicMedicine.valueChanges.subscribe(this._takesMedicineObserver);
    this.hasSleepDisorder.valueChanges.subscribe(this._hasSleepDisorderObserver);
  }

  
  onSaveForm($event: any)
  {
    if (this.healthInfoFormGroup.valid)
    {
      console.log("saving form and navigating");
    } 
    else
    {
      console.log("form has errors");
      console.log(this.healthInfoFormGroup);
    }
  }
  
  private _buildhealthInfoFormGroup(): FormGroup 
  {
    const healthFormFields = new FormGroup({
      takesCronicMedicine: new FormControl(false, [ Validators.required ]),
      cronicMedicines: new FormControl(''),
      hasSleepDisorder: new FormControl(false, [ Validators.required ]),
      sleepDisorders: new FormControl('')
    });
   
    return healthFormFields;
  }

  private _takesMedicineObserver = (isTakingMedicines: boolean) => 
  {
    if(isTakingMedicines) {
      this.cronicMedicines.setValidators(Validators.required);
    } else {
      this.cronicMedicines.setValidators(Validators.nullValidator);
    }

    this.cronicMedicines.updateValueAndValidity({onlySelf:  true});
  }
  
  private _hasSleepDisorderObserver = (hasSleepDisorder: boolean) => 
  {
    if(hasSleepDisorder) {
      this.sleepDisorders.setValidators(Validators.required);
    } else {
      this.sleepDisorders.setValidators(Validators.nullValidator);
    }

    this.sleepDisorders.updateValueAndValidity({onlySelf:  true});
  }

}
