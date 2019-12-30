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
    import { AgGridMiddleLayerService } from 'Core/services/AgGridMiddleLayerService';
    import {
      SecurityDTO,
      SecurityTableDTO,
      SecurityTableRowDTO,
      SecurityTableHeaderDTO
    } from 'FEModels/frontend-models.interface';
    import {
      QuoteMetricBlock,
      AgGridRow,
      AgGridColumnDefinition
    } from 'FEModels/frontend-blocks.interface';
    import { PayloadGetAllQuotes } from 'BEModels/backend-payloads.interface';
    import { ClickedSortQuotesByMetricEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';
    import { SecurityTableMetricStub } from 'FEModels/frontend-stub-models.interface';
    import { SantaTableSecurityCell } from 'Core/components/santa-table-security-cell/santa-table-security-cell.component';
    import { SantaTableQuoteCell } from 'Core/components/santa-table-quote-cell/santa-table-quote-cell.component';
    import { SantaTableDetailAllQuotes } from 'Core/components/santa-table-detail-all-quotes/santa-table-detail-all-quotes.component';
    import { BEQuoteDTO } from 'BEModels/backend-models.interface';
    import {
      SECURITY_TABLE_FINAL_STAGE,
      THIRTY_DAY_DELTA_METRIC_INDEX,
      AGGRID_ROW_HEIGHT,
      AGGRID_ROW_CLASS,
      AGGRID_DETAIL_COLUMN_KEY
    } from 'Core/constants/securityTableConstants.constant';
  //

@Component({
  selector: 'santa-table',
  templateUrl: './santa-table.container.html',
  styleUrls: ['./santa-table.container.scss'],
  encapsulation: ViewEncapsulation.None
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

  agGridConfig = {
    defaultColDef: {

    },
    autoGroupColumnDef: {
      sort:'desc'
    }
  };

  constants = {
    securityTableFinalStage: SECURITY_TABLE_FINAL_STAGE,
    thirtyDayDeltaIndex: THIRTY_DAY_DELTA_METRIC_INDEX,
    agGridRowHeight: AGGRID_ROW_HEIGHT,
    agGridRowClassRules: AGGRID_ROW_CLASS
  }

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService,
    private agGridMiddleLayerService: AgGridMiddleLayerService
  ) { }

  public ngOnInit() {
    this.tableData.data.agGridFrameworkComponents = {
      securityCard: SantaTableSecurityCell,
      bestQuote: SantaTableQuoteCell,
      detailAllQuotes: SantaTableDetailAllQuotes
    };
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
  }

  public onGridReady(params) {
    this.tableData.api.gridApi = params.api;
    this.tableData.data.agGridRowData = [];
    this.tableData.api.gridApi = params.api;
    this.tableData.api.columnApi = params.columnApi;
    this.tableData.state.isAgGridReady = true;
    this.agGridMiddleLayerService.onGridReady(this.tableData);
    this.loadTableHeaders();
  }

  public onRowClicked(params) {
    params.node.setExpanded(!params.node.expanded);
  }

  public getRowNodeId(row) {
    return row.id;
  }

  private loadTableHeaders() {
    this.tableData.data.headers = [];
    this.securityTableMetrics.forEach((eachStub) => {
      if (eachStub.label === 'Security' || eachStub.active) {
        this.tableData.data.headers.push(this.dtoService.formSecurityTableHeaderObject(eachStub));
      }
      this.tableData.data.allHeaders.push(this.dtoService.formSecurityTableHeaderObject(eachStub));
    });
    if (this.tableData.state.isAgGridReady) {
      this.tableData.data.agGridColumnDefs = this.agGridMiddleLayerService.loadAgGridHeaders(this.tableData);
    }
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
      this.tableData.data.agGridRowData = this.agGridMiddleLayerService.loadAgGridRows(this.tableData);
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
    this.agGridMiddleLayerService.updateAgGridRows(this.tableData, targetRows);
  }
}