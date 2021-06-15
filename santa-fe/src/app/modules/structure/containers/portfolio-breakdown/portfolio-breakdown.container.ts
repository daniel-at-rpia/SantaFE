  // dependencies
    import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
    import { Router } from '@angular/router';
    import { Subscription } from 'rxjs';
    import { filter } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';
    import * as moment from 'moment';

    import { DTOs, Blocks, AdhocPacks } from 'Core/models/frontend';
    import {
      UtilityService,
      DTOService,
      BICSDataProcessingService,
      BICSDictionaryLookupService,
      GlobalWorkflowIOService
    } from 'Core/services';
    import { SantaContainerComponentBase } from 'Core/containers/santa-container-component-base';
    import {
      PortfolioMetricValues,
      STRUCTURE_EDIT_MODAL_ID,
      BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER,
      PortfolioView,
      SubPortfolioFilter
    } from 'Core/constants/structureConstants.constants';
    import { ModalService } from 'Form/services/ModalService';
    import { selectUserInitials } from 'Core/selectors/core.selectors';
    import {
      StructuringEditingViewAvilableList,
      StructuringTeamPMList,
      SecurityDefinitionMap
    } from 'Core/constants/securityDefinitionConstants.constant';
    import { CoreGlobalWorkflowSendNewState } from 'Core/actions/core.actions';
    import { NavigationModule, GlobalWorkflowTypes } from 'Core/constants/coreConstants.constant';
    import { selectDataDatestamp, selectActiveSubPortfolioFilter } from 'Structure/selectors/structure.selectors';
    import { StructureSetView } from 'Structure/actions/structure.actions';
  //

