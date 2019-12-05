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
    import { PayloadGetAllQuotes } from 'BEModels/backend-payloads.interface';
    import { ClickedSortQuotesByMetricEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';
    import { SecurityTableMetricStub } from 'FEModels/frontend-stub-models.interface';
    import { BEQuoteDTO } from 'BEModels/backend-models.interface';

    import {
      SECURITY_TABLE_FINAL_STAGE
    } from 'Core/constants/securityTableConstants.constant';
  //

@Component({
  selector: 'security-table',
  templateUrl: './security-table.container.html',
  styleUrls: ['./security-table.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityTable implements OnInit, OnChanges {
  @Input() tableData: SecurityTableDTO;
  @Input() newRows: Array<SecurityTableRowDTO>;
  @Input() receivedContentStage: number;

  securityTableMetrics: Array<SecurityTableMetricStub>;
  @Input() receivedSecurityTableMetricsUpdate: Array<SecurityTableMetricStub>;
  receivedSecurityTableMetricsCache: Array<SecurityTableMetricStub>;// use this only for detecting diff

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ) { }

  public ngOnInit() {
    this.securityTableMetrics = this.receivedSecurityTableMetricsUpdate;
    this.loadTableHeaders();
  }

  public ngOnChanges() {
    if (this.tableData.state.loadedContentStage !== this.receivedContentStage) {
      console.log('rows updated for inter-stage change', this.receivedContentStage);
      this.tableData.state.loadedContentStage = this.receivedContentStage;
      if (this.receivedSecurityTableMetricsCache !== this.receivedSecurityTableMetricsUpdate) {
        this.receivedSecurityTableMetricsCache = this.utilityService.deepCopy(this.securityTableMetrics);
        // currently the only thing the parent can change is the 30 day delta metric's attribute, so we only need to update that
        this.securityTableMetrics[7].attrName = this.receivedSecurityTableMetricsUpdate[7].attrName;
        this.securityTableMetrics[7].underlineAttrName = this.receivedSecurityTableMetricsUpdate[7].underlineAttrName;
        this.loadTableHeaders();
      }
      this.loadTableRows(this.newRows);
    } else if (!!this.newRows && this.newRows != this.tableData.data.rows && this.tableData.state.loadedContentStage === this.receivedContentStage) {
      console.log('rows updated for change within same stage', this.tableData.state.loadedContentStage);
      this.loadTableRows(this.newRows);
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

  public onClickToggleQuantAxeSkew(targetHeader: SecurityTableHeaderDTO) {
    if (targetHeader.state.isQuantVariant) {
      targetHeader.state.isAxeSkewEnabled = !targetHeader.state.isAxeSkewEnabled;
      if (this.tableData.state.loadedContentStage >= 2) {
        this.applySkewToggleToRows(targetHeader, true);
      }
    }
    this.tableData.state.selectedHeader = null;
  }

  public onClickToggleQuantSkew(targetHeader: SecurityTableHeaderDTO, isAxe: boolean) {
    if (targetHeader.state.isQuantVariant) {
      if (isAxe) {
        targetHeader.state.isAxeSkewEnabled = !targetHeader.state.isAxeSkewEnabled;
      } else {
        targetHeader.state.istotalSkewEnabled = !targetHeader.state.istotalSkewEnabled;
      }
      if (this.tableData.state.loadedContentStage >= 2) {
        this.applySkewToggleToRows(targetHeader, isAxe);
      }
    }
    this.tableData.state.selectedHeader = null;
  }

  public onClickCollapseExpandView(targetRow: SecurityTableRowDTO) {
    targetRow.state.isExpanded = false;
    targetRow.data.security.state.isTableExpanded = false;
  }

  public onClickRowTableCanvas(targetRow: SecurityTableRowDTO) {
    if (this.tableData.state.loadedContentStage === SECURITY_TABLE_FINAL_STAGE) {
      targetRow.state.isExpanded = !targetRow.state.isExpanded;
      targetRow.data.security.state.isTableExpanded = targetRow.state.isExpanded;
      if (targetRow.state.isExpanded) {
        this.renderStencilQuotes(targetRow);
        this.fetchSecurityQuotes(targetRow);
      }
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

  private loadTableRows(rowList: Array<SecurityTableRowDTO>) {
    this.tableData.data.rows = rowList;
    this.updateDynamicColumns();
    if (this.tableData.state.sortedByHeader) {
      this.performSort(this.tableData.state.sortedByHeader);
    } else {
      this.performDefaultSort();
    }
  }

  private updateDynamicColumns() {
    // right now the only dynamic column is positionCurrent
    const showingPositionCurrent = this.tableData.data.headers.find((eachHeader) => {
      return eachHeader.data.underlineAttrName === 'positionCurrent';
    });
    if (!!showingPositionCurrent && this.receivedContentStage >= showingPositionCurrent.data.readyStage) {
      const cellIndex = this.tableData.data.headers.indexOf(showingPositionCurrent) - 1;
      this.tableData.data.rows.forEach((eachRow) => {
        eachRow.data.cells[cellIndex] = this.utilityService.populateSecurityTableCellFromSecurityCard(showingPositionCurrent, eachRow, eachRow.data.cells[cellIndex]);
      });
    }
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
    var bestBid: number; 
    var bestOffer: number;
    var metricType: string;

    bestBid = targetRow.data.cells[0].data.quantComparerDTO.data.bid.number;
    bestOffer = targetRow.data.cells[0].data.quantComparerDTO.data.offer.number;
    metricType = targetRow.data.cells[0].data.quantComparerDTO.data.metricType;

    const payload: PayloadGetAllQuotes = {
      "identifier": {
        "SecurityId": targetRow.data.security.data.securityID
      }
    };
    this.restfulCommService.callAPI('liveQuote/get-all-quotes', {req: 'POST'}, payload).pipe(
      first(),
      delay(200),
      tap((serverReturn) => {
        targetRow.data.quotes = [];
        for (const eachKey in serverReturn) {
          const rawQuote: BEQuoteDTO = serverReturn[eachKey];

         const newQuote = this.dtoService.formSecurityQuoteObject(false, rawQuote, bestBid, bestOffer, metricType);
          if (newQuote.state.hasAsk || newQuote.state.hasBid) {
            targetRow.data.quotes.push(newQuote);
          }
        }
        this.performChronologicalSortOnQuotes(targetRow);
      }),
      catchError(err => {
        console.error('liveQuote/get-all-quotes failed', err);
        return of('error')
      })
    ).subscribe();
  }

  private renderStencilQuotes(targetRow: SecurityTableRowDTO){
    const stencilQuote = this.dtoService.formSecurityQuoteObject(true, null, null, null, null);
    targetRow.data.quotes = [stencilQuote, stencilQuote, stencilQuote];
  }

  private performSort(targetHeader: SecurityTableHeaderDTO) {
    this.tableData.data.rows.sort((rowA, rowB) => {
      const securityA = rowA.data.security;
      const securityB = rowB.data.security;
      let valueA;
      let valueB;
      if (targetHeader.state.isQuantVariant) {
        const qA = rowA.data.cells[0].data.quantComparerDTO;
        const qB = rowB.data.cells[0].data.quantComparerDTO;
        valueA = !!qA ? qA.data.delta : null;
        valueB = !!qB ? qB.data.delta : null;
        if (!!securityA && !!securityB && !securityA.state.isStencil && !securityB.state.isStencil) {
          if (valueA == null && valueB == null) {
            return 0;
          } else if (valueA == null && valueB != null) {
            return 16;
          } else if (valueA != null && valueB == null) {
            return -16;
          } else if (qA.state.hasBid && qA.state.hasOffer && (!qB.state.hasBid || !qB.state.hasOffer)) {
            // A has both bid & offer vs B has only bid or only offer
            return -9;
          } else if ((!qA.state.hasBid || !qA.state.hasOffer) && qB.state.hasBid && qB.state.hasOffer) {
            return 9;
          } else if ((qA.state.hasBid || qA.state.hasOffer) && (!qB.state.hasBid && !qB.state.hasOffer)) {
            // A has only bid or only offer vs B has no bid or offer
            return -4;
          } else if ((!qA.state.hasBid && !qA.state.hasOffer) && (qB.state.hasBid || qB.state.hasOffer)) {
            return 4;
          } else if (valueA > valueB) {
            return 1;
          } else if (valueA < valueB) {
            return -1;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      } else {
        valueA = this.utilityService.retrieveAttrFromSecurityBasedOnTableHeader(targetHeader, securityA, true);
        valueB = this.utilityService.retrieveAttrFromSecurityBasedOnTableHeader(targetHeader, securityB, true);
        if (!!securityA && !!securityB && !securityA.state.isStencil && !securityB.state.isStencil) {
          if (valueA == null && valueB != null) {
            return 4;
          } else if (valueA != null && valueB == null) {
            return -4;
          } else if (valueA < valueB) {
            if (targetHeader.data.inversedSortingForText) {
              return -1;
            } else {
              return 1;
            }
          } else if (valueA > valueB) {
            if (targetHeader.data.inversedSortingForText) {
              return 1;
            } else {
              return -1;
            }
          } else {
            return 0;
          }
        } else {
          return 0;
        }
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

  private applySkewToggleToRows(targetHeader: SecurityTableHeaderDTO, isAxe: boolean) {
    const columnIndex = this.tableData.data.headers.indexOf(targetHeader) - 1;
    this.tableData.data.rows.forEach((eachRow) => {
      const targetQuant = eachRow.data.cells[columnIndex].data.quantComparerDTO;
      if (!!targetQuant) {
        if (isAxe) {
          targetQuant.state.axeSkewEnabled = targetHeader.state.isAxeSkewEnabled;
        } else {
          targetQuant.state.totalSkewEnabled = targetHeader.state.istotalSkewEnabled;
        }
      }
    });
  }

  private performChronologicalSortOnQuotes(targetRow: SecurityTableRowDTO) {
    targetRow.data.quotes.sort((quoteA, quoteB) => {
      if (quoteA.data.unixTimestamp < quoteB.data.unixTimestamp) {
        return 1;
      } else if (quoteA.data.unixTimestamp > quoteB.data.unixTimestamp) {
        return -1;
      } else {
        return 0;
      }
    });
  }
}
