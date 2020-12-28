import { Component, ViewEncapsulation, OnInit, OnDestroy, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

import {
  PortfolioMetricValues,
  BreakdownViewFilter,
  SUPPORTED_PORTFOLIO_LIST
} from 'Core/constants/structureConstants.constants';
import {
  selectMetricLevel,
  selectMainPanelUpdateTick,
  selectActiveBreakdownViewFilter
} from 'Structure/selectors/structure.selectors';
import { StructureUtilityPanelState } from 'Core/models/frontend/frontend-page-states.interface';
import {
  StructureUpdateMainPanelEvent,
  StructureMetricSelect,
  StructureChangeBreakdownViewFilterEvent
} from 'Structure/actions/structure.actions';

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
    activeBreakdownViewFilterSub: null
  }
  constants = {
    cs01: PortfolioMetricValues.cs01,
    leverage: PortfolioMetricValues.creditLeverage,
    creditDuration: PortfolioMetricValues.creditDuration,
    breakdownViewFilter: BreakdownViewFilter,
    portfolios: SUPPORTED_PORTFOLIO_LIST
  }

  constructor(private store$: Store<any>) {}

  private initializePageState(): StructureUtilityPanelState {
    return {
      selectedMetricValue: null,
      lastUpdateTime: 'n/a',
      activeBreakdownViewFilter: null
    };
  }

  public ngOnInit() {
    this.state = this.initializePageState();
    this.subscriptions.selectedMetricLevelSub = this.store$.pipe(
      select(selectMetricLevel),
      first()  // Right now Utility Panel is the sole place to initiate a page-wide metric change, so there is no need to have Utility Panel react passively to the ngrx store, instead, it just need to subscribe to the initial value, and update its own state internally in setMetricLevel()
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
      select(selectActiveBreakdownViewFilter)
    ).subscribe((activeFilter) => {
      this.state.activeBreakdownViewFilter = activeFilter;
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
    this.store$.dispatch(new StructureUpdateMainPanelEvent());
  }

  public onClickBreakdownFilterChange(targetFilterOption: BreakdownViewFilter) {
    if (this.state.activeBreakdownViewFilter !== targetFilterOption) {
      this.store$.dispatch(new StructureChangeBreakdownViewFilterEvent(targetFilterOption));
    }
  }
}