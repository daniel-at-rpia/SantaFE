import { Component, ViewEncapsulation, OnInit, OnDestroy, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

import {
  PortfolioMetricValues,
  BreakdownViewFilter,
  SUPPORTED_PORTFOLIO_LIST,
  PortfolioShortNames
} from 'Core/constants/structureConstants.constants';
import {
  selectMetricLevel,
  selectMainPanelUpdateTick,
  selectActiveBreakdownViewFilter,
  selectActivePortfolioViewFilter,
  selectDataDatestamp
} from 'Structure/selectors/structure.selectors';
import { StructureUtilityPanelState } from 'Core/models/frontend/frontend-page-states.interface';
import {
  StructureUpdateMainPanelEvent,
  StructureMetricSelect,
  StructureChangeBreakdownViewFilterEvent,
  StructureChangePortfolioViewFilterEvent,
  StructureSwitchDataDatestampEvent
} from 'Structure/actions/structure.actions';
import { UtilityService } from 'Core/services';

@Component({
  selector: 'structure-utility-panel',
  templateUrl: './structure-utility-panel.container.html',
  styleUrls: ['./structure-utility-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureUtilityPanel implements OnInit, OnDestroy {
  state: StructureUtilityPanelState;
  subscriptions = {
    selectedMetricLevelSub: null,
    lastUpdateSub: null,
    activeBreakdownViewFilterSub: null,
    activePortfolioViewFilterSub: null,
    dataDatestampSub: null
  }
  constants = {
    cs01: PortfolioMetricValues.cs01,
    leverage: PortfolioMetricValues.creditLeverage,
    creditDuration: PortfolioMetricValues.creditDuration,
    breakdownViewFilter: BreakdownViewFilter,
    portfolios: SUPPORTED_PORTFOLIO_LIST
  }

  constructor(
    private store$: Store<any>,
    private utilityService: UtilityService
  ) {}

  private initializePageState(): StructureUtilityPanelState {
    return {
      selectedMetricValue: null,
      lastUpdateTime: 'n/a',
      currentDatestamp: null,
      currentDatestampDisplayText: 'n/a',
      activeBreakdownViewFilter: null,
      activePortfolioViewFilter: [],
      updateNowDisabled: false
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
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(eachItem)) {
        const eachSub = this.subscriptions[eachItem] as Subscription;
        eachSub.unsubscribe();
      }
    }
  }

  public setMetricLevel(metricLevel: PortfolioMetricValues) {
    if (metricLevel !== this.state.selectedMetricValue) {
      this.state.selectedMetricValue = metricLevel;
      const dispatchMetricChange = () => {
        this.store$.dispatch(new StructureMetricSelect(metricLevel));
      };
      setTimeout(dispatchMetricChange.bind(this), 300);
    }
  }

  public onClickUpdateNow() {
    if (!this.state.viewingHistoricalData) {
      this.store$.dispatch(new StructureUpdateMainPanelEvent());
    }
  }

  public onClickBreakdownFilterChange(targetFilterOption: BreakdownViewFilter) {
    if (this.state.activeBreakdownViewFilter !== targetFilterOption) {
      this.state.activeBreakdownViewFilter = targetFilterOption;
      this.store$.dispatch(new StructureChangeBreakdownViewFilterEvent(targetFilterOption));
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
  }

  public onClickSwitchDateBackOneDay() {
    const newDatestamp: moment.Moment = this.utilityService.deepCopy(this.state.currentDatestamp);
    newDatestamp.subtract(1, 'days');
    this.updateDataDatestamp(newDatestamp);
  }

  public onClickSwitchDateBackOneWeek() {
    const newDatestamp: moment.Moment = this.utilityService.deepCopy(this.state.currentDatestamp);
    newDatestamp.subtract(1, 'weeks');
    this.updateDataDatestamp(newDatestamp);
  }

  public onClickSwitchDateForwardOneDay() {
    if (this.state.viewingHistoricalData) {
      const newDatestamp: moment.Moment = this.utilityService.deepCopy(this.state.currentDatestamp);
      newDatestamp.add(1, 'days');
      if (newDatestamp.isAfter(moment())) {
        this.onClickBackToToday();
      } else {
        this.updateDataDatestamp(newDatestamp);
      }
    }
  }

  public onClickSwitchDateForwardOneWeek() {
    if (this.state.viewingHistoricalData) {
      const newDatestamp: moment.Moment = this.utilityService.deepCopy(this.state.currentDatestamp);
      newDatestamp.add(1, 'weeks');
      if (newDatestamp.isAfter(moment())) {
        this.onClickBackToToday();
      } else {
        this.updateDataDatestamp(newDatestamp);
      }
    }
  }

  public onClickBackToToday() {
    const now = moment();
    this.updateDataDatestamp(now);
    this.state.lastUpdateTime = now.format('hh:mm:ss a');
  }

  private updateDataDatestamp(
    targetDatestampInMoment: moment.Moment,
    skipNgRX: boolean = false
  ){
    this.state.currentDatestamp = targetDatestampInMoment;
    this.state.currentDatestampDisplayText = this.state.currentDatestamp.format('MMM Do');
    this.state.viewingHistoricalData = !this.state.currentDatestamp.isSame(moment(), 'day');
    if (this.state.viewingHistoricalData) {
      this.state.lastUpdateTime = 'Beginning of Day';
    }
    !skipNgRX && this.store$.dispatch(new StructureSwitchDataDatestampEvent(this.state.currentDatestamp));
  }

}