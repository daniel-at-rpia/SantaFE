import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PortfolioStructureDTO } from 'Core/models/frontend/frontend-models.interface';
import {PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
import { DTOService } from 'Core/services/DTOService';
import { TargetBarDTO } from 'FEModels/frontend-models.interface';


@Component({
  selector: 'structure-fund',
  templateUrl: './structure-fund.container.html', 
  styleUrls: ['./structure-fund.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureFund implements OnInit {
  @Input() fund: PortfolioStructureDTO;
  @Input() selectedMetricValue: PortfolioMetricValues;
  targetBarCS01: TargetBarDTO;
  targetBarLeverage: TargetBarDTO; 
  constants = {
    CS01: PortfolioMetricValues.CSO1,
    leverage: PortfolioMetricValues.Leverage
  }

  constructor(private dtoService: DTOService) {}

  public ngOnInit() {
    this.targetBarCS01 = this.createTargetBar(this.constants.CS01, this.fund.data.currentTotals.CS01, this.fund.data.targetTotals.CS01, this.selectedMetricValue, this.fund.state.isStencil);
    this.targetBarLeverage = this.createTargetBar(this.constants.leverage, this.fund.data.currentTotals.leverage, this.fund.data.targetTotals.leverage, this.selectedMetricValue, this.fund.state.isStencil)

  }

  private createTargetBar(constantValue: PortfolioMetricValues, currentValue: number, targetValue: number, selectedMetric: PortfolioMetricValues, isStencil: boolean) {
    const newTargetBar = this.dtoService.formTargetBarObject(constantValue, currentValue,targetValue, selectedMetric, isStencil);
    newTargetBar.utility.getDisplayValues = this.getDisplayedValues;
    newTargetBar.utility.setInactiveMetric = this.setInactiveMetric;
    newTargetBar.utility.convertNumtoStr = this.convertValuesForDisplay;
    return newTargetBar
  }

  private getDisplayedValues(targetBar: TargetBarDTO) {
    if (targetBar.data.currentValue > targetBar.data.targetValue) {
      const difference = targetBar.data.currentValue - targetBar.data.targetValue;
      targetBar.data.currentPercentage = '100%';
      targetBar.data.exceededPercentage = targetBar.data.currentValue / targetBar.data.targetValue >= 2 ? '100%' : `${(difference / targetBar.data.targetValue) * 100}%`
      return;
    }
    targetBar.data.currentPercentage = `${(targetBar.data.currentValue / targetBar.data.targetValue) * 100}%`;
  }

  private setInactiveMetric(targetBar: TargetBarDTO) {
    targetBar.state.isInactiveMetric = targetBar.data.targetMetric !== targetBar.data.selectedMetricValue ? true : false;
  }

  private convertValuesForDisplay(targetBar: TargetBarDTO) {
    if (targetBar.data.targetMetric === PortfolioMetricValues.CSO1) {
      const formattedCurrentValue = `${targetBar.data.currentValue / 1000}K`;
      const formattedTargetValue = `${targetBar.data.targetValue / 1000}K`;
      targetBar.data.displayedCurrentValue = formattedCurrentValue;
      targetBar.data.displayedTargetValue = formattedTargetValue;
      return;
    }
    targetBar.data.displayedCurrentValue = `${targetBar.data.currentValue}`;
    targetBar.data.displayedTargetValue = `${targetBar.data.targetValue}`;
  }
}