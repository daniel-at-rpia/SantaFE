/*
Blocks are the "building blocks" for DTO models.

The main difference between blocks and components is blocks does not carry any context, any meanings, and it rarely has any interactions/states, even if it does, the interactions and states are not meant to function on its own.

Because of this, while component models need to follow "BasicDTOStructure", blocks don't.
*/

import * as am4charts from "@amcharts/amcharts4/charts";
import {
  GridApi,
  ColumnApi
} from 'ag-grid-community';
import {
  SecurityDTO,
  QuantComparerDTO
} from 'FEModels/frontend-models.interface';

export interface SecurityPortfolioBlock {
  portfolioName: string;
  quantity: number;
  marketValueCad: number;
  strategy: string;
}

export interface SecurityMarkBlock {
  mark: string;
  markDriver: string;
  markChangedBy: string;
  markChangedTime: string;
  markRaw: number;
  markBackend: number;
  markDisBid: string;
  markDisBidRaw: number;
  markDisAsk: string;
  markDisAskRaw: number;
  markDisMid: string;
  markDisMidRaw: number;
  markDisLiquidation: string;
  markDisLiquidationRaw: number;
}

export interface SecurityGroupMetricBlock {
  isEmpty: boolean;
  sortHierarchy: number;
  deltaScope: string;
  label: string;
  value: number;
  absMax: number;
  percentage: number;
}

export interface SecurityGroupMetricPackBlock {
  raw: object;
  delta: {
    Dod: object;
    Wow: object;
    Mom: object;
    Ytd: object;
  }
}

export interface SecurityGroupPieChartBlock {
  name: string;
  colorScheme: SecurityGroupPieChartColorSchemeBlock;
  chart: am4charts.PieChart;
  rawSupportingData: object;
}

export interface SecurityGroupPieChartDataBlock {
  label: string;
  value: number;
  index: number;
  color: any;
}

export interface SecurityGroupPieChartColorSchemeBlock {
  type: string;
  scheme: Array<any>
}

export interface SecurityDefinitionFilterBlock {
  isSelected: boolean;  // means it is selected for filtering
  isFilteredOut: boolean;  // means it is hidden/disabled in the UI, sry about this naming failure, it's just not worth it to mass-rename it in the code
  displayLabel: string;
  shortKey: string;
  key: string;
}

export interface QuoteMetricBlock {
  displayLabelList: Array<string>;
  isDoubleWidthColumn: boolean;
  isTripleWidthColumn: boolean;
  sortable: boolean;
}

export interface QuantitativeEntryBlock {
  target: number;
  group: number;
}

export interface QuantitativeEntryStyleBlock {
  inversed: boolean;
  leftSpaceWidth: number;
  rightSpaceWidth: number;
}

export interface AgGridColumnDefinition {
  headerName: string;
  field: string;
  headerClass: string;
  cellClass: string;
  width?: number;
  autoHeight?: boolean;
  comparator?: Function;
  cellRenderer?: string;
  resizable?: boolean;
  sortable?: boolean;
  filter?: boolean;
  hide: boolean;
  enableRowGroup: boolean,
  enablePivot: boolean,
}

export interface AgGridRowNode {
  columnController: {
    allDisplayedColumns: Array<AgGridColumn>
  }
  data: AgGridRow;
  parent: AgGridRowNode;
  gridApi: GridApi;
  columnApi: ColumnApi;
  setExpanded: Function;
  [property: string]: any;
}

export interface AgGridRow {
  id: string;
  securityCard: SecurityDTO;    // this needs to identical to SecurityTableMetrics' key for Security column
  bestQuote: QuantComparerDTO;  // this needs to identical to SecurityTableMetrics' key for Best Quote column
  [property: string]: any;
}

export interface AgGridColumn {
  colId: string;
  colDef: AgGridColumnDefinition;
  userProvidedColDef: AgGridColumnDefinition;
  [property: string]: any;
}