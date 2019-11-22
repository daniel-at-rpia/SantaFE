  // dependencies
    import {
      Component,
      OnInit,
      OnChanges,
      ViewEncapsulation,
      Input,
      Output
    } from '@angular/core';
    import { Observable, Subscription } from 'rxjs';
    import {
      of
    } from 'rxjs';
    import {
      tap,
      first,
      delay,
      catchError
    } from 'rxjs/operators';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';

    import {
      SecurityTableDTO,
      SecurityTableRowDTO,
      SecurityTableHeaderDTO
    } from 'FEModels/frontend-models.interface';
    import { QuoteMetricBlock } from 'FEModels/frontend-blocks.interface';
    import { ClickedSortQuotesByMetricEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';
    import { SecurityTableMetricStub } from 'FEModels/frontend-stub-models.interface';
    import { BEQuoteDTO } from 'BEModels/backend-models.interface';

    import {
      SecurityTableMetrics,
      SECURITY_TABLE_FINAL_STAGE
    } from 'Core/constants/securityTableConstants.constant';
  //

@Component({
  selector: 'security-table',
  templateUrl: './security-table.container.html',
  styleUrls: ['./security-table.container.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecurityTable implements OnInit, OnChanges {
  @Input() tableData: SecurityTableDTO;
  @Input() newRows: Array<SecurityTableRowDTO>;
  @Input() receivedContentStage: number;
  securityTableMetrics = SecurityTableMetrics;
  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ) { }

  public ngOnInit() {
    this.loadTableHeaders();
  }

  public ngOnChanges() {
    if (this.tableData.state.loadedContentStage !== this.receivedContentStage) {
      console.log('rows updated for inter-stage change', this.receivedContentStage);
      this.tableData.state.loadedContentStage = this.receivedContentStage;
      this.tableData.data.rows = this.newRows;
      if (this.tableData.state.sortedByHeader) {
        this.performSort(this.tableData.state.sortedByHeader);
      } else {
        this.performDefaultSort();
      }
    } else if (!!this.newRows && this.newRows != this.tableData.data.rows && this.tableData.state.loadedContentStage === this.receivedContentStage) {
      console.log('rows updated for change within same stage', this.tableData.state.loadedContentStage);
      this.tableData.data.rows = this.newRows;
    }
  }

  public onClickHeaderCTA(targetHeader: SecurityTableHeaderDTO) {
    this.tableData.state.selectedHeader = this.tableData.state.selectedHeader === targetHeader ? null : targetHeader;
  }

  public onClickRemoveHeader(targetHeader: SecurityTableHeaderDTO) {
    const targetIndex = this.tableData.data.headers.indexOf(targetHeader);
    this.tableData.state.selectedHeader = null;
    this.securityTableMetrics.forEach((eachStub) => {
      if (eachStub.label === targetHeader.data.displayLabel) {
        eachStub.active = false;
      }
    });
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

  public onClickShowAddColumnDropdown() {
    this.tableData.state.isAddingColumn = !this.tableData.state.isAddingColumn;
  }

  public onCollapseAddColumnDropdown() {
    this.tableData.state.isAddingColumn = false;
  }

  public onClickAddHeader(targetStub: SecurityTableMetricStub) {
    if (!targetStub.active && !targetStub.disabled) {
      targetStub.active = true;
      this.loadTableHeaders();
      this.loadTableRowsUponHeaderChange();
      this.onCollapseAddColumnDropdown();
    }
  }

  public onClickSortBy(targetHeader: SecurityTableHeaderDTO) {
    this.tableData.state.sortedByHeader = this.tableData.state.sortedByHeader === targetHeader ? null : targetHeader;
    this.tableData.state.selectedHeader = null;
    if (this.tableData.state.loadedContentStage >= 2) {
      if (this.tableData.state.sortedByHeader) {
        this.performSort(this.tableData.state.sortedByHeader);
      } else {
        this.performDefaultSort();
      }
    }
  }

  public onClickCollapseExpandView(targetRow: SecurityTableRowDTO) {
    targetRow.state.isExpanded = false;
  }

  public onClickRowTableCanvas(targetRow: SecurityTableRowDTO) {
    if (this.tableData.state.loadedContentStage === SECURITY_TABLE_FINAL_STAGE) {
      targetRow.state.isExpanded = !targetRow.state.isExpanded;
      const row = targetRow;
      this.renderStencilQuotes(targetRow);
      this.fetchSecurityQuotes(row);
    }
  }

  public onClickSortQuotesByMetric(payload: ClickedSortQuotesByMetricEmitterParams) {
    payload.targetRow.state.expandViewSortByQuoteMetric = payload.targetRow.state.expandViewSortByQuoteMetric === payload.targetMetricLabel ? null : payload.targetMetricLabel;
  }

  private loadTableHeaders() {
    this.tableData.data.headers = [];
    this.securityTableMetrics.forEach((eachStub) => {
      if (eachStub.label === 'Security' || eachStub.active) {
        this.tableData.data.headers.push(this.dtoService.formSecurityTableHeaderObject(eachStub));
      }
    });
  }

  private loadTableRowsUponHeaderChange() {
    this.tableData.data.headers.forEach((eachHeader, index) => {
      if (!eachHeader.state.isPureTextVariant && !eachHeader.state.isQuantVariant) {
        this.tableData.data.rows.forEach((eachRow) => {
          const targetCell = eachRow.data.cells[index-1];
          if (!!targetCell) {
            this.utilityService.populateSecurityTableCellFromSecurityCard(eachHeader, eachRow, targetCell);
          } else {
            const newCell = this.utilityService.populateSecurityTableCellFromSecurityCard(
              eachHeader,
              eachRow,
              this.dtoService.formSecurityTableCellObject(false, null, false)
            );
            eachRow.data.cells[index-1] = newCell;
          }
        });
      }
    });
  }

  private fetchSecurityQuotes(targetRow: SecurityTableRowDTO){
    const payload = {
      "identifier": "XS1001476610"
    };
    this.restfulCommService.callAPI('liveQuote/get-all-quotes', {req: 'POST'}, payload).pipe(
      first(),
      delay(200),
      tap((serverReturn) => {
        targetRow.data.quotes = [];
        for (const eachKey in serverReturn) {
          const rawQuote: BEQuoteDTO = serverReturn[eachKey];
          const newQuote = this.dtoService.formSecurityQuoteObject(false, rawQuote);
          targetRow.data.quotes.push(newQuote);
        }
      }),
      catchError(err => {
        console.error('liveQuote/get-all-quotes failed', err);
        return of('error')
      })
    ).subscribe();
    // const msg1 = this.dtoService.formSecurityQuoteObject(false, true, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    // const msg2 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    // msg2.data.ask.isAxe = false;
    // msg2.data.dataSource = 'IB';
    // msg2.data.broker = 'DB';
    // const msg3 = this.dtoService.formSecurityQuoteObject(false, true, false, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    // msg3.data.bid.isAxe = true;
    // msg3.data.dataSource = 'MSG';
    // msg3.data.broker = 'BARC';
    // const msg4 = this.dtoService.formSecurityQuoteObject(false, true, false, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    // msg4.data.ask.isAxe = false;
    // msg4.data.broker = 'BARC';
    // const msg5 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    // msg5.data.ask.isAxe = false;
    // msg5.data.broker = 'USBC';
    // const msg6 = this.dtoService.formSecurityQuoteObject(false, true, true, 'T 0.5 01/01/2020', 'T 0.8 01/01/2025');
    // msg6.data.bid.isAxe = true;
    // msg6.data.broker = 'MUFG';
    // if (targetRow.data.security.data.ratingLevel >= 5) {
    //   const msg7 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    //   const msg8 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    //   const msg9 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    //   const msg10 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    //   const msg11 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    //   const msg12 = this.dtoService.formSecurityQuoteObject(false, false, true, 'T 0.5 01/01/2020', 'T 0.5 01/01/2020');
    //   targetRow.data.quotes = [msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9, msg10, msg11, msg12];
    // } else {
    //   targetRow.data.quotes = [msg1, msg2, msg3, msg4, msg5, msg6];
    // }
  }

  private renderStencilQuotes(targetRow: SecurityTableRowDTO){
    const stencilQuote = this.dtoService.formSecurityQuoteObject(true, null);
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
