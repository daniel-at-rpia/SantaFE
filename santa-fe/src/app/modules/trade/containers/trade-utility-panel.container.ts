  // dependencies
    import {
      Component,
      ViewEncapsulation,
      OnInit,
      OnDestroy,
      Input
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
      TradeLiveUpdateUtilityInternalCountEvent,
      TradeChangeBestQuoteValidWindowEvent
    } from 'Trade/actions/trade.actions';
    import {
      selectLiveUpdateTick,
      selectLiveUpdateInProgress,
      selectLiveUpdateProcessingRawData,
      selectLiveUpdateCount,
      selectPresetSelected,
      selectInitialDataLoaded
    } from 'Trade/selectors/trade.selectors';
    import {
      LIVE_UPDATE_COUNTDOWN,
      LIVE_UPDATE_INPROG_PROMPT,
      LIVE_UPDATE_PROCESSING_PROMPT,
      UTILITY_VALID_WINDOW_OPTIONS
    } from 'Core/constants/tradeConstants.constant';
  //

@Component({
  selector: 'trade-utility-panel',
  templateUrl: './trade-utility-panel.container.html',
  styleUrls: ['./trade-utility-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeUtilityPanel implements OnInit, OnDestroy {
  @Input() sidePanelsDisplayed: boolean;
  state: TradeUtilityPanelState;
  constants = {
    liveUpdateCountdown: LIVE_UPDATE_COUNTDOWN,
    liveUpdateInprogPrompt: LIVE_UPDATE_INPROG_PROMPT,
    liveUpdateProcessingPrompt: LIVE_UPDATE_PROCESSING_PROMPT,
    utilityValidWindowOptions: UTILITY_VALID_WINDOW_OPTIONS
  }
  internalCount$: Observable<any>;
  subscriptions = {
    internalCountSub: null,
    externalCountSub: null,
    processingRawDataSub: null,
    presetSelectedSub: null,
    initialDataLoadedSub: null
  };

  private initializePageState() {
    this.state = {
      prompt: this.constants.liveUpdateInprogPrompt,
      updateCountdown: this.constants.liveUpdateCountdown.toString(),
      isPaused: true,
      isCallingAPI: false,
      isProcessingData: false,
      isPresetSelected: false,
      isInitialDataLoaded: false,
      validWindowConfig: {
        valueRaw: 2,
        valueDisplay: '2 Hrs',
        isEditing: false
      }
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
        if (this.state.isPresetSelected && !this.state.isPaused && !this.state.isCallingAPI && !this.state.isProcessingData) {
          const newCountdown = parseInt(this.state.updateCountdown) - 1;
          this.state.updateCountdown = newCountdown < 10 ? `0${newCountdown}` : `${newCountdown}`;
          this.store$.dispatch(new TradeLiveUpdateUtilityInternalCountEvent());
        }
      }
    });

    // triggering new update needs to be guarded with highest degree of async protection, so use selectors for fetching all flags here
    this.subscriptions.externalCountSub = this.store$.pipe(
      select(selectLiveUpdateCount),
      withLatestFrom(
        this.store$.pipe(select(selectPresetSelected)),
        this.store$.pipe(select(selectLiveUpdateInProgress)),
        this.store$.pipe(select(selectLiveUpdateProcessingRawData)),
        this.store$.pipe(select(selectInitialDataLoaded))
      )
    ).subscribe(([count, isPresetSelected, isUpdateInProgress, isProcessingRawData, isInitialDataLoaded]) => {
      if (isPresetSelected && !isUpdateInProgress && !isProcessingRawData && isInitialDataLoaded && count >= this.constants.liveUpdateCountdown) {
        this.startUpdate();
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

    this.subscriptions.presetSelectedSub = this.store$.pipe(
      select(selectPresetSelected)
    ).subscribe(flag => {
      this.state.isPresetSelected = flag;
      this.state.isPaused = !this.state.isPresetSelected || !this.state.isInitialDataLoaded;
    });

    this.subscriptions.initialDataLoadedSub = this.store$.pipe(
      select(selectInitialDataLoaded)
    ).subscribe(flag => {
      this.state.isInitialDataLoaded = flag;
      this.state.isPaused = !this.state.isPresetSelected || !this.state.isInitialDataLoaded;
    });
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }

  // disabled temporarily
  // public onClickPause() {
  //   if (!this.state.isCallingAPI && !this.state.isProcessingData && this.state.isPresetSelected) {
  //     this.state.isPaused = !this.state.isPaused;
  //   }
  // }

  public onClickUpdateNow() {
    this.startUpdate();
  }

  public onClickEditValidWindow() {
    this.state.validWindowConfig.isEditing = true;
  }

  public onClickCancelEditValidWindow() {
    this.state.validWindowConfig.isEditing = false;
  }

  public onSelectValidWindow(eachOption) {
    if (!!eachOption) {
      this.state.validWindowConfig.valueRaw = eachOption['value'];
      this.state.validWindowConfig.valueDisplay = eachOption['label'];
      this.state.validWindowConfig.isEditing = false;
      this.store$.dispatch(new TradeChangeBestQuoteValidWindowEvent(this.state.validWindowConfig.valueRaw));
    }
  }

  private startUpdate() {
    if (!this.state.isPaused && !this.state.isCallingAPI && !this.state.isProcessingData && this.state.isPresetSelected) {
      this.state.updateCountdown = this.constants.liveUpdateCountdown.toString();
      this.state.isCallingAPI = true;
      this.store$.dispatch(new TradeLiveUpdateStartEvent());
    }
  }
}