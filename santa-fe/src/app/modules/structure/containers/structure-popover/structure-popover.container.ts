import { Component, EventEmitter, Input, OnChanges, Output, OnInit, ViewEncapsulation} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PortfolioMetricValues } from 'App/modules/core/constants/structureConstants.constants';
import { selectMetricLevel } from 'Structure/selectors/structure.selectors';
import { NavigationModule } from 'Core/constants/coreConstants.constant';
import {
  StructurePopoverDTO,
  StructurePortfolioBreakdownRowDTO
} from 'Core/models/frontend/frontend-models.interface';
import { DTOService, BICsDataProcessingService } from 'Core/services';
import { CoreGlobalWorkflowSendNewState } from 'Core/actions/core.actions';
import {
  PortfolioBreakdownCategoryBlock,
  PopoverMainCategoryRowsBlock
} from 'Core/models/frontend/frontend-blocks.interface';
import { UtilityService } from 'Core/services/UtilityService';

@Component({
  selector: 'structure-popover',
  templateUrl: './structure-popover.container.html',
  styleUrls: ['./structure-popover.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructurePopover implements OnInit, OnChanges {
  @Input() selectedCategoryRowsFromBreakdown: PopoverMainCategoryRowsBlock;
  @Input() breakdownDisplayPopover: boolean;
  @Output() resetPopover = new EventEmitter();
  popover: StructurePopoverDTO = null;
  cs01MainRow: StructurePortfolioBreakdownRowDTO;
  creditLeverageMainRow: StructurePortfolioBreakdownRowDTO;
  activeMetric: PortfolioMetricValues;
  constants = {
    navigationModule: NavigationModule,
    mainRowMetricKeys: ['targetLevel', 'targetPct', 'diffToTarget', 'diffToTargetDisplay', 'currentLevel', 'currentPct', 'currentPctDisplay', 'indexPct', 'indexPctDisplay', 'moveVisualizer']
  }
  subscriptions = {
    selectedMetricLevelSub: null
  }

  constructor(
    private store$: Store<any>,
    private dtoService: DTOService,
    private bicsDataProcessingService: BICsDataProcessingService,
    private utilityService: UtilityService
  ) {}

  public ngOnInit() {
    this.subscriptions.selectedMetricLevelSub = this.store$.pipe(
      select(selectMetricLevel)
    ).subscribe((value) => {
      if (!!value) {
        this.activeMetric = value as PortfolioMetricValues;
        if (!!this.popover && !!this.popover.data.mainRow && !!this.breakdownDisplayPopover) {
          const isCs01 = this.activeMetric === PortfolioMetricValues.cs01;
          this.popover.data.mainRow = !!isCs01 ? this.changeMetricSpecificRowData(this.popover.data.mainRow, this.cs01MainRow) : this.changeMetricSpecificRowData(this.popover.data.mainRow, this.creditLeverageMainRow);
          this.popover.state.isDisplayCs01 = !!isCs01;
          this.switchPopoverSubLevels(this.popover.data.mainRow.data, this.activeMetric);
          const flipStencil = this.removeStencils.bind(this);
          setTimeout(() => {
            flipStencil();
          }, 1);
        }
      }
    });
  };

  public ngOnChanges() {
    if (!!this.selectedCategoryRowsFromBreakdown && !!this.breakdownDisplayPopover) {
      this.cs01MainRow = this.selectedCategoryRowsFromBreakdown.cs01;
      this.creditLeverageMainRow = this.selectedCategoryRowsFromBreakdown.creditLeverage;
      if (this.activeMetric === PortfolioMetricValues.cs01) {
        this.createPopover(this.cs01MainRow);
      } else {
        this.createPopover(this.creditLeverageMainRow);
      }
    }
  }

  public changeMetricSpecificRowData(mainRow: StructurePortfolioBreakdownRowDTO, targetRow: StructurePortfolioBreakdownRowDTO): StructurePortfolioBreakdownRowDTO {
    const mainRowCopy = this.utilityService.deepCopy(mainRow);
    const targetRowCopy = this.utilityService.deepCopy(targetRow);
    this.constants.mainRowMetricKeys.forEach(key => {
      mainRowCopy.data[key] = key === 'moveVisualizer' ? this.utilityService.deepCopy(targetRowCopy.data[key]) : targetRowCopy.data[key];
    });
    return mainRowCopy;
  }

  public onClickBreakdownCategory(targetRow: StructurePortfolioBreakdownRowDTO) {
    targetRow.state.isSelected = !targetRow.state.isSelected;
  }

  public getNextBicsLevel(breakdownRow: StructurePortfolioBreakdownRowDTO) {
    if (breakdownRow.data.diveInLevel === 0) {
      this.closePopover();
    } else if (breakdownRow.data.children) {
      breakdownRow.state.isDoveIn = !breakdownRow.state.isDoveIn;
    } else {
      const subBicsLevel = this.bicsDataProcessingService.formSubLevelBreakdown(breakdownRow, this.popover.state.isDisplayCs01);
      breakdownRow.data.children = subBicsLevel;
      breakdownRow.state.isDoveIn = true;
    }
  }

  public onClickSeeBond() {
    this.store$.dispatch(new CoreGlobalWorkflowSendNewState(
      this.dtoService.formGlobalWorkflow(this.constants.navigationModule.trade, true)
    ));
  }

  public onClickEnterSetViewMode(targetRow: StructurePortfolioBreakdownRowDTO) {
    targetRow.state.isEditingView = !targetRow.state.isEditingView;
  }

  public closePopover() {
    this.popover.state.isActive = false;
    this.popover.data.mainRow.state.isSelected = false;
  }

}