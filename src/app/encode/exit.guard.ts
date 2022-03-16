import {Injectable} from '@angular/core';
import {CanDeactivate, Router} from '@angular/router';

import {Observable} from 'rxjs';

export interface OnExit {
  onExit: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ExitGuard implements CanDeactivate<OnExit> {
  constructor(private _router: Router)
  {
  }

  canDeactivate(component: OnExit) {
    return component.onExit ? component.onExit() : true;
  }
}