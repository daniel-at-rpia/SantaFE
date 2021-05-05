    import { Injectable } from '@angular/core';
    import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
    import { Observable, Subscription, interval, of } from 'rxjs';
    import { tap, map, delay, catchError , first, withLatestFrom, switchMap, filter } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { CoreUserLoggedIn } from 'Core/actions/core.actions';
    import { FAILED_USER_INITIALS_FALLBACK, DevWhitelist } from 'Core/constants/coreConstants.constant';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constants = {
    userInitialsFallback: FAILED_USER_INITIALS_FALLBACK,
    devWhitelist: DevWhitelist
  };

  constructor(
    private store$: Store<any>,
    private router: Router,
    private restfulCommService: RestfulCommService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.restfulCommService.authenticate().pipe(
      first(),
      map((serverReturn) => {
        if (typeof serverReturn === "string" && serverReturn.length === 2) {
          this.loadOwnerInitial(serverReturn);
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
    this.loadOwnerInitial(this.constants.userInitialsFallback);
  }

  private loadOwnerInitial(serverReturn: string) {
    const user = this.constants.devWhitelist.indexOf(serverReturn) >= 0 ? 'DM' : serverReturn;
    this.restfulCommService.updateUser(user);
    this.store$.dispatch(new CoreUserLoggedIn(user));
  }

}