  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { Router, ActivatedRoute } from '@angular/router';
    import { Observable, Subscription, interval, of } from 'rxjs';
    import { tap, first, withLatestFrom, switchMap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import * as GlobalServices from 'Core/services/index';
    import { selectGlobalWorkflowNewState } from 'Core/selectors/core.selectors';
    import { CoreGlobalWorkflowUpdateCurrentState } from 'Core/actions/core.actions';
    import { GlobalWorkflowStateDTO } from 'FEModels/frontend-models.interface';
    import { GlobalWorkflowState } from 'FEModels/frontend-page-states.interface';
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
    newStateSub: null
  };

  constructor(
    private store$: Store<any>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilityService: GlobalServices.UtilityService,
    private GlobalWorkflowIOService: GlobalServices.GlobalWorkflowIOService
  ) {
    this.state = {
      currentState: null
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
            // don't block current thread
            setTimeout(function(){
              history.pushState(null, newState.data.workflowType, `/${newState.data.module}/${newState.data.uuid}`);
            }, 1);
          }
          if (!this.state.currentState || this.state.currentState.data.uuid !== newState.data.uuid) {
            this.storeState(newState);
            // need to deepCopy because the one in ngrx store is readonly
            this.state.currentState = this.utilityService.deepCopy(newState);
            this.store$.dispatch(new CoreGlobalWorkflowUpdateCurrentState(newState.data.uuid));
          }
        }
      }
    );
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(eachItem)) {
        const eachSub = this.subscriptions[eachItem] as Subscription;
        eachSub.unsubscribe();
      }
    }
  }

  private storeState(targetState: GlobalWorkflowStateDTO) {
    // temporarily putting it in the page state, eventually need to be put into indexedDB
    if (!!targetState) {
      // this.state.temporaryStore[targetState.data.uuid] = targetState;
      this.GlobalWorkflowIOService.storeState(targetState);
    }
  }

}