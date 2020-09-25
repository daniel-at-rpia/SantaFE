import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { StructureSetTargetPanelState } from 'FEModels/frontend-page-states.interface';
import { DTOService } from 'Core/services/DTOService';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { UtilityService } from 'Core/services/UtilityService';
import { ModalService } from 'Form/services/ModalService';
import { selectSetTargetTransferPack } from 'Structure/selectors/structure.selectors';
import { StructureSetTargetOverlayTransferPack } from 'FEModels/frontend-adhoc-packages.interface';
import { StructureSetTargetPanelEditRowBlock, StructureSetTargetPanelEditRowItemBlock } from 'FEModels/frontend-blocks.interface';
import {
  PortfolioBreakdownGroupOptions,
  PortfolioMetricValues,
  STRUCTURE_EDIT_MODAL_ID
} from 'Core/constants/structureConstants.constants';
import {
  FilterOptionsCurrency,
  FilterOptionsRating,
  FilterOptionsTenor
} from 'Core/constants/securityDefinitionConstants.constant';
import { PayloadUpdateBreakdown } from 'BEModels/backend-payloads.interface';
import {
  BEStructuringBreakdownBlock,
  BEPortfolioStructuringDTO,
  BEMetricBreakdowns
} from 'BEModels/backend-models.interface';
import { StructureSetTargetPostEditUpdatePack } from 'FEModels/frontend-adhoc-packages.interface';
import { StructureReloadBreakdownDataPostEditEvent } from 'Structure/actions/structure.actions';
import { CoreSendNewAlerts } from 'Core/actions/core.actions';

