import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { TraceTradesVisualizerDTO } from 'Core/models/frontend/frontend-models.interface';
import { TradeTraceHeaderConfigList } from 'Core/constants/securityTableConstants.constant'

@Component({
  selector: 'trace-trade-visualizer',
  templateUrl: './trace-trade-visualizer.container.html',
  styleUrls: ['./trace-trade-visualizer.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TraceTradeVisualizer {
  @Input() traceTrades: TraceTradesVisualizerDTO;
  constants = {
    headerConfigList: TradeTraceHeaderConfigList
  }
  constructor() {};
}