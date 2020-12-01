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
  @Output() breakdownRowDiveIn = new EventEmitter<StructurePortfolioBreakdownRowDTO>();
  @Output() viewMainDisplaySubLevels = new EventEmitter<StructurePortfolioBreakdownRowDTO>();
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

  public onClickDiveIn(row: StructurePortfolioBreakdownRowDTO) {
    if (!row.data.bicsLevel || row.state.isStencil) {
      return null;
    } else {
      !!this.breakdownRowDiveIn && this.breakdownRowDiveIn.emit(row);
    }
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
}