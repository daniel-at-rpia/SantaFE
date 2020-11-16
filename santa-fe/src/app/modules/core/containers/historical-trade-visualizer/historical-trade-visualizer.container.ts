  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, AfterViewInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

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
  @Input() showAllTradeHistoryButton: boolean;
  @Output() allTradeHistoryData = new EventEmitter<boolean>();
  
  public constants = {
    headerConfigList: TradeHistoryHeaderConfigList,
    portfolioList: FilterOptionsPortfolioList
  };

  constructor(private graphService: GraphService) {} 

  public ngOnDestroy() {
    // if (this.historyData.graph.timeSeries) {
      // this.graphService.destoryGraph(this.historyData.graph.timeSeries);
      // this.historyData.graph.timeSeries = null;
    // }
    this.historyData.state.graphReceived = false;
    try {
      this.graphService.destroyMultipleGraphs(this.historyData.graph);
    } catch(err) {
      if (err && err.message == 'EventDispatcher is disposed') {
        console.log('dispose misbehavior captured');
      } else {
        console.warn('new amchart error', err);
      }
    }
  }

  public ngOnChanges() {
    if (!!this.showGraph && !this.historyData.state.graphReceived) {

      if (this.historyData.state.showAllTradeHistory) {
        this.showAllTradeHistoryButton = false;
      }
      const renderGraphs = () => {
        if (!this.historyData.graph.positionPie) {
          this.historyData.state.graphReceived = true;
          // this.historyData.graph.timeSeries = this.graphService.generateTradeHistoryTimeSeries(this.historyData);
          this.historyData.graph.positionPie = this.graphService.generateTradeHistoryPositionPie(this.historyData);
          this.historyData.graph.volumeLeftPie = this.graphService.generateTradeHistoryVolumeLeftPie(this.historyData);
          this.historyData.graph.volumeRightPie = this.graphService.generateTradeHistoryVolumeRightPie(this.historyData);
        }
      };
      setTimeout(renderGraphs.bind(this), 100);
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

  public getAllTradeHistory() {
    this.historyData && this.allTradeHistoryData.emit(true);
  }
}