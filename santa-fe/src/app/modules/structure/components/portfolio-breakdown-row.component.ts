import {Component, Input, Output, ViewEncapsulation, EventEmitter} from '@angular/core';
import { StructurePortfolioBreakdownRowDTO } from 'Core/models/frontend/frontend-models.interface';


@Component({
  selector: 'portfolio-breakdown-row',
  templateUrl: './portfolio-breakdown-row.component.html',
  styleUrls: ['./portfolio-breakdown-row.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class PortfolioBreakdownRow {
  @Input() breakdownRow: StructurePortfolioBreakdownRowDTO;
  @Output() breakdownRowDiveIn = new EventEmitter<StructurePortfolioBreakdownRowDTO>();
  subscriptions = {
    selectedMetricLevelSub: null
  }
  constructor() {}

  public onClickDiveIn(row: StructurePortfolioBreakdownRowDTO) {
    if (!row.data.bicsLevel) return;
    !!this.breakdownRowDiveIn && this.breakdownRowDiveIn.emit(row);
  }
}