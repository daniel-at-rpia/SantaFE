import { Component, ViewEncapsulation, NgZone, EventEmitter, Output } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
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
  private srBondChartData: any[] = [];
  private srBondChartMarkData: any[] = [];
  private subBondChartData: any[] = [];
  private subBondChartMarkData: any[] = [];
  private xAxisData: any = [];
  private yAxisData: any = [];

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
                this.bestQuotes.push({ term: serverReturn.Curves[curve].Securities[security].metrics.workoutTerm, 
                                      seniority: serverReturn.Curves[curve].Seniority + " " + serverReturn.Curves[curve].CurveType, 
                                      securityID: security, 
                                      bestQuote: serverReturn.Curves[curve].BestQuotes[security],
                                      name: serverReturn.Curves[curve].Securities[security].name })
                
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
    this.subscriptions.selectSecurityTableRowDTOListForAnalysis = this.store$.pipe(select(securityTableRowDTOListForAnalysis)).subscribe((data) => { this.buildChartData(data) });
  }

 private buildChartData(securityTableRowDTOList: any[])
 {

    let spreadRounding = TriCoreMetricConfig['Spread']['rounding'];
    let yieldRounding = TriCoreMetricConfig['Yield']['rounding'];
    let mark: any;
    let name: string;
    let positionCurrent: number;

    this.srBondChartData = [];
    this.subBondChartData = [];
    this.srBondChartMarkData = [];
    this.yAxisData = [];
    this.xAxisData = [];
    let spreadMid;

    for(let quote in this.bestQuotes)
    {
      spreadMid = null;
      mark = null;
      name = null;
      spreadMid = null;
      positionCurrent = null;

      if(this.bestQuotes[quote].bestQuote.bestSpreadQuote.bidQuoteValue > 0 && this.bestQuotes[quote].bestQuote.bestSpreadQuote.askQuoteValue > 0)
      {
        spreadMid = ( this.bestQuotes[quote].bestQuote.bestSpreadQuote.bidQuoteValue + this.bestQuotes[quote].bestQuote.bestSpreadQuote.askQuoteValue ) / 2
        spreadMid = this.utility.round(spreadMid, spreadRounding);
      }
      else if(this.bestQuotes[quote].bestQuote.bestSpreadQuote.bidQuoteValue > 0)
      {
        spreadMid = this.bestQuotes[quote].bestQuote.bestSpreadQuote.bidQuoteValue
      }
      else if(this.bestQuotes[quote].bestQuote.bestSpreadQuote.askQuoteValue > 0)
      {
        spreadMid = this.bestQuotes[quote].bestQuote.bestSpreadQuote.askQuoteValue
      }

      let yieldMid = ( this.bestQuotes[quote].bestQuote.bestYieldQuote.bidQuoteValue + this.bestQuotes[quote].bestQuote.bestYieldQuote.askQuoteValue ) / 2
      yieldMid = this.utility.round(yieldMid, yieldRounding);

      name = this.bestQuotes[quote].name;

      for(let securityTableRowDTO in securityTableRowDTOList)
      {
        if(this.bestQuotes[quote].securityID === securityTableRowDTOList[securityTableRowDTO].data.security.data.securityID)
        {
          mark = securityTableRowDTOList[securityTableRowDTO].data.security.data.mark.mark;
          positionCurrent = securityTableRowDTOList[securityTableRowDTO].data.security.data.positionCurrent;
        }
      }

      this.xAxisData.push({ category: this.bestQuotes[quote].term });
      this.yAxisData.push(mark);
      this.yAxisData.push(spreadMid);

      if(this.bestQuotes[quote].seniority === "SR Bond")
      {
        if(mark > 0)
        {
          this.srBondChartMarkData.push({ category: this.bestQuotes[quote].term, 
                                spreadMid: spreadMid, 
                                spreadMark: mark, 
                                security: name, 
                                seniority: this.bestQuotes[quote].seniority,
                                positionCurrent: positionCurrent });
        }
        else
        {
          this.srBondChartData.push({ category: this.bestQuotes[quote].term, 
            spreadMid: spreadMid, 
            spreadMark: mark, 
            security: name, 
            securityCount: 0, 
            seniority: this.bestQuotes[quote].seniority });
        }
      }
      else if(this.bestQuotes[quote].seniority === "SUB Bond")
      {
        if(mark > 0)
        {
          this.subBondChartMarkData.push({ category: this.bestQuotes[quote].term, 
                                spreadMid: spreadMid, 
                                spreadMark: mark, 
                                security: name, 
                                seniority: this.bestQuotes[quote].seniority,
                                positionCurrent: positionCurrent });
        }
        else
        {
          this.subBondChartData.push({ category: this.bestQuotes[quote].term, 
            spreadMid: spreadMid, 
            spreadMark: mark, 
            security: name, 
            securityCount: 0, 
            seniority: this.bestQuotes[quote].seniority });
        }
      }
    }

    if(this.subBondChartMarkData.length <= 0 )
    {
      this.subBondChartMarkData.push({spreadMid: 0,
                                      spreadMark: 0 })
    }
    if(this.srBondChartData !== null)
    {
      this.buildChart();
    }
 }

  buildChart() {
    this.zone.runOutsideAngular(() => {

      let chart: am4charts.XYChart;

      chart = am4core.create("chartdiv", am4charts.XYChart);

      if(!this.isYAxisYield && !this.isYAxisSpread)
      {
        this.isYAxisSpread = true;
      }

      //Initialize chart Axes
      this.graphService.initializeObligorChartAxes(this.xAxisData, this.yAxisData, chart);

      // Generate a graph for each data type, sending in the raw data,  the color scheme and the name.
      this.graphService.buildObligorGraph(chart,this.srBondChartData, this.srBondChartMarkData, "#712f79", "Sr Bond", "spreadMid");

      //this.graphService.buildObligorGraph(chart, this.subBondChartData,this.subBondChartMarkData, "#293881", "Sub Bond",  "spreadMid");
      //this.graphService.buildObligorGraph(chart, this.subBondChartData, "#0f8276", "Sub Bond",  "spreadMid");
      //this.graphService.buildObligorGraph(chart, subCDSData, "#ff9933", "Sub CDS",  "spreadMid");

      // Add legend for each chart type.
      chart.legend = new am4charts.Legend();
      chart.zoomOutButton.disabled = true;
      
      // Disable the lengend markers. We only want the name of the graph for now.
      chart.legend.markers.template.disabled = true;

    });
  }

  ngOnDestroy() {
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