import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PortfolioStructureDTO } from 'Core/models/frontend/frontend-models.interface';
import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';

@Component({
  selector: 'structure-fund',
  templateUrl: './structure-fund.container.html', 
  styleUrls: ['./structure-fund.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureFund implements OnInit, OnChanges {
  @Input() fund: PortfolioStructureDTO; 
  @Input() ownerInitial: string;
  @Output() updatedFundData = new EventEmitter<PortfolioStructureDTO>();
  constants = {
    CS01: PortfolioMetricValues.CSO1,
    Leverage: PortfolioMetricValues.Leverage
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

  constructor() {}

  public ngOnInit() {}
  
  public ngOnChanges() {
    this.state.currentOwnerInitials =  this.ownerInitial !== null ? this.ownerInitial : null
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
      const invalidTarget = isTargetCS01Invalid && isTargetLeverageInvalid ? 'both' : isTargetCS01Invalid ? this.constants.CS01 : this.constants.Leverage;
      if (invalidTarget === 'both') {
        this.state.hasErrors.updatedCS01Value = true;
        this.state.hasErrors.updatedLeverageValue = true;
        this.state.hasErrors.errorMessage = 'Please enter valid inputs for Target CS01 Value and Target Leverage Value'
        return;
      }
      const invalidInputErrorRef = `updated${invalidTarget.split(' ').join('')}`;
      this.state.hasErrors[invalidInputErrorRef] = true;
      this.state.hasErrors.errorMessage = `Please enter a valid input for Target ${invalidTarget}`;
      return;
    }
    this.state.hasErrors.updatedCS01Value = false;
    this.state.hasErrors.updatedLeverageValue = false;
    this.state.isEditing = false;
    this.resetErrors();
    this.fund.data.CS01Values.targetValue = targetCS01 * 1000;
    this.updatedFundData.emit(this.fund)
  }


  private onChangeValue(amount: number, type: PortfolioMetricValues) {
    if (type === PortfolioMetricValues.CSO1) {
      this.fund.data.CS01Values.targetValue = amount;
      return;
    }
    this.fund.data.LeverageValues.targetValue = amount;
  }
}