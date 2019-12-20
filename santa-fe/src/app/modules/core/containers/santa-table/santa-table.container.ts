  // dependencies
    import {
      Component,
      OnInit,
      OnChanges,
      ViewEncapsulation,
      Input,
      Output,
      EventEmitter
    } from '@angular/core';
    import {
      Observable,
      Subscription,
      of
    } from 'rxjs';
    import {
      tap,
      first,
      delay,
      catchError
    } from 'rxjs/operators';
    import {
      GridApi,
      ColumnApi,
      Column
    } from 'ag-grid-community';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import {
      SecurityDTO,
      SecurityTableDTO,
      SecurityTableRowDTO,
      SecurityTableHeaderDTO
    } from 'FEModels/frontend-models.interface';
    import { QuoteMetricBlock } from 'FEModels/frontend-blocks.interface';
    import { PayloadGetAllQuotes } from 'BEModels/backend-payloads.interface';
    import { ClickedSortQuotesByMetricEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';
    import { SecurityTableMetricStub } from 'FEModels/frontend-stub-models.interface';
    import { SantaTableSecurityCell} from 'Core/components/santa-table-security-cell/santa-table-security-cell.component';
    import { BEQuoteDTO } from 'BEModels/backend-models.interface';
    import {
      SECURITY_TABLE_FINAL_STAGE,
      THIRTY_DAY_DELTA_METRIC_INDEX
    } from 'Core/constants/securityTableConstants.constant';
  //

@Component({
  selector: 'santa-table',
  templateUrl: './santa-table.container.html',
  styleUrls: ['./santa-table.container.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})

export class SantaTable implements OnInit, OnChanges {
  @Input() tableData: SecurityTableDTO;
  @Input() newRows: Array<SecurityTableRowDTO>;
  @Input() receivedContentStage: number;
  securityTableMetrics: Array<SecurityTableMetricStub>;
  @Input() receivedSecurityTableMetricsUpdate: Array<SecurityTableMetricStub>;
  securityTableMetricsCache: Array<SecurityTableMetricStub>;// use this only for detecting diff
  @Input() liveUpdatedRows: Array<SecurityTableRowDTO>;
  @Input() activeTriCoreMetric: string;
  @Output() selectedSecurityForAnalysis = new EventEmitter<SecurityDTO>();
  liveUpdateRowsCache: Array<SecurityTableRowDTO>;

  constants = {
    securityTableFinalStage: SECURITY_TABLE_FINAL_STAGE,
    thirtyDayDeltaIndex: THIRTY_DAY_DELTA_METRIC_INDEX
  }

  agGridRowClassRules = "santaTable__main-agGrid-row";
  defaultColDef = {
    sortable: true,
    filter: true,
    autoWidth: true,
    autoHeight: true
  };

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ) { }

  public ngOnInit() {
  }

  public ngOnChanges() {
    if (this.tableData.state.loadedContentStage !== this.receivedContentStage) {
      console.log('rows updated for inter-stage change', this.receivedContentStage);
      this.securityTableMetricsCache = this.receivedSecurityTableMetricsUpdate; // saving initial cache
      this.securityTableMetrics = this.receivedSecurityTableMetricsUpdate;
      this.tableData.state.loadedContentStage = this.receivedContentStage;
      this.loadTableRows(this.newRows);
    } else if (this.securityTableMetricsCache !== this.receivedSecurityTableMetricsUpdate && this.receivedContentStage === this.constants.securityTableFinalStage) {
      this.securityTableMetricsCache = this.receivedSecurityTableMetricsUpdate;
      this.securityTableMetrics = this.receivedSecurityTableMetricsUpdate;
      this.loadTableHeaders();
      this.loadTableRows(this.newRows);
    } else if (!!this.newRows && this.newRows != this.tableData.data.rows && this.tableData.state.loadedContentStage === this.receivedContentStage) {
      console.log('rows updated for change within same stage, triggered when filters are applied', this.tableData.state.loadedContentStage);
      this.loadTableRows(this.newRows);
    } else if (this.liveUpdateRowsCache !== this.liveUpdatedRows && this.tableData.state.loadedContentStage === this.constants.securityTableFinalStage) {
      this.liveUpdateRowsCache = this.utilityService.deepCopy(this.liveUpdatedRows);
      console.log('rows updated from live update', this.liveUpdatedRows);
      if (this.liveUpdateRowsCache.length > 0) {
        this.liveUpdateRows(this.liveUpdateRowsCache);
      }
      // TODO: enable this
      // this.liveUpdateAllQuotesForExpandedRows();
    }
    // console.log('test, at santa table, received list', this.securityList);
    // if (!!this.securityList && this.securityList.length > 0) {
    //   const list = [];
    //   this.securityList.forEach((eachSecurity) => {
    //     const newRow = {
    //       id: eachSecurity.data.securityID,
    //       securityCard: eachSecurity,
    //       wow: eachSecurity.data.metricPack.delta.Wow['Default Spread'],
    //       mom: eachSecurity.data.metricPack.delta.Mom['Default Spread'],
    //       ytd: eachSecurity.data.metricPack.delta.Ytd['Default Spread']
    //     };
    //     list.push(newRow);
    //   });
    //   this.agGridApi.setRowData(list);
    // }
  }

  public onGridReady(params) {
    this.tableData.api.agGrid.gridApi = params.api;
    this.tableData.data.agGridRowData = [];
    this.tableData.api.agGrid.gridApi = params.api;
    this.tableData.api.agGrid.columnApi = params.columnApi;
    this.tableData.state.isAgGridReady = true;
    this.loadTableHeaders();
  }

  public getRowNodeId(row) {
    console.log('test, data is', row);
    return row.id;
  }

  private loadTableHeaders() {
    this.tableData.data.headers = [];
    this.securityTableMetrics.forEach((eachStub) => {
      if (eachStub.label === 'Security' || eachStub.active) {
        this.tableData.data.headers.push(this.dtoService.formSecurityTableHeaderObject(eachStub));
      }
    });
    this.tableData.state.isAgGridReady && this.loadAgGridHeaders();
  }

  private loadTableRows(rowList: Array<SecurityTableRowDTO>) {
    this.tableData.data.rows = rowList;
    // doesn't need to update dynamic columns if the entire data is not loaded
    this.receivedContentStage === this.constants.securityTableFinalStage && this.updateDynamicColumns();
    if (this.tableData.state.sortedByHeader) {
      this.performSort(this.tableData.state.sortedByHeader);
    } else {
      this.performDefaultSort();
    }
    if (this.tableData.state.isAgGridReady) {
      this.tableData.data.agGridRowData = this.loadAgGridRows(this.tableData.data.rows, this.tableData.data.headers);
    }
  }

  private updateDynamicColumns() {
    /* the dynamic columns are:
      1. QuantComparer
      2. Mark
      3. three mark delta columns
      4. 30 day delta
    */
    this.tableData.data.headers.forEach((eachHeader, index) => {
      if (!eachHeader.state.isPureTextVariant) {
        const cellIndex = index - 1;
        this.tableData.data.rows.forEach((eachRow) => {
          eachRow.data.cells[cellIndex] = this.utilityService.populateSecurityTableCellFromSecurityCard(
            eachHeader,
            eachRow,
            eachRow.data.cells[cellIndex],
            this.activeTriCoreMetric
          );
        });
      }
    });
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

  private liveUpdateRows(targetRows: Array<SecurityTableRowDTO>) {
    targetRows.forEach((eachNewRow) => {
      const matchedOldRow = this.tableData.data.rows.find((eachOldRow) => {
        return eachOldRow.data.security.data.securityID === eachNewRow.data.security.data.securityID;
      });
      if (!!matchedOldRow) {
        matchedOldRow.data = eachNewRow.data;
      } else {
        this.tableData.data.rows.push(eachNewRow);
      }
    });
    this.updateAgGridRows(targetRows);
  }

  private loadAgGridHeaders() {
    const list = [];
    this.tableData.data.headers.forEach((eachHeader) => {
      const newAgColumn = {
        headerName: eachHeader.data.displayLabel,
        field: eachHeader.data.key,
        cellClass: 'santaTable__main-agGrid-cell'
      };
      if (eachHeader.data.key === 'security') {
        newAgColumn.cellClass = 'santaTable__main-agGrid-cell santaTable__main-agGrid-cell--securityCard';
      } else {
        newAgColumn.cellClass = 'santaTable__main-agGrid-cell';
      }
      list.push(newAgColumn);
    })
    this.tableData.data.agGridColumnDefs = list;
    this.tableData.api.agGrid.gridApi.setColumnDefs(list);
  }

  private loadAgGridRows(targetRows: Array<SecurityTableRowDTO>, targetHeaders: Array<SecurityTableHeaderDTO>): Array<any> {
    const list = [];
    targetRows.forEach((eachRow) => {
      const newAgRow = this.formAgGridRow(eachRow, targetHeaders);
      list.push(newAgRow);
    });
    this.tableData.api.agGrid.gridApi.setRowData(list);
    return list;
  }

  private updateAgGridRows(targetRows: Array<SecurityTableRowDTO>) {
    targetRows.forEach((eachRow) => {
      const id = eachRow.data.security.data.securityID;
      const targetNode = this.tableData.api.agGrid.gridApi.getRowNode(id);
      const newAgRow = this.formAgGridRow(eachRow, this.tableData.data.headers);
      targetNode.setData(newAgRow);
    });
  }

  private formAgGridRow(targetRow: SecurityTableRowDTO,targetHeaders: Array<SecurityTableHeaderDTO>): object {
    const eachSecurity = targetRow.data.security;
    const newAgRow = {
      id: eachSecurity.data.securityID
    };
    targetHeaders.forEach((eachHeader, index) => {
      if (eachHeader.data.key === 'security' || index === 0) {
        newAgRow[eachHeader.data.key] = eachSecurity.data.name;
      } else if (eachHeader.state.isQuantVariant) {
        const quantComparer = targetRow.data.cells[0].data.quantComparerDTO;
        if (quantComparer) {
          const mid = quantComparer.data.mid;
          const bid = quantComparer.data.bid.number;
          const ask = quantComparer.data.offer.number;
          newAgRow[eachHeader.data.key] = `${bid} - ${mid} - ${ask}`;
        } else {
          newAgRow[eachHeader.data.key] = 'No Quotes';
        }
      } else {
        newAgRow[eachHeader.data.key] = targetRow.data.cells[index-1].data.textData;
      }
    });
    return newAgRow;
  }
}