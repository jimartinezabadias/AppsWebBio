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

  constructor(private _userService: EncodeUserService) 
  {
    this.healthInfoFormGroup = this._buildhealthInfoFormGroup();
  }

  
  ngOnInit(): void 
  {
  }
  
  onSaveForm($event: any)
  {
    console.log("saving form and navigating");
  }
  
  private _buildhealthInfoFormGroup(): FormGroup {
    const healthFormFields = new FormGroup({
      takesCronicMedicine: new FormControl(false, [
        Validators.required
      ])
    });
   
    return healthFormFields;
  }

}
