import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle
} from '@angular/router';
import { Injectable } from '@angular/core';

import { GlobalWorkflowIOService } from 'Core/services';
import { NavigationModule } from 'Core/constants/coreConstants.constant';

@Injectable()
export class SantaRouteReuseStrategy implements RouteReuseStrategy {

  constructor(
    private globalWorkflowIOService: GlobalWorkflowIOService
  ) {}

  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const targetHandler = this.globalWorkflowIOService.fetchHandler(this.getRouteIdentifier(route));
    if (!!targetHandler) {
      return true;
    } else {
      // about to enter a new state in a module, by which time new instance of all components are going to be initialized
      return false;
    }
  }

  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (!!route.params && !!route.params.stateId) {
      // temporarily disable routeReuse for Trade due to issues with observables being incorrectly emitted in Trade states
      let shouldDetachRoute = false;
      if (!!route.url && route.url.length > 0) {
        const isStructuringRoute = route.url.find(url => url.path === NavigationModule.structuring);
        shouldDetachRoute = !!isStructuringRoute;
      }
      return shouldDetachRoute;
    } else {
      return false;
    }
  }

  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle) {
    // within Angular's activateRoutes() source code, it has a line that if we are about to attach a route, it will run "this.routeReuseStrategy.store(future.snapshot, null)". The comment is "if we have a normal route, we need to place the component into the outlet and recurse."
    // This makes no sense in the context of our solution, we don't need a placeholder for that future snapshot, storing the placeholder actually rewrites what we currently have in the dictionary, so we simply skip the store operation if the hanlder is null
    if (!!handle) {
      this.globalWorkflowIOService.attachRouteHandlerToState(this.getRouteIdentifier(route), handle);
    }
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const handler = this.globalWorkflowIOService.fetchHandler(this.getRouteIdentifier(route));
    return handler;
  }

  public shouldReuseRoute(
    futureRoute: ActivatedRouteSnapshot,
    currentRoute: ActivatedRouteSnapshot
  ): boolean {
    // In our application this function always get executed twice during a route change, first time the two routes are "primary" in "outlet" and null in "routeConfig", but only the second time contains the actual urls.
    // The first time triggered is because route change detection always starts at the root level, second time is the child of the first, which is at our "Page" level.
    // So our reuse strategy is that is we only consider reusing a route if it has the same valid routeConfig, and same stateId
    if (!!futureRoute.routeConfig && !!currentRoute.routeConfig) {
      if (futureRoute.routeConfig === currentRoute.routeConfig) {
        if (futureRoute.params.stateId === currentRoute.params.stateId) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      // gets here when comparing at the root level, root is always reused so that our global services & components are retained
      return true;
    }
  }

  private getRouteIdentifier(targetRoute: ActivatedRouteSnapshot): string {
    if (!!targetRoute && !!targetRoute.params && !!targetRoute.params['stateId']) {
      return targetRoute.params['stateId'];
    } else {
      console.warn('route does not have uuid', targetRoute);
      return null;
    }
  }

  private getModule(targetRoute: ActivatedRouteSnapshot): NavigationModule {
    if (!!targetRoute && !!targetRoute.routeConfig) {
      const slicedPath = targetRoute.routeConfig.path.split('/');
      if (slicedPath.length > 0) {
        return slicedPath[0] as NavigationModule;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}