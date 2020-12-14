import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import {
  PortfolioBreakdownDTO,
  StructurePortfolioBreakdownRowDTO
} from 'FEModels/frontend-models.interface';
import { STRUCTURE_EDIT_MODAL_ID } from 'Core/constants/structureConstants.constants';
import { ModalService } from 'Form/services/ModalService';
import { UtilityService } from 'Core/services/UtilityService';
import { selectUserInitials } from 'Core/selectors/core.selectors';
import { BICsDataProcessingService } from 'Core/services/BICsDataProcessingService';
import { DTOService } from 'Core/services/DTOService';
import {
  editingViewAvailableUsers,
  StructuringTeamPMList
} from 'Core/constants/securityDefinitionConstants.constant';
import { CoreGlobalWorkflowSendNewState } from 'Core/actions/core.actions';
import { NavigationModule } from 'Core/constants/coreConstants.constant';
import { BICSMainRowDataBlock } from 'App/modules/core/models/frontend/frontend-blocks.interface';

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
    ownerInitialsSub: null
  };
  constants = {
    editModalId: STRUCTURE_EDIT_MODAL_ID,
    structuringTeamPMList: StructuringTeamPMList,
    navigationModule: NavigationModule
  }

  constructor(
    private modalService: ModalService,
    private utilityService: UtilityService,
    private store$: Store<any>,
    private bicsDataProcessingService: BICsDataProcessingService,
    private dtoService: DTOService
  ) { }

  public ngOnInit() {
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      select(selectUserInitials)
    ).subscribe((initials) => {
      this.breakdownData.state.isEditable = this.constants.structuringTeamPMList.indexOf(initials) >= 0;
      this.breakdownData.state.isEditingViewAvail = editingViewAvailableUsers.includes(initials);
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
      // Resets BICS sublevel states
      this.breakdownData.state.isDisplaySubLevels = false;
      if (this.breakdownData.state.isDisplayingCs01) {
        this.bicsDataProcessingService.resetBICsSubLevelsState(this.breakdownData.data.rawCs01CategoryList);
        this.breakdownData.data.rawCs01CategoryList = this.bicsDataProcessingService.addSortedRegularBICsWithSublevels(this.breakdownData.data.rawCs01CategoryList);
      } else {
        this.bicsDataProcessingService.resetBICsSubLevelsState(this.breakdownData.data.rawLeverageCategoryList);
        this.breakdownData.data.rawLeverageCategoryList = this.bicsDataProcessingService.addSortedRegularBICsWithSublevels(this.breakdownData.data.rawLeverageCategoryList);
      }
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

  public onClickSeeBond() {
    this.store$.dispatch(new CoreGlobalWorkflowSendNewState(
      this.dtoService.formGlobalWorkflow(this.constants.navigationModule.trade, true)
    ));
  }

  public onClickEnterSetViewMode(targetRow: StructurePortfolioBreakdownRowDTO) {
    targetRow.state.isEditingView = !targetRow.state.isEditingView;
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
}