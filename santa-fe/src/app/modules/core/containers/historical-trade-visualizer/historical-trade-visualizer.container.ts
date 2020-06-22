  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';

    import { HistoricalTradeVisualizerDTO } from 'FEModels/frontend-models.interface';
    import { TradeHistoryHeaderConfigList } from 'Core/constants/securityTableConstants.constant';
    import { FilterOptionsPortfolioList } from 'Core/constants/securityDefinitionConstants.constant';
    import { GraphService } from 'Core/services/GraphService';
  //

@Component({
  selector: 'historical-trade-visualizer',
  templateUrl: './historical-trade-visualizer.container.html',
  styleUrls: ['./historical-trade-visualizer.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class HistoricalTradeVisualizer implements OnDestroy, OnChanges {
  @Input() historyData: HistoricalTradeVisualizerDTO;
  @Input() showGraph: boolean;
  private showGraphReceived: boolean;
  
  public constants = {
    headerConfigList: TradeHistoryHeaderConfigList,
    portfolioList: FilterOptionsPortfolioList
  };

  constructor(private graphService: GraphService) {} 

  public ngOnDestroy() {
    if (this.historyData.graph.timeSeries) {
      this.graphService.destoryGraph(this.historyData.graph.timeSeries);
      this.historyData.graph.timeSeries = null;
    }
  }

  public ngOnChanges() {
    if (!!this.showGraph && !this.showGraphReceived) {
      this.showGraphReceived = true;
      const renderGraphs = () => {
        if (!this.historyData.graph.timeSeries) {
          this.historyData.graph.timeSeries = this.graphService.generateTradeHistoryTimeSeries(this.historyData);
        }
      };
      setTimeout(renderGraphs.bind(this), 1);
    }
  }

  public onTogglePortfolio(targetPortfolio) {
    if (!!targetPortfolio && this.historyData.state.disabledPortfolio.indexOf(targetPortfolio) < 0) {
      if (this.historyData.state.selectedPortfolio.includes(targetPortfolio)) {
        this.historyData.state.selectedPortfolio = this.historyData.state.selectedPortfolio.filter((eachPortfolio) => {
          return eachPortfolio != targetPortfolio;
        });
      } else {
        this.historyData.state.selectedPortfolio.push(targetPortfolio);
      }
      this.historyData.data.displayTradeList = this.historyData.data.prinstineTradeList.filter((eachTrade) => {
        return this.historyData.state.selectedPortfolio.includes(eachTrade.data.vestedPortfolio);
      });
    }
  }
  
}