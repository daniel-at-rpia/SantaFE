import { Subscription } from 'rxjs';

import * as am4charts from "@amcharts/amcharts4/charts";
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
  tWow: number;
  gWow: number;
  tMom: number;
  gMom: number;
  tYtd: number;
  gYtd: number;
}

export interface ObligorChartBlock {
  name: string;
  chart: am4charts.XYChart;
  rawData: any[];
  colorScheme: string;
}
