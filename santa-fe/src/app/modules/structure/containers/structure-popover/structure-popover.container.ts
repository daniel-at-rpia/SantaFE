import { Component, EventEmitter, Input, OnChanges, Output, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DTOs, Blocks, AdhocPacks } from 'Core/models/frontend';
import {
  PortfolioMetricValues,
  DeltaScope,
  PORTFOLIO_ID_TO_SHORTNAMES
} from 'App/modules/core/constants/structureConstants.constants';
import { selectMetricLevel } from 'Structure/selectors/structure.selectors';
import { NavigationModule, GlobalWorkflowTypes } from 'Core/constants/coreConstants.constant';
import { DTOService, BICsDataProcessingService } from 'Core/services';
import { CoreGlobalWorkflowSendNewState } from 'Core/actions/core.actions';
import { StructureSetView } from 'Structure/actions/structure.actions';
import { UtilityService } from 'Core/services/UtilityService';
import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';


@Component({
  selector: 'structure-popover',
  templateUrl: './structure-popover.container.html',
  styleUrls: ['./structure-popover.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructurePopover implements OnInit, OnChanges {
  @Input() mainRowData: Blocks.BICSMainRowDataBlock;
  @Input() breakdownDisplayPopover: boolean;
  @Output() resetPopover = new EventEmitter();
  popover: DTOs.StructurePopoverDTO = null;
  cs01MainRow: DTOs.StructurePortfolioBreakdownRowDTO;
  creditLeverageMainRow: DTOs.StructurePortfolioBreakdownRowDTO;
  activeMetric: PortfolioMetricValues;
  constants = {
    navigationModule: NavigationModule,
    mainRowMetricKeys: ['targetLevel', 'targetPct', 'diffToTarget', 'diffToTargetDisplay', 'currentLevel', 'currentPct', 'currentPctDisplay', 'indexPct', 'indexPctDisplay', 'moveVisualizer'],
    securityDefinitionMap: SecurityDefinitionMap,
    globalWorkflowTypes: GlobalWorkflowTypes,
    portfolioIdToShortnames: PORTFOLIO_ID_TO_SHORTNAMES
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
    if (!!this.mainRowData && !!this.breakdownDisplayPopover) {
      const mainRowData: Blocks.BICSMainRowDataBlock = this.mainRowData;
      mainRowData.isCs01 = this.activeMetric === PortfolioMetricValues.cs01;
      const [cs01Row, creditLeverageRow] = this.bicsDataProcessingService.formBICSRow(mainRowData);
      this.cs01MainRow = cs01Row;
      this.creditLeverageMainRow = creditLeverageRow;
      if (this.activeMetric === PortfolioMetricValues.cs01) {
        this.createPopover(this.cs01MainRow);
      } else {
        this.createPopover(this.creditLeverageMainRow);
      }
    }
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(eachItem)) {
        const eachSub = this.subscriptions[eachItem] as Subscription;
        eachSub.unsubscribe();
      }
    }
  }

  public changeMetricSpecificRowData(mainRow: DTOs.StructurePortfolioBreakdownRowDTO, targetRow: DTOs.StructurePortfolioBreakdownRowDTO): DTOs.StructurePortfolioBreakdownRowDTO {
    const mainRowCopy = this.utilityService.deepCopy(mainRow);
    const targetRowCopy = this.utilityService.deepCopy(targetRow);
    this.constants.mainRowMetricKeys.forEach(key => {
      mainRowCopy.data[key] = key === 'moveVisualizer' ? this.utilityService.deepCopy(targetRowCopy.data[key]) : targetRowCopy.data[key];
    });
    return mainRowCopy;
  }

  public onClickBreakdownCategory(targetRow: DTOs.StructurePortfolioBreakdownRowDTO) {
    targetRow.state.isSelected = !targetRow.state.isSelected;
  }

  public getNextBicsLevel(breakdownRow: DTOs.StructurePortfolioBreakdownRowDTO) {
    if (breakdownRow.data.diveInLevel === 0) {
      this.closePopover();
    } else if (breakdownRow.data.children) {
      breakdownRow.state.isDoveIn = !breakdownRow.state.isDoveIn;
    } else {
      const subBicsLevel = this.bicsDataProcessingService.formSubLevelBreakdown(breakdownRow, this.popover.state.isDisplayCs01, [breakdownRow]);
      breakdownRow.data.children = subBicsLevel;
      breakdownRow.state.isDoveIn = true;
    }
  }

  public onClickSeeBond(targetRow: DTOs.StructurePortfolioBreakdownRowDTO) {
    const newWorkflowState = this.dtoService.formGlobalWorkflow(this.constants.navigationModule.trade, true, this.constants.globalWorkflowTypes.launchTradeToSeeBonds);
    newWorkflowState.data.stateInfo.activeMetric = this.activeMetric;
    const configurator = this.dtoService.createSecurityDefinitionConfigurator(true, false, true);
    const filterList: Array<DTOs.SecurityDefinitionDTO> = [];
    this.bicsDataProcessingService.seeBondPackageBICSBreakdownDataTransfer(
      configurator,
      targetRow,
      filterList
    );
    const fundDefinition: DTOs.SecurityDefinitionDTO = this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.PORTFOLIO);
    const portfolioShortName = this.constants.portfolioIdToShortnames[this.mainRowData.portfolioID];
    fundDefinition.data.displayOptionList.forEach((eachOption) => {
      if (eachOption.shortKey === portfolioShortName) {
        eachOption.isSelected = true;
        fundDefinition.data.highlightSelectedOptionList.push(eachOption);
      }
    });
    filterList.push(fundDefinition);
    newWorkflowState.data.stateInfo.filterList = filterList;
    this.store$.dispatch(new CoreGlobalWorkflowSendNewState(newWorkflowState));
  }

  public onClickEnterSetViewMode(targetRow: DTOs.StructurePortfolioBreakdownRowDTO) {
    targetRow.state.isEditingView = !targetRow.state.isEditingView;
  }

  public createPopover(categoryRow: DTOs.StructurePortfolioBreakdownRowDTO) {
    const isCs01 = this.activeMetric === PortfolioMetricValues.cs01;
    const subBicsLevel = this.bicsDataProcessingService.formSubLevelBreakdown(categoryRow, isCs01, [categoryRow]);
    categoryRow.data.children = subBicsLevel;
    categoryRow.state.isWithinPopover = true;
    this.popover = this.dtoService.formStructurePopoverObject(categoryRow, isCs01, this.mainRowData.isIndex);
    this.popover.state.isActive = true;
    categoryRow.state.isDoveIn = !categoryRow.state.isDoveIn;
  }

  public switchPopoverSubLevels(block: Blocks.PortfolioBreakdownCategoryBlock, activeMetric: PortfolioMetricValues) {
    if (!block.children) {
      return;
    } else {
      const isCs01 = activeMetric === PortfolioMetricValues.cs01;
      const currentMetricList =  !!isCs01 ? block.children.data.rawCs01CategoryList : block.children.data.rawLeverageCategoryList;
      const oppositeMetricList = !!isCs01 ? block.children.data.rawLeverageCategoryList : block.children.data.rawCs01CategoryList;
      block.children.data.displayCategoryList = currentMetricList;
      block.children.data.displayCategoryList.forEach(row => {
        row.state.isStencil = true;
        const selectedValue = oppositeMetricList.find(previousRow => previousRow.data.displayCategory === row.data.displayCategory);
        row.state.isDoveIn = !!selectedValue.data.children && selectedValue.state.isDoveIn;
        row.data.children = selectedValue.data.children;
        row.data.moveVisualizer.state.isStencil = true;
        if (!!row.data.children) {
          row.data.children.data.displayCategoryList = isCs01 ? row.data.children.data.rawCs01CategoryList : row.data.children.data.rawLeverageCategoryList;
          this.switchPopoverSubLevels(row.data, activeMetric);
        }
      })
    }
  }

  public closePopover() {
    this.popover.state.isActive = false;
    this.popover.data.mainRow.state.isSelected = false;
    !!this.resetPopover && this.resetPopover.emit();
  }

  public updatePopoverRowView(data: AdhocPacks.StructureRowSetViewData) {
    if (!!data) {
      const viewData = this.utilityService.formViewPayloadTransferPackForSingleEdit(data);
      if (!!viewData) {
        this.store$.dispatch(new StructureSetView(viewData));
      }
    }
  }

  private removeStencils() {
    this.popover.data.mainRow.state.isStencil = false;
    if (!!this.popover.data.mainRow.data.moveVisualizer) {
      this.popover.data.mainRow.data.moveVisualizer.state.isStencil = false;
    }
    this.removePopoverRowStencils(this.popover.data.mainRow)
  }

  private removePopoverRowStencils(row: DTOs.StructurePortfolioBreakdownRowDTO) {
    if (!row) {
      return null;
    } else {
      if (!!row.data.children) {
        row.data.children.data.displayCategoryList.forEach(row => {
          row.state.isStencil = false;
          row.data.moveVisualizer.state.isStencil = false;
          if (row.data.children) {
            this.removePopoverRowStencils(row);
          }
        })
      }
    }
  }

}