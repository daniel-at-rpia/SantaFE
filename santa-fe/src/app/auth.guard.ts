import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription, interval, of } from 'rxjs';
import { tap, map, delay, catchError , first, withLatestFrom, switchMap, filter } from 'rxjs/operators';

import { RestfulCommService } from 'Core/services/RestfulCommService';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private restfulCommService: RestfulCommService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.restfulCommService.authenticate().pipe(
      first(),
      map((serverReturn) => {
        console.log('auth succeeded');
        if (typeof serverReturn === "string" && serverReturn.length === 2) {
          return true;
        } else {
          this.blockAccess();
          return false;
        }
      }),
      catchError(err => {
        console.error('auth failed');
        this.blockAccess();
        return of(false);
      })
    );
  }

  private blockAccess() {
    this.router.navigate(['guest']);
  }

}