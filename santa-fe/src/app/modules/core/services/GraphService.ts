import { Injectable } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_regression from "@amcharts/amcharts4/plugins/regression";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import am4themes_moonrisekingdom from "@amcharts/amcharts4/themes/moonrisekingdom";
import am4themes_spiritedaway from "@amcharts/amcharts4/themes/spiritedaway";
import * as moment from 'moment';

import { UtilityService } from './UtilityService';
import {
  SecurityGroupPieChartBlock,
  SecurityGroupPieChartDataBlock,
  ObligorChartCategoryBlock
} from 'FEModels/frontend-blocks.interface';
import { TradeObligorGraphPanelState } from 'FEModels/frontend-page-states.interface';
import {
  ObligorGraphCategoryData,
  ObligorGraphAxesZoomState,
  LilMarketGraphSeriesDataPack,
  AmchartPieDataBlock
} from 'src/app/modules/core/models/frontend/frontend-adhoc-packages.interface';
import { MIN_OBLIGOR_CURVE_VALUES } from 'src/app/modules/core/constants/coreConstants.constant'
import {
  HistoricalTradeVisualizerDTO,
  TraceTradesVisualizerDTO
} from 'FEModels/frontend-models.interface';
import {
  TradeSideValueEquivalent,
  traceTradePieGraphKeys
} from 'Core/constants/securityTableConstants.constant';


@Injectable()
export class GraphService {
  constructor(
    private utility: UtilityService
  ) { }

    public destoryGraph(chart: am4charts.XYChart|am4charts.PieChart) {
      chart.dispose();
      return null;
    }

    public clearGraph(chart: am4charts.XYChart): am4charts.XYChart {
      chart.dispose()
      chart.series.clear();
      return chart;
    }

  // Security Pie Chart 
    public generateSecurityGroupPieChart(
      pieChartDTO: SecurityGroupPieChartBlock,
    ): am4charts.PieChart {
      const chart = am4core.create(pieChartDTO.name, am4charts.PieChart);
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields = {
        "value": "value",
        "category": "label"
      };
      pieSeries.slices.template.propertyFields.fill = "color";
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;
      pieSeries.tooltip.disabled = true;
      pieSeries.slices.template.stroke = am4core.color(`#fff`);
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.slices.template.strokeWidth = 1;
      pieSeries.alignLabels = false;
      pieSeries.labels.template.text = "{category}";
      pieSeries.labels.template.fontFamily = "SantaOpenSans";
      pieSeries.labels.template.fontWeight = "300";
      pieSeries.labels.template.fontSize = 1;  // this is not working
      chart.fontSize = 1;  // this is not working
      pieSeries.labels.template.radius = am4core.percent(-40);
      if (pieChartDTO.colorScheme.type === 'Seniority') {
        pieSeries.labels.template.fill = am4core.color("#333");
      } else {
        pieSeries.labels.template.fill = am4core.color("white");
      }
      //pieSeries.slices.template.states.getKey("hover").properties.innerRadius = 0.2;
      pieSeries.slices.template.states.getKey("hover").properties.scale = 1;
      pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
      //pieSeries.innerRadius = am4core.percent(60);
      const data = this.generateGroupPieChartData(pieChartDTO);
      chart.data = data;
      //chart.innerRadius = 1;
      //chart.defaultState.properties.innerRadius = am4core.percent(2);
      //chart.hiddenState.properties.innerRadius = 0.2;
      //pieSeries.innerRadius = am4core.percent(0);
      //pieSeries.hiddenState.properties.innerRadius = am4core.percent(10);
      //pieSeries.defaultState.properties.innerRadius = am4core.percent(100);
      //pieSeries.hiddenState.properties.innerRadius = am4core.percent(50);
      //const parentSelectedState = chart.states.create("selected");
      //parentSelectedState.properties.innerRadius = 1;
      const selectedState = pieSeries.states.create("selected");
      //chart.setState("default");
      return chart;
    }

    public changeSecurityGroupPieChartOnSelect(
      pieChartDTO: SecurityGroupPieChartBlock,
      isSelected: boolean
    ) {
      const chart = pieChartDTO.chart;
      const pieSeries = chart.series.getIndex(0);
      const activeSpacingColor = pieChartDTO.colorScheme.scheme[0].value;
      const defaultSpacingColor = '#fff';
      if (isSelected) {
        //chart.setState("hidden", 300);
        pieSeries.labels.template.disabled = false;
        pieSeries.slices.template.stroke = am4core.color(activeSpacingColor);
        pieSeries.setState("selected", 300);
      } else {
        //chart.setState("default", 300);
        pieSeries.labels.template.disabled = true;
        pieSeries.slices.template.stroke = am4core.color(defaultSpacingColor);
        pieSeries.setState("default", 300);
      }
    }

