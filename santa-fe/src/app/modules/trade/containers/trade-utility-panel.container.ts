  // dependencies
    import { Component, ViewEncapsulation, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
    import { Router } from '@angular/router';
    import { Observable, Subscription, interval, of } from 'rxjs';
    import { tap, first, withLatestFrom, switchMap, filter } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import { TradeState } from 'Trade/reducers/trade.reducer';
    import { PageStates } from 'Core/models/frontend';
    import { DTOService, UtilityService, GlobalWorkflowIOService } from 'Core/services';
    import { SantaContainerComponentBase } from 'Core/containers/santa-container-component-base';
    import * as globalConstants from 'Core/constants';
    import {
      TradeLiveUpdateStartEvent,
      TradeLiveUpdateUtilityInternalCountEvent,
      TradeChangeBestQuoteValidWindowEvent
    } from 'Trade/actions/trade.actions';
    import {
      selectLiveUpdateTick,
      selectLiveUpdateInProgress,
      selectLiveUpdateProcessingRawDataToMainTable,
      selectLiveUpdateCount,
      selectPresetSelected,
      selectInitialDataLoadedInMainTable
    } from 'Trade/selectors/trade.selectors';
  //

@Component({
  selector: 'trade-utility-panel',
  templateUrl: './trade-utility-panel.container.html',
  styleUrls: ['./trade-utility-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeUtilityPanel extends SantaContainerComponentBase implements OnInit {
  @Input() sidePanelsDisplayed: boolean;
  state: PageStates.TradeUtilityPanelState;
  constants = globalConstants;
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
      tongueExpanded: false,
      prompt: this.constants.trade.LIVE_UPDATE_INPROG_PROMPT,
      updateCountdown: this.constants.trade.LIVE_UPDATE_COUNTDOWN.toString(),
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
    protected utilityService: UtilityService,
    protected globalWorkflowIOService: GlobalWorkflowIOService,
    protected router: Router,
    private store$: Store<any>
  ){
    super(utilityService, globalWorkflowIOService, router);
    this.initializePageState();
  }

  public ngOnInit() {
    this.initializePageState();
    this.internalCount$ = interval(1000);

    this.subscriptions.internalCountSub = this.internalCount$.pipe(
      filter((internalCount) => {
        return this.stateActive;
      })
    ).subscribe(internalCount => {
      if (internalCount > 0 && this.stateActive) {  // skip the first beat to sync both counts
        if (this.state.isPresetSelected && !this.state.isPaused && !this.state.isCallingAPI && !this.state.isProcessingData) {
          const newCountdown = parseInt(this.state.updateCountdown) - 1;
          this.state.updateCountdown = newCountdown < 10 ? `0${newCountdown}` : `${newCountdown}`;
          this.store$.dispatch(new TradeLiveUpdateUtilityInternalCountEvent());
        }
      }
    });

    this.subscriptions.externalCountSub = this.store$.pipe(
      filter((count) => {
        return this.stateActive;
      }),
      select(selectLiveUpdateCount),
      withLatestFrom(
        this.store$.pipe(select(selectPresetSelected)),
        this.store$.pipe(select(selectInitialDataLoadedInMainTable))
      )
    ).subscribe(([count, isPresetSelected, isInitialDataLoaded]) => {
      if (isPresetSelected && isInitialDataLoaded && count >= this.constants.trade.LIVE_UPDATE_COUNTDOWN) {
        this.startUpdate();
      }
    });

    this.subscriptions.processingRawDataSub = this.store$.pipe(
      filter((flag) => {
        return this.stateActive;
      }),
      select(selectLiveUpdateProcessingRawDataToMainTable)
    ).subscribe(flag => {
      if (!!flag) {
        this.state.isCallingAPI = false;
        this.state.isProcessingData = true;
        this.state.prompt = this.constants.trade.LIVE_UPDATE_PROCESSING_PROMPT;
      } else {
        this.state.isProcessingData = false;
        this.state.prompt = this.constants.trade.LIVE_UPDATE_INPROG_PROMPT;
      }
    });

    this.subscriptions.presetSelectedSub = this.store$.pipe(
      filter((flag) => {
        return this.stateActive;
      }),
      select(selectPresetSelected)
    ).subscribe(flag => {
      this.state.isPresetSelected = flag;
      this.state.isPaused = !this.state.isPresetSelected || !this.state.isInitialDataLoaded;
    });

    this.subscriptions.initialDataLoadedSub = this.store$.pipe(
      filter((flag) => {
        return this.stateActive;
      }),
      select(selectInitialDataLoadedInMainTable)
    ).subscribe(flag => {
      this.state.isInitialDataLoaded = flag;
      this.state.isPaused = !this.state.isPresetSelected || !this.state.isInitialDataLoaded;
    });

    return super.ngOnInit();
  }

  // disabled temporarily
  // public onClickPause() {
  //   if (!this.state.isCallingAPI && !this.state.isProcessingData && this.state.isPresetSelected) {
  //     this.state.isPaused = !this.state.isPaused;
  //   }
  // }

  public onToggleTongueExpand() {
    this.state.tongueExpanded = !this.state.tongueExpanded;
  }

  public onClickUpdateNow() {
    this.state.tongueExpanded = false;
    this.startUpdate();
  }

  public onClickEditValidWindow() {
    this.state.validWindowConfig.isEditing = !this.state.validWindowConfig.isEditing;
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
      this.state.updateCountdown = this.constants.trade.LIVE_UPDATE_COUNTDOWN.toString();
      this.state.isCallingAPI = true;
      this.store$.dispatch(new TradeLiveUpdateStartEvent());
    }
  }
}
