import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  SecurityTableRowDTO
} from 'FEModels/frontend-models.interface';
import {
  QuoteMetricBlock
} from 'FEModels/frontend-blocks.interface';
import {
  ClickedSortQuotesByMetricEmitterParams
} from 'FEModels/frontend-adhoc-packages.interface';

@Component({
  selector: 'security-table-row',
  templateUrl: './security-table-row.component.html',
  styleUrls: ['./security-table-row.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecurityTableRow {
  @Input() rowData: SecurityTableRowDTO;
  @Output() clickedCollapseExpandView = new EventEmitter<SecurityTableRowDTO>();
  @Output() clickedRowTableCanvas = new EventEmitter<SecurityTableRowDTO>();
  @Output() clickedSortQuotesByMetric = new EventEmitter<ClickedSortQuotesByMetricEmitterParams>();
  constructor() { }

  public onClickCollapseExpandView() {
    this.clickedCollapseExpandView.emit(this.rowData);
  }

  public onClickRowTableCanvas() {
    this.clickedRowTableCanvas.emit(this.rowData);
  }

  public onClickSortQuotesByMetric(targetBlock: QuoteMetricBlock, targetLabel: string) {
    this.clickedSortQuotesByMetric.emit({
      targetRow: this.rowData,
      targetBlock: targetBlock,
      targetMetricLabel: targetLabel
    });
  }

}
