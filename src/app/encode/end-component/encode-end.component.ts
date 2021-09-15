import { Component, OnInit } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';

@Component({
    selector: 'app-encode-end',
    templateUrl: './encode-end.component.html',
    styleUrls: ['../encode.component.scss','end.component.scss']
})

export class EncodeEndComponent implements OnInit {

  public userName: string;

  constructor(private _userService: EncodeUserService) 
  {
  }

  ngOnInit(): void 
  {
    this.userName = this._userService.user().name;
  }

}
