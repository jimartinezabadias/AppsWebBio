import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IEncodeGoogleFormResponse } from '../models/IEncodeGoogleFormResponse';
import { IEncodeUser } from '../models/IEncodeUser';
import { EncodeUserService } from '../services/EncodeUserService';

@Component({
    selector: 'app-encode-google-forms',
    templateUrl: './encode-google-forms.component.html',
    styleUrls: ['encode-google-forms.component.scss','../encode.component.scss']
})

export class EncodeGoogleFormsComponent {
  
  public userForms: IEncodeGoogleFormResponse[] = null;
  
  public embeddedParameter: string = "embedded=true"; 

  constructor(private _userService: EncodeUserService) 
  {
    // this.userForms = this._userService.user().googleFormsResponses;
    this._userService.loadUser$(this._userService.user().uid);
    this._userService.user$().subscribe(this._userObserver);
  }

  public openForm(formURL: string): void
  {
    let windowRef: Window;
    windowRef = window.open(formURL,"formPopup","width=600,height=600");
  }

  public isFormDisabled(formIndex: number): boolean
  {
    const isEnabled = this.userForms[formIndex - 1] ? this.userForms[formIndex - 1].isResponded : true;  
    return !isEnabled;
  }

  private _userObserver = (user: IEncodeUser) => {
    console.log("user updated");
    console.log(user);
    this.userForms = user.googleFormsResponses;
  }
  
}
