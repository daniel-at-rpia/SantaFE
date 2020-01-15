import { Subscription } from 'rxjs';
import {
  GridApi,
  ColumnApi,
  IFloatingFilter,
  IFloatingFilterParams,
  SerializedNumberFilter
} from 'ag-grid-community';

import { SecurityTableRowDTO, NumericFilterDTO } from 'FEModels/frontend-models.interface';
import {
  QuoteMetricBlock,
  AgGridRow,
  AgGridRowNode
} from 'FEModels/frontend-blocks.interface';


export interface ClickedSortQuotesByMetricEmitterParams {
  targetRow: SecurityTableRowDTO;
  targetBlock: QuoteMetricBlock;
  targetMetricLabel: string; 
}

export interface DefinitionConfiguratorEmitterParams {
  filterList: Array<DefinitionConfiguratorEmitterParamsItem>;
}

export interface DefinitionConfiguratorEmitterParamsItem {
  targetAttribute: string;
  filterBy: Array<string>;
}

export interface LiveDataDiffingResult {
  newRowList: Array<SecurityTableRowDTO>;
  markDiffCount: number;
  quantDiffCount: number;
}

export interface QuantVisualizerParams {
  tRaw: number;
  gRaw: number;
  tWow: number;
  gWow: number;
  tMom: number;
  gMom: number;
  tYtd: number;
  gYtd: number;
}

export interface AgGridRowParams {
  data: AgGridRow;
  node: AgGridRowNode;
  api: GridApi;
  columnApi: ColumnApi;
  context: {
    componentParent: any;  // entire "this" of a container component
  }
}

export interface SantaTableNumericFloatingFilterChange {
  model: NumericFilterDTO
}

export interface SantaTableNumericFloatingFilterParams extends IFloatingFilterParams<NumericFilterDTO, SantaTableNumericFloatingFilterChange> {
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