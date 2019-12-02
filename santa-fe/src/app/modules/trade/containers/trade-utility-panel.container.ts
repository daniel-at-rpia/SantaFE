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
      interval
    } from 'rxjs';
    import {
      tap,
      first
    } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import { TradeState } from 'Trade/reducers/trade.reducer';
    import { TradeUtilityPanelState } from 'FEModels/frontend-page-states.interface';
    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { TradeLiveUpdateStartEvent } from 'Trade/actions/trade.actions';
    import { selectLiveUpdateTick } from 'Trade/selectors/trade.selectors';
  //

@Component({
  selector: 'trade-utility-panel',
  templateUrl: './trade-utility-panel.container.html',
  styleUrls: ['./trade-utility-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeUtilityPanel implements OnInit, OnDestroy {
  state: TradeUtilityPanelState;
  countSecond$: Observable<any>;
  subscriptions = {
    startNewUpdateSub: null,
    countSecondSub: null
  };

  private initializePageState() {
    this.state = {};
  }

  constructor(
    private store: Store<any>
  ){
    this.initializePageState();
  }

  public ngOnInit() {
    this.countSecond$ = interval(1000);
    this.subscriptions.countSecondSub = this.countSecond$.subscribe(
      // (number) => {
      // console.log('test, number is', number);
      // if (number % 30 === 0) {
      //   console.log('updating...');
      //   this.store.dispatch(new TradeLiveUpdateStartEvent());
      // }
    // }
    );
    this.subscriptions.startNewUpdateSub = this.store.pipe(
      select(selectLiveUpdateTick)
    ).subscribe(tick => {
      console.log('test, got to tick', tick);
    });
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }
}