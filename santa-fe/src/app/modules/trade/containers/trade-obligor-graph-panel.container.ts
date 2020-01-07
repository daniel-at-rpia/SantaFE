import { Component, ViewEncapsulation, NgZone, AfterViewInit, OnDestroy } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { GraphService } from 'Core/services/GraphService';
import { UtilityService } from 'Core/services/UtilityService';
import { selectSelectedSecurityForAnalysis, selectSecurityTableRowDTOListForAnalysis } from 'Trade/selectors/trade.selectors';
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
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

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
    this.initializeState();
  }

  public ngAfterViewInit() {
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
      identifier: this.state.obligorSecurityID
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
                    positionCurrent: null
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

  private getObligorChartCategoryColorFromScheme(obligorCategoryType: string): string {
    let color: string = null;
    let colorSchemes = ObligorChartCategoryColorScheme;
    for (let scheme in colorSchemes.categoryScheme) {
      if (colorSchemes.categoryScheme[scheme].label === obligorCategoryType) color = colorSchemes.categoryScheme[scheme].value;
    }

    if (color === null) color = '#000000';
    return color;
  }

  private addBestMidToChartCategory(bEBestQuoteDTO: BESingleBestQuoteDTO): number {
    let mid: number = null;
    let rounding: number;

    if (this.state.metric.spread) rounding = TriCoreMetricConfig.Spread.rounding;
    else if (this.state.metric.yield) rounding = TriCoreMetricConfig.Spread.rounding;

    if (bEBestQuoteDTO.bidQuoteValue !== null && bEBestQuoteDTO.askQuoteValue !== null) mid = (bEBestQuoteDTO.bidQuoteValue + bEBestQuoteDTO.askQuoteValue) / 2;
    else if (bEBestQuoteDTO.bidQuoteValue === null && bEBestQuoteDTO.askQuoteValue > 0) mid = bEBestQuoteDTO.askQuoteValue;
    else if (bEBestQuoteDTO.bidQuoteValue > 0 && bEBestQuoteDTO.askQuoteValue === null) mid = bEBestQuoteDTO.bidQuoteValue;

    if (this.state.metric.spread) mid = this.utility.round(mid, rounding);

    return mid;
  }

  private addMarksTochartCategory() {
    // This method will loop through the list of obligor security IDs and assign a mark to those we own.
    this.state.chartCategories.forEach((eachCategory) => {
      eachCategory.data.obligorCategoryDataItemDTO.forEach((eachCategoryItem) => {
        this.state.securityTableRowDTOList.forEach((eachRow) => {
          const eachSecurity = eachRow.data.security;
          if (!!eachSecurity && eachCategoryItem.data.securityID === eachSecurity.data.securityID) {
            eachCategoryItem.data.mark = eachSecurity.data.mark.mark;
            eachCategoryItem.data.positionCurrent = eachSecurity.data.positionCurrent;
            // Insert the mark in our XAxis data fields.
            this.state.yAxisData.push(Number(eachCategoryItem.data.mark));
          }
        })
      })
    })

    // Once we assign the marks, we have all the information we need to build the chart.
    this.buildChart();
  }

  private buildChart() {
    this.zone.runOutsideAngular(() => {

      am4core.options.autoSetClassName = true;

      // Initialize the chart as XY.
      this.state.obligorChart = am4core.create("chartdiv", am4charts.XYChart);

      let yStart: number = null;
      let yEnd: number = null;
      let xStart: number = null;
      let xEnd: number = null;

      let xAxis = this.graphService.initializeObligorChartXAxis(this.state);
      let yAxis = this.graphService.initializeObligorChartYAxis(this.state);

      yAxis.events.on("startchanged", function (ev) {
        if (yStart === null && yEnd === null) {
          yStart = ev.target.minZoomed;
          yEnd = ev.target.maxZoomed;
        }
      });

      yAxis.events.on("endchanged", function (ev) {
        if (yStart === null && yEnd === null) {
          yStart = ev.target.minZoomed;
          yEnd = ev.target.maxZoomed;
        }
      });

      xAxis.events.on("startchanged", function (ev) {
        if (xStart === null && xEnd === null) {
          xStart = ev.target.minZoomed;
          xEnd = ev.target.maxZoomed;
        }
      });

      xAxis.events.on("endchanged", function (ev) {
        if (xStart === null && xEnd === null) {
          xStart = ev.target.minZoomed;
          xEnd = ev.target.maxZoomed;
        }
      });


      let buttonContainer = this.state.obligorChart.plotContainer.createChild(am4core.Container);
      buttonContainer.shouldClone = false;
      buttonContainer.align = "left";

      var zoomInButton = buttonContainer.createChild(am4core.Button);
      zoomInButton.label.text = "-";
      zoomInButton.events.on("hit", function (ev) {
        if (xStart !== null && xEnd !== null ) {
          xAxis.zoomToValues(xStart, xEnd);
          xStart = null;
          xEnd = null;
        }

        if(yStart !== null && yEnd !== null)
        {
          yAxis.zoomToValues(yStart, yEnd);
          yStart = null;
          yEnd = null;
        }
      });

      // TODO: This part is incomplete. Right now this chart only handles quantity.
      // Each chart category DTO has its own "isMarkHidden" field which should be used.
      let displayMark: boolean = false;
      if (this.state.markValue.cS01 || this.state.markValue.quantity) {
        displayMark = true;
      }

      // Draw each chart category.
      this.state.chartCategories.forEach((eachCategory) => {
        if (eachCategory.data.obligorCategoryDataItemDTO.length > 0) this.graphService.addCategoryToObligorGraph(eachCategory, this.state);
      });

      // Add legend for each chart type.
      this.state.obligorChart.legend = new am4charts.Legend();
      this.state.obligorChart.legend.useDefaultMarker = true;
      var marker = this.state.obligorChart.legend.markers.template.children.getIndex(0);
      marker.strokeWidth = 2;
      marker.strokeOpacity = 1;
      marker.stroke = am4core.color("#ccc");

      this.state.obligorChart.legend.events.on("hit", function (ev) {
        xStart = null;
        xEnd = null;
        yStart = null;
        yEnd = null;
      });

      // Add a cursor to the chart, with zoom behaviour. 
      this.state.obligorChart.cursor = new am4charts.XYCursor();
      this.state.obligorChart.cursor.behavior = "zoomXY";
      this.state.obligorChart.cursor.lineX.disabled = true;
      this.state.obligorChart.cursor.lineY.disabled = true;
      this.state.obligorChart.zoomOutButton.disabled = true;
    });
  }

  public btnCS01Click() {
    this.state.markValue.quantity = false;
    if (this.state.markValue.cS01) this.state.markValue.cS01 = false;
    else if (this.state.markValue.cS01 === false) this.state.markValue.cS01 = true;

    // TODO: CS01 is not yet supported.
  }

  public btnQuantityClick() {
    this.state.markValue.cS01 = false;
    if (this.state.markValue.quantity) this.state.markValue.quantity = false;
    else if (this.state.markValue.quantity === false) this.state.markValue.quantity = true;

    let isMarkHidden: boolean = true;
    if (this.state.markValue.quantity) isMarkHidden = false

    for (let categoryIndex in this.state.obligorChart.series.values) {
      this.state.chartCategories[categoryIndex].state.isHidden = this.state.obligorChart.series.values[categoryIndex].isHidden;
      this.state.chartCategories[categoryIndex].state.isMarkHidden = isMarkHidden;
    }

    this.state.obligorChart = this.graphService.clearGraphSeries(this.state.obligorChart);

    // Generate a graph for each data type, sending in the raw data,  the color scheme and the name.
    for (let category in this.state.chartCategories) {
      if (this.state.chartCategories[category].data.obligorCategoryDataItemDTO.length > 0) this.graphService.addCategoryToObligorGraph(this.state.chartCategories[category], this.state);
    }
  }

  public btnSpreadClick() {
    this.state.metric.yield = false;
    if (this.state.metric.spread === false) this.state.metric.spread = true;

    this.state.obligorChart.dispose();
    this.state.yAxisData = [];
    this.state.xAxisData = [];
    this.fetchSecurityIDs();
  }

  public btnYieldClick() {
    this.state.metric.spread = false;
    if (this.state.metric.yield === false) this.state.metric.yield = true;

    this.state.obligorChart.dispose();
    this.state.yAxisData = [];
    this.state.xAxisData = [];
    this.fetchSecurityIDs();
  }

  private initializeState() {
    this.state = {
      obligorChart: null,
      obligorSecurityID: null,
      obligorName: null,
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

}