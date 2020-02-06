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
  QuantComparerDTO,
  SecurityTableRowDTO,
  SecurityQuoteDTO
} from 'FEModels/frontend-models.interface';

export interface SecurityPortfolioBlock {
  portfolioName: string;
  quantity: number;
  marketValueCad: number;
  strategy: string;
  cs01Cad: number;
  cs01Local: number;
}

export interface SecurityMarkBlock {
  combinedDefaultMark: string;
  mark: string;
  markDriver: string;
  markChangedBy: string;
  markChangedTime: string;
  combinedDefaultMarkRaw: number;
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
  isSizeTwo: boolean;
  isSizeThree: boolean;
  isSizeFour: boolean;
  sortable: boolean;
  isNonCDS: boolean;
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
  enableValue: boolean;  // enable aggregation
  allowedAggFuncs?: Array<string>;  // specify aggregation functions, by default it allows the five built-in ones
  cellRenderer?: string;
  resizable?: boolean;
  sortable?: boolean;
  filter?: string;
  hide: boolean;
  enableRowGroup: boolean;
  enablePivot: boolean;
  suppressMenu?: boolean;
  floatingFilterComponent?: string;
  floatingFilterComponentParams?: {
    maxValue: number;
    suppressFilterButton: boolean
  }
}

export interface AgGridRowNode {
  columnController: {
    allDisplayedColumns: Array<AgGridColumn>
  }
  data: AgGridRow;
  group: boolean;
  parent?: AgGridRowNode;  // detail nodes will have a "parent" attribute
  detailNode?: AgGridRowNode;  // parent nodes will have a "detail" attribute
  master: boolean;  // parent nodes will have this as true
  detail: boolean;  // child nodes will have this as true
  rowHeight: number;
  gridApi: GridApi;
  columnApi: ColumnApi;
  expanded?: boolean;
  setExpanded: Function;
  setData: Function;
}

export interface AgGridRow {
  id: string;
  securityCard: SecurityDTO;    // this needs to identical to SecurityTableMetrics' key for Security column
  bestQuote: QuantComparerDTO;  // this needs to identical to SecurityTableMetrics' key for Best Quote column
  rowDTO: SecurityTableRowDTO;
}

export interface AgGridColumn {
  colId: string;
  colDef: AgGridColumnDefinition;
  userProvidedColDef: AgGridColumnDefinition;
  sort: string;
}

export interface ObligorChartCategoryBlock {
  data: { 
    name: string;
    color: string;
    obligorCategoryDataItemDTO: Array<ObligorCategoryDataItemBlock>;
  };

  state: {
    isHidden: boolean;
    isMarkHidden: boolean;
  }
}

export interface ObligorCategoryDataItemBlock {
  data: {
    name: string,
    securityID: string;
    mark: string;
    spreadMid: number;
    yieldMid: number;
    workoutTerm: number;
    cS01: number;
    currentPosition: number;
  }
  state: {}
}

export interface SecurityTableRowQuoteBlock {
  primaryPresentQuotes: Array<SecurityQuoteDTO>;
  primaryQuotes: Array<SecurityQuoteDTO>;
  primarySecurityName: string;
  secondaryPresentQuotes: Array<SecurityQuoteDTO>;
  secondaryQuotes: Array<SecurityQuoteDTO>;
  secondarySecurityName: string;
}