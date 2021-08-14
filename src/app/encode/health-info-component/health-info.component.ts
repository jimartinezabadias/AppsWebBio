import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EncodeUserService } from '../services/EncodeUserService';

@Component({
    selector: 'app-encode-health-info',
    templateUrl: './health-info.component.html',
    styleUrls: ['health-info.component.scss','../encode.component.scss']
})

export class EncodeHealthInfoComponent implements OnInit {

  public healthInfoFormGroup: FormGroup;

  get takesCronicMedicine()
  {
    return this.healthInfoFormGroup.get('takesCronicMedicine');
  }

  get cronicMedicines()
  {
    return this.healthInfoFormGroup.get('cronicMedicines');
  }
  
  constructor(private _userService: EncodeUserService) 
  {
    this.healthInfoFormGroup = this._buildhealthInfoFormGroup();
  }
  
  ngOnInit(): void 
  {
    this.takesCronicMedicine.valueChanges.subscribe(this._takesMedicineObserver);
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
      cronicMedicines: new FormControl('')
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

}
