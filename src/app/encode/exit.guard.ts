import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';

import {Observable} from 'rxjs';

export interface OnExit {
  onExit: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ExitGuard implements CanDeactivate<OnExit> {
  canDeactivate(component: OnExit) {
    return component.onExit ? component.onExit() : true;
  }
}