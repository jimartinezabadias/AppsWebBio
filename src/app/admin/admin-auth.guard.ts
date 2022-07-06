import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from 'src/app/admin/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  
  constructor(
    private _authService: AuthService,
    private _router: Router
  )
  {
  }
  
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const isUserLoggedIn = await lastValueFrom(
      this._authService.user$
        .pipe(
          take(1),
          map(user => !!user)
        )
    );
    
    if (isUserLoggedIn){
      return true;
    }

    return this._router.parseUrl("/");
  }

}
