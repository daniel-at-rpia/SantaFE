import { Injectable } from '@angular/core';
import { UtilityService } from './UtilityService';
import {
  SecurityGroupPieChartBlock,
  SecurityGroupPieChartDataBlock,
  ObligorChartCategoryBlock
} from 'FEModels/frontend-blocks.interface';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_regression from "@amcharts/amcharts4/plugins/regression";
import { TradeObligorGraphPanelState, TradeObligorGraphAxesZoomState } from 'FEModels/frontend-page-states.interface';
import { ObligorGraphCategoryData } from 'src/app/modules/core/models/frontend/frontend-adhoc-packages.interface';


@Injectable()
export class GraphService {
  constructor(
    private utility: UtilityService
  ) { }

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

  public clearGraphSeries(chart: am4charts.XYChart) {
    chart.series.clear();

    return chart;
  }

  public buildObligorChart(state: TradeObligorGraphPanelState) {
    // Reset the scope for the axes.
    state.axesZoomState.xAxis.start = null;
    state.axesZoomState.xAxis.end = null;
    state.axesZoomState.yAxis.start = null;
    state.axesZoomState.yAxis.end = null;
    state.axesZoomState.xAxis.fullZoomStart = null;
    state.axesZoomState.xAxis.fullZoomEnd = null;
    state.axesZoomState.yAxis.fullZoomStart = null;
    state.axesZoomState.yAxis.fullZoomEnd = null;
    am4core.options.autoSetClassName = true;

    // Initialize the chart as XY.
    state.obligorChart = am4core.create("chartdiv", am4charts.XYChart);

    let xAxis = this.initializeObligorChartXAxis(state);
    let yAxis = this.initializeObligorChartYAxis(state);

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

    // Draw each chart category.
    state.chartCategories.forEach((eachCategory) => {
      this.addCategoryToObligorGraph(eachCategory, state);
    });

    // Add legend for each chart type.
    state.obligorChart.legend = new am4charts.Legend();
    state.obligorChart.legend.useDefaultMarker = true;

    // Build the reset ( zoomOutButton )
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
    this.initializeObligorChartLengendTriggerEvents(state);

    // Add a cursor to the chart, with zoom behaviour. 
    state.obligorChart.cursor = new am4charts.XYCursor();
    state.obligorChart.cursor.behavior = "panXY";
    state.obligorChart.mouseWheelBehavior = "zoomXY";
    state.obligorChart.mouseOptions.sensitivity = 10;
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

      if (amChartsData.length > 2) {
        // Create a trend curve.
        let curveSeries: am4charts.LineSeries = this.buildObligorChartTrendCurve(state, category, amChartsData, dumbBellSeries);
      }
    }
  }

  public captureXYChartCurrentZoomState(chart: any, state: TradeObligorGraphPanelState): TradeObligorGraphAxesZoomState {
    // Capture the current axes zoom state in out Zoom State object.
    // This is not used, but here when we need it.
    let currentState: TradeObligorGraphAxesZoomState;
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

    var regression = series.plugins.push(new am4plugins_regression.Regression());
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

  private initializeObligorChartLengendTriggerEvents(state: TradeObligorGraphPanelState) {
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
  }
}