@Component({
  selector: 'portfolio-breakdown',
  templateUrl: './portfolio-breakdown.container.html',
  styleUrls: ['./portfolio-breakdown.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class PortfolioBreakdown extends SantaContainerComponentBase implements OnInit, OnChanges {
  @Input() breakdownData: DTOs.PortfolioBreakdownDTO;
  @Input() dataIsReady: boolean;
  @Output() clickedEdit = new EventEmitter<DTOs.PortfolioBreakdownDTO>();
  activeSubPortfolioFilter: SubPortfolioFilter;
  subscriptions = {
    ownerInitialsSub: null,
    dataDatestampSub: null,
    activeSubPortfolioViewFilterSub: null
  };
  constants = {
    editModalId: STRUCTURE_EDIT_MODAL_ID,
    structuringTeamPMList: StructuringTeamPMList,
    navigationModule: NavigationModule,
    securityDefinitionMap: SecurityDefinitionMap,
    bicsBreakdownId: BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER,
    globalWorkflowTypes: GlobalWorkflowTypes,
    metrics: PortfolioMetricValues,
    subPortfolioFilter: SubPortfolioFilter
  }

  constructor(
    protected utilityService: UtilityService,
    protected globalWorkflowIOService: GlobalWorkflowIOService,
    protected router: Router,
    private modalService: ModalService,
    private store$: Store<any>,
    private bicsDataProcessingService: BICSDataProcessingService,
    private dtoService: DTOService,
    private bicsDictionaryLookupService: BICSDictionaryLookupService
  ) {
    super(utilityService, globalWorkflowIOService, router);
  }

  public ngOnInit() {
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      filter((tick) => {
        return this.stateActive;
      }),
      select(selectUserInitials)
    ).subscribe((initials) => {
      this.breakdownData.state.isEditable = this.constants.structuringTeamPMList.indexOf(initials) >= 0;
      this.breakdownData.state.isEditingViewAvail = StructuringEditingViewAvilableList.includes(initials);
      if (this.breakdownData.data.rawCs01CategoryList.length > 0 && this.breakdownData.data.rawLeverageCategoryList.length > 0) {
        this.updateRowEditingViewAvailState();
      }
    });
    this.subscriptions.dataDatestampSub = this.store$.pipe(
      filter((tick) => {
        return this.stateActive;
      }),
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
    this.subscriptions.activeSubPortfolioViewFilterSub = this.store$.pipe(
      filter((tick) => {
        return this.stateActive;
      }),
      select(selectActiveSubPortfolioFilter)
    ).subscribe((activeFilter: SubPortfolioFilter) => {
      this.activeSubPortfolioFilter = activeFilter;
    })

    return super.ngOnInit();
  }

  public ngOnChanges() {
    if (!!this.breakdownData) {
      this.loadData();
      if (this.breakdownData.data.displayCategoryList.length > 1 && this.breakdownData.state.isOverrideVariant) {
        this.utilityService.sortOverrideRows(this.breakdownData);
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

  public getPopoverMainRow(breakdownRow: DTOs.StructurePortfolioBreakdownRowDTO) {
    if (!!breakdownRow) {
      const rowProcessingData: Blocks.BICSMainRowDataBlock = {
        code: breakdownRow.data.code,
        portfolioID: this.breakdownData.data.portfolioId,
        level: breakdownRow.data.bicsLevel,
        isIndex: this.breakdownData.state.isViewingIndex,
        isEditingViewAvail: breakdownRow.state.isEditingViewAvail
      }
      this.breakdownData.data.popoverMainRow = rowProcessingData;
      this.breakdownData.state.isDisplayPopover = true;
    }
  }

  public resetPopoverMainRow() {
    this.breakdownData.state.isDisplayPopover = false;
    this.breakdownData.data.popoverMainRow = null;
  }

  public onClickBreakdownCategory(targetRow: DTOs.StructurePortfolioBreakdownRowDTO) {
    targetRow.state.isSelected = !targetRow.state.isSelected;
  }

  public getMainDisplaySubLevels(row: DTOs.StructurePortfolioBreakdownRowDTO) {
    row.state.isShowingSubLevels = !row.state.isShowingSubLevels;
    this.bicsDataProcessingService.getDisplayedSubLevelsForCategory(row, this.breakdownData.data.displayCategoryList);
  }

  public onClickShowAllSubLevels() {
    if (this.breakdownData.data.displayCategoryList.length > 0) {
      this.breakdownData.state.isDisplaySubLevels = !this.breakdownData.state.isDisplaySubLevels;
      this.breakdownData.data.displayCategoryList.forEach((row: DTOs.StructurePortfolioBreakdownRowDTO) => {
        if (row.data.bicsLevel === 1 && row.data.displayedSubLevelRows.length > 0) {
          row.state.isShowingSubLevels = !!this.breakdownData.state.isDisplaySubLevels;
        }
        if (row.data.bicsLevel >= 2) {
          row.state.isVisibleSubLevel = !!this.breakdownData.state.isDisplaySubLevels;
        }
      });
    }
  }

  private toggleSetView(row: DTOs.StructurePortfolioBreakdownRowDTO, isEditing: boolean) {
    if (!row) {
      return null;
    } else {
      row.state.isEditingView = !!isEditing;
      const oppositeMainList = this.breakdownData.state.isDisplayingCs01 ? this.breakdownData.data.rawLeverageCategoryList : this.breakdownData.data.rawCs01CategoryList;
      const matchedOppositeRow = oppositeMainList.find(category => category.data.displayCategory === row.data.displayCategory);
      if (!!matchedOppositeRow) {
        matchedOppositeRow.state.isEditingView = !!isEditing;
      }
      if (row.data.children) {
        const selectedChildList = this.breakdownData.state.isDisplayingCs01 ? row.data.children.data.rawCs01CategoryList : row.data.children.data.rawLeverageCategoryList;
        const oppositeChildList = selectedChildList === row.data.children.data.rawCs01CategoryList ?  row.data.children.data.rawLeverageCategoryList : row.data.children.data.rawCs01CategoryList;
        if (selectedChildList.length > 0) {
          selectedChildList.forEach(selectedRow => {
            selectedRow.state.isEditingView = !!isEditing;
            const matchedOppositeCategory = oppositeChildList.find(oppositeRow => oppositeRow.data.displayCategory === selectedRow.data.displayCategory);
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

  public onClickSeeBond(targetRow: DTOs.StructurePortfolioBreakdownRowDTO) {
    const newWorkflowState = this.dtoService.formGlobalWorkflow(this.constants.navigationModule.trade, true, false, this.constants.globalWorkflowTypes.launchTradeToSeeBonds);
    newWorkflowState.data.stateInfo.activeMetric = !!this.breakdownData.state.isDisplayingCs01 ? this.constants.metrics.cs01 : this.constants.metrics.creditLeverage;
    const configurator = this.dtoService.createSecurityDefinitionConfigurator(true, false, true);
    const filterList: Array<DTOs.SecurityDefinitionDTO> = [];
    if (this.breakdownData.state.isOverrideVariant) {
      this.seeBondPackageOverrideDataTransfer(
        configurator,
        targetRow,
        filterList
      );
    } else if (this.breakdownData.data.backendGroupOptionIdentifier.indexOf(this.constants.bicsBreakdownId) === 0) {
      this.bicsDataProcessingService.seeBondPackageBICSBreakdownDataTransfer(
        configurator,
        targetRow,
        filterList
      );
    } else {
      // other regular breakdowns will come here (ccy, rating, tenor);
      const targetDefinition: DTOs.SecurityDefinitionDTO = this.utilityService.deepCopy(this.breakdownData.data.definition);
      targetDefinition.data.displayOptionList.forEach((eachOption) => {
        if (targetDefinition.data.key === this.constants.securityDefinitionMap.TENOR.key) {
          if (eachOption.shortKey === targetRow.data.category) {
            eachOption.isSelected = true;
            targetDefinition.data.highlightSelectedOptionList.push(eachOption);
          }
        } else {
          if (eachOption.shortKey === targetRow.data.displayCategory) {
            eachOption.isSelected = true;
            targetDefinition.data.highlightSelectedOptionList.push(eachOption);
          }
        }
      });
      filterList.push(targetDefinition);
    }
    const fundDefinition: DTOs.SecurityDefinitionDTO = this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.PORTFOLIO);
    fundDefinition.data.displayOptionList.forEach((eachOption) => {
      if (eachOption.shortKey === this.breakdownData.data.portfolioName) {
        eachOption.isSelected = true;
        fundDefinition.data.highlightSelectedOptionList.push(eachOption);
      }
    });
    filterList.push(fundDefinition);
    if (this.activeSubPortfolioFilter !== this.constants.subPortfolioFilter.all) {
      const subPortfolioDefinition: DTOs.SecurityDefinitionDTO = this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.STRATEGY);
      this.utilityService.filterOutExcludedStrategiesForSeeBond(subPortfolioDefinition, this.activeSubPortfolioFilter);
      filterList.push(subPortfolioDefinition);
    }
    newWorkflowState.data.stateInfo.filterList = filterList;
    this.store$.dispatch(new CoreGlobalWorkflowSendNewState(newWorkflowState));
  }

  public onClickEnterSetViewMode(targetRow: DTOs.StructurePortfolioBreakdownRowDTO) {
    targetRow.state.isEditingView = !targetRow.state.isEditingView;
  }

  public updateRowView(data: AdhocPacks.StructureRowSetViewData) {
    if (!!data) {
      const viewData = this.utilityService.formViewPayloadTransferPackForSingleEdit(data);
      if (!!viewData) {
        this.store$.dispatch(new StructureSetView(viewData));
      }
    }
  }

  private removeRowStencils(row: DTOs.StructurePortfolioBreakdownRowDTO) {
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

  private seeBondPackageOverrideDataTransfer(
    configurator: DTOs.SecurityDefinitionConfiguratorDTO,
    targetRow: DTOs.StructurePortfolioBreakdownRowDTO,
    filterList: Array<DTOs.SecurityDefinitionDTO>
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