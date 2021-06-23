import { Subscription } from 'rxjs';
import {
  GridApi,
  ColumnApi,
  IFloatingFilter,
  IFloatingFilterParams,
  SerializedNumberFilter
} from 'ag-grid-community';
import { StructureBucketDataBlock } from 'Core/models/frontend/frontend-blocks.interface';
import { Blocks, DTOs, Stubs } from 'App/modules/core/models/frontend';
import {
  BEStructuringBreakdownBlock,
  BEStructuringBreakdownMetricBlock
} from 'BEModels/backend-models.interface';
import {
  PayloadModifyOverrides,
  PayloadBulkCreateOverrides
} from 'Core/models/backend/backend-payloads.interface';
import { 
  PortfolioView,
  SubPortfolioFilter,
  BEPortfolioTargetMetricValues
} from 'Core/constants/structureConstants.constants';
import { TraceTradeParty } from '../../constants/securityTableConstants.constant';
import { NavigationModule } from 'Core/constants/coreConstants.constant';
import { IndexedDBDatabases } from 'Core/constants/indexedDB.constants';
import { DetachedRouteHandle } from '@angular/router';

export interface SecurityMapEntry {
  keywords: Array<string>;
  secruityId: string;
}

export interface ClickedSortQuotesByMetricEmitterParams {
  targetRow: DTOs.SecurityTableRowDTO;
  targetBlock: Blocks.QuoteMetricBlock;
  targetMetricLabel: string; 
}

export interface DefinitionConfiguratorEmitterParams {
  filterList: Array<DefinitionConfiguratorEmitterParamsItem>;
}

export interface DefinitionConfiguratorEmitterParamsItem {
  key: string;
  targetAttribute: string;
  targetAttributeBlock: string;
  filterBy: Array<string>;
  filterByBlocks: Array<Blocks.SecurityDefinitionFilterBlock>;
}

export interface LiveDataDiffingResult {
  newRowList: Array<DTOs.SecurityTableRowDTO>;
  markDiffCount: number;
  quantDiffCount: number;
}

export interface AgGridRowParams {
  data: Blocks.AgGridRow;
  node: Blocks.AgGridRowNode;
  api: GridApi;
  columnApi: ColumnApi;
  context: {
    componentParent: any;  // entire "this" of a container component
  };
  rowPinned: string;
  rowIndex: number;
}

export interface SantaTableNumericFloatingFilterChange {
  model: DTOs.NumericFilterDTO
}

export interface SantaTableNumericFloatingFilterParams extends IFloatingFilterParams<DTOs.NumericFilterDTO, SantaTableNumericFloatingFilterChange> {
  minValue: number;
  maxValue: number;
}

export interface ObligorGraphCategoryData {
  name: string,
  mid: number,
  mark: number,
  workoutTerm: number,
  markQuantity: number
}

export interface ObligorGraphAxesZoomState {
  yAxis: {
    start: number;
    end: number;
    fullZoomStart: number;
    fullZoomEnd: number;
  }
  xAxis: {
    start: number;
    end: number;
    fullZoomStart: number;
    fullZoomEnd: number;
  }
}

export interface LilMarketGraphSeriesDataPack {
  name: string;
  data: Array<LilMarketGraphSeriesDataPackEntryBlock>;
}

export interface LilMarketGraphSeriesDataPackEntryBlock {
  date: string;
  value: number;
}

export interface ClickedSpecificQuoteEmitterParams {
  targetQuote: DTOs.SecurityQuoteDTO;
  isOnBidSide: boolean;
  targetDriver: string;
}

export interface AlertDTOMap {
  [property: string]: DTOs.AlertDTO;
}

export interface AmchartPieDataBlock {
  subject: string;
  quantity: number;
  color?: string;
}

export interface StructureSetTargetOverlayTransferPack {
  targetFund: DTOs.PortfolioFundDTO;
  targetBreakdown: DTOs.PortfolioBreakdownDTO;
  isCreateNewOverride: boolean;
}

export interface StructureSetViewTransferPack {
  bucket: Array<StructureBucketDataBlock>;
  view: Array<PortfolioView>;
  displayCategory: string;
}

export interface StructureOverrideToBreakdownConversionReturnPack {
  list: Array<BEStructuringBreakdownBlock>;
  displayLabelMap: object;
}

export interface UpdateTargetBlock {
  metric: BEPortfolioTargetMetricValues;
  target: number;
}

export interface BICSServiceConsolidateReturnPack {
  deepestLevel: number;
  consolidatedStrings: Array<string>;
}

