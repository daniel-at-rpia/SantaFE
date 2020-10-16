import { Subscription } from 'rxjs';
import {
  GridApi,
  ColumnApi,
  IFloatingFilter,
  IFloatingFilterParams,
  SerializedNumberFilter
} from 'ag-grid-community';
import { PortfolioView } from 'Core/constants/structureConstants.constants';
import { StructureBucketDataBlock } from 'Core/models/frontend/frontend-blocks.interface';
import * as DTOs from 'FEModels/frontend-models.interface';
import { BEPortfolioStructuringDTO } from 'BEModels/backend-models.interface';
import {
  QuoteMetricBlock,
  AgGridRow,
  AgGridRowNode
} from 'FEModels/frontend-blocks.interface';

export interface SecurityMapEntry {
  keywords: Array<string>;
  secruityId: string;
}

export interface ClickedSortQuotesByMetricEmitterParams {
  targetRow: DTOs.SecurityTableRowDTO;
  targetBlock: QuoteMetricBlock;
  targetMetricLabel: string; 
}

export interface DefinitionConfiguratorEmitterParams {
  filterList: Array<DefinitionConfiguratorEmitterParamsItem>;
}

export interface DefinitionConfiguratorEmitterParamsItem {
  key: string;
  targetAttribute: string;
  filterBy: Array<string>;
}

export interface LiveDataDiffingResult {
  newRowList: Array<DTOs.SecurityTableRowDTO>;
  markDiffCount: number;
  quantDiffCount: number;
}

export interface AgGridRowParams {
  data: AgGridRow;
  node: AgGridRowNode;
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
  targetFund: DTOs.PortfolioStructureDTO;
  targetBreakdown: DTOs.PortfolioBreakdownDTO;
  isCreateNewOverride: boolean;
}

export interface StructureSetTargetPostEditUpdatePack {
  targetFund: BEPortfolioStructuringDTO;
  targetBreakdownBackendGroupOptionIdentifier: string;
}

export interface StructureSetViewData {
  yyyyMMdd: number;
  bucket: StructureBucketDataBlock;
  view: PortfolioView;
}