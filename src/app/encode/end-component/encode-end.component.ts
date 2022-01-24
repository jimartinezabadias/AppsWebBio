import { Component, OnInit } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { Router, UrlTree } from "@angular/router";
import { OnExit } from '../exit.guard';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-encode-end',
    templateUrl: './encode-end.component.html',
    styleUrls: ['../encode.component.scss','end.component.scss']
})
export class EncodeEndComponent implements OnInit, OnExit {
  
  public userName: string;

  constructor(private _userService: EncodeUserService, 
    private _router: Router) 
  {
  }

  async ngOnInit(): Promise<void> 
  {
    this.userName = this._userService.user.name;
    this._userService.user.sessionOne.completed = true;
    await this._userService.updateUserInDB();
  }

  public onExit(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    return this._router.navigate(["/"]);
  }

}
