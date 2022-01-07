import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { EncodeUserService } from './services/EncodeUserService';

@Injectable({
  providedIn: 'root'
})
export class EncodeAbandonedGuard implements CanActivate {
  
  constructor(private _userService: EncodeUserService, private _router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> 
  {
    return this.checkAbandoned(route);
  }
  
  private async checkAbandoned(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    // check if user isnt loaded
    if (this._userService.user == null) {
      const userId: string = route.paramMap.get('userId');
      await this._userService.loadUser(userId);
    }
    
    if (this._userService.user.abandonedByUser)
    {
      // Redirect to the abandoned component
      return this._router.parseUrl('/encode/abandono');
    }

    return true;
  }
  
}