@Component({
  selector: 'structure-set-target-panel',
  templateUrl: './structure-set-target-panel.container.html',
  styleUrls: ['./structure-set-target-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureSetTargetPanel implements OnInit, OnDestroy {
  state: StructureSetTargetPanelState;
  subscriptions = {
    setTargetTransferPackSub: null
  };
  constants = {
    metric: PortfolioMetricValues,
    editModalId: STRUCTURE_EDIT_MODAL_ID
  }

  constructor(
    private store$: Store<any>,
    private utilityService: UtilityService,
    private dtoService: DTOService,
    private restfulCommService: RestfulCommService,
    private modalService: ModalService
  ){
    this.state = this.initializePageState();
  }

  private initializePageState(): StructureSetTargetPanelState {
    const state: StructureSetTargetPanelState = {
      targetBreakdown: null,
      targetFund: null,
      targetBreakdownRawData: null,
      editRowList: [],
      totalUnallocatedCS01: 0,
      totalUnallocatedCreditLeverage: 0,
      remainingUnallocatedCS01: 0,
      remainingUnallocatedCreditLeverage: 0,
      activeMetric: null,
      displayPercentageUnallocatedCS01: 0,
      displayPercentageUnallocatedCreditLeverage: 0,
      displayRemainingUnallocatedCS01: '',
      displayRemainingUnallocatedCreditLeverage: ''
    };
    return state;
  }

  public ngOnInit() {
    this.state = this.initializePageState();
    this.subscriptions.setTargetTransferPackSub = this.store$.pipe(
      select(selectSetTargetTransferPack)
    ).subscribe((pack: StructureSetTargetOverlayTransferPack) => {
      if (!!pack) {
        this.state.targetFund = this.utilityService.deepCopy(pack.targetFund);
        this.state.targetBreakdown = this.utilityService.deepCopy(pack.targetBreakdown);
        this.state.targetBreakdown.state.isPreviewVariant = true;
        this.state.targetBreakdownRawData = this.retrieveRawBreakdownDataForTargetBreakdown();
        this.state.activeMetric = pack.targetFund.data.cs01TargetBar.state.isInactiveMetric ? this.constants.metric.creditLeverage : this.constants.metric.cs01;
        this.loadEditRows();
        this.calculateAllocation();
      }
    })
    this.modalService.bindModalSaveCallback(STRUCTURE_EDIT_MODAL_ID, this.submitTargetChanges.bind(this));
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(eachItem)) {
        const eachSub = this.subscriptions[eachItem] as Subscription;
        eachSub.unsubscribe();
      }
    }
  }

  public onValueChange(
    newValue: string,
    targetItem: StructureSetTargetPanelEditRowItemBlock
  ) {
    if (newValue !== targetItem.modifiedDisplayValue) {
      targetItem.isFocused = true;
      this.setTarget(
        newValue,
        targetItem
      );
    }
  }

  public onClickSaveEdit(
    targetCategory: StructureSetTargetPanelEditRowBlock,
    targetItem: StructureSetTargetPanelEditRowItemBlock,
    notOneOffEdit?: boolean
  ) {
    targetItem.isFocused = false;
    targetItem.savedDisplayValue = targetItem.modifiedDisplayValue;
    targetItem.savedUnderlineValue = targetItem.modifiedUnderlineValue;
    let counterPartyItem = null;
    if (targetItem.metric === this.constants.metric.cs01) {
      if (!!targetItem.isPercent) {
        counterPartyItem = targetCategory.targetCs01.level;
      } else {
        counterPartyItem = targetCategory.targetCs01.percent;
      }
    } else if (targetItem.metric === this.constants.metric.creditLeverage) {
      if (!!targetItem.isPercent) {
        counterPartyItem = targetCategory.targetCreditLeverage.level;
      } else {
        counterPartyItem = targetCategory.targetCreditLeverage.percent;
      }
    }
    this.implyCounterParty(
      targetItem,
      counterPartyItem
    );
    if (!notOneOffEdit) {
      targetCategory.isLocked = true;
      this.calculateAllocation();
      this.refreshPreview();
    }
  }

  public onClickChangeActiveMetric(newMetric: PortfolioMetricValues) {
    if (this.state.activeMetric !== newMetric) {
      this.state.activeMetric = newMetric;
      this.state.targetFund.data.cs01TargetBar.state.isInactiveMetric = !this.state.targetFund.data.cs01TargetBar.state.isInactiveMetric;
      this.state.targetFund.data.creditLeverageTargetBar.state.isInactiveMetric = !this.state.targetFund.data.creditLeverageTargetBar.state.isInactiveMetric;
      this.refreshPreview();
    }
  }

  public onToggleLock(targetRow: StructureSetTargetPanelEditRowBlock) {
    if (!!targetRow) {
      targetRow.isLocked = !targetRow.isLocked;
    }
  }

  public onPressedEnterKeyInInput(
    targetCategory: StructureSetTargetPanelEditRowBlock,
    targetItem: StructureSetTargetPanelEditRowItemBlock
  ) {
    this.onClickSaveEdit(targetCategory, targetItem);
  }

  public onClickDistributeEvenly() {
    const unlockedList = this.state.editRowList.filter((eachRow) => {
      return !eachRow.isLocked;
    });
    if (unlockedList.length > 0) {
      const totalNumberOfRows = unlockedList.length;
      const isCs01 = this.state.activeMetric === this.constants.metric.cs01;
      this.clearUnlockRowsBeforeDistribution(unlockedList, isCs01);
      const totalValue = isCs01 ? this.state.remainingUnallocatedCS01 : this.state.remainingUnallocatedCreditLeverage;
      unlockedList.forEach((eachUnlockedRow) => {
        const targetItem = isCs01 ? eachUnlockedRow.targetCs01.level : eachUnlockedRow.targetCreditLeverage.level;
        const distributedValue = totalValue/totalNumberOfRows;
        const parsedValue = isCs01 ? this.utilityService.round(distributedValue/1000, 3) : this.utilityService.round(distributedValue, 3);
        this.setTarget(
          `${parsedValue}`,
          targetItem
        );
        this.onClickSaveEdit(
          eachUnlockedRow,
          targetItem,
          true
        );
      });
      this.calculateAllocation();
      this.refreshPreview();
    }
  }

  public onClickDistributeProportionally() {
    const unlockedList = this.state.editRowList.filter((eachRow) => {
      return !eachRow.isLocked;
    });
    if (unlockedList.length > 0) {
      const isCs01 = this.state.activeMetric === this.constants.metric.cs01;
      this.clearUnlockRowsBeforeDistribution(unlockedList, isCs01);
      let totalValue = 0;
      const totalRemainingPercent = isCs01 ? this.state.remainingUnallocatedCS01/this.state.totalUnallocatedCS01 : this.state.remainingUnallocatedCreditLeverage/this.state.totalUnallocatedCreditLeverage;
      unlockedList.forEach((eachUnlockedRow) => {
        totalValue = totalValue + eachUnlockedRow.targetBlockFromBreakdown.raw.currentLevel;
      });
      unlockedList.forEach((eachUnlockedRow) => {
        const distributedValue = eachUnlockedRow.targetBlockFromBreakdown.raw.currentLevel/totalValue * 100 * totalRemainingPercent;
        const parsedValue = this.utilityService.round(distributedValue, 3);
        const targetItem = isCs01 ? eachUnlockedRow.targetCs01.percent : eachUnlockedRow.targetCreditLeverage.percent;
        this.setTarget(
          `${parsedValue}`,
          targetItem
        );
        this.onClickSaveEdit(
          eachUnlockedRow,
          targetItem,
          true
        );
      });
      this.calculateAllocation();
      this.refreshPreview();
    }
  }

  private loadEditRows() {
    if (!!this.state.targetBreakdown) {
      this.state.editRowList = [];
      this.state.targetBreakdown.data.rawCs01CategoryList.forEach((eachCategory) => {
        const newRow: StructureSetTargetPanelEditRowBlock = {
          targetBlockFromBreakdown: eachCategory,
          rowTitle: eachCategory.category,
          targetCs01: {
            level: {
              savedDisplayValue: !!eachCategory.targetLevel ? `${eachCategory.targetLevel}` : null,
              savedUnderlineValue: eachCategory.raw.targetLevel,
              modifiedDisplayValue: null,
              modifiedUnderlineValue: null,
              isActive: false,
              isImplied: false,
              isFocused: false,
              metric: this.constants.metric.cs01,
              isPercent: false
            },
            percent: {
              savedDisplayValue: !!eachCategory.targetPct ? `${eachCategory.targetPct}` : null,
              savedUnderlineValue: eachCategory.raw.targetPct,
              modifiedDisplayValue: null,
              modifiedUnderlineValue: null,
              isActive: false,
              isImplied: false,
              isFocused: false,
              metric: this.constants.metric.cs01,
              isPercent: true
            }
          },
          targetCreditLeverage: {
            level: {
              savedDisplayValue: null,
              savedUnderlineValue: null,
              modifiedDisplayValue: null,
              modifiedUnderlineValue: null,
              isActive: false,
              isImplied: false,
              isFocused: false,
              metric: this.constants.metric.creditLeverage,
              isPercent: false
            },
            percent: {
              savedDisplayValue: null,
              savedUnderlineValue: null,
              modifiedDisplayValue: null,
              modifiedUnderlineValue: null,
              isActive: false,
              isImplied: false,
              isFocused: false,
              metric: this.constants.metric.creditLeverage,
              isPercent: true
            }
          },
          isLocked: false
        };
        this.state.editRowList.push(newRow);
      });
      this.state.targetBreakdown.data.rawLeverageCategoryList.forEach((eachCategory) => {
        const targetRow = this.state.editRowList.find((eachRow) => {
          return eachRow.rowTitle === eachCategory.category;
        });
        if (!!targetRow) {
          targetRow.targetCreditLeverage.level.savedDisplayValue = !!eachCategory.targetLevel ? `${eachCategory.targetLevel}` : null;
          targetRow.targetCreditLeverage.level.savedUnderlineValue = eachCategory.raw.targetLevel;
          targetRow.targetCreditLeverage.percent.savedDisplayValue = !!eachCategory.targetPct ? `${eachCategory.targetPct}` : null;
          targetRow.targetCreditLeverage.percent.savedUnderlineValue = eachCategory.raw.targetPct;
        };
      });
    }
  }

  private calculateAllocation() {
    this.state.totalUnallocatedCS01 = this.state.targetFund.data.target.target.cs01;
    this.state.remainingUnallocatedCS01 = this.state.targetFund.data.target.target.cs01;
    this.state.totalUnallocatedCreditLeverage = this.state.targetFund.data.target.target.creditLeverage;
    this.state.remainingUnallocatedCreditLeverage = this.state.targetFund.data.target.target.creditLeverage;
    this.state.editRowList.forEach((eachRow) => {
      if (eachRow.targetCs01.level.savedUnderlineValue != null) {
        this.state.remainingUnallocatedCS01 = this.state.remainingUnallocatedCS01 - eachRow.targetCs01.level.savedUnderlineValue;
      }
      if (eachRow.targetCreditLeverage.level.savedUnderlineValue != null) {
        this.state.remainingUnallocatedCreditLeverage = this.state.remainingUnallocatedCreditLeverage - eachRow.targetCreditLeverage.level.savedUnderlineValue;
      }
    });
    if (!!this.state.remainingUnallocatedCS01) {
      this.state.displayPercentageUnallocatedCS01 = this.utilityService.round(this.state.remainingUnallocatedCS01/this.state.totalUnallocatedCS01 * 100, 0);
      this.state.displayRemainingUnallocatedCS01 = `${this.utilityService.round(this.state.remainingUnallocatedCS01/1000, 1)} k`;
    } else {
      this.state.displayPercentageUnallocatedCS01 = 0;
      this.state.displayRemainingUnallocatedCS01 = '0 k';
    }
    if (!!this.state.remainingUnallocatedCreditLeverage) {
      this.state.displayPercentageUnallocatedCreditLeverage = this.utilityService.round(this.state.remainingUnallocatedCreditLeverage/this.state.totalUnallocatedCreditLeverage * 100, 0);
      this.state.displayRemainingUnallocatedCreditLeverage = this.utilityService.round(this.state.remainingUnallocatedCreditLeverage, 2);
    } else {
      this.state.displayPercentageUnallocatedCreditLeverage = 0;
      this.state.displayRemainingUnallocatedCreditLeverage = '0';
    }
  }

  private setTarget(
    displayValue: string,
    targetItem: StructureSetTargetPanelEditRowItemBlock
  ) {
    if (displayValue == '') {
      displayValue = '0'
    };
    targetItem.modifiedDisplayValue = displayValue;
    targetItem.isActive = true;
    if (targetItem.metric === this.constants.metric.cs01 && !targetItem.isPercent) {
      targetItem.modifiedUnderlineValue = parseFloat(displayValue)*1000;
    } else if (targetItem.isPercent) {
      targetItem.modifiedUnderlineValue = parseFloat(displayValue)/100;
    } else {
      targetItem.modifiedUnderlineValue = parseFloat(displayValue);
    }
  }

  private implyCounterParty(
    targetItem: StructureSetTargetPanelEditRowItemBlock,
    counterPartyItem: StructureSetTargetPanelEditRowItemBlock
  ) {
    const targetIsPercent: boolean = targetItem.isPercent;
    const targetUnderlineValue: number = targetItem.savedUnderlineValue;
    const metric: PortfolioMetricValues = targetItem.metric;
    counterPartyItem.isActive = false;
    counterPartyItem.isImplied = true;
    counterPartyItem.isFocused = false;
    let impliedValue = null;
    if (metric === this.constants.metric.cs01) {
      if (this.state.totalUnallocatedCS01 > 0) {
        if (!!targetIsPercent) {
          impliedValue = targetUnderlineValue * this.state.totalUnallocatedCS01;
          counterPartyItem.modifiedUnderlineValue = impliedValue;
          counterPartyItem.modifiedDisplayValue = this.utilityService.round(impliedValue/1000, 0);
        } else {
          impliedValue = targetUnderlineValue / this.state.totalUnallocatedCS01;
          counterPartyItem.modifiedUnderlineValue = impliedValue;
          counterPartyItem.modifiedDisplayValue = this.utilityService.round(impliedValue*100, 1);
        }
      } else {
        counterPartyItem.modifiedUnderlineValue = 0;
        counterPartyItem.modifiedDisplayValue = '0';
      }
    } else if (metric === this.constants.metric.creditLeverage) {
      if (this.state.totalUnallocatedCreditLeverage > 0) {
        if (!!targetIsPercent) {
          impliedValue = targetUnderlineValue * this.state.totalUnallocatedCreditLeverage;
          counterPartyItem.modifiedUnderlineValue = impliedValue;
          counterPartyItem.modifiedDisplayValue = this.utilityService.round(impliedValue, 2);
        } else {
          impliedValue = targetUnderlineValue / this.state.totalUnallocatedCreditLeverage;
          counterPartyItem.modifiedUnderlineValue = impliedValue;
          counterPartyItem.modifiedDisplayValue = this.utilityService.round(impliedValue*100, 1);
        }
      } else {
        counterPartyItem.modifiedUnderlineValue = 0;
        counterPartyItem.modifiedDisplayValue = '0';
      }
    }
    counterPartyItem.savedDisplayValue = counterPartyItem.modifiedDisplayValue;
    counterPartyItem.savedUnderlineValue = counterPartyItem.modifiedUnderlineValue;
  }

  private refreshPreview() {
    const breakdownTitle = this.state.targetBreakdown.data.title; 
    const breakdown = this.state.targetFund.data.children.find(breakdown => breakdown.data.title === breakdownTitle);
    const breakdownIndex = this.state.targetFund.data.children.indexOf(breakdown);
    const breakdownDefinition = this.state.targetBreakdown.data.definition;
    const definitionList = this.state.targetBreakdown.data.displayCategoryList.map((eachCategory) => {
      return eachCategory.category;
    });
    const rawData = this.state.targetBreakdownRawData;
    for (let category in rawData.breakdown) {
      if (!!rawData.breakdown[category]) {
        const matchedRowListItem = this.state.editRowList.find(rowList => rowList.rowTitle === category);
        rawData.breakdown[category].metricBreakdowns.Cs01.targetLevel = matchedRowListItem.targetCs01.level.savedUnderlineValue;
        rawData.breakdown[category].metricBreakdowns.Cs01.targetPct = matchedRowListItem.targetCs01.percent.savedUnderlineValue;
        rawData.breakdown[category].metricBreakdowns.CreditLeverage.targetLevel = matchedRowListItem.targetCreditLeverage.level.savedUnderlineValue;
        rawData.breakdown[category].metricBreakdowns.CreditLeverage.targetPct = matchedRowListItem.targetCreditLeverage.percent.savedUnderlineValue;
      }
    }
    this.state.targetBreakdown.state.isStencil = true;
    this.state.targetBreakdown.data.displayCategoryList.forEach(category => {
      category.moveVisualizer.state.isStencil = true;
    })
    setTimeout(() => {
      const updatedPortfolioBreakdown = this.dtoService.formPortfolioBreakdown(false, rawData, definitionList);
      updatedPortfolioBreakdown.data.definition = breakdownDefinition;
      updatedPortfolioBreakdown.data.title = breakdownTitle;
      this.state.targetFund.data.children[breakdownIndex] = updatedPortfolioBreakdown; 
      this.state.targetBreakdown = updatedPortfolioBreakdown;
      this.state.targetBreakdown.state.isPreviewVariant = true;
      this.state.editRowList.forEach(rowList => {
        rowList.targetBlockFromBreakdown = this.state.activeMetric === PortfolioMetricValues.cs01 ? this.state.targetBreakdown.data.rawCs01CategoryList.find(breakdown => breakdown.category === rowList.rowTitle) : this.state.targetBreakdown.data.rawLeverageCategoryList.find(breakdown => breakdown.category === rowList.rowTitle);
      });
      this.state.targetBreakdown.state.isDisplayingCs01 = this.state.activeMetric === PortfolioMetricValues.cs01;
      this.state.targetBreakdown.state.isStencil = false;
      this.state.targetBreakdown.data.displayCategoryList.forEach(category => {
        category.moveVisualizer.state.isStencil = false;
      })
   }, 300);
  }

  private clearUnlockRowsBeforeDistribution(
    unlockedRowList: Array<StructureSetTargetPanelEditRowBlock>,
    isCs01: boolean
  ) {
    unlockedRowList.forEach((eachRow) => {
      const targetItem = isCs01 ? eachRow.targetCs01.percent : eachRow.targetCreditLeverage.percent;
      this.setTarget('0', targetItem);
      this.onClickSaveEdit(eachRow, targetItem, true);
      this.calculateAllocation();
    });
  }

  private submitTargetChanges(): boolean {
    const payload: PayloadUpdateBreakdown = this.traverseEditRowsToFormSubmitPayload();
    if (!!payload) {
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.updatePortfolioBreakdown, {req: 'POST'}, payload).pipe(
        first(),
        tap((serverReturn: BEPortfolioStructuringDTO) => {
          const updatePack: StructureSetTargetPostEditUpdatePack = {
            targetFund: serverReturn,
            targetBreakdownBackendGroupOptionIdentifier: this.state.targetBreakdown.data.backendGroupOptionIdentifier
          };
          this.store$.dispatch(new StructureReloadBreakdownDataPostEditEvent(updatePack));
        }),
        catchError(err => {
          console.error('update breakdown failed');
          return of('error');
        })
      ).subscribe();
      return true;
    } else {
      this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Warning', 'Set Target', 'Can not submit new target because no change is detected', null)]));
      return false;
    }
  }

  private traverseEditRowsToFormSubmitPayload(): PayloadUpdateBreakdown {
    const payload: PayloadUpdateBreakdown = {
      portfolioBreakdown: {
        date: this.state.targetBreakdownRawData.date,
        groupOption: this.state.targetBreakdownRawData.groupOption,
        indexId: this.state.targetBreakdownRawData.indexId,
        portfolioId: this.state.targetBreakdownRawData.portfolioId,
        breakdown: {}
      }
    };
    let hasModification = false;
    this.state.editRowList.forEach((eachRow) => {
      if(this.cs01ModifiedInEditRow(eachRow) || this.creditLeverageModifiedInEditRow(eachRow)) {
        hasModification = true;
        const modifiedMetricBreakdowns: BEMetricBreakdowns = {
          view: null,
          metricBreakdowns: {}
        };
        if (this.cs01ModifiedInEditRow(eachRow)) {
          modifiedMetricBreakdowns.metricBreakdowns.Cs01 = {
            targetLevel: eachRow.targetCs01.level.savedUnderlineValue
          };
        }
        if (this.creditLeverageModifiedInEditRow(eachRow)) {
          modifiedMetricBreakdowns.metricBreakdowns.CreditLeverage = {
            targetLevel: eachRow.targetCreditLeverage.level.savedUnderlineValue
          };
        }
        payload.portfolioBreakdown.breakdown[eachRow.rowTitle] = modifiedMetricBreakdowns;
      }
    });
    return hasModification ? payload : null;
  }

  private cs01ModifiedInEditRow(targetRow: StructureSetTargetPanelEditRowBlock): boolean {
    return targetRow.targetCs01.level.isActive || targetRow.targetCs01.level.isImplied;
  }

  private creditLeverageModifiedInEditRow(targetRow: StructureSetTargetPanelEditRowBlock): boolean {
    return targetRow.targetCreditLeverage.level.isActive || targetRow.targetCreditLeverage.level.isImplied;
  }

  private retrieveRawBreakdownDataForTargetBreakdown(): BEStructuringBreakdownBlock {
    if (!!this.state.targetFund && !!this.state.targetBreakdown) {
      const rawDataObject = this.state.targetFund.data.originalBEData.breakdowns;
      for (let eachBreakdownKey in rawDataObject) {
        const eachBreakdown: BEStructuringBreakdownBlock = rawDataObject[eachBreakdownKey];
        if (eachBreakdown.groupOption === this.state.targetBreakdown.data.backendGroupOptionIdentifier) {
          return this.utilityService.deepCopy(eachBreakdown);
        }
      }
    } else {
      return null;
    }
  }

}