import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { PortfolioBreakdownDTO, StructurePopoverDTO, StructurePortfolioBreakdownRowDTO } from 'FEModels/frontend-models.interface';
import { PortfolioMetricValues, STRUCTURE_EDIT_MODAL_ID } from 'Core/constants/structureConstants.constants';
import { ModalService } from 'Form/services/ModalService';
import { UtilityService } from 'Core/services/UtilityService';
import { selectUserInitials } from 'Core/selectors/core.selectors';
import { BICsDataProcessingService } from 'Core/services/BICsDataProcessingService';
import { DTOService } from 'Core/services/DTOService';
import { PortfolioBreakdownCategoryBlock } from 'Core/models/frontend/frontend-blocks.interface';
import { editingViewAvailableUsers } from 'Core/constants/securityDefinitionConstants.constant';
import { StructuringTeamPMList } from 'Core/constants/securityDefinitionConstants.constant';

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
    structuringTeamPMList: StructuringTeamPMList
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
      this.breakdownData.data.rawCs01CategoryList = this.bicsDataProcessingService.sortRegularBICSWithSubLevels(this.breakdownData.data.rawCs01CategoryList);
      this.breakdownData.data.rawLeverageCategoryList = this.bicsDataProcessingService.sortRegularBICSWithSubLevels(this.breakdownData.data.rawLeverageCategoryList);
    }
    this.breakdownData.data.displayCategoryList = this.breakdownData.state.isDisplayingCs01 ? this.breakdownData.data.rawCs01CategoryList : this.breakdownData.data.rawLeverageCategoryList;
    let popoverCategory;
    if (this.dataIsReady) {
      this.utilityService.calculateAlignmentRating(this.breakdownData);
      if (!!this.breakdownData.data.popover && !!this.breakdownData.data.popover.state.isActive) {
        const previousMetricData = this.utilityService.deepCopy(this.breakdownData.data.popover.data.mainRow.data.children);
        popoverCategory = this.breakdownData.data.popover.data.mainRow.data.category; 
        const popoverRow = this.breakdownData.state.isDisplayingCs01 ? this.breakdownData.data.rawCs01CategoryList.find(row => row.data.category === popoverCategory) : this.breakdownData.data.rawLeverageCategoryList.find(row => row.data.category === popoverCategory);
        this.updatePopoverData(popoverRow);
        this.breakdownData.data.popover.data.mainRow.data.children = previousMetricData;
        this.switchPopoverValues(this.breakdownData.data.popover.data.mainRow.data);
      }
      //handles a scenario where the user has the popover open in one metric, switches and closes the popover, then switches back, the category is still selected but there is no popover
      const oppositeList =  this.breakdownData.state.isDisplayingCs01 ? this.breakdownData.data.rawLeverageCategoryList : this.breakdownData.data.rawCs01CategoryList;
      const matchedOppositeRow = oppositeList.find(row => row.data.category === popoverCategory);
      if (!!matchedOppositeRow) {
        matchedOppositeRow.state.isSelected = false;
      }
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
      if (!!this.breakdownData.data.popover) {
        this.removeRowStencils(eachCategory);
      }
    });
  }

  public onClickEdit() {
    this.modalService.triggerModalOpen(this.constants.editModalId);
    !!this.clickedEdit && this.clickedEdit.emit(this.breakdownData);
  }

  public updatePopoverData(breakdownRow: StructurePortfolioBreakdownRowDTO) {
    if (!!this.breakdownData.data.selectedCategory) {
      if (breakdownRow.data.category !== this.breakdownData.data.selectedCategory) {
        const previousRowCategory = this.breakdownData.data.selectedCategory;
        this.breakdownData.data.selectedCategory = breakdownRow.data.category; 
        const previousCs01Row = this.breakdownData.data.rawCs01CategoryList.find(row => row.data.category === previousRowCategory);
        const previousLeverageRow = this.breakdownData.data.rawLeverageCategoryList.find(row => row.data.category === previousRowCategory);
        if (!!previousCs01Row) {
          previousCs01Row.state.isSelected = false;
        }
        if (!!previousLeverageRow) {
          previousLeverageRow.state.isSelected = false;
        }
      }
    } else {
      this.breakdownData.data.selectedCategory = breakdownRow.data.category;
    }
    const breakdownRowCopy = this.utilityService.deepCopy(breakdownRow);
    const subBicsLevel = this.bicsDataProcessingService.formSubLevelBreakdown(breakdownRowCopy, this.breakdownData.state.isDisplayingCs01, this.breakdownData.state.isEditingView);
    breakdownRowCopy.data.children = subBicsLevel;
    breakdownRowCopy.state.isWithinPopover = true;
    this.breakdownData.data.popover = this.dtoService.formStructurePopoverObject(breakdownRowCopy, this.breakdownData.state.isDisplayingCs01);
    this.breakdownData.data.popover.data.mainRow.state.isSelected = true;
    this.breakdownData.data.popover.state.isActive = true;
  }

  public switchPopoverValues(block: PortfolioBreakdownCategoryBlock) {
    if (!block.children) return;
    const currentMetricList =  this.breakdownData.state.isDisplayingCs01 ? block.children.data.rawCs01CategoryList : block.children.data.rawLeverageCategoryList;
    const oppositeMetricList = this.breakdownData.state.isDisplayingCs01 ? block.children.data.rawLeverageCategoryList : block.children.data.rawCs01CategoryList;
    block.children.data.displayCategoryList = currentMetricList;
    block.children.data.displayCategoryList.forEach(row => {
      row.state.isStencil = true;
      const selectedValue = oppositeMetricList.find(previousRow => previousRow.data.category === row.data.category);
      row.state.isSelected = !!selectedValue.data.children && selectedValue.state.isSelected;
      row.data.children = selectedValue.data.children;
      row.data.moveVisualizer.state.isStencil = true;
      if (!!row.data.children) {
        row.data.children.data.displayCategoryList = this.breakdownData.state.isDisplayingCs01 ? row.data.children.data.rawCs01CategoryList : row.data.children.data.rawLeverageCategoryList;
        this.switchPopoverValues(row.data);
      }
    })
  }

  public onClickSetView(breakdown: PortfolioBreakdownDTO) {
    if (!breakdown.state.isPreviewVariant) {
      this.breakdownData.state.isEditingView = !this.breakdownData.state.isEditingView;
      breakdown.data.displayCategoryList.forEach(row => {
        this.toggleSetView(row, this.breakdownData.state.isEditingView);
      })
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
        row.data.children.state.isEditingView = !!isEditing;
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
}