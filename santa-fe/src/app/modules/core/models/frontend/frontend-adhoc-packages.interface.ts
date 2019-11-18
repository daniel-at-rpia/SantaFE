import {
  SecurityTableRowDTO
} from 'FEModels/frontend-models.interface';

import {
  QuoteMetricBlock
} from 'FEModels/frontend-blocks.interface';


export interface ClickedSortQuotesByMetricEmitterParams {
  targetRow: SecurityTableRowDTO;
  targetBlock: QuoteMetricBlock;
  targetMetricLabel: string; 
}