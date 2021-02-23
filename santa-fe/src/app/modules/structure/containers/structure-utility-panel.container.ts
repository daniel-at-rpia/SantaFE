  // dependencies
    import { Component, ViewEncapsulation, OnInit, OnDestroy, Input } from '@angular/core';
    import { select, Store } from '@ngrx/store';
    import { Subscription } from 'rxjs';
    import { first } from 'rxjs/operators';
    import * as moment from 'moment';

    import { UtilityService, DTOService, GlobalWorkflowIOService } from 'Core/services';
    import { SantaContainerComponentBase } from 'Core/containers/santa-container-component-base';
    import {
      PortfolioMetricValues,
      BreakdownViewFilter,
      SUPPORTED_PORTFOLIO_LIST,
      PortfolioShortNames,
      UTILITY_PANEL_HISTORICAL_TIME_LABEL,
      SubPortfolioFilter,
      DeltaScope
    } from 'Core/constants/structureConstants.constants';
    import {
      selectMetricLevel,
      selectMainPanelUpdateTick,
      selectActiveBreakdownViewFilter,
      selectActivePortfolioViewFilter,
      selectDataDatestamp,
      selectActiveSubPortfolioFilter,
      selectActiveDeltaScope,
      selectUtilityPanelLoadState
    } from 'Structure/selectors/structure.selectors';
    import { StructureUtilityPanelState } from 'Core/models/frontend/frontend-page-states.interface';
    import {
      StructureUpdateMainPanelEvent,
      StructureMetricSelect,
      StructureChangeBreakdownViewFilterEvent,
      StructureChangePortfolioViewFilterEvent,
      StructureSwitchDataDatestampEvent,
      StructureChangeSubPortfolioViewFilterEvent,
      StructureChangeDeltaScopeEvent
    } from 'Structure/actions/structure.actions';
    import { CoreGlobalWorkflowSendNewState } from 'Core/actions/core.actions';
    import { NavigationModule, GlobalWorkflowTypes } from 'Core/constants/coreConstants.constant';
  //

