import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, OnChanges } from '@angular/core';
import { PortfolioStructureDTO } from 'Core/models/frontend/frontend-models.interface';
import {PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
import { DTOService } from 'Core/services/DTOService';
import { TargetBarDTO } from 'FEModels/frontend-models.interface';
import { UtilityService } from 'Core/services/UtilityService';
import { StructureFundState } from 'Core/models/frontend/frontend-page-states.interface';


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
  state: StructureFundState
  constants = {
    cs01: PortfolioMetricValues.cs01,
    creditLeverage: PortfolioMetricValues.creditLeverage
  }

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
  ){
    this.initializeStructureFundState();
  }

  public ngOnInit() {
    this.fund.api.onSubmitMetricValues = this.saveEditDetails.bind(this);
  }

  public ngOnChanges() {
    this.fund.state.isEditing = this.ownerInitial === 'DM';
  }

  private initializeStructureFundState() {
   this.state = {
      isEditingFundTargets: false,
      hasErrors: {
        updatedCS01: false,
        updatedCreditLeverage: false,
        errorMessage: ''
      }
    }
  }

  private showEditMenu() {
    this.state.isEditingFundTargets = true;
  }

  private closeEditMenu() {
    this.state.isEditingFundTargets = false;
    this.resetErrors();
  }

  private validateInput(value: number | string) {
     return parseFloat(value as string);
  }

  private resetErrors() {
    this.state.hasErrors.updatedCS01 = false;
    this.state.hasErrors.updatedCreditLeverage = false;
    this.state.hasErrors.errorMessage = '';
  }

  private saveEditDetails(targetCS01: number, targetLeverage: number) {
    this.resetErrors();
    const isTargetCS01Invalid = this.validateInput(targetCS01);
    const isTargetLeverageInvalid = this.validateInput(targetLeverage);
    if (!isTargetCS01Invalid || !isTargetLeverageInvalid) {
      const invalidTarget = isTargetCS01Invalid ? this.constants.cs01 : this.constants.creditLeverage;
      const invalidInputErrorRef = `updated${invalidTarget.split(' ').join('')}`;
      this.state.hasErrors[invalidInputErrorRef] = true;
      this.state.hasErrors.errorMessage = `*Please enter a valid target level for ${invalidTarget}`;
    } else {
      this.state.isEditingFundTargets = false;
      this.updatedFundData.emit(this.fund)
    }
  }

  private onClickSaveNewMetrics(targetCS01: number, targetLeverage: number) {
    this.fund.api.onSubmitMetricValues(targetCS01, targetLeverage)
  }

  private onChangeValue(amount: number, type: PortfolioMetricValues) {
    if (type === PortfolioMetricValues.cs01) {
      this.fund.data.target.target.cs01 = amount * 1000;
      this.fund.data.originalBEData.target.target.Cs01 = amount * 1000;
      return;
    }
    this.fund.data.target.target.creditLeverage = amount;
    this.fund.data.originalBEData.target.target.CreditLeverage = amount;
  }
}