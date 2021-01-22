import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation, OnChanges } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';

import { PortfolioFundDTO } from 'Core/models/frontend/frontend-models.interface';
import { PortfolioMetricValues, STRUCTURE_EDIT_MODAL_ID } from 'Core/constants/structureConstants.constants';
import { DTOService } from 'Core/services/DTOService';
import { UtilityService } from 'Core/services/UtilityService';
import { ModalService } from 'Form/services/ModalService';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { selectUserInitials } from 'Core/selectors/core.selectors';
import {
  PortfolioBreakdownDTO,
  TargetBarDTO,
  StructurePortfolioBreakdownRowDTO
} from 'FEModels/frontend-models.interface';
import { UpdateTargetBlock } from 'FEModels/frontend-adhoc-packages.interface';
import {
  PayloadUpdatePortfolioStructuresTargets,
  PayloadUpdateBreakdown,
  PayloadUpdateOverride
} from 'BEModels/backend-payloads.interface';
import { BEStructuringFundBlockWithSubPortfolios, BEStructuringBreakdownMetricBlock } from 'BEModels/backend-models.interface';
import { CoreSendNewAlerts } from 'Core/actions/core.actions';
import { StructureSendSetTargetTransferEvent, StructureReloadFundDataPostEditEvent } from 'Structure/actions/structure.actions';
import { BEPortfolioTargetMetricValues } from 'Core/constants/structureConstants.constants';
import { StructuringTeamPMList } from 'Core/constants/securityDefinitionConstants.constant';
import { CoreGlobalWorkflowSendNewState } from 'Core/actions/core.actions';
import { NavigationModule } from 'Core/constants/coreConstants.constant';

@Component({
  selector: 'structure-fund',
  templateUrl: './structure-fund.container.html', 
  styleUrls: ['./structure-fund.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureFund implements OnInit, OnDestroy {
  @Input() fund: PortfolioFundDTO;
  constants = {
    cs01: PortfolioMetricValues.cs01,
    creditLeverage: PortfolioMetricValues.creditLeverage,
    creditDuration: PortfolioMetricValues.creditDuration,
    BECreditLeverage: BEPortfolioTargetMetricValues.CreditLeverage,
    BECreditDuration: BEPortfolioTargetMetricValues.CreditDuration,
    BECs01: BEPortfolioTargetMetricValues.Cs01,
    editModalId: STRUCTURE_EDIT_MODAL_ID,
    structuringTeamPMList: StructuringTeamPMList,
    navigationModule: NavigationModule
  }
  subscriptions = {
    ownerInitialsSub: null
  }

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private store$: Store<any>,
    private modalService: ModalService,
    private restfulCommService: RestfulCommService
  ){}

  public ngOnInit() {
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      select(selectUserInitials)
    ).subscribe((value) => {
      this.fund.state.isEditAvailable = this.constants.structuringTeamPMList.indexOf(value) >= 0;
    });
    this.fund.api.onSubmitMetricValues = this.saveEditDetails.bind(this);
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(eachItem)) {
        const eachSub = this.subscriptions[eachItem] as Subscription;
        eachSub.unsubscribe();
      }
    }
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
    this.resetEditForm();
  }

  public onClickSaveNewMetrics(targetCreditDuration: number, targetLeverage: number) {
    this.fund.api.onSubmitMetricValues(targetCreditDuration, targetLeverage)
  }

  public onToggleEditTargetAutoScaling() {
    if (this.fund.state.autoScalingAvailable) {
      this.fund.state.autoScalingActive = !this.fund.state.autoScalingActive;
    }
  }

  private validateInput(value: number | string) {
     const result = value || value === 0 ? false : true;
     return result;
  }

  private resetEditForm() {
    this.fund.state.hasErrors.updatedCreditDuration = false;
    this.fund.state.hasErrors.updatedCreditLeverage = false;
    this.fund.state.hasErrors.errorMessage = '';
    this.fund.state.autoScalingActive = false;
  }

  private saveEditDetails(targetCreditDuration: number, targetLeverage: number) {
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
          if (BEMetricType === this.constants.BECreditDuration && !parsedTarget) {
            // have to set Cs01 as well if credit duration is null
            const cs01Target: UpdateTargetBlock = {
              metric: this.constants.BECs01,
              target: parsedTarget
            }
            updatedTargetData = [...updatedTargetData, targetUpdateBlock, cs01Target];
          } else {
            updatedTargetData.push(targetUpdateBlock);
          }
        }
      }
      checkTargetUpdates(targetCreditDuration, this.fund.data.target.target.creditDuration, this.constants.BECreditDuration);
      checkTargetUpdates(targetLeverage, this.fund.data.target.target.creditLeverage, this.constants.BECreditLeverage);
      if (updatedTargetData.length > 0) {
        this.fund.state.isEditingFund = false;
        this.updateFundTarget(updatedTargetData);
      }
    }
    // reset at last so the logic for save can still access the states
    this.resetEditForm();
  }

  private updateFundTarget(
    updatedTargetDataList: Array<UpdateTargetBlock>
  ) {
    const targetFund = this.fund;
    const payload: PayloadUpdatePortfolioStructuresTargets = {
      portfolioTarget: {
        portfolioId: targetFund.data.originalBEData.target.portfolioId,
        target: {}
      },
      shouldAutoScale: !!this.fund.state.autoScalingActive && !!this.fund.state.autoScalingAvailable
    };
    updatedTargetDataList.forEach((targetBlock: UpdateTargetBlock ) => {
      const { metric, target } = targetBlock
      payload.portfolioTarget.target[metric] = target;
    });
    targetFund.state.isStencil = true;
    targetFund.data.cs01TargetBar.state.isStencil = true;
    targetFund.data.creditLeverageTargetBar.state.isStencil = true;
    targetFund.data.creditDurationTargetBar.state.isStencil = true;
    targetFund.data.children.forEach(breakdown => {
      breakdown.state.isStencil = true;
      breakdown.data.displayCategoryList.forEach(category => {
        category.data.moveVisualizer.state.isStencil = true;
        category.state.isStencil = true;
      })
    })
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.updatePortfolioTargets, {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn: BEStructuringFundBlockWithSubPortfolios) => {
        if (!!serverReturn) {
          this.store$.dispatch(new StructureReloadFundDataPostEditEvent(serverReturn));
          const systemAlertMessage = `Successfully updated ${serverReturn.portfolioShortName} target levels.`;
          const alert = this.dtoService.formSystemAlertObject('Structuring', 'Updated', `${systemAlertMessage}`, null);
          this.store$.dispatch(new CoreSendNewAlerts([alert]));
        } else {
          this.restfulCommService.logError('Update Fund ServerReturn is invalid');
        }
      }),
      catchError(err => {
        const alert = this.dtoService.formSystemAlertObject('Structuring', 'ERROR', `Unable to update ${targetFund.data.portfolioShortName} target levels`, null);
        alert.state.isError = true;
        this.store$.dispatch(new CoreSendNewAlerts([alert]));
        targetFund.state.isStencil = false;
        targetFund.data.cs01TargetBar.state.isStencil = false;
        targetFund.data.creditLeverageTargetBar.state.isStencil = false;
        targetFund.data.creditDurationTargetBar.state.isStencil = false;
        targetFund.data.children.forEach(breakdown => {
          breakdown.state.isStencil = false;
          breakdown.data.displayCategoryList.forEach(category => {
            category.data.moveVisualizer.state.isStencil = false;
            category.state.isStencil = false;
          })
        })
        this.restfulCommService.logError('Cannot retrieve fund with updated targets');
        return of('error');
      })
    ).subscribe()
  }
}