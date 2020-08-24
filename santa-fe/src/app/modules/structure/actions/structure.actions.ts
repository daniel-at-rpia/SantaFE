import { Action } from '@ngrx/store';
import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';

export enum StructureActions {
  SelectedMetricLevel = '[Structure] Metric Level Selected'
}

export class StructureMetricSelect implements Action {
  readonly type = StructureActions.SelectedMetricLevel;
  readonly selectedMetric: PortfolioMetricValues;
  constructor(selectedMetric: PortfolioMetricValues) {
    this.selectedMetric = selectedMetric
  };
}