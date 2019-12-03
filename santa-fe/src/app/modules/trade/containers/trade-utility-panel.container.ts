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
      selectLiveUpdateProcessingRawData,
      selectLiveUpdateCount
    } from 'Trade/selectors/trade.selectors';
    import {
      LIVE_UPDATE_COUNTDOWN,
      LIVE_UPDATE_INPROG_PROMPT,
      LIVE_UPDATE_PROCESSING_PROMPT
    } from 'Core/constants/tradeConstants.constant';
  //

@Component({
  selector: 'trade-utility-panel',
  templateUrl: './trade-utility-panel.container.html',
  styleUrls: ['./trade-utility-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeUtilityPanel implements OnInit, OnDestroy {
  state: TradeUtilityPanelState;
  constants = {
    liveUpdateCountdown: LIVE_UPDATE_COUNTDOWN,
    liveUpdateInprogPrompt: LIVE_UPDATE_INPROG_PROMPT,
    liveUpdateProcessingPrompt: LIVE_UPDATE_PROCESSING_PROMPT
  }
  internalCount$: Observable<any>;
  subscriptions = {
    internalCountSub: null,
    externalCountSub: null,
    processingRawDataSub: null
  };

  private initializePageState() {
    this.state = {
      prompt: this.constants.liveUpdateInprogPrompt,
      updateCountdown: this.constants.liveUpdateCountdown.toString(),
      isPaused: true,
      isCallingAPI: false,
      isProcessingData: false
    };
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
        if (!this.state.isPaused && !this.state.isCallingAPI && !this.state.isProcessingData) {
          const newCountdown = parseInt(this.state.updateCountdown) - 1;
          this.state.updateCountdown = newCountdown < 10 ? `0${newCountdown}` : `${newCountdown}`;
          this.store$.dispatch(new TradeLiveUpdateUtilityInternalCountEvent());
        }
      }
    });

    this.subscriptions.externalCountSub = this.store$.pipe(
      select(selectLiveUpdateCount)
    ).subscribe(count => {
      if (count >= this.constants.liveUpdateCountdown) {
        this.state.updateCountdown = this.constants.liveUpdateCountdown.toString();
        this.state.isCallingAPI = true;
        this.store$.dispatch(new TradeLiveUpdateStartEvent());
      }
    });

    this.subscriptions.processingRawDataSub = this.store$.pipe(
      select(selectLiveUpdateProcessingRawData)
    ).subscribe(flag => {
      if (!!flag) {
        this.state.isCallingAPI = false;
        this.state.isProcessingData = true;
        this.state.prompt = this.constants.liveUpdateProcessingPrompt;
      } else {
        this.state.isProcessingData = false;
        this.state.prompt = this.constants.liveUpdateInprogPrompt;
      }
    });
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }

  public onClickPause() {
    if (!this.state.isCallingAPI && !this.state.isProcessingData) {
      this.state.isPaused = !this.state.isPaused;
    }
  }
}