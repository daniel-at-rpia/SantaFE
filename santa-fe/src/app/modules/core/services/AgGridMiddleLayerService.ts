  // dependencies
    import { Injectable } from '@angular/core';
    import {
      GridApi,
      ColumnApi,
      Column
    } from 'ag-grid-community';

    import { UtilityService } from './UtilityService';
    import { DTOService } from './DTOService';
    import { RestfulCommService } from './RestfulCommService';
    import {
      SecurityDTO,
      SecurityTableDTO,
      SecurityTableRowDTO,
      SecurityTableHeaderDTO,
      QuantComparerDTO
    } from 'FEModels/frontend-models.interface';
    import {
      AgGridRowNode,
      AgGridRow,
      AgGridColumnDefinition,
      AgGridColumn
    } from 'FEModels/frontend-blocks.interface';
    import {
      SecurityTableMetrics,
      AGGRID_SECURITY_CARD_COLUMN_WIDTH,
      AGGRID_QUOTE_COLUMN_WIDTH,
      AGGRID_SIMPLE_NUM_COLUMN_WIDTH,
      AGGRID_HEADER_CLASS,
      AGGRID_CELL_CLASS,
      AGGRID_DETAIL_COLUMN_KEY,
      AGGRID_DETAIL_COLUMN_WIDTH,
      AGGRID_SIMPLE_TEXT_COLUMN_WIDTH,
      SecurityTableMetricGroups,
      SECURITY_TABLE_HEADER_NO_GROUP
    } from 'Core/constants/securityTableConstants.constant';
  //

@Injectable()
export class AgGridMiddleLayerService {
  ownerInitial: string;

  constructor(
    private utilityService: UtilityService,
    private dtoService: DTOService,
    private restfulCommService: RestfulCommService
  ){}

  public onGridReady(table: SecurityTableDTO, ownerInitial: string) {
    this.ownerInitial = ownerInitial;
  }

  public loadAgGridHeaders(
    table: SecurityTableDTO
  ): Array<AgGridColumnDefinition> {
    const list = [];
    const groupList = [];
    // the detail column is for triggering the All Quotes table
    const detailColumn: AgGridColumnDefinition = {
      headerName: AGGRID_DETAIL_COLUMN_KEY,
      field: AGGRID_DETAIL_COLUMN_KEY,
      headerClass: `${AGGRID_HEADER_CLASS} ${AGGRID_HEADER_CLASS}--detail ag-numeric-header`,
      cellClass: `${AGGRID_CELL_CLASS} ${AGGRID_CELL_CLASS}--detailCTA`,
      cellRenderer: 'agGroupCellRenderer',
      enableValue: false,
      sortable: false,
      filter: null,
      pinned: false,
      enablePivot: false,
      enableRowGroup: false,
      hide: true,
      width: AGGRID_DETAIL_COLUMN_WIDTH
    };
    list.push(detailColumn);
    for (const eachGroupKey in SecurityTableMetricGroups) {
      // we are treating the groups as definitions as well for the sake of simplicity, since agGrid allows that
      const eachGroup: AgGridColumnDefinition = {
        headerName: SecurityTableMetricGroups[eachGroupKey],
        field: eachGroupKey,
        headerClass: `${AGGRID_HEADER_CLASS} ${AGGRID_HEADER_CLASS}--${eachGroupKey}`,
        cellClass: `${AGGRID_CELL_CLASS}`,
        enableValue: false,
        hide: false,
        enableRowGroup: false,
        enablePivot: false,
        children: []
      };
      groupList.push(eachGroup);
    }
    table.data.allHeaders.forEach((eachHeader) => {
      const isActiveByDefault = table.data.headers.find((eachActiveHeader) => {
        return eachActiveHeader.data.key === eachHeader.data.key;
      })
      let groupName = SECURITY_TABLE_HEADER_NO_GROUP;
      for (const eachGroupKey in SecurityTableMetricGroups) {
        if (SecurityTableMetricGroups[eachGroupKey] === eachHeader.data.groupBelongs) {
          groupName = eachGroupKey;
        }
      }
      const newAgColumn: AgGridColumnDefinition = {
        headerName: eachHeader.data.displayLabel,
        field: eachHeader.data.key,
        headerClass: `${AGGRID_HEADER_CLASS} ${AGGRID_HEADER_CLASS}--${groupName}`,
        cellClass: `${AGGRID_CELL_CLASS}`,
        enableValue: false,
        sortable: true,
        filter: null,
        pinned: eachHeader.data.pinned || false,
        enablePivot: false,
        enableRowGroup: false,
        hide: !isActiveByDefault
      };
      if (eachHeader.data.key === 'alertTime') {
        newAgColumn['sort'] = 'asc';
      }
      this.loadAgGridHeadersComparator(eachHeader, newAgColumn);
      this.loadAgGridHeadersUILogics(eachHeader, newAgColumn);
      if (eachHeader.data.groupBelongs !== SECURITY_TABLE_HEADER_NO_GROUP) {
        const targetGroup = groupList.find((eachGroup) => {
          return eachGroup.headerName === eachHeader.data.groupBelongs;
        });
        if(!!targetGroup) {
          // open means only show it only when the group is opened, close means show it only when the group is closed
          newAgColumn.columnGroupShow = eachHeader.data.groupShow ? 'all' : 'open';
          targetGroup.children.push(newAgColumn);
          const alreadyInList = list.findIndex((eachDefinition) => {
            return eachDefinition.field === targetGroup.field;
          });
          if (alreadyInList < 0) {
            list.push(targetGroup);
          }
        }
      } else {
        list.push(newAgColumn);
      }
    });
    table.api.gridApi.setColumnDefs(list);
    return list;
  }