    private generateGroupPieChartData(
      pieChartDTO: SecurityGroupPieChartBlock
    ): Array<SecurityGroupPieChartDataBlock> {
      const colorScheme = pieChartDTO.colorScheme.scheme;
      const dataList: Array<SecurityGroupPieChartDataBlock> = [];
      //if (pieChartDTO.colorScheme.type === 'Rating') {
      for (const attrName in pieChartDTO.rawSupportingData) {
        const colorMappingIndex = this.findColorMapping(pieChartDTO.colorScheme.type, attrName);
        const newEntry: SecurityGroupPieChartDataBlock = {
          label: pieChartDTO.colorScheme.type === 'Seniority' ? this.utility.convertSenioritiesToAcronyms(attrName) : attrName,
          value: this.utility.retrieveValueForGroupPieChartFromSupportingData(pieChartDTO.rawSupportingData[attrName]),
          index: colorMappingIndex,
          color: am4core.color(colorScheme[colorMappingIndex].value)
        };
        const existEntry = dataList.find((eachEntry) => {
          return colorScheme[eachEntry.index].value === colorScheme[newEntry.index].value;
        });
        if (!!existEntry) {
          existEntry.value = existEntry.value + newEntry.value;
        } else {
          dataList.push(newEntry);
        }
      };
      // } else if (pieChartDTO.colorScheme.type === 'Seniority') {
      //   for (const attrName in pieChartDTO.rawSupportingData) {

      //   }
      // }
      return dataList
    }

    private findColorMapping(colorScheme: string, attrName: string): number {
      if (colorScheme === 'Rating') {
        return this.utility.mapRatings(attrName);
      } else if (colorScheme === 'Seniority') {
        return this.utility.mapSeniorities(attrName);
      }
    }
  // Security Pie Chart end

  // LilMarket Obligor Chart
    public clearGraphSeries(chart: am4charts.XYChart) {
      chart.series.clear();

      return chart;
    }

    public buildObligorChart(state: TradeObligorGraphPanelState) {
      // Initialize the chart as XY.
      state.obligorChart = am4core.create("chartdiv", am4charts.XYChart);

      let xAxis = this.initializeObligorChartXAxis(state);
      let yAxis = this.initializeObligorChartYAxis(state);

      // Draw each chart category.
      state.chartCategories.forEach((eachCategory) => {
        this.addCategoryToObligorGraph(eachCategory, state);
      });

      // Add legend for each chart type.
      state.obligorChart.legend = new am4charts.Legend();

      // Build the reset ( zoomOutButton )
      // TODO: Move this to another method.
      let resetButtonContainer = state.obligorChart.plotContainer.createChild(am4core.Container);
      resetButtonContainer.shouldClone = false;
      resetButtonContainer.align = "left";
      resetButtonContainer.valign = "top";
      resetButtonContainer.marginTop = 0;
      resetButtonContainer.zIndex = Number.MAX_SAFE_INTEGER;
      resetButtonContainer.draggable = true;

      let resetButton = resetButtonContainer.createChild(am4core.Button);
      resetButton.label.text = "-";
      resetButton.background.fill = am4core.color('#bdbdbd');
      resetButton.stroke = am4core.color('#000000');

      // Reset button click event.
      resetButton.events.on("hit", function (ev) {
        if (state.axesZoomState.xAxis.fullZoomStart !== null && state.axesZoomState.xAxis.fullZoomEnd !== null) {
          xAxis.zoomToValues(state.axesZoomState.xAxis.fullZoomStart, state.axesZoomState.xAxis.fullZoomEnd);
        }
        if (state.axesZoomState.yAxis.fullZoomStart !== null && state.axesZoomState.yAxis.fullZoomEnd !== null) {
          yAxis.zoomToValues(state.axesZoomState.yAxis.fullZoomStart, state.axesZoomState.yAxis.fullZoomEnd);
        }
      });

      // Initialize trigger events for chart legend
      this.initializeObligorChartTriggerEvents(state, xAxis, yAxis);

      // Add a cursor to the chart, with zoom behaviour. 
      state.obligorChart.cursor = new am4charts.XYCursor();
      state.obligorChart.cursor.behavior = "panXY";
      state.obligorChart.mouseWheelBehavior = "zoomXY";
      state.obligorChart.mouseOptions.sensitivity = 1;
      state.obligorChart.cursor.lineX.disabled = true;
      state.obligorChart.cursor.lineY.disabled = true;
      state.obligorChart.zoomOutButton.disabled = true;
    }

    public addCategoryToObligorGraph(category: ObligorChartCategoryBlock, state: TradeObligorGraphPanelState) {
      // Create data array that can be handled by amCharts from out category DataItems.
      let amChartsData: any[] = this.buildObligorChartData(category, state);

      if (amChartsData.length > 0) {
        // Create a dumbbell series.
        let dumbBellSeries: am4charts.ColumnSeries = this.buildObligorChartDumbells(state, category, amChartsData);

        if (amChartsData.length > MIN_OBLIGOR_CURVE_VALUES) {
          // Create a trend curve.
          let curveSeries: am4charts.LineSeries = this.buildObligorChartTrendCurve(state, category, amChartsData, dumbBellSeries);
        }
      }
    }

