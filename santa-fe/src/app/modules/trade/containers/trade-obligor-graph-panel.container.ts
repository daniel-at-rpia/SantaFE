import { Component, ViewEncapsulation, NgZone, AfterViewInit, OnDestroy } from "@angular/core";
import { GraphService } from 'Core/services/GraphService';
import { UtilityService } from 'Core/services/UtilityService';
import { 
  selectSelectedSecurityForAnalysis,
  selectSecurityTableRowDTOListForAnalysis,
  selectBestQuoteValidWindow
} from 'Trade/selectors/trade.selectors';
import { Store, select } from '@ngrx/store';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { PayloadObligorSecurityIDs } from 'BEModels/backend-payloads.interface';
import { SecurityDTO } from 'App/modules/core/models/frontend/frontend-models.interface';
import { DTOService } from 'Core/services/DTOService';
import { tap, first, delay } from 'rxjs/operators';
import { TradeSecurityIDsFromAnalysisEvent } from 'Trade/actions/trade.actions';
import { TriCoreDriverConfig } from 'Core/constants/coreConstants.constant';
import { TradeObligorGraphPanelState } from 'FEModels/frontend-page-states.interface';
import { ObligorCategoryDataItemBlock } from 'FEModels/frontend-blocks.interface';
import { ObligorChartCategoryColorScheme } from 'App/modules/core/constants/colorSchemes.constant';
import { BESingleBestQuoteDTO } from 'App/modules/core/models/backend/backend-models.interface';


