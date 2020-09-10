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
      editRowList: []
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
    newValue: number,
    metric: PortfolioMetricValues,
    targetCategory: StructureSetTargetPanelEditRowBlock,
    isPercent: boolean
  ) {
    if (metric === this.constants.metric.cs01) {
      if (!!isPercent) {
        const targetItem = targetCategory.targetCs01.percent;
        const counterPartyItem = targetCategory.targetCs01.level;
        targetItem.modified = newValue;
        targetItem.isActive = true;
      } else {
        const targetItem = targetCategory.targetCs01.level;
        const counterPartyItem = targetCategory.targetCs01.percent;
        targetItem.modified = newValue;
        targetItem.isActive = true;
      }
    } else if (metric === this.constants.metric.creditLeverage) {
      if (!!isPercent) {
        const targetItem = targetCategory.targetCreditLeverage.percent;
        const counterPartyItem = targetCategory.targetCreditLeverage.level;
        targetItem.modified = newValue;
        targetItem.isActive = true;
      } else {
        const targetItem = targetCategory.targetCreditLeverage.level;
        const counterPartyItem = targetCategory.targetCreditLeverage.percent;
        targetItem.modified = newValue;
        targetItem.isActive = true;
      }
    }
  }

  private loadEditRows() {
    if (!!this.state.targetBreakdown) {
      this.state.targetBreakdown.data.rawCs01CategoryList.forEach((eachCategory) => {
        const newRow: StructureSetTargetPanelEditRowBlock = {
          targetBlockFromBreakdown: eachCategory,
          rowTitle: eachCategory.category,
          targetCs01: {
            level: {
              initial: eachCategory.targetLevel,
              modified: null,
              isActive: false,
              isImplied: false
            },
            percent: {
              initial: eachCategory.targetPct,
              modified: null,
              isActive: false,
              isImplied: false
            }
          },
          targetCreditLeverage: {
            level: {
              initial: null,
              modified: null,
              isActive: false,
              isImplied: false
            },
            percent: {
              initial: null,
              modified: null,
              isActive: false,
              isImplied: false
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
          targetRow.targetCreditLeverage.level.initial = eachCategory.targetLevel;
          targetRow.targetCreditLeverage.percent.initial = eachCategory.targetPct;
        };
      });
    }
  }
    }
  }

}
