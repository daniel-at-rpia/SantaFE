import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle
} from '@angular/router';
import { Injectable } from '@angular/core';

import { GlobalWorkflowIOService } from 'Core/services';

@Injectable()
export class SantaRouteReuseStrategy implements RouteReuseStrategy {

  constructor(
    private globalWorkflowIOService: GlobalWorkflowIOService
  ) {}
  
  /*
    Temporarily turn off all functionalities due to the problem with ngdestory requires more time to solve
  */

  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const targetHandler = this.globalWorkflowIOService.fetchHandler(this.getRouteIdentifier(route));
    if (!!targetHandler) {
      return true;
    } else {
      return false;
    }
    // return false;
    // const targetState = this.globalWorkflowIOService.fetchState(this.getRouteIdentifier(route));
    // if (!!targetState && !!targetState.api.routeHandler) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return true;
    // return false;
    // return true;
  }

  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle) {
    this.globalWorkflowIOService.attachRouteHandlerToState(this.getRouteIdentifier(route), handle);
    // this.globalWorkflowIOService.attachRouteHandlerToState(this.getRouteIdentifier(route), handle);
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const handler = this.globalWorkflowIOService.fetchHandler(this.getRouteIdentifier(route));
    return handler;
    // return null;
    // const handler = this.globalWorkflowIOService.fetchHandler(this.getRouteIdentifier(route));
    // return handler;
  }

  public shouldReuseRoute(
    futureRoute: ActivatedRouteSnapshot,
    currentRoute: ActivatedRouteSnapshot
  ): boolean {
    if (futureRoute.routeConfig === currentRoute.routeConfig) {
      return true;
    } else {
      return false;
    }
    // return futureRoute.routeConfig === currentRoute.routeConfig;
    // if (!!futureRoute.routeConfig && !!currentRoute.routeConfig && futureRoute.routeConfig === currentRoute.routeConfig) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  private getRouteIdentifier(targetRoute: ActivatedRouteSnapshot): string {
    if (!!targetRoute && !!targetRoute.params && !!targetRoute.params['stateId']) {
      return targetRoute.params['stateId'];
    } else {
      console.warn('route does not have uuid', targetRoute);
      return null;
    }
  }
}