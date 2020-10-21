import { Component, OnChanges, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { TraceTradesVisualizerDTO } from 'Core/models/frontend/frontend-models.interface';
import { TradeTraceHeaderConfigList, TradeSideValueEquivalent } from 'Core/constants/securityTableConstants.constant'
import { GraphService } from 'Core/services/GraphService';

@Component({
  selector: 'trace-trade-visualizer',
  templateUrl: './trace-trade-visualizer.container.html',
  styleUrls: ['./trace-trade-visualizer.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TraceTradeVisualizer implements OnChanges, OnDestroy{
  @Input() traceTrades: TraceTradesVisualizerDTO;
  @Input() showData: boolean;
  constants = {
    headerConfigList: TradeTraceHeaderConfigList,
    sideValueEquivalent: {
      buy: TradeSideValueEquivalent.Bid,
      sell: TradeSideValueEquivalent.Ask
    }
  }
  constructor(private graphService: GraphService) {};
  public ngOnDestroy() {
    if (!!this.traceTrades) {
      this.traceTrades.state.graphReceived = false;
      try {
        if (this.traceTrades.graph.scatterGraph) {
          this.graphService.destoryGraph(this.traceTrades.graph.scatterGraph);
          this.traceTrades.graph.scatterGraph = null;
        }
        if (this.traceTrades.graph.pieGraph) {
          this.graphService.destoryGraph(this.traceTrades.graph.pieGraph);
          this.traceTrades.graph.pieGraph = null;
        }
      } catch (err) {
        if (err && err.message === 'EventDispatched is disposed') {
          console.log('dispose misbehavior captured');
        } else {
          console.warn('new amchart error', err)
        }
      }
    }
  }

  public ngOnChanges() {
    const renderGraphs = () => {
      if (!!this.traceTrades) {
        if (!!this.showData && !this.traceTrades.state.graphReceived) {
          this.traceTrades.state.graphReceived = true;
          this.traceTrades.graph.scatterGraph = this.graphService.generateTradeTraceScatterGraph(this.traceTrades);
          this.traceTrades.graph.pieGraph = this.graphService.generateTraceTradePieGraph(this.traceTrades)
        }
      }
    }
    setTimeout(renderGraphs.bind(this), 100);
  }
}