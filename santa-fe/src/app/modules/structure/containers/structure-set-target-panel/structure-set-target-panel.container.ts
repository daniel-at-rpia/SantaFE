import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { StructureSetTargetPanelState } from 'FEModels/frontend-page-states.interface';
import { DTOService } from 'Core/services/DTOService';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { UtilityService } from 'Core/services/UtilityService';
import { selectSetTargetTransferPack } from 'Structure/selectors/structure.selectors';
import { StructureSetTargetOverlayTransferPack } from 'FEModels/frontend-adhoc-packages.interface';
import { StructureSetTargetPanelEditRowBlock, StructureSetTargetPanelEditRowItemBlock } from 'FEModels/frontend-blocks.interface';
import { PortfolioBreakdownGroupOptions, PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
import {
  FilterOptionsCurrency,
  FilterOptionsRating,
  FilterOptionsTenor
} from 'Core/constants/securityDefinitionConstants.constant';

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
    metric: PortfolioMetricValues
  }

  constructor(
    private store$: Store<any>,
    private utilityService: UtilityService,
    private dtoService: DTOService,
    private restfulCommService: RestfulCommService
  ){
    this.state = this.initializePageState();
  }

  private initializePageState(): StructureSetTargetPanelState {
    const state: StructureSetTargetPanelState = {
      targetBreakdown: null,
      targetFund: null,
      editRowList: [],
      totalUnallocatedCS01: 0,
      totalUnallocatedCreditLeverage: 0,
      remainingUnallocatedCS01: 0,
      remainingUnallocatedCreditLeverage: 0,
      activeMetric: null,
      displayPercentageUnallocatedCS01: 0,
      displayPercentageUnallocatedCreditLeverage: 0
    }
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
        this.state.activeMetric = pack.targetFund.data.cs01TargetBar.state.isInactiveMetric ? this.constants.metric.creditLeverage : this.constants.metric.cs01;
        this.loadEditRows();
        this.calculateAllocation();
      }
    })
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
    targetItem.isFocused = true;
    this.setTarget(
      newValue,
      targetItem
    );
  }

  public onClickSaveEdit(
    targetCategory: StructureSetTargetPanelEditRowBlock,
    targetItem: StructureSetTargetPanelEditRowItemBlock
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
    this.calculateAllocation();
    this.applyChangeToPreview(targetCategory, targetItem);
  }

  public onClickChangeActiveMetric(newMetric: PortfolioMetricValues) {
    if (this.state.activeMetric !== newMetric) {
      this.state.activeMetric = newMetric;
      this.state.targetFund.data.cs01TargetBar.state.isInactiveMetric = !this.state.targetFund.data.cs01TargetBar.state.isInactiveMetric;
      this.state.targetFund.data.creditLeverageTargetBar.state.isInactiveMetric = !this.state.targetFund.data.creditLeverageTargetBar.state.isInactiveMetric;
      this.refeshPreview();
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
              savedDisplayValue: `${eachCategory.targetLevel}`,
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
              savedDisplayValue: `${eachCategory.targetPct}`,
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
          }
        };
        this.state.editRowList.push(newRow);
      });
      this.state.targetBreakdown.data.rawLeverageCategoryList.forEach((eachCategory) => {
        const targetRow = this.state.editRowList.find((eachRow) => {
          return eachRow.rowTitle === eachCategory.category;
        });
        if (!!targetRow) {
          targetRow.targetCreditLeverage.level.savedDisplayValue = `${eachCategory.targetLevel}`;
          targetRow.targetCreditLeverage.level.savedUnderlineValue = eachCategory.raw.targetLevel;
          targetRow.targetCreditLeverage.percent.savedDisplayValue = `${eachCategory.targetPct}`;
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
    this.state.displayPercentageUnallocatedCS01 = !!this.state.remainingUnallocatedCS01 ? this.utilityService.round(this.state.remainingUnallocatedCS01/this.state.totalUnallocatedCS01 * 100, 0) : 0;
    this.state.displayPercentageUnallocatedCreditLeverage = !!this.state.remainingUnallocatedCreditLeverage ? this.utilityService.round(this.state.remainingUnallocatedCreditLeverage/this.state.totalUnallocatedCreditLeverage * 100, 0) : 0;
  }

  private setTarget(
    displayValue: string,
    targetItem: StructureSetTargetPanelEditRowItemBlock
  ) {
    if (displayValue == '') {
      displayValue = '0'
    };
    if (targetItem.metric === this.constants.metric.cs01 && !targetItem.isPercent) {
      targetItem.modifiedDisplayValue = displayValue;
      targetItem.isActive = true;
      targetItem.modifiedUnderlineValue = parseFloat(displayValue)*1000;
    } else {
      targetItem.modifiedDisplayValue = displayValue;
      targetItem.isActive = true;
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
          impliedValue = (targetUnderlineValue/100) * this.state.totalUnallocatedCS01;
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
          impliedValue = (targetUnderlineValue/100) * this.state.totalUnallocatedCreditLeverage;
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

  private refeshPreview() {
    this.state.targetBreakdown.data.displayCategoryList = this.state.activeMetric === PortfolioMetricValues.cs01 ? this.state.targetBreakdown.data.rawCs01CategoryList : this.state.targetBreakdown.data.rawLeverageCategoryList;
    this.state.targetBreakdown.state.isStencil = true;
    this.state.targetBreakdown.data.displayCategoryList.forEach(category => {
      category.moveVisualizer.state.isStencil = true;
    })
    setTimeout(() => {
      this.state.targetBreakdown.state.isStencil = false;
      this.state.targetBreakdown.data.displayCategoryList.forEach(category => {
      category.moveVisualizer.state.isStencil = false;
      })
    }, 300);
  }

  private applyChangeToPreview(targetCategory: StructureSetTargetPanelEditRowBlock, targetItem: StructureSetTargetPanelEditRowItemBlock) {
    const rowTitle = targetCategory.rowTitle;
    const breakdownTitle = this.state.targetBreakdown.data.title; 
    const breakdown = this.state.targetFund.data.children.find(breakdown => breakdown.data.title === breakdownTitle);
    const breakdownIndex = this.state.targetFund.data.children.indexOf(breakdown);
    const savedUnderlineValues = targetItem.metric === PortfolioMetricValues.cs01 ? {level: targetCategory.targetCs01.level.savedUnderlineValue, percent: targetCategory.targetCs01.percent.savedUnderlineValue } : {level: targetCategory.targetCreditLeverage.level.savedUnderlineValue, percent: targetCategory.targetCreditLeverage.percent.savedUnderlineValue };
    const categoryDataList = [
      {
        name: PortfolioBreakdownGroupOptions.currency,
        rawData: this.state.targetFund.data.originalBEData.ccyBreakdown,
        definitionList: FilterOptionsCurrency
      }, 
      {
        name: PortfolioBreakdownGroupOptions.tenor,
        rawData: this.state.targetFund.data.originalBEData.tenorBreakdown,
        definitionList: FilterOptionsTenor
      },
      {
        name: PortfolioBreakdownGroupOptions.rating,
        rawData: this.state.targetFund.data.originalBEData.ratingBreakdown,
        definitionList: FilterOptionsRating
      },
      {
        name: PortfolioBreakdownGroupOptions.bics,
        rawData: this.state.targetFund.data.originalBEData.bicsLevel1Breakdown,
        definitionList: null
      }
    ];
    const categoryData = categoryDataList.find(categoryData => categoryData.name === breakdownTitle);
    const {rawData, definitionList} = categoryData; 
    const rawDataBreakdownLevel = targetItem.metric === PortfolioMetricValues.cs01 ? rawData.breakdown[rowTitle].metricBreakdowns.Cs01 : rawData.breakdown[rowTitle].metricBreakdowns.CreditLeverage;
    const rawDataBreakdownPercent = targetItem.metric === PortfolioMetricValues.cs01 ? rawData.breakdown[rowTitle].metricBreakdowns.Cs01 : rawData.breakdown[rowTitle].metricBreakdowns.CreditLeverage;
    rawDataBreakdownLevel.targetLevel = savedUnderlineValues.level;
    rawDataBreakdownPercent.targetPct = savedUnderlineValues.percent;
    this.state.targetBreakdown.state.isStencil = true;
    this.state.targetBreakdown.data.displayCategoryList.forEach(category => {
      category.moveVisualizer.state.isStencil = true;
    })
    setTimeout(() => {
      const updatedPortfolioBreakdown = this.dtoService.formPortfolioBreakdown(false, rawData, definitionList);
      updatedPortfolioBreakdown.data.title = breakdownTitle;
      this.state.targetFund.data.children[breakdownIndex] = updatedPortfolioBreakdown; 
      this.state.targetBreakdown = updatedPortfolioBreakdown;
      this.state.targetBreakdown.state.isPreviewVariant = true;
      this.state.targetBreakdown.state.isDisplayingCs01 = targetItem.metric === PortfolioMetricValues.cs01;
      this.state.activeMetric = targetItem.metric;
   }, 300);
  }

}
