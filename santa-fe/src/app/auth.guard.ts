import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription, interval, of } from 'rxjs';
import { tap, map, delay,
      catchError,first, withLatestFrom, switchMap, filter } from 'rxjs/operators';

import { RestfulCommService } from 'Core/services/RestfulCommService';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private restfulCommService: RestfulCommService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.restfulCommService.authenticate().pipe(
        first(),
        delay(20000), 
        map((serverReturn) => {
          console.log('auth succeeded');
          return true;
        }),
        catchError(err => {
          console.log('auth failed');
          return of(false);
        })
      )


    // console.log('rejected by auth');
    // // not logged in so redirect to login page with the return url
    // this.router.navigate(['/trade']);
    // return false;
  }
}