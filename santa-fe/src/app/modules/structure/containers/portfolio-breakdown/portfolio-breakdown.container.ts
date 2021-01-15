import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';

import {
  UtilityService,
  DTOService,
  BICsDataProcessingService,
  BICSDictionaryLookupService
} from 'Core/services';
import {
  PortfolioBreakdownDTO,
  StructurePopoverDTO,
  StructurePortfolioBreakdownRowDTO,
  SecurityDefinitionDTO,
  SecurityDefinitionConfiguratorDTO
} from 'FEModels/frontend-models.interface';
import {
  PortfolioMetricValues,
  STRUCTURE_EDIT_MODAL_ID,
  BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER,
  PortfolioView
} from 'Core/constants/structureConstants.constants';
import { ModalService } from 'Form/services/ModalService';
import { selectUserInitials } from 'Core/selectors/core.selectors';
import { BICSMainRowDataBlock } from 'Core/models/frontend/frontend-blocks.interface';
import {
  StructureRowSetViewData,
  StructureSetViewTransferPack
} from 'Core/models/frontend/frontend-adhoc-packages.interface';
import {
  editingViewAvailableUsers,
  StructuringTeamPMList,
  SecurityDefinitionMap
} from 'Core/constants/securityDefinitionConstants.constant';
import { CoreGlobalWorkflowSendNewState } from 'Core/actions/core.actions';
import { NavigationModule, GlobalWorkflowTypes } from 'Core/constants/coreConstants.constant';
import { selectDataDatestamp } from 'Structure/selectors/structure.selectors';
import { StructureSetView } from 'Structure/actions/structure.actions';

