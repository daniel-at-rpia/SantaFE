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
import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';

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
      remainingUnallocatedCreditLeverage: 0
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
      targetItem.modifiedUnderlineValue,
      counterPartyItem,
      targetItem.metric,
      targetItem.isPercent
    );
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
              initialDisplayValue: `${eachCategory.targetLevel}`,
              initialUnderlineValue: eachCategory.raw.targetLevel,
              modifiedDisplayValue: null,
              modifiedUnderlineValue: null,
              isActive: false,
              isImplied: false,
              isFocused: false,
              metric: this.constants.metric.cs01,
              isPercent: false
            },
            percent: {
              initialDisplayValue: `${eachCategory.targetPct}`,
              initialUnderlineValue: eachCategory.raw.targetPct,
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
              initialDisplayValue: null,
              initialUnderlineValue: null,
              modifiedDisplayValue: null,
              modifiedUnderlineValue: null,
              isActive: false,
              isImplied: false,
              isFocused: false,
              metric: this.constants.metric.creditLeverage,
              isPercent: false
            },
            percent: {
              initialDisplayValue: null,
              initialUnderlineValue: null,
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
          targetRow.targetCreditLeverage.level.initialDisplayValue = `${eachCategory.targetLevel}`;
          targetRow.targetCreditLeverage.level.initialUnderlineValue = eachCategory.raw.targetLevel;
          targetRow.targetCreditLeverage.percent.initialDisplayValue = `${eachCategory.targetPct}`;
          targetRow.targetCreditLeverage.percent.initialUnderlineValue = eachCategory.raw.targetPct;
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
      if (eachRow.targetCs01.level.initialUnderlineValue != null) {
        this.state.remainingUnallocatedCS01 = this.state.remainingUnallocatedCS01 - eachRow.targetCs01.level.initialUnderlineValue;
      }
      if (eachRow.targetCreditLeverage.level.initialUnderlineValue != null) {
        this.state.remainingUnallocatedCreditLeverage = this.state.remainingUnallocatedCreditLeverage - eachRow.targetCreditLeverage.level.initialUnderlineValue;
      }
    });
  }

  private setTarget(
    displayValue: string,
    targetItem: StructureSetTargetPanelEditRowItemBlock
  ) {
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
    targetUnderlineValue: number,
    counterPartyItem: StructureSetTargetPanelEditRowItemBlock,
    metric: PortfolioMetricValues,
    targetIsPercent: boolean
  ) {
    counterPartyItem.isActive = false;
    counterPartyItem.isImplied = true;
    counterPartyItem.isFocused = false;
    let impliedValue = null;
    if (metric === this.constants.metric.cs01) {
      if (!!targetIsPercent) {
        impliedValue = (targetUnderlineValue/100) * this.state.totalUnallocatedCS01;
        if (impliedValue > this.state.remainingUnallocatedCS01) {
          impliedValue = this.state.remainingUnallocatedCS01;
        }
        counterPartyItem.modifiedUnderlineValue = impliedValue;
        counterPartyItem.modifiedDisplayValue = this.utilityService.round(impliedValue/1000, 0);
      } else {
        impliedValue = targetUnderlineValue > this.state.remainingUnallocatedCS01 ? this.state.remainingUnallocatedCS01 / this.state.totalUnallocatedCS01 : targetUnderlineValue / this.state.totalUnallocatedCS01;
        counterPartyItem.modifiedUnderlineValue = impliedValue;
        counterPartyItem.modifiedDisplayValue = this.utilityService.round(impliedValue*100, 1);
      }
    } else if (metric === this.constants.metric.creditLeverage) {
      if (!!targetIsPercent) {
        impliedValue = (targetUnderlineValue/100) * this.state.totalUnallocatedCreditLeverage;
        if (impliedValue > this.state.remainingUnallocatedCreditLeverage) {
          impliedValue = this.state.remainingUnallocatedCreditLeverage;
        }
        counterPartyItem.modifiedUnderlineValue = impliedValue;
        counterPartyItem.modifiedDisplayValue = this.utilityService.round(impliedValue, 2);
      } else {
        impliedValue = targetUnderlineValue > this.state.remainingUnallocatedCreditLeverage ? this.state.remainingUnallocatedCreditLeverage / this.state.totalUnallocatedCreditLeverage : targetUnderlineValue / this.state.totalUnallocatedCreditLeverage;
        counterPartyItem.modifiedUnderlineValue = impliedValue;
        counterPartyItem.modifiedDisplayValue = this.utilityService.round(impliedValue*100, 1);
      }
    }
    counterPartyItem.initialDisplayValue = counterPartyItem.modifiedDisplayValue;
    counterPartyItem.initialUnderlineValue = counterPartyItem.modifiedUnderlineValue;
  }

}