    public captureXYChartCurrentZoomState(chart: any, state: TradeObligorGraphPanelState): ObligorGraphAxesZoomState {
      // Capture the current axes zoom state in out Zoom State object.
      // This is not used, but here when we need it.
      let currentState: ObligorGraphAxesZoomState;
      currentState = {
        xAxis: {
          start: chart.xAxes.values[0].minZoomed,
          end: chart.xAxes.values[0].maxZoomed,
          fullZoomStart: state.axesZoomState.xAxis.fullZoomStart,
          fullZoomEnd: state.axesZoomState.xAxis.fullZoomEnd,
        },
        yAxis: {
          start: chart.yAxes.values[0].minZoomed,
          end: chart.yAxes.values[0].maxZoomed,
          fullZoomStart: state.axesZoomState.yAxis.fullZoomStart,
          fullZoomEnd: state.axesZoomState.yAxis.fullZoomEnd,
        }
      }
      return currentState;
    }

    public buildObligorChartData(category: ObligorChartCategoryBlock, state: TradeObligorGraphPanelState): any[] {
      let amChartsData: ObligorGraphCategoryData[] = [];

      for (let dataItem in category.data.obligorCategoryDataItemDTO) {

        let mid: number;
        if (state.metric.spread) mid = category.data.obligorCategoryDataItemDTO[dataItem].data.spreadMid;
        else if (state.metric.yield) mid = category.data.obligorCategoryDataItemDTO[dataItem].data.yieldMid;

        if (mid !== 0) {

          // The dumbbell chart will not work if the mark is null. If it is, we will set it to the value of mid to be "hidden" behind it.
          let mark: number;
          if (category.data.obligorCategoryDataItemDTO[dataItem].data.mark === null && mid !== null) mark = mid;
          else mark = Number(category.data.obligorCategoryDataItemDTO[dataItem].data.mark);

          // Set the value of of the markQuantity. Can be either CS01 or Quantity
          let markQuantity: number;
          if (state.markValue.cS01) markQuantity = category.data.obligorCategoryDataItemDTO[dataItem].data.cS01
          else if (state.markValue.quantity) markQuantity = category.data.obligorCategoryDataItemDTO[dataItem].data.currentPosition

          //TODO: After being more familiar with amcharts, I don't think we need a seperate object for this.
          // We can probably find a way to send in ObligorChartCategoryBlock to create the series. I'm not entirely sure if it will work. But worth looking into.
          // This whole method would be removed, and it would get rid of some duplication.
          if (mid !== null)
            amChartsData.push({
              name: category.data.obligorCategoryDataItemDTO[dataItem].data.name,
              mid: mid,
              mark: mark,
              workoutTerm: category.data.obligorCategoryDataItemDTO[dataItem].data.workoutTerm,
              markQuantity: markQuantity
            })
        }
      }
      return amChartsData;
    }

