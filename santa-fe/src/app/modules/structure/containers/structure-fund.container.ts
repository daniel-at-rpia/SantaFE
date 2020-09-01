import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, OnChanges } from '@angular/core';
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

export class StructureFund implements OnInit, OnChanges {
  @Input() fund: PortfolioStructureDTO;
  @Input() selectedMetricValue: PortfolioMetricValues;
  @Input() ownerInitial: string;
  @Output() updatedFundData = new EventEmitter<PortfolioStructureDTO>();
  constants = {
    cs01: PortfolioMetricValues.cs01,
    creditLeverage: PortfolioMetricValues.creditLeverage
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
  
  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
  ){}

  public ngOnInit() {
    this.fund.api.onSubmitMetricValues = this.saveEditDetails.bind(this);
  }

  public ngOnChanges() {
    this.state.currentOwnerInitials =  this.ownerInitial !== null ? this.ownerInitial : null
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
      const invalidTarget = isTargetCS01Invalid && isTargetLeverageInvalid ? 'both' : isTargetCS01Invalid ? this.constants.cs01 : this.constants.creditLeverage;
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
    if (type === PortfolioMetricValues.cs01) {
      this.fund.data.target.target.cs01 = amount * 1000;
      return;
    }
    this.fund.data.target.target.creditLeverage = amount;
  }

  private getCS01Placeholder() {
   this.fund.data.cs01TotalsInK.targetTotal = this.fund.api.convertToK(this.fund.data.target.target.cs01);
  }
}


