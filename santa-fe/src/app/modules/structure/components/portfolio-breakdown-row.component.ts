import {Component, Input, Output, ViewEncapsulation, EventEmitter} from '@angular/core';
import { StructurePortfolioBreakdownRowDTO } from 'Core/models/frontend/frontend-models.interface';
import { PortfolioView } from 'Core/constants/structureConstants.constants';
import { Store } from '@ngrx/store';
import { StructureSetView } from 'Structure/actions/structure.actions';
import * as moment from 'moment';
import { StructureSetViewData } from 'App/modules/core/models/frontend/frontend-adhoc-packages.interface';

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
    negative: PortfolioView.negative
  }
  constructor(
    private store$: Store<any>
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
    const date = new Date();
    const formattedDate = Number(moment(date).format('YYYYMMDD'));
    const viewData: StructureSetViewData = {
      yyyyMMdd: formattedDate,
      bucket: this.breakdownRow.data.bucket,
      view: view !== this.breakdownRow.data.view ? view : null,
      displayCategory: this.breakdownRow.data.displayCategory
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