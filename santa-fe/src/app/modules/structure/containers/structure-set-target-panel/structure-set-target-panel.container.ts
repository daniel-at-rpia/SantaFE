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
import {
  StructureSetTargetOverlayTransferPack,
  DefinitionConfiguratorEmitterParams
} from 'FEModels/frontend-adhoc-packages.interface';
import { StructurePortfolioBreakdownRowDTO } from 'Core/models/frontend/frontend-models.interface';
import {
  StructureSetTargetPanelEditRowBlock,
  StructureSetTargetPanelEditRowItemBlock
} from 'FEModels/frontend-blocks.interface';
import {
  PortfolioMetricValues,
  STRUCTURE_EDIT_MODAL_ID,
  PortfolioView
} from 'Core/constants/structureConstants.constants';
import {
  FilterOptionsCurrency,
  FilterOptionsRating,
  FilterOptionsTenor,
  SecurityDefinitionMap
} from 'Core/constants/securityDefinitionConstants.constant';
import {
  PayloadUpdateBreakdown,
  PayloadUpdateOverride,
  PayloadDeleteOverride
} from 'BEModels/backend-payloads.interface';
import {
  BEStructuringBreakdownBlock,
  BEPortfolioStructuringDTO,
  BEMetricBreakdowns,
  BEStructuringOverrideBlock
} from 'BEModels/backend-models.interface';
import {
  PayloadGetPortfolioOverride,
  PayloadClearPortfolioBreakdown
} from 'BEModels/backend-payloads.interface';
import { StructureSetTargetPostEditUpdatePack } from 'FEModels/frontend-adhoc-packages.interface';
import { StructureReloadBreakdownDataPostEditEvent, StructureUpdateMainPanelEvent } from 'Structure/actions/structure.actions';
import { CoreSendNewAlerts } from 'Core/actions/core.actions';
import { CustomeBreakdownConfiguratorDefinitionLayout } from 'Core/constants/structureConstants.constants';
import { BICsDataProcessingService } from 'Core/services/BICsDataProcessingService';
import * as moment from 'moment';

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
    editModalId: STRUCTURE_EDIT_MODAL_ID,
    configuratorLayout: CustomeBreakdownConfiguratorDefinitionLayout,
    definitionMap: SecurityDefinitionMap
  };

  constructor(
    private store$: Store<any>,
    private utilityService: UtilityService,
    private dtoService: DTOService,
    private restfulCommService: RestfulCommService,
    private modalService: ModalService,
    private bicsService: BICsDataProcessingService
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
      displayCs01BtnText: null,
      displayCreditLeverageBtnText: null,
      displayPercentageUnallocatedCS01: 0,
      displayPercentageUnallocatedCreditLeverage: 0,
      displayRemainingUnallocatedCS01: '',
      displayRemainingUnallocatedCreditLeverage: '',
      targetBreakdownIsOverride: false,
      configurator: {
        dto: this.dtoService.createSecurityDefinitionConfigurator(true, false, false, this.constants.configuratorLayout),
        display: false
      },
      removalList: [],
      clearAllTargetSelected: false
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
        this.state.configurator.display = false;
        if (!!this.state.targetBreakdown) {
          this.state.targetBreakdown.state.isPreviewVariant = true;
          this.state.targetBreakdown.state.isEditingView = false;
          if (!!this.state.targetBreakdown.data.popover) {
            this.state.targetBreakdown.data.popover.state.isActive = false;
          }
          const selectedCategory = this.state.targetBreakdown.data.displayCategoryList.find(category => category.state.isSelected);
          if (!!selectedCategory) {
            selectedCategory.state.isSelected = false;
          }
          if (this.state.targetBreakdown.data.displayCategoryList.length > 0) {
            this.state.targetBreakdown.data.displayCategoryList.forEach(row => {
              row.state.isEditingView = false;
            })
          }
        }
        this.state.targetBreakdownIsOverride = !!pack.isCreateNewOverride || pack.targetBreakdown.state.isOverrideVariant;
        this.state.targetBreakdownRawData = this.retrieveRawBreakdownDataForTargetBreakdown();
        this.state.activeMetric = pack.targetFund.data.cs01TargetBar.state.isInactiveMetric ? this.constants.metric.creditLeverage : this.constants.metric.cs01;
        this.loadEditRows();
        this.calculateAllocation();
        this.state.configurator.dto = this.dtoService.createSecurityDefinitionConfigurator(true, false, false, this.constants.configuratorLayout);
        this.loadBICSOptionsIntoConfigurator();
        if (!!this.state.clearAllTargetSelected) {
          this.state.clearAllTargetSelected = false;
        }
      }
    });
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
    targetItem.savedUnderlineValue = targetItem.modifiedUnderlineValue === 0 ? null : targetItem.modifiedUnderlineValue;
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
    if (targetItem.metric === this.constants.metric.cs01) {
      this.state.targetBreakdownRawData.breakdown[targetCategory.rowIdentifier].metricBreakdowns.Cs01.targetLevel = targetCategory.targetCs01.level.savedUnderlineValue;
      this.state.targetBreakdownRawData.breakdown[targetCategory.rowIdentifier].metricBreakdowns.Cs01.targetPct = targetCategory.targetCs01.percent.savedUnderlineValue;
    } else {
      this.state.targetBreakdownRawData.breakdown[targetCategory.rowIdentifier].metricBreakdowns.CreditLeverage.targetLevel = targetCategory.targetCreditLeverage.level.savedUnderlineValue;
      this.state.targetBreakdownRawData.breakdown[targetCategory.rowIdentifier].metricBreakdowns.CreditLeverage.targetPct = targetCategory.targetCreditLeverage.percent.savedUnderlineValue;
    }
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
      this.state.targetBreakdown.state.isDisplayingCs01 = this.state.activeMetric === this.constants.metric.cs01;
      this.setBtnText();
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

  public onClickNewOverrideRow() {
    this.state.configurator.display = !this.state.configurator.display;
  }

  public onApplyConfiguratorFilter(params: DefinitionConfiguratorEmitterParams) {
    if (params.filterList.length === 0) {
      const alert = this.dtoService.formSystemAlertObject('Apply Blocked', 'Empty Bucket', `Define the bucket with value before apply`, null);
      this.store$.dispatch(new CoreSendNewAlerts([alert]));
    } else {
      const convertedParams = this.convertConsolidatedBICSDefinitionConfiguratorParamToRegularParam(params);
      const bucket = {}
      let bucketToString = '';
      params.filterList.forEach((eachItem) => {
        const property = this.utilityService.convertFEKey(eachItem.key);
        if (!!property) {
          bucket[property] = eachItem.filterBy;
          eachItem.filterBy.forEach((eachValue) => {
            bucketToString = bucketToString === '' ? `${eachValue}` : `${bucketToString} - ${eachValue}`;
          });
        }
      });
      if (this.overrideCheckRowAlreadyExist(bucketToString)) {
        const alert = this.dtoService.formSystemAlertObject('Apply Blocked', 'Already Exist', `${bucketToString} bucket already exist`, null);
        this.store$.dispatch(new CoreSendNewAlerts([alert]));
      } else {
        const now = moment();
        const payload: PayloadGetPortfolioOverride = {
          portfolioOverride: {
            date: now.format('YYYY-MM-DDT00:00:00-04:00'),
            portfolioId: this.state.targetFund.data.portfolioId,
            bucket: bucket
          }
        };
        this.restfulCommService.callAPI(this.restfulCommService.apiMap.getPortfolioOverride, {req: 'POST'}, payload).pipe(
          first(),
          tap((serverReturn: BEStructuringOverrideBlock) => {
            const rawBreakdownList = this.utilityService.convertRawOverrideToRawBreakdown([serverReturn]).list;
            const newBreakdownBucketIdentifier = this.utilityService.formBucketIdentifierForOverride(serverReturn);
            const newCategoryKey = this.utilityService.formCategoryKeyForOverride(serverReturn);
            if (!!this.state.targetBreakdown && this.state.targetBreakdown.data.backendGroupOptionIdentifier === newBreakdownBucketIdentifier) {
              const newDataBlock = rawBreakdownList[0].breakdown[newCategoryKey];
              this.state.targetBreakdownRawData.breakdown[newCategoryKey] = newDataBlock;
            } else {
              if (!!this.state.targetBreakdown) {
                const alert = this.dtoService.formSystemAlertObject('Warning', 'Overwritten', `can not merge "${this.state.targetBreakdown.data.backendGroupOptionIdentifier}" with ${newBreakdownBucketIdentifier}, new breakdown has overwrote the previous one`, null);
                this.store$.dispatch(new CoreSendNewAlerts([alert]));
              }
              this.state.targetBreakdownRawData = rawBreakdownList[0];
            }
            const isDisplayCs01 = this.state.activeMetric === PortfolioMetricValues.cs01;
            const newBreakdown = this.dtoService.formPortfolioOverrideBreakdown(this.state.targetBreakdownRawData, isDisplayCs01);
            newBreakdown.state.isPreviewVariant = true;
            this.state.targetBreakdown = newBreakdown;
            this.earMarkNewRow(newCategoryKey);
            const prevEditRowsForInheritance = this.utilityService.deepCopy(this.state.editRowList);
            this.loadEditRows();
            this.inheritEditRowStates(prevEditRowsForInheritance);
          }),
          catchError(err => {
            console.error(`${this.restfulCommService.apiMap.readAlert} failed`, err);
            return of('error')
          })
        ).subscribe();
      }
    }
    this.state.configurator.display = false;
    this.state.configurator.dto = this.dtoService.createSecurityDefinitionConfigurator(true, false, false, this.constants.configuratorLayout);
    this.loadBICSOptionsIntoConfigurator();
  }

  public onSelectForRemoval(targetRow: StructureSetTargetPanelEditRowBlock) {
    if (targetRow) {
      const newList = this.utilityService.deepCopy(this.state.editRowList.filter((eachRow) => {
        return eachRow.rowIdentifier !== targetRow.rowIdentifier;
      }));
      this.state.targetBreakdownRawData.breakdown = this.utilityService.removePropertyFromObject(this.state.targetBreakdownRawData.breakdown, targetRow.rowIdentifier);
      !!targetRow.existInServer && this.state.removalList.push(targetRow);
      const isDisplayCs01 = this.state.activeMetric === PortfolioMetricValues.cs01;
      const newBreakdown = this.dtoService.formPortfolioOverrideBreakdown(this.state.targetBreakdownRawData, isDisplayCs01);
      newBreakdown.state.isPreviewVariant = true;
      this.state.targetBreakdown = newBreakdown;
      this.loadEditRows();
      this.inheritEditRowStates(newList);
      //Have preview retain custom titles
      if (this.state.editRowList.length > 0) {
        this.state.editRowList.forEach(row => {
          const cs01Equivalent = newBreakdown.data.rawCs01CategoryList.find(cs01Row => cs01Row.data.category === row.rowIdentifier);
          const creditLeverageEquivalent = newBreakdown.data.rawLeverageCategoryList.find(creditLeverageRow => creditLeverageRow.data.category === row.rowIdentifier);
          if (!!cs01Equivalent) {
            cs01Equivalent.data.displayCategory = row.displayRowTitle;
          }
          if (!!creditLeverageEquivalent) {
            creditLeverageEquivalent.data.displayCategory = row.displayRowTitle
          }
        })
      }
      this.refreshPreview();
    }
  }

  public onEditRowRenamed(
    targetName: string,
    targetRow: StructureSetTargetPanelEditRowBlock
  ) {
    targetRow.modifiedDisplayRowTitle = targetName;
  }

  private setBtnText () {
    const metricList = [this.constants.metric.cs01, this.constants.metric.creditLeverage];
    const metricPercentageData = metricList.map(metric => {
        const isCs01 = metric === this.constants.metric.cs01;
        const object = {
          btnText: !!isCs01 ? 'displayCs01BtnText' : 'displayCreditLeverageBtnText',
          formattedMetric: !!isCs01 ? 'cs01' : 'creditLeverage',
          percentage: !!isCs01 ? this.state.displayPercentageUnallocatedCS01 : this.state.displayPercentageUnallocatedCreditLeverage,
          metric: metric
        }
        return object;
      }
    );
    if (!!this.state.targetFund.data.target.target.cs01 || !!this.state.targetFund.data.target.target.creditLeverage) {
      metricPercentageData.forEach(data => {
        this.state[data.btnText] = !!this.state.targetFund.data.target.target[data.formattedMetric] ? `${data.percentage}% unallocated` : 'N/A';
      })
    } else {
      metricPercentageData.forEach(data => {
        this.state[data.btnText] = this.state.activeMetric === data.metric ? 'Selected' : 'Unselected';
      });
    }
  }

  public clearAllRowTargets() {
    this.state.editRowList.forEach(row => {
      this.resetRowTargets(row, this.constants.metric.cs01);
      this.resetRowTargets(row, this.constants.metric.creditLeverage);
    })
    this.state.clearAllTargetSelected = true;
    this.calculateAllocation();
    this.setBtnText();
    this.refreshPreview();
  }

  private resetRowTargets(row: StructureSetTargetPanelEditRowBlock, targetMetric: PortfolioMetricValues) {
    const rowTargetMetric = targetMetric === this.constants.metric.cs01 ? 'targetCs01' : 'targetCreditLeverage';
    row[rowTargetMetric].level.modifiedDisplayValue = '';
    row[rowTargetMetric].level.modifiedUnderlineValue = 0;
    row[rowTargetMetric].level.isActive = true;
    this.onClickSaveEdit(row, row[rowTargetMetric].level, true);
  }

  private loadEditRows() {
    this.state.editRowList = [];
    if (!!this.state.targetBreakdown) {
      this.state.targetBreakdown.data.rawCs01CategoryList.forEach((eachCategory) => {
        const newRow: StructureSetTargetPanelEditRowBlock = {
          targetBlockFromBreakdown: eachCategory.data,
          rowIdentifier: eachCategory.data.category,
          displayRowTitle: eachCategory.data.displayCategory,
          modifiedDisplayRowTitle: eachCategory.data.displayCategory,
          targetCs01: {
            level: {
              savedDisplayValue: !!eachCategory.data.targetLevel ? `${eachCategory.data.targetLevel}` : null,
              savedUnderlineValue: !!eachCategory.data.raw.targetLevel ? eachCategory.data.raw.targetLevel : null,
              modifiedDisplayValue: null,
              modifiedUnderlineValue: null,
              isActive: false,
              isImplied: false,
              isFocused: false,
              metric: this.constants.metric.cs01,
              isPercent: false
            },
            percent: {
              savedDisplayValue: !!eachCategory.data.targetPct ? `${eachCategory.data.targetPct}` : null,
              savedUnderlineValue: !!eachCategory.data.raw.targetPct ? eachCategory.data.raw.targetPct : null,
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
          isLocked: false,
          existInServer: true
        };
        this.state.editRowList.push(newRow);
      });
      this.state.targetBreakdown.data.rawLeverageCategoryList.forEach((eachCategory) => {
        const targetRow = this.state.editRowList.find((eachRow) => {
          return eachRow.rowIdentifier === eachCategory.data.category;
        });
        if (!!targetRow) {
          targetRow.targetCreditLeverage.level.savedDisplayValue = !!eachCategory.data.targetLevel ? `${eachCategory.data.targetLevel}` : null;
          targetRow.targetCreditLeverage.level.savedUnderlineValue = !!eachCategory.data.raw.targetLevel ? eachCategory.data.raw.targetLevel : null;
          targetRow.targetCreditLeverage.percent.savedDisplayValue = !!eachCategory.data.targetPct ? `${eachCategory.data.targetPct}` : null;
          targetRow.targetCreditLeverage.percent.savedUnderlineValue = !!eachCategory.data.raw.targetPct ? eachCategory.data.raw.targetPct : null;
        };
      });
    }
  }

  private inheritEditRowStates(oldRows: Array<StructureSetTargetPanelEditRowBlock>) {
    this.state.editRowList = this.state.editRowList.map((eachNewRow) => {
      const matchedOldRow = oldRows.find((eachOldRow) => {
        return eachOldRow.rowIdentifier === eachNewRow.rowIdentifier;
      });
      if (matchedOldRow) {
        eachNewRow = matchedOldRow;
      };
      return eachNewRow;
    });
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
    this.setBtnText();
  }

  private setTarget(
    displayValue: string,
    targetItem: StructureSetTargetPanelEditRowItemBlock
  ) {
    if (displayValue == '') {
      displayValue = '0';
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
        if (!!targetUnderlineValue) {
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
          impliedValue = null;
          counterPartyItem.modifiedUnderlineValue = 0;
          counterPartyItem.modifiedDisplayValue = '';
        }
      } else {
        counterPartyItem.modifiedUnderlineValue = 0;
        counterPartyItem.modifiedDisplayValue = '';
      }
    } else if (metric === this.constants.metric.creditLeverage) {
      if (this.state.totalUnallocatedCreditLeverage > 0) {
        if (!!targetUnderlineValue) {
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
          impliedValue = null;
          counterPartyItem.modifiedUnderlineValue = 0;
          counterPartyItem.modifiedDisplayValue = '';
        }
      } else {
        counterPartyItem.modifiedUnderlineValue = 0;
        counterPartyItem.modifiedDisplayValue = '';
      }
    }
    counterPartyItem.savedDisplayValue = counterPartyItem.modifiedDisplayValue;
    counterPartyItem.savedUnderlineValue = counterPartyItem.modifiedUnderlineValue === 0 ? null : counterPartyItem.modifiedUnderlineValue;
  }

  private updateTargetBreakdownLists(list: Array<StructurePortfolioBreakdownRowDTO>, minValue: number, maxValue: number, isCs01: boolean) {
    list.forEach(row => {
      const editRowListEquivalent = this.state.editRowList.find(editRowList => editRowList.rowIdentifier === row.data.category);
      if (!!editRowListEquivalent) {
        const { breakdown, portfolioId, groupOption } = this.state.targetBreakdownRawData;
        const rowBreakdownData = breakdown[row.data.category];
        const rowBreakdownMetricData = !!isCs01 ? rowBreakdownData.metricBreakdowns.Cs01 : rowBreakdownData.metricBreakdowns.CreditLeverage;
        const { diveInLevel } = this.state.targetBreakdown.data;
        const { isOverrideVariant } = this.state.targetBreakdown.state;
        const newCategoryBlock = this.dtoService.formPortfolioBreakdownCategoryBlock(minValue, maxValue, false, editRowListEquivalent.rowIdentifier, rowBreakdownMetricData, isCs01, portfolioId, groupOption, isOverrideVariant, diveInLevel, rowBreakdownData.view as PortfolioView, row.data.bucket);
        row.data = newCategoryBlock.data;
        row.state = newCategoryBlock.state;
        row.data.displayCategory = editRowListEquivalent.displayRowTitle;
      }
    })
  }

  private refreshPreview() {
    this.state.targetBreakdown.state.isStencil = true;
    this.state.targetBreakdown.data.displayCategoryList.forEach(category => {
      category.data.moveVisualizer.state.isStencil = true;
    })
    const [cs01Min, cs01Max, creditLeverageMin, creditLeverageMax] = this.utilityService.getCompareValuesForStructuringVisualizer(this.state.targetBreakdownRawData);
    const isCs01 = this.state.activeMetric === this.constants.metric.cs01;
    setTimeout(() => {
      if (!!isCs01) {
        this.updateTargetBreakdownLists(this.state.targetBreakdown.data.rawCs01CategoryList, cs01Min, cs01Max, isCs01);
      } else {
        this.updateTargetBreakdownLists(this.state.targetBreakdown.data.rawLeverageCategoryList, creditLeverageMin, creditLeverageMax, isCs01);
      }
      this.utilityService.calculateAlignmentRating(this.state.targetBreakdown);
      this.state.targetBreakdown.data.displayCategoryList = this.state.activeMetric === this.constants.metric.cs01 ? this.state.targetBreakdown.data.rawCs01CategoryList : this.state.targetBreakdown.data.rawLeverageCategoryList;
      this.state.targetBreakdown.state.isStencil = false;
      this.state.targetBreakdown.data.displayCategoryList.forEach(category => {
        category.state.isStencil = false;
        category.data.moveVisualizer.state.isStencil = false;
      })
    }, 300)
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
    if (!this.state.targetBreakdownIsOverride) {
      return this.submitRegularBreakdownChanges();
    } else {
      return this.submitOverrideChanges();
    }
  }

  private submitUpdatedRegularTargetBreakdownChanges():boolean {
    const payload: PayloadUpdateBreakdown = this.traverseEditRowsToFormUpdateBreakdownPayload();
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
          this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Error', 'Set Target', 'update breakdown failed', null)]));
          return of('error');
        })
      ).subscribe();
      return true;
    } else {
      this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Warning', 'Set Target', 'Can not submit new target because no change is detected', null)]));
      return false;
    }
  }

  private submitRegularBreakdownChanges(): boolean {
    //checks if resetting all targets
    if (!!this.state.clearAllTargetSelected) {
      const allTargetsReset = this.state.editRowList.every(row => !row.targetCreditLeverage.level.savedUnderlineValue && !row.targetCreditLeverage.percent.savedUnderlineValue && !row.targetCs01.level.savedUnderlineValue && !row.targetCs01.percent.savedUnderlineValue);
      if (!!allTargetsReset) {
        const payload: PayloadClearPortfolioBreakdown = {
          portfolioBreakdown: {
            portfolioId: this.state.targetFund.data.portfolioId,
            groupOption: this.state.targetBreakdownRawData.groupOption
          }
        }
        if (!!payload) {
          this.restfulCommService.callAPI(this.restfulCommService.apiMap.clearPortfolioBreakdown, {req: 'POST'}, payload).pipe(
            first(),
            tap((serverReturn: BEPortfolioStructuringDTO) => {
              const updatePack: StructureSetTargetPostEditUpdatePack = {
                targetFund: serverReturn,
                targetBreakdownBackendGroupOptionIdentifier: this.state.targetBreakdown.data.backendGroupOptionIdentifier
              };
              this.store$.dispatch(new StructureReloadBreakdownDataPostEditEvent(updatePack));
            }),
            catchError(err => {
              console.error('clear portfolio breakdown failed');
              this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Error', 'Set Target', 'clear portfolio breakdown failed', null)]));
              return of('error');
            })
          ).subscribe();
          return true;
        }
      } else {
        return this.submitUpdatedRegularTargetBreakdownChanges();
      }
    } else {
      return this.submitUpdatedRegularTargetBreakdownChanges();
    }
  }

  private submitOverrideChanges(): boolean {
    const updatePayload: Array<PayloadUpdateOverride> = this.traverseEditRowsToFormUpdateOverridePayload();
    const deletePayload: Array<PayloadDeleteOverride> = this.traverseRemovalListToFormDeleteOverridePayload();
    const necessaryNumOfCalls = updatePayload.length + deletePayload.length;
    if (necessaryNumOfCalls > 0) {
      let callCount = 0;
      updatePayload.forEach((eachPayload) => {
        this.restfulCommService.callAPI(this.restfulCommService.apiMap.updatePortfolioOverride, {req: 'POST'}, eachPayload).pipe(
          first(),
          tap((serverReturn: BEPortfolioStructuringDTO) => {
            callCount++;
            if (callCount === necessaryNumOfCalls) {
              const updatePack: StructureSetTargetPostEditUpdatePack = {
                targetFund: serverReturn,
                targetBreakdownBackendGroupOptionIdentifier: this.state.targetBreakdown.data.backendGroupOptionIdentifier
              };
              this.store$.dispatch(new StructureReloadBreakdownDataPostEditEvent(updatePack));
            }
          }),
          catchError(err => {
            console.error('update breakdown failed');
            this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Error', 'Set Target', 'update breakdown failed', null)]));
            return of('error');
          })
        ).subscribe();
      });
      deletePayload.forEach((eachPayload) => {
        this.restfulCommService.callAPI(this.restfulCommService.apiMap.deletePortfolioOverride, {req: 'POST'}, eachPayload).pipe(
          first(),
          tap((serverReturn: BEPortfolioStructuringDTO) => {
            callCount++;
            if (callCount === necessaryNumOfCalls) {
              this.store$.dispatch(new StructureUpdateMainPanelEvent());
            }
          }),
          catchError(err => {
            console.error('delete breakdown failed');
            this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Error', 'Set Target', 'delete breakdown failed', null)]));
            return of('error');
          })
        ).subscribe();
      });
      return true;
    } else {
      this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Warning', 'Set Target', 'Can not submit new target because no change is detected', null)]));
      return false;
    }
  }

  private traverseEditRowsToFormUpdateBreakdownPayload(): PayloadUpdateBreakdown {
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
          const parsedValue = eachRow.targetCs01.level.savedUnderlineValue === 0 ? null : eachRow.targetCs01.level.savedUnderlineValue;
          modifiedMetricBreakdowns.metricBreakdowns.Cs01 = {
            targetLevel: parsedValue
          };
          if (!parsedValue) {
            modifiedMetricBreakdowns.metricBreakdowns.CreditDuration = {
              targetLevel: parsedValue
            };
          }
        }
        if (this.creditLeverageModifiedInEditRow(eachRow)) {
          const parsedValue = eachRow.targetCreditLeverage.level.savedUnderlineValue === 0 ? null : eachRow.targetCreditLeverage.level.savedUnderlineValue;
          modifiedMetricBreakdowns.metricBreakdowns.CreditLeverage = {
            targetLevel: parsedValue
          };
        }
        payload.portfolioBreakdown.breakdown[eachRow.rowIdentifier] = modifiedMetricBreakdowns;
      }
    });
    return hasModification ? payload : null;
  }

  private traverseEditRowsToFormUpdateOverridePayload(): Array<PayloadUpdateOverride> {
    const payload: Array<PayloadUpdateOverride> = [];
    this.state.editRowList.forEach((eachRow) => {
      const eachPayload: PayloadUpdateOverride = {
        portfolioOverride: {
          date: this.state.targetBreakdownRawData.date,
          indexId: this.state.targetBreakdownRawData.indexId,
          portfolioId: this.state.targetBreakdownRawData.portfolioId,
          bucket: this.utilityService.populateBEBucketObjectFromRowIdentifier(
            this.utilityService.formBEBucketObjectFromBucketIdentifier(this.state.targetBreakdown.data.title),
            eachRow.rowIdentifier
          )
        }
      };
      if (eachRow.modifiedDisplayRowTitle !== eachRow.rowIdentifier) {
        eachPayload.portfolioOverride.title = eachRow.modifiedDisplayRowTitle;
      }
      if(this.cs01ModifiedInEditRow(eachRow) || this.creditLeverageModifiedInEditRow(eachRow)) {
        const modifiedMetricBreakdowns: BEMetricBreakdowns = {
          view: null,
          metricBreakdowns: {}
        };
        if (this.cs01ModifiedInEditRow(eachRow)) {
          const parsedValue = eachRow.targetCs01.level.savedUnderlineValue === 0 ? null : eachRow.targetCs01.level.savedUnderlineValue;
          modifiedMetricBreakdowns.metricBreakdowns.Cs01 = {
            targetLevel: parsedValue
          };
          if (!parsedValue) {
            modifiedMetricBreakdowns.metricBreakdowns.CreditDuration = {
              targetLevel: parsedValue
            };
          }
        }
        if (this.creditLeverageModifiedInEditRow(eachRow)) {
          const parsedValue = eachRow.targetCreditLeverage.level.savedUnderlineValue === 0 ? null : eachRow.targetCreditLeverage.level.savedUnderlineValue;
          modifiedMetricBreakdowns.metricBreakdowns.CreditLeverage = {
            targetLevel: parsedValue
          };
        }
        eachPayload.portfolioOverride.breakdown = modifiedMetricBreakdowns;
        console.log(eachPayload, 'each payload')
      }
      payload.push(eachPayload);
    });
    return payload;
  }

  private traverseRemovalListToFormDeleteOverridePayload(): Array<PayloadDeleteOverride> {
    const payload: Array<PayloadDeleteOverride> = [];
    this.state.removalList.forEach((eachRow) => {
      const eachPayload: PayloadDeleteOverride = {
        portfolioOverride: {
          date: this.state.targetBreakdownRawData.date,
          indexId: this.state.targetBreakdownRawData.indexId,
          portfolioId: this.state.targetBreakdownRawData.portfolioId,
          bucket: this.utilityService.populateBEBucketObjectFromRowIdentifier(
            this.utilityService.formBEBucketObjectFromBucketIdentifier(this.state.targetBreakdown.data.title),
            eachRow.rowIdentifier
          )
        }
      };
      payload.push(eachPayload);
    });
    return payload;
  }

  private cs01ModifiedInEditRow(targetRow: StructureSetTargetPanelEditRowBlock): boolean {
    return targetRow.targetCs01.level.isActive || targetRow.targetCs01.level.isImplied;
  }

  private creditLeverageModifiedInEditRow(targetRow: StructureSetTargetPanelEditRowBlock): boolean {
    return targetRow.targetCreditLeverage.level.isActive || targetRow.targetCreditLeverage.level.isImplied;
  }

  private retrieveRawBreakdownDataForTargetBreakdown(): BEStructuringBreakdownBlock {
    if (!!this.state.targetFund && !!this.state.targetBreakdown) {
      let rawDataObject;
      if (this.state.targetBreakdown.state.isOverrideVariant) {
        rawDataObject = this.utilityService.convertRawOverrideToRawBreakdown(this.state.targetFund.data.originalBEData.overrides).list;
      } else {
        rawDataObject = this.state.targetFund.data.originalBEData.breakdowns;
      }
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

  private overrideCheckRowAlreadyExist(bucketToString: string): boolean {
    if (this.state.editRowList.length > 0) {
      let exist = false;
      this.state.editRowList.forEach((eachRow) => {
        if (eachRow.rowIdentifier === bucketToString) {
          exist = true;
        }
      });
      return exist;
    } else {
      return false;
    }
  }

  private loadBICSOptionsIntoConfigurator() {
    this.dtoService.loadBICSOptionsIntoConfigurator(
      this.state.configurator.dto,
      this.bicsService.returnAllBICSBasedOnHierarchyDepth(1),
      this.bicsService.returnAllBICSBasedOnHierarchyDepth(2),
      this.bicsService.returnAllBICSBasedOnHierarchyDepth(3),
      this.bicsService.returnAllBICSBasedOnHierarchyDepth(4)
    )
  }

  private earMarkNewRow(targetTitle: string) {
    const targetRow = this.state.editRowList.find((eachRow) => {
      return eachRow.rowIdentifier === targetTitle;
    });
    if (!!targetRow) {
      targetRow.existInServer = false;
    }
  }

  private convertConsolidatedBICSDefinitionConfiguratorParamToRegularParam(params: DefinitionConfiguratorEmitterParams): DefinitionConfiguratorEmitterParams {
    const targetIndex = params.filterList.findIndex((eachItem) => {
      return eachItem.key === this.constants.definitionMap.BICS_CONSOLIDATED.key;
    });
    if (targetIndex >= 0) {
      const consolidatedBICS = params.filterList[targetIndex];
      const result = this.bicsService.consolidateBICS(consolidatedBICS.filterByBlocks);
      const convertedCategoryStringList: Array<string> = result.consolidatedStrings;
      switch (result.deepestLevel) {
        case 1:
          consolidatedBICS.key = this.constants.definitionMap.BICS_LEVEL_1.key;
          break;
        case 2:
          consolidatedBICS.key = this.constants.definitionMap.BICS_LEVEL_2.key;
          break;
        case 3:
          consolidatedBICS.key = this.constants.definitionMap.BICS_LEVEL_3.key;
          break;
        case 4:
          consolidatedBICS.key = this.constants.definitionMap.BICS_LEVEL_4.key;
          break;
        default:
          params.filterList.splice(targetIndex, 1);
          break;
      };
      consolidatedBICS.filterBy = convertedCategoryStringList;
      consolidatedBICS.filterByBlocks = [];  // the blocks are no longer needed once consolidated, so can just set as null
    }
    return params;
  }

}
