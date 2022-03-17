import { Component, OnInit } from '@angular/core';
import { IEncodeUser } from '../models/IEncodeUser';
import { EncodeUserService } from '../services/EncodeUserService';

@Component({
    selector: 'app-encode-wellcome',
    templateUrl: './encode-wellcome.component.html',
    styleUrls: ['wellcome.component.scss', '../encode.component.scss']
})
export class EncodeWellcomeComponent implements OnInit {

  public userName: string;
  public user: IEncodeUser;

  constructor(private _userService: EncodeUserService) 
  {
  }

  ngOnInit(): void 
  {
    this.userName = this._userService.user.name;
    this.user = this._userService.user;
  }
  
}