  public loadAgGridRows(
    table: SecurityTableDTO
  ): Array<AgGridRow> {
    const targetRows = table.data.rows;
    const targetHeaders = table.data.allHeaders;
    // minus one because securityCard is not one of the cells ( TODO: this is a bad design, what if a table has more than one security card column? should not treat it different from other columns )
    const bestQuoteCellIndex = targetHeaders.findIndex((eachHeader) => {
      return eachHeader.data.key === 'bestQuote';
    }) - 1;
    const bestAxeQuoteCellIndex = targetHeaders.findIndex((eachHeader) =>{
      return eachHeader.data.key === 'bestAxeQuote';
    }) - 1;
    const list = [];
    targetRows.forEach((eachRow, index) => {
      if (index === 0) {
        eachRow.data.security.state.isAtListCeiling = true;
      } else {
        eachRow.data.security.state.isAtListCeiling = false;
      }
      const newAgRow = this.formAgGridRow(
        eachRow,
        targetHeaders,
        bestQuoteCellIndex,
        bestAxeQuoteCellIndex
      );
      !!newAgRow.id && list.push(newAgRow);
    });
    table.api.gridApi.setRowData(list);
    // this.resizeAllAutoSizeColumns(table);
    return list;
  }

  public updateAgGridRows(
    table: SecurityTableDTO,
    targetRows: Array<SecurityTableRowDTO>,
    location: number  // this is needed only for logging purpose
  ) {
    // minus one because securityCard is not one of the cells ( TODO: this is a bad design, what if a table has more than one security card column? should not treat it different from other columns )
    const bestQuoteCellIndex = table.data.allHeaders.findIndex((eachHeader) => {
      return eachHeader.data.key === 'bestQuote';
    }) - 1;
    const bestAxeQuoteCellIndex = table.data.allHeaders.findIndex((eachHeader) =>{
      return eachHeader.data.key === 'bestAxeQuote';
    }) - 1;
    targetRows.forEach((eachRow) => {
      const id = eachRow.data.rowId;
      const targetNode = table.api.gridApi.getRowNode(id);
      if (!!targetNode) {
        const newAgRow = this.formAgGridRow(
          eachRow,
          table.data.allHeaders,
          bestQuoteCellIndex,
          bestAxeQuoteCellIndex
        );
        targetNode.setData(newAgRow);
      } else {
        this.restfulCommService.logError(`[AgGrid] Couldn't fine AgGrid Row for ${eachRow.data.rowId} (location - ${location})`);
        console.error(`Couldn't fine AgGrid Row for ${eachRow.data.rowId}`, eachRow);
      }
    });
  }

  private loadAgGridHeadersComparator(
    targetHeader: SecurityTableHeaderDTO,
    newAgColumn: AgGridColumnDefinition
  ) {
    if (targetHeader.data.key === 'securityCard') {
      newAgColumn.comparator = this.agCompareSecurities.bind(this);
    } else if (targetHeader.state.isQuantVariant) {
      newAgColumn.comparator = this.agCompareQuantComparer.bind(this);
    } else if (targetHeader.data.underlineAttrName && targetHeader.data.attrName != targetHeader.data.underlineAttrName) {
      newAgColumn.comparator = this.agCompareUnderlineValue.bind(this)
    }
  }