@Component({
  selector: 'structure-utility-panel',
  templateUrl: './structure-utility-panel.container.html',
  styleUrls: ['./structure-utility-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureUtilityPanel extends SantaContainerComponentBase implements OnInit, OnDestroy {
  state: StructureUtilityPanelState;
  subscriptions = {
    selectedMetricLevelSub: null,
    lastUpdateSub: null,
    activeBreakdownViewFilterSub: null,
    activePortfolioViewFilterSub: null,
    dataDatestampSub: null,
    subPortfolioSub: null,
    deltaScopeSub: null,
    utilityPanelLoadStateSub: null
  }
  constants = {
    cs01: PortfolioMetricValues.cs01,
    leverage: PortfolioMetricValues.creditLeverage,
    creditDuration: PortfolioMetricValues.creditDuration,
    breakdownViewFilter: BreakdownViewFilter,
    portfolios: SUPPORTED_PORTFOLIO_LIST,
    beginningOfDay: UTILITY_PANEL_HISTORICAL_TIME_LABEL,
    subPortfolioFilter: SubPortfolioFilter,
    deltaScope: DeltaScope,
    modules: NavigationModule,
    globalWorkflowTypes: GlobalWorkflowTypes
  }

  constructor(
    private store$: Store<any>,
    private utilityService: UtilityService,
    private dtoService: DTOService,
    protected globalWorkflowIOService: GlobalWorkflowIOService
  ) {
    super(globalWorkflowIOService);
  }

  private initializePageState(): StructureUtilityPanelState {
    return {
      selectedMetricValue: null,
      lastUpdateTime: 'n/a',
      currentDatestamp: null,
      currentDatestampDisplayText: 'n/a',
      activeBreakdownViewFilter: null,
      activePortfolioViewFilter: [],
      activeSubPortfolioFilter: null,
      currentDeltaScope: null,
      viewingHistoricalData: false,
      switchDate: {
        datepicker: this.dtoService.formSantaDatepicker('Choose Historical Date', 'Date'),
        changeDate: null
      }
    };
  }

  public ngOnInit() {
    this.state = this.initializePageState();
    this.subscriptions.selectedMetricLevelSub = this.store$.pipe(
      select(selectMetricLevel),
      first()  // Right now Utility Panel is the sole place to initiate a page-wide metric change, so there is no need to have Utility Panel react passively to the ngrx store, instead, it just need to subscribe to the initial value, and update its own state internally in setMetricLevel(). Updating it internally has the benefit of a faster UI response resulted in better UX, because going through the async ngrx flow takes more time
    ).subscribe((value) => {
      const metric = value === this.constants.cs01 ? this.constants.cs01 : this.constants.leverage
      this.state.selectedMetricValue = metric;
    });

    this.subscriptions.lastUpdateSub = this.store$.pipe(
      select(selectMainPanelUpdateTick)
    ).subscribe((tick) => {
      this.state.lastUpdateTime = moment().format('hh:mm:ss a');
    });

    this.subscriptions.activeBreakdownViewFilterSub = this.store$.pipe(
      select(selectActiveBreakdownViewFilter),
      first()  // same reason as above
    ).subscribe((activeFilter) => {
      this.state.activeBreakdownViewFilter = activeFilter;
    });

    this.subscriptions.activePortfolioViewFilterSub = this.store$.pipe(
      select(selectActivePortfolioViewFilter),
      first()  // same reason as above
    ).subscribe((activeFilter) => {
      this.state.activePortfolioViewFilter = activeFilter;
    });

    this.subscriptions.dataDatestampSub = this.store$.pipe(
      select(selectDataDatestamp),
      first()  // same reason as above
    ).subscribe((newDatestampInUnix) => {
      this.updateDataDatestamp(moment.unix(newDatestampInUnix), true);
    });

    this.subscriptions.subPortfolioSub = this.store$.pipe(
      select(selectActiveSubPortfolioFilter),
      first()  // same reason as above
    ).subscribe((activeFilter) => {
      this.state.activeSubPortfolioFilter = activeFilter;
    });

    this.subscriptions.deltaScopeSub = this.store$.pipe(
      select(selectActiveDeltaScope),
      first()  // same reason as above
    ).subscribe((activeScope) => {
      this.state.currentDeltaScope = activeScope;
    });

    this.subscriptions.utilityPanelLoadStateSub = this.store$.pipe(
      select(selectUtilityPanelLoadState)
    ).subscribe((newState) => {
      if (!!newState) {
        console.log('inheriting previous config', newState);
        this.setMetricLevel(newState.selectedMetricValue);
        this.onClickBreakdownFilterChange(newState.activeBreakdownViewFilter);
        this.state.activePortfolioViewFilter = this.utilityService.deepCopy(newState.activePortfolioViewFilter);
        this.store$.dispatch(new StructureChangePortfolioViewFilterEvent(this.utilityService.deepCopy(this.state.activePortfolioViewFilter)));
        this.onClickDeltaScope(newState.currentDeltaScope);
        this.onClickSubPortfolioChange(newState.activeSubPortfolioFilter);
      }
    });
    return super.ngOnInit();
  }

  public setMetricLevel(
    metricLevel: PortfolioMetricValues,
    pushToGlobalState: boolean = false
  ) {
    if (metricLevel !== this.state.selectedMetricValue) {
      this.state.selectedMetricValue = metricLevel;
      const dispatchMetricChange = () => {
        this.store$.dispatch(new StructureMetricSelect(metricLevel));
      };
      setTimeout(dispatchMetricChange.bind(this), 300);
      !!pushToGlobalState && this.pushStateSnapshotToGlobalState();
    }
  }

  public onClickUpdateNow() {
    if (!this.state.viewingHistoricalData) {
      this.store$.dispatch(new StructureUpdateMainPanelEvent());
    }
  }

  public onClickBreakdownFilterChange(
    targetFilterOption: BreakdownViewFilter,
    pushToGlobalState: boolean = false
  ) {
    if (this.state.activeBreakdownViewFilter !== targetFilterOption) {
      this.state.activeBreakdownViewFilter = targetFilterOption;
      this.store$.dispatch(new StructureChangeBreakdownViewFilterEvent(targetFilterOption));
      !!pushToGlobalState && this.pushStateSnapshotToGlobalState();
    }
  }

  public onClickPortfolioFilterChange(targetFilterOption: PortfolioShortNames) {
    if (this.state.activePortfolioViewFilter.indexOf(targetFilterOption) >= 0) {
      this.state.activePortfolioViewFilter = this.state.activePortfolioViewFilter.filter((eachItem) => {
        return eachItem !== targetFilterOption;
      });
    } else {
      this.state.activePortfolioViewFilter.push(targetFilterOption);
    }
    this.store$.dispatch(new StructureChangePortfolioViewFilterEvent(this.utilityService.deepCopy(this.state.activePortfolioViewFilter)));
    this.pushStateSnapshotToGlobalState();
  }

  public onSelectedDateFromSwitchDateDatepicker(targetDate: moment.Moment) {
    if (!!targetDate && moment.isMoment(targetDate)) {
      if (targetDate.isSame(moment(), 'day')) {
        this.onClickBackToToday();
      } else {
        this.updateDataDatestamp(targetDate);
      }
    } else {
      this.onClickBackToToday();
    }
  }

  public onClickBackToToday(updateDatepicker: boolean = false) {
    const now = moment();
    if (!!updateDatepicker) {
      this.state.switchDate.changeDate = now;
    }
    this.updateDataDatestamp(now);
    this.state.lastUpdateTime = now.format('hh:mm:ss a');
  }

  public onClickSubPortfolioChange(
    targetFilterOption: SubPortfolioFilter,
    pushToGlobalState: boolean = false
  ) {
    if (this.state.activeSubPortfolioFilter !== targetFilterOption) {
      this.state.activeSubPortfolioFilter = targetFilterOption;
      this.store$.dispatch(new StructureChangeSubPortfolioViewFilterEvent(targetFilterOption));
    }
    !!pushToGlobalState && this.pushStateSnapshotToGlobalState();
  }

  public onClickDeltaScope(
    newDeltaScope: DeltaScope,
    pushToGlobalState: boolean = false
  ) {
    if (this.state.currentDeltaScope !== newDeltaScope) {
      this.state.currentDeltaScope = newDeltaScope;
      this.store$.dispatch(new StructureChangeDeltaScopeEvent(newDeltaScope));
    }
    !!pushToGlobalState && this.pushStateSnapshotToGlobalState();
  }

  private updateDataDatestamp(
    targetDatestampInMoment: moment.Moment,
    skipNgRX: boolean = false
  ){
    this.state.currentDatestamp = targetDatestampInMoment;
    this.state.currentDatestampDisplayText = this.state.currentDatestamp.format('MMM Do');
    this.state.viewingHistoricalData = !this.state.currentDatestamp.isSame(moment(), 'day');
    if (this.state.viewingHistoricalData) {
      this.state.lastUpdateTime = this.constants.beginningOfDay;
    }
    !skipNgRX && this.store$.dispatch(new StructureSwitchDataDatestampEvent(this.state.currentDatestamp));
  }

  private pushStateSnapshotToGlobalState() {
    const newState = this.dtoService.formGlobalWorkflow(this.constants.modules.structuring, false, this.constants.globalWorkflowTypes.changedStructureUtilityConfig);
    newState.data.stateInfo.structureUtilityPanelSnapshot = this.utilityService.deepCopy(this.state);
    this.store$.dispatch(new CoreGlobalWorkflowSendNewState(newState));
  }

}