import { Component, OnInit } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';

@Component({
    selector: 'app-encode-wellcome',
    templateUrl: './encode-wellcome.component.html',
    styleUrls: ['../encode.component.scss','wellcome.component.scss']
})

export class EncodeWellcomeComponent implements OnInit {

  public userName: string;

  constructor(private _userService: EncodeUserService) 
  {
  }

  ngOnInit(): void 
  {
    this.userName = this._userService.user.name;
  }
  
}
