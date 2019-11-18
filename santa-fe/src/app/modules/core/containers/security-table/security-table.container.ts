  // dependencies
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
      SecurityTableRowDTO,
      SecurityTableHeaderDTO
    } from 'FEModels/frontend-models.interface';
  //

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

  public onClickHeaderCTA(targetHeader: SecurityTableHeaderDTO) {
    this.tableData.state.selectedHeader = this.tableData.state.selectedHeader === targetHeader ? null : targetHeader;
  }

  public onClickSortBy(targetHeader: SecurityTableHeaderDTO) {
    this.tableData.state.sortedByHeader = this.tableData.state.sortedByHeader === targetHeader ? null : targetHeader;
    this.tableData.state.selectedHeader = null;
  }

  public onClickCollapseExpandView(targetRow: SecurityTableRowDTO) {
    targetRow.state.isExpanded = false;
  }

  public onClickRowTableCanvas(targetRow: SecurityTableRowDTO) {
    if (!this.tableData.state.isStencil) {
      targetRow.state.isExpanded = !targetRow.state.isExpanded;
      const row = targetRow;
      this.renderStencilQuotes(targetRow);
      const func = () => {
        this.fetchSecurityQuotes(row);
      };
      setTimeout(func.bind(this), 3000);
    }
  }

  private fetchSecurityQuotes(targetRow: SecurityTableRowDTO){
    const msg1 = this.dtoService.formSecurityQuoteObject(false, true, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    const msg2 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    msg2.data.ask.isAxe = false;
    msg2.data.dataSource = 'IB';
    msg2.data.broker = 'DB';
    const msg3 = this.dtoService.formSecurityQuoteObject(false, true, false, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    msg3.data.bid.isAxe = true;
    msg3.data.dataSource = 'MSG';
    msg3.data.broker = 'BARC';
    const msg4 = this.dtoService.formSecurityQuoteObject(false, true, false, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    msg4.data.ask.isAxe = false;
    msg4.data.broker = 'BARC';
    const msg5 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    msg5.data.ask.isAxe = false;
    msg5.data.broker = 'USBC';
    const msg6 = this.dtoService.formSecurityQuoteObject(false, true, true, 'T 0.5 01/01/2020', 'T 0.8 01/01/2025');
    msg6.data.bid.isAxe = true;
    msg6.data.broker = 'MUFG';
    if (targetRow.data.security.data.ratingLevel >= 5) {
      const msg7 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
      const msg8 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
      const msg9 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
      const msg10 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
      const msg11 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
      const msg12 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
      targetRow.data.tradingMessages = [msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9, msg10, msg11, msg12];
    } else {
      targetRow.data.tradingMessages = [msg1, msg2, msg3, msg4, msg5, msg6];
    }
  }

  private renderStencilQuotes(targetRow: SecurityTableRowDTO){
    const stencilQuote = this.dtoService.formSecurityQuoteObject(true, true, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    stencilQuote.data.ask.isAxe = false;
    targetRow.data.tradingMessages = [stencilQuote, stencilQuote, stencilQuote];
  }

}
