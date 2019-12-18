import { Component, ViewEncapsulation, NgZone, EventEmitter, Output } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { GraphService } from 'Core/services/GraphService';
import { UtilityService } from 'Core/services/UtilityService';
import { selectSelectedSecurityForAnalysis, securityTableRowDTOListForAnalysis } from 'Trade/selectors/trade.selectors';
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
import {
  TriCoreMetricConfig
} from 'Core/constants/coreConstants.constant';
import { ThrowStmt } from '@angular/compiler';

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
  private isSecurityValueQuantity = true;   //Security Value for Quantity button will always start as enabled.
  private isYAxisSpread = false;;
  private isYAxisYield = false;
  private isSrBondChartDisplayed:boolean = false;
  private isSubBondChartDisplayed:boolean = false;
  private isSrCDSBondChartDisplayed:boolean = false;
  private isSubCDSBondChartDisplayed:boolean = false;
  private srBondChartData: any[] = [];
  private subBondChartData: any[] = [];
  private srCDSChartData: any[] = [];
  private subCDSChartData: any[] = [];
  private xAxisData: any = [];
  private yAxisData: any = [];
  private selectedSecurityID: string;
  private selectedSecuritySeniority: string;
  private securityTableRowDTOList: any[] = [];
  private chartTitle: string = "DEUTSCHE BANK AG EUR Curves"; // This is hardcoded until we receive full live data.
  private chart: am4charts.XYChart;

  constructor(
    private store$: Store<any>,
    private zone: NgZone,
    private graphService: GraphService,
    private restfulCommService: RestfulCommService,
    private utility: UtilityService
  ) {
  }

  subscriptions = {
    selectSecurityUpdateForAnalysis: null,
    selectSecurityTableRowDTOListForAnalysis: null
  }

  fetchSecurityIDs(data: SecurityDTO) {

    let SecurityIDList: string[] = [];
    this.bestQuotes = [];

    if (data != null) {
      this.selectedSecurityID = data.data.securityID;
      const payload: PayloadObligorSecurityIDs = {
        identifier: data.data.securityID
      };
      this.restfulCommService.callAPI('SantaCurve/get-santa-obligor-curves-per-ccy', { req: 'POST' }, payload).pipe(
        first(),
        tap((serverReturn) => {
          for (let curve in serverReturn.Curves) {
            for (let security in serverReturn.Curves[curve].BestQuotes) {
              SecurityIDList.push(security);
              if (serverReturn.Curves[curve].BestQuotes[security] !== null) {
                this.bestQuotes.push({
                  term: serverReturn.Curves[curve].Securities[security].metrics.workoutTerm,
                  seniority: serverReturn.Curves[curve].Seniority + " " + serverReturn.Curves[curve].CurveType,
                  securityID: security,
                  bestQuote: serverReturn.Curves[curve].BestQuotes[security],
                  name: serverReturn.Curves[curve].Securities[security].name
                })

                //this.chartTitle = serverReturn.Curves[curve].Securities[4501].issuer + " " +  serverReturn.Curves[curve].Securities[4501].ccy;
              }
            }
          }
          if (this.bestQuotes != null) {
            this.store$.dispatch(new TradeSecurityIDsFromAnalysisEvent(SecurityIDList));
          }
        }),
      ).subscribe();
    }
  }

  ngAfterViewInit() {
    this.subscriptions.selectSecurityUpdateForAnalysis = this.store$.pipe(select(selectSelectedSecurityForAnalysis)).subscribe((data) => { this.fetchSecurityIDs(data) });
    this.subscriptions.selectSecurityTableRowDTOListForAnalysis = this.store$.pipe(select(securityTableRowDTOListForAnalysis)).subscribe((data) => { this.securityTableRowDTOList = data; this.buildChartData() });
  }

  private buildChartData() {
    let spreadRounding = TriCoreMetricConfig['Spread']['rounding'];
    let yieldRounding = TriCoreMetricConfig['Yield']['rounding'];
    let mark: number;
    let name: string;
    let positionCurrent: number;
    let spreadMid;

    this.srBondChartData = [];
    this.subBondChartData = [];
    this.yAxisData = [];
    this.xAxisData = [];

    for (let quote in this.bestQuotes) {
      spreadMid = null;
      mark = null;
      name = null;
      spreadMid = null;
      positionCurrent = null;

      if(this.bestQuotes[quote].securityID === this.selectedSecurityID  )
      {
        this.selectedSecuritySeniority = this.bestQuotes[quote].seniority;
      }

      if (this.bestQuotes[quote].bestQuote.bestSpreadQuote.bidQuoteValue > 0 && this.bestQuotes[quote].bestQuote.bestSpreadQuote.askQuoteValue > 0) {
        spreadMid = (this.bestQuotes[quote].bestQuote.bestSpreadQuote.bidQuoteValue + this.bestQuotes[quote].bestQuote.bestSpreadQuote.askQuoteValue) / 2
        spreadMid = this.utility.round(spreadMid, spreadRounding);
      }
      else if (this.bestQuotes[quote].bestQuote.bestSpreadQuote.bidQuoteValue > 0) {
        spreadMid = this.bestQuotes[quote].bestQuote.bestSpreadQuote.bidQuoteValue
      }
      else if (this.bestQuotes[quote].bestQuote.bestSpreadQuote.askQuoteValue > 0) {
        spreadMid = this.bestQuotes[quote].bestQuote.bestSpreadQuote.askQuoteValue
      }

      let yieldMid = (this.bestQuotes[quote].bestQuote.bestYieldQuote.bidQuoteValue + this.bestQuotes[quote].bestQuote.bestYieldQuote.askQuoteValue) / 2
      yieldMid = this.utility.round(yieldMid, yieldRounding);

      name = this.bestQuotes[quote].name;

      for (let securityTableRowDTO in this.securityTableRowDTOList) {
        if (this.bestQuotes[quote].securityID === this.securityTableRowDTOList[securityTableRowDTO].data.security.data.securityID) {
          mark = this.securityTableRowDTOList[securityTableRowDTO].data.security.data.mark.mark;
          positionCurrent = this.securityTableRowDTOList[securityTableRowDTO].data.security.data.positionCurrent;
        }
      }

      this.xAxisData.push({ category: this.bestQuotes[quote].term });
      this.yAxisData.push(mark);
      this.yAxisData.push(spreadMid);

      // This is a hacky way of doing things right now. 
      // The reason for this code is we need to "hide" the non-existing mark under the mid. 
      // The alternative is to create a new series specifically for mark. But that was proving to be more troublesome then this piece of logic.
      if(mark === null )
      {
        mark = spreadMid;
      }

      if (this.bestQuotes[quote].seniority === "SR Bond") {
        if( spreadMid !== null )
        {
          this.srBondChartData.push({
            category: this.bestQuotes[quote].term,
            spreadMid: spreadMid,
            spreadMark: mark,
            security: name,
            seniority: this.bestQuotes[quote].seniority,
            positionCurrent: positionCurrent
          });
        }
      }
      else if (this.bestQuotes[quote].seniority === "SUB Bond") {
        this.subBondChartData.push({
          category: this.bestQuotes[quote].term,
          spreadMid: spreadMid,
          spreadMark: mark,
          security: name,
          seniority: this.bestQuotes[quote].seniority,
          positionCurrent: positionCurrent
        });
      }
    }

    this.buildChart();
  }

  buildChart() {
    this.zone.runOutsideAngular(() => {

      this.chart = am4core.create("chartdiv", am4charts.XYChart);

      if (!this.isYAxisYield && !this.isYAxisSpread) {
        this.isYAxisSpread = true;
      }

      //Initialize chart Axes
      this.graphService.initializeObligorChartAxes(this.xAxisData, this.yAxisData, this.chart);

      let displayMark: boolean = false;
      if(this.isSecurityValueCS01 === true || this.isSecurityValueQuantity === true)
      {
        displayMark = true;
      }

      // Generate a graph for each data type, sending in the raw data,  the color scheme and the name.
      if(this.srBondChartData.length > 0 ) this.graphService.buildObligorGraph(this.chart, this.srBondChartData, "#b300b3", "Sr Bond", "spreadMid", true, displayMark);
      if(this.subBondChartData.length > 0 ) this.graphService.buildObligorGraph(this.chart, this.subBondChartData, "#4747d1", "Sub Bond",  "spreadMid", false, displayMark);
      if(this.subCDSChartData.length > 0 ) this.graphService.buildObligorGraph(this.chart, this.subCDSChartData, "#0f8276", "Sub Bond",  "spreadMid", false, displayMark);
      if(this.srCDSChartData.length > 0 ) this.graphService.buildObligorGraph(this.chart, this.srCDSChartData, "#ff9933", "Sub Bond",  "spreadMid", false, displayMark);

      // Add legend for each chart type.
      this.chart.legend = new am4charts.Legend();

      // Add cursor
      this.chart.cursor = new am4charts.XYCursor();
      this.chart.cursor.behavior = "zoomXY";
      this.chart.cursor.lineX.disabled = true;
      this.chart.cursor.lineY.disabled = true;

      // Zoom out button
      this.chart.zoomOutButton.align = "left";
      this.chart.zoomOutButton.valign = "top";

    });
  }

  ngOnDestroy() {
  }

  btnCS01Click() {
    this.isSecurityValueQuantity = false;
    if (this.isSecurityValueCS01 === true) this.isSecurityValueCS01 = false;
    else if (this.isSecurityValueCS01 === false) this.isSecurityValueCS01 = true;

    //this.chart.series.removeIndex(1);
  }

  btnQuantityClick() {
    let displaySrBond: boolean = false;
    let displaySubBond: boolean = false;
    let displaySrCDS: boolean = false;
    let displaySubCDS: boolean = false;

    this.isSecurityValueCS01 = false;
    if (this.isSecurityValueQuantity === true) this.isSecurityValueQuantity = false;
    else if (this.isSecurityValueQuantity === false) this.isSecurityValueQuantity = true;

    for(let value in this.chart.series.values)
    {
      if(this.chart.series.values[value].name === "Sr Bond" && this.chart.series.values[value].isHidden === false) displaySrBond = true;
      if(this.chart.series.values[value].name === "Sub Bond" && this.chart.series.values[value].isHidden === false) displaySubBond = true;
      if(this.chart.series.values[value].name === "Sr CDS" && this.chart.series.values[value].isHidden === false) displaySrCDS = true;
      if(this.chart.series.values[value].name === "Sub CDS" && this.chart.series.values[value].isHidden === false) displaySubCDS = true;
    }

    this.chart.series.clear();

    let displayMark: boolean = false;
    
    if(this.isSecurityValueQuantity|| this.isSecurityValueCS01) displayMark = true
    // Generate a graph for each data type, sending in the raw data,  the color scheme and the name.
    if(this.srBondChartData.length > 0 ) this.graphService.buildObligorGraph(this.chart, this.srBondChartData, "#b300b3", "Sr Bond", "spreadMid", displaySrBond, displayMark);
    if(this.subBondChartData.length > 0 ) this.graphService.buildObligorGraph(this.chart, this.subBondChartData, "#4747d1", "Sub Bond",  "spreadMid", displaySubBond, displayMark);
    if(this.subCDSChartData.length > 0 ) this.graphService.buildObligorGraph(this.chart, this.subCDSChartData, "#0f8276", "Sub Bond",  "spreadMid", displaySrCDS, displayMark);
    if(this.srCDSChartData.length > 0 ) this.graphService.buildObligorGraph(this.chart, this.srCDSChartData, "#ff9933", "Sub Bond",  "spreadMid", displaySubCDS, displayMark);

  }

  populateSampleData(){

    // Test data.
    this.srBondChartData.push({ category: "1Y", spreadMid: 100.5, spreadMark: 100.5, security: "ZHPRHK 9.15 03/08/22", positionCurrent: 1, seniority: "Sr Bond" });
    this.srBondChartData.push({ category: "2Y", spreadMid: 100, spreadMark: 100, security: "CHIWIN 7.9 01/23/21", positionCurrent: 1, seniority: "Sr Bond" });
    this.srBondChartData.push({ category: "3Y", spreadMid: 105, spreadMark: 105, security: "SUNAU 1.85 07/30/24", positionCurrent: 1, seniority: "Sr Bond" });
    this.srBondChartData.push({ category: "4Y", spreadMid: 101, spreadMark: 101, security: "CMZB 5 ½ 08/29/28", positionCurrent: 1, seniority: "Sr Bond" });
    this.srBondChartData.push({ category: "5Y", spreadMid: 102, spreadMark: 102, security: "FBAVP 3.4 03/12/20", positionCurrent: 1, seniority: "Sr Bond" });
    this.srBondChartData.push({ category: "6Y", spreadMid: 106, spreadMark: 104, security: "NESNVX 3 ⅝ 11/03/20", positionCurrent: 1, seniority: "Sr Bond" });
    this.srBondChartData.push({ category: "7Y", spreadMid: 100, spreadMark: 100, security: "WFC 5 ¼ 09/07/22", positionCurrent: 2, seniority: "Sr Bond" });
    this.srBondChartData.push({ category: "8Y", spreadMid: 110, spreadMark: 110, security: "CSCHCN 10 ⅞ 08/24/20", positionCurrent: 1, seniority: "Sr Bond" });
    this.srBondChartData.push({ category: "9Y", spreadMid: 102, spreadMark: 105, security: "EVERRE 8.9 05/24/21", positionCurrent: 1, seniority: "Sr Bond" });
    this.srBondChartData.push({ category: "10Y", spreadMid: 70, spreadMark: 70, security: "MITSRE 2.95 01/23/23", positionCurrent: 1, seniority: "Sr Bond" });

    // Test data.
    this.subBondChartData.push({ category: "1Y", spreadMid: 1000.5, spreadMark: 1000.5, security: "ZHPRHK 9.15 03/08/22", positionCurrent: 1, seniority: "Sr Bond" });
    this.subBondChartData.push({ category: "2Y", spreadMid: 100, spreadMark: 100, security: "CHIWIN 7.9 01/23/21", positionCurrent: 1, seniority: "Sr Bond" });
    this.subBondChartData.push({ category: "3Y", spreadMid: 130, spreadMark: 130, security: "SUNAU 1.85 07/30/24", positionCurrent: 1, seniority: "Sr Bond" });
  }

}