import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation, OnChanges } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { PortfolioStructureDTO } from 'Core/models/frontend/frontend-models.interface';
import { PortfolioMetricValues, STRUCTURE_EDIT_MODAL_ID } from 'Core/constants/structureConstants.constants';
import { DTOService } from 'Core/services/DTOService';
import { UtilityService } from 'Core/services/UtilityService';
import { ModalService } from 'Form/services/ModalService';
import { selectUserInitials } from 'Core/selectors/core.selectors';
import { PortfolioBreakdownDTO, TargetBarDTO } from 'FEModels/frontend-models.interface';
import { StructureSendSetTargetTransferEvent} from 'Structure/actions/structure.actions';
import { UpdateTargetBlock, UpdateTargetPack } from 'Core/models/frontend/frontend-adhoc-packages.interface';
import { BEPortfolioTargetMetricValues } from 'Core/constants/structureConstants.constants';
import { StructuringTeamPMList } from 'Core/constants/securityDefinitionConstants.constant';

@Component({
  selector: 'structure-fund',
  templateUrl: './structure-fund.container.html', 
  styleUrls: ['./structure-fund.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureFund implements OnInit {
  @Input() fund: PortfolioStructureDTO;
  @Output() updatedFundData = new EventEmitter<UpdateTargetPack>();
  constants = {
    cs01: PortfolioMetricValues.cs01,
    creditLeverage: PortfolioMetricValues.creditLeverage,
    creditDuration: PortfolioMetricValues.creditDuration,
    BECreditLeverage: BEPortfolioTargetMetricValues.CreditLeverage,
    BECreditDuration: BEPortfolioTargetMetricValues.CreditDuration,
    BECs01: BEPortfolioTargetMetricValues.Cs01,
    editModalId: STRUCTURE_EDIT_MODAL_ID,
    structuringTeamPMList: StructuringTeamPMList
  }
  subscriptions = {
    ownerInitialsSub: null
  }

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private store$: Store<any>,
    private modalService: ModalService
  ){}

  public ngOnInit() {
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      select(selectUserInitials)
    ).subscribe((value) => {
      this.fund.state.isEditAvailable = this.constants.structuringTeamPMList.indexOf(value) >= 0;
    });
    this.fund.api.onSubmitMetricValues = this.saveEditDetails.bind(this);
  }

  public onClickedEditInBreakdown(targetBreakdown: PortfolioBreakdownDTO) {
    this.store$.dispatch(new StructureSendSetTargetTransferEvent({
      targetFund: this.utilityService.deepCopy(this.fund),
      targetBreakdown: this.utilityService.deepCopy(targetBreakdown),
      isCreateNewOverride: false
    }));
  }

  public onClickedAddCustomBreakdown() {
    this.store$.dispatch(new StructureSendSetTargetTransferEvent({
      targetFund: this.utilityService.deepCopy(this.fund),
      targetBreakdown: null,
      isCreateNewOverride: true
    }));
    this.modalService.triggerModalOpen(this.constants.editModalId);
  }

  public onChangeValue(amount: string, type: PortfolioMetricValues) {
    const value = !parseFloat(amount) ? 0 : parseFloat(amount);
    if (type === PortfolioMetricValues.creditDuration) {
      this.fund.state.modifiedFundTargets.creditDuration = value;
    } else {
      this.fund.state.modifiedFundTargets.creditLeverage  = value;
    }
  }

  public showEditMenu() {
    this.fund.state.isEditingFund = true;
  }

  public closeEditMenu() {
    this.fund.state.isEditingFund = false;
    this.resetErrors();
  }

  public onClickSaveNewMetrics(targetCreditDuration: number, targetLeverage: number) {
    this.fund.api.onSubmitMetricValues(targetCreditDuration, targetLeverage)
  }

  private validateInput(value: number | string) {
     const result = value || value === 0 ? false : true;
     return result;
  }

  private resetErrors() {
    this.fund.state.hasErrors.updatedCreditDuration = false;
    this.fund.state.hasErrors.updatedCreditLeverage = false;
    this.fund.state.hasErrors.errorMessage = '';
  }

  private saveEditDetails(targetCreditDuration: number, targetLeverage: number) {
    this.resetErrors();
    const isTargetCreditDurationInvalid = this.validateInput(targetCreditDuration);
    const isTargetLeverageInvalid = this.validateInput(targetLeverage);
    this.fund.data.creditDurationTargetBar.state.isEmpty = targetCreditDuration === 0;
    this.fund.data.creditLeverageTargetBar.state.isEmpty = targetLeverage === 0;
    if (isTargetCreditDurationInvalid || isTargetLeverageInvalid ) {
      const invalidTarget = isTargetCreditDurationInvalid ? this.constants.creditDuration : this.constants.creditLeverage;
      const invalidInputErrorRef = `updated${invalidTarget.split(' ').join('')}`;
      this.fund.state.hasErrors[invalidInputErrorRef] = true;
      this.fund.state.hasErrors.errorMessage = `*Please enter a valid target level for ${invalidTarget}`;
    } else {
      let updatedTargetData = [];
      const checkTargetUpdates = (currentTarget: number, previousTarget: number, BEMetricType: BEPortfolioTargetMetricValues) => {
        if (currentTarget !== previousTarget) {
          const parsedTarget = currentTarget === 0 ? null : currentTarget;
          const targetUpdateBlock: UpdateTargetBlock = {
            metric: BEMetricType,
            target: parsedTarget
          }
          updatedTargetData.push(targetUpdateBlock);
        }
      }
      checkTargetUpdates(targetCreditDuration, this.fund.data.target.target.creditDuration, this.constants.BECreditDuration);
      checkTargetUpdates(targetLeverage, this.fund.data.target.target.creditLeverage, this.constants.BECreditLeverage);
      if (updatedTargetData.length > 0) {
        const updateData: UpdateTargetPack = {
          fund: this.fund,
          updateTargetBlocks: updatedTargetData
        }
        this.fund.state.isEditingFund = false;
        this.updatedFundData.emit(updateData)
      }
    }
  }
}