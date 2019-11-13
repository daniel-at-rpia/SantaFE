import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import {
  SecurityTableDTO,
  SecurityTableRowDTO
} from 'FEModels/frontend-models.interface';

@Component({
  selector: 'security-table',
  templateUrl: './security-table.container.html',
  styleUrls: ['./security-table.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityTable {
  @Input() tableData: SecurityTableDTO;
  constructor() { }

  public onClickRow(targetRow: SecurityTableRowDTO) {
    targetRow.state.isExpanded = !targetRow.state.isExpanded;
  }

}