    private buildObligorChartDumbells(state: TradeObligorGraphPanelState, category: ObligorChartCategoryBlock, amChartsData: any[]): am4charts.ColumnSeries {

      if (amChartsData.length > 0) {
        // Create the column representing the mark discrepency.
        let dumbBellseries = state.obligorChart.series.push(new am4charts.ColumnSeries());
        dumbBellseries.data = amChartsData;
        dumbBellseries.dataFields.valueX = "workoutTerm";
        dumbBellseries.dataFields.openValueY = "mid";
        dumbBellseries.fill = am4core.color(category.data.color);
        dumbBellseries.stroke = am4core.color(category.data.color);
        dumbBellseries.name = category.data.name;
        dumbBellseries.strokeOpacity = 1;
        dumbBellseries.hidden = category.state.isHidden;
        dumbBellseries.sequencedInterpolation = true;
        dumbBellseries.columns.template.width = 3;
        dumbBellseries.dataFields.value = "markQuantity";
        dumbBellseries.hiddenState.transitionDuration = 0;
        dumbBellseries.defaultState.transitionDuration = 0;
        if (category.state.isMarkHidden) {
          dumbBellseries.dataFields.value = null;
          dumbBellseries.dataFields.valueY = "mid";
        }
        else dumbBellseries.dataFields.valueY = "mark";

        if (category.state.isMarkHidden === false) {
          // Modify the column color based on mark discrepency.
          let columnTemplate = dumbBellseries.columns.template;
          columnTemplate.strokeWidth = 1;
          columnTemplate.strokeOpacity = 1;
          columnTemplate.stroke = am4core.color(category.data.color);
          columnTemplate.hiddenState.transitionDuration = 0;
          columnTemplate.defaultState.transitionDuration = 0;
          let markDot = dumbBellseries.bullets.push(new am4charts.CircleBullet());
          markDot.circle.radius = 3;

          //Add a circle bullet to represent the mark.
          let markBullet = dumbBellseries.bullets.push(new am4charts.CircleBullet());
          markBullet.circle.fillOpacity = 0.3;
          markBullet.circle.strokeOpacity = 1;
          markBullet.strokeOpacity = 1;
          markBullet.nonScalingStroke = true;
          // In order to build the correct toolip we will need to dig into the data to find if the markValue is null.
          markBullet.tooltipHTML = '';
          markBullet.adapter.add('tooltipHTML', function (text, target) {
            let data: any = target.tooltipDataItem.dataContext
            if (state.markValue.cS01) {
              return `<center><b>{name}</b> </br>
                    Mid: {mid} </br>
                    Mark: {mark}</br>
                    CS01: {markQuantity}</center>`;
            }
            else if (state.markValue.quantity) {
              return `<center><b>{name}</b> </br>
                    Mid: {mid} </br>
                    Mark: {mark}</br>
                    Current Position: {markQuantity}</center>`;
            }
          });
          markBullet.hiddenState.transitionDuration = 0;
          markBullet.defaultState.transitionDuration = 0;
          dumbBellseries.heatRules.push({
            target: markBullet.circle,
            min: 20,
            max: 30,
            property: "radius",
          });
        }

        // Add a circle bullet to represent the mid.
        let midBullet = dumbBellseries.bullets.push(new am4charts.CircleBullet());
        midBullet.circle.strokeOpacity = 1;
        midBullet.strokeOpacity = 1;
        midBullet.stroke = am4core.color(category.data.color).lighten(-0.3);
        midBullet.fill = am4core.color(category.data.color);
        midBullet.locationY = 1;
        midBullet.circle.radius = 5;
        midBullet.tooltipHTML = '';
        midBullet.hiddenState.transitionDuration = 0;
        midBullet.defaultState.transitionDuration = 0;

        // In order to build the correct toolip we will need to dig into the data to find if the markValue is null.
        midBullet.adapter.add('tooltipHTML', function (text, target) {
          let data: any = target.tooltipDataItem.dataContext;

          if (state.metric.yield || data.markQuantity === null) {
            return `<center><b>{name}</b> </br>
                    Mid: {mid}</center>`;
          }
          else if (state.markValue.cS01) {
            return `<center><b>{name}</b> </br>
                    Mid: {mid} </br>
                    Mark: {mark}</br>
                    CS01: {markQuantity}</center>`;
          }
          else if (state.markValue.quantity) {
            return `<center><b>{name}</b> </br>
                    Mid: {mid} </br>
                    Mark: {mark}</br>
                    Current Position: {markQuantity}</center>`;
          }
        });

        dumbBellseries.events.on("hidden", function () {
          dumbBellseries.hide();
        });
        return dumbBellseries;
      }
      else return null;

    }

    private buildObligorChartTrendCurve(state: TradeObligorGraphPanelState, category: ObligorChartCategoryBlock, amChartsData: any[], dumbBellSeries: am4charts.ColumnSeries): am4charts.LineSeries {

      var sortedArray: any[] = amChartsData.sort((obj1, obj2) => {
        if (obj1.workoutTerm > obj2.workoutTerm) {
          return 1;
        }

        if (obj1.workoutTerm < obj2.workoutTerm) {
          return -1;
        }

        return 0;
      });

      let series = state.obligorChart.series.push(new am4charts.LineSeries());
      series.data = amChartsData;
      series.dataFields.valueX = "workoutTerm";
      series.dataFields.valueY = "mid";
      series.hidden = true;
      series.hiddenInLegend = true;

      let regression = series.plugins.push(new am4plugins_regression.Regression());
      regression.method = "polynomial";
      regression.reorder = true;
      regression.options = {
        order: 2,
        precision: 10
      }

      let curveSeries: am4charts.LineSeries;
      regression.events.on("processed", (ev) => {

        let equation = ev.target.result.equation;

        if (this.validateCurveEquation(equation)) {

          let range: number;
          range = (amChartsData[amChartsData.length - 1].workoutTerm - amChartsData[0].workoutTerm) / 1000;

          let curve: any[] = [];
          for (let i = amChartsData[0].workoutTerm; i < amChartsData[amChartsData.length - 1].workoutTerm; i += range) {
            curve.push({ x: i, y: (equation[0] * (i * i) + (equation[1] * i) + equation[2]) });
          }

          curveSeries = state.obligorChart.series.push(new am4charts.LineSeries());
          curveSeries.data = curve;
          curveSeries.dataFields.valueX = "x";
          curveSeries.dataFields.valueY = "y";
          curveSeries.strokeWidth = 2;
          curveSeries.tensionY = 1;
          curveSeries.tensionX = 0.95;
          curveSeries.stroke = am4core.color(category.data.color);
          curveSeries.name = "CurveSeries";
          curveSeries.hiddenState.transitionDuration = 0;
          curveSeries.defaultState.transitionDuration = 0;
          curveSeries.hiddenInLegend = true;

          let regression = curveSeries.plugins.push(new am4plugins_regression.Regression());
          regression.method = "polynomial";
          regression.reorder = true;
          regression.options = {
            order: 2,
            precision: 10
          }

          // Hide the curve line when the coresponding dumbbell series is hidden.
          dumbBellSeries.events.on("hidden", function () {
            curveSeries.hide();
          });

          // Display the curve line when the coresponding dumbbell series is displayed.
          dumbBellSeries.events.on("shown", function () {
            curveSeries.show();
          });
        }
      });

      regression.dispose();

      return curveSeries;
    }

