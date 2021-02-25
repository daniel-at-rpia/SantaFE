  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { of, Subscription, Subject } from 'rxjs';
    import { catchError, first, tap, withLatestFrom, combineLatest, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import { DTOService, UtilityService, RestfulCommService, BICsDataProcessingService, GlobalWorkflowIOService } from '../services';
  //

type baseEnforceInheritanceKey = 'SANTA_CONTAINER_COMPONENT';

interface initializeSubscriptions {
  initializeSubscriptions(): baseEnforceInheritanceKey;
}

export abstract class SantaContainerComponentBase implements OnInit, OnDestroy, initializeSubscriptions {
  abstract componentName: string;
  abstract subscriptions: {[property: string]: Subscription};

  constructor(
    protected globalWorkflowIOService: GlobalWorkflowIOService
  ){

  }

  public ngOnInit(): baseEnforceInheritanceKey {
    this.initializeSubscriptions();
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

  public initializeSubscriptions(): baseEnforceInheritanceKey {
    this.globalWorkflowIOService.storeSubscriptions(this.componentName, this.subscriptions);
    return 'SANTA_CONTAINER_COMPONENT';
  }
}