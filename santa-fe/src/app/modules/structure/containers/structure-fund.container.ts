import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PortfolioStructureDTO } from 'Core/models/frontend/frontend-models.interface';
import {PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
import { DTOService } from 'Core/services/DTOService';
import { TargetBarDTO } from 'FEModels/frontend-models.interface';
import { UtilityService } from 'Core/services/UtilityService';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ownerInitials } from 'Core/selectors/core.selectors';

@Component({
  selector: 'structure-fund',
  templateUrl: './structure-fund.container.html', 
  styleUrls: ['./structure-fund.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureFund implements OnInit {
  @Input() fund: PortfolioStructureDTO;
  @Output() updatedFundData = new EventEmitter<PortfolioStructureDTO>();
  constants = {
    cs01: PortfolioMetricValues.cs01,
    creditLeverage: PortfolioMetricValues.creditLeverage
  }
  subscriptions = {
    ownerInitialsSub: null
  }

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private store$: Store<any>,
  ){}

  public ngOnInit() {
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      select(ownerInitials)
    ).subscribe((value) => {
      this.fund.state.isEditing = value === 'DM';
    });
    this.fund.api.onSubmitMetricValues = this.saveEditDetails.bind(this);
  }

  private showEditMenu() {
    this.fund.state.isEditingFundTargets = true;
  }

  private closeEditMenu() {
    this.fund.state.isEditingFundTargets = false;
    this.resetErrors();
  }

  private validateInput(value: number | string) {
     const result = value || value === 0 ? false : true;
     return result;
  }

  private resetErrors() {
    this.fund.state.hasErrors.updatedCS01 = false;
    this.fund.state.hasErrors.updatedCreditLeverage = false;
    this.fund.state.hasErrors.errorMessage = '';
  }

  private saveEditDetails(targetCS01: number, targetLeverage: number) {
    this.resetErrors();
    const isTargetCS01Invalid = this.validateInput(targetCS01);
    const isTargetLeverageInvalid = this.validateInput(targetLeverage);
    this.fund.data.cs01TargetBar.state.isEmpty = targetCS01 === 0;
    this.fund.data.creditLeverageTargetBar.state.isEmpty = targetLeverage === 0;
    if (isTargetCS01Invalid || isTargetLeverageInvalid ) {
      const invalidTarget = isTargetCS01Invalid ? this.constants.cs01 : this.constants.creditLeverage;
      const invalidInputErrorRef = `updated${invalidTarget.split(' ').join('')}`;
      this.fund.state.hasErrors[invalidInputErrorRef] = true;
      this.fund.state.hasErrors.errorMessage = `*Please enter a valid target level for ${invalidTarget}`;
    } else {
      this.fund.state.isEditingFundTargets = false;
      this.updatedFundData.emit(this.fund)
    }
  }

  private onClickSaveNewMetrics(targetCS01: number, targetLeverage: number) {
    this.fund.api.onSubmitMetricValues(targetCS01, targetLeverage)
  }

  private onChangeValue(amount: string, type: PortfolioMetricValues) {
    const value = !parseFloat(amount) ? 0 : parseFloat(amount);
    if (type === PortfolioMetricValues.cs01) {
      this.fund.data.target.target.cs01 = value * 1000;
      this.fund.data.originalBEData.target.target.Cs01 = value * 1000;
      return;
    }
    this.fund.data.target.target.creditLeverage = value;
    this.fund.data.originalBEData.target.target.CreditLeverage = value;
  }
}