    private validateCurveEquation(curveResult: any[]) {
      let isValid: boolean;

      // Regression plugin can sometimes throw back "Infinity" if we only send two values.
      if (curveResult[0] === Number.POSITIVE_INFINITY || curveResult[1] === Number.POSITIVE_INFINITY || curveResult[2] === Number.POSITIVE_INFINITY ||
        curveResult[0] === Number.NEGATIVE_INFINITY || curveResult[1] === Number.NEGATIVE_INFINITY || curveResult[2] === Number.NEGATIVE_INFINITY) isValid = false;
      else isValid = true;

      return isValid;
    }

    private initializeObligorChartXAxis(state: TradeObligorGraphPanelState): am4charts.ValueAxis {
      let xAxis = state.obligorChart.xAxes.push(new am4charts.ValueAxis());
      xAxis.renderer.grid.template.strokeDasharray = "1,3";
      xAxis.title.text = "Tenor";
      xAxis.min = 0;
      xAxis.renderer.minGridDistance = 60;
      xAxis.extraMax = 0.05;

      return xAxis;
    }

    private initializeObligorChartYAxis(state: TradeObligorGraphPanelState): am4charts.ValueAxis {
      let yAxis = state.obligorChart.yAxes.push(new am4charts.ValueAxis());
      if (state.metric.spread) yAxis.title.text = "Spread";
      if (state.metric.yield) yAxis.title.text = "Yield";
      yAxis.renderer.grid.template.strokeDasharray = "1,3";
      yAxis.min = 0;
      yAxis.extraMax = 0.1;

      return yAxis;
    }

    private initializeObligorChartTriggerEvents(state: TradeObligorGraphPanelState, xAxis: am4charts.ValueAxis, yAxis: am4charts.ValueAxis) {
      // When the legend is clicked, reset the axis zoom scope.
      state.obligorChart.legend.events.on("hit", function (ev) {
        state.axesZoomState.xAxis.start = null;
        state.axesZoomState.xAxis.end = null;
        state.axesZoomState.yAxis.start = null;
        state.axesZoomState.yAxis.end = null;

        state.axesZoomState.xAxis.fullZoomStart = null;
        state.axesZoomState.xAxis.fullZoomEnd = null;
        state.axesZoomState.yAxis.fullZoomStart = null;
        state.axesZoomState.yAxis.fullZoomEnd = null;

      });

      // Capture the original zoom values of axes before a change is made.
      // TODO: Move this into their own method. ( I've attempted this a couple times, but passing / modifying the axes in a seperate method doesnt seem to work. )
      yAxis.events.on("startchanged", function (ev) {
        if (state.axesZoomState.yAxis.fullZoomStart === null && state.axesZoomState.yAxis.fullZoomEnd === null) {
          state.axesZoomState.yAxis.fullZoomStart = ev.target.minZoomed;
          state.axesZoomState.yAxis.fullZoomEnd = ev.target.maxZoomed;
        }

      });
      xAxis.events.on("startchanged", function (ev) {
        if (state.axesZoomState.xAxis.fullZoomStart === null && state.axesZoomState.xAxis.fullZoomEnd === null) {
          state.axesZoomState.xAxis.fullZoomStart = ev.target.minZoomed;
          state.axesZoomState.xAxis.fullZoomEnd = ev.target.maxZoomed;
        }
      });
      yAxis.events.on("endchanged", function (ev) {
        if (state.axesZoomState.yAxis.fullZoomStart === null && state.axesZoomState.yAxis.fullZoomEnd === null) {
          state.axesZoomState.yAxis.fullZoomStart = ev.target.minZoomed;
          state.axesZoomState.yAxis.fullZoomEnd = ev.target.maxZoomed;
        }
      });
      xAxis.events.on("endchanged", function (ev) {
        if (state.axesZoomState.xAxis.fullZoomStart === null && state.axesZoomState.xAxis.fullZoomEnd === null) {
          state.axesZoomState.xAxis.fullZoomStart = ev.target.minZoomed;
          state.axesZoomState.xAxis.fullZoomEnd = ev.target.maxZoomed;
        }
      });
    }

    private resetAxesZoomScope(state: TradeObligorGraphPanelState){
    }

