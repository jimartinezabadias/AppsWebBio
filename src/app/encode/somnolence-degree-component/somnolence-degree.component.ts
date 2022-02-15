import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncodeUserService } from '../services/EncodeUserService';
import { SomnolenceDegree } from "../constants";

@Component({
    selector: 'app-encode-somnolence-degree',
    templateUrl: './somnolence-degree.component.html',
    styleUrls: ['somnolence-degree.component.scss','../encode.component.scss']
})
export class EncodeSomnolenceDegreeComponent implements OnInit {

  public somnolenceDegreeFormGroup: FormGroup;
  
  get somnolenceDegrees() 
  {
    return SomnolenceDegree;
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
  
  onSaveForm()
  {
    const formData: SomnolenceDegree = this.somnolenceDegreeFormGroup.get('somnolenceDegree').value;
    if (!this._userService.user.sessionOne.completed) {
      this._userService.user.sessionOne.somnolenceDegree = formData;
    } else if (this._userService.user.sessionOne.completed) {
      this._userService.user.sessionTwo.somnolenceDegree = formData;
    }

    if (this._userService.user.sessionOne.completed == true && this._userService.user.sessionTwo.perpetratorCondition) {
      this._router.navigate(["../suspect-identification"], { relativeTo: this._route });
    } else {
      this._router.navigate(["../google-forms"], { relativeTo: this._route });
    }
  }

  private _buildSomnolenceDegreeFormGroup(): FormGroup {
    const somnolenceFormFields = new FormGroup({
      somnolenceDegree: new FormControl(this.somnolenceDegrees.totallyAwake, [ Validators.required ]),
    });
   
    return somnolenceFormFields;
  }
  
}
