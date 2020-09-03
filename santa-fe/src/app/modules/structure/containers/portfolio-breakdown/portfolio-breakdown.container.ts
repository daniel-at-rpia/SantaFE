import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { PortfolioBreakdownDTO } from 'FEModels/frontend-models.interface';
import { PortfolioMetricValues, STRUCTURE_EDIT_MODAL_ID } from 'Core/constants/structureConstants.constants';
import { ModalService } from 'Form/services/ModalService';
import { UtilityService } from 'Core/services/UtilityService';
import { selectUserInitials } from 'Core/selectors/core.selectors';

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
    private store$: Store<any>
  ) { }

  public ngOnInit() {
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      select(selectUserInitials)
    ).subscribe((initials) => {
      if (initials == 'DM') {
        this.breakdownData.state.isEditable = true;
      } else {
        this.breakdownData.state.isEditable = false;
      }
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
      const flipStencil = this.removeStencil.bind(this);
      setTimeout(() => {
        flipStencil();
      }, 1);
    }
  }

  public removeStencil() {
    this.breakdownData.state.isStencil = false;
    this.breakdownData.data.displayCategoryList.forEach((eachCategory) => {
      eachCategory.moveVisualizer.state.isStencil = false;
    });
  }

  public onClickEdit() {
    this.modalService.triggerModalOpen(this.constants.editModalId);
    !!this.clickedEdit && this.clickedEdit.emit(this.breakdownData);
  }

  public calculateAlignmentRating() {
    const targetList = this.breakdownData.state.isDisplayingCs01 ? this.breakdownData.data.rawCs01CategoryList : this.breakdownData.data.rawLeverageCategoryList;
    let allCategoriesHaveTarget = !targetList.find((eachCategory) => {
      return eachCategory.targetLevel == null;
    });
    if (allCategoriesHaveTarget) {
      let misalignment = 0;
      targetList.forEach((eachCategory) => {
        misalignment = misalignment + Math.abs(eachCategory.targetPct - eachCategory.currentPct);
      });
      this.breakdownData.style.ratingFillWidth = 100 - this.utilityService.round(misalignment, 0);
      this.breakdownData.data.ratingHoverText = `${100 - this.utilityService.round(misalignment, 0)}`;
      this.breakdownData.state.isTargetAlignmentRatingAvail = true;
    }
  }

}
