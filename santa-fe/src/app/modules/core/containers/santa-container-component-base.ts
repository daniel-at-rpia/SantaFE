  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
    import { of, Subscription, Subject } from 'rxjs';
    import { catchError, first, tap, withLatestFrom, combineLatest, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import { DTOService, UtilityService, RestfulCommService, BICsDataProcessingService, GlobalWorkflowIOService } from '../services';
  //

type componentKey = 'SANTA_CONTAINER_COMPONENT';

export abstract class SantaContainerComponentBase implements OnInit, OnDestroy {
  abstract subscriptions: {[property: string]: Subscription};
  stateActive: boolean = true;
  initialState: string;
  stateActiveSub: Subscription;

  constructor(
    protected utilityService: UtilityService,
    protected globalWorkflowIOService: GlobalWorkflowIOService,
    protected router: Router
  ){
    if (this.router) {
      this.stateActiveSub = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const currentStateId = this.utilityService.getStateUUIDFromNavigation(event);
          if (!this.initialState) {
            this.initialState = currentStateId;
          }
          this.stateActive = this.initialState === currentStateId;
        }
      });
    }
  }

  public ngOnInit(): componentKey {
    this.storeSubscriptions();
    return 'SANTA_CONTAINER_COMPONENT';
  }

  public ngOnDestroy(): componentKey {
    for (const eachItem in this.subscriptions) {
      if (!!this.subscriptions[eachItem]) {
        const eachSub = this.subscriptions[eachItem];
        eachSub.unsubscribe();
      }
    }
    this.stateActiveSub.unsubscribe();
    return 'SANTA_CONTAINER_COMPONENT';
  }

  public storeSubscriptions(): componentKey {
    const listOfSubs = [];
    for (const eachItem in this.subscriptions) {
      if (!!this.subscriptions[eachItem]) {
        const eachSub = this.subscriptions[eachItem];
        listOfSubs.push(eachSub);
      }
    }
    listOfSubs.push(this.stateActiveSub);
    this.globalWorkflowIOService.storeSubscriptions(listOfSubs);
    return 'SANTA_CONTAINER_COMPONENT';
  }
}