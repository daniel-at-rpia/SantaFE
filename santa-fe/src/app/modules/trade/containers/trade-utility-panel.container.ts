  // dependencies
    import {
      Component,
      ViewEncapsulation,
      OnInit,
      OnDestroy
    } from '@angular/core';
    import {
      Observable,
      Subscription,
      interval,
      of
    } from 'rxjs';
    import {
      tap,
      first,
      withLatestFrom,
      switchMap
    } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import { TradeState } from 'Trade/reducers/trade.reducer';
    import { TradeUtilityPanelState } from 'FEModels/frontend-page-states.interface';
    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import {
      TradeLiveUpdateStartEvent,
      TradeLiveUpdateUtilityInternalCountEvent
    } from 'Trade/actions/trade.actions';
    import {
      selectLiveUpdateTick,
      selectLiveUpdatePaused,
      selectLiveUpdateCount
    } from 'Trade/selectors/trade.selectors';
  //

@Component({
  selector: 'trade-utility-panel',
  templateUrl: './trade-utility-panel.container.html',
  styleUrls: ['./trade-utility-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeUtilityPanel implements OnInit, OnDestroy {
  state: TradeUtilityPanelState;
  internalCount$: Observable<any>;
  subscriptions = {
    internalCountSub: null,
    externalCountSub: null
  };

  private initializePageState() {
    this.state = {};
  }

  constructor(
    private store$: Store<any>
  ){
    this.initializePageState();
  }

  public ngOnInit() {
    this.internalCount$ = interval(1000);
    
    this.subscriptions.internalCountSub = this.internalCount$.subscribe(internalCount => {
      if (internalCount > 0) {  // skip the first beat to sync both counts
        this.store$.dispatch(new TradeLiveUpdateUtilityInternalCountEvent());
      }
    });

    this.subscriptions.externalCountSub = this.store$.pipe(
      select(selectLiveUpdateCount)
    ).subscribe(count => {
      console.log('external count is ', count);
      if (count >= 30) {
        this.store$.dispatch(new TradeLiveUpdateStartEvent())
      }
    });
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }
}