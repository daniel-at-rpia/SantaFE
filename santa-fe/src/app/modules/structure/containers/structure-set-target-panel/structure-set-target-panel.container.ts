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
  DefinitionConfiguratorEmitterParams,
  AdhocExtensionBEMetricBreakdowns
} from 'FEModels/frontend-adhoc-packages.interface';
import { PortfolioBreakdownDTO, StructurePortfolioBreakdownRowDTO } from 'Core/models/frontend/frontend-models.interface';
import {
  BICsHierarchyBlock,
  StructureSetTargetPanelEditRowBlock,
  StructureSetTargetPanelEditRowItemBlock
} from 'FEModels/frontend-blocks.interface';
import {
  PortfolioMetricValues,
  STRUCTURE_EDIT_MODAL_ID,
  PortfolioView,
  BICS_CODE_DELIMITER_AMOUNT
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
  BEStructuringOverrideBlock,
  BEStructuringBreakdownSingleEntry
} from 'BEModels/backend-models.interface';
import {
  PayloadGetPortfolioOverride,
  PayloadClearPortfolioBreakdown
} from 'BEModels/backend-payloads.interface';
import { StructureReloadFundDataPostEditEvent, StructureUpdateMainPanelEvent } from 'Structure/actions/structure.actions';
import { CoreSendNewAlerts } from 'Core/actions/core.actions';
import {
  CustomeBreakdownConfiguratorDefinitionLayout,
  BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER
} from 'Core/constants/structureConstants.constants';
import { BICsDataProcessingService } from 'Core/services/BICsDataProcessingService';
import { BICSDictionaryLookupService} from 'Core/services/BICSDictionaryLookupService';
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
    private bicsService: BICsDataProcessingService,
    private bicsDictionaryLookupService: BICSDictionaryLookupService
  ){
    this.state = this.initializePageState();
  }

  private initializePageState(): StructureSetTargetPanelState {
    const state: StructureSetTargetPanelState = {
      targetBreakdown: null,
      targetFund: null,
      targetBreakdownRawData: null,
      targetBreakdownRawDataDisplayLabelMap: {},
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
        display: false,
        newOverrideNameCache: null
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
        this.state = this.initializePageState();
        this.state.targetFund = this.utilityService.deepCopy(pack.targetFund);
        this.state.targetBreakdown = this.utilityService.deepCopy(pack.targetBreakdown);
        const { rawLeverageCategoryList, rawCs01CategoryList } = this.state.targetBreakdown.data;
        this.state.configurator.display = false;
        if (!!this.state.targetBreakdown) {
          this.state.targetBreakdown.data.displayCategoryList = this.state.targetBreakdown.state.isDisplayingCs01 ? this.state.targetBreakdown.data.rawCs01CategoryList : this.state.targetBreakdown.data.rawLeverageCategoryList;
          this.state.targetBreakdown.state.isPreviewVariant = true;
          if (!!this.state.targetBreakdown.data.popoverMainRow) {
            this.state.targetBreakdown.data.popoverMainRow = null;
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
        if (this.state.targetBreakdown.state.isBICs) {
          this.setModifiedRowListsForBICSVariant(rawCs01CategoryList, rawLeverageCategoryList, this.state.targetBreakdown);
        } else {
          rawCs01CategoryList.forEach(rawCs01 => rawCs01.state.isWithinSetTargetPreview = true);
          rawLeverageCategoryList.forEach(rawLeverage => rawLeverage.state.isWithinSetTargetPreview = true);
        }
        this.loadEditRows();
        this.calculateAllocation();
        this.state.configurator.dto = this.dtoService.createSecurityDefinitionConfigurator(true, false, false, this.constants.configuratorLayout);
        this.loadBICSOptionsIntoConfigurator();
        if (!!this.state.clearAllTargetSelected) {
          this.state.clearAllTargetSelected = false;
        }
        const modalTitle = !!this.state.targetBreakdownIsOverride ? `${this.state.targetFund.data.portfolioShortName} - Edit Override Targets` : `${this.state.targetFund.data.portfolioShortName} - Edit Breakdown Targets`;
        this.modalService.setModalTitle(STRUCTURE_EDIT_MODAL_ID, modalTitle);
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
      targetItem.isSaved = false;
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
    targetItem.isSaved = true;
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
    this.updateRowRawBreakdownData(targetCategory, targetItem);
    const isCs01 = this.state.activeMetric === this.constants.metric.cs01;
    this.updateRowTargetValues(targetCategory, isCs01, this.state.targetBreakdown.state.isBICs);
    if (!notOneOffEdit) {
      targetCategory.isLocked = true;
      this.calculateAllocation();
      if (this.state.targetBreakdown.state.isBICs && targetCategory.rowDTO) {
        this.setNumberOfSubLevelRowEdits(targetCategory);
      }
    }
    this.refresh();
  }

  public onClickChangeActiveMetric(newMetric: PortfolioMetricValues) {
    if (this.state.activeMetric !== newMetric) {
      this.state.activeMetric = newMetric;
      this.state.targetFund.data.cs01TargetBar.state.isInactiveMetric = !this.state.targetFund.data.cs01TargetBar.state.isInactiveMetric;
      this.state.targetFund.data.creditLeverageTargetBar.state.isInactiveMetric = !this.state.targetFund.data.creditLeverageTargetBar.state.isInactiveMetric;
      this.state.targetBreakdown.state.isDisplayingCs01 = this.state.activeMetric === this.constants.metric.cs01;
      this.setBtnText();
      this.state.targetBreakdown.data.displayCategoryList = this.state.targetBreakdown.state.isDisplayingCs01 ? this.state.targetBreakdown.data.rawCs01CategoryList : this.state.targetBreakdown.data.rawLeverageCategoryList;
      if (this.state.targetBreakdown.state.isBICs) {
        const selectedList = this.state.activeMetric === this.constants.metric.cs01 ? this.state.targetBreakdown.data.rawCs01CategoryList : this.state.targetBreakdown.data.rawLeverageCategoryList;
        this.updateEditRowDTOReferenceBasedOnMetric(selectedList);
      } else {
        this.refreshPreview();
      }
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
      return !eachRow.isLocked && (eachRow.targetBlockFromBreakdown.bicsLevel === 1 || !eachRow.targetBlockFromBreakdown.bicsLevel)
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
    }
  }

  public onClickDistributeProportionally() {
    const unlockedList = this.state.editRowList.filter((eachRow) => {
      return !eachRow.isLocked && (eachRow.targetBlockFromBreakdown.bicsLevel === 1 || !eachRow.targetBlockFromBreakdown.bicsLevel);
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
      this.state.configurator.newOverrideNameCache = null;
      const simpleBucket = {}
      let bucketToString = '';
      params.filterList.forEach((eachItem) => {
        const property = this.utilityService.convertFEKey(eachItem.key);
        if (!!property) {
          simpleBucket[property] = eachItem.filterBy;
        }
        eachItem.filterBy.forEach((eachValue) => {
          bucketToString = bucketToString === '' ? `${eachValue}` : `${bucketToString} ~ ${eachValue}`;
        });
      });
      // this check does not work on BICS and that's by design, because we want to allow overrides to be created with the same bics definitions due to they may carry different context
      if (this.overrideCheckRowAlreadyExist(bucketToString)) {
        const alert = this.dtoService.formSystemAlertObject('Apply Blocked', 'Already Exist', `${bucketToString} bucket already exist`, null);
        this.store$.dispatch(new CoreSendNewAlerts([alert]));
      } else {
        const now = moment();
        const payload: PayloadGetPortfolioOverride = {
          portfolioOverride: {
            date: now.format('YYYY-MM-DD'),
            portfolioId: this.state.targetFund.data.portfolioId,
            simpleBucket: simpleBucket
          }
        };
        this.restfulCommService.callAPI(this.restfulCommService.apiMap.getPortfolioOverride, {req: 'POST'}, payload).pipe(
          first(),
          tap((serverReturn: BEStructuringOverrideBlock) => {
            const returnPack = this.utilityService.convertRawOverrideToRawBreakdown([serverReturn]);
            const rawBreakdownList = returnPack.list;
            this.state.targetBreakdownRawDataDisplayLabelMap = this.utilityService.deepObjectMerge(returnPack.displayLabelMap, this.state.targetBreakdownRawDataDisplayLabelMap);
            const newBreakdownBucketIdentifier = this.utilityService.formBucketIdentifierForOverride(serverReturn);
            const newCategoryKey = this.utilityService.formCategoryKeyForOverride(serverReturn);
            if (!!this.state.targetBreakdown && this.state.targetBreakdown.data.backendGroupOptionIdentifier === newBreakdownBucketIdentifier) {
              const newDataBlock = rawBreakdownList[0].breakdown[newCategoryKey];
              this.state.targetBreakdownRawData.breakdown[newCategoryKey] = newDataBlock;
            } else {
              if (!!this.state.targetBreakdown) {
                const alert = this.dtoService.formSystemAlertObject('Warning', 'Overwritten', `can not merge "${this.state.targetBreakdown.data.backendGroupOptionIdentifier}" with ${newBreakdownBucketIdentifier}, new breakdown has overwrote the previous one`, null);
                this.store$.dispatch(new CoreSendNewAlerts([alert]));
                this.state.removalList = [];  // need to refresh the removalList so previous removal state won't be carried over
              }
              this.state.targetBreakdownRawData = rawBreakdownList[0];
            }
            const isDisplayCs01 = this.state.activeMetric === PortfolioMetricValues.cs01;
            const newBreakdown = this.dtoService.formPortfolioOverrideBreakdown(this.state.targetBreakdownRawData, isDisplayCs01);
            newBreakdown.state.isPreviewVariant = true;
            this.utilityService.updateDisplayLabelForOverrideConvertedBreakdown(
              this.state.targetBreakdownRawDataDisplayLabelMap[newBreakdownBucketIdentifier],
              newBreakdown
            );
            this.utilityService.sortOverrideRows(newBreakdown);
            this.state.targetBreakdown = newBreakdown;
            const prevEditRowsForInheritance = this.utilityService.deepCopy(this.state.editRowList);
            this.loadEditRows();
            this.earMarkNewRow(newCategoryKey);
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
      this.utilityService.updateDisplayLabelForOverrideConvertedBreakdown(
        this.state.targetBreakdownRawDataDisplayLabelMap[newBreakdown.data.backendGroupOptionIdentifier],
        newBreakdown
      );
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

  public clearAllRowTargets() {
    this.state.editRowList.forEach(row => {
      this.resetRowTargets(row, this.constants.metric.cs01);
      this.resetRowTargets(row, this.constants.metric.creditLeverage);
    })
    this.state.clearAllTargetSelected = true;
    this.calculateAllocation();
    this.setBtnText();
    this.refresh()
  }

  public onClickEditCategory(targetRow: StructurePortfolioBreakdownRowDTO) {
    targetRow.state.isSelected = !targetRow.state.isSelected;
  }

  public refreshEditRows() {
    const isCs01 = this.state.activeMetric === this.constants.metric.cs01;
    if (!!isCs01) {
      this.updateTargetBreakdownLists(this.state.targetBreakdown.data.rawCs01CategoryList, this.state.targetBreakdownRawData, isCs01, true);
    } else {
      this.updateTargetBreakdownLists(this.state.targetBreakdown.data.rawLeverageCategoryList, this.state.targetBreakdownRawData, isCs01, true);
    }
    this.utilityService.calculateAlignmentRating(this.state.targetBreakdown);
  }

  public getSubLevelEditRows(targetRow: StructurePortfolioBreakdownRowDTO) {
    if (!!targetRow) {
      if (targetRow.data.displayedSubLevelRows.length <= 0) {
        this.createSubLevelEditRows(targetRow);
      } else {
        const isDisplayCs01 = this.state.activeMetric === this.constants.metric.cs01;
        if (!!targetRow.state.isDoveIn) {
          this.toggleEditRowDTODiveInState(targetRow, false, isDisplayCs01)
        } else {
         this.toggleEditRowDTODiveInState(targetRow, true, isDisplayCs01, targetRow.data.bicsLevel + 1);
        }
      }
    }
  }

  private checkIfEvenRow(editRow: StructureSetTargetPanelEditRowBlock): boolean {
    const selectedList = this.state.activeMetric === this.constants.metric.cs01 ? this.state.targetBreakdown.data.rawCs01CategoryList : this.state.targetBreakdown.data.rawLeverageCategoryList;
    if (!!this.state.targetBreakdown.state.isBICs) {
      const levelOneList = selectedList.filter(row => row.data.bicsLevel === 1);
      return levelOneList.findIndex(row => row.data.code === editRow.rowDTO.data.code) % 2 === 0;
    } else {
      return selectedList.findIndex(row => row.data.category === editRow.rowIdentifier) % 2 === 0;
    }
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
        this.state[data.btnText] = `${data.percentage}% unallocated`;
      })
    } else {
      metricPercentageData.forEach(data => {
        this.state[data.btnText] = this.state.activeMetric === data.metric ? 'Selected' : 'Unselected';
      });
    }
  }


  private loadEditRowsReturnNewRow(row: StructurePortfolioBreakdownRowDTO): StructureSetTargetPanelEditRowBlock {
    const newRow: StructureSetTargetPanelEditRowBlock = {
      targetBlockFromBreakdown: row.data,
      rowIdentifier: row.data.category,
      displayRowTitle: row.data.displayCategory,
      modifiedDisplayRowTitle: row.data.displayCategory,
      targetCs01: {
        level: {
          savedDisplayValue: !!row.data.targetLevel ? `${row.data.targetLevel}` : null,
          savedUnderlineValue: !!row.data.raw.targetLevel ? row.data.raw.targetLevel : null,
          modifiedDisplayValue: null,
          modifiedUnderlineValue: null,
          isActive: false,
          isImplied: false,
          isFocused: false,
          metric: this.constants.metric.cs01,
          isPercent: false,
          isSaved: false
        },
        percent: {
          savedDisplayValue: !!row.data.targetPct ? `${row.data.targetPct}` : null,
          savedUnderlineValue: !!row.data.raw.targetPct ? row.data.raw.targetPct : null,
          modifiedDisplayValue: null,
          modifiedUnderlineValue: null,
          isActive: false,
          isImplied: false,
          isFocused: false,
          metric: this.constants.metric.cs01,
          isPercent: true,
          isSaved: false
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
          isPercent: false,
          isSaved: false
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
          isPercent: true,
          isSaved: false
        }
      },
      isLocked: false,
      isEven: false,
      existInServer: true,
      rowDTO: null,
      isVisible: true
    };
    if (this.state.targetBreakdown.state.isBICs) {
      if (this.state.activeMetric === this.constants.metric.cs01) {
        newRow.rowDTO = row;
      } else {
        const matchedRow = this.state.targetBreakdown.data.rawLeverageCategoryList.find(selectedRow => selectedRow.data.code === row.data.code);
        if (!!matchedRow) {
          newRow.rowDTO = matchedRow;
        }
      }
    }
    newRow.isEven = this.checkIfEvenRow(newRow);
    return newRow;
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
        if (eachCategory.data.bicsLevel > 1) {
          // ignore sub level rows for bics
        } else {
          const newRow = this.loadEditRowsReturnNewRow(eachCategory);
          this.state.editRowList.push(newRow);
        }
      });
      this.state.targetBreakdown.data.rawLeverageCategoryList.forEach((eachCategory) => {
        if (eachCategory.data.bicsLevel > 1) {
          // ignore sub levels
        } else {
          const targetRow = this.state.editRowList.find((eachRow) => {
            return eachRow.rowIdentifier === eachCategory.data.category;
          });
          if (!!targetRow) {
            targetRow.targetCreditLeverage.level.savedDisplayValue = !!eachCategory.data.targetLevel ? `${eachCategory.data.targetLevel}` : null;
            targetRow.targetCreditLeverage.level.savedUnderlineValue = !!eachCategory.data.raw.targetLevel ? eachCategory.data.raw.targetLevel : null;
            targetRow.targetCreditLeverage.percent.savedDisplayValue = !!eachCategory.data.targetPct ? `${eachCategory.data.targetPct}` : null;
            targetRow.targetCreditLeverage.percent.savedUnderlineValue = !!eachCategory.data.raw.targetPct ? eachCategory.data.raw.targetPct : null;
          };
        }
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
    // use fund's current levels if target is not provided - ultimatelly BE does the calculations but FE has to match those changes visually
    this.state.totalUnallocatedCS01 = !!this.state.targetFund.data.target.target.cs01 ? this.state.targetFund.data.target.target.cs01 : this.state.targetFund.data.currentTotals.cs01;
    this.state.remainingUnallocatedCS01 = !!this.state.targetFund.data.target.target.cs01 ? this.state.targetFund.data.target.target.cs01 : this.state.targetFund.data.currentTotals.cs01;
    this.state.totalUnallocatedCreditLeverage = !!this.state.targetFund.data.target.target.creditLeverage ? this.state.targetFund.data.target.target.creditLeverage : this.state.targetFund.data.currentTotals.creditLeverage;
    this.state.remainingUnallocatedCreditLeverage = !!this.state.targetFund.data.target.target.creditLeverage ? this.state.targetFund.data.target.target.creditLeverage : this.state.targetFund.data.currentTotals.creditLeverage;

    if (this.state.targetBreakdown.state.isBICs) {
      const filteredList = this.state.editRowList.filter(editRow => editRow.rowDTO.data.bicsLevel < 2);
      if (filteredList.length > 0) {
        filteredList.forEach((eachRow) => {
          if (eachRow.targetCs01.level.savedUnderlineValue != null) {
            this.state.remainingUnallocatedCS01 = this.state.remainingUnallocatedCS01 - eachRow.targetCs01.level.savedUnderlineValue;
          }
          if (eachRow.targetCreditLeverage.level.savedUnderlineValue != null) {
            this.state.remainingUnallocatedCreditLeverage = this.state.remainingUnallocatedCreditLeverage - eachRow.targetCreditLeverage.level.savedUnderlineValue;
          }
        });
      }
    } else {
      this.state.editRowList.forEach((eachRow) => {
        if (eachRow.targetCs01.level.savedUnderlineValue != null) {
          this.state.remainingUnallocatedCS01 = this.state.remainingUnallocatedCS01 - eachRow.targetCs01.level.savedUnderlineValue;
        }
        if (eachRow.targetCreditLeverage.level.savedUnderlineValue != null) {
          this.state.remainingUnallocatedCreditLeverage = this.state.remainingUnallocatedCreditLeverage - eachRow.targetCreditLeverage.level.savedUnderlineValue;
        }
      });
    }
    if (this.state.remainingUnallocatedCS01 !== null) {
      this.state.displayPercentageUnallocatedCS01 = this.utilityService.round(this.state.remainingUnallocatedCS01/this.state.totalUnallocatedCS01 * 100, 0);
      this.state.displayRemainingUnallocatedCS01 = `${this.utilityService.round(this.state.remainingUnallocatedCS01/1000, 1)} k`;
    }

    if (this.state.remainingUnallocatedCreditLeverage !== null) {
      this.state.displayPercentageUnallocatedCreditLeverage = this.utilityService.round(this.state.remainingUnallocatedCreditLeverage/this.state.totalUnallocatedCreditLeverage * 100, 0);
      this.state.displayRemainingUnallocatedCreditLeverage = this.utilityService.round(this.state.remainingUnallocatedCreditLeverage, 2);
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
        // checks if there is an actual target saved, and if not, it would have been set to null
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

  // for preview rows and portfolio breakdown rows within edit row list (BICS)
  // updates only the visualizers and diffToTargets only
  // this is because the BE data isn't dynamic, and technically only these two properties change visually 
  private updateTargetBreakdownLists(list: Array<StructurePortfolioBreakdownRowDTO>, rawBreakdownData: BEStructuringBreakdownBlock, isCs01: boolean, isBICS: boolean = false) {
    const [minValue, maxValue] = this.utilityService.getMetricSpecificMinAndMaxForVisualizer(rawBreakdownData, isCs01);
    list.forEach(row => {
      const editRowListEquivalent = !!isBICS ? this.state.editRowList.find(editRowList => editRowList.rowDTO.data.code === row.data.code) : this.state.editRowList.find(editRowList => editRowList.rowIdentifier === row.data.category);
      if (!!editRowListEquivalent) {
        const rowRawBreakdownDataByMetric = this.getRowRawDataByMetric(row, rawBreakdownData, isCs01, isBICS);
        // unlike visualizers which have to be relative and therefore need to be updated regardless, diffToTarget is dependent on which rows are being updated
        const editRowEquivalentDataByMetric = !!isCs01 ? editRowListEquivalent.targetCs01 : editRowListEquivalent.targetCreditLeverage;
        const isEditedRow = editRowEquivalentDataByMetric.level.isActive || editRowEquivalentDataByMetric.level.isImplied;
        if (!!isEditedRow) {
          const parsedCurrentLevel = this.utilityService.getRoundedValuesForVisualizer(rowRawBreakdownDataByMetric.currentLevel, isCs01);
          const parsedTargetLevel = this.utilityService.getRoundedValuesForVisualizer(rowRawBreakdownDataByMetric.targetLevel, isCs01)
          const newDiffToTarget = this.utilityService.getRowDiffToTarget(parsedCurrentLevel, parsedTargetLevel, isCs01);
          const newDiffToTargetDisplay = this.utilityService.getRowDiffToTargetText(newDiffToTarget, isCs01);
          this.setNewDiffToTargetsForRows(row, newDiffToTarget, newDiffToTargetDisplay);
        }
        this.updateRowVisualizer(row, rawBreakdownData, minValue, maxValue, isCs01, isBICS);
        if (!!isBICS) {
          row.state.isStencil = false;
          row.data.moveVisualizer.state.isStencil = false;
          editRowListEquivalent.rowDTO = row;
        }
      }
    })
  }

  private refreshPreview() {
    this.state.targetBreakdown.state.isStencil = true;
    this.state.targetBreakdown.data.displayCategoryList.forEach(category => {
      category.data.moveVisualizer.state.isStencil = true;
    })
    const isCs01 = this.state.activeMetric === this.constants.metric.cs01;
    setTimeout(() => {
      if (!!isCs01) {
        this.updateTargetBreakdownLists(this.state.targetBreakdown.data.rawCs01CategoryList, this.state.targetBreakdownRawData, isCs01);
      } else {
        this.updateTargetBreakdownLists(this.state.targetBreakdown.data.rawLeverageCategoryList, this.state.targetBreakdownRawData, isCs01);
      }
      this.utilityService.calculateAlignmentRating(this.state.targetBreakdown);
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

  private submitRegularBreakdownChangesUpdate():boolean {
    const payloads: Array<PayloadUpdateBreakdown> = this.traverseEditRowsToFormUpdateBreakdownPayload();
    if (!!payloads && payloads.length > 0) {
      const necessaryUpdateNumOfCalls = payloads.length;
      let callCount = 0;
      payloads.forEach((payload) => {
        this.restfulCommService.callAPI(this.restfulCommService.apiMap.updatePortfolioBreakdown, {req: 'POST'}, payload).pipe(
          first(),
          tap((serverReturn: BEPortfolioStructuringDTO) => {
            callCount++;
            if (callCount === necessaryUpdateNumOfCalls) {
              this.store$.dispatch(
                new CoreSendNewAlerts([
                  this.dtoService.formSystemAlertObject(
                    'Structuring',
                    'Updated',
                    `Successfully updated targets for ${this.state.targetBreakdown.data.title} in ${this.state.targetFund.data.portfolioShortName}`,
                    null
                  )]
                )
              );
              this.store$.dispatch(new StructureReloadFundDataPostEditEvent(serverReturn));
            }
          }),
          catchError(err => {
            console.error('update breakdown failed');
            this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Error', 'Set Target', 'update breakdown failed', null)]));
            return of('error');
          })
        ).subscribe();
      })
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
              this.store$.dispatch(
                new CoreSendNewAlerts([
                  this.dtoService.formSystemAlertObject(
                    'Structuring',
                    'Updated',
                    `Successfully Updated Target for ${this.state.targetBreakdown.data.title}`,
                    null
                  )]
                )
              );
              this.store$.dispatch(new StructureReloadFundDataPostEditEvent(serverReturn));
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
        return this.submitRegularBreakdownChangesUpdate();
      }
    } else {
      return this.submitRegularBreakdownChangesUpdate();
    }
  }

  private submitOverrideChanges(): boolean {
    const updatePayload: Array<PayloadUpdateOverride> = this.traverseEditRowsToFormUpdateOverridePayload();
    const deletePayload: Array<PayloadDeleteOverride> = this.traverseRemovalListToFormDeleteOverridePayload();
    const necessaryUpdateNumOfCalls = updatePayload.length;
    const necessaryDeleteNumOfCalls = deletePayload.length;
    if (necessaryUpdateNumOfCalls + necessaryDeleteNumOfCalls > 0) {
      if (updatePayload.length > 0) {
        let callCount = 0;
        updatePayload.forEach((eachPayload) => {
          this.restfulCommService.callAPI(this.restfulCommService.apiMap.updatePortfolioOverride, {req: 'POST'}, eachPayload).pipe(
            first(),
            tap((serverReturn: BEPortfolioStructuringDTO) => {
              callCount++;
              if (callCount === necessaryUpdateNumOfCalls) {
                if (necessaryDeleteNumOfCalls > 0) {
                  this.submitOverrideChangesForDelete(deletePayload, necessaryDeleteNumOfCalls);
                } else {
                  this.store$.dispatch(
                    new CoreSendNewAlerts([
                      this.dtoService.formSystemAlertObject(
                        'Structuring',
                        'Updated',
                        `Successfully Updated Target for ${this.state.targetBreakdown.data.title}`,
                        null
                      )]
                    )
                  );
                  this.store$.dispatch(new StructureReloadFundDataPostEditEvent(serverReturn));
                }
              }
            }),
            catchError(err => {
              console.error('update breakdown failed');
              this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Error', 'Set Target', 'update breakdown failed', null)]));
              return of('error');
            })
          ).subscribe();
        });
      } else {
        this.submitOverrideChangesForDelete(deletePayload, necessaryDeleteNumOfCalls);
      }
      return true;
    } else {
      this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Warning', 'Set Target', 'Can not submit new target because no change is detected', null)]));
      return false;
    }
  }

  private submitOverrideChangesForDelete(
    deletePayload: Array<PayloadDeleteOverride>,
    necessaryDeleteNumOfCalls: number
  ) {
    let callCount = 0;
    deletePayload.forEach((eachPayload, index) => {
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.deletePortfolioOverride, {req: 'POST'}, eachPayload).pipe(
        first(),
        tap((serverReturn: BEPortfolioStructuringDTO) => {
          callCount++;
          if (callCount === necessaryDeleteNumOfCalls) {
            this.store$.dispatch(new StructureUpdateMainPanelEvent());
            const alert = this.dtoService.formSystemAlertObject('Structuring', 'Deleted', `Deleted Override Successfully`, null);
            this.store$.dispatch(new CoreSendNewAlerts([alert]));
          }
        }),
        catchError(err => {
          console.error('delete breakdown failed');
          this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Error', 'Set Target', `Delete Override Failed`, null)]));
          return of('error');
        })
      ).subscribe();
    });
  }

  private traverseEditRowsToFormUpdateBreakdownPayload(): Array<PayloadUpdateBreakdown> {
    const now = moment();
    let payloads: Array<PayloadUpdateBreakdown> = []
    if (this.state.targetBreakdown.state.isBICs) {
      const sortedListByLevel = this.state.targetBreakdown.data.displayCategoryList.sort((categoryA: StructurePortfolioBreakdownRowDTO, categoryB: StructurePortfolioBreakdownRowDTO) => categoryA.data.bicsLevel - categoryB.data.bicsLevel);
      const highestLevel = sortedListByLevel[sortedListByLevel.length-1].data.bicsLevel;
      for (let i = 1; i < highestLevel + 1; i++) {
        const rawBreakdown = this.bicsService.formRawBreakdownDetailsObject(this.state.targetBreakdown.data.portfolioId, i);
        const payload: PayloadUpdateBreakdown = {
          portfolioBreakdown: {
            date: moment(rawBreakdown.date).format('YYYY-MM-DD'),
            groupOption: rawBreakdown.groupOption,
            portfolioId: rawBreakdown.portfolioId,
            breakdown: {}
          }
        };
        payloads.push(payload);
      }
    } else {
      const payload: PayloadUpdateBreakdown = {
        portfolioBreakdown: {
          date: now.format('YYYY-MM-DD'),
          groupOption: this.state.targetBreakdownRawData.groupOption,
          portfolioId: this.state.targetBreakdownRawData.portfolioId,
          breakdown: {}
        }
      };
      payloads.push(payload)
    }
    let hasModification = false;
    this.state.editRowList.forEach((eachRow) => {
      if(this.cs01ModifiedInEditRow(eachRow) || this.creditLeverageModifiedInEditRow(eachRow)) {
        hasModification = true;
        const modifiedMetricBreakdowns: BEMetricBreakdowns = {
          metricBreakdowns: {}
        };
        if (this.cs01ModifiedInEditRow(eachRow)) {
          modifiedMetricBreakdowns.metricBreakdowns.Cs01 = {
            targetPct: eachRow.targetCs01.percent.savedUnderlineValue
          };
          if (!eachRow.targetCs01.level.savedUnderlineValue) {
            modifiedMetricBreakdowns.metricBreakdowns.CreditDuration = {
              targetPct: eachRow.targetCs01.percent.savedUnderlineValue
            };
          }
        }
        if (this.creditLeverageModifiedInEditRow(eachRow)) {
          modifiedMetricBreakdowns.metricBreakdowns.CreditLeverage = {
            targetPct: eachRow.targetCreditLeverage.percent.savedUnderlineValue
          };
        }
        if (this.state.targetBreakdown.state.isBICs) {
          const rowLevel = eachRow.rowDTO.data.bicsLevel;
          const BEGroupOption = `${BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER}${rowLevel}`;
          const selectedBreakdown = payloads.find(breakdown => breakdown.portfolioBreakdown.groupOption === BEGroupOption);
          if (!!selectedBreakdown) {
            selectedBreakdown.portfolioBreakdown.breakdown[eachRow.rowDTO.data.code] = modifiedMetricBreakdowns;
          }
        } else {
          payloads[0].portfolioBreakdown.breakdown[eachRow.rowIdentifier] = modifiedMetricBreakdowns;
        }
      }
    });
    if (this.state.targetBreakdown.state.isBICs) {
      const payloadsWithChanges = payloads.filter(payload => Object.entries(payload.portfolioBreakdown.breakdown).length > 0);
      payloads = payloadsWithChanges;
    }
    return hasModification ? payloads : null;
  }

  private traverseEditRowsToFormUpdateOverridePayload(): Array<PayloadUpdateOverride> {
    const now = moment();
    const payload: Array<PayloadUpdateOverride> = [];
    this.state.editRowList.forEach((eachRow) => {
      const eachPayload: PayloadUpdateOverride = {
        portfolioOverride: {
          date: now.format('YYYY-MM-DD'),
          indexId: this.state.targetBreakdownRawData.indexId,
          portfolioId: this.state.targetBreakdownRawData.portfolioId,
          simpleBucket: eachRow.targetBlockFromBreakdown.simpleBucket
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
          modifiedMetricBreakdowns.metricBreakdowns.Cs01 = {
            targetPct: eachRow.targetCs01.percent.savedUnderlineValue
          };
          if (!eachRow.targetCs01.level.savedUnderlineValue) {
            modifiedMetricBreakdowns.metricBreakdowns.CreditDuration = {
              targetPct: eachRow.targetCs01.percent.savedUnderlineValue
            };
          }
        }
        if (this.creditLeverageModifiedInEditRow(eachRow)) {
          modifiedMetricBreakdowns.metricBreakdowns.CreditLeverage = {
            targetPct: eachRow.targetCreditLeverage.percent.savedUnderlineValue
          };
        }
        eachPayload.portfolioOverride.breakdown = modifiedMetricBreakdowns;
      }
      payload.push(eachPayload);
    });
    return payload;
  }

  private traverseRemovalListToFormDeleteOverridePayload(): Array<PayloadDeleteOverride> {
    const payload: Array<PayloadDeleteOverride> = [];
    const now = moment();
    this.state.removalList.forEach((eachRow) => {
      const eachPayload: PayloadDeleteOverride = {
        portfolioOverride: {
          date: now.format('YYYY-MM-DD'),
          indexId: this.state.targetBreakdownRawData.indexId,
          portfolioId: this.state.targetBreakdownRawData.portfolioId,
          simpleBucket: eachRow.targetBlockFromBreakdown.simpleBucket
        }
      };
      payload.push(eachPayload);
    });
    return payload;
  }

  private cs01ModifiedInEditRow(targetRow: StructureSetTargetPanelEditRowBlock): boolean {
    return (targetRow.targetCs01.level.isActive || targetRow.targetCs01.level.isImplied) && (targetRow.targetCs01.level.isSaved || targetRow.targetCs01.percent.isSaved);
  }

  private creditLeverageModifiedInEditRow(targetRow: StructureSetTargetPanelEditRowBlock): boolean {
    return (targetRow.targetCreditLeverage.level.isActive || targetRow.targetCreditLeverage.level.isImplied) && (targetRow.targetCreditLeverage.level.isSaved || targetRow.targetCreditLeverage.percent.isSaved);
  }

  private retrieveRawBreakdownDataForTargetBreakdown(): BEStructuringBreakdownBlock {
    if (!!this.state.targetFund && !!this.state.targetBreakdown) {
      let rawDataObject;
      if (this.state.targetBreakdown.state.isOverrideVariant) {
        const resultPack = this.utilityService.convertRawOverrideToRawBreakdown(this.state.targetFund.data.originalBEData.overrides);
        rawDataObject = resultPack.list;
        this.state.targetBreakdownRawDataDisplayLabelMap = resultPack.displayLabelMap;
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

  private setModifiedRowListsForBICSVariant(rawCs01List: Array<StructurePortfolioBreakdownRowDTO>, rawCreditLeverageList: Array<StructurePortfolioBreakdownRowDTO>, targetBreakdown: PortfolioBreakdownDTO) {
    const cs01LevelOneList = rawCs01List.filter(row => row.data.bicsLevel === 1);
    const leverageLevelOneList = rawCreditLeverageList.filter(row => row.data.bicsLevel === 1);
    cs01LevelOneList.forEach(cs01Row => {
      cs01Row.state.isWithinEditRow = true;
      cs01Row.state.isStencil = false;
      cs01Row.data.moveVisualizer.state.isStencil = false;
      cs01Row.data.displayedSubLevelRows = [];
    });
    leverageLevelOneList.forEach(creditLeverageRow => {
      creditLeverageRow.state.isWithinEditRow = true;
      creditLeverageRow.state.isStencil = false;
      creditLeverageRow.data.moveVisualizer.state.isStencil = false;
      creditLeverageRow.data.displayedSubLevelRows = [];
    });
    targetBreakdown.data.rawCs01CategoryList = cs01LevelOneList;
    targetBreakdown.data.rawLeverageCategoryList = leverageLevelOneList;
    this.resetMultipleVisualizers(this.state.targetBreakdown.data.rawCs01CategoryList, true, this.state.targetBreakdown.state.isBICs, true);
    this.resetMultipleVisualizers(this.state.targetBreakdown.data.rawLeverageCategoryList, false, this.state.targetBreakdown.state.isBICs, true);
  }

  private refresh() {
    if (this.state.targetBreakdown.state.isBICs) {
      this.refreshEditRows();
    } else {
      this.refreshPreview();
    }
  }

  private updateEditRowDTOReferenceBasedOnMetric(list: Array<StructurePortfolioBreakdownRowDTO>) {
    this.utilityService.calculateAlignmentRating(this.state.targetBreakdown);
    this.state.editRowList.forEach(editRow => {
      const selectedRow = list.find(row => row.data.code === editRow.rowDTO.data.code);
      if (!!selectedRow) {
        editRow.rowDTO = selectedRow;
      }
    })
  }

  private updateBICSpecificPropertiesForSubLevels(rawList:  Array<StructurePortfolioBreakdownRowDTO>, isCs01: boolean) {
    const targetList = !!isCs01 ? this.state.targetBreakdown.data.rawCs01CategoryList : this.state.targetBreakdown.data.rawLeverageCategoryList;
    rawList.forEach(selectedListRow => {
      selectedListRow.state.isVisibleSubLevel = true;
      selectedListRow.state.isWithinPopover = false;
      selectedListRow.state.isWithinEditRow = true;
      targetList.push(selectedListRow);
      const existsInRawBreakdown = Object.keys(this.state.targetBreakdownRawData.breakdown).find(key => key === selectedListRow.data.code);
      if (!existsInRawBreakdown) {
        const rawData = this.bicsService.getBICSCategoryRawData(this.state.targetBreakdown.data.portfolioId, selectedListRow.data.bicsLevel, selectedListRow.data.code);
        if (!!rawData) {
          this.state.targetBreakdownRawData.breakdown[selectedListRow.data.code] = rawData;
        }
      }
    })
  }

  private updateDisplayedSubLevelsLists(
    row: StructurePortfolioBreakdownRowDTO,
    targetRawList: Array<StructurePortfolioBreakdownRowDTO>,
    isDisplayList: boolean) {
    const hierarchyList: Array<BICsHierarchyBlock> = this.bicsService.getTargetSpecificHierarchyList(row.data.code, row.data.bicsLevel);
    if (hierarchyList.length > 0) {
      hierarchyList.forEach((category: BICsHierarchyBlock) => {
        if (targetRawList.length > 0) {
          const targetListEquivalent = targetRawList.find(targetRow => targetRow.data.code === category.code);
          if (!!targetListEquivalent) {
            const copy = this.utilityService.deepCopy(row);
            if (targetListEquivalent.data.displayedSubLevelRows.length > 0) {
              const equivalentDisplayedSubLevelRow = targetListEquivalent.data.displayedSubLevelRows.find(displayedSubLevel => displayedSubLevel.data.code === row.data.code);
              !equivalentDisplayedSubLevelRow && targetListEquivalent.data.displayedSubLevelRows.push(copy);
            } else {
              targetListEquivalent.data.displayedSubLevelRows.push(copy);
            }
            targetListEquivalent.state.isShowingSubLevels = true;
            if (!!isDisplayList) {
              const editRowEquivalent = this.state.editRowList.find(editRow => editRow.rowDTO.data.code === category.code);
              if (!!editRowEquivalent) {
                editRowEquivalent.rowDTO.data.displayedSubLevelRows = targetListEquivalent.data.displayedSubLevelRows;
                editRowEquivalent.rowDTO.state.isShowingSubLevels = true;
              }
            }
          }
        }
      });
    }
  }

  private updateDisplayedSubLevelsListWithTargets(row: StructurePortfolioBreakdownRowDTO, isCs01List: boolean, isDisplayCs01: boolean) {
    const subCategoryCodes = this.bicsDictionaryLookupService.getBICSSubLevelByCodeGrouping(row.data.code);
    const customRawBreakdown = this.bicsService.formRawBreakdownDetailsObject(this.state.targetBreakdown.data.portfolioId, 1);
    if (!!customRawBreakdown) {
      const definitionList: Array<string> = [];
      subCategoryCodes.forEach(code => {
        const level = code.length / BICS_CODE_DELIMITER_AMOUNT;
        const rawDataByCode = this.bicsService.getBICSCategoryRawData(this.state.targetFund.data.portfolioId, level, code);
        if (!!rawDataByCode && (rawDataByCode.metricBreakdowns.CreditLeverage.targetLevel || rawDataByCode.metricBreakdowns.Cs01.targetLevel)) {
          const displayCategory = this.bicsDictionaryLookupService.BICSCodeToBICSName(code);
          if (!!displayCategory) {
            customRawBreakdown.breakdown[displayCategory] = rawDataByCode;
            definitionList.push(displayCategory);
            (customRawBreakdown.breakdown[displayCategory] as AdhocExtensionBEMetricBreakdowns).customLevel = level;
            (customRawBreakdown.breakdown[displayCategory] as AdhocExtensionBEMetricBreakdowns).code = code;
          }
        }
      })
      const customBreakdown: PortfolioBreakdownDTO = this.dtoService.formPortfolioBreakdown(false, customRawBreakdown, definitionList, isDisplayCs01, false);
      if (!!customBreakdown) {
        const list = !!isCs01List ? customBreakdown.data.rawCs01CategoryList : customBreakdown.data.rawLeverageCategoryList;
        const listWithTargets = list.filter(newRow => !!newRow.data.targetLevel);
        row.data.displayedSubLevelRowsWithTargets = listWithTargets;
        const isCorrectListForEditRow = this.state.activeMetric === PortfolioMetricValues.cs01 ? isCs01List : !isCs01List;
        if (!!isCorrectListForEditRow) {
          const editRowEquivalent = this.state.editRowList.find(editRow => editRow.rowDTO.data.code === row.data.code);
          if (!!editRowEquivalent) {
            editRowEquivalent.rowDTO.data.displayedSubLevelRowsWithTargets = row.data.displayedSubLevelRowsWithTargets;
          }
        }
      }
    }
  }

  private setNewDiffToTargetsForRows(row: StructurePortfolioBreakdownRowDTO, amount: number, displayText: string) {
    row.data.diffToTarget = amount;
    row.data.diffToTargetDisplay = displayText;
  }

  private toggleEditRowDTODiveInState(row: StructurePortfolioBreakdownRowDTO, diveInState: boolean, isDisplayCs01: boolean, level: number = null) {
    this.resetSubLevelStatesToShowFurtherLevels(row, diveInState);
    const oppositeList = !!isDisplayCs01 ? this.state.targetBreakdown.data.rawLeverageCategoryList : this.state.targetBreakdown.data.rawCs01CategoryList;
    const oppositeListEquivalent = oppositeList.find(oppositeRow => oppositeRow.data.code === row.data.code);
    if (!!oppositeListEquivalent) {
      this.resetSubLevelStatesToShowFurtherLevels(oppositeListEquivalent, diveInState);
    }
    const parsedDisplayList: Array<StructurePortfolioBreakdownRowDTO> = !!level ? row.data.displayedSubLevelRows.filter(displayListRow => displayListRow.data.bicsLevel === level) : row.data.displayedSubLevelRows;
    parsedDisplayList.forEach(parsedDisplayRow => {
      parsedDisplayRow.state.isDoveIn = false;
      const editRowListIndex = this.state.editRowList.findIndex(editRow => editRow.rowDTO.data.code === parsedDisplayRow.data.code);
      if (editRowListIndex >= 0 ) {
        this.state.editRowList[editRowListIndex].isVisible = diveInState;
        this.resetSubLevelStatesToShowFurtherLevels(this.state.editRowList[editRowListIndex].rowDTO, false);
      }
      const rawCs01Equivalent = this.state.targetBreakdown.data.rawCs01CategoryList.find(rawCs01Row => rawCs01Row.data.code === parsedDisplayRow.data.code);
      if (!!rawCs01Equivalent) {
        this.resetSubLevelStatesToShowFurtherLevels(rawCs01Equivalent, false);
      }
      const rawLeverageEquivalent = this.state.targetBreakdown.data.rawLeverageCategoryList.find(rawLeverageRow => rawLeverageRow.data.code === parsedDisplayRow.data.code);
      if (!!rawLeverageEquivalent) {
        this.resetSubLevelStatesToShowFurtherLevels(rawLeverageEquivalent, false);
      }
    })
  }

  private createSubLevelEditRows(targetRow: StructurePortfolioBreakdownRowDTO) {
    targetRow.state.isDoveIn = true;
    const rawCs01Row = this.state.targetBreakdown.data.rawCs01CategoryList.find(rawCs01 => rawCs01.data.code === targetRow.data.code);
    if (!!rawCs01Row) {
      rawCs01Row.state.isDoveIn = true;
    }
    const rawCreditLeverageRow = this.state.targetBreakdown.data.rawLeverageCategoryList.find(rawCreditLeverage => rawCreditLeverage.data.code === targetRow.data.code);
    if (!!rawCreditLeverageRow) {
      rawCreditLeverageRow.state.isDoveIn = true;
    }
    const isCs01 = this.state.activeMetric === this.constants.metric.cs01;
    const subBreakdown = this.bicsService.formSubLevelBreakdown(targetRow, isCs01, this.state.targetBreakdown.data.displayCategoryList);
    targetRow.data.children = subBreakdown;
    if (!!targetRow.data.children && targetRow.data.children.data.rawCs01CategoryList.length > 0 && targetRow.data.children.data.rawLeverageCategoryList.length > 0) {
      this.updateBICSpecificPropertiesForSubLevels(targetRow.data.children.data.rawCs01CategoryList, true);
      this.updateBICSpecificPropertiesForSubLevels(targetRow.data.children.data.rawLeverageCategoryList, false);
      targetRow.data.children.data.rawCs01CategoryList.forEach(rawCs01 => {
        const newEditRow = this.loadEditRowsReturnNewRow(rawCs01);
        const creditLeverageRowEquivalent = targetRow.data.children.data.rawLeverageCategoryList.find(rawLeverageRow => rawLeverageRow.data.code === rawCs01.data.code);
        if (!!creditLeverageRowEquivalent) {
          newEditRow.targetCreditLeverage.level.savedDisplayValue = !!creditLeverageRowEquivalent.data.targetLevel ? `${creditLeverageRowEquivalent.data.targetLevel}` : null;
          newEditRow.targetCreditLeverage.level.savedUnderlineValue = !!creditLeverageRowEquivalent.data.raw.targetLevel ? creditLeverageRowEquivalent.data.raw.targetLevel : null;
          newEditRow.targetCreditLeverage.percent.savedDisplayValue = !!creditLeverageRowEquivalent.data.targetPct ? `${creditLeverageRowEquivalent.data.targetPct}` : null;
          newEditRow.targetCreditLeverage.percent.savedUnderlineValue = !!creditLeverageRowEquivalent.data.raw.targetPct ? creditLeverageRowEquivalent.data.raw.targetPct : null;
        }
        const parentIndex = this.state.editRowList.findIndex(editRow => editRow.rowDTO.data.code === targetRow.data.code);
        const editRowIndex = parentIndex + 1;
        if (parentIndex >= 0) {
          this.state.editRowList.splice(editRowIndex, 0, newEditRow);
        }
        this.updateDisplayedSubLevelsLists(rawCs01, this.state.targetBreakdown.data.rawCs01CategoryList, isCs01);
        this.updateDisplayedSubLevelsLists(creditLeverageRowEquivalent, this.state.targetBreakdown.data.rawLeverageCategoryList, !isCs01);
        this.updateDisplayedSubLevelsListWithTargets(rawCs01, true, isCs01);
        this.updateDisplayedSubLevelsListWithTargets(creditLeverageRowEquivalent, false, isCs01);
      })
    }
    // update existing visualizers to match the newly-added sub level rows
    this.resetMultipleVisualizers(this.state.targetBreakdown.data.rawCs01CategoryList, true, true);
    this.resetMultipleVisualizers(this.state.targetBreakdown.data.rawLeverageCategoryList, false, true);
    const activeRowList = this.state.activeMetric === this.constants.metric.cs01 ? this.state.targetBreakdown.data.rawCs01CategoryList : this.state.targetBreakdown.data.rawLeverageCategoryList;
    activeRowList.forEach(activeRow => {
      const editRowEquivalent = this.state.editRowList.find(editRow => editRow.rowDTO.data.code === activeRow.data.code);
      if (!!editRowEquivalent) {
        editRowEquivalent.rowDTO.data.moveVisualizer = activeRow.data.moveVisualizer;
      }
    });
  }

  private resetSubLevelStatesToShowFurtherLevels(row: StructurePortfolioBreakdownRowDTO, state: boolean) {
    row.state.isDoveIn = state;
    row.state.isShowingSubLevels = state;
  }

  private getRowRawDataByMetric(row: StructurePortfolioBreakdownRowDTO, rawBreakdownData: BEStructuringBreakdownBlock, isCs01: boolean, isBICS: boolean): BEStructuringBreakdownSingleEntry {
    const { breakdown } = rawBreakdownData;
    const rowRawBreakdownData = !!isBICS ? breakdown[row.data.code] : breakdown[row.data.category];
    const rowRawBreakdownDataByMetric= !!isCs01 ? {...rowRawBreakdownData.metricBreakdowns.Cs01} : {...rowRawBreakdownData.metricBreakdowns.CreditLeverage};
    return rowRawBreakdownDataByMetric;
  }

  private updateRowVisualizer(row: StructurePortfolioBreakdownRowDTO, rawBreakdownData: BEStructuringBreakdownBlock, minValue: number, maxValue: number, isCs01: boolean, isBICS: boolean) {
    const rowRawBreakdownDataByMetric= this.getRowRawDataByMetric(row, rawBreakdownData, isCs01, isBICS);
    const { diveInLevel } = this.state.targetBreakdown.data;
    const { isOverrideVariant} = this.state.targetBreakdown.state;
    const rawCurrentLevel = rowRawBreakdownDataByMetric.currentLevel;
    const rawTargetLevel = rowRawBreakdownDataByMetric.targetLevel;
    rowRawBreakdownDataByMetric.currentLevel = !!rawCurrentLevel ? this.utilityService.getRoundedValuesForVisualizer(rawCurrentLevel, isCs01) : rawCurrentLevel;
    rowRawBreakdownDataByMetric.targetLevel = rawTargetLevel ? this.utilityService.getRoundedValuesForVisualizer(rawTargetLevel, isCs01) : rawTargetLevel;
    const newVisualizer = this.dtoService.formMoveVisualizerObjectForStructuring(rowRawBreakdownDataByMetric, maxValue, minValue, false, isOverrideVariant,diveInLevel, isCs01);
    row.data.moveVisualizer = newVisualizer;
    row.data.moveVisualizer.state.isStencil = false;
  }

  private resetMultipleVisualizers(rowList: Array<StructurePortfolioBreakdownRowDTO>, isCs01: boolean, isBICS: boolean, isInitialLoad: boolean = false) {
    const [minValue, maxValue] = this.utilityService.getMetricSpecificMinAndMaxForVisualizer(this.state.targetBreakdownRawData, isCs01);
    const rawBreakdownCopy = this.utilityService.deepCopy(this.state.targetBreakdownRawData);
    if (!!isInitialLoad) {
      for (let code in rawBreakdownCopy.breakdown) {
        if (rawBreakdownCopy.breakdown[code] && code.length > BICS_CODE_DELIMITER_AMOUNT) {
          delete rawBreakdownCopy.breakdown[code];
        }
      }
    }
    rowList.forEach((row: StructurePortfolioBreakdownRowDTO) => {
      this.updateRowVisualizer(row, rawBreakdownCopy, minValue, maxValue,isCs01, isBICS);
    })
  }

  private setNumberOfSubLevelRowEdits(targetCategory: StructureSetTargetPanelEditRowBlock) {
    const hierarchyList = this.bicsService.getTargetSpecificHierarchyList(targetCategory.rowDTO.data.code, targetCategory.rowDTO.data.bicsLevel);
    if (hierarchyList.length > 0) {
      const selectedBreakdownList: Array<StructurePortfolioBreakdownRowDTO> = this.state.activeMetric === this.constants.metric.cs01 ? this.state.targetBreakdown.data.rawCs01CategoryList : this.state.targetBreakdown.data.rawLeverageCategoryList;
      hierarchyList.forEach((listItem: BICsHierarchyBlock) => {
        const rawListEquivalent = selectedBreakdownList.find(selectedRow => selectedRow.data.code === listItem.code);
        if (!!rawListEquivalent) {
          const ifExists = rawListEquivalent.data.editedSubLevelRowsWithTargets.find(displayedRow => displayedRow.data.code === targetCategory.rowDTO.data.code);
          !ifExists && rawListEquivalent.data.editedSubLevelRowsWithTargets.push(targetCategory.rowDTO);
        }
      })
    }
  }

  private updateRowTargetValues(targetCategory: StructureSetTargetPanelEditRowBlock, isCs01: boolean, isBICS: boolean) {
    const selectedRowList = !!isCs01 ? this.state.targetBreakdown.data.rawCs01CategoryList : this.state.targetBreakdown.data.rawLeverageCategoryList;
    const rowListEquivalent = selectedRowList.find(row => !!isBICS ? row.data.code === targetCategory.targetBlockFromBreakdown.code : row.data.displayCategory === targetCategory.rowIdentifier);
    if (!!rowListEquivalent) {
      const selectedMetricValue = !!isCs01 ? targetCategory.targetCs01 : targetCategory.targetCreditLeverage;
      rowListEquivalent.data.targetLevel = selectedMetricValue.level.savedUnderlineValue;
      rowListEquivalent.data.targetPct = selectedMetricValue.percent.savedUnderlineValue;
    }
  }

  private updateRowRawBreakdownData(targetCategory: StructureSetTargetPanelEditRowBlock, targetItem: StructureSetTargetPanelEditRowItemBlock) {
    const identifier = this.state.targetBreakdown.state.isBICs ? targetCategory.rowDTO.data.code : targetCategory.rowIdentifier;
    if (targetItem.metric === this.constants.metric.cs01) {
      this.state.targetBreakdownRawData.breakdown[identifier].metricBreakdowns.Cs01.targetLevel = targetCategory.targetCs01.level.savedUnderlineValue;
      this.state.targetBreakdownRawData.breakdown[identifier].metricBreakdowns.Cs01.targetPct = targetCategory.targetCs01.percent.savedUnderlineValue;
    } else {
      this.state.targetBreakdownRawData.breakdown[identifier].metricBreakdowns.CreditLeverage.targetLevel = targetCategory.targetCreditLeverage.level.savedUnderlineValue;
      this.state.targetBreakdownRawData.breakdown[identifier].metricBreakdowns.CreditLeverage.targetPct = targetCategory.targetCreditLeverage.percent.savedUnderlineValue;
    }
  }
}
