/*
Blocks are the "building blocks" for DTO models.

The main difference between blocks and components is blocks does not carry any context, any meanings, and it rarely has any interactions/states, even if it does, the interactions and states are not meant to function on its own.

Because of this, while component models need to follow "BasicDTOStructure", blocks don't.
*/
import * as am4charts from "@amcharts/amcharts4/charts";
import {
  GridApi,
  ColumnApi,
  ValueFormatterParams
} from 'ag-grid-community';
import { DTOs, Blocks, AdhocPacks } from 'Core/models/frontend';
import { AxeAlertScope, AxeAlertType, SecurityActionMenuOptionsRawText, SecurityActionMenuOptionsDisplayText } from 'Core/constants/tradeConstants.constant';
import { DTOService } from 'Core/services/DTOService';
import { PortfolioMetricValues, PortfolioView } from 'Core/constants/structureConstants.constants';
import { BEStructuringBreakdownBlock, BEStructuringBreakdownMetricBlock } from 'Core/models/backend/backend-models.interface';
import { TraceTradeParty, AggridSortOptions } from 'Core/constants/securityTableConstants.constant';

export interface SecurityPortfolioBlock {
  portfolioName: string;
  quantity: number;
  strategy: string;
  cs01Cad: number;
  cs01Local: number;
  cs01WeightPct: number;
  bondEquivalentValueCad: number;
  bondEquivalentValueWeightPct: number;
  costFifoSpread: number;
  costWeightedAvgSpread: number;
  costFifoPrice: number;
  costWeightedAvgPrice: number;
}

