  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { of, Subscription, Subject } from 'rxjs';
    import { catchError, first, tap, withLatestFrom, combineLatest, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import { DTOService, UtilityService, RestfulCommService, BICsDataProcessingService, GlobalWorkflowIOService } from '../services';
  //

type componentKey = 'SANTA_CONTAINER_COMPONENT';

interface initializeSubscriptions {
  initializeSubscriptions(): componentKey;
}

export abstract class SantaContainerComponentBase implements OnInit, OnDestroy, initializeSubscriptions {
  abstract subscriptions: {[property: string]: Subscription};

  constructor(
    protected globalWorkflowIOService: GlobalWorkflowIOService
  ){

  }

  public ngOnInit(): componentKey {
    this.initializeSubscriptions();
    return 'SANTA_CONTAINER_COMPONENT';
  }

  public ngOnDestroy(): componentKey {
    for (const eachItem in this.subscriptions) {
      if (!!this.subscriptions[eachItem]) {
        const eachSub = this.subscriptions[eachItem];
        eachSub.unsubscribe();
      }
    }
    return 'SANTA_CONTAINER_COMPONENT';
  }

  public initializeSubscriptions(): componentKey {
    const listOfSubs = [];
    for (const eachItem in this.subscriptions) {
      if (!!this.subscriptions[eachItem]) {
        const eachSub = this.subscriptions[eachItem];
        listOfSubs.push(eachSub);
      }
    }
    this.globalWorkflowIOService.storeSubscriptions(listOfSubs);
    return 'SANTA_CONTAINER_COMPONENT';
  }
}