import { Component, ViewEncapsulation, NgZone, EventEmitter, Output } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { GraphService } from 'Core/services/GraphService';
import { ObligorChartBlock } from 'Core/models/frontend/frontend-adhoc-packages.interface'
import { selectSelectedSecurityForAnalysis   } from 'Trade/selectors/trade.selectors';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { PayloadObligorSecurityIDs } from 'BEModels/backend-payloads.interface';
import { SecurityDTO } from 'App/modules/core/models/frontend/frontend-models.interface';
import { BEBestQuoteDTO, BESecurityDTO } from 'Core/models/backend/backend-models.interface.ts';
import {
  tap,
  first,
  delay,
  catchError,
  withLatestFrom,
  filter,
  sample
} from 'rxjs/operators';
import { TradeSecurityIDsFromAnalysisEvent } from 'Trade/actions/trade.actions';


am4core.useTheme(am4themes_animated);

@Component({
  selector: 'trade-obligor-graph-panel',
  templateUrl: './trade-obligor-graph-panel.container.html',
  styleUrls: ['./trade-obligor-graph-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeObligorGraphPanel {
  @Output() securityIDListFromAnalysis = new EventEmitter<Array<string>>();
  private bestQuotes: any[] = [];
  private isSecurityValueCS01 = false;
  private isSecurityValueQuantity = false;   //Security Value for Quantity button will always start as enabled.
  private isYAxisSpread = false;;
  private isYAxisYield = false;

  constructor(
    private store$: Store<any>,
    private zone: NgZone,
    private graphService: GraphService,
    private restfulCommService: RestfulCommService
  ) {
  }

  subscriptions = {
    selectSecurityUpdateForAnalysis: null
  }

  fetchSecurityIDs(data: SecurityDTO) {

    let SecurityIDList: string[] = [];

    if (data != null) {
      const payload: PayloadObligorSecurityIDs = {
        identifier: data.data.securityID
      };
      this.restfulCommService.callAPI('SantaCurve/get-santa-obligor-curves-per-ccy', { req: 'POST' }, payload).pipe(
        first(),
        tap((serverReturn) => {
          for (let category in serverReturn) {
            if (category != "ObligorId") {
              if (serverReturn[category].BestQuotes != null) {
                for (let bestQuote in serverReturn[category].BestQuotes) {
                  if (serverReturn[category].BestQuotes[bestQuote] != null) {
                    for (let security in serverReturn[category].BestQuotes) {
                      if (serverReturn[category].BestQuotes[security]) {
                        if (serverReturn[category].BestQuotes[security].bestSpreadQuote || serverReturn[category].BestQuotes[security].bestYieldQuote) {
                          
                          SecurityIDList.push(security);

                          this.bestQuotes.push({ SecurityID: security, quote: serverReturn[category].BestQuotes[security] });
                        
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (this.bestQuotes != null) {
            this.store$.dispatch(new TradeSecurityIDsFromAnalysisEvent(SecurityIDList));
            this.buildChart();
          }
        }),
      ).subscribe();
    }
  }

  buildChartData(){

  }

  ngAfterViewInit() {
    this.subscriptions.selectSecurityUpdateForAnalysis = this.store$.pipe(select(selectSelectedSecurityForAnalysis)).subscribe((data) => { this.fetchSecurityIDs(data) });
  }

  buildChart() {
    this.zone.runOutsideAngular(() => {

      let chart: am4charts.XYChart;

      chart = am4core.create("chartdiv", am4charts.XYChart);
    
      //this.securityIDListFromAnalysis.emit(SecurityIDs);

      let srBondData = [];
      let srCDSData = [];
      let subBondData = [];
      let subCDSData = [];

      let xAxisData = [];
      let yAxisData = [];
  
      // This is all test data for now.
      let sampleData: any[] = this.populateSampleData();
  
      // Will hopefully still use this logic when real data is received.
      for (let sample of sampleData) {
        xAxisData.push({category: sample.category });
        yAxisData.push(sample.spreadMark);
        yAxisData.push(sample.spreadMid);
        if (sample.seniority === "Sr Bond") {
          srBondData.push({ seniority: sample.seniority, category: sample.category, spreadMid: sample.spreadMid, spreadMark: sample.spreadMark, security: sample.security, securityCount: sample.securityCount }); 
        }
        if (sample.seniority === "Sr CDS") {
          srCDSData.push({ seniority: sample.seniority, category: sample.category, spreadMid: sample.spreadMid, spreadMark: sample.spreadMark, security: sample.security, securityCount: sample.securityCount });
        }
        if (sample.seniority === "Sub Bond") {
          subBondData.push({ seniority: sample.seniority, category: sample.category, spreadMid: sample.spreadMid, spreadMark: sample.spreadMark, security: sample.security, securityCount: sample.securityCount });
        }
        if (sample.seniority === "Sub CDS") {
          subCDSData.push({ seniority: sample.seniority, category: sample.category, spreadMid: sample.spreadMid, spreadMark: sample.spreadMark, security: sample.security, securityCount: sample.securityCount });
        }
      }

      this.buildChartData();
      
      // Initialize the X Axis.
      this.graphService.initializeObligorChartXAxis(xAxisData, chart);

      // Initialize the Y Axis.
      this.graphService.initializeObligorChartYAxis(yAxisData, chart);

      // Generate a graph for each data type, sending in the raw data,  the color scheme and the name.
      this.buildSingleObligorGraph(chart, srBondData, "#712f79", "Sr Bond", "spreadMid");
      this.buildSingleObligorGraph(chart, srCDSData, "#293881", "Sr CDS",  "spreadMid");
      this.buildSingleObligorGraph(chart, subBondData, "#0f8276", "Sub Bond",  "spreadMid");
      this.buildSingleObligorGraph(chart, subCDSData, "#ff9933", "Sub CDS",  "spreadMid");

      // Add legend for each chart type.
      chart.legend = new am4charts.Legend();

      // Disable the lengend markers. We only want the name of the graph for now.
      chart.legend.markers.template.disabled = true;

    });
  }

  buildSingleObligorGraph(chart: am4charts.XYChart, data: any, colorScheme: string, name: string, yAxisValue: string) {
    
    // Generate Sr Bond chart.
    let chartBlock: ObligorChartBlock = {
      name: name,
      chart: chart,
      rawData: data,
      colorScheme: colorScheme
    }

    if(!this.isYAxisYield && !this.isYAxisSpread)
    {
      this.isYAxisSpread = true;
    }

    // Create a dumbbell series. https://www.amcharts.com/demos/dumbbell-plot/
    let dumbBellSeries: am4charts.ColumnSeries;
    if(this.isYAxisSpread)
    {
      dumbBellSeries = this.graphService.generateObligorChartDumbells(chartBlock, "spread");
    }
    else if(this.isYAxisYield)
    {
      dumbBellSeries = this.graphService.generateObligorChartDumbells(chartBlock, "yield");
    }

    // Create a curve line series.
    let curveSeries: am4charts.LineSeries = this.graphService.generateObligorChartTrendCurve(chartBlock);

    // Show the dumbbell series and the curve series when legend item is clicked.
    dumbBellSeries.events.on("shown", function () {
      dumbBellSeries.show();
      curveSeries.show();
    });

    // Hide the dumbbell series and the curve series when legend item is clicked.
    dumbBellSeries.events.on("hidden", function () {
      dumbBellSeries.hide();
      curveSeries.hide();
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {

    });
  }

  populateSampleData(): any[] {

    let sampleData = [];
    // Test data.
    sampleData.push({ category: "1Y", spreadMid: 100.5, spreadMark: 100.5, security: "ZHPRHK 9.15 03/08/22", securityCount: 1, seniority: "Sr Bond" });
    sampleData.push({ category: "2Y", spreadMid: 100, spreadMark: 100, security: "CHIWIN 7.9 01/23/21", securityCount: 1, seniority: "Sr Bond" });
    sampleData.push({ category: "3Y", spreadMid: 105, spreadMark: 105, security: "SUNAU 1.85 07/30/24", securityCount: 1, seniority: "Sr Bond" });
    sampleData.push({ category: "4Y", spreadMid: 101, spreadMark: 101, security: "CMZB 5 ½ 08/29/28", securityCount: 1, seniority: "Sr Bond" });
    sampleData.push({ category: "5Y", spreadMid: 102, spreadMark: 102, security: "FBAVP 3.4 03/12/20", securityCount: 1, seniority: "Sr Bond" });
    sampleData.push({ category: "6Y", spreadMid: 106, spreadMark: 104, security: "NESNVX 3 ⅝ 11/03/20", securityCount: 1, seniority: "Sr Bond" });
    sampleData.push({ category: "7Y", spreadMid: 100, spreadMark: 100, security: "WFC 5 ¼ 09/07/22", securityCount: 2, seniority: "Sr Bond" });
    sampleData.push({ category: "8Y", spreadMid: 110, spreadMark: 110, security: "CSCHCN 10 ⅞ 08/24/20", securityCount: 1, seniority: "Sr Bond" });
    sampleData.push({ category: "9Y", spreadMid: 102, spreadMark: 105, security: "EVERRE 8.9 05/24/21", securityCount: 1, seniority: "Sr Bond" });
    sampleData.push({ category: "10Y", spreadMid: 108, spreadMark: 108, security: "MITSRE 2.95 01/23/23", securityCount: 1, seniority: "Sr Bond" });

    sampleData.push({ category: "1Y", spreadMid: 104, spreadMark: 104, security: "ZHPRHK 9.15 03/08/22", securityCount: 1, seniority: "Sr CDS" });
    sampleData.push({ category: "2Y", spreadMid: 100, spreadMark: 100, security: "CHIWIN 7.9 01/23/21", securityCount: 1, seniority: "Sr CDS" });
    sampleData.push({ category: "3Y", spreadMid: 105, spreadMark: 105, security: "SUNAU 1.85 07/30/24", securityCount: 1, seniority: "Sr CDS" });
    sampleData.push({ category: "4Y", spreadMid: 102, spreadMark: 102, security: "CMZB 5 ½ 08/29/28", securityCount: 1, seniority: "Sr CDS" });
    sampleData.push({ category: "5Y", spreadMid: 102, spreadMark: 102, security: "FBAVP 3.4 03/12/20", securityCount: 1, seniority: "Sr CDS" });
    sampleData.push({ category: "6Y", spreadMid: 106, spreadMark: 104, security: "NESNVX 3 ⅝ 11/03/20", securityCount: 1, seniority: "Sr CDS" });
    sampleData.push({ category: "7Y", spreadMid: 110, spreadMark: 110, security: "WFC 5 ¼ 09/07/22", securityCount: 2, seniority: "Sr CDS" });
    sampleData.push({ category: "8Y", spreadMid: 110, spreadMark: 110, security: "CSCHCN 10 ⅞ 08/24/20", securityCount: 1, seniority: "Sr CDS" });
    sampleData.push({ category: "9Y", spreadMid: 103, spreadMark: 105, security: "EVERRE 8.9 05/24/21", securityCount: 1, seniority: "Sr CDS" });
    sampleData.push({ category: "10Y", spreadMid: 114, spreadMark: 114, security: "MITSRE 2.95 01/23/23", securityCount: 1, seniority: "Sr CDS" });

    sampleData.push({ category: "1Y", spreadMid: 100.5, spreadMark: 100.5, security: "ZHPRHK 9.15 03/08/22", securityCount: 1, seniority: "Sub Bond" });
    sampleData.push({ category: "2Y", spreadMid: 101, spreadMark: 101, security: "CHIWIN 7.9 01/23/21", securityCount: 1, seniority: "Sub Bond" });
    sampleData.push({ category: "3Y", spreadMid: 105.6, spreadMark: 105, security: "SUNAU 1.85 07/30/24", securityCount: 1, seniority: "Sub Bond" });
    sampleData.push({ category: "4Y", spreadMid: 101, spreadMark: 101, security: "CMZB 5 ½ 08/29/28", securityCount: 1, seniority: "Sub Bond" });
    sampleData.push({ category: "5Y", spreadMid: 102, spreadMark: 102, security: "FBAVP 3.4 03/12/20", securityCount: 1, seniority: "Sub Bond" });
    sampleData.push({ category: "6Y", spreadMid: 106, spreadMark: 104.5, security: "NESNVX 3 ⅝ 11/03/20", securityCount: 1, seniority: "Sub Bond" });
    sampleData.push({ category: "7Y", spreadMid: 100, spreadMark: 100, security: "WFC 5 ¼ 09/07/22", securityCount: 2, seniority: "Sub Bond" });
    sampleData.push({ category: "8Y", spreadMid: 109.2, spreadMark: 109.2, security: "CSCHCN 10 ⅞ 08/24/20", securityCount: 1, seniority: "Sub Bond" });
    sampleData.push({ category: "9Y", spreadMid: 104.6, spreadMark: 105, security: "EVERRE 8.9 05/24/21", securityCount: 1, seniority: "Sub Bond" });
    sampleData.push({ category: "10Y", spreadMid: 99, spreadMark: 99, security: "MITSRE 2.95 01/23/23", securityCount: 1, seniority: "Sub Bond" });

    sampleData.push({ category: "1Y", spreadMid: 100.5, spreadMark: 100.5, security: "ZHPRHK 9.15 03/08/22", securityCount: 1, seniority: "Sub CDS" });
    sampleData.push({ category: "3Y", spreadMid: 102.6, spreadMark: 102.6, security: "SUNAU 1.85 07/30/24", securityCount: 1, seniority: "Sub CDS" });
    sampleData.push({ category: "5Y", spreadMid: 103, spreadMark: 103, security: "FBAVP 3.4 03/12/20", securityCount: 1, seniority: "Sub CDS" });
    sampleData.push({ category: "6Y", spreadMid: 103.45, spreadMark: 100, security: "NESNVX 3 ⅝ 11/03/20", securityCount: 1, seniority: "Sub CDS" });
    sampleData.push({ category: "7Y", spreadMid: 106, spreadMark: 101, security: "WFC 5 ¼ 09/07/22", securityCount: 2, seniority: "Sub CDS" });
    sampleData.push({ category: "8Y", spreadMid: 108, spreadMark: 108, security: "CSCHCN 10 ⅞ 08/24/20", securityCount: 1, seniority: "Sub CDS" });
    sampleData.push({ category: "9Y", spreadMid: 100, spreadMark: 103, security: "EVERRE 8.9 05/24/21", securityCount: 1, seniority: "Sub CDS" });
    sampleData.push({ category: "10Y", spreadMid: 99.78, spreadMark: 99.78, security: "MITSRE 2.95 01/23/23", securityCount: 1, seniority: "Sub CDS" });

    return sampleData;
  }

  btnYAxisSpreadClick()
  {
    this.isYAxisSpread = true;
    this.isYAxisYield = false;
  }

  btnYAxisYieldClick()
  {
    this.isYAxisYield = true;
    this.isYAxisSpread = false;
  }

  btnCS01Click()
  {
    this.isSecurityValueQuantity = false;
    if(this.isSecurityValueCS01 === true) this.isSecurityValueCS01 = false;
    else if(this.isSecurityValueCS01 === false) this.isSecurityValueCS01 = true;

  }

  btnQuantityClick()
  {
    this.isSecurityValueCS01 = false;
    if(this.isSecurityValueQuantity === true) this.isSecurityValueQuantity = false;
    else if(this.isSecurityValueQuantity === false) this.isSecurityValueQuantity = true;

  }

}