export interface SecurityCostPortfolioBlock {
  fifo: {
    defaultSpread: number;
    price: number;
  };
  weightedAvg: {
    defaultSpread: number;
    price: number;
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
  raw: SecurityGroupMetricPackIndividualEntryBlock;
  delta: {
    Dod: SecurityGroupMetricPackIndividualEntryBlock;
    Wow: SecurityGroupMetricPackIndividualEntryBlock;
    Mom: SecurityGroupMetricPackIndividualEntryBlock;
    Ytd: SecurityGroupMetricPackIndividualEntryBlock;
    TMinusTwo: SecurityGroupMetricPackIndividualEntryBlock;
  }
}

interface SecurityGroupMetricPackIndividualEntryBlock {
  defaultSpread?: number,
  price?: number,
  rating?: number,
  gSpread?: number,
  oasSpread?: number,
  zSpread?: number,
  yieldWorst?: number,
  aswUsd?: number,
  workoutTerm?: number,
  index: {
    defaultSpread?: number,
    price?: number,
    rating?: number,
    gSpread?: number,
    oasSpread?: number,
    zSpread?: number,
    yieldWorst?: number,
    aswUsd?: number,
    workoutTerm?: number
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
  isDeepestLevel?: boolean; // for BICS only
  displayLabel: string;
  bicsLevel?: number;  // only exist for consolidated bics options
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
  sort?: AggridSortOptions;
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
  valueFormatter?: (params: ValueFormatterParams) => string;
  rowGroup?: boolean;
}

export interface AgGridRowNode {
  rowIndex: number;
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
  setRowHeight: Function;
  isRowPinned: Function;
  firstChild: boolean;
  lastChild: boolean;
}

export interface AgGridRow {
  id: string;
  securityCard: DTOs.SecurityDTO;    // this needs to be identical to SecurityTableHeaderConfigs' key for Security column
  bestQuote: DTOs.BestQuoteComparerDTO;  // this needs to be identical to SecurityTableHeaderConfigs' key for Best Quote column
  bestAxeQuote: DTOs.BestQuoteComparerDTO;  // this needs to be identical to SecurityTableHeaderConfigs' key for Best Axe Quote column
  alertSide: DTOs.SantaTableAlertSideCellDTO;  // this needs to be identical to SecurityTableHeaderConfigs' key for Alert Side column
  alertStatus: DTOs.SantaTableAlertStatusCellDTO;  // this needs to be identical to SecurityTableHeaderConfigs' key for Alert Status column
  rowDTO: DTOs.SecurityTableRowDTO;
  isFullWidth: boolean;
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

export interface TableFetchResultBlock {
  currentContentStage: number;
  fetchComplete: boolean;
  rowList: Array<DTOs.SecurityTableRowDTO>;
  prinstineRowList: Array<DTOs.SecurityTableRowDTO>;
  liveUpdatedRowList: Array<DTOs.SecurityTableRowDTO>;
  removalRowList: Array<string>;  // rowIds of the rows that need to be removed, since data within the row may be updated, therefore only use the rowId instead of the DTO
}

export interface AxeAlertBlock {
  targetBlock: DTOs.TradeAlertConfigurationAxeGroupBlockDTO;
}

export interface SelectAxeWatchlistSide extends AxeAlertBlock {
  targetScope: AxeAlertScope;
}

export interface SelectAxeWatchlistType extends AxeAlertBlock {
  targetType: AxeAlertType;
}

export interface SelectAxeWatchlistRangeValue extends AxeAlertBlock {
  newValue: any;
}

export interface SelectAxeWatchlistRangeDriver extends AxeAlertBlock {
  targetDriver: string;
}

export interface PortfolioMetricTotals {
  cs01: number;
  creditLeverage: number;
  creditDuration: number;
}

export interface PortfolioBreakdownCategoryBlock {
  category: string;
  displayCategory: string;
  tooltipText: string;
  targetLevel: number;
  targetPct: number;
  diffToTarget: number;
  diffToTargetDisplay: string;
  currentLevel: number;
  currentPct: number;
  currentPctDisplay: string;
  indexPct: number;
  indexPctDisplay: string;
  delta: number;
  deltaDisplay: string;
  moveVisualizer: DTOs.MoveVisualizerDTO;
  bicsLevel: number;
  portfolioID: number;
  diveInLevel: number;
  raw: {
    currentLevel: number;
    currentPct: number;
    targetLevel: number;
    targetPct: number;
  }
  bucket: StructureBucketDataBlock;
  simpleBucket: StructureBucketDataBlock;
  view: PortfolioView;
  parentRow: DTOs.StructurePortfolioBreakdownRowDTO;
  children?: DTOs.PortfolioBreakdownDTO; // used in popover dive-in
  displayedSubLevelRows?: Array<DTOs.StructurePortfolioBreakdownRowDTO>; // used for BICS hierarchy display in main BICS panel and set target modal
  displayedSubLevelRowsWithTargets?: Array<DTOs.StructurePortfolioBreakdownRowDTO>; // used to indicate which sub levels have targets
  editedSubLevelRowsWithTargets?: Array<DTOs.StructurePortfolioBreakdownRowDTO>;
  code: string;
  portfolioOverrideId: string;
}

export interface GlobalNavLegendBlock {
  card: DTOs.SecurityDTO;
  legend: string;
}

export interface StructureSetTargetPanelEditRowBlock {
  targetBlockFromBreakdown: PortfolioBreakdownCategoryBlock;
  rowIdentifier: string;
  displayRowTitle: string;
  modifiedDisplayRowTitle: string;
  targetCs01: {
    level: StructureSetTargetPanelEditRowItemBlock;
    percent: StructureSetTargetPanelEditRowItemBlock;
  };
  targetCreditLeverage: {
    level: StructureSetTargetPanelEditRowItemBlock;
    percent: StructureSetTargetPanelEditRowItemBlock;
  };
  isLocked: boolean;
  isEven: boolean;
  isViewEdited: boolean;
  existInServer: boolean;
  isVisible: boolean;
  rowDTO: DTOs.StructurePortfolioBreakdownRowDTO;
  view: PortfolioView;
}

export interface StructureSetTargetPanelEditRowItemBlock {
  savedDisplayValue: string;
  savedUnderlineValue: number;  // underline values won't be rounded, so they are accurate
  modifiedDisplayValue: string;
  modifiedUnderlineValue: number;  // underline values won't be rounded, so they are accurate
  isActive: boolean;
  isImplied: boolean;
  isFocused: boolean;
  metric: PortfolioMetricValues;
  isPercent: boolean;
  isSaved: boolean;
}

export interface BICsHierarchyBlock {
  name: string;
  bicsLevel: number;
  code: string;
  children: Array<BICsHierarchyBlock>;
}


export interface BICSCategorizationBlock {
  portfolioID: number,
  bicsLevel1: BEStructuringBreakdownBlock,
  bicsLevel2?: BEStructuringBreakdownBlock,
  bicsLevel3?: BEStructuringBreakdownBlock,
  bicsLevel4?: BEStructuringBreakdownBlock,
  bicsLevel5?: BEStructuringBreakdownBlock,
  bicsLevel6?: BEStructuringBreakdownBlock,
  bicsLevel7?: BEStructuringBreakdownBlock
}

export interface StructureBucketDataBlock {
  [groupOption: string]: Array<string>;
}

export interface TraceTradeBlock {
  benchmarkName: string;
  traceTradeId: string;
  tradeTime: string;
  displayTradeTime: string;
  reportingTime: string;
  displayReportingTime: string;
  contraParty: TraceTradeParty;
  reportingParty: TraceTradeParty;
  side: string;
  volumeEstimated: number;
  volumeReported: number;
  displayVolumeEstimated: string;
  displayVolumeReported: string;
  price: string;
  yield: number;
  spread: string;
  oasSpread: string;
  gSpread: string;
  iSpread: string;
  parSpread: string;
}

export interface VisualizerGraphsBlock {
  [property: string]: am4charts.XYChart | am4charts.PieChart;
}

export interface BICSMainRowDataBlock {
  code: string;
  portfolioID: number;
  level: number;
  isCs01?: boolean;
  isIndex: boolean;
}

export interface TradeCenterPanelStateFilterBlock {
  keyword: {
    defaultValueForUI: string;
    actualValue: string;
  }
  driverType: string;
  quickFilters: {
    portfolios: Array<string>;
    owner: Array<string>;
    strategy: Array<string>;
    tenor: Array<string>;
  }
  securityFilters: Array<AdhocPacks.DefinitionConfiguratorEmitterParamsItem>;
}

export interface StructureSetBulkOverridesEditRow {
  displayRowTitle: string;
  modifiedDisplayRowTitle: string;
  rowIdentifier: string;
  displayBucket: string;
  simpleBucket: StructureBucketDataBlock;
  isEven: boolean;
}

export interface StructureClearTargetsOptionBlock {
  key: string;
  backendIdentifier: string;
  isSelected: boolean
}

export interface StructureClearTargetsOptionMapBlock {
  [property: string]: Array<StructureClearTargetsOptionBlock>
}
export interface SecurityActionMenuOptionBlock {
  displayTitle: SecurityActionMenuOptionsDisplayText;
  icon: string;
  level: number;
  parentAction: SecurityActionMenuOptionsRawText;
  subActions: Array<SecurityActionMenuOptionsRawText>;
  rawText: SecurityActionMenuOptionsRawText;
  positionIdentifier: string;
  isAvailableSubAction: boolean;
}