@Component({
  selector: 'trade-obligor-graph-panel',
  templateUrl: './trade-obligor-graph-panel.container.html',
  styleUrls: ['./trade-obligor-graph-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeObligorGraphPanel implements AfterViewInit, OnDestroy {
  state: TradeObligorGraphPanelState;
  subscriptions = {
    selectSecurityUpdateForAnalysis: null,
    selectSecurityTableRowDTOListForAnalysis: null,
    selectBestQuoteValidWindow: null
  }

  constructor(
    private store$: Store<any>,
    private graphService: GraphService,
    private restfulCommService: RestfulCommService,
    private utility: UtilityService,
    private dtoService: DTOService
  ) {
    this.initializeState();
  }

  public ngAfterViewInit() {
    
    this.subscriptions.selectBestQuoteValidWindow = this.store$.pipe(
      select(selectBestQuoteValidWindow)
    ).subscribe((data) => {
      this.state.lookBackHours = data;
    });

    this.subscriptions.selectSecurityUpdateForAnalysis = this.store$.pipe(
      select(selectSelectedSecurityForAnalysis)
    ).subscribe((data) => {
      this.setObligorSecurityID(data)
    });

    this.subscriptions.selectSecurityTableRowDTOListForAnalysis = this.store$.pipe(
      select(selectSecurityTableRowDTOListForAnalysis),
      delay(500)
    ).subscribe((data) => {
      this.state.securityTableRowDTOList = data;
      this.addMarksTochartCategory()
    });

  }

  private setObligorSecurityID(data: SecurityDTO) {
    if (data) this.state.obligorSecurityID = data.data.securityID;
    if (this.state.obligorSecurityID) this.fetchSecurityIDs();
  }

  public ngOnDestroy() {
    if (this.state.obligorChart) this.state.obligorChart.dispose();
    this.initializeState();
  }

  private fetchSecurityIDs() {

    let securityIDsFromAnalysis: string[] = [];
    let chartCategory = null;
    this.state.chartCategories = [];
    let payload: PayloadObligorSecurityIDs;

    if (this.state.lookBackHours){
      payload = {
        identifier: this.state.obligorSecurityID,
        lookbackHrs: this.state.lookBackHours
      };
    } else {
      payload = {
        identifier: this.state.obligorSecurityID,
      };
    } 
  
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getObligorCurves, { req: 'POST' }, payload).pipe(
      first(),
      tap((serverReturn) => {

        // TODO: Create a backend-model.interface for payload. This would get rid of this first loop.
        for (let curve in serverReturn) {
          // Initialize a null chart category.
          chartCategory = this.dtoService.formObligorChartCategoryDTO(true, null, null, null, true);

          // Set the name of the chart category to SENIORITY / COUPON / TYPE
          // We might want to change this to use the groupIdentifier object in serverReturn.
          chartCategory.data.name = serverReturn[curve].seniority + " " + serverReturn[curve].couponType + " " + serverReturn[curve].securityType;
          chartCategory.data.color = this.getObligorChartCategoryColorFromScheme(chartCategory.data.name);

          // Set the MID data for the category.
          for (let security in serverReturn[curve].bestQuotes) {

            if (security !== null) {

              let spreadMid = this.addBestMidToChartCategory(serverReturn[curve].bestQuotes[security].bestSpreadQuote);
              let yieldMid = this.addBestMidToChartCategory(serverReturn[curve].bestQuotes[security].bestYieldQuote);

              if (yieldMid || spreadMid) {

                if (this.state.obligorSecurityID === security) chartCategory.state.isHidden = false;

                this.state.obligorName = serverReturn[curve].securities[security].issuer + " " + serverReturn[curve].securities[security].ccy;

                let categoryDataItem: ObligorCategoryDataItemBlock = {
                  data: {
                    name: serverReturn[curve].securities[security].name,
                    securityID: security,
                    spreadMid: spreadMid,
                    yieldMid: yieldMid,
                    mark: null,
                    workoutTerm: serverReturn[curve].securities[security].metrics.workoutTerm,
                    currentPosition: null,
                    cS01: null
                  },
                  state: {}
                }

                chartCategory.data.obligorCategoryDataItemDTO.push(categoryDataItem);

                //Populate list of securityIDs to be sent to trade-center-panel.
                securityIDsFromAnalysis.push(security);
              }
            }
          }

          this.state.chartCategories.push(chartCategory);

          for (let seriesIndex in this.state.obligorChart.series.values) {
            for (let chartCategory in this.state.chartCategories) {
              if (this.state.obligorChart.series.values[seriesIndex].name == this.state.chartCategories[chartCategory].data.name) {
                this.state.chartCategories[chartCategory].state.isHidden = this.state.obligorChart.series.values[seriesIndex].isHidden;
      
                if(this.state.metric.yield) this.state.chartCategories[chartCategory].state.isMarkHidden = true;
                else if(this.state.metric.spread)
                {
                  if(this.state.markValue.cS01 || this.state.markValue.quantity) this.state.chartCategories[chartCategory].state.isMarkHidden = false;
                }
              }
            }
          }
        }

        this.graphService.clearGraphSeries(this.state.obligorChart);
        // Dispatch a the list of security IDs from the related Obligor in serverReturn. This will call to trade-center-panel, which will return marks for those we own.
        if (securityIDsFromAnalysis) this.store$.dispatch(new TradeSecurityIDsFromAnalysisEvent(securityIDsFromAnalysis));
      }),
    ).subscribe();

  }

  private addBestMidToChartCategory(bEBestQuoteDTO: BESingleBestQuoteDTO): number {
    if (!!bEBestQuoteDTO) {
      let mid: number = null;
      let rounding: number;
      if (bEBestQuoteDTO.bidQuoteValue !== null && bEBestQuoteDTO.askQuoteValue !== null) mid = (bEBestQuoteDTO.bidQuoteValue + bEBestQuoteDTO.askQuoteValue) / 2;
      else if (bEBestQuoteDTO.bidQuoteValue === null && bEBestQuoteDTO.askQuoteValue > 0) mid = bEBestQuoteDTO.askQuoteValue;
      else if (bEBestQuoteDTO.bidQuoteValue > 0 && bEBestQuoteDTO.askQuoteValue === null) mid = bEBestQuoteDTO.bidQuoteValue;
      if (bEBestQuoteDTO.quoteMetric) {
        if (bEBestQuoteDTO.quoteMetric === "Spread") {
          TriCoreDriverConfig.Spread.rounding;
          mid = this.utility.round(mid, rounding);
        }
        else if (bEBestQuoteDTO.quoteMetric === "Yield") {
          mid = Math.round(mid * 1000 ) / 1000
        }
      }
      return mid;
    } else {
      return null;
    }
  }

  private addMarksTochartCategory() {
    // This method will loop through the list of obligor security IDs and assign a mark to those we own.
    this.state.chartCategories.forEach((eachCategory) => {
      eachCategory.data.obligorCategoryDataItemDTO.forEach((eachCategoryItem) => {
        this.state.securityTableRowDTOList.forEach((eachRow) => {
          const eachSecurity = eachRow.data.security;
          if (!!eachSecurity && eachCategoryItem.data.securityID === eachSecurity.data.securityID) {
            if (this.state.metric.spread) {
              eachCategoryItem.data.mark = eachSecurity.data.mark.mark;
            }
            else if (this.state.metric.yield) {
              eachCategory.state.isMarkHidden = true;
            }
            eachCategoryItem.data.currentPosition = eachSecurity.data.positionCurrent;
            eachCategoryItem.data.cS01 = Math.round(eachSecurity.data.cs01CadFirm);
          }
        })
      })
    })

    // Reset the zoom state before drawing a new graph.
    this.resetZoomState();
    // Once we assign the marks, we have all the information we need to build the chart.
    this.graphService.buildObligorChart(this.state);
  }

  public btnCS01Click() {
    this.state.markValue.quantity = false;
    if (this.state.markValue.cS01) this.state.markValue.cS01 = false;
    else if (this.state.markValue.cS01 === false) this.state.markValue.cS01 = true;

    this.state.axesZoomState = this.graphService.captureXYChartCurrentZoomState(this.state.obligorChart, this.state);
    this.updateObligorChartCategoryData();

  }

  public btnQuantityClick() {
    this.state.markValue.cS01 = false;
    if (this.state.markValue.quantity) this.state.markValue.quantity = false;
    else if (this.state.markValue.quantity === false) this.state.markValue.quantity = true;

    this.state.axesZoomState = this.graphService.captureXYChartCurrentZoomState(this.state.obligorChart, this.state);
    this.updateObligorChartCategoryData();
  }

  public btnSpreadClick() {
    this.state.metric.yield = false;
    this.state.metric.spread = true;

    this.redrawObligorChartCategories();
  }

  public btnYieldClick() {
    this.state.metric.spread = false;
    this.state.metric.yield = true;

    this.redrawObligorChartCategories();
  }

  private initializeState() {
    this.state = {
      obligorChart: null,
      obligorSecurityID: null,
      obligorName: null,
      obligorCurrency: null,
      securityTableRowDTOList: [],
      lookBackHours: 2,
      axesZoomState: {
        xAxis: {
          start: null,
          end: null,
          fullZoomStart: null,
          fullZoomEnd: null
        },
        yAxis: {
          start: null,
          end: null,
          fullZoomStart: null,
          fullZoomEnd: null
        }
      },
      metric: {
        spread: true,
        yield: false
      },
      markValue: {
        cS01: false,
        quantity: true
      },
      activeCharts: {
        srBond: false,
        subBond: false,
        srCDS: false,
        subCDS: false
      },
      chartCategories: []
    }
  }

  public updateObligorChartCategoryData() {
    for (let category in this.state.chartCategories) {
      if (this.state.chartCategories[category].data.obligorCategoryDataItemDTO.length > 0) {
        let data: any[] = this.graphService.buildObligorChartData(this.state.chartCategories[category], this.state);
        this.state.obligorChart.series.values[category].data = data;
        this.state.obligorChart.series.values[category].validateData();
      }
    }
    this.state.obligorChart.validateData();
  }

  private redrawObligorChartCategories() {
    this.resetZoomState();

    for (let seriesIndex in this.state.obligorChart.series.values) {
      for (let chartCategory in this.state.chartCategories) {
        if (this.state.obligorChart.series.values[seriesIndex].name == this.state.chartCategories[chartCategory].data.name) {
          this.state.chartCategories[chartCategory].state.isHidden = this.state.obligorChart.series.values[seriesIndex].isHidden;

          if(this.state.metric.yield) this.state.chartCategories[chartCategory].state.isMarkHidden = true;
          else if(this.state.metric.spread)
          {
            if(this.state.markValue.cS01 || this.state.markValue.quantity) this.state.chartCategories[chartCategory].state.isMarkHidden = false;
          }
        }
      }
    }

    this.state.obligorChart.series.clear();
    for (let category in this.state.chartCategories) {
      this.graphService.addCategoryToObligorGraph(this.state.chartCategories[category], this.state);
      this.state.obligorChart.series.values[category].validateData();
    }

    this.state.obligorChart.validateData();
  }

  private getObligorChartCategoryColorFromScheme(obligorCategoryType: string): string {
    let color: string = null;
    let colorSchemes = ObligorChartCategoryColorScheme;
    for (let scheme in colorSchemes.categoryScheme) {
      if (colorSchemes.categoryScheme[scheme].label === obligorCategoryType) color = colorSchemes.categoryScheme[scheme].value;
    }

    if (color === null) color = '#000000';
    return color;
  }

  private resetZoomState(){
    this.state.axesZoomState.xAxis.start = null;
    this.state.axesZoomState.xAxis.end = null;
    this.state.axesZoomState.yAxis.start = null;
    this.state.axesZoomState.yAxis.end = null;
    this.state.axesZoomState.xAxis.fullZoomStart = null;
    this.state.axesZoomState.xAxis.fullZoomEnd = null;
    this.state.axesZoomState.yAxis.fullZoomStart = null;
    this.state.axesZoomState.yAxis.fullZoomEnd = null;
  }
}