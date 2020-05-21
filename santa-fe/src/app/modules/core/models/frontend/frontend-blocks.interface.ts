/*
Blocks are the "building blocks" for DTO models.

The main difference between blocks and components is blocks does not carry any context, any meanings, and it rarely has any interactions/states, even if it does, the interactions and states are not meant to function on its own.

Because of this, while component models need to follow "BasicDTOStructure", blocks don't.
*/

import * as DTOs from 'FEModels/frontend-models.interface';
import {
  AxeAlertScope, AxeAlertType
} from 'Core/constants/tradeConstants.constant';
import * as am4charts from "@amcharts/amcharts4/charts";
import {
  GridApi,
  ColumnApi
} from 'ag-grid-community';

export interface SecurityPortfolioBlock {
  portfolioName: string;
  quantity: number;
  strategy: string;
  cs01Cad: number;
  cs01Local: number;
  costFifoSpread: number;
  costWeightedAvgSpread: number;
  costFifoPrice: number;
  costWeightedAvgPrice: number;
}

export interface SecurityCostPortfolioBlock {
  fifo: {
    'Default Spread': number;
    'Price': number;
  };
  weightedAvg: {
    'Default Spread': number;
    'Price': number;
  };
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
  markDisIndex: string;
  markDisIndexRaw: number;
  price: string;
  priceRaw: number;
  spread: string;
  spreadRaw: number;
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
    Yoy: object;
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

// export interface AGGridColumnDefinitionGroup {
  // headerName: string;
  // children: Array<>
// }

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
  pinned?: boolean;
  hide: boolean;
  enableRowGroup: boolean;
  enablePivot: boolean;
  suppressMenu?: boolean;
  floatingFilterComponent?: string;
  floatingFilterComponentParams?: {
    maxValue: number;
    suppressFilterButton: boolean
  }
  children?: Array<AgGridColumnDefinition>;
  columnGroupShow?: string;
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
  firstChild: boolean;
  lastChild: boolean;
}

export interface AgGridRow {
  id: string;
  securityCard: DTOs.SecurityDTO;    // this needs to be identical to SecurityTableMetrics' key for Security column
  bestQuote: DTOs.QuantComparerDTO;  // this needs to be identical to SecurityTableMetrics' key for Best Quote column
  bestAxeQuote: DTOs.QuantComparerDTO;  // this needs to be identical to SecurityTableMetrics' key for Best Axe Quote column
  alertSide: DTOs.SantaTableAlertSideCellDTO,  // this needs to be identical to SecurityTableMetrics' key for Alert Side column
  rowDTO: DTOs.SecurityTableRowDTO;
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
}

export interface SecurityTableRowQuoteBlock {
  primaryPresentQuotes: Array<DTOs.SecurityQuoteDTO>;
  primaryQuotes: Array<DTOs.SecurityQuoteDTO>;
  primarySecurityName: string;
  secondaryPresentQuotes: Array<DTOs.SecurityQuoteDTO>;
  secondaryQuotes: Array<DTOs.SecurityQuoteDTO>;
  secondarySecurityName: string;
}

export interface TradeAlertConfigurationAxeGroupBlock {
  card: DTOs.SecurityDTO;
  groupId: string;
  scopes: Array<AxeAlertScope>;
  axeAlertTypes: Array<AxeAlertType>;
  isDeleted: boolean;
  isDisabled: boolean;
  isUrgent: boolean;
}

export interface TableFetchResultBlock {
  currentContentStage: number;
  fetchComplete: boolean;
  rowList: Array<DTOs.SecurityTableRowDTO>;
  prinstineRowList: Array<DTOs.SecurityTableRowDTO>;
  liveUpdatedRowList: Array<DTOs.SecurityTableRowDTO>;
}
