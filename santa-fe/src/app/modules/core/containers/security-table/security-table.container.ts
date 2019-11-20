  // dependencies
    import {
      Component,
      OnInit,
      OnChanges,
      ViewEncapsulation,
      Input,
      Output
    } from '@angular/core';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';

    import {
      SecurityTableDTO,
      SecurityTableRowDTO,
      SecurityTableHeaderDTO
    } from 'FEModels/frontend-models.interface';

    import {
      QuoteMetricBlock
    } from 'FEModels/frontend-blocks.interface';
    import {
      ClickedSortQuotesByMetricEmitterParams
    } from 'FEModels/frontend-adhoc-packages.interface';
  //

@Component({
  selector: 'security-table',
  templateUrl: './security-table.container.html',
  styleUrls: ['./security-table.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityTable implements OnChanges {
  @Input() tableData: SecurityTableDTO;
  @Input() initialDataLoaded: boolean;
  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService
  ) { }

  public ngOnChanges() {
    if (this.tableData.state.initialDataLoaded && !this.tableData.state.initialDataRendered) {
      this.tableData.state.initialDataRendered = true;
      if (this.tableData.state.sortedByHeader) {
        this.performSort(this.tableData.state.sortedByHeader);
      } else {
        this.performDefaultSort();
      }
    }
  }

  public onClickHeaderCTA(targetHeader: SecurityTableHeaderDTO) {
    this.tableData.state.selectedHeader = this.tableData.state.selectedHeader === targetHeader ? null : targetHeader;
  }

  public onClickDelete(targetHeader: SecurityTableHeaderDTO) {
    const targetIndex = this.tableData.data.headers.indexOf(targetHeader);
    this.tableData.state.selectedHeader = null;
    if (targetIndex > 0) {
      if (this.tableData.state.sortedByHeader === targetHeader) {
        this.tableData.state.sortedByHeader = null;
        this.performDefaultSort();
      }
      this.tableData.data.headers.splice(targetIndex, 1);
      this.tableData.data.rows.forEach((eachRow) => {
        eachRow.data.cells.splice(targetIndex-1, 1);
      });
    }
  }

  public onClickSortBy(targetHeader: SecurityTableHeaderDTO) {
    this.tableData.state.sortedByHeader = this.tableData.state.sortedByHeader === targetHeader ? null : targetHeader;
    this.tableData.state.selectedHeader = null;
    if (this.tableData.state.initialDataRendered) {
      if (this.tableData.state.sortedByHeader) {
        this.performSort(this.tableData.state.sortedByHeader);
      } else {
        this.performDefaultSort();
      }
    }
  }

  public onClickAddColumn() {
    this.tableData.state.isAddingColumn = !this.tableData.state.isAddingColumn;
  }

  public onCollapseAddColumnDropdown() {
    this.tableData.state.isAddingColumn = false;
  }

  public onClickCollapseExpandView(targetRow: SecurityTableRowDTO) {
    targetRow.state.isExpanded = false;
  }

  public onClickRowTableCanvas(targetRow: SecurityTableRowDTO) {
    if (this.tableData.state.initialDataLoaded) {
      targetRow.state.isExpanded = !targetRow.state.isExpanded;
      const row = targetRow;
      this.renderStencilQuotes(targetRow);
      const func = () => {
        this.fetchSecurityQuotes(row);
      };
      setTimeout(func.bind(this), 3000);
    }
  }

  public onClickSortQuotesByMetric(payload: ClickedSortQuotesByMetricEmitterParams) {
    payload.targetRow.state.expandViewSortByQuoteMetric = payload.targetRow.state.expandViewSortByQuoteMetric === payload.targetMetricLabel ? null : payload.targetMetricLabel;
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
      targetRow.data.quotes = [msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9, msg10, msg11, msg12];
    } else {
      targetRow.data.quotes = [msg1, msg2, msg3, msg4, msg5, msg6];
    }
  }

  private renderStencilQuotes(targetRow: SecurityTableRowDTO){
    const stencilQuote = this.dtoService.formSecurityQuoteObject(true, true, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    stencilQuote.data.ask.isAxe = false;
    targetRow.data.quotes = [stencilQuote, stencilQuote, stencilQuote];
  }

  private performSort(targetHeader: SecurityTableHeaderDTO) {
    this.tableData.data.rows.sort((rowA, rowB) => {
      const securityA = rowA.data.security;
      const securityB = rowB.data.security;
      const valueA = targetHeader.data.isPartOfMetricPack ? this.utilityService.retrieveSecurityMetricFromMetricPack(securityA, targetHeader) : securityA.data[targetHeader.data.underlineAttrName];
      const valueB = targetHeader.data.isPartOfMetricPack ? this.utilityService.retrieveSecurityMetricFromMetricPack(securityB, targetHeader) : securityB.data[targetHeader.data.underlineAttrName];
      if (!!securityA && !!securityB && !securityA.state.isStencil && !securityB.state.isStencil) {
        if (valueA == null && valueB != null) {
          return 4;
        } else if (valueA != null && valueB == null) {
          return -4;
        } else if (valueA < valueB) {
          return 1;
        } else if (valueA > valueB) {
          return -1;
        }
      } else {
        return 0;
      }
    })
  }

  private performDefaultSort() {
    this.tableData.data.rows.sort((rowA, rowB) => {
      const securityA = rowA.data.security;
      const securityB = rowB.data.security;
      if (!!securityA && !!securityB && !securityA.state.isStencil && !securityB.state.isStencil) {
        if (securityA.data.name < securityB.data.name) {
          return -1;
        } else if (securityA.data.name > securityB.data.name) {
          return 1;
        }
      } else {
        return 0;
      }
    })
  }

}
