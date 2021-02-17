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
          // the states that triggers redirect don't need to be manually pushed into document history
          if (!newState.state.triggersRedirect) {
            this.router.navigate([newState.data.module, newState.data.uuid]);
          }
          if (!this.state.currentState || this.state.currentState.data.uuid !== newState.data.uuid) {
            this.storeState(newState);
            // need to deepCopy because the one in ngrx store is readonly
            this.state.currentState = this.utilityService.deepCopy(newState);
            if (newState.data.module === this.constants.moduleUrl.structuring) {
              this.store$.dispatch(new CoreGlobalWorkflowUpdateCurrentStructureState(newState.data.uuid));
            } else if (newState.data.module === this.constants.moduleUrl.trade) {
              this.store$.dispatch(new CoreGlobalWorkflowUpdateCurrentTradeState(newState.data.uuid));
            }
          }
        }
      }
    );

    this.subscriptions.indexedDBReadySub = this.store$.pipe(
      select(selectGlobalWorkflowIndexedDBReadyState)
    ).subscribe((isReady) => {
      this.state.isIndexedDBReady = !!isReady;
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

}