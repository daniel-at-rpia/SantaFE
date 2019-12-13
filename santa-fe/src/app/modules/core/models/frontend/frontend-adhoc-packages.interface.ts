import { Subscription } from 'rxjs';

import { SecurityTableRowDTO } from 'FEModels/frontend-models.interface';
import { QuoteMetricBlock } from 'FEModels/frontend-blocks.interface';


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
  tWoW: number;
  gWoW: number;
  tMoM: number;
  gMoM: number;
  tYtD: number;
  gYtD: number;
}