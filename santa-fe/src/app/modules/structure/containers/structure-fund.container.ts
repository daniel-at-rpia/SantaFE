import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation, OnChanges } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';

import { PortfolioStructureDTO } from 'Core/models/frontend/frontend-models.interface';
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
import { BEPortfolioStructuringDTO, BEMetricBreakdowns } from 'BEModels/backend-models.interface';
import { CoreSendNewAlerts } from 'Core/actions/core.actions';
import { StructureSendSetTargetTransferEvent, StructureReloadFundDataPostEditEvent } from 'Structure/actions/structure.actions';
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
        this.updateFundDetermineAutoScaling(updatedTargetData);
      }
    }
    // reset at last so the logic for save can still access the states
    this.resetEditForm();
  }

  private updateFundDetermineAutoScaling(updatedTargetDataList: Array<UpdateTargetBlock>) {
    if (this.fund.state.autoScalingActive) {
      let cs01ScalingRate = null;
      let creditLeverageScalingRate = null;
      const isCreditDurationUpdated = updatedTargetDataList.find((eachUpdate) => {
        return eachUpdate.metric === this.constants.BECreditDuration;
      });
      const isCreditLeverageUpdated = updatedTargetDataList.find((eachUpdate) => {
        return eachUpdate.metric === this.constants.BECreditLeverage;
      });
      if (isCreditDurationUpdated) {
        const oldCreditDuration = this.fund.data.target.target.creditDuration;
        if (!!oldCreditDuration) {
          cs01ScalingRate = isCreditDurationUpdated.target / oldCreditDuration;
        }
      }
      if (isCreditLeverageUpdated) {
        const oldCreditLeverage = this.fund.data.target.target.creditLeverage;
        if (!!oldCreditLeverage) {
          creditLeverageScalingRate = isCreditLeverageUpdated.target / oldCreditLeverage;
        }
      }
      let numOfUpdateCallsNeeded = 0;
      let numOfUpdateCallsCompleted = 0;
      this.fund.data.children.forEach((eachBreakdown) => {
        if (!eachBreakdown.state.isOverrideVariant) {
          this.autoScaleTargetBreakdown(
            eachBreakdown,
            cs01ScalingRate,
            creditLeverageScalingRate,
            numOfUpdateCallsNeeded,
            numOfUpdateCallsCompleted
          );
        } else {
          this.autoScaleTargetOverride(
            eachBreakdown,
            cs01ScalingRate,
            creditLeverageScalingRate,
            numOfUpdateCallsNeeded,
            numOfUpdateCallsCompleted
          );
        }
      });
      this.updateFundTarget(updatedTargetDataList, numOfUpdateCallsNeeded === 0);
    } else {
      this.updateFundTarget(updatedTargetDataList, true);
    }
  }

  private updateFundTarget(
    updatedTargetDataList: Array<UpdateTargetBlock>,
    reloadAfterUpdateCall: boolean
  ) {
    const targetFund = this.fund;
    const payload: PayloadUpdatePortfolioStructuresTargets = {
      portfolioTarget: {
        portfolioId: targetFund.data.originalBEData.target.portfolioId,
        target: {}
      }
    }
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
      tap((serverReturn: BEPortfolioStructuringDTO) => {
        if (!!serverReturn) {
          // code...
        } else {
          this.restfulCommService.logError('Update Fund ServerReturn is invalid');
        }
        if (reloadAfterUpdateCall) {
          this.store$.dispatch(new StructureReloadFundDataPostEditEvent(serverReturn));
        }
        const systemAlertMessage = `Successfully updated ${serverReturn.portfolioShortName} target levels.`;
        const alert = this.dtoService.formSystemAlertObject('Structuring', 'Updated', `${systemAlertMessage}`, null);
        this.store$.dispatch(new CoreSendNewAlerts([alert]));
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

  private autoScaleTargetBreakdown(
    targetBreakdown: PortfolioBreakdownDTO,
    cs01ScalingRate: number,
    creditLeverageScalingRate: number,
    numOfUpdateCallsNeeded: number,
    numOfUpdateCallsCompleted: number
  ) {
    if (!!cs01ScalingRate || !!creditLeverageScalingRate) {
      // the rate will be null if scaling is not suppose to apply to this metric
      const payload: PayloadUpdateBreakdown = {
        portfolioBreakdown: {
          date: moment().format('YYYY-MM-DD'),
          groupOption: targetBreakdown.data.backendGroupOptionIdentifier,
          portfolioId: this.fund.data.portfolioId,
          indexId: this.fund.data.indexId,
          breakdown: {}
        }
      };
      for (let i = 0; i < targetBreakdown.data.rawCs01CategoryList.length; i++) {
        // using rawCs01CategoryList for the traversal, it doesn't matter which one to use since the assumption is the cs01 list and creditLeverage list will have the same length
        const eachPayloadMetricBreakdown = this.autoScaleBreakdownRow(
          targetBreakdown.data.rawCs01CategoryList[i],
          targetBreakdown.data.rawLeverageCategoryList[i],
          cs01ScalingRate,
          creditLeverageScalingRate,
        );
        if (!!eachPayloadMetricBreakdown) {
          const categoryIdentifier = targetBreakdown.data.rawCs01CategoryList[i].data.category;
          payload.portfolioBreakdown.breakdown[categoryIdentifier] = eachPayloadMetricBreakdown;
        }
      }
      if (!this.utilityService.isObjectEmpty(payload.portfolioBreakdown.breakdown)) {
        numOfUpdateCallsNeeded++;
        this.restfulCommService.callAPI(this.restfulCommService.apiMap.updatePortfolioBreakdown, {req: 'POST'}, payload).pipe(
          first(),
          tap((serverReturn: BEPortfolioStructuringDTO) => {
            numOfUpdateCallsCompleted++;
            this.store$.dispatch(
              new CoreSendNewAlerts([
                this.dtoService.formSystemAlertObject(
                  'Structuring',
                  'Auto-Scaled',
                  `Successfully Auto-Scaled Target for ${targetBreakdown.data.title}`,
                  null
                )]
              )
            );
            if (numOfUpdateCallsCompleted === numOfUpdateCallsNeeded) {
              this.store$.dispatch(new StructureReloadFundDataPostEditEvent(serverReturn));
            }
          }),
          catchError(err => {
            console.error('auto-scale breakdown failed');
            this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Error', 'Auto-Scale', 'auto-scale breakdown failed', null)]));
            return of('error');
          })
        ).subscribe();
      }
    }
  }

  private autoScaleTargetOverride(
    targetBreakdown: PortfolioBreakdownDTO,
    cs01ScalingRate: number,
    creditLeverageScalingRate: number,
    numOfUpdateCallsNeeded: number,
    numOfUpdateCallsCompleted: number
  ) {
    if (!!cs01ScalingRate || !!creditLeverageScalingRate) {
      // the rate will be null if scaling is not suppose to apply to this metric
      for (let i = 0; i < targetBreakdown.data.rawCs01CategoryList.length; i++) {
        // using rawCs01CategoryList for the traversal, it doesn't matter which one to use since the assumption is the cs01 list and creditLeverage list will have the same length
        const eachRow = targetBreakdown.data.rawCs01CategoryList[i];
        const eachPayload:PayloadUpdateOverride = {
          portfolioOverride: {
            date: moment().format('YYYY-MM-DD'),
            portfolioId: this.fund.data.portfolioId,
            indexId: this.fund.data.indexId,
            bucket: eachRow.data.bucket
          }
        };
        const eachPayloadMetricBreakdown = this.autoScaleBreakdownRow(
          targetBreakdown.data.rawCs01CategoryList[i],
          targetBreakdown.data.rawLeverageCategoryList[i],
          cs01ScalingRate,
          creditLeverageScalingRate
        );
        if (!!eachPayloadMetricBreakdown) {
          numOfUpdateCallsNeeded++;
          eachPayload.portfolioOverride.breakdown = eachPayloadMetricBreakdown;
          this.restfulCommService.callAPI(this.restfulCommService.apiMap.updatePortfolioOverride, {req: 'POST'}, eachPayload).pipe(
            first(),
            tap((serverReturn: BEPortfolioStructuringDTO) => {
              numOfUpdateCallsCompleted++;
              this.store$.dispatch(
                new CoreSendNewAlerts([
                  this.dtoService.formSystemAlertObject(
                    'Structuring',
                    'Auto-Scaled',
                    `Successfully Auto-Scaled Target for ${targetBreakdown.data.title} - ${eachRow.data.displayCategory}`,
                    null
                  )]
                )
              );
              if (numOfUpdateCallsNeeded === numOfUpdateCallsCompleted) {
                this.store$.dispatch(new StructureReloadFundDataPostEditEvent(serverReturn));
              }
            }),
            catchError(err => {
            console.error('auto-scale breakdown failed');
            this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Error', 'Auto-Scale', 'auto-scale override failed', null)]));
              return of('error');
            })
          ).subscribe();
        }
      }
    }
  }

  // return true if the row can be scaled (currently has target on the corresponding metric)
  private autoScaleBreakdownRow(
    targetCS01Row: StructurePortfolioBreakdownRowDTO,
    targetCreditLeverageRow: StructurePortfolioBreakdownRowDTO,
    cs01ScalingRate: number,
    creditLeverageScalingRate: number
  ): BEMetricBreakdowns {
    let addToPayload = false;
    const currentTargetCs01 = targetCS01Row.data.raw.targetLevel;
    const currentTargetCreditLeverage = targetCreditLeverageRow.data.raw.targetLevel;
    const eachTargetPayload: BEMetricBreakdowns = {
      metricBreakdowns: {}
    };
    if (!!cs01ScalingRate && !!currentTargetCs01) {
      // only apply scaling to cs01 if this category has a cs01 target
      eachTargetPayload.metricBreakdowns.Cs01 = {
        targetLevel: currentTargetCs01 * cs01ScalingRate
      };
      addToPayload = true;
    }
    if (!!creditLeverageScalingRate && !!currentTargetCreditLeverage) {
      // only apply scaling to credit leverage if this category has a credit leverage target
      eachTargetPayload.metricBreakdowns.CreditLeverage = {
        targetLevel: currentTargetCreditLeverage * creditLeverageScalingRate
      };
      addToPayload = true;
    }
    return addToPayload ? eachTargetPayload : null;
  }
}