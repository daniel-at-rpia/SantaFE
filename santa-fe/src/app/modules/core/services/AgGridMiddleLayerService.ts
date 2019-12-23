  // dependencies
    import { Injectable } from '@angular/core';
    import {
      GridApi,
      ColumnApi,
      Column
    } from 'ag-grid-community';

    import { UtilityService } from './UtilityService';
    import { DTOService }from './DTOService';
    import {
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
      AGGRID_QUOTE_COLUMN_WIDTH,
      AGGRID_SIMPLE_NUM_COLUMN_WIDTH,
      AGGRID_CELL_CLASS
    } from 'Core/constants/securityTableConstants.constant';
  //

@Injectable()
export class AgGridMiddleLayerService {
  constructor(
    private utilityService: UtilityService,
    private dtoService: DTOService
  ){}

  public onGridReady(table: SecurityTableDTO) {
    // do nothing at the moment
  }

  public loadAgGridHeaders(
    table: SecurityTableDTO
  ): Array<AgGridColumnDefinition> {
    const list = [];
    table.data.headers.forEach((eachHeader) => {
      const newAgColumn: AgGridColumnDefinition = {
        headerName: eachHeader.data.displayLabel,
        field: eachHeader.data.key,
        cellClass: 'santaTable__main-agGrid-cell',
        sortable: true,
        filter: true
      };
      this.loadAgGridHeadersComparator(eachHeader, newAgColumn);
      this.loadAgGridHeadersCellRenderer(eachHeader, newAgColumn);
      list.push(newAgColumn);
    })
    table.api.gridApi.setColumnDefs(list);
    return list;
  }

  public loadAgGridRows(
    table: SecurityTableDTO
  ): Array<AgGridRow> {
    const targetRows = table.data.rows;
    const targetHeaders = table.data.headers;
    const list = [];
    targetRows.forEach((eachRow) => {
      const newAgRow = this.formAgGridRow(eachRow, targetHeaders);
      !!newAgRow.id && list.push(newAgRow);
    });
    table.api.gridApi.setRowData(list);
    this.resizeAllAutoSizeColumns(table);
    return list;
  }

  public updateAgGridRows(
    table: SecurityTableDTO,
    targetRows: Array<SecurityTableRowDTO>
  ) {
    targetRows.forEach((eachRow) => {
      const id = eachRow.data.security.data.securityID;
      const targetNode = table.api.gridApi.getRowNode(id);
      const newAgRow = this.formAgGridRow(eachRow, table.data.headers);
      targetNode.setData(newAgRow);
    });
  }

  private loadAgGridHeadersComparator(
    targetHeader: SecurityTableHeaderDTO,
    newAgColumn: AgGridColumnDefinition
  ) {
    if (targetHeader.state.isQuantVariant) {
      newAgColumn.comparator = this.agCompareQuantComparer.bind(this);
    } else if (targetHeader.data.underlineAttrName && targetHeader.data.attrName != targetHeader.data.underlineAttrName) {
      newAgColumn.comparator = this.agCompareUnderlineValue.bind(this)
    }
  }

  private loadAgGridHeadersCellRenderer(
    targetHeader: SecurityTableHeaderDTO,
    newAgColumn: AgGridColumnDefinition
  ) {
    if (targetHeader.data.key === 'securityCard') {
      newAgColumn.cellClass = `${AGGRID_CELL_CLASS} ${AGGRID_CELL_CLASS}--securityCard`;
      newAgColumn.cellRenderer = targetHeader.data.key;
    } else if (targetHeader.data.key === 'bestQuote') {
      newAgColumn.cellRenderer = targetHeader.data.key;
      newAgColumn.width = AGGRID_QUOTE_COLUMN_WIDTH;
    } else {
      newAgColumn.cellClass = AGGRID_CELL_CLASS;
      newAgColumn.width = AGGRID_SIMPLE_NUM_COLUMN_WIDTH;
      newAgColumn.resizable = true;
    }
  }

  private formAgGridRow(
    targetRow: SecurityTableRowDTO,
    targetHeaders: Array<SecurityTableHeaderDTO>
  ): AgGridRow {
    const eachSecurity = targetRow.data.security;
    const newAgRow: AgGridRow = {
      id: !eachSecurity.state.isStencil ? eachSecurity.data.securityID : this.utilityService.generateUUID(),
      securityCard: eachSecurity,
      bestQuote: targetRow.data.cells[0].data.quantComparerDTO
    };
    targetHeaders.forEach((eachHeader, index) => {
      if (eachHeader.data.key === 'securityCard' || eachHeader.data.key === 'bestQuote') {
        // skip those two as they are already instantiated above
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

  private agCompareUnderlineValue(
    valueA: string | number,
    valueB: string | number,
    nodeA: AgGridRowNode,
    nodeB: AgGridRowNode,
    inverted: boolean
  ) {
    if (!!nodeA && !!nodeB) {  // this check is for clicking on the "menu" icon on each header
      const columns = nodeA.columnController.allDisplayedColumns;
      if (!!columns) {
        const targetColumn = columns.find((eachColumn) => {
          return eachColumn.sort;
        })
        const targetStub = SecurityTableMetrics.find((eachMetric) => {
          return eachMetric.key === targetColumn.colId;
        });
        if (targetStub) {
          const targetHeader = this.dtoService.formSecurityTableHeaderObject(targetStub);
          const underlineValueA = this.utilityService.retrieveAttrFromSecurityBasedOnTableHeader(targetHeader, nodeA.data.securityCard, true);
          const underlineValueB = this.utilityService.retrieveAttrFromSecurityBasedOnTableHeader(targetHeader, nodeB.data.securityCard, true);
          return this.returnSortValue(underlineValueA, underlineValueB);
        } else {
          console.error('Error at Custom AgGrid sorting, couldnt find header for column', targetColumn);
          return 0;
        }
      } else {
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
    const securityA = nodeA.data.securityCard;
    const securityB = nodeB.data.securityCard;
    const valueA = !!qA ? qA.data.delta : null;
    const valueB = !!qB ? qB.data.delta : null;
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
  }

  private returnSortValue(valueA, valueB): number {
    if (valueA == null && valueB != null) {
      return 4;
    } else if (valueA != null && valueB == null) {
      return -4;
    } else if (valueA < valueB) {
      return 1;
    } else if (valueA > valueB) {
      return -1;
    } else {
      return 0;
    }
  }

  private resizeAllAutoSizeColumns(table: SecurityTableDTO) {
    const allColumnIds = [];
    table.api.columnApi.getAllColumns().forEach((column) => {
      const colId = column.getColId();
      if (colId === 'bestQuote') {
        allColumnIds.push(colId);
      }
    });
    table.api.columnApi.autoSizeColumns(allColumnIds);
  }
}