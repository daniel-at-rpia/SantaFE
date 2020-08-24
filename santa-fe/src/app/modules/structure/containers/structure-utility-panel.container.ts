import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
import { StructureMetricSelect } from 'Structure/actions/structure.actions';
import { select, Store } from '@ngrx/store';
import { selectMetricLevel } from 'Structure/selectors/structure.selectors';
import { StructureUtilityPanelState } from 'Core/models/frontend/frontend-page-states.interface';
@Component({
  selector: 'structure-utility-panel',
  templateUrl: './structure-utility-panel.container.html',
  styleUrls: ['./structure-utility-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureUtilityPanel implements OnInit {
  state: StructureUtilityPanelState;
  subscriptions = {
    selectedMetricLevelSub: null
  }
  constants = {
    cs01: PortfolioMetricValues.CSO1,
    leverage: PortfolioMetricValues.Leverage
  }
  constructor(private store$: Store<any>) {}
  public ngOnInit() {
    this.initializePageState();
  }

  private initializePageState() {
    this.state = {
      selectedMetricValue: null,
      isExpanded: false
    }
    this.subscriptions.selectedMetricLevelSub = this.store$.pipe(
      select(selectMetricLevel)
    ).subscribe((value) => {
      const metric = value === this.constants.cs01 ? this.constants.cs01 : this.constants.leverage
      this.state.selectedMetricValue = metric;
    });
  }

  private onToggleTongueExpand() {
    this.state.isExpanded = !this.state.isExpanded;
  }

  public setMetricLevel(metricLevel: PortfolioMetricValues) {
    const selectedMetric = metricLevel === this.constants.cs01 ? this.constants.cs01 : this.constants.leverage;
    this.store$.dispatch(new StructureMetricSelect(selectedMetric));
  }
}