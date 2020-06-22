  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

    import { HistoricalTradeVisualizerDTO } from 'FEModels/frontend-models.interface';
    import { TradeHistoryHeaderConfigList } from 'Core/constants/securityTableConstants.constant';
    import { FilterOptionsPortfolioList } from 'Core/constants/securityDefinitionConstants.constant';
  //

@Component({
  selector: 'historical-trade-visualizer',
  templateUrl: './historical-trade-visualizer.container.html',
  styleUrls: ['./historical-trade-visualizer.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class HistoricalTradeVisualizer {
  @Input() historyData: HistoricalTradeVisualizerDTO;
  
  public constants = {
    headerConfigList: TradeHistoryHeaderConfigList,
    portfolioList: FilterOptionsPortfolioList
  };

  constructor() {} 

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