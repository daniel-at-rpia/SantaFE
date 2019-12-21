  // dependencies
    import { Injectable } from '@angular/core';
    import {
      GridApi,
      ColumnApi,
      Column
    } from 'ag-grid-community';

    import { UtilityService } from './UtilityService';
    import {
      SecurityTableDTO,
      SecurityTableRowDTO,
      SecurityTableHeaderDTO
    } from 'FEModels/frontend-models.interface';
    import {
      AgGridRow,
      AgGridColumnDefinition
    } from 'FEModels/frontend-blocks.interface';
  //


@Injectable()
export class AgGridMiddleLayerService {
  constructor(
    private utilityService: UtilityService
  ){}

  public loadAgGridHeaders(
    table: SecurityTableDTO
  ) {
    const list = [];
    table.data.headers.forEach((eachHeader) => {
      const newAgColumn: AgGridColumnDefinition = {
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
    table.data.agGridColumnDefs = list;
    table.api.gridApi.setColumnDefs(list);
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
      id: !eachSecurity.state.isStencil ? eachSecurity.data.securityID : this.utilityService.generateUUID()
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