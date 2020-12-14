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

  private routeStore = {
    store: {}
  }
  
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    console.log('test, store is', this.globalWorkflowIOService.temporaryStore);
    return this.routeStore.store[this.getRouteIdentifier(route)];
  }

  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return true;
  }

  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle) {
    this.routeStore.store[this.getRouteIdentifier(route)] = handle;
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.routeStore.store[this.getRouteIdentifier(route)];
  }

  public shouldReuseRoute(
    futureRoute: ActivatedRouteSnapshot,
    currentRoute: ActivatedRouteSnapshot
  ): boolean {
    return futureRoute.routeConfig === currentRoute.routeConfig;
  }

  private getRouteIdentifier(targetRoute: ActivatedRouteSnapshot): string {
    let routeIdentifier = '';
    targetRoute.url.forEach((eachSegment) => {
      routeIdentifier = routeIdentifier === '' ? eachSegment.path : `${routeIdentifier}/${eachSegment.path}`;
    });
    return routeIdentifier;
  }
}