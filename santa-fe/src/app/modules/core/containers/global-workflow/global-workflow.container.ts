  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { Router, ActivatedRoute } from '@angular/router';
    import { Observable, Subscription, interval, of } from 'rxjs';
    import { tap, first, withLatestFrom, switchMap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import { UtilityService } from 'Core/services/UtilityService';
    import { selectGlobalWorkflowNewState } from 'Core/selectors/core.selectors';
    import { GlobalWorkflowStateDTO } from 'FEModels/frontend-models.interface';
  //

@Component({
  selector: 'global-workflow',
  templateUrl: './global-workflow.container.html',
  styleUrls: ['./global-workflow.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class GlobalWorkflow implements OnInit, OnDestroy{
  subscriptions = {
    navigationStartSub: null,
    proofOfConcept: null
  };

  constructor(
    private store$: Store<any>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilityService: UtilityService
  ) {}

  public ngOnInit() {
    this.subscriptions.proofOfConcept = this.store$.pipe(
      select(selectGlobalWorkflowNewState)
    ).subscribe(
      (newState: GlobalWorkflowStateDTO) => {
        if (!!newState && !!newState.data.uuid && !!newState.data.module) {
          // this.router.navigateByUrl(`/${newState.data.module}/${newState.data.uuid}`);
          // don't block current thread
          setTimeout(function(){
            history.pushState(newState, newState.data.title, `/${newState.data.module}/${newState.data.uuid}`);
          }, 1);
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

}