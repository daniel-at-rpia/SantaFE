import { Component, ViewEncapsulation, NgZone } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { TradeCenterPanel } from './trade-center-panel.container';
import { CoreModule } from 'App/modules/core/core.module';
import { GraphService } from 'Core/services/GraphService';
import { ObligorChartBlock } from 'Core/models/frontend/frontend-blocks.interface'
import { selectSecurityUpdateForAnalisys } from 'Trade/selectors/trade.selectors';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

am4core.useTheme(am4themes_animated);


@Component({
  selector: 'trade-obligor-graph-panel',
  templateUrl: './trade-obligor-graph-panel.container.html',
  styleUrls: ['./trade-obligor-graph-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeObligorGraphPanel {
  private sampleData = [];
  private chart: am4charts.XYChart;
  securityForAnalysis$: Observable<string>;

  constructor( 
    private store$: Store<any>, 
    private zone: NgZone,  
    private graphService: GraphService){
  }

  subscriptions =  {
    selectSecurityUpdateForAnalisys : null
  }

  ngAfterViewInit() {
    this.chart = am4core.create("chartdiv", am4charts.XYChart);
    //this.subscriptions.selectSecurityUpdateForAnalisys = this.store$.pipe(select(selectSecurityUpdateForAnalisys)).subscribe((data) => { this.test(data) });  

    this.zone.runOutsideAngular(() => {
      
      // This is all test data for now.
      this.populateSampleData();

      let srBondData = [];
      let srCDSData = [];
      let subBondData = [];
      let subCDSData = [];

      // Will hopefully still use this logic when real data is received.
      for (let sample of this.sampleData) {
        if (sample.seniority === "Sr Bond") {
          srBondData.push({ seniority: sample.seniority, category: sample.category, mid: sample.mid, mark: sample.mark, security: sample.security, securityCount: sample.securityCount });
        }
        if (sample.seniority === "Sr CDS") {
          srCDSData.push({ seniority: sample.seniority, category: sample.category, mid: sample.mid, mark: sample.mark, security: sample.security, securityCount: sample.securityCount });
        }
        if (sample.seniority === "Sub Bond") {
          subBondData.push({ seniority: sample.seniority, category: sample.category, mid: sample.mid, mark: sample.mark, security: sample.security, securityCount: sample.securityCount });
        }
        if (sample.seniority === "Sub CDS") {
          subCDSData.push({ seniority: sample.seniority, category: sample.category, mid: sample.mid, mark: sample.mark, security: sample.security, securityCount: sample.securityCount });
        }
      }

      // Generate a graph for each data type, sending in the raw data,  the color scheme and the name.
      this.generateGraph(srBondData, "#712f79", "Sr Bond");
      this.generateGraph(srCDSData, "#293881", "Sr CDS");
      this.generateGraph(subBondData, "#0f8276", "Sub Bond");
      this.generateGraph(subCDSData, "#ff9933", "Sub CDS");

      // Add mouse cursor to chart.
      this.chart.cursor = new am4charts.XYCursor();

      // Add legend for each chart type.
      this.chart.legend = new am4charts.Legend();

      // Disable the lengend markers. We only want the name of the graph for now.
      this.chart.legend.markers.template.disabled = true;

    });
  }

  generateGraph(data: any, colorScheme: string, name: string ) {
    // Generate Sr Bond chart.
    let chartBlock: ObligorChartBlock = {
      name: name,
      chart: this.chart,
      rawData: data,
      colorScheme: colorScheme
    }

    // Initialize the X Axis.
    this.graphService.initializeObligorChartXAxis(chartBlock);

    // Initialize the Y Axis.
    this.graphService.initializeObligorChartYAxis(chartBlock);

    // Create a dumbbell series. https://www.amcharts.com/demos/dumbbell-plot/
    let dumbBellSeries: am4charts.ColumnSeries = this.graphService.generateObligorChartDumbells(chartBlock);

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
      if (this.chart) {
        this.chart.dispose();
     }
    });
  }

  populateSampleData() {

    // Test data.
    this.sampleData.push({ category: "1Y", mid: 100.5, mark: 100.5, security: "ZHPRHK 9.15 03/08/22", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "2Y", mid: 100, mark: 100, security: "CHIWIN 7.9 01/23/21", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "3Y", mid: 105, mark: 105, security: "SUNAU 1.85 07/30/24", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "4Y", mid: 101, mark: 101, security: "CMZB 5 ½ 08/29/28", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "5Y", mid: 102, mark: 102, security: "FBAVP 3.4 03/12/20", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "6Y", mid: 106, mark: 104, security: "NESNVX 3 ⅝ 11/03/20", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "7Y", mid: 100, mark: 100, security: "WFC 5 ¼ 09/07/22", securityCount: 2, seniority: "Sr Bond" });
    this.sampleData.push({ category: "8Y", mid: 110, mark: 110, security: "CSCHCN 10 ⅞ 08/24/20", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "9Y", mid: 102, mark: 105, security: "EVERRE 8.9 05/24/21", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "10Y", mid: 108, mark: 108, security: "MITSRE 2.95 01/23/23", securityCount: 1, seniority: "Sr Bond" });

    this.sampleData.push({ category: "1Y", mid: 104, mark: 104, security: "ZHPRHK 9.15 03/08/22", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "2Y", mid: 100, mark: 100, security: "CHIWIN 7.9 01/23/21", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "3Y", mid: 105, mark: 105, security: "SUNAU 1.85 07/30/24", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "4Y", mid: 102, mark: 102, security: "CMZB 5 ½ 08/29/28", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "5Y", mid: 102, mark: 102, security: "FBAVP 3.4 03/12/20", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "6Y", mid: 106, mark: 104, security: "NESNVX 3 ⅝ 11/03/20", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "7Y", mid: 110, mark: 110, security: "WFC 5 ¼ 09/07/22", securityCount: 2, seniority: "Sr CDS" });
    this.sampleData.push({ category: "8Y", mid: 110, mark: 110, security: "CSCHCN 10 ⅞ 08/24/20", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "9Y", mid: 103, mark: 105, security: "EVERRE 8.9 05/24/21", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "10Y", mid: 114, mark: 114, security: "MITSRE 2.95 01/23/23", securityCount: 1, seniority: "Sr CDS" });

    this.sampleData.push({ category: "1Y", mid: 100.5, mark: 100.5, security: "ZHPRHK 9.15 03/08/22", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "2Y", mid: 101, mark: 101, security: "CHIWIN 7.9 01/23/21", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "3Y", mid: 105.6, mark: 105, security: "SUNAU 1.85 07/30/24", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "4Y", mid: 101, mark: 101, security: "CMZB 5 ½ 08/29/28", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "5Y", mid: 102, mark: 102, security: "FBAVP 3.4 03/12/20", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "6Y", mid: 106, mark: 104.5, security: "NESNVX 3 ⅝ 11/03/20", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "7Y", mid: 100, mark: 100, security: "WFC 5 ¼ 09/07/22", securityCount: 2, seniority: "Sub Bond" });
    this.sampleData.push({ category: "8Y", mid: 109.2, mark: 109.2, security: "CSCHCN 10 ⅞ 08/24/20", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "9Y", mid: 104.6, mark: 105, security: "EVERRE 8.9 05/24/21", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "10Y", mid: 99, mark: 99, security: "MITSRE 2.95 01/23/23", securityCount: 1, seniority: "Sub Bond" });

    this.sampleData.push({ category: "1Y", mid: 100.5, mark: 100.5, security: "ZHPRHK 9.15 03/08/22", securityCount: 1, seniority: "Sub CDS" });
    this.sampleData.push({ category: "3Y", mid: 102.6, mark: 102.6, security: "SUNAU 1.85 07/30/24", securityCount: 1, seniority: "Sub CDS" });
    this.sampleData.push({ category: "5Y", mid: 103, mark: 103, security: "FBAVP 3.4 03/12/20", securityCount: 1, seniority: "Sub CDS" });
    this.sampleData.push({ category: "6Y", mid: 103.45, mark: 100, security: "NESNVX 3 ⅝ 11/03/20", securityCount: 1, seniority: "Sub CDS" });
    this.sampleData.push({ category: "7Y", mid: 106, mark: 101, security: "WFC 5 ¼ 09/07/22", securityCount: 2, seniority: "Sub CDS" });
    this.sampleData.push({ category: "8Y", mid: 108, mark: 108, security: "CSCHCN 10 ⅞ 08/24/20", securityCount: 1, seniority: "Sub CDS" });
    this.sampleData.push({ category: "9Y", mid: 100, mark: 103, security: "EVERRE 8.9 05/24/21", securityCount: 1, seniority: "Sub CDS" });
    this.sampleData.push({ category: "10Y", mid: 99.78, mark: 99.78, security: "MITSRE 2.95 01/23/23", securityCount: 1, seniority: "Sub CDS" });
  }

}