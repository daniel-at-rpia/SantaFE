  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, AfterViewInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
    import * as moment from 'moment';
    import { TradeHistoryHeaderConfigList } from 'Core/constants/securityTableConstants.constant';
    import { FilterOptionsPortfolioList } from 'Core/constants/securityDefinitionConstants.constant';
    import { GraphService } from 'Core/services/GraphService';
    import { DTOs } from 'App/modules/core/models/frontend';
  //

@Component({
  selector: 'historical-trade-visualizer',
  templateUrl: './historical-trade-visualizer.container.html',
  styleUrls: ['./historical-trade-visualizer.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class HistoricalTradeVisualizer implements OnDestroy, OnChanges {
  @Input() historyData: DTOs.HistoricalTradeVisualizerDTO;
  @Input() showGraph: boolean;
  @Output() allTradeHistoryData = new EventEmitter<boolean>();
  
  public constants = {
    headerConfigList: TradeHistoryHeaderConfigList,
    filterList: [...FilterOptionsPortfolioList, 'MoM', 'YoY', 'QoQ']
  };

  constructor(private graphService: GraphService) {} 

  public ngOnDestroy() {
    // if (this.historyData.graph.timeSeries) {
      // this.graphService.destoryGraph(this.historyData.graph.timeSeries);
      // this.historyData.graph.timeSeries = null;
    // }
    this.historyData.state.isGraphReceived = false;
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
    if (!!this.showGraph && !this.historyData.state.isGraphReceived) {
      const renderGraphs = () => {
        if (!this.historyData.graph.positionPie) {
          this.historyData.state.isGraphReceived = true;
          // this.historyData.graph.timeSeries = this.graphService.generateTradeHistoryTimeSeries(this.historyData);
          this.historyData.graph.positionPie = this.graphService.generateTradeHistoryPositionPie(this.historyData);
          this.historyData.graph.volumeLeftPie = this.graphService.generateTradeHistoryVolumeLeftPie(this.historyData);
          this.historyData.graph.volumeRightPie = this.graphService.generateTradeHistoryVolumeRightPie(this.historyData);
        }
      };
      setTimeout(renderGraphs.bind(this), 100);
    }
  }

  public onToggleFilter(targetFilter: string) {
    if (!!targetFilter && this.historyData.data.disabledFilters.indexOf(targetFilter) < 0) {
      if (this.historyData.data.selectedFilters.includes(targetFilter)) {
        this.historyData.data.selectedFilters = this.historyData.data.selectedFilters.filter((eachPortfolio) => {
          return eachPortfolio != targetFilter;
        });
      } else {
        this.historyData.data.selectedFilters.push(targetFilter);
      }
      this.historyData.data.displayTradeList = this.updateHistoricalTradeDisplayList(this.historyData.data.selectedFilters, this.historyData.data.prinstineTradeList);
    }
  }

  public getAllTradeHistory() {
    this.historyData.state.isShowAllTradeHistory = true;
    this.historyData && this.allTradeHistoryData.emit(true);
  }

  private checkIfTradeOccursWithinFilteredInterval(
    latestDate: string,
    targetDate: string,
    interval: string
  ): boolean {
    const months = this.getMonthsFromSelectedInterval(interval);
    const formattedLatestDate = moment(latestDate).format('YYYY-MM-DD');
    const formattedEarliestDate = moment(formattedLatestDate).subtract(months, 'months').format('YYYY-MM-DD');
    const formattedTargetDate = moment(targetDate).format('YYYY-MM-DD');
    if (formattedTargetDate === formattedEarliestDate || formattedTargetDate === formattedLatestDate) {
      return true;
    } else {
      return moment(targetDate).isBetween(formattedEarliestDate, formattedLatestDate, undefined, "[]");
    }
  }

  private getMonthsFromSelectedInterval(interval: string): number {
    let months: number;
    switch(interval) {
      case 'QoQ':
        months = 3;
        break;
      case 'YoY':
        months = 12;
        break;
      default:
        months = 1;
    }
    return months;
  }

  private updateHistoricalTradeDisplayList(
    selectedFilters: Array<string>,
    prinstineList: Array<DTOs.TradeDTO>
  ): Array<DTOs.TradeDTO> {
    if (selectedFilters.length > 0) {
      const filtersByCategory = {
        portfolios: [],
        intervals: []
      };
      selectedFilters.forEach((filter: string) => {
        const isPortfolio = FilterOptionsPortfolioList.includes(filter);
        filtersByCategory[isPortfolio ? 'portfolios': 'intervals'].push(filter);
      })
      const newHistoricalTradeDisplayList = prinstineList.filter((eachTrade: DTOs.TradeDTO) => {
        const isSelectedPortfolio = filtersByCategory.portfolios.length > 0 ? filtersByCategory.portfolios.includes(eachTrade.data.vestedPortfolio) : false;
        if (filtersByCategory.intervals.length > 0) {
          const latestDate = moment().format('YYYY-MM-DD');
          const isSelectedTimeInterval = !!filtersByCategory.intervals.find((interval: string) => this.checkIfTradeOccursWithinFilteredInterval(latestDate, moment.unix(eachTrade.data.tradeDateTime).format('YYYY-MM-DD'), interval));
          return isSelectedPortfolio ? isSelectedPortfolio && isSelectedTimeInterval : isSelectedTimeInterval;
        } else {
          return isSelectedPortfolio;
        }
      })
      return newHistoricalTradeDisplayList;
    } else {
      return [];
    }
  }
}