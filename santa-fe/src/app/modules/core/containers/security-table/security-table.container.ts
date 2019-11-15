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
    msg2.state.hasBid = false;
    msg2.data.ask.isAxe = false;
    msg2.data.dataSource = 'IB';
    msg2.data.broker = 'DB';
    const msg3 = this.dtoService.formSecurityTradingMessageObject(false);
    msg3.data.bid.isAxe = true;
    msg3.state.hasAsk = false;
    msg3.data.dataSource = 'MSG';
    msg3.data.broker = 'BARC';
    const msg4 = this.dtoService.formSecurityTradingMessageObject(false);
    msg4.data.ask.isAxe = false;
    msg4.data.broker = 'BARC';
    const msg5 = this.dtoService.formSecurityTradingMessageObject(false);
    msg5.data.ask.isAxe = false;
    msg5.data.broker = 'USBC';
    const msg6 = this.dtoService.formSecurityTradingMessageObject(false);
    msg6.data.bid.isAxe = true;
    msg6.data.broker = 'MUFG';
    if (targetRow.data.security.data.ratingLevel >= 5) {
      const msg7 = this.dtoService.formSecurityTradingMessageObject(false);
      const msg8 = this.dtoService.formSecurityTradingMessageObject(false);
      const msg9 = this.dtoService.formSecurityTradingMessageObject(false);
      targetRow.data.tradingMessages = [msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9];
    } else {
      targetRow.data.tradingMessages = [msg1, msg2, msg3, msg4, msg5, msg6];
    }
  }

}
