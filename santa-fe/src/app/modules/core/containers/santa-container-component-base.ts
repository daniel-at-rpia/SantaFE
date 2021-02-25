  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { of, Subscription, Subject } from 'rxjs';
    import { catchError, first, tap, withLatestFrom, combineLatest, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import { DTOService, UtilityService, RestfulCommService, BICsDataProcessingService, GlobalWorkflowIOService } from '../services';
  //

type baseEnforceInheritanceKey = 'SANTA_CONTAINER_COMPONENT';

export abstract class SantaContainerComponentBase implements OnInit, OnDestroy {
  abstract componentName: string;
  abstract subscriptions: {[property: string]: Subscription};

  constructor(
    protected globalWorkflowIOService: GlobalWorkflowIOService
  ){

  }

  public ngOnInit(): baseEnforceInheritanceKey {
    const reuseSubscriptions = this.globalWorkflowIOService.retrieveSubscriptions(this.componentName);
    if (!!reuseSubscriptions) {
      console.log('test, reuse subscription', this.componentName, reuseSubscriptions);
      this.subscriptions = reuseSubscriptions;
    } else {
      this.startNewSubscriptions();
      this.storeSubscriptions();
    }
    return 'SANTA_CONTAINER_COMPONENT';
  }

  public ngOnDestroy(): baseEnforceInheritanceKey {
    for (const eachItem in this.subscriptions) {
      if (!!this.subscriptions[eachItem]) {
        const eachSub = this.subscriptions[eachItem];
        eachSub.unsubscribe();
      }
    }
    return 'SANTA_CONTAINER_COMPONENT';
  }

  public storeSubscriptions(): baseEnforceInheritanceKey {
    this.globalWorkflowIOService.storeSubscriptions(this.componentName, this.subscriptions);
    return 'SANTA_CONTAINER_COMPONENT';
  }
  
  protected abstract startNewSubscriptions();
}