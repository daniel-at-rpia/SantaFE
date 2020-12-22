import { Component, OnChanges, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { TraceTradesVisualizerDTO } from 'Core/models/frontend/frontend-models.interface';
import {
  TradeTraceHeaderConfigList,TradeSideValueEquivalent,
  traceTradePieGraphKeys,
  TraceTradePartyList
} from 'Core/constants/securityTableConstants.constant'
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
  @Output() filterOptionsList = new EventEmitter<string[]>();
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
        this.graphService.destroyMultipleGraphs(this.traceTrades.graph)
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
        if (!!this.showData && !this.traceTrades.state.graphReceived && this.traceTrades.data.displayList.length > 0 && !!this.traceTrades.state.showGraphs) {
          this.traceTrades.state.graphReceived = true;
          this.traceTrades.graph.scatterGraph = this.graphService.generateTradeTraceScatterGraph(this.traceTrades);
          this.traceTrades.graph.pieGraphLeft = this.graphService.generateTraceTradePieGraph(this.traceTrades, this.traceTrades.data.pieGraphLeftId, TraceTradePartyList, traceTradePieGraphKeys.contraParty);
          this.traceTrades.graph.pieGraphRight = this.graphService.generateTraceTradePieGraph(this.traceTrades, this.traceTrades.data.pieGraphRightId, [this.constants.sideValueEquivalent.buy, this.constants.sideValueEquivalent.sell], traceTradePieGraphKeys.side);
        }
      }
    }
    setTimeout(renderGraphs.bind(this), 100);
  }

  public onToggleTraceFilters(option: string) {
    if (!!option && !!this.filterOptionsList) {
      if (this.traceTrades.state.selectedFiltersList.includes(option)) {
        this.traceTrades.state.selectedFiltersList = this.traceTrades.state.selectedFiltersList.filter(selected => selected !== option);
      } else {
        this.traceTrades.state.selectedFiltersList.push(option);
      }
      this.filterOptionsList.emit(this.traceTrades.state.selectedFiltersList);
    }
  }
}