  private loadAgGridHeadersUILogics(
    targetHeader: SecurityTableHeaderDTO,
    newAgColumn: AgGridColumnDefinition
  ) {
    if (targetHeader.data.key === 'securityCard') {
      newAgColumn.cellClass = `${AGGRID_CELL_CLASS} ${AGGRID_CELL_CLASS}--securityCard`;
      newAgColumn.cellRenderer = targetHeader.data.key;
      newAgColumn.width = AGGRID_SECURITY_CARD_COLUMN_WIDTH;
    } else if (!!targetHeader.state.isQuantVariant) {
      newAgColumn.cellRenderer = targetHeader.data.key;
      newAgColumn.width = AGGRID_QUOTE_COLUMN_WIDTH;
    } else if (!targetHeader.data.isDataTypeText) {
      newAgColumn.cellClass = `${AGGRID_CELL_CLASS} ${AGGRID_CELL_CLASS}--numeric`;
      newAgColumn.headerClass = `${newAgColumn.headerClass} ${AGGRID_HEADER_CLASS}--numeric ag-numeric-header`;
      newAgColumn.width = AGGRID_SIMPLE_NUM_COLUMN_WIDTH;
      newAgColumn.resizable = true;
      // newAgColumn.suppressMenu = true;
      newAgColumn.enableValue = true;
      newAgColumn.allowedAggFuncs = ['sum', 'avg'];
      newAgColumn.filter = "numericFilter";
      newAgColumn.floatingFilterComponent = "numericFloatingFilter";
      newAgColumn.floatingFilterComponentParams = {
        maxValue: 100,
        suppressFilterButton: true
      };
    } else {
      newAgColumn.cellClass = AGGRID_CELL_CLASS;
      newAgColumn.width = AGGRID_SIMPLE_TEXT_COLUMN_WIDTH;
      newAgColumn.resizable = true;
      newAgColumn.enableRowGroup = true;
      newAgColumn.enablePivot = true;
    }
  }

  private formAgGridRow(
    targetRow: SecurityTableRowDTO,
    targetHeaders: Array<SecurityTableHeaderDTO>,
    bestQuoteCellIndex: number,
    bestAxeQuoteCellIndex: number
  ): AgGridRow {
    const eachSecurity = targetRow.data.security;
    const newAgRow: AgGridRow = {
      id: targetRow.data.rowId,
      securityCard: eachSecurity,
      bestQuote: targetRow.data.cells[bestQuoteCellIndex].data.quantComparerDTO,
      bestAxeQuote: targetRow.data.cells[bestAxeQuoteCellIndex].data.quantComparerDTO,
      rowDTO: targetRow
    };
    newAgRow[AGGRID_DETAIL_COLUMN_KEY] = '';
    targetHeaders.forEach((eachHeader, index) => {
      if (eachHeader.data.key === 'securityCard' || eachHeader.state.isQuantVariant) {
        // skip those columns as they are already instantiated above
      } else {
        // can't directly use the cells from the target row to retrieve the data because we need to populate data for ALL columns, not just the active ones
        const textData = this.utilityService.retrieveAttrFromSecurityBasedOnTableHeader(eachHeader, eachSecurity, false);
        newAgRow[eachHeader.data.key] = !eachSecurity.state.isStencil ? textData : '';
      }
    });
    return newAgRow;
  }

