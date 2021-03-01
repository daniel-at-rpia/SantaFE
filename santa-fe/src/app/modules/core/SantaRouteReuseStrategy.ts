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
  
  /*
    Temporarily turn off all functionalities due to the problem with ngdestory requires more time to solve
  */

  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const targetHandler = this.globalWorkflowIOService.fetchHandler(this.getRouteIdentifier(route));
    if (!!targetHandler) {
      return true;
    } else {
      // about to enter a new state in a module, by which time new instance of all components are going to be initialized
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
    // within Angular's activateRoutes() source code, it has a line that if we are about to attach a route, it will run "this.routeReuseStrategy.store(future.snapshot, null)". The comment is "if we have a normal route, we need to place the component into the outlet and recurse."
    // This makes no sense in the context of our solution, we don't need a placeholder for that future snapshot, storing the placeholder actually rewrites what we currently have in the dictionary, so we simply skip the store operation if the hanlder is null
    if (!!handle) {
      this.globalWorkflowIOService.attachRouteHandlerToState(this.getRouteIdentifier(route), handle);
    }
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
    // In our application this function always get executed twice during a route change, first time the two routes are "primary" in "outlet" and null in "routeConfig", but only the second time contains the actual urls.
    // The first time triggered is because route change detection always starts at the root level, second time is the child of the first, which is at our "Page" level.
    // So our reuse strategy is that we only trigger it when it's switching module
    if (!!futureRoute.routeConfig && !!currentRoute.routeConfig) {
      if (futureRoute.routeConfig === currentRoute.routeConfig) {
        // return true;
        if (futureRoute.params.stateId === currentRoute.params.stateId) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return true;
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