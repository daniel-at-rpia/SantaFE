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
  
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const targetState = this.globalWorkflowIOService.fetchState(this.getRouteIdentifier(route));
    if (!!targetState && !!targetState.api.routeHandler) {
      return true;
    } else {
      return false;
    }
  }

  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return true;
  }

  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle) {
    this.globalWorkflowIOService.attachRouteHandlerToState(this.getRouteIdentifier(route), handle);
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.globalWorkflowIOService.fetchHandler(this.getRouteIdentifier(route));
  }

  public shouldReuseRoute(
    futureRoute: ActivatedRouteSnapshot,
    currentRoute: ActivatedRouteSnapshot
  ): boolean {
    return futureRoute.routeConfig === currentRoute.routeConfig;
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