export interface TraceScatterGraphData {
  contraParty: TraceTradeParty;
  date: Date | number;
  totalTime?: number;
  rawDate?: string;
  sellY?: number;
  buyY?: number;
  nonActiveTrade?: number;
}

export interface AdhocExtensionBEStructuringBreakdownMetricBlock extends BEStructuringBreakdownMetricBlock {
  customLevel: number;
  code: string;
}

export interface CustomBreakdownReturnPack {
  customBreakdown: BEStructuringBreakdownBlock;
  customDefinitionList: Array<string>;
}

export interface BICSHierarchyDictionaryByLevel {
  level1: {
    [property: string]: string;
  }
  level2: {
    [property: string]: string;
  }
  level3: {
    [property: string]: string;
  }
  level4: {
    [property: string]: string;
  },
  level5: {
    [property: string]: string;
  },
  level6: {
    [property: string]: string;
  },
  level7: {
    [property: string]: string;
  }
}

export interface SecurityDefinitionFilterOptionTenorRange {
  [property:string]: SecurityDefinitionFilterOptionTenorRangeItem
}

export interface BICSGroupingByCodeBlock {
  [code: number]: Array<string>;
}

export interface StructureRowSetViewData  {
  row: DTOs.StructurePortfolioBreakdownRowDTO;
  view: PortfolioView;
}

export interface GenericKeyWithStringArrayBlock {
  [key: string]: Array<string>;

}
export interface BEIdentifierToFEMappingBlock {
  identifier: string;
  display: string;
}

interface SecurityDefinitionFilterOptionTenorRangeItem {
  displayLabel: string;
  min: number;
  max: number;
}

export interface GlobalWorkflowLastState {
  module: NavigationModule;
  stateUUID: string;
}

export interface StructureSetTargetOverrideTransferPack {
  portfolioID: number;
  updatePayload: PayloadModifyOverrides,
  createPayload: PayloadModifyOverrides,
  deletePayload: PayloadModifyOverrides
}

export interface StructureSetBulkOverrideTransferPack {
  pack: PayloadBulkCreateOverrides;
}

export interface RouteHandlerStoreBlock {
  state: string;
  handle: DetachedRouteHandle;
}

/*
The overwrite is for "overwriting" the default configurations. Current use of it is to embed it into WatchlistDTO, so when apply a "watchlist" or "watchlist", the FE will tune the table layout to that search's specific context. 
The reason we develop this overwrite instead of just using an array of <SecurityTableHeaderConfigStub> to act as an overwrite is for two reasons:
  1. This overwrite is lightweight, by keeping it optional and only have some of the properties from <SecurityTableHeaderConfigStub> means we are storing an object of 50-100 lines instead of 1000+lines
  2. Remove the dependency on the <SecurityTableHeaderConfigStub> data model, as that can change over time, while this overwrite goes into the indexedDB so needs to be less flexible
*/
export interface SecurityTableHeaderConfigOverwrite {
  key: string;
  active?: boolean;
  groupShow?: boolean;
  disabled?: boolean;
  pinned?: boolean;
  groupBy?: boolean;
  explicitOrder?: number;  // by default the order is implied by each entry's position in the array, but sometimes we need rules to bump up/down specific header, use this to do that
}
export interface IndexedDBTableBlockItem {
  name: string;
  key: string;
}
export interface IndexedDBTableBlock {
  [table: string]: IndexedDBTableBlockItem
}

export type IndexedDBEntryBlock = GlobalWorkflowLastState | DTOs.WatchlistDTO | DTOs.GlobalWorkflowStateDTO;

export type IndexedDBConfigBlock = {
  [databaseType in IndexedDBDatabases]: Array<IndexedDBTableBlockItem>
}

export type IndexedDBAllDatabaseMapping = {
  [database in IndexedDBDatabases]: {
    name: string;
    version: number;
    ngRxAction: any,
    api: IDBDatabase,
    configs: Array<IndexedDBTableBlockItem>
  }
}

export interface RouteHandlerStoreBlock {
  state: string;
  handle: DetachedRouteHandle;
}
export interface TradeCenterPanelSearchEngineIndexEntry {
  pristineText: string;
  displayText: string;
  type: string;
  bicsLevel?: number;
}

export interface SecurityActionLaunchUofBTransferPack {
  type: string;
  value: string;
  bicsLevel?: number;
}

export interface SecurityActionMenuLaunchUofBEventEmitterBlock {
  type: string;
  value: string;
  bicsLevel: number;
}

export interface UofBCategoryMappingBlock {
  [property: string]: Stubs.SecurityDefinitionStub;
}