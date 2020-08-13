import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';

import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';

@Component({
  selector: 'target-bar',
  templateUrl: './target-bar.component.html',
  styleUrls: ['./target-bar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TargetBar implements OnInit {
  @Input() targetMetric: string; 
  @Input() currentValue: number;
  @Input() targetValue: number;
  @Input() selectedMetricValue: PortfolioMetricValues;
  currentPercentage: string;
  exceededPercentage: string;
  displayedCurrentValue: string;
  displayedTotalValue: string;
  state = {
   isInactiveMetric: false,
  }
  constructor() {}
  ngOnInit() {
    this.getDisplayedValues();
    this.convertValuesForDisplay();
    this.setInactiveMetric();
  }

private getDisplayedValues() {
  if (this.currentValue > this.targetValue) {
    const difference = this.currentValue - this.targetValue; 
    this.currentPercentage = '100%';
    this.exceededPercentage = this.currentValue / this.targetValue >= 2 ? '100%' : `${(difference / this.targetValue) * 100}%`
    return;
  }
    this.currentPercentage = `${(this.currentValue / this.targetValue) * 100}%`;
  }

  private setInactiveMetric() {
    this.state.isInactiveMetric = this.targetMetric !== this.selectedMetricValue ? true : false;
  }

  private convertValuesForDisplay() {
   if (this.targetMetric === PortfolioMetricValues.CSO1) {
    this.displayedCurrentValue= `${this.currentValue}K`;
    this.displayedTotalValue= `${this.targetValue}K`;
    return;
  }
   this.displayedCurrentValue = `${this.currentValue}`;
   this.displayedTotalValue = `${this.targetValue}`;
  }
}