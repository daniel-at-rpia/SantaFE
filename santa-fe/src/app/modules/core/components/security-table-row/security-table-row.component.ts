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

@Component({
  selector: 'security-table-row',
  templateUrl: './security-table-row.component.html',
  styleUrls: ['./security-table-row.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityTableRow {
  @Input() rowData: SecurityTableRowDTO;
  @Output() clickedCollapseExpandView = new EventEmitter<SecurityTableRowDTO>();
  @Output() clickedRowTableCanvas = new EventEmitter<SecurityTableRowDTO>();
  constructor() { }

  public onClickCollapseExpandView() {
    this.clickedCollapseExpandView.emit(this.rowData);
  }

  public onClickRowTableCanvas() {
    this.clickedRowTableCanvas.emit(this.rowData);
  }

}