    /* 
      refactor exemption area
    */ 
    public buildLilMarketTimeSeriesGraph(
      baseDataPack: LilMarketGraphSeriesDataPack,
      targetDataPack: LilMarketGraphSeriesDataPack
    ): am4charts.XYChart {
      
      const chart = am4core.create('LilMarketGraph', am4charts.XYChart);

      // Set input format for the dates
      // chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
      chart.dateFormatter.inputDateFormat = "MM-dd-yyyy";
      chart.legend = new am4charts.Legend();

      // Create axes
      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      this.buildLilMarketSeries(chart, baseDataPack);
      this.buildLilMarketSeries(chart, targetDataPack);

      // Make a panning cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "panXY";
      chart.cursor.xAxis = dateAxis;
      // chart.cursor.snapToSeries = series;
      return chart;
    }

    private buildLilMarketSeries(chart: am4charts.XYChart, dataPack: LilMarketGraphSeriesDataPack){
      // Create series
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "value";
      series.dataFields.dateX = "date";
      series.tooltipText = "{value}"
      series.strokeWidth = 2;
      series.minBulletDistance = 15;
      series.data = [];

      dataPack.data.forEach((eachEntry) => {
        const newDataPoint = {
          date: eachEntry.date.slice(0, 10),
          value: eachEntry.value
        };
        series.data.push(eachEntry);
      });

      // Drop-shaped tooltips
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.strokeOpacity = 0;
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.label.minWidth = 40;
      series.tooltip.label.minHeight = 40;
      series.tooltip.label.textAlign = "middle";
      series.tooltip.label.textValign = "middle";

      // Make bullets grow on hover
      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.strokeWidth = 2;
      bullet.circle.radius = 4;
      bullet.circle.fill = am4core.color("#fff");

      const bullethover = bullet.states.create("hover");
      bullethover.properties.scale = 1.3;

      // legend
      series.legendSettings.labelText = `[bold {color}]${dataPack.name}[/]`;
    }
  // LilMarket Obligor Chart end

  // TradeHistoryVisualizer Charts

    public generateTradeHistoryTimeSeries(dto: HistoricalTradeVisualizerDTO): am4charts.XYChart {
      // Create chart
      let chart = am4core.create(dto.data.timeSeriesId, am4charts.XYChart);

      // Load data
      chart.data = dto.data.prinstineTradeList.map((eachTrade) => {
        return {
          Date: new Date(moment.unix(eachTrade.data.tradeDateTime).format()),
          BuySpread: eachTrade.data.rawQuantity >= 0 ? eachTrade.data.spread : null,
          SellSpread: eachTrade.data.rawQuantity < 0 ? eachTrade.data.spread : null,
          Volume: eachTrade.data.rawQuantity
        };
      });

      // the following line makes value axes to be arranged vertically.
      chart.leftAxesContainer.layout = "vertical";

      // uncomment this line if you want to change order of axes
      //chart.bottomAxesContainer.reverseOrder = true;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.ticks.template.length = 8;
      dateAxis.renderer.ticks.template.strokeOpacity = 0.1;
      dateAxis.renderer.grid.template.disabled = true;
      dateAxis.renderer.ticks.template.disabled = false;
      dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
      dateAxis.renderer.minLabelPosition = 0.01;
      dateAxis.renderer.maxLabelPosition = 0.99;
      dateAxis.keepSelection = true;
      dateAxis.minHeight = 30;
      dateAxis.groupData = false;
      dateAxis.minZoomCount = 5;
      dateAxis.baseInterval = {
        "timeUnit": "minute",
        "count": 1
      };
      // these two lines makes the axis to be initially zoomed-in
      // dateAxis.start = 0.7;
      // dateAxis.keepSelection = true;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.tooltip.disabled = true;
      valueAxis.zIndex = 1;
      valueAxis.renderer.baseGrid.disabled = true;
      // height of axis
      valueAxis.height = am4core.percent(65);

      valueAxis.renderer.gridContainer.background.fill = am4core.color("#000000");
      valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;
      valueAxis.renderer.inside = true;
      valueAxis.renderer.labels.template.verticalCenter = "bottom";
      valueAxis.renderer.labels.template.padding(2, 2, 2, 2);

      //valueAxis.renderer.maxLabelPosition = 0.95;
      valueAxis.renderer.fontSize = "0.8em"

      let lineBuy = chart.series.push(new am4charts.LineSeries());
      lineBuy.dataFields.dateX = "Date";
      lineBuy.dataFields.valueY = "BuySpread";
      lineBuy.strokeOpacity = 0;
      // series.dataFields.lowValueY = "Low";
      // series.dataFields.highValueY = "High";
      // series.clustered = false;
      // series.tooltipText = "open: {openValueY.value}\nlow: {lowValueY.value}\nhigh: {highValueY.value}\nclose: {valueY.value}";
      // series.name = "MSFT";
      // series.defaultState.transitionDuration = 0;
      let bulletBuy = lineBuy.bullets.push(new am4charts.CircleBullet());
      bulletBuy.stroke = am4core.color('#BC2B5D');
      bulletBuy.fill = am4core.color('#BC2B5D');
      bulletBuy.tooltipText = "Time: {dateX.value}\nSpread:{BuySpread}\nQuantity:{Volume}";

      let lineSell = chart.series.push(new am4charts.LineSeries());
      lineSell.dataFields.dateX = "Date";
      lineSell.dataFields.valueY = "SellSpread";
      lineSell.strokeOpacity = 0;
      let bulletSell = lineSell.bullets.push(new am4charts.CircleBullet());
      bulletSell.stroke = am4core.color('#26A77B');
      bulletSell.fill = am4core.color('#26A77B');
      bulletBuy.tooltipText = "Time:{Date}\nSpread:{valueY.value}\nQuantity:{Volume}";

      let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis2.tooltip.disabled = true;
      // height of axis
      valueAxis2.height = am4core.percent(35);
      valueAxis2.zIndex = 3
      // this makes gap between panels
      valueAxis2.marginTop = 30;
      valueAxis2.renderer.baseGrid.disabled = true;
      valueAxis2.renderer.inside = true;
      valueAxis2.renderer.labels.template.verticalCenter = "bottom";
      valueAxis2.renderer.labels.template.padding(2, 2, 2, 2);
      //valueAxis.renderer.maxLabelPosition = 0.95;
      valueAxis2.renderer.fontSize = "0.8em"

      valueAxis2.renderer.gridContainer.background.fill = am4core.color("#000000");
      valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;

      let series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.dataFields.dateX = "Date";
      series2.clustered = false;
      series2.dataFields.valueY = "Volume";
      series2.yAxis = valueAxis2;
      series2.tooltipText = "{valueY.value}";
      series2.name = "Series 2";
      // volume should be summed
      series2.groupFields.valueY = "sum";
      series2.defaultState.transitionDuration = 0;

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "zoomXY";

      // let scrollbarX = new am4charts.XYChartScrollbar();

      // let sbSeries = chart.series.push(new am4charts.LineSeries());
      // sbSeries.dataFields.valueY = "Close";
      // sbSeries.dataFields.dateX = "Date";
      // scrollbarX.series.push(sbSeries);
      // sbSeries.disabled = true;
      // scrollbarX.marginBottom = 20;
      // chart.scrollbarX = scrollbarX;
      // scrollbarX.scrollbarChart.xAxes.getIndex(0).minHeight = undefined;
      return chart;
    }

