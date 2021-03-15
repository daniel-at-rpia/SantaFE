import { Subscription } from 'rxjs';
import {
  GridApi,
  ColumnApi,
  IFloatingFilter,
  IFloatingFilterParams,
  SerializedNumberFilter
} from 'ag-grid-community';
import {
  PortfolioView,
  SubPortfolioFilter
} from 'Core/constants/structureConstants.constants';
import { StructureBucketDataBlock } from 'Core/models/frontend/frontend-blocks.interface';
import * as DTOs from './frontend-models.interface';
import * as Blocks from './frontend-blocks.interface';
import {
  BEStructuringBreakdownBlock,
  BEStructuringBreakdownMetricBlock
} from 'BEModels/backend-models.interface';
import { PayloadUpdatePortfolioOverridesForAllPortfolios } from 'Core/models/backend/backend-payloads.interface';
import { BEPortfolioTargetMetricValues } from 'Core/constants/structureConstants.constants';
import { TraceTradeParty } from '../../constants/securityTableConstants.constant';

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
