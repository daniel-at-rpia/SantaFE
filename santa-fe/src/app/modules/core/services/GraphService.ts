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
import { TradeObligorGraphPanelState } from 'FEModels/frontend-page-states.interface';
import { first } from '@amcharts/amcharts4/.internal/core/utils/Array';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


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

  public buildObligorChart(state: TradeObligorGraphPanelState) {

    am4core.options.autoSetClassName = true;

    // Initialize the chart as XY.
    state.obligorChart = am4core.create("chartdiv", am4charts.XYChart);

    let xAxis = this.initializeObligorChartXAxis(state);
    let yAxis = this.initializeObligorChartYAxis(state);

    // Reset the scope for the axes.
    state.xAxis.start = null;
    state.xAxis.end = null;
    state.yAxis.start = null;
    state.yAxis.end = null;

    yAxis.events.on("startchanged", function (ev) {
      if (state.yAxis.start === null && state.yAxis.end === null) {
        state.yAxis.start = ev.target.minZoomed;
        state.yAxis.end = ev.target.maxZoomed;
      }
    });

    yAxis.events.on("endchanged", function (ev) {
      if (state.yAxis.start === null && state.yAxis.end === null) {
        state.yAxis.start = ev.target.minZoomed;
        state.yAxis.end = ev.target.maxZoomed;
      }
    });

    xAxis.events.on("startchanged", function (ev) {
      if (state.xAxis.start === null && state.xAxis.end === null) {
        state.xAxis.start = ev.target.minZoomed;
        state.xAxis.end = ev.target.maxZoomed;
      }
    });

    xAxis.events.on("endchanged", function (ev) {
      if (state.xAxis.start === null && state.xAxis.end === null) {
        state.xAxis.start = ev.target.minZoomed;
        state.xAxis.end = ev.target.maxZoomed;
      }
    });

    // TODO: This part is incomplete. Right now this chart only handles quantity.
    // Each chart category DTO has its own "isMarkHidden" field which should be used.
    let displayMark: boolean = false;
    if (state.markValue.cS01 || state.markValue.quantity) {
      displayMark = true;
    }

    // Draw each chart category.
    state.chartCategories.forEach((eachCategory) => {
      if (eachCategory.data.obligorCategoryDataItemDTO.length > 0) this.addCategoryToObligorGraph(eachCategory, state);
    });

    // Add legend for each chart type.
    state.obligorChart.legend = new am4charts.Legend();
    state.obligorChart.legend.useDefaultMarker = true;

    // When the legend is clicked, reset the axis zoom scope.
    state.obligorChart.legend.events.on("hit", function (ev) {
      state.xAxis.start = null;
      state.xAxis.end = null;
      state.yAxis.start = null;
      state.yAxis.end = null;
    });

    let resetButtonContainer = state.obligorChart.plotContainer.createChild(am4core.Container);
    resetButtonContainer.shouldClone = false;
    resetButtonContainer.align = "left";
    resetButtonContainer.valign = "top";
    resetButtonContainer.marginTop = 0;
    resetButtonContainer.zIndex = Number.MAX_SAFE_INTEGER;
    resetButtonContainer.draggable = true;

    let resetButton = resetButtonContainer.createChild(am4core.Button);
    resetButton.label.text = "Reset";
    resetButton.background.fill = am4core.color('#bdbdbd');
    resetButton.stroke = am4core.color('#000000');
    resetButton.events.on("hit", function (ev) {
      if (state.xAxis.start !== null && state.xAxis.end !== null) {
        xAxis.zoomToValues(state.xAxis.start, state.xAxis.end);
      }

      if (state.yAxis.start !== null && state.yAxis.end !== null) {
        yAxis.zoomToValues(state.yAxis.start, state.yAxis.end);
      }
    });
    
    let zoomButtonContainer = state.obligorChart.plotContainer.createChild(am4core.Container);
    zoomButtonContainer.shouldClone = false;
    zoomButtonContainer.align = "left";
    zoomButtonContainer.valign = "top";
    zoomButtonContainer.zIndex = Number.MAX_SAFE_INTEGER;
    zoomButtonContainer.marginTop = 0;
    zoomButtonContainer.marginLeft = 70;
    zoomButtonContainer.layout = "horizontal";
    zoomButtonContainer.draggable = true;

    let zoomInButton = zoomButtonContainer.createChild(am4core.Button);
    zoomInButton.label.text = "+";
    zoomInButton.events.on("hit", function(ev) {
      let diff = xAxis.maxZoomed - xAxis.minZoomed;
      let delta = diff * 0.2;
      xAxis.zoomToValues(xAxis.minZoomed + delta, xAxis.maxZoomed - delta);
    });

    let zoomOutButton = zoomButtonContainer.createChild(am4core.Button);
    zoomOutButton.label.text = "-";
    zoomOutButton.events.on("hit", function(ev) {
      let diff = xAxis.maxZoomed - xAxis.minZoomed;
      var delta = diff * 0.2;
      xAxis.zoomToValues(xAxis.minZoomed - delta, xAxis.maxZoomed + delta);
    });
    // Add a cursor to the chart, with zoom behaviour. 
    state.obligorChart.cursor = new am4charts.XYCursor();
    state.obligorChart.cursor.behavior = "panXY";
    state.obligorChart.mouseWheelBehavior = "zoomXY";
    state.obligorChart.mouseOptions.sensitivity = 10;
    state.obligorChart.cursor.lineX.disabled = true;
    state.obligorChart.cursor.lineY.disabled = true;
    state.obligorChart.zoomOutButton.disabled = true;

  }

  public zoomAxesToCurrentState(state: TradeObligorGraphPanelState)
  {
    
    if(state.xAxis.start !== null && state.xAxis.end !== null )
    {
      state.obligorChart.xAxes.values[0].zoomToIndexes(state.xAxis.start, state.xAxis.end);
    }
    if(state.yAxis.start !== null && state.yAxis.end !== null )
    {
      state.obligorChart.yAxes.values[0].zoomToIndexes(state.yAxis.start, state.yAxis.end);
    }

  }
  public addCategoryToObligorGraph(category: ObligorChartCategoryBlock, state: TradeObligorGraphPanelState) {
    // Create data array that can be handled by amCharts from out category DataItems.
    let amChartsData: any[] = this.buildObligorChartData(category, state);

    // Create a dumbbell series.
    let dumbBellSeries: am4charts.ColumnSeries = this.generateObligorChartDumbells(state, category, amChartsData);

    // Create a trend curve. Work in Progress.
    let curveSeries: am4charts.LineSeries = this.generateObligorChartTrendCurve(state, category, amChartsData);

    // Hide the curve line when the coresponding dumbbell series is hidden.
    dumbBellSeries.events.on("hidden", function () {
      curveSeries.hide();
    });

    // Display the curve line when the coresponding dumbbell series is displayed.
    dumbBellSeries.events.on("shown", function () {
      curveSeries.show();
    });
  }

  private buildObligorChartData(category: ObligorChartCategoryBlock, state: TradeObligorGraphPanelState): any[]
  {
    let amChartsData: any[] = [];
    let mid: number;
    let mark: string;

    for (let dataItem in category.data.obligorCategoryDataItemDTO) {

      if (state.metric.spread) mid = category.data.obligorCategoryDataItemDTO[dataItem].data.spreadMid;
      else if (state.metric.yield) mid = category.data.obligorCategoryDataItemDTO[dataItem].data.yieldMid;

      if (mid !== 0) {
        // The dumbbell chart will not work if the mark is null. If it is, we will set it to the value of mid to be "hidden" behind it.
        if (category.data.obligorCategoryDataItemDTO[dataItem].data.mark === null && mid !== null) {
          mark = mid.toString();
        }
        else
        {
          mark = category.data.obligorCategoryDataItemDTO[dataItem].data.mark;
        }
        if (mid !== null)
          if (state.metric.spread) {
            // TODO: Create adhoc interface.
            amChartsData.push({
              name: category.data.obligorCategoryDataItemDTO[dataItem].data.name,
              mid: mid,
              mark: mark,
              workoutTerm: category.data.obligorCategoryDataItemDTO[dataItem].data.workoutTerm,
              positionCurrentQuantity: category.data.obligorCategoryDataItemDTO[dataItem].data.positionCurrentQuantity,
              positionCurrentCS01: category.data.obligorCategoryDataItemDTO[dataItem].data.positionCurrentCS01,
              tooltipMark: category.data.obligorCategoryDataItemDTO[dataItem].data.mark
            })
          }
        //This is temporary until I find out why we are not getting yield marks in trade center panel.
        if (state.metric.yield) {
          amChartsData.push({
            name: category.data.obligorCategoryDataItemDTO[dataItem].data.name,
            mid: mid,
            mark: mid,
            workoutTerm: category.data.obligorCategoryDataItemDTO[dataItem].data.workoutTerm,
            positionCurrentQuantity: category.data.obligorCategoryDataItemDTO[dataItem].data.positionCurrentQuantity,
            positionCurrentCS01: category.data.obligorCategoryDataItemDTO[dataItem].data.positionCurrentCS01,
            tooltipMark: category.data.obligorCategoryDataItemDTO[dataItem].data.mark
          })
        }
      }
    }
    return amChartsData;
  }

  private buildToolObligorChartToolTipCS01():string{
    return `<center><b>{name}</b> </br>
    Mid: {mid} </br>
    Mark: {tooltipMark}</br>
    Current Position: {positionCurrentCS01}</center>`;
  }

  private buildToolObligorChartToolTipQuantity():string{
    return `<center><b>{name}</b> </br>
    Mid: {mid} </br>
    Mark: {tooltipMark}</br>
    Current Position: {positionCurrentQuantity}</center>`;
  }

  private generateObligorChartDumbells(state: TradeObligorGraphPanelState, category: ObligorChartCategoryBlock, amChartsData: any[]): am4charts.ColumnSeries {

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
    if(state.markValue.cS01)dumbBellseries.dataFields.value = "positionCurrentCS01";
    else if(state.markValue.quantity)dumbBellseries.dataFields.value = "positionCurrentQuantity";
    dumbBellseries.hiddenState.transitionDuration = 0;
    dumbBellseries.defaultState.transitionDuration = 0;
    if (state.metric.spread || state.markValue.cS01 || state.markValue.quantity) {
      dumbBellseries.dataFields.valueY = "mark";
    }
    else if (state.metric.yield || (state.markValue.quantity === false && state.markValue.cS01 === false)) {
      dumbBellseries.dataFields.valueY = "mid";
    }


    // Modify the column color based on mark discrepency.
    let columnTemplate = dumbBellseries.columns.template;
    columnTemplate.strokeWidth = 1;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color(category.data.color);
    if(state.markValue.cS01) columnTemplate.tooltipHTML = this.buildToolObligorChartToolTipCS01();
    else if(state.markValue.quantity) columnTemplate.tooltipHTML = this.buildToolObligorChartToolTipQuantity();
    columnTemplate.hiddenState.transitionDuration = 0;
    columnTemplate.defaultState.transitionDuration = 0;
    let markDot = dumbBellseries.bullets.push(new am4charts.CircleBullet());
    markDot.circle.radius = 3;

    if (category.state.isMarkHidden === false) {
      //Add a circle bullet to represent the mark.
      let markBullet = dumbBellseries.bullets.push(new am4charts.CircleBullet());
      markBullet.circle.fillOpacity = 0.3;
      markBullet.circle.strokeOpacity = 1;
      markBullet.strokeOpacity = 1;
      markBullet.nonScalingStroke = true;
      if(state.markValue.cS01) markBullet.tooltipHTML = this.buildToolObligorChartToolTipCS01();
      else if(state.markValue.quantity) markBullet.tooltipHTML = this.buildToolObligorChartToolTipQuantity();
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
    if(state.markValue.cS01) midBullet.tooltipHTML = this.buildToolObligorChartToolTipCS01();
    else if(state.markValue.quantity) midBullet.tooltipHTML = this.buildToolObligorChartToolTipQuantity();
    midBullet.hiddenState.transitionDuration = 0;
    midBullet.defaultState.transitionDuration = 0;
    dumbBellseries.events.on("hidden", function () {
      dumbBellseries.hide();
    });

    return dumbBellseries;
  }

  private generateObligorChartTrendCurve(state: TradeObligorGraphPanelState, category: ObligorChartCategoryBlock, amChartsData: any[]): am4charts.LineSeries {

    let curveSeries = state.obligorChart.series.push(new am4charts.LineSeries());
    curveSeries.data = amChartsData;
    curveSeries.dataFields.valueX = "workoutTerm";
    curveSeries.dataFields.valueY = "mid";
    curveSeries.strokeWidth = 2;
    curveSeries.name = "Polynomial Regression";
    curveSeries.tensionX = 0.8;
    curveSeries.tensionY = 0.8;
    curveSeries.stroke = am4core.color(category.data.color);
    curveSeries.hiddenInLegend = true;
    curveSeries.name = "CurveSeries";
    curveSeries.hiddenState.transitionDuration = 0;
    curveSeries.defaultState.transitionDuration = 0;

    var reg2 = curveSeries.plugins.push(new am4plugins_regression.Regression());
    reg2.method = "polynomial";
    reg2.reorder = true;

    return curveSeries;
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
  public clearGraphSeries(chart: am4charts.XYChart) {
    chart.series.clear();

    return chart;
  }
}