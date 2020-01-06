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
  gridApi: GridApi;
  columnApi: ColumnApi;
}

export interface SantaTableNumericFloatingFilterChange {
  model: NumericFilterDTO
}

export interface SantaTableNumericFloatingFilterParams extends IFloatingFilterParams<NumericFilterDTO, SantaTableNumericFloatingFilterChange> {
  minValue: number;
  maxValue: number;
}