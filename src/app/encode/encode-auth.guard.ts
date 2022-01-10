import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { DataDbService } from '../core/services/db/data-db.service';
import { EncodeUserService } from './services/EncodeUserService';

@Injectable({
  providedIn: 'root'
})
export class EncodeAuthGuard implements CanActivate {
  
  constructor(private _userService: EncodeUserService, private _router: Router, private _dbService: DataDbService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> 
  {
    const url: string = state.url;
    return this.checkLogin(url, route);
  }
  
  private async checkLogin(url: string, route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    const userId: string = route.paramMap.get('userId');
    
    // check if user is already loged-in
    if (this._userService.user) 
    { 
      if (this._userService.user.uid == userId)
      {
        return true;
      } 
    }
    else if (route.children.length == 0)
    {
      this._userService.user = await this._dbService.getEncodeUser(userId);
      if (this._userService.user != null)
      {
        // Redirect to the home page
        return this._router.parseUrl(url + '/bienvenido');
      }
    }

    // Redirect to the home page
    return this._router.parseUrl('/');
  }
  
}
