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
      SecurityTableHeaderDTO
    } from 'FEModels/frontend-models.interface';
    import {
      AgGridRow,
      AgGridColumnDefinition
    } from 'FEModels/frontend-blocks.interface';
    import { SecurityTableMetrics } from 'Core/constants/securityTableConstants.constant';
  //

@Injectable()
export class AgGridMiddleLayerService {
  constructor(
    private utilityService: UtilityService,
    private dtoService: DTOService
  ){}

  public loadAgGridHeaders(
    table: SecurityTableDTO
  ): Array<AgGridColumnDefinition> {
    const list = [];
    table.data.headers.forEach((eachHeader) => {
      const newAgColumn: AgGridColumnDefinition = {
        headerName: eachHeader.data.displayLabel,
        field: eachHeader.data.key,
        cellClass: 'santaTable__main-agGrid-cell',
      };
      if (eachHeader.data.underlineAttrName && eachHeader.data.attrName != eachHeader.data.underlineAttrName) {
        newAgColumn.comparator = this.agCompareUnderlineValue.bind(this)
      }
      if (eachHeader.data.key === 'security') {
        newAgColumn.cellClass = 'santaTable__main-agGrid-cell santaTable__main-agGrid-cell--securityCard';
      } else {
        newAgColumn.cellClass = 'santaTable__main-agGrid-cell';
      }
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

  private formAgGridRow(
    targetRow: SecurityTableRowDTO,
    targetHeaders: Array<SecurityTableHeaderDTO>
  ): AgGridRow {
    const eachSecurity = targetRow.data.security;
    const newAgRow: AgGridRow = {
      id: !eachSecurity.state.isStencil ? eachSecurity.data.securityID : this.utilityService.generateUUID(),
      securityDTO: eachSecurity,
      quantComparerDTO: targetRow.data.cells[0].data.quantComparerDTO
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

  private agCompareUnderlineValue(valueA, valueB, nodeA, nodeB, inverted) {
    const columns = nodeA['columnController']['allDisplayedColumns'];
    if (!!columns) {
      const targetColumn = columns.find((eachColumn) => {
        return eachColumn.sort;
      })
      const targetColumnDef: AgGridColumnDefinition = targetColumn['colDef'];
      if (targetColumnDef) {
        const targetStub = SecurityTableMetrics.find((eachMetric) => {
          return eachMetric.key === targetColumnDef.field;
        });
        if (targetStub) {
          const targetHeader = this.dtoService.formSecurityTableHeaderObject(targetStub);
          const underlineValueA = this.utilityService.retrieveAttrFromSecurityBasedOnTableHeader(targetHeader, nodeA.data.securityDTO, true);
          const underlineValueB = this.utilityService.retrieveAttrFromSecurityBasedOnTableHeader(targetHeader, nodeB.data.securityDTO, true);
          return this.returnSortValue(underlineValueA, underlineValueB);
        } else {
          console.error('Error at Custom AgGrid sorting, couldnt find header for column', targetColumnDef);
          return 0;
        }
      } else {
        console.error('Error at Custom AgGrid sorting, column definition does not exist');
        return 0;
      }
    } else {
      console.error('Error at Custom AgGrid sorting, column does not exist');
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
}