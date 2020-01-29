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
    import { ClickedSortQuotesByMetricEmitterParams, AgGridRowParams } from 'FEModels/frontend-adhoc-packages.interface';
    import { SecurityTableMetricStub } from 'FEModels/frontend-stub-models.interface';
    import { SantaTableSecurityCell } from 'Core/components/santa-table-security-cell/santa-table-security-cell.component';
    import { SantaTableQuoteCell } from 'Core/components/santa-table-quote-cell/santa-table-quote-cell.component';
    import { SantaTableDetailAllQuotes } from 'Core/containers/santa-table-detail-all-quotes/santa-table-detail-all-quotes.container';
    import { BEQuoteDTO } from 'BEModels/backend-models.interface';
    import {
      SECURITY_TABLE_FINAL_STAGE,
      THIRTY_DAY_DELTA_METRIC_INDEX,
      AGGRID_ROW_HEIGHT,
      AGGRID_ROW_CLASS,
      AGGRID_DETAIL_COLUMN_KEY,
      AGGRID_DETAIL_ROW_HEIGHT_MAX,
      AGGRID_DETAIL_ROW_HEIGHT_PER_ROW,
      AGGRID_DETAIL_ROW_HEIGHT_OFFSET,
      AGGRID_DETAIL_ROW_HEIGHT_DEFAULT
    } from 'Core/constants/securityTableConstants.constant';
    import { SantaTableNumericFloatingFilter } from 'Core/components/santa-table-numeric-floating-filter/santa-table-numeric-floating-filter.component';
    import { SantaTableNumericFilter } from 'Core/components/santa-table-numeric-filter/santa-table-numeric-filter.component';
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
      sortingOrder: ["desc", "asc", null]
    },
    autoGroupColumnDef: {
      sort:'desc'
    },
    context: {
      componentParent: this
    },
    sideBar: {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        }
      ],
      hiddenByDefault: true
    }
  };

  constants = {
    securityTableFinalStage: SECURITY_TABLE_FINAL_STAGE,
    thirtyDayDeltaIndex: THIRTY_DAY_DELTA_METRIC_INDEX,
    agGridRowHeight: AGGRID_ROW_HEIGHT,
    agGridRowClassRules: AGGRID_ROW_CLASS,
    agGridDetailRowHeightMax: AGGRID_DETAIL_ROW_HEIGHT_MAX,
    agGridDetailRowHeightPerRow: AGGRID_DETAIL_ROW_HEIGHT_PER_ROW,
    agGridDetailRowHeightOffset: AGGRID_DETAIL_ROW_HEIGHT_OFFSET,
    agGridDetailRowHeightDefault: AGGRID_DETAIL_ROW_HEIGHT_DEFAULT
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
      detailAllQuotes: SantaTableDetailAllQuotes,
      numericFloatingFilter: SantaTableNumericFloatingFilter,
      numericFilter: SantaTableNumericFilter
    };
    this.tableData.data.agGridAggregationMap = {
      sum: this.agAggregationSum.bind(this),
      avg: this.agAggregationAverage.bind(this)
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
      console.log("metrics update", this.receivedSecurityTableMetricsUpdate);
      this.securityTableMetricsCache = this.receivedSecurityTableMetricsUpdate;
      this.securityTableMetrics = this.receivedSecurityTableMetricsUpdate;
      this.loadTableHeaders(true);  // skip reloading the agGrid columns since that won't be necessary and reloading them creates a problem for identifying the columns in later use, such as sorting
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
      this.liveUpdateAllQuotesForExpandedRows();
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

  public onRowClicked(params: AgGridRowParams) {
    // this function gets triggered both when parent and child are being clicked, so this if condition is to make sure only execute the logic when it is the parent that is clicked
    if (!!params.node.master) {
      params.node.setExpanded(!params.node.expanded);
      if (!params.node.group) {
        const targetRow = this.tableData.data.rows.find((eachRow) => {
          return !!eachRow.data.security && eachRow.data.security.data.securityID == params.node.data.id;
        });
        if (!!targetRow) {
          try {
            targetRow.state.isExpanded = !targetRow.state.isExpanded;
            if (targetRow.data.security) {
              targetRow.data.security.state.isMultiLineVariant = params.node.expanded;
              this.fetchSecurityQuotes(targetRow, params);
            }
          } catch {
            // ignore, seems AgGrid causes some weird read only error
          }
        } else {
          console.error(`Could't find targetRow`, params);
        }
      }
    }
  }

  public onRowClickedToCollapse(targetRow: SecurityTableRowDTO) {
    try {
      targetRow.state.isExpanded = false;
      if (targetRow.data.security) {
        targetRow.data.security.state.isMultiLineVariant = false;
      }
    } catch {
      console.warn('read only issue', targetRow);
      // ignore, seems AgGrid causes some weird read only error
    }
  }

  public getRowNodeId(row) {
    return row.id;
  }

  public onToggleNativeTable(toggleValue) {
    this.tableData.state.isNativeEnabled = !!toggleValue;
  }

  public onSelectSecurityForAnalysis(targetSecurity: SecurityDTO) {
    this.selectedSecurityForAnalysis.emit(targetSecurity);
  }

  public onNativeTableFetchSecurityQuotes(targetRow: SecurityTableRowDTO){
    this.fetchSecurityQuotes(targetRow);
  }

  public onNativeLoadTableHeader() {
    this.loadTableHeaders(true);
  }

  public onNativePerformSort(targetHeader: SecurityTableHeaderDTO) {
    this.performSort(targetHeader);
  }

  public onNativePerformDefaultSort() {
    this.performDefaultSort();
  }

  public onClickSortQuotesByMetric(payload: ClickedSortQuotesByMetricEmitterParams) {
    payload.targetRow.state.expandViewSortByQuoteMetric = payload.targetRow.state.expandViewSortByQuoteMetric === payload.targetMetricLabel ? null : payload.targetMetricLabel;
  }

  private loadTableHeaders(skipAgGrid = false) {
    this.tableData.data.headers = [];
    this.tableData.data.allHeaders = [];
    this.securityTableMetrics.forEach((eachStub) => {
      if (eachStub.label === 'Security' || eachStub.active) {
        this.tableData.data.headers.push(this.dtoService.formSecurityTableHeaderObject(eachStub));
      }
      this.tableData.data.allHeaders.push(this.dtoService.formSecurityTableHeaderObject(eachStub));
    });
    if (this.tableData.state.isAgGridReady && !skipAgGrid) {
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

  private fetchSecurityQuotes(
    targetRow: SecurityTableRowDTO,
    params?: any  // this is a AgGridRowParams, can't enforce type checking here because agGrid's native function redrawRows() would throw an compliation error
  ){
    if (!!targetRow) {
      let bestBid: number; 
      let bestOffer: number;
      let metricType: string;
      if (!!targetRow.data.cells[0] && !!targetRow.data.cells[0].data.quantComparerDTO) {
        bestBid = targetRow.data.cells[0].data.quantComparerDTO.data.bid.number;
        bestOffer = targetRow.data.cells[0].data.quantComparerDTO.data.offer.number;
        metricType = targetRow.data.cells[0].data.quantComparerDTO.data.metricType;
      } else {
        bestBid = 0;
        bestOffer = 0;
        metricType = '';
      }
      
      targetRow.data.quotes = [];
      const payload: PayloadGetAllQuotes = {
        "identifier": targetRow.data.security.data.securityID
      };
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getAllQuotes, {req: 'POST'}, payload).pipe(
        first(),
        tap((serverReturn) => {
          for (const eachKey in serverReturn) {
            const rawQuote: BEQuoteDTO = serverReturn[eachKey];

            const newQuote = this.dtoService.formSecurityQuoteObject(false, rawQuote, bestBid, bestOffer, metricType);
            if (newQuote.state.hasAsk || newQuote.state.hasBid) {
              targetRow.data.quotes.push(newQuote);
            }
          }
          this.performChronologicalSortOnQuotes(targetRow);
          this.agGridMiddleLayerService.updateAgGridRows(this.tableData, [targetRow]);
          if (!!params && !!params.node && !!params.node.detailNode) {
            let dynamicHeight = this.constants.agGridDetailRowHeightOffset + targetRow.data.quotes.length * this.constants.agGridDetailRowHeightPerRow;
            if (dynamicHeight > this.constants.agGridDetailRowHeightMax) {
              dynamicHeight = this.constants.agGridDetailRowHeightMax;
            }
            params.node.detailNode.rowHeight = dynamicHeight;
            params.api.resetRowHeights();
            params.api.redrawRows({
              rowNodes: [params.node, params.node['detailNode']]
            });
          }
        }),
        catchError(err => {
          console.error('liveQuote/get-all-quotes failed', err);
          return of('error')
        })
      ).subscribe();
    }
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
            if (targetHeader.data.isDataTypeText) {
              return -1;
            } else {
              return 1;
            }
          } else if (valueA > valueB) {
            if (targetHeader.data.isDataTypeText) {
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

  private liveUpdateRows(targetRows: Array<SecurityTableRowDTO>) {
    targetRows.forEach((eachNewRow) => {
      const matchedOldRow = this.tableData.data.rows.find((eachOldRow) => {
        return eachOldRow.data.security.data.securityID === eachNewRow.data.security.data.securityID;
      });
      if (!!matchedOldRow) {
        try {
          matchedOldRow.data = eachNewRow.data;
        }
        catch {
          console.warn('setting row update failure in AGGrid', matchedOldRow.data, eachNewRow.data);
        }
      } else {
        this.tableData.data.rows.push(eachNewRow);
      }
    });
    this.agGridMiddleLayerService.updateAgGridRows(this.tableData, targetRows);
  }

  private liveUpdateAllQuotesForExpandedRows() {
    this.tableData.data.rows.forEach((eachRow) => {
      if (eachRow.state.isExpanded) {
        try {
          this.fetchSecurityQuotes(eachRow);
        } catch {
          console.warn('read only issue at live updating all quotes', eachRow);
          // ignore, seems AgGrid causes some weird read only error
        }
      }
    })
  }

  private agAggregationSum(valueList: Array<number|string>): number {
    if (valueList.length > 0) {
      let aggregatedValue = 0;
      let validCount = 0;
      valueList.forEach((eachValue) => {
        if (!!eachValue) {
          validCount++;
          const numericalValue = parseFloat(eachValue as string);
          aggregatedValue = aggregatedValue + numericalValue;
        }
      })
      if (validCount > 0) {
        return this.utilityService.round(aggregatedValue, 2);
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  private agAggregationAverage(valueList: Array<number|string>): number {
    if (valueList.length > 0) {
      let aggregatedValue = 0;
      let validCount = 0;
      valueList.forEach((eachValue) => {
        if (!!eachValue) {
          validCount++;
          const numericalValue = parseFloat(eachValue as string);
          aggregatedValue = aggregatedValue + numericalValue;
        }
      })
      if (validCount > 0) {
        aggregatedValue = aggregatedValue / valueList.length;
        return this.utilityService.round(aggregatedValue, 2);
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}