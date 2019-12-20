import { Component, ViewEncapsulation, NgZone } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { GraphService } from 'Core/services/GraphService';
import { UtilityService } from 'Core/services/UtilityService';
import { selectSelectedSecurityForAnalysis, securityTableRowDTOListForAnalysis } from 'Trade/selectors/trade.selectors';
import { Store, select } from '@ngrx/store';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { PayloadObligorSecurityIDs } from 'BEModels/backend-payloads.interface';
import { SecurityDTO, QuantComparerDTO } from 'App/modules/core/models/frontend/frontend-models.interface';
import { DTOService } from 'Core/services/DTOService';
import { tap, first, delay, catchError, withLatestFrom, filter, sample } from 'rxjs/operators';
import { TradeSecurityIDsFromAnalysisEvent } from 'Trade/actions/trade.actions';
import { TriCoreMetricConfig } from 'Core/constants/coreConstants.constant';
import { TradeMarketAnalysisPanelState, TradeObligorGraphPanelState } from 'FEModels/frontend-page-states.interface';
import { BestQuotesDTO, ObligorChartCategoryDTO, ObligorCategoryDataItemDTO } from 'FEModels/frontend-models.interface';
import { BEBestQuoteDTO } from 'App/modules/core/models/backend/backend-models.interface';
import { ObligorChartCategoryColorScheme } from 'App/modules/core/constants/colorSchemes.constant';

