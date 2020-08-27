import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

import { PortfolioBreakdownDTO } from 'FEModels/frontend-models.interface';
import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
@Component({
  selector: 'portfolio-breakdown',
  templateUrl: './portfolio-breakdown.container.html',
  styleUrls: ['./portfolio-breakdown.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class PortfolioBreakdown {
  @Input() breakdownData: PortfolioBreakdownDTO;
  @Input() selectedMetricValue: PortfolioMetricValues;
  constants = {
    cs01: PortfolioMetricValues.cs01,
    creditLeverage: PortfolioMetricValues.creditLeverage
  }
  constructor() { }

}
