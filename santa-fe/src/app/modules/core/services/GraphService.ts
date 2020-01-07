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

  public addCategoryToObligorGraph(category: ObligorChartCategoryBlock, state: TradeObligorGraphPanelState) {
    // Create data array that can be handled by amCharts from out category DataItems.
    let amChartsData: any[] = [];
    let mid: number;

    for (let dataItem in category.data.obligorCategoryDataItemDTO) {

      if (state.metric.spread) mid = category.data.obligorCategoryDataItemDTO[dataItem].data.spreadMid;
      else if (state.metric.yield) mid = category.data.obligorCategoryDataItemDTO[dataItem].data.yieldMid;

      if (mid !== 0) {
        // The dumbbell chart will not work if the mark is null. If it is, we will set it to the value of mid to be "hidden" behind it.
        if (category.data.obligorCategoryDataItemDTO[dataItem].data.mark === null && mid !== null) {
          category.data.obligorCategoryDataItemDTO[dataItem].data.mark = mid.toLocaleString();
        }

        // TODO: Create adhoc interface.
        amChartsData.push({
          name: category.data.obligorCategoryDataItemDTO[dataItem].data.name,
          mid: mid,
          mark: category.data.obligorCategoryDataItemDTO[dataItem].data.mark,
          workoutTerm: category.data.obligorCategoryDataItemDTO[dataItem].data.workoutTerm,
          positionCurrent: category.data.obligorCategoryDataItemDTO[dataItem].data.positionCurrent
        })
      }
    }

    this.generateObligorChartDumbells(state, category, amChartsData);
  }

  private generateObligorChartDumbells(state: TradeObligorGraphPanelState, category: ObligorChartCategoryBlock, amChartsData: any[]): am4charts.ColumnSeries {

    // Create the column representing the mark discrepency.
    let dumbBellseries = state.obligorChart.series.push(new am4charts.ColumnSeries());
    dumbBellseries.data = amChartsData;
    dumbBellseries.dataFields.valueX = "workoutTerm";
    dumbBellseries.dataFields.openValueY = "mid";
    dumbBellseries.maxY = 10;
    dumbBellseries.minY = 0;

    if (state.metric.spread || state.markValue.cS01 || state.markValue.quantity) {
      dumbBellseries.dataFields.valueY = "mark";
    }
    else if (state.metric.yield || (state.markValue.quantity === false && state.markValue.cS01 === false)) dumbBellseries.dataFields.valueY = "mid";

    dumbBellseries.fill = am4core.color(category.data.color);
    dumbBellseries.stroke = am4core.color(category.data.color);
    dumbBellseries.name = category.data.name;
    dumbBellseries.strokeOpacity = 1;
    dumbBellseries.hidden = category.state.isHidden;
    dumbBellseries.sequencedInterpolation = true;
    dumbBellseries.columns.template.width = 3;
    dumbBellseries.dataFields.value = "positionCurrent";

    // Modify the column color based on mark discrepency.
    let columnTemplate = dumbBellseries.columns.template;
    columnTemplate.strokeWidth = 1;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color(category.data.color);

    var markDot = dumbBellseries.bullets.push(new am4charts.CircleBullet());
    markDot.circle.radius = 3;

    if (category.state.isMarkHidden === false) {
      //Add a circle bullet to represent the mark.
      var markBullet = dumbBellseries.bullets.push(new am4charts.CircleBullet());
      markBullet.circle.fillOpacity = 0.3;
      markBullet.circle.strokeOpacity = 1;
      markBullet.strokeOpacity = 1;
      markBullet.nonScalingStroke = true;
      markBullet.tooltipHTML = `<center><b>{name}</b> </br>
                              Mark: {mark}</br>
                              Current Position: {positionCurrent}</center>`;
      dumbBellseries.heatRules.push({
        target: markBullet.circle,
        min: 5,
        max: 20,
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
    midBullet.tooltipHTML = `<center><b>{name}</b> </br>
                                Mid: {mid}</br>`;

    dumbBellseries.events.on("hidden", function () {
      dumbBellseries.hide();
    });

    return dumbBellseries;
  }

  private generateObligorChartTrendCurve(category: ObligorChartCategoryBlock): am4charts.LineSeries {

    //TODO: This whole thing.

    //let curveData = [];
    //for (var i = 0; i < obligorChartDTO.rawData.length; i++) {
    //  curveData.push({ x: i, y: obligorChartDTO.rawData[i].spreadMid });
    // }

    //let curveSeries = obligorChartDTO.chart.series.push(new am4charts.LineSeries());
    //curveSeries.dataFields.categoryX = "x";
    //curveSeries.dataFields.valueY = "y";
    //curveSeries.strokeWidth = 2
    //curveSeries.stroke = am4core.color(obligorChartDTO.colorScheme);
    // curveSeries.hiddenInLegend = true;
    //curveSeries.data = curveData;
    //curveSeries.name = "CurveSeries";


    //var reg2 = curveSeries.plugins.push(new am4plugins_regression.Regression());
    //reg2.method = "polynomial";

    return null;
  }

  public initializeObligorChartXAxis(state: TradeObligorGraphPanelState): am4charts.ValueAxis {

    let xAxis = state.obligorChart.xAxes.push(new am4charts.ValueAxis());
    xAxis.renderer.grid.template.strokeDasharray = "1,3";
    xAxis.title.text = "Tenor";
    xAxis.min = 0;
    xAxis.renderer.minGridDistance = 60;

    xAxis.extraMax = 0.05;
    
    return xAxis;
  }

  public initializeObligorChartYAxis(state: TradeObligorGraphPanelState): am4charts.ValueAxis {
    let yAxis = state.obligorChart.yAxes.push(new am4charts.ValueAxis());
    if(state.metric.spread) yAxis.title.text = "Spread";
    if(state.metric.yield) yAxis.title.text = "Yield";
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