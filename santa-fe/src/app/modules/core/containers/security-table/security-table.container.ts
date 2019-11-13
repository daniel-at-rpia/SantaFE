import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import {
  DTOService
} from 'Core/services/DTOService';

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
  constructor(
    private dtoService: DTOService
  ) { }

  public onClickRow(targetRow: SecurityTableRowDTO) {
    targetRow.state.isExpanded = !targetRow.state.isExpanded;
    const msg1 = this.dtoService.formSecurityTradingMessageObject(false);
    const msg2 = this.dtoService.formSecurityTradingMessageObject(false);
    const msg3 = this.dtoService.formSecurityTradingMessageObject(false);
    const msg4 = this.dtoService.formSecurityTradingMessageObject(false);
    const msg5 = this.dtoService.formSecurityTradingMessageObject(false);
    const msg6 = this.dtoService.formSecurityTradingMessageObject(false);
    targetRow.data.tradingMessages = [msg1, msg2, msg3, msg4, msg5, msg6];
  }

}