@Component({
  selector: 'portfolio-breakdown',
  templateUrl: './portfolio-breakdown.container.html',
  styleUrls: ['./portfolio-breakdown.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class PortfolioBreakdown implements OnInit, OnChanges, OnDestroy {
  @Input() breakdownData: PortfolioBreakdownDTO;
  @Input() dataIsReady: boolean;
  @Output() clickedEdit = new EventEmitter<PortfolioBreakdownDTO>();
  subscriptions = {
    ownerInitialsSub: null,
    dataDatestampSub: null
  };
  constants = {
    editModalId: STRUCTURE_EDIT_MODAL_ID,
    structuringTeamPMList: StructuringTeamPMList,
    navigationModule: NavigationModule,
    securityDefinitionMap: SecurityDefinitionMap,
    bicsBreakdownId: BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER,
    globalWorkflowTypes: GlobalWorkflowTypes
  }

  constructor(
    private modalService: ModalService,
    private utilityService: UtilityService,
    private store$: Store<any>,
    private bicsDataProcessingService: BICsDataProcessingService,
    private dtoService: DTOService,
    private bicsDictionaryLookupService: BICSDictionaryLookupService
  ) { }

  public ngOnInit() {
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      select(selectUserInitials)
    ).subscribe((initials) => {
      this.breakdownData.state.isEditable = this.constants.structuringTeamPMList.indexOf(initials) >= 0;
      this.breakdownData.state.isEditingViewAvail = editingViewAvailableUsers.includes(initials);
    });
    this.subscriptions.dataDatestampSub = this.store$.pipe(
      select(selectDataDatestamp)
    ).subscribe((datestampInUnix) => {
      this.breakdownData.state.isViewingHistoricalData = !moment.unix(datestampInUnix).isSame(moment(), 'day');
      this.breakdownData.data.rawCs01CategoryList.forEach((eachRow) => {
        eachRow.state.isViewingHistoricalData = this.breakdownData.state.isViewingHistoricalData;
      });
      this.breakdownData.data.rawLeverageCategoryList.forEach((eachRow) => {
        eachRow.state.isViewingHistoricalData = this.breakdownData.state.isViewingHistoricalData;
      });
    });
  }

  public ngOnChanges() {
    if (!!this.breakdownData) {
      this.loadData();
      if (this.breakdownData.data.displayCategoryList.length > 1 && this.breakdownData.state.isOverrideVariant) {
        this.utilityService.sortOverrideRows(this.breakdownData);
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

  public loadData() {
    if (this.breakdownData.data.title === 'BICS') {
      // Resets BICS sublevel states when switching between metrics
      // addSortedREgularBICSWithSubLevels has to execute for both lists
      // this is to ensure that when toggling the set target modal and switching between metrics in the modal would append the correct sub levels for each category
      this.breakdownData.state.isDisplaySubLevels = false;
      this.bicsDataProcessingService.resetBICsSubLevelsState(this.breakdownData.data.rawCs01CategoryList);
      this.breakdownData.data.rawCs01CategoryList = this.bicsDataProcessingService.addSortedRegularBICsWithSublevels(this.breakdownData.data.rawCs01CategoryList);
      this.bicsDataProcessingService.resetBICsSubLevelsState(this.breakdownData.data.rawLeverageCategoryList);
      this.breakdownData.data.rawLeverageCategoryList = this.bicsDataProcessingService.addSortedRegularBICsWithSublevels(this.breakdownData.data.rawLeverageCategoryList);
    }
    this.breakdownData.data.displayCategoryList = this.breakdownData.state.isDisplayingCs01 ? this.breakdownData.data.rawCs01CategoryList : this.breakdownData.data.rawLeverageCategoryList;
    if (this.dataIsReady) {
      this.utilityService.calculateAlignmentRating(this.breakdownData);
      this.updateRowEditingViewAvailState();
      const flipStencil = this.removeStencil.bind(this);
      setTimeout(() => {
        flipStencil();
      }, 1);
    }
  }

  public removeStencil() {
    this.breakdownData.state.isStencil = false;
    this.breakdownData.data.displayCategoryList.forEach((eachCategory) => {
      eachCategory.data.moveVisualizer.state.isStencil = false;
      eachCategory.state.isStencil = false;
    });
  }

  public onClickEdit() {
    this.modalService.triggerModalOpen(this.constants.editModalId);
    !!this.clickedEdit && this.clickedEdit.emit(this.breakdownData);
  }

  public getPopoverMainRow(breakdownRow: StructurePortfolioBreakdownRowDTO) {
    if (!!breakdownRow) {
      const rowProcessingData: BICSMainRowDataBlock = {
        code: breakdownRow.data.code,
        portfolioID: this.breakdownData.data.portfolioId,
        level: breakdownRow.data.bicsLevel
      }
      this.breakdownData.data.popoverMainRow = rowProcessingData;
      this.breakdownData.state.isDisplayPopover = true;
    }
  }

  public resetPopoverMainRow() {
    this.breakdownData.state.isDisplayPopover = false;
    this.breakdownData.data.popoverMainRow = null;
  }

  public onClickBreakdownCategory(targetRow: StructurePortfolioBreakdownRowDTO) {
    targetRow.state.isSelected = !targetRow.state.isSelected;
  }

  public getMainDisplaySubLevels(row: StructurePortfolioBreakdownRowDTO) {
    row.state.isShowingSubLevels = !row.state.isShowingSubLevels;
    this.bicsDataProcessingService.getDisplayedSubLevelsForCategory(row, this.breakdownData.data.displayCategoryList);
  }

  public onClickShowAllSubLevels() {
    if (this.breakdownData.data.displayCategoryList.length > 0) {
      this.breakdownData.state.isDisplaySubLevels = !this.breakdownData.state.isDisplaySubLevels;
      this.breakdownData.data.displayCategoryList.forEach((row: StructurePortfolioBreakdownRowDTO) => {
        if (row.data.bicsLevel === 1 && row.data.displayedSubLevelRows.length > 0) {
          row.state.isShowingSubLevels = !!this.breakdownData.state.isDisplaySubLevels;
        }
        if (row.data.bicsLevel >= 2) {
          row.state.isVisibleSubLevel = !!this.breakdownData.state.isDisplaySubLevels;
        }
      });
    }
  }

  private toggleSetView(row: StructurePortfolioBreakdownRowDTO, isEditing: boolean) {
    if (!row) {
      return null;
    } else {
      row.state.isEditingView = !!isEditing;
      const oppositeMainList = this.breakdownData.state.isDisplayingCs01 ? this.breakdownData.data.rawLeverageCategoryList : this.breakdownData.data.rawCs01CategoryList;
      const matchedOppositeRow = oppositeMainList.find(category => category.data.category === row.data.category);
      if (!!matchedOppositeRow) {
        matchedOppositeRow.state.isEditingView = !!isEditing;
      }
      if (row.data.children) {
        const selectedChildList = this.breakdownData.state.isDisplayingCs01 ? row.data.children.data.rawCs01CategoryList : row.data.children.data.rawLeverageCategoryList;
        const oppositeChildList = selectedChildList === row.data.children.data.rawCs01CategoryList ?  row.data.children.data.rawLeverageCategoryList : row.data.children.data.rawCs01CategoryList;
        if (selectedChildList.length > 0) {
          selectedChildList.forEach(selectedRow => {
            selectedRow.state.isEditingView = !!isEditing;
            const matchedOppositeCategory = oppositeChildList.find(oppositeRow => oppositeRow.data.category === selectedRow.data.category);
            if (!!matchedOppositeCategory) {
              matchedOppositeCategory.state.isEditingView = !!isEditing
            }
            this.toggleSetView(selectedRow, isEditing);
          })
        }
      } else {
        return null;
      }
    }
  }

  public onClickSeeBond(targetRow: StructurePortfolioBreakdownRowDTO) {
    const newWorkflowState = this.dtoService.formGlobalWorkflow(this.constants.navigationModule.trade, true, this.constants.globalWorkflowTypes.launchTradeToSeeBonds);
    const configurator = this.dtoService.createSecurityDefinitionConfigurator(true, false, true);
    const filterList: Array<SecurityDefinitionDTO> = [];
    if (this.breakdownData.state.isOverrideVariant) {
      this.seeBondPackageOverrideDataTransfer(
        configurator,
        targetRow,
        filterList
      );
    } else if (this.breakdownData.data.backendGroupOptionIdentifier.indexOf(this.constants.bicsBreakdownId) === 0) {
      this.seeBondPackageBICSBreakdownDataTransfer(
        configurator,
        targetRow,
        filterList
      );
    } else {
      // other regular breakdowns will come here (ccy, rating, tenor);
      const targetDefinition = this.utilityService.deepCopy(this.breakdownData.data.definition);
      targetDefinition.data.filterOptionList.forEach((eachOption) => {
        if (eachOption.shortKey === targetRow.data.category) {
          eachOption.isSelected = true;
          targetDefinition.data.highlightSelectedOptionList.push(eachOption);
        }
      });
      filterList.push(targetDefinition);
    }
    const fundDefinition = this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.PORTFOLIO);
    fundDefinition.data.filterOptionList.forEach((eachOption) => {
      if (eachOption.shortKey === this.breakdownData.data.portfolioName) {
        eachOption.isSelected = true;
        fundDefinition.data.highlightSelectedOptionList.push(eachOption);
      }
    });
    filterList.push(fundDefinition);
    newWorkflowState.data.stateInfo.filterList = filterList;
    this.store$.dispatch(new CoreGlobalWorkflowSendNewState(newWorkflowState));
  }

  public onClickEnterSetViewMode(targetRow: StructurePortfolioBreakdownRowDTO) {
    targetRow.state.isEditingView = !targetRow.state.isEditingView;
  }

  public updateRowView(data: StructureRowSetViewData) {
    if (!!data) {
      const { view, row } = data;
      const isRegularBICSRow = row.data.bicsLevel >= 1 && !!row.data.code;
      let formattedDisplayCategory: string;
      if (!!isRegularBICSRow) {
        const level = row.data.bicsLevel;
        formattedDisplayCategory = `${row.data.displayCategory} (Lv.${level})`;
      } else {
        formattedDisplayCategory = row.data.displayCategory;
      }
      const viewData: StructureSetViewTransferPack = {
        bucket: [row.data.bucket],
        view: view !== row.data.view ? [view] : [null],
        displayCategory: formattedDisplayCategory
      }
      this.store$.dispatch(new StructureSetView(viewData));
    }
  }

  private removeRowStencils(row: StructurePortfolioBreakdownRowDTO) {
    if (!row) {
      return null;
    } else {
      if (!!row.data.children) {
        row.data.children.data.displayCategoryList.forEach(row => {
          row.state.isStencil = false;
          row.data.moveVisualizer.state.isStencil = false;
          if (row.data.children) {
            this.removeRowStencils(row);
          }
        })
      }
    }
  }

  private updateRowEditingViewAvailState() {
    this.breakdownData.data.rawCs01CategoryList.forEach((eachRow) => {
      eachRow.state.isEditingViewAvail = this.breakdownData.state.isEditingViewAvail;
    });
    this.breakdownData.data.rawLeverageCategoryList.forEach((eachRow) => {
      eachRow.state.isEditingViewAvail = this.breakdownData.state.isEditingViewAvail;
    });
  }

  private seeBondPackageBICSBreakdownDataTransfer(
    configurator: SecurityDefinitionConfiguratorDTO,
    targetRow: StructurePortfolioBreakdownRowDTO,
    filterList: Array<SecurityDefinitionDTO>
  ) {
    configurator.data.definitionList.forEach((eachBundle) => {
      eachBundle.data.list.forEach((eachDefinition) => {
        if (eachDefinition.data.key === this.constants.securityDefinitionMap.BICS_CONSOLIDATED.key) {
          const selectedOptionList = [];
          selectedOptionList.push(targetRow.data.category);
          eachDefinition.data.highlightSelectedOptionList = this.dtoService.generateSecurityDefinitionFilterOptionList(
            eachDefinition.data.key,
            selectedOptionList,
            targetRow.data.bicsLevel
          );
          eachDefinition.data.highlightSelectedOptionList.forEach((eachOption) => {
            eachOption.isSelected = true;
          });
          filterList.push(eachDefinition);
        }
      });
    });
  }

  private seeBondPackageOverrideDataTransfer(
    configurator: SecurityDefinitionConfiguratorDTO,
    targetRow: StructurePortfolioBreakdownRowDTO,
    filterList: Array<SecurityDefinitionDTO>
  ) {
    configurator.data.definitionList.forEach((eachBundle) => {
      eachBundle.data.list.forEach((eachDefinition) => {
        const backendKey = eachDefinition.data.backendDtoAttrName;
        if (targetRow.data.simpleBucket[backendKey] && targetRow.data.simpleBucket[backendKey].length > 0) {
          if (eachDefinition.data.key === this.constants.securityDefinitionMap.BICS_CONSOLIDATED.key) {
            // BICS Code requires special treatment
            eachDefinition.data.highlightSelectedOptionList = targetRow.data.simpleBucket[backendKey].map((eachBICSCode) => {
              // the simple bucket always contains BICS in its code form, so we need a bit extra work to convert that
              const bicsLevel = Math.floor(eachBICSCode.length/2);
              const bicsName = this.bicsDictionaryLookupService.BICSCodeToBICSName(eachBICSCode);
              const eachOption = this.dtoService.generateSecurityDefinitionFilterIndividualOption(
                this.constants.securityDefinitionMap.BICS_CONSOLIDATED.key,
                bicsName,
                bicsLevel
              );
              return eachOption;
            });
            eachDefinition.data.highlightSelectedOptionList.forEach((eachOption) => {
              eachOption.isSelected = true;
            });
            filterList.push(eachDefinition);
          } else {
            eachDefinition.data.highlightSelectedOptionList = this.dtoService.generateSecurityDefinitionFilterOptionList(
              eachDefinition.data.key,
              targetRow.data.simpleBucket[backendKey]
            );
            eachDefinition.data.highlightSelectedOptionList.forEach((eachOption) => {
              eachOption.isSelected = true;
            });
            filterList.push(eachDefinition);
          }
        }
      });
    });
  }
}