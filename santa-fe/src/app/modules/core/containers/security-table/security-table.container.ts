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
    this.utilityService.round(23, 213);
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
    targetRow.data.security.state.isTableExpanded = false;
  }

  public onClickRowTableCanvas(targetRow: SecurityTableRowDTO) {
    if (this.tableData.state.loadedContentStage === SECURITY_TABLE_FINAL_STAGE) {
      targetRow.state.isExpanded = !targetRow.state.isExpanded;
      targetRow.data.security.state.isTableExpanded = targetRow.state.isExpanded;
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
          const newQuote = this.dtoService.formSecurityQuoteObject(false, rawQuote);
          if (newQuote.state.hasAsk || newQuote.state.hasBid) {
            targetRow.data.quotes.push(newQuote);
          }
        }
      }),
      catchError(err => {
        console.error('liveQuote/get-all-quotes failed', err);
        return of('error')
      })
    ).subscribe();
  }

  private renderStencilQuotes(targetRow: SecurityTableRowDTO){
    const stencilQuote = this.dtoService.formSecurityQuoteObject(true, null);
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
        valueA = targetHeader.data.isPartOfMetricPack ? this.utilityService.retrieveSecurityMetricFromMetricPack(securityA, targetHeader) : securityA.data[targetHeader.data.underlineAttrName];
        valueB = targetHeader.data.isPartOfMetricPack ? this.utilityService.retrieveSecurityMetricFromMetricPack(securityB, targetHeader) : securityB.data[targetHeader.data.underlineAttrName];
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

}
