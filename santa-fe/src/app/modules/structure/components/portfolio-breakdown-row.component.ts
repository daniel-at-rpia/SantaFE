import {Component, Input, Output, ViewEncapsulation, EventEmitter} from '@angular/core';
import { StructurePortfolioBreakdownRowDTO } from 'Core/models/frontend/frontend-models.interface';
import {
  PortfolioView,
  BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX
} from 'Core/constants/structureConstants.constants';
import { Store } from '@ngrx/store';
import { StructureSetView } from 'Structure/actions/structure.actions';
import * as moment from 'moment';
import { StructureSetViewData } from 'App/modules/core/models/frontend/frontend-adhoc-packages.interface';
import { BICsDataProcessingService } from 'Core/services/BICsDataProcessingService';

@Component({
  selector: 'portfolio-breakdown-row',
  templateUrl: './portfolio-breakdown-row.component.html',
  styleUrls: ['./portfolio-breakdown-row.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class PortfolioBreakdownRow {
  @Input() breakdownRow: StructurePortfolioBreakdownRowDTO;
  @Output() viewMainDisplaySubLevels = new EventEmitter<StructurePortfolioBreakdownRowDTO>();
  @Output() rowDiveInClicked = new EventEmitter<StructurePortfolioBreakdownRowDTO>();
  @Output() categoryClicked = new EventEmitter<StructurePortfolioBreakdownRowDTO>();
  @Output() seeBondClicked = new EventEmitter<StructurePortfolioBreakdownRowDTO>();
  @Output() enterSetViewModeClicked = new EventEmitter<StructurePortfolioBreakdownRowDTO>();
  constants = {
    positive: PortfolioView.positive,
    improving: PortfolioView.improving,
    neutral: PortfolioView.neutral,
    deteriorating: PortfolioView.deteriorating,
    negative: PortfolioView.negative,
    subLevelPrefix: BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX
  }
  constructor(
    private store$: Store<any>,
    private bicsDataProcessingService: BICsDataProcessingService
  ) {}

  public onClickCategory() {
    !!this.categoryClicked && this.categoryClicked.emit(this.breakdownRow);
  }

  public onClickDiveIn(row: StructurePortfolioBreakdownRowDTO) {
    if (!row.data.bicsLevel || row.state.isStencil) {
      return null;
    } else {
      this.breakdownRow.state.isSelected = false;
      !!this.rowDiveInClicked && this.rowDiveInClicked.emit(row);
    }
  }

  public onClickSeeBond() {
    this.breakdownRow.state.isSelected = false;
    !!this.seeBondClicked && this.seeBondClicked.emit(this.breakdownRow);
  }

  public onClickEnterSetViewMode() {
    this.breakdownRow.state.isSelected = false;
    !!this.enterSetViewModeClicked && this.enterSetViewModeClicked.emit(this.breakdownRow);
  }

  public onClickSetView(view: PortfolioView) {
    const isBICSRow = this.breakdownRow.data.bicsLevel >= 1 && !!this.breakdownRow.data.code;
    let displayCategory: string;
    if (!!isBICSRow) {
      const categoryName = this.bicsDataProcessingService.BICSCodeToBICSName(this.breakdownRow.data.code);
      const includesSubLevelPrefix = categoryName.includes(this.constants.subLevelPrefix);
      if (!!includesSubLevelPrefix) {
        displayCategory = categoryName.split(this.constants.subLevelPrefix)[0].trim();
      } else {
        displayCategory = this.breakdownRow.data.displayCategory;
      }
    }
    const viewData: StructureSetViewData = {
      bucket: this.breakdownRow.data.bucket,
      view: view !== this.breakdownRow.data.view ? view : null,
      displayCategory: displayCategory
    }
    this.store$.dispatch(new StructureSetView(viewData));
  }

  public showSubLevels(breakdownRow: StructurePortfolioBreakdownRowDTO) {
    !!this.viewMainDisplaySubLevels && this.viewMainDisplaySubLevels.emit(breakdownRow);
 }

 public onCollapseActionMenu() {
   this.breakdownRow.state.isSelected = false;
 }
}