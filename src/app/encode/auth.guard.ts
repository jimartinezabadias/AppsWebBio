import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { IEncodeUser } from './models/IEncodeUser';
import { EncodeUserService } from './services/EncodeUserService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private _userService: EncodeUserService)
  {

  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> 
  {
    let userId: string = route.paramMap.get('userId');
    let user: IEncodeUser = await this._userService.getUser(userId);
    console.log(user);
    if (user) 
    {
      console.log("se encontro el usuario");
      return user.userId == userId;
    }
    console.log("no se encontro el usuario");
    return false;
  }
  
}
