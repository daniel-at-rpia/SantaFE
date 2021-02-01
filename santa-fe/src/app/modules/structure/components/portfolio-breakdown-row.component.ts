import {Component, Input, Output, ViewEncapsulation, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap, withLatestFrom } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { StructurePortfolioBreakdownRowDTO } from 'Core/models/frontend/frontend-models.interface';
import {
  PortfolioView,
  DeltaScope,
  DELTA_SCOPE_SIGNIFICANT_THRESHOLD_COEFFICIENT
} from 'Core/constants/structureConstants.constants';
import { StructureRowSetViewData } from 'App/modules/core/models/frontend/frontend-adhoc-packages.interface';

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
  @Output() setViewForRowClicked = new EventEmitter<StructureRowSetViewData>();
  deltaScope: DeltaScope = null;
  constants = {
    positive: PortfolioView.positive,
    improving: PortfolioView.improving,
    neutral: PortfolioView.neutral,
    deteriorating: PortfolioView.deteriorating,
    negative: PortfolioView.negative,
    diveInText: 'Dive In',
    diveOutText: 'Dive Out',
    deltaSignificantCoefficient: DELTA_SCOPE_SIGNIFICANT_THRESHOLD_COEFFICIENT
  }
  constructor() {}

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
    const data: StructureRowSetViewData = {
      row: this.breakdownRow,
      view: view
    }
    !!this.setViewForRowClicked && this.setViewForRowClicked.emit(data);
  }

  public showSubLevels(breakdownRow: StructurePortfolioBreakdownRowDTO) {
    !!this.viewMainDisplaySubLevels && this.viewMainDisplaySubLevels.emit(breakdownRow);
  }

  public onCollapseActionMenu() {
    this.breakdownRow.state.isSelected = false;
  }
}