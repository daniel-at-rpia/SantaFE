import { Component, ViewEncapsulation, NgZone } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { GraphService } from 'Core/services/GraphService';
import { UtilityService } from 'Core/services/UtilityService';
import { selectSelectedSecurityForAnalysis, securityTableRowDTOListForAnalysis } from 'Trade/selectors/trade.selectors';
import { Store, select } from '@ngrx/store';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { PayloadObligorSecurityIDs } from 'BEModels/backend-payloads.interface';
import { SecurityDTO } from 'App/modules/core/models/frontend/frontend-models.interface';
import {tap,first,delay,catchError,withLatestFrom,filter,sample} from 'rxjs/operators';
import { TradeSecurityIDsFromAnalysisEvent } from 'Trade/actions/trade.actions';
import {TriCoreMetricConfig} from 'Core/constants/coreConstants.constant';
import { TradeMarketAnalysisPanelState, TradeObligorGraphPanelState } from 'FEModels/frontend-page-states.interface';

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
    private utility: UtilityService
  ) {
    this.state = {
      obligorChart: am4charts.XYChart,
      obligorSecurityID: null,
      obligorName: "DEUTSCHE BANK AG EUR",
      obligorCurrency: null,
      bestQuotes: [],
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
      chartData: {
        subBond: [],
        srBond: [],
        srCDS: [],
        subCDS: []
      }
    }
  }

  fetchSecurityIDs(data: SecurityDTO) {

    let SecurityIDList: string[] = [];
    this.state.bestQuotes = [];

    if (data != null) {
      this.state.obligorSecurityID = data.data.securityID;
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
                this.state.bestQuotes.push({
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
          if (this.state.bestQuotes != null) {
            this.store$.dispatch(new TradeSecurityIDsFromAnalysisEvent(SecurityIDList));
          }
        }),
      ).subscribe();
    }
  }

  ngAfterViewInit() {
    this.subscriptions.selectSecurityUpdateForAnalysis = this.store$.pipe(select(selectSelectedSecurityForAnalysis)).subscribe((data) => { this.fetchSecurityIDs(data) });
    this.subscriptions.selectSecurityTableRowDTOListForAnalysis = this.store$.pipe(select(securityTableRowDTOListForAnalysis)).subscribe((data) => { this.state.securityTableRowDTOList = data; this.buildChartData() });
  }

  private buildChartData() {
    let spreadRounding = TriCoreMetricConfig['Spread']['rounding'];
    let yieldRounding = TriCoreMetricConfig['Yield']['rounding'];
    let mark: string;
    let name: string;
    let positionCurrent: number;
    let mid;

    for (let quote in this.state.bestQuotes) {

      // Initial values to be pushed to data array, reset each iteration.
      mid = null;
      mark = null;
      name = null;
      mid = null;
      positionCurrent = null;

      if(this.state.bestQuotes[quote].securityID === this.state.obligorSecurityID  )
      {
        this.state.obligorSecurityID = this.state.bestQuotes[quote].seniority;
      }

      if (this.state.bestQuotes[quote].bestQuote.bestSpreadQuote.bidQuoteValue > 0 && this.state.bestQuotes[quote].bestQuote.bestSpreadQuote.askQuoteValue > 0) {
        mid = (this.state.bestQuotes[quote].bestQuote.bestSpreadQuote.bidQuoteValue + this.state.bestQuotes[quote].bestQuote.bestSpreadQuote.askQuoteValue) / 2
        mid = this.utility.round(mid, spreadRounding);
      }
      else if (this.state.bestQuotes[quote].bestQuote.bestSpreadQuote.bidQuoteValue > 0) {
        mid = this.state.bestQuotes[quote].bestQuote.bestSpreadQuote.bidQuoteValue
      }
      else if (this.state.bestQuotes[quote].bestQuote.bestSpreadQuote.askQuoteValue > 0) {
        mid = this.state.bestQuotes[quote].bestQuote.bestSpreadQuote.askQuoteValue
      }

      let yieldMid = (this.state.bestQuotes[quote].bestQuote.bestYieldQuote.bidQuoteValue + this.state.bestQuotes[quote].bestQuote.bestYieldQuote.askQuoteValue) / 2
      yieldMid = this.utility.round(yieldMid, yieldRounding);

      name = this.state.bestQuotes[quote].name;

      for (let securityTableRowDTO in this.state.securityTableRowDTOList) {
        if (this.state.bestQuotes[quote].securityID === this.state.securityTableRowDTOList[securityTableRowDTO].data.security.data.securityID) {
          mark = this.state.securityTableRowDTOList[securityTableRowDTO].data.security.data.mark.mark;
          positionCurrent = this.state.securityTableRowDTOList[securityTableRowDTO].data.security.data.positionCurrent;
        }
      }

      this.state.xAxisData.push({ category: this.state.bestQuotes[quote].term });
      this.state.yAxisData.push(mark);
      this.state.yAxisData.push(mid);

      // This is a hacky way of doing things right now. 
      // The reason for this code is we need to "hide" the non-existing mark under the mid. 
      // The alternative is to create a new series specifically for mark. But that was proving to be more troublesome then this piece of logic.
      if(mark === null )
      {
        mark = mid;
      }

      if (this.state.bestQuotes[quote].seniority === "SR Bond") {
        if( mid !== null )
        {
          this.state.chartData.srBond.push({
            category: this.state.bestQuotes[quote].term,
            mid: mid,
            mark: mark,
            security: name,
            seniority: this.state.bestQuotes[quote].seniority,
            positionCurrent: positionCurrent
          });
        }
      }
      else if (this.state.bestQuotes[quote].seniority === "SUB Bond") {
        this.state.chartData.subBond.push({
          category: this.state.bestQuotes[quote].term,
          mid: mid,
          mark: mark,
          security: name,
          seniority: this.state.bestQuotes[quote].seniority,
          positionCurrent: positionCurrent
        });
      }
    }

    this.buildChart();
  }

  buildChart() {
    this.zone.runOutsideAngular(() => {

      this.state.obligorChart  = am4core.create("chartdiv", am4charts.XYChart);

      //Initialize chart Axes
      this.graphService.initializeObligorChartAxes(this.state.xAxisData, this.state.yAxisData, this.state.obligorChart);

      let displayMark: boolean = false;
      if(this.state.markValue.cS01 === true || this.state.markValue.quantity === true)
      {
        displayMark = true;
      }

      // Generate a graph for each data type, sending in the raw data,  the color scheme and the name.
      if(this.state.chartData.srBond.length > 0 ) this.graphService.buildObligorGraph(this.state.obligorChart, this.state.chartData.srBond, "#b300b3", "Sr Bond", "spreadMid", true, displayMark);
      if(this.state.chartData.subBond.length > 0 ) this.graphService.buildObligorGraph(this.state.obligorChart, this.state.chartData.subBond, "#4747d1", "Sub Bond",  "spreadMid", false, displayMark);
      if(this.state.chartData.srCDS.length > 0 ) this.graphService.buildObligorGraph(this.state.obligorChart, this.state.chartData.srCDS, "#0f8276", "Sub Bond",  "spreadMid", false, displayMark);
      if(this.state.chartData.subCDS.length > 0 ) this.graphService.buildObligorGraph(this.state.obligorChart, this.state.chartData.subCDS, "#ff9933", "Sub Bond",  "spreadMid", false, displayMark);

      // Add legend for each chart type.
      this.state.obligorChart.legend = new am4charts.Legend();

      // Add cursor
      this.state.obligorChart.cursor = new am4charts.XYCursor();
      this.state.obligorChart.cursor.behavior = "zoomXY";
      this.state.obligorChart.cursor.lineX.disabled = true;
      this.state.obligorChart.cursor.lineY.disabled = true;

      // Zoom out button
      this.state.obligorChart.zoomOutButton.align = "left";
      this.state.obligorChart.zoomOutButton.valign = "top";

    });
  }

  ngOnDestroy() {
  }

  btnCS01Click() {
    this.state.markValue.cS01 = false;
    if (this.state.markValue.cS01) this.state.markValue.cS01  = false;
    else if (this.state.markValue.cS01 === false) this.state.markValue.cS01 = true;

    //this.chart.series.removeIndex(1);
  }

  btnQuantityClick() {
    let displaySrBond: boolean = false;
    let displaySubBond: boolean = false;
    let displaySrCDS: boolean = false;
    let displaySubCDS: boolean = false;

    this.state.markValue.cS01 = false;
    if (this.state.markValue.quantity) this.state.markValue.quantity = false;
    else if (this.state.markValue.quantity === false) this.state.markValue.quantity = true;

    for(let value in this.state.obligorChart.series.values)
    {
      if(this.state.obligorChart.series.values[value].name === "Sr Bond" && this.state.obligorChart.series.values[value].isHidden === false) displaySrBond = true;
      if(this.state.obligorChart.series.values[value].name === "Sub Bond" && this.state.obligorChart.series.values[value].isHidden === false) displaySubBond = true;
      if(this.state.obligorChart.series.values[value].name === "Sr CDS" && this.state.obligorChart.series.values[value].isHidden === false) displaySrCDS = true;
      if(this.state.obligorChart.series.values[value].name === "Sub CDS" && this.state.obligorChart.series.values[value].isHidden === false) displaySubCDS = true;
    }

    this.state.obligorChart.series.clear();

    let displayMark: boolean = false;
    
    if(this.state.markValue.quantity|| this.state.markValue.quantity) displayMark = true
    // Generate a graph for each data type, sending in the raw data,  the color scheme and the name.
    if(this.state.chartData.srBond.length > 0 ) this.graphService.buildObligorGraph(this.state.obligorChart, this.state.chartData.srBond, "#b300b3", "Sr Bond", "spreadMid", displaySrBond, displayMark);
    if(this.state.chartData.subBond.length > 0 ) this.graphService.buildObligorGraph(this.state.obligorChart, this.state.chartData.subBond, "#4747d1", "Sub Bond",  "spreadMid", displaySubBond, displayMark);
    if(this.state.chartData.srCDS.length > 0 ) this.graphService.buildObligorGraph(this.state.obligorChart, this.state.chartData.srCDS, "#0f8276", "Sub Bond",  "spreadMid", displaySrCDS, displayMark);
    if(this.state.chartData.subCDS.length > 0 ) this.graphService.buildObligorGraph(this.state.obligorChart, this.state.chartData.subCDS, "#ff9933", "Sub Bond",  "spreadMid", displaySubCDS, displayMark);

  }

}