    public generateTradeHistoryVolumeLeftPie(dto: HistoricalTradeVisualizerDTO): am4charts.PieChart {
      am4core.useTheme(am4themes_dataviz);
      const chart = am4core.create(dto.data.volumeLeftPieId, am4charts.PieChart);
      const pieDataList: Array<AmchartPieDataBlock> = [];
      dto.data.prinstineTradeList.forEach((eachTrade) => {
        const exist = pieDataList.find((eachItem) => { return eachItem.subject === eachTrade.data.counterPartyName});
        if (exist) {
          exist.quantity = exist.quantity + Math.abs(eachTrade.data.rawQuantity);
        } else {
          pieDataList.push({
            quantity: Math.abs(eachTrade.data.rawQuantity),
            subject: eachTrade.data.counterPartyName
          });
        }
      });
      chart.data = pieDataList;
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "quantity";
      pieSeries.dataFields.category = "subject";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeOpacity = 1;
      chart.hiddenState.properties.radius = am4core.percent(0);
      return chart;
    }

    public generateTradeHistoryVolumeRightPie(dto: HistoricalTradeVisualizerDTO): am4charts.PieChart {
      am4core.useTheme(am4themes_frozen);
      const chart = am4core.create(dto.data.volumeRightPieId, am4charts.PieChart);
      const pieDataList: Array<AmchartPieDataBlock> = [];
      dto.data.prinstineTradeList.forEach((eachTrade) => {
        const exist = pieDataList.find((eachItem) => { return eachItem.subject === eachTrade.data.trader});
        if (exist) {
          exist.quantity = exist.quantity + Math.abs(eachTrade.data.rawQuantity);
        } else {
          pieDataList.push({
            quantity: Math.abs(eachTrade.data.rawQuantity),
            subject: eachTrade.data.trader
          });
        }
      });
      chart.data = pieDataList;
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "quantity";
      pieSeries.dataFields.category = "subject";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeOpacity = 1;
      chart.hiddenState.properties.radius = am4core.percent(0);
      return chart;
    }

    public generateTradeHistoryPositionPie(dto: HistoricalTradeVisualizerDTO): am4charts.PieChart {
      const chart = am4core.create(dto.data.positionPieId, am4charts.PieChart);
      const fundList: Array<AmchartPieDataBlock> = dto.data.positionList.map((eachPosition) => {
        return {
          subject: eachPosition.portfolioName,
          quantity: eachPosition.quantity
        }
      });
      chart.data = fundList;
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "quantity";
      pieSeries.dataFields.category = "subject";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeOpacity = 1;
      chart.hiddenState.properties.radius = am4core.percent(0);
      return chart;
    }

