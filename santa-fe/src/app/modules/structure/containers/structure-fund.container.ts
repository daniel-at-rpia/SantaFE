import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation, OnChanges } from '@angular/core';
import { PortfolioStructureDTO } from 'Core/models/frontend/frontend-models.interface';
import {PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
import { DTOService } from 'Core/services/DTOService';
import { TargetBarDTO } from 'FEModels/frontend-models.interface';
import { UtilityService } from 'Core/services/UtilityService'


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
  targetBarCreditLeverage: TargetBarDTO;
  constants = {
    cs01: PortfolioMetricValues.cs01,
    creditLeverage: PortfolioMetricValues.creditLeverage
  }

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
  ){}

  public ngOnInit() {
    if (!!this.fund) {
      this.targetBarCS01 = this.createTargetBar(this.constants.cs01, this.fund.data.currentTotals.cs01, this.fund.data.target.target.cs01, this.selectedMetricValue, this.fund.state.isStencil);
      this.targetBarCreditLeverage = this.createTargetBar(this.constants.creditLeverage, this.fund.data.currentTotals.creditLeverage, this.fund.data.target.target.creditLeverage, this.selectedMetricValue, this.fund.state.isStencil)
    } 
  }

  public ngOnChanges() {
    if (this.targetBarCreditLeverage && this.targetBarCS01) {
      this.targetBarCS01.data.selectedMetricValue = this.selectedMetricValue;
      this.targetBarCreditLeverage.data.selectedMetricValue = this.selectedMetricValue;
      this.targetBarCS01.utility.setInactiveMetric(this.targetBarCS01);
      this.targetBarCreditLeverage.utility.setInactiveMetric(this.targetBarCreditLeverage);
    }
  }

  private createTargetBar(constantValue: PortfolioMetricValues, currentValue: number, targetValue: number, selectedMetric: PortfolioMetricValues, isStencil: boolean) {
    const newTargetBar = this.dtoService.formTargetBarObject(constantValue, currentValue,targetValue, selectedMetric, isStencil);
    newTargetBar.utility.convertNumtoStr = this.convertValuesForDisplay.bind(this);
    newTargetBar.utility.setInactiveMetric = this.setInactiveMetric.bind(this);
    if (!targetValue) {
      newTargetBar.state.isEmpty = true;
      newTargetBar.utility.convertNumtoStr(newTargetBar);
      newTargetBar.utility.setInactiveMetric(newTargetBar);
      newTargetBar.data.displayedResults = constantValue === this.constants.cs01 ? `${newTargetBar.data.displayedCurrentValue} / -` : `${newTargetBar.data.displayedCurrentValue} / -`;
      return newTargetBar;
    }
    newTargetBar.state.isEmpty = false;
    newTargetBar.utility.getDisplayValues = this.getDisplayedValues.bind(this);
    return newTargetBar;
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

  private getRoundedValues(targetBar: TargetBarDTO) {
    targetBar.data.displayedCurrentValue = targetBar.data.targetMetric === this.constants.cs01 ? `${this.utilityService.round(targetBar.data.currentValue)}K`: `${this.utilityService.round(targetBar.data.currentValue, 2)}`;
    targetBar.data.displayedTargetValue = targetBar.data.targetMetric === this.constants.cs01 ? `${this.utilityService.round(targetBar.data.targetValue)}K`: `${this.utilityService.round(targetBar.data.targetValue, 2)}`;
  }

  private getDisplayedResults(valueA: string, valueB: string) {
    return `${valueA}/${valueB}`;
  }

  private convertValuesForDisplay(targetBar: TargetBarDTO) {
   if (targetBar.data.targetMetric === PortfolioMetricValues.cs01) {
      targetBar.data.displayedCurrentValue = this.utilityService.parseNumberToThousands(targetBar.data.currentValue, true, 0);
      targetBar.data.displayedTargetValue = this.utilityService.parseNumberToThousands(targetBar.data.targetValue,true, 0);
      targetBar.data.displayedResults = this.getDisplayedResults(targetBar.data.displayedCurrentValue, targetBar.data.displayedTargetValue);
      return;
    }
    targetBar.data.displayedCurrentValue = this.utilityService.round(targetBar.data.currentValue,2);
    targetBar.data.displayedTargetValue = this.utilityService.round(targetBar.data.targetValue,2);
    targetBar.data.displayedResults = this.getDisplayedResults(targetBar.data.displayedCurrentValue, targetBar.data.displayedTargetValue);
  }
}