  private agCompareUnderlineValue(
    valueA: string | number,
    valueB: string | number,
    nodeA: AgGridRowNode,
    nodeB: AgGridRowNode,
    inverted: boolean
  ) {
    // TODO: currently this logic causes a bit of delay on switching to alert table, this needs to be optimized
    if (!!nodeA && !!nodeB) {  // this check is for clicking on the "menu" icon on each header
      const columns = nodeA.columnController.allDisplayedColumns;
      if (!!columns) {
        const targetColumn = columns.find((eachColumn) => {
          return !!eachColumn.sort;
        })
        const targetStub = SecurityTableMetrics.find((eachMetric) => {
          return eachMetric.key === targetColumn.colDef.field;
        });
        if (targetStub) {
          const securityA = nodeA.data ? nodeA.data.securityCard : null;
          const securityB = nodeB.data ? nodeB.data.securityCard : null;
          const targetHeader = this.dtoService.formSecurityTableHeaderObject(targetStub);
          const underlineValueA = this.utilityService.retrieveAttrFromSecurityBasedOnTableHeader(targetHeader, securityA, true);
          const underlineValueB = this.utilityService.retrieveAttrFromSecurityBasedOnTableHeader(targetHeader, securityB, true);
          return this.returnSortValue(targetHeader, underlineValueA, underlineValueB, securityA, securityB);
        } else {
          this.restfulCommService.logError(`[AgGrid] Error at Custom AgGrid sorting, couldnt find header for column ${targetColumn}`);
          console.error('Error at Custom AgGrid sorting, couldnt find header for column', targetColumn);
          return 0;
        }
      } else {
        this.restfulCommService.logError(`[AgGrid] 'Error at Custom AgGrid sorting, column does not exist`);
        console.error('Error at Custom AgGrid sorting, column does not exist');
        return 0;
      }
    } else {
      return 0;
    }
  }

  private agCompareQuantComparer(
    qA: QuantComparerDTO,
    qB: QuantComparerDTO,
    nodeA: AgGridRowNode,
    nodeB: AgGridRowNode,
    inverted: boolean
  ) {
    // as long as we only have one quantComparer in the table there is no need to find out the column
    if (!!nodeA && !!nodeB) {
      const securityA = nodeA.data.securityCard;
      const securityB = nodeB.data.securityCard;
      const valueA = !!qA ? qA.data.delta : null;
      const valueB = !!qB ? qB.data.delta : null;
      if (!!securityA && !!securityB && !securityA.state.isStencil && !securityB.state.isStencil) {
        if (valueA == null && valueB == null) {
          return 0;
        } else if (valueA == null && valueB != null) {
          return -16;
        } else if (valueA != null && valueB == null) {
          return 16;
        } else if (qA.state.hasBid && qA.state.hasOffer && (!qB.state.hasBid || !qB.state.hasOffer)) {
          // A has both bid & offer vs B has only bid or only offer
          return 9;
        } else if ((!qA.state.hasBid || !qA.state.hasOffer) && qB.state.hasBid && qB.state.hasOffer) {
          return -9;
        } else if ((qA.state.hasBid || qA.state.hasOffer) && (!qB.state.hasBid && !qB.state.hasOffer)) {
          // A has only bid or only offer vs B has no bid or offer
          return 4;
        } else if ((!qA.state.hasBid && !qA.state.hasOffer) && (qB.state.hasBid || qB.state.hasOffer)) {
          return -4;
        } else if (valueA > valueB) {
          return -1;
        } else if (valueA < valueB) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  private agCompareSecurities(
    securityA: SecurityDTO,
    securityB: SecurityDTO,
    nodeA: AgGridRowNode,
    nodeB: AgGridRowNode,
    inverted: boolean
  ) {
    if (!!securityA && !!securityB && !securityA.state.isStencil && !securityB.state.isStencil) {
      if (securityA.data.name < securityB.data.name) {
        return 1;
      } else if (securityA.data.name > securityB.data.name) {
        return -1;
      }
    } else {
      return 0;
    }
  }

  private returnSortValue(
    targetHeader: SecurityTableHeaderDTO,
    valueA: string | number,
    valueB: string | number,
    securityA: SecurityDTO,
    securityB: SecurityDTO
  ): number {
    if (securityA == null && securityB != null) {
      return -16;
    } else if (securityA != null && securityB == null) {
      return 16;
    } else if (valueA == null && valueB != null) {
      return -4;
    } else if (valueA != null && valueB == null) {
      return 4;
    } else if (valueA < valueB) {
      return targetHeader.data.isDataTypeText ? 1 : -1;
    } else if (valueA > valueB) {
      return targetHeader.data.isDataTypeText ? -1 : 1;
    } else {
      return 0;
    }
  }

  private resizeAllAutoSizeColumns(table: SecurityTableDTO) {
    const allColumnIds = [];
    table.api.columnApi.getAllColumns().forEach((column) => {
      const colId = column.getColId();
      if (colId === 'securityCard') {
        allColumnIds.push(colId);
      }
    });
    table.api.columnApi.autoSizeColumns(allColumnIds);
  }
}