    public generateTradeTraceScatterGraph(dto: TraceTradesVisualizerDTO): am4charts.XYChart {
      const chart = am4core.create(dto.data.scatterGraphId, am4charts.XYChart);
      const reverseList = [...dto.data.displayList].reverse();
      const tradeData = reverseList.map(trade => {
        const time = new Date(trade.tradeTime);
        const object = {
          date: time.getTime(),
          ...(trade.side === TradeSideValueEquivalent.Ask && {sellY: +trade.spread}),
          ...(trade.side === TradeSideValueEquivalent.Bid && {buyY: +trade.spread})
        }
        return object;
      });
      chart.data = tradeData;
      chart.height = 160;
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.title.text = 'Time';
      const currentDate = new Date();
      const formattedDate = moment(currentDate).format('YYYY-MM-DD');
      const minStr = `${formattedDate}, 06:00:00`;
      const maxStr = `${formattedDate}, 18:00:00`;
      const minDate = new Date(minStr);
      const maxDate = new Date(maxStr);
      dateAxis.min = minDate.getTime();
      dateAxis.max = maxDate.getTime();
      dateAxis.baseInterval = {
        "timeUnit": "second",
        "count": 1
      };
      let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.title.text = 'Sprd';
      const sortedSpreadData = chart.data.map(data => {
        if (!!data.sellY || !!data.buyY) {
          return !!data.sellY ? data.sellY : data.buyY
        }
      }).sort();
      const yAxisMin = sortedSpreadData[0] - 5;
      const yAxisMax = sortedSpreadData[sortedSpreadData.length - 1] + 5;
      const yAxisMid = this.utility.round(((yAxisMax - yAxisMin)/2) + yAxisMin);
      yAxis.min = yAxisMin;
      yAxis.max = yAxisMax;
      yAxis.strictMinMax = true;
      yAxis.renderer.grid.template.disabled = true;
      yAxis.renderer.labels.template.disabled = true;
      function createGrid(value) {
        var range = yAxis.axisRanges.create();
        range.value = value;
        range.label.text = "{value}";
      }
      createGrid(yAxisMin);
      createGrid(yAxisMid);
      createGrid(yAxisMax);
      let series1 = chart.series.push(new am4charts.LineSeries());
      series1.dataFields.valueY = "sellY";
      series1.dataFields.dateX = "date";
      series1.strokeOpacity = 0;
      series1.cursorTooltipEnabled = false;
      let bullet1 = series1.bullets.push(new am4charts.CircleBullet());
      bullet1.fill = am4core.color('#BC2B5D');
      bullet1.stroke = am4core.color('#eee');
      bullet1.tooltipText = "Sell {valueY} at {dateX.formatDate('HH:mm:ss')}";
      let series2 = chart.series.push(new am4charts.LineSeries());
      series2.dataFields.valueY = "buyY";
      series2.dataFields.dateX = "date";
      series2.strokeOpacity = 0;
      series2.cursorTooltipEnabled = false;
      let bullet2 = series2.bullets.push(new am4charts.CircleBullet());
      bullet2.fill = am4core.color('#26A77B')
      bullet2.stroke = am4core.color('#eee')
      bullet2.tooltipText = "Buy {valueY} at {dateX.formatDate('HH:mm:ss')}";
      return chart;
    }

    public generateTraceTradePieGraph(dto: TraceTradesVisualizerDTO, graphID: string, categories: Array<string>, targetKey: traceTradePieGraphKeys): am4charts.PieChart {
      const chart = am4core.create(graphID, am4charts.PieChart);
      const chartData = [];
      categories.forEach(category => {
        const categoryList = dto.data.displayList.filter(trade => trade[targetKey] === category);
        if (categoryList.length > 0) {
          let total = 0;
          categoryList.forEach(trade => {
            //estimated is preferred, but use reported if there is no estimated value
            const value = !!trade.volumeEstimated ? trade.volumeEstimated : trade.volumeReported;
            total += value;
          })
          const object = {
            [targetKey]: category,
            volume: total,
            ...(targetKey === traceTradePieGraphKeys.side && {color: category === TradeSideValueEquivalent.Bid ? am4core.color("#26A77B") : am4core.color('#BC2B5D')})
          }
          chartData.push(object);
        }
      })
      chart.data = chartData;
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "volume";
      pieSeries.dataFields.category = targetKey;
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;

      pieSeries.labels.template.maxWidth = 75;
      pieSeries.labels.template.wrap = true;
      pieSeries.slices.template.propertyFields.fill = "color";

      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
      return chart;
    }
  // TradeHistoryVisualizer Charts end
}