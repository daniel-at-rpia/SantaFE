  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

    import { HistoricalTradeVisualizerDTO } from 'FEModels/frontend-models.interface';
  //

@Component({
  selector: 'historical-trade-visualizer',
  templateUrl: './historical-trade-visualizer.container.html',
  styleUrls: ['./historical-trade-visualizer.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class HistoricalTradeVisualizer {
  @Input() historyData: HistoricalTradeVisualizerDTO;

  constructor() {} 
}