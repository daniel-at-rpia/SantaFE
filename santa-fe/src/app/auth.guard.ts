import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { RestfulCommService } from 'Core/services/RestfulCommService';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private restfulCommService: RestfulCommService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    console.log('rejected by auth');
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/trade']);
    return false;
  }
}