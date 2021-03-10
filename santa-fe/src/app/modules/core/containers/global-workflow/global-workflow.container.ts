  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { Router, ActivatedRoute } from '@angular/router';
    import { Location } from '@angular/common';
    import { Observable, Subscription, interval, of } from 'rxjs';
    import { tap, first, withLatestFrom, switchMap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import * as GlobalServices from 'Core/services/index';
    import { selectGlobalWorkflowNewState, selectGlobalWorkflowIndexedDBReadyState } from 'Core/selectors/core.selectors';
    import { CoreGlobalWorkflowUpdateCurrentStructureState, CoreGlobalWorkflowUpdateCurrentTradeState } from 'Core/actions/core.actions';
    import { GlobalWorkflowStateDTO } from 'FEModels/frontend-models.interface';
    import { GlobalWorkflowState } from 'FEModels/frontend-page-states.interface';
    import { NavigationModule } from 'Core/constants/coreConstants.constant';
  //

@Component({
  selector: 'global-workflow',
  templateUrl: './global-workflow.container.html',
  styleUrls: ['./global-workflow.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class GlobalWorkflow implements OnInit, OnDestroy {
  state: GlobalWorkflowState;
  subscriptions = {
    navigationStartSub: null,
    newStateSub: null,
    indexedDBReadySub: null
  };
  constants = {
    moduleUrl: NavigationModule
  }

  constructor(
    private store$: Store<any>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilityService: GlobalServices.UtilityService,
    private GlobalWorkflowIOService: GlobalServices.GlobalWorkflowIOService,
    private angularLocation: Location
  ) {
    this.state = {
      currentState: null,
      isIndexedDBReady: false
    }
  }

  public ngOnInit() {
    this.subscriptions.newStateSub = this.store$.pipe(
      select(selectGlobalWorkflowNewState)
    ).subscribe(
      (newState: GlobalWorkflowStateDTO) => {
        if (!!newState && !!newState.data.uuid && !!newState.data.module) {
          // need to deepCopy because the one in ngrx store is readonly
          const mutableNewState = this.utilityService.deepCopy(newState);
          if (mutableNewState.state.updateCurrentState && !!this.state.currentState) {
            mutableNewState.uuid = this.state.currentState.uuid;
            mutableNewState.data.uuid = this.state.currentState.uuid;
          } else {
            if (!mutableNewState.state.triggersRedirect) {
              // the states that triggers redirect don't need to be manually pushed into document history
              this.router.navigate([mutableNewState.data.module, mutableNewState.data.uuid]);
              // this.angularLocation.go(`/${mutableNewState.data.module}/${mutableNewState.data.uuid}`);
            }
            if (mutableNewState.data.module === this.constants.moduleUrl.structuring) {
              this.store$.dispatch(new CoreGlobalWorkflowUpdateCurrentStructureState(mutableNewState.data.uuid));
            } else if (mutableNewState.data.module === this.constants.moduleUrl.trade) {
              this.store$.dispatch(new CoreGlobalWorkflowUpdateCurrentTradeState(mutableNewState.data.uuid));
            }
          }
          this.storeState(mutableNewState);
          this.state.currentState = mutableNewState;
        }
      }
    );

    this.subscriptions.indexedDBReadySub = this.store$.pipe(
      select(selectGlobalWorkflowIndexedDBReadyState)
    ).subscribe((isReady) => {
      this.state.isIndexedDBReady = !!isReady;
      if (isReady && !this.state.currentState) {
        // fetch initial state from indexedDB
        const currentStateUUID = this.extractStateUUIDFromWindowLocation();
        if (!!currentStateUUID) {
          this.GlobalWorkflowIOService.fetchState(currentStateUUID).pipe(
            first()
          ).subscribe((state) => {
            // need to deepCopy because the one in ngrx store is readonly
            this.state.currentState = this.utilityService.deepCopy(state);
          });
        }
      }
    });
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      if (!!this.subscriptions[eachItem]) {
        const eachSub = this.subscriptions[eachItem] as Subscription;
        eachSub.unsubscribe();
      }
    }
  }

  private storeState(targetState: GlobalWorkflowStateDTO) {
    if (!!targetState && this.state.isIndexedDBReady) {
      this.GlobalWorkflowIOService.storeState(targetState);
    }
  }

  private extractStateUUIDFromWindowLocation(): string {
    const slicedUrl = window.location.pathname.split('/');
    if (slicedUrl.length > 2) {
      return slicedUrl[2];
    } else {
      return null;
    }
  }

}