@Component({
  selector: 'trade-obligor-graph-panel',
  templateUrl: './trade-obligor-graph-panel.container.html',
  styleUrls: ['./trade-obligor-graph-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeObligorGraphPanel {
  state: TradeObligorGraphPanelState;
  subscriptions = {
    selectSecurityUpdateForAnalysis: null,
    selectSecurityTableRowDTOListForAnalysis: null
  }

  constructor(
    private store$: Store<any>,
    private zone: NgZone,
    private graphService: GraphService,
    private restfulCommService: RestfulCommService,
    private utility: UtilityService,
    private dtoService: DTOService
  ) {
    this.state = {
      obligorChart: am4charts.XYChart,
      obligorSecurityID: null,
      obligorName: "DEUTSCHE BANK AG EUR",
      obligorCurrency: null,
      securityTableRowDTOList: [],
      metric: {
        spread: true,
        yield: false
      },
      markValue: {
        cS01: false,
        quantity: true
      },
      xAxisData: [],
      yAxisData: [],
      activeCharts: {
        srBond: false,
        subBond: false,
        srCDS: false,
        subCDS: false
      },
      chartCategories: []
    }
  }

  fetchSecurityIDs(data: SecurityDTO) {

    let securityIDList: string[] = [];
    let chartCategory = null;
    this.state.chartCategories = [];

    if (data != null) {
      this.state.obligorSecurityID = data.data.securityID;
      const payload: PayloadObligorSecurityIDs = {
        identifier: data.data.securityID
      };
      this.restfulCommService.callAPI('SantaCurve/get-santa-obligor-curves-per-ccy', { req: 'POST' }, payload).pipe(
        first(),
        tap((serverReturn) => {
          for (let curve in serverReturn) {
            // Initialize a null chart category.
            chartCategory = this.dtoService.formObligorChartCategoryDTO(true, null, null, null, true);

            // Set the name of the chart category to SENIORITY / COUPON / TYPE
            // We might want to change this to use the groupIdentifier object in serverReturn.
            chartCategory.data.name = serverReturn[curve].seniority + " " + serverReturn[curve].couponType + " " + serverReturn[curve].curveType;
            chartCategory.data.color = this.getObligorChartCategoryColorFromScheme(chartCategory.data.name);

            // Set the MID data for the category.
            for (let bestQuote in serverReturn[curve].bestQuotes) {
              if (this.state.obligorSecurityID === bestQuote) chartCategory.state.isHidden = false;

              if (bestQuote !== null) {
                let categoryDataItem: ObligorCategoryDataItemDTO = {
                  data: {
                    name: serverReturn[curve].securities[bestQuote].name,
                    securityID: bestQuote,
                    mid: this.addBestSpreadMidToChartCategory(serverReturn[curve].bestQuotes[bestQuote].bestSpreadQuote),
                    mark: null,
                    workoutTerm: serverReturn[curve].securities[bestQuote].metrics.workoutTerm,
                    positionCurrent: null
                  },
                  state: {}
                }

                chartCategory.data.obligorCategoryDataItemDTO.push(categoryDataItem);
                securityIDList.push(bestQuote);

                // Populate the YAxis with the mid.
                this.state.yAxisData.push(categoryDataItem.data.mid);

                // Pupulate the XAxis with the workout Term.
                this.state.xAxisData.push({ workoutTerm: categoryDataItem.data.workoutTerm });
              }
            }

            this.state.chartCategories.push(chartCategory);
          }
          // Dispatch a the list of security IDs from the related Obligor in serverReturn. This will call to trade-center-panel, which will return marks for those we own.
          if (securityIDList.length > 0) this.store$.dispatch(new TradeSecurityIDsFromAnalysisEvent(securityIDList));
        }),
      ).subscribe();

      // TODO: Error handling for API call.
    }
  }

  getObligorChartCategoryColorFromScheme(obligorCategoryType: string): string {
    let color: string = null;
    let colorSchemes = ObligorChartCategoryColorScheme;
    for (let scheme in colorSchemes.categoryScheme) {
      if (colorSchemes.categoryScheme[scheme].label === obligorCategoryType) color = colorSchemes.categoryScheme[scheme].value;
    }

    if (color === null) color = '#000000';
    return color;
  }

  addBestYieldMidQuoteToChartCategory(securityID: string, bEBestQuoteDTO: any): any[] {
    let bestQuoteData: any[] = [];
    let spreadRounding = TriCoreMetricConfig['Yield']['rounding'];

    let yieldMid = null;

    // TODO: I have not added Yield logic yet.

    return bestQuoteData;
  }

  addBestSpreadMidToChartCategory(bEBestQuoteDTO: any): any {
    let mid: number = null;
    let spreadRounding = TriCoreMetricConfig['Spread']['rounding'];

    if (bEBestQuoteDTO.bidQuoteValue !== null && bEBestQuoteDTO.askQuoteValue !== null) mid = (bEBestQuoteDTO.bidQuoteValue + bEBestQuoteDTO.askQuoteValue) / 2;
    else if (bEBestQuoteDTO.bidQuoteValue === null && bEBestQuoteDTO.askQuoteValue > 0) mid = bEBestQuoteDTO.askQuoteValue
    else if (bEBestQuoteDTO.bidQuoteValue > 0 && bEBestQuoteDTO.askQuoteValue === null) mid = bEBestQuoteDTO.bidQuoteValue

    mid = this.utility.round(mid, spreadRounding);

    return mid;
  }

  ngAfterViewInit() {
    this.subscriptions.selectSecurityUpdateForAnalysis = this.store$.pipe(select(selectSelectedSecurityForAnalysis)).subscribe((data) => { this.fetchSecurityIDs(data) });
    this.subscriptions.selectSecurityTableRowDTOListForAnalysis = this.store$.pipe(select(securityTableRowDTOListForAnalysis)).subscribe((data) => { this.state.securityTableRowDTOList = data; this.addMarksTochartCategory() });
  }

  private addMarksTochartCategory() {
    // This method will loop through the list of obligor security IDs and assign a mark to those we own.
    // TODO: Optimize this loop? These fields should not hold many indexes, but could be done better.
    for (let category in this.state.chartCategories) {
      for (let categoryDataItem in this.state.chartCategories[category].data.obligorCategoryDataItemDTO) {
        for (let security in this.state.securityTableRowDTOList) {
          if (this.state.securityTableRowDTOList[security].data.security.data.securityID === this.state.chartCategories[category].data.obligorCategoryDataItemDTO[categoryDataItem].data.securityID) {
            this.state.chartCategories[category].data.obligorCategoryDataItemDTO[categoryDataItem].data.mark = this.state.securityTableRowDTOList[security].data.security.data.mark.mark;
            this.state.chartCategories[category].data.obligorCategoryDataItemDTO[categoryDataItem].data.positionCurrent = this.state.securityTableRowDTOList[security].data.security.data.positionCurrent;
            // Insert the mark in our XAxis data fields.
            this.state.yAxisData.push(this.state.chartCategories[category].data.obligorCategoryDataItemDTO[categoryDataItem].data.mark);
          }
        }
      }
    }

    // Once we assign the marks, we have all the information we need to build the chart.
    this.buildChart();
  }

  private buildChart() {
    this.zone.runOutsideAngular(() => {

      // Initialize the chart as XY.
      this.state.obligorChart = am4core.create("chartdiv", am4charts.XYChart);

      // Initialize axes for the chart.
      this.graphService.initializeObligorChartAxes(this.state.xAxisData, this.state.yAxisData, this.state.obligorChart);

      // TODO: This part is incomplete. Right now this chart only handles quantity.
      // Each chart category DTO has its own "isMarkHidden" field which should be used.
      let displayMark: boolean = false;
      if (this.state.markValue.cS01 === true || this.state.markValue.quantity === true) {
        displayMark = true;
      }

      //Draw each chart category.
      for (let category in this.state.chartCategories) {
        if (this.state.chartCategories[category].data.obligorCategoryDataItemDTO.length > 0) this.graphService.addCategoryToObligorGraph(this.state.obligorChart, this.state.chartCategories[category]);
      }

      // Add legend for each chart type.
      this.state.obligorChart.legend = new am4charts.Legend();

      // Add a cursor to the chart, with zoom behaviour. 
      this.state.obligorChart.cursor = new am4charts.XYCursor();
      this.state.obligorChart.cursor.behavior = "zoomXY";
      this.state.obligorChart.cursor.lineX.disabled = true;
      this.state.obligorChart.cursor.lineY.disabled = true;

      // Zoom out button
      this.state.obligorChart.zoomOutButton.align = "left";
      this.state.obligorChart.zoomOutButton.valign = "top";

    });
  }

  btnCS01Click() {
    this.state.markValue.cS01 = false;
    if (this.state.markValue.cS01) this.state.markValue.cS01 = false;
    else if (this.state.markValue.cS01 === false) this.state.markValue.cS01 = true;

    // TODO: CS01 is not yet supported.
  }

  btnQuantityClick() {
    this.state.markValue.cS01 = false;
    if (this.state.markValue.quantity) this.state.markValue.quantity = false;
    else if (this.state.markValue.quantity === false) this.state.markValue.quantity = true;

    let displayMark: boolean = false;
    if (this.state.markValue.quantity) displayMark = true

    for (let categoryIndex in this.state.obligorChart.series.values) {
      if (this.state.obligorChart.series.values[categoryIndex].isHidden === false) this.state.chartCategories[categoryIndex].state.isHidden = false;
      this.state.chartCategories[categoryIndex].state.isMarkHidden = displayMark;
    }

    this.state.obligorChart.series.clear();

    // Generate a graph for each data type, sending in the raw data,  the color scheme and the name.
    for (let category in this.state.chartCategories) {
      if (this.state.chartCategories[category].data.obligorCategoryDataItemDTO.length > 0) this.graphService.addCategoryToObligorGraph(this.state.obligorChart, this.state.chartCategories[category]);
    }
  }

}