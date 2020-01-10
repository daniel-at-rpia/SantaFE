import { Component, ViewEncapsulation, NgZone, AfterViewInit, OnDestroy } from "@angular/core";
import { GraphService } from 'Core/services/GraphService';
import { UtilityService } from 'Core/services/UtilityService';
import { selectSelectedSecurityForAnalysis, selectSecurityTableRowDTOListForAnalysis, selectBestQuoteValidWindow } from 'Trade/selectors/trade.selectors';
import { Store, select } from '@ngrx/store';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { PayloadObligorSecurityIDs } from 'BEModels/backend-payloads.interface';
import { SecurityDTO } from 'App/modules/core/models/frontend/frontend-models.interface';
import { DTOService } from 'Core/services/DTOService';
import { tap, first } from 'rxjs/operators';
import { TradeSecurityIDsFromAnalysisEvent } from 'Trade/actions/trade.actions';
import { TriCoreMetricConfig } from 'Core/constants/coreConstants.constant';
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
    private zone: NgZone,
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
      select(selectSecurityTableRowDTOListForAnalysis)
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

    const payload: PayloadObligorSecurityIDs = {
      identifier: this.state.obligorSecurityID,
      lookbackHrs: this.state.lookBackHours
    };
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
                    CurrentPosition: null,
                    CS01Local: null
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
        }
        // Dispatch a the list of security IDs from the related Obligor in serverReturn. This will call to trade-center-panel, which will return marks for those we own.
        if (securityIDsFromAnalysis) this.store$.dispatch(new TradeSecurityIDsFromAnalysisEvent(securityIDsFromAnalysis));
      }),
    ).subscribe();

  }

  private addBestMidToChartCategory(bEBestQuoteDTO: BESingleBestQuoteDTO): number {
    let mid: number = null;
    let rounding: number;

    if (this.state.metric.spread) rounding = TriCoreMetricConfig.Spread.rounding;

    if (bEBestQuoteDTO.bidQuoteValue !== null && bEBestQuoteDTO.askQuoteValue !== null) mid = (bEBestQuoteDTO.bidQuoteValue + bEBestQuoteDTO.askQuoteValue) / 2;
    else if (bEBestQuoteDTO.bidQuoteValue === null && bEBestQuoteDTO.askQuoteValue > 0) mid = bEBestQuoteDTO.askQuoteValue;
    else if (bEBestQuoteDTO.bidQuoteValue > 0 && bEBestQuoteDTO.askQuoteValue === null) mid = bEBestQuoteDTO.bidQuoteValue;

    if (bEBestQuoteDTO.quoteMetric) {
      if (bEBestQuoteDTO.quoteMetric.toString() === "Spread") {
        mid = this.utility.round(mid, rounding);
      }
    }

    return mid;
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
            eachCategoryItem.data.CurrentPosition = eachSecurity.data.positionCurrent;
            eachCategoryItem.data.CS01Local = eachSecurity.data.cs01Local;
          }
        })
      })
    })

    // Once we assign the marks, we have all the information we need to build the chart.
    this.graphService.buildObligorChart(this.state);
  }

  public btnCS01Click() {
    this.state.markValue.quantity = false;
    if (this.state.markValue.cS01) this.state.markValue.cS01 = false;
    else if (this.state.markValue.cS01 === false) this.state.markValue.cS01 = true;

    this.updateObligorChartCategories();
  }

  public btnQuantityClick() {
    this.state.markValue.cS01 = false;
    if (this.state.markValue.quantity) this.state.markValue.quantity = false;
    else if (this.state.markValue.quantity === false) this.state.markValue.quantity = true;

    this.updateObligorChartCategories();
  }

  public btnSpreadClick() {
    this.state.metric.yield = false;
    if (this.state.metric.spread === false) this.state.metric.spread = true;

    this.redrawObligorChart();
  }

  public btnYieldClick() {
    this.state.metric.spread = false;
    if (this.state.metric.yield === false) this.state.metric.yield = true;

    this.redrawObligorChart();
  }

  private initializeState() {
    this.state = {
      obligorChart: null,
      obligorSecurityID: null,
      obligorName: null,
      obligorCurrency: null,
      securityTableRowDTOList: [],
      lookBackHours: 2,
      yAxis: {
        start: null,
        end: null,
      },
      xAxis: {
        start: null,
        end: null,
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

  private updateObligorChartCategories()
  {
    for (let seriesIndex in this.state.obligorChart.series.values) {
      for (let chartCategory in this.state.chartCategories) {
        if (this.state.obligorChart.series.values[seriesIndex].name == this.state.chartCategories[chartCategory].data.name) {
          this.state.chartCategories[chartCategory].state.isHidden = this.state.obligorChart.series.values[seriesIndex].isHidden;
        }
      }
    }

    this.state.obligorChart = this.graphService.clearGraphSeries(this.state.obligorChart);

    for (let category in this.state.chartCategories) {
      if (this.state.chartCategories[category].data.obligorCategoryDataItemDTO.length > 0) this.graphService.addCategoryToObligorGraph(this.state.chartCategories[category], this.state);
    }

    this.graphService.zoomObligorChartAxesToCurrentState(this.state);
  } 

  private redrawObligorChart()
  {
    for (let seriesIndex in this.state.obligorChart.series.values) {
      for (let chartCategory in this.state.chartCategories) {
        if (this.state.obligorChart.series.values[seriesIndex].name == this.state.chartCategories[chartCategory].data.name) {
          this.state.chartCategories[chartCategory].state.isHidden = this.state.obligorChart.series.values[seriesIndex].isHidden;
        }
      }
    }

    this.state.obligorChart.dispose();
    this.graphService.buildObligorChart(this.state);
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
}