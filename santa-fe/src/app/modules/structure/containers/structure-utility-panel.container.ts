import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
import { StructureMetricSelect } from 'Structure/actions/structure.actions';
import { selectMetricLevel, selectMainPanelUpdateTick } from 'Structure/selectors/structure.selectors';
import { StructureUtilityPanelState } from 'Core/models/frontend/frontend-page-states.interface';
import { StructureUpdateMainPanelEvent } from 'Structure/actions/structure.actions';
import * as moment from 'moment';

@Component({
  selector: 'structure-utility-panel',
  templateUrl: './structure-utility-panel.container.html',
  styleUrls: ['./structure-utility-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureUtilityPanel implements OnInit {
  state: StructureUtilityPanelState;
  subscriptions = {
    selectedMetricLevelSub: null,
    lastUpdateSub: null
  }
  constants = {
    cs01: PortfolioMetricValues.cs01,
    leverage: PortfolioMetricValues.creditLeverage,
    creditDuration: PortfolioMetricValues.creditDuration
  }

  constructor(private store$: Store<any>) {}

  private initializePageState() {
    this.state = {
      selectedMetricValue: null,
      lastUpdateTime: 'n/a'
    }
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
  }

  public ngOnInit() {
    this.initializePageState();
  }

  public setMetricLevel(metricLevel: PortfolioMetricValues) {
    this.state.selectedMetricValue = metricLevel
    const dispatchMetricChange = () => {
      this.store$.dispatch(new StructureMetricSelect(metricLevel));
    };
    setTimeout(dispatchMetricChange.bind(this), 300);
  }

  public onClickUpdateNow() {
    this.store$.dispatch(new StructureUpdateMainPanelEvent());
  }
}