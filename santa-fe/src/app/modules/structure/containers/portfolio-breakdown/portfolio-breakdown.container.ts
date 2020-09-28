import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { PortfolioBreakdownDTO, StructurePortfolioBreakdownRowDTO } from 'FEModels/frontend-models.interface';
import { PortfolioMetricValues, STRUCTURE_EDIT_MODAL_ID } from 'Core/constants/structureConstants.constants';
import { ModalService } from 'Form/services/ModalService';
import { UtilityService } from 'Core/services/UtilityService';
import { selectUserInitials } from 'Core/selectors/core.selectors';
import { BICsDataProcessingService } from 'Structure/services/BICsDataProcessingService';
import { DTOService } from 'Core/services/DTOService';

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
    editModalId: STRUCTURE_EDIT_MODAL_ID
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
      this.breakdownData.state.isEditable = initials === 'DM';
    });
  }

  public ngOnChanges() {
    if (!!this.breakdownData) {
      this.loadData();
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
    this.breakdownData.data.displayCategoryList = this.breakdownData.state.isDisplayingCs01 ? this.breakdownData.data.rawCs01CategoryList : this.breakdownData.data.rawLeverageCategoryList;
    if (this.dataIsReady) {
      this.calculateAlignmentRating();
     if (!!this.breakdownData.data.popover) {
      const popoverCategory = this.breakdownData.data.popover.data.mainRow.data.category; 
      const popoverRow = this.breakdownData.state.isDisplayingCs01 ? this.breakdownData.data.rawCs01CategoryList.find(row => row.data.category === popoverCategory) : this.breakdownData.data.rawLeverageCategoryList.find(row => row.data.category === popoverCategory);
      this.updatePopoverData(popoverRow);
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
    });
  }

  public onClickEdit() {
    this.modalService.triggerModalOpen(this.constants.editModalId);
    !!this.clickedEdit && this.clickedEdit.emit(this.breakdownData);
  }

  public calculateAlignmentRating() {
    const targetList = this.breakdownData.state.isDisplayingCs01 ? this.breakdownData.data.rawCs01CategoryList : this.breakdownData.data.rawLeverageCategoryList;
    let totalLevel = 0;
    targetList.forEach((eachCategory) => {
      totalLevel = totalLevel + eachCategory.data.currentLevel;
    });
    const targetListWithTargets = targetList.filter((eachCategory) => {
      return !!eachCategory.data.targetLevel;
    });
    if (targetListWithTargets.length > 0) {
      let misalignmentAggregate = 0;
      targetListWithTargets.forEach((eachCategory) => {
        const misalignmentPercentage = eachCategory.data.diffToTarget / totalLevel * 100;
        misalignmentAggregate = misalignmentAggregate + Math.abs(misalignmentPercentage);
      });
      misalignmentAggregate = misalignmentAggregate > 100 ? 100 : misalignmentAggregate;
      this.breakdownData.style.ratingFillWidth = 100 - this.utilityService.round(misalignmentAggregate, 0);
      this.breakdownData.data.ratingHoverText = `${100 - this.utilityService.round(misalignmentAggregate, 0)}`;
      this.breakdownData.state.isTargetAlignmentRatingAvail = true;
    } else {
      this.breakdownData.state.isTargetAlignmentRatingAvail = false;
    }
  }

public updatePopoverData(breakdownRow: StructurePortfolioBreakdownRowDTO)
 {
  const subBicsLevel = this.bicsDataProcessingService.formSubLevelBreakdown(breakdownRow, this.breakdownData.state.isDisplayingCs01);
  breakdownRow.data.children = subBicsLevel;
  this.breakdownData.data.popover = this.dtoService.formStructurePopoverObject(breakdownRow, this.breakdownData.state.isDisplayingCs01);
  this.breakdownData.data.popover.data.mainRow.state.isSelected = true;
  this.breakdownData.data.popover.state.isActive = true;
 }
}
