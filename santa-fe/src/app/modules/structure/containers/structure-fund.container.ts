import { Component, EventEmitter, Input, OnDestroy, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
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

export class StructureFund implements OnInit, OnChanges {
  @Input() fund: PortfolioStructureDTO;
  @Input() selectedMetricValue: PortfolioMetricValues;
  @Input() ownerInitial: string;
  @Output() updatedFundData = new EventEmitter<PortfolioStructureDTO>();
  targetBarCS01: TargetBarDTO;
  targetBarLeverage: TargetBarDTO;
  constants = {
    cs01: PortfolioMetricValues.CSO1,
    leverage: PortfolioMetricValues.Leverage
  }
  state = {
    currentOwnerInitials: null,
    isEditing: false,
    hasErrors: {
      updatedCS01Value: false,
      updatedLeverageValue: false,
      errorMessage: ''
    }
  }
  constructor(private dtoService: DTOService) {}

  public ngOnInit() {
    this.fund.api.onSubmitMetricValues = this.saveEditDetails.bind(this);
    this.targetBarCS01 = this.createTargetBar(this.constants.cs01, this.fund.data.currentTotals.cs01, this.fund.data.target.target.cs01, this.selectedMetricValue, this.fund.state.isStencil);
    this.targetBarLeverage = this.createTargetBar(this.constants.leverage, this.fund.data.currentTotals.leverageValue, this.fund.data.target.target.leverageValue, this.selectedMetricValue, this.fund.state.isStencil);
    this.getCS01Placeholder();
  }

  public ngOnChanges() {
    this.state.currentOwnerInitials =  this.ownerInitial !== null ? this.ownerInitial : null
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

  private showEditMenu() {
    this.state.isEditing = true;
  }

  private closeEditMenu() {
    this.state.isEditing = false;
    this.resetErrors();
  }

  private validateInput(value: number) {
    const isInputInvalid = value <= 0 || value === null ? true : false;
    return isInputInvalid;
  }

  private resetErrors() {
    this.state.hasErrors.updatedCS01Value = false;
    this.state.hasErrors.updatedLeverageValue = false;
    this.state.hasErrors.errorMessage = '';
  }

  private saveEditDetails(targetCS01: number, targetLeverage: number) {
    this.resetErrors();
    const isTargetCS01Invalid = this.validateInput(targetCS01);
    const isTargetLeverageInvalid = this.validateInput(targetLeverage);
    if (isTargetCS01Invalid || isTargetLeverageInvalid) {
      const invalidTarget = isTargetCS01Invalid && isTargetLeverageInvalid ? 'both' : isTargetCS01Invalid ? this.constants.cs01 : this.constants.leverage;
      if (invalidTarget === 'both') {
        this.state.hasErrors.updatedCS01Value = true;
        this.state.hasErrors.updatedLeverageValue = true;
        this.state.hasErrors.errorMessage = 'Please enter valid target levels for CS01 and Leverage';
        return;
      }
      const invalidInputErrorRef = `updated${invalidTarget.split(' ').join('')}`;
      this.state.hasErrors[invalidInputErrorRef] = true;
      this.state.hasErrors.errorMessage = `Please enter a valid target level for ${invalidTarget}`;
      return;
    }
    this.state.hasErrors.updatedCS01Value = false;
    this.state.hasErrors.updatedLeverageValue = false;
    this.state.isEditing = false;
    this.resetErrors();
    this.fund.data.target.target.cs01 = targetCS01 * 1000;
    this.updatedFundData.emit(this.fund)
  }

  private onClickSaveNewMetrics(targetCS01: number, targetLeverage: number) {
    this.fund.api.onSubmitMetricValues(targetCS01, targetLeverage)
  }

  private onChangeValue(amount: number, type: PortfolioMetricValues) {
    if (type === PortfolioMetricValues.CSO1) {
      this.fund.data.target.target.cs01 = amount * 1000;
      return;
    }
    this.fund.data.target.target.leverageValue = amount;
  }

  private getCS01Placeholder() {
    console.log(this.fund.api.convertToK, 'convert to k')
   this.fund.data.cs01TotalsInK.targetTotal = this.fund.api.convertToK(this.fund.data.target.target.cs01);
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

