  // dependencies
    import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
    import { of } from 'rxjs';
    import { catchError, first, tap } from 'rxjs/operators';
    import * as moment from 'moment';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { AgGridMiddleLayerService } from 'Core/services/AgGridMiddleLayerService';
    import {
      SecurityDTO,
      SecurityQuoteDTO,
      SecurityTableDTO,
      SecurityTableHeaderDTO,
      SecurityTableRowDTO
    } from 'FEModels/frontend-models.interface';
    import { PayloadGetAllQuotes } from 'BEModels/backend-payloads.interface';
    import { AgGridRowParams, ClickedSortQuotesByMetricEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';
    import { SecurityTableHeaderConfigStub } from 'FEModels/frontend-stub-models.interface';
    import { SantaTableSecurityCell } from 'Core/components/santa-table-security-cell/santa-table-security-cell.component';
    import { SantaTableQuoteCell } from 'Core/components/santa-table-quote-cell/santa-table-quote-cell.component';
    import { SantaTableAlertSideCell } from 'Core/components/santa-table-alert-side-cell/santa-table-alert-side-cell.component';
    import { SantaTableDetailAllQuotes } from 'Core/containers/santa-table-detail-all-quotes/santa-table-detail-all-quotes.container';
    import { BEQuoteDTO } from 'BEModels/backend-models.interface';
    import {
      AGGRID_DETAIL_ROW_DEFAULT_COUNT,
      AGGRID_DETAIL_ROW_HEIGHT_MINIMUM,
      AGGRID_DETAIL_ROW_HEIGHT_MAX,
      AGGRID_DETAIL_ROW_HEIGHT_OFFSET,
      AGGRID_DETAIL_ROW_HEIGHT_OFFSET_OFFTHERUNCDS,
      AGGRID_DETAIL_ROW_HEIGHT_PER_ROW,
      AGGRID_ROW_HEIGHT,
      AGGRID_ROW_HEIGHT_SLIM,
      SECURITY_TABLE_FINAL_STAGE,
      SECURITY_TABLE_ICONS
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
  @Input() ownerInitial: string;
  @Input() activePortfolios: Array<string>;  // TODO: at the moment this variable is really just "filtered portfolios", so a value of empty string means include every portfolio, this will be changed once we start support entire security universe
  @Input() tableName: string;
  @Input() tableData: SecurityTableDTO;
  @Input() newRows: Array<SecurityTableRowDTO>;
  @Input() receivedContentStage: number;
  public securityTableHeaderConfigs: Array<SecurityTableHeaderConfigStub>;
  @Input() receivedSecurityTableHeaderConfigsUpdate: Array<SecurityTableHeaderConfigStub>;
  private securityTableHeaderConfigsCache: Array<SecurityTableHeaderConfigStub>;// use this only for detecting diff
  @Input() liveUpdatedRows: Array<SecurityTableRowDTO>;
  @Input() removeRows: Array<string>;
  private removeRowsCache: Array<string> = [];
  @Input() activeTriCoreDriver: string;
  @Output() selectedSecurityForAnalysis = new EventEmitter<SecurityDTO>();
  private liveUpdateRowsCache: Array<SecurityTableRowDTO>;
  @Input() activated: boolean;

  agGridConfig = {
    defaultColDef: {
      sortingOrder: ["desc", "asc"],
      sortable: true
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
    agGridRowHeight: AGGRID_ROW_HEIGHT,
    agGridRowClassRules: {
      'santaTable__agGridTable-agGrid-row': "true",
      'santaTable__agGridTable-agGrid-row--cardSelected': function (params: AgGridRowParams) {
        return !!params && !!params.data && params.data.securityCard && params.data.securityCard.state.isSelected;
      }
    },
    agGridDetailRowHeightMax: AGGRID_DETAIL_ROW_HEIGHT_MAX,
    agGridDetailRowHeightPerRow: AGGRID_DETAIL_ROW_HEIGHT_PER_ROW,
    agGridDetailRowHeightOffset: AGGRID_DETAIL_ROW_HEIGHT_OFFSET,
    agGridDetailRowHeightMinimum: AGGRID_DETAIL_ROW_HEIGHT_MINIMUM,
    agGridDetailRowDefaultCount: AGGRID_DETAIL_ROW_DEFAULT_COUNT,
    agGridDetailRowHeightOffsetOffTheRunCDS: AGGRID_DETAIL_ROW_HEIGHT_OFFSET_OFFTHERUNCDS
  };

  icons = SECURITY_TABLE_ICONS;

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
      bestAxeQuote: SantaTableQuoteCell,
      alertSide: SantaTableAlertSideCell,
      detailAllQuotes: SantaTableDetailAllQuotes,
      numericFloatingFilter: SantaTableNumericFloatingFilter,
      numericFilter: SantaTableNumericFilter
    };
    this.tableData.data.agGridAggregationMap = {
      sum: this.agAggregationSum.bind(this),
      avg: this.agAggregationAverage.bind(this)
    };
    if (this.tableData.state.isSlimRowVariant) {
      this.constants.agGridRowHeight = AGGRID_ROW_HEIGHT_SLIM;
    }
  }

  public ngOnChanges() {
    let activateStatusChanged = false;
    if (!!this.activated && !this.tableData.state.isActivated) {
      this.tableData.state.isActivated = true;
      activateStatusChanged = true;
    } else if (!this.activated && !!this.tableData.state.isActivated){
      this.tableData.state.isActivated = false;
      activateStatusChanged = true;
    }
    if (!!this.tableData.state.isActivated) {
      if (!!activateStatusChanged) {
        console.log(`[${this.tableName}] - just become activated`);
        this.loadTableRows(this.newRows);
        this.tableData.state.loadedContentStage = this.receivedContentStage;
      } else if (this.tableData.state.loadedContentStage !== this.receivedContentStage) {
        console.log(`[${this.tableName}] - rows updated for inter-stage change`, this.receivedContentStage);
        this.securityTableHeaderConfigsCache = this.receivedSecurityTableHeaderConfigsUpdate; // saving initial cache
        this.securityTableHeaderConfigs = this.receivedSecurityTableHeaderConfigsUpdate;
        this.tableData.state.loadedContentStage = this.receivedContentStage;
        this.loadTableRows(this.newRows);
      } else if (this.securityTableHeaderConfigsCache !== this.receivedSecurityTableHeaderConfigsUpdate && this.receivedContentStage === this.constants.securityTableFinalStage) {
        console.log(`[${this.tableName}] - metrics update`, this.receivedSecurityTableHeaderConfigsUpdate);
        this.securityTableHeaderConfigsCache = this.receivedSecurityTableHeaderConfigsUpdate;
        this.securityTableHeaderConfigs = this.receivedSecurityTableHeaderConfigsUpdate;
        this.loadTableHeaders(true);  // skip reloading the agGrid columns since that won't be necessary and reloading them creates a problem for identifying the columns in later use, such as sorting
        this.loadTableRows(this.newRows, true);
      } else if (!!this.newRows && this.newRows != this.tableData.data.rows && this.tableData.state.loadedContentStage === this.receivedContentStage && JSON.stringify(this.removeRows) == JSON.stringify(this.removeRowsCache)) {  // the reason for checking removeRowsCache diffing is if they are different, then the newRows diffing is caused by a removal update, in that case bypass this condition since the removal is handled in the bit code below
        console.log(`[${this.tableName}] - rows updated for change within same stage, triggered when filters are applied`, this.tableData.state.loadedContentStage);
        this.loadTableRows(this.newRows);
      } else if (this.liveUpdateRowsCache !== this.liveUpdatedRows && this.tableData.state.loadedContentStage === this.constants.securityTableFinalStage) {
        this.liveUpdateRowsCache = this.utilityService.deepCopy(this.liveUpdatedRows);
        console.log(`[${this.tableName}] - rows updated from live update`, this.liveUpdatedRows);
        if (this.liveUpdateRowsCache.length > 0) {
          this.liveUpdateRows(this.liveUpdateRowsCache);
        }
        this.liveUpdateAllQuotesForExpandedRows();
      }
      // removal can happen in parallel to other input changes
      if (this.removeRows.length > 0 && JSON.stringify(this.removeRows) != JSON.stringify(this.removeRowsCache)) {
        // the prinstine rows are updated with the removal, so the rows in the tableDTO needs to be updated to the newRows so it won't trigger "filter applied" condition in the bit code above
        this.tableData.data.rows = this.newRows;
        this.removeRowsCache = this.utilityService.deepCopy(this.removeRows);
        this.removeTableRows();
      }
    }
  }

  public onGridReady(params) {
    this.tableData.api.gridApi = params.api;
    this.tableData.data.agGridRowData = [];
    this.tableData.api.gridApi = params.api;
    this.tableData.api.columnApi = params.columnApi;
    this.tableData.state.isAgGridReady = true;
    this.agGridMiddleLayerService.onGridReady(this.tableData, this.ownerInitial);
    this.securityTableHeaderConfigsCache = this.receivedSecurityTableHeaderConfigsUpdate; // saving initial cache
    this.securityTableHeaderConfigs = this.receivedSecurityTableHeaderConfigsUpdate;
    this.loadTableHeaders();
  }

  public onRowClicked(params: AgGridRowParams) {
    if (!!params && !!params.data && !!params.data.securityCard) {
      // this if checks whether the user is clicking on the entire row, or clicking on the security card
      const targetCard = params.data.securityCard;
      if (!!params.node) {
        params.data.securityCard.state.isAtListCeiling = !!params.node.firstChild;
      }
      const storedSelectedCard = this.tableData.state.selectedSecurityCard;
      // console.log('test, clicked on row', targetCard.state.isSelected, storedSelectedCard, storedSelectedCard && storedSelectedCard.data.securityID === targetCard.data.securityID);
      // IMPORTANT: If this logic ever needs to be modified, please test all scenarios on Daniel's notebook's page 10
      if (
        (!targetCard.state.isSelected && !storedSelectedCard) ||
        (targetCard.state.isSelected && storedSelectedCard && storedSelectedCard.data.securityID === targetCard.data.securityID) ||
        (!targetCard.state.isSelected && storedSelectedCard && storedSelectedCard.data.securityID !== targetCard.data.securityID)
      ) {
        // this function gets triggered both when parent and child are being clicked, so this if condition is to make sure only execute the logic when it is the parent that is clicked
        targetCard.state.isSelected = false;
        if (!!storedSelectedCard) {
          if (storedSelectedCard.data.securityID !== targetCard.data.securityID) {
            // if the card selected is in a diff row, that row also needs to be updated through AgGrid's life cycle
            storedSelectedCard.state.isSelected = false;
            this.updateRowSecurityCardInAgGrid(storedSelectedCard);
          }
          this.tableData.state.selectedSecurityCard = null;
        }
        if (!!params.node.master && this.tableName !== 'tradeAlert') {
          params.node.setExpanded(!params.node.expanded);
          if (!params.node.group) {
            const targetRow = this.tableData.data.rows.find((eachRow) => {
              return eachRow.data.rowId == params.node.data.id;
            });
            if (!!targetRow) {
              try {
                targetRow.state.isExpanded = !targetRow.state.isExpanded;
                // just set it to false for now, since the fetch will update it to true anyways
                targetRow.state.quotesLoaded = false;
                if (targetRow.data.security) {
                  // targetRow.data.security.state.isMultiLineVariant = params.node.expanded;
                  if (targetRow.state.isExpanded) {
                    this.fetchSecurityQuotes(targetRow, params);
                  } else {
                    targetRow.state.presentingAllQuotes = false;
                  }
                }
              } catch {
                // ignore, seems AgGrid causes some weird read only error
              }
            } else {
              this.restfulCommService.logError(`[Santa Table] Could't find targetRow - ${params}`);
              console.error(`Could't find targetRow`, params);
            }
          }
        }
      } else {
        // gets to here if the user clicked on the security card
        if (storedSelectedCard === null) {
          this.tableData.state.selectedSecurityCard = targetCard;
        } else if (!!storedSelectedCard && storedSelectedCard.data.securityID !== targetCard.data.securityID) {
          // scenario: there is already a card selected, and the user is selecting a diff card
          this.tableData.state.selectedSecurityCard.state.isSelected = false;
          this.updateRowSecurityCardInAgGrid(this.tableData.state.selectedSecurityCard);
          this.tableData.state.selectedSecurityCard = targetCard;
        } else if (!!storedSelectedCard && storedSelectedCard.data.securityID === targetCard.data.securityID) {
          // scenario: there is already a card selected, and it is the same card user is selecting again
          this.tableData.state.selectedSecurityCard = null;
        }
        params.node.setData(params.data);  // need this to trigger a refresh so the row can adopt new classname from the agGridRowClassRules
      }
    } else if (!!params && !!params.node && !!params.node.group){
      params.node.setExpanded(!params.node.expanded);
    } else {
      console.warn('AgGrid data issue, if you see this call Daniel');
    }
  }

  public onRowClickedToCollapse(targetRow: SecurityTableRowDTO) {
    try {
      targetRow.state.isExpanded = false;
      // if (targetRow.data.security) {
        // targetRow.data.security.state.isMultiLineVariant = false;
      // }
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
    this.securityTableHeaderConfigs.forEach((eachStub) => {
      const targetSpecifics = eachStub.content.tableSpecifics[this.tableName] || eachStub.content.tableSpecifics.default;
      if (eachStub.content.isForSecurityCard || targetSpecifics.active) {
        this.tableData.data.headers.push(
          this.dtoService.formSecurityTableHeaderObject(
            eachStub,
            this.tableName,
            this.activePortfolios
          )
        );
      }
      this.tableData.data.allHeaders.push(
        this.dtoService.formSecurityTableHeaderObject(
          eachStub,
          this.tableName,
          this.activePortfolios
        )
      );
    });
    if (this.tableData.state.isAgGridReady && !skipAgGrid) {
      this.tableData.data.agGridColumnDefs = this.agGridMiddleLayerService.loadAgGridHeaders(this.tableData);
    }
  }

  private loadTableRows(
    rowList: Array<SecurityTableRowDTO>,
    isUpdate: boolean = false
  ) {
    this.tableData.data.rows = rowList;
    // doesn't need to update dynamic columns if the entire data is not loaded
    this.receivedContentStage === this.constants.securityTableFinalStage && this.updateDriverDependentColumns();
    if (this.tableData.state.sortedByHeader) {
      this.performSort(this.tableData.state.sortedByHeader);
    } else {
      this.performDefaultSort();
    }
    if (this.tableData.state.isAgGridReady) {
      if (isUpdate) {
        this.agGridMiddleLayerService.updateAgGridRows(this.tableData, this.tableData.data.rows, 1);
        this.liveUpdateAllQuotesForExpandedRows();
      } else {
        this.tableData.data.agGridRowData = this.agGridMiddleLayerService.loadAgGridRows(this.tableData);
      }
    }
  }

  private updateDriverDependentColumns() {
    // the metric dependent columns are the ones affected by driver/metric change:
    this.tableData.data.headers.forEach((eachHeader, index) => {
      if (!!eachHeader.data.isDriverDependent) {
        const cellIndex = index - 1;
        this.tableData.data.rows.forEach((eachRow) => {
          eachRow.data.cells[cellIndex] = this.utilityService.populateSecurityTableCellFromSecurityCard(
            eachHeader,
            eachRow,
            eachRow.data.cells[cellIndex],
            this.activeTriCoreDriver
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
      targetRow.data.quotes = this.dtoService.formSecurityTableRowObject(targetRow.data.security ,targetRow.data.alert, targetRow.data.rowId).data.quotes;
      const payload: PayloadGetAllQuotes = {
        "identifier": targetRow.data.security.data.securityID
      };
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getAllQuotes, {req: 'POST'}, payload).pipe(
        first(),
        tap((serverReturn: Array<Array<BEQuoteDTO>>) => {
          if (!!serverReturn && serverReturn.length > 0) {
            this.loadQuotes(
              targetRow,
              serverReturn,
              params
            );
          } else {
            this.loadQuotes(
              targetRow,
              [],
              params
            );
          }
        }),
        catchError(err => {
          console.error('quote/get-all-quotes failed', err);
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

  private performChronologicalSortOnQuotes(targetQuoteList: Array<SecurityQuoteDTO>) {
    targetQuoteList.sort((quoteA, quoteB) => {
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
    // realUpdates contains the rows that already exist in the table, those needs to be updated via the agGridAPI, the others are simply pushed into the table
    const realUpdates: Array<SecurityTableRowDTO> = [];
    const insertions: Array<SecurityTableRowDTO> = [];
    targetRows.forEach((eachNewRow) => {
      const matchedOldRow = this.tableData.data.rows.find((eachOldRow) => {
        return eachOldRow.data.rowId === eachNewRow.data.rowId;
      });
      if (!!matchedOldRow) {
        realUpdates.push(eachNewRow);
        try {
          matchedOldRow.data = eachNewRow.data;
        }
        catch {
          console.warn('setting row update failure in AGGrid', matchedOldRow.data, eachNewRow.data);
        }
      } else {
        insertions.push(eachNewRow);
        this.tableData.data.rows.push(eachNewRow);
      }
    });
    if (insertions.length > 0) {
      this.agGridMiddleLayerService.loadAgGridRows(this.tableData);
      setTimeout(function(){this.agGridMiddleLayerService.updateAgGridRows(this.tableData, realUpdates, 2)}.bind(this), 1000);
    } else {
      this.agGridMiddleLayerService.updateAgGridRows(this.tableData, realUpdates, 2);
    }
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

  private updateRowSecurityCardInAgGrid(targetCard: SecurityDTO) {
    const targetRow = this.tableData.data.rows.find((eachRow) => {
      return eachRow.data.security && eachRow.data.security.data.securityID === targetCard.data.securityID;
    })
    if (!!targetRow) {
      this.agGridMiddleLayerService.updateAgGridRows(this.tableData, [targetRow], 3);
    }
  }

  private loadQuotes(
    targetRow: SecurityTableRowDTO,
    serverReturn: Array<Array<BEQuoteDTO>>,
    params: any  // this is a AgGridRowParams, can't enforce type checking here because agGrid's native function redrawRows() would throw an compliation error
  ) {
    targetRow.state.quotesLoaded = true;
    const primaryQuoteDTOList: Array<SecurityQuoteDTO> = [];
    const secondaryQuoteDTOList: Array<SecurityQuoteDTO> = [];
    if (serverReturn.length > 0) {
      const primaryRawList = serverReturn[0];
      targetRow.state.isCDSOffTheRun = serverReturn.length > 1;
      primaryRawList.forEach((eachRawQuote) => {
        const newQuote = this.dtoService.formSecurityQuoteObject(false, eachRawQuote, targetRow.data.security, targetRow);
        newQuote.state.isCDSVariant = targetRow.state.isCDSVariant;
        if (newQuote.state.hasAsk || newQuote.state.hasBid) {
          primaryQuoteDTOList.push(newQuote);
        }
      });
      if (targetRow.state.isCDSOffTheRun) {
        const secondaryRawList = serverReturn[1];
        secondaryRawList.forEach((eachRawQuote) => {
          const newQuote = this.dtoService.formSecurityQuoteObject(false, eachRawQuote, targetRow.data.security, targetRow);
          newQuote.state.isCDSVariant = targetRow.state.isCDSVariant;
          if (newQuote.state.hasAsk || newQuote.state.hasBid) {
            secondaryQuoteDTOList.push(newQuote);
          }
        });
        targetRow.data.quotes.primarySecurityName = primaryRawList.length > 0 ? primaryRawList[0].name : '';
        targetRow.data.quotes.secondarySecurityName = secondaryRawList.length > 0 ? secondaryRawList[0].name : '';
      }
    }
    targetRow.data.quotes.primaryQuotes = this.decoupleIncorrectDoubleSidedQuotes(primaryQuoteDTOList);
    targetRow.data.quotes.secondaryQuotes = this.decoupleIncorrectDoubleSidedQuotes(secondaryQuoteDTOList);
    this.performChronologicalSortOnQuotes(targetRow.data.quotes.primaryQuotes);
    this.performChronologicalSortOnQuotes(targetRow.data.quotes.secondaryQuotes);
    targetRow.data.quotes.primaryPresentQuotes = this.utilityService.deepCopy(targetRow.data.quotes.primaryQuotes);
    targetRow.data.quotes.secondaryPresentQuotes = this.utilityService.deepCopy(targetRow.data.quotes.secondaryQuotes);
    if (!targetRow.state.presentingAllQuotes) {
      targetRow.data.quotes.primaryPresentQuotes = targetRow.data.quotes.primaryPresentQuotes.slice(0, this.constants.agGridDetailRowDefaultCount);
      targetRow.data.quotes.secondaryPresentQuotes = targetRow.data.quotes.secondaryPresentQuotes.slice(0, this.constants.agGridDetailRowDefaultCount);
    }
    this.agGridMiddleLayerService.updateAgGridRows(this.tableData, [targetRow], 4);
    if (!!params && !!params.node && !!params.node.detailNode) {
      const longestList = targetRow.data.quotes.primaryQuotes.length < targetRow.data.quotes.secondaryQuotes.length ? targetRow.data.quotes.secondaryQuotes : targetRow.data.quotes.primaryQuotes;
      let dynamicHeight = longestList.length * this.constants.agGridDetailRowHeightPerRow;
      if (targetRow.state.isCDSOffTheRun) {
        dynamicHeight = dynamicHeight + this.constants.agGridDetailRowHeightOffsetOffTheRunCDS;
      } else {
        dynamicHeight = dynamicHeight + this.constants.agGridDetailRowHeightOffset;
      }
      if (dynamicHeight > this.constants.agGridDetailRowHeightMax) {
        dynamicHeight = this.constants.agGridDetailRowHeightMax;
      }
      if (dynamicHeight < this.constants.agGridDetailRowHeightMinimum) {
        dynamicHeight = this.constants.agGridDetailRowHeightMinimum;
      }
      params.node.detailNode.rowHeight = dynamicHeight;
      params.api.resetRowHeights();
      params.api.redrawRows({
        rowNodes: [params.node, params.node['detailNode']]
      });
    }
  }

  private removeTableRows() {
    this.agGridMiddleLayerService.removeAgGridRow(this.tableData, this.removeRowsCache);
  }

  private decoupleIncorrectDoubleSidedQuotes(quoteList: Array<SecurityQuoteDTO>): Array<SecurityQuoteDTO> {
    const newQuoteList: Array<SecurityQuoteDTO> = [];
    quoteList.forEach((eachQuote) => {
      // check if it is double-sided
      if (eachQuote.state.hasAsk && eachQuote.state.hasBid) {
        // check if it is incorrect (> 5min apart)
        const askTime = moment(eachQuote.data.ask.rawTime);
        const bidTime = moment(eachQuote.data.bid.rawTime);
        if (Math.abs(askTime.diff(bidTime, 'minutes')) >= 5) {
          // create new single-sided quotes
          const newBidQuote: SecurityQuoteDTO = this.utilityService.deepCopy(eachQuote);
          const newAskQuote: SecurityQuoteDTO = this.utilityService.deepCopy(eachQuote);
          newBidQuote.state.hasAsk = false;
          newBidQuote.data.unixTimestamp = bidTime.unix();
          newAskQuote.state.hasBid = false;
          newAskQuote.data.unixTimestamp = askTime.unix();
          newQuoteList.push(newBidQuote);
          newQuoteList.push(newAskQuote);
        } else {
          newQuoteList.push(eachQuote);
        }
      } else {
        newQuoteList.push(eachQuote);
      }
    });
    return newQuoteList;
  }
}
