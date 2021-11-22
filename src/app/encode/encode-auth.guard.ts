import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { EncodeUserService } from './services/EncodeUserService';

@Injectable({
  providedIn: 'root'
})
export class EncodeAuthGuard implements CanActivate {
  
  constructor(private _userService: EncodeUserService, private _router: Router) {}

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
      if (await this._userService.loadUser(userId))
      {
        // Redirect to the home page
        return this._router.parseUrl(url + '/bienvenido');
      }
    }

    // Redirect to the home page
    return this._router.parseUrl('/');
  }
  
}
