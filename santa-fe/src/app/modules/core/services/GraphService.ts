import { Injectable } from '@angular/core';
import { UtilityService } from './UtilityService';
import {
  SecurityGroupPieChartBlock,
  SecurityGroupPieChartDataBlock
} from 'FEModels/frontend-blocks.interface';

import {
  ObligorChartBlock
} from 'FEModels/frontend-models.interface';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import * as am4plugins_regression from "@amcharts/amcharts4/plugins/regression";


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

  public buildObligorGraph(chart: am4charts.XYChart, data: any, colorScheme: string, name: string, yAxisValue: string, displayChart: boolean, displayMark: boolean) {

    // Generate Sr Bond chart.
    let chartBlock: ObligorChartBlock = {
      name: name,
      chart: chart,
      rawData: data,
      colorScheme: colorScheme,
      displayChart: displayChart,
      displayMark: displayMark
    }

    let dumbBellSeries: am4charts.ColumnSeries;
    // Create a dumbbell series. https://www.amcharts.com/demos/dumbbell-plot/
    dumbBellSeries = this.generateObligorChartDumbells(chartBlock, "spread");

    // Create a curve line series.
    //let curveSeries: am4charts.LineSeries = this.generateObligorChartTrendCurve(chartBlock);

    // Show the dumbbell series and the curve series when legend item is clicked.
    dumbBellSeries.events.on("shown", function () {
      dumbBellSeries.show();
      //curveSeries.show();
    });

    //Hide the dumbbell series and the curve series when legend item is clicked.
    dumbBellSeries.events.on("hidden", function () {
      dumbBellSeries.hide();
      //curveSeries.hide();
    });

  }

  private generateObligorChartDumbells(obligorChartDTO: ObligorChartBlock, yAxisValue: string): am4charts.ColumnSeries {

    // Create the column representing the mark discrepency.
    let dumbBellseries = obligorChartDTO.chart.series.push(new am4charts.ColumnSeries());
    dumbBellseries.data = obligorChartDTO.rawData;
    dumbBellseries.dataFields.valueX = "category";
    dumbBellseries.dataFields.openValueY = "spreadMid";
    dumbBellseries.dataFields.valueY = "spreadMark";
    dumbBellseries.fill = am4core.color(obligorChartDTO.colorScheme);
    dumbBellseries.stroke = am4core.color(obligorChartDTO.colorScheme);
    dumbBellseries.name = obligorChartDTO.name;
    dumbBellseries.strokeOpacity = 1;
    dumbBellseries.showOnInit = false;
    dumbBellseries.className  = obligorChartDTO.name;
    dumbBellseries.interpolationDuration = 5000;
    
    if (obligorChartDTO.displayChart === false) {
      dumbBellseries.hidden = true;
    }

    if (obligorChartDTO.displayMark) {
      dumbBellseries.sequencedInterpolation = true;
      dumbBellseries.columns.template.width = 3;
      dumbBellseries.tooltip.pointerOrientation = "horizontal";
      dumbBellseries.dataFields.value = "positionCurrent";

      // Modify the column color based on mark discrepency.
      let columnTemplate = dumbBellseries.columns.template;
      columnTemplate.strokeWidth = 1;
      columnTemplate.strokeOpacity = 1;
      columnTemplate.stroke = am4core.color(obligorChartDTO.colorScheme);

      //Add a circle bullet to represent the mark.
      var markDot = dumbBellseries.bullets.push(new am4charts.CircleBullet());
      markDot.circle.radius = 3;

      //Add a circle bullet to represent the mark.
      var markBullet = dumbBellseries.bullets.push(new am4charts.CircleBullet());
      markBullet.circle.fillOpacity = 0.5;
      markBullet.circle.strokeOpacity = 1;
      markBullet.strokeOpacity = 5;
      markBullet.fillOpacity = 10;
      markBullet.nonScalingStroke = true;
      markBullet.tooltipHTML = `<center><b>{security}</b> </br>
                                Mark: {valueY.value} </br>
                                Value: {positionCurrent} </center`;
      dumbBellseries.heatRules.push({
        target: markBullet.circle,
        min: 5,
        max: 20,
        property: "radius",
      });
    }

    // Add a circle bullet to represent the mid.
    let midBullet = dumbBellseries.bullets.push(new am4charts.CircleBullet());
    midBullet.fill = am4core.color(obligorChartDTO.colorScheme);
    midBullet.locationY = 1;
    midBullet.tooltipHTML = `<center><b>{security}</b> </br>
                              Mid: {openValueY.value}</center`;

    dumbBellseries.events.on("hidden", function () {
      dumbBellseries.hide();
    });

    return dumbBellseries;
  }

  private generateObligorChartTrendCurve(obligorChartDTO: ObligorChartBlock): am4charts.LineSeries {
    let curveData = [];
    for (var i = 0; i < obligorChartDTO.rawData.length; i++) {
      curveData.push({ x: obligorChartDTO.rawData[i].category, y: obligorChartDTO.rawData[i].spreadMark });
    }

    let curveSeries = obligorChartDTO.chart.series.push(new am4charts.LineSeries());
    curveSeries.dataFields.categoryX = "x";
    curveSeries.dataFields.valueY = "y";
    curveSeries.strokeWidth = 2
    curveSeries.stroke = am4core.color(obligorChartDTO.colorScheme);
    curveSeries.strokeOpacity = 0.7;
    curveSeries.hiddenInLegend = true;
    curveSeries.data = curveData;
    curveSeries.tensionY = 1;
    curveSeries.tensionX = 1;
    curveSeries.name = "CurveSeries";

    var reg2 = curveSeries.plugins.push(new am4plugins_regression.Regression());
    reg2.method = "polynomial";

    return curveSeries;
  }

  public initializeObligorChartAxes(xAxisData: any[], yAxesData: any[], chart: am4charts.XYChart) {
    this.initializeObligorChartXAxis(xAxisData, chart);
    this.initializeObligorChartYAxis(yAxesData, chart);
  }

  private initializeObligorChartXAxis(data: any[], chart: am4charts.XYChart) {
    let xAxis = chart.xAxes.push(new am4charts.ValueAxis());
    xAxis.renderer.grid.template.location = 0;
    xAxis.renderer.grid.template.location = 0.5;
    xAxis.renderer.grid.template.strokeDasharray = "1,3";
    xAxis.renderer.labels.template.horizontalCenter = "left";
    xAxis.renderer.labels.template.location = 0.5;
    xAxis.title.text = "Tenor";
    xAxis.min = 0;
    xAxis.data = data;

    xAxis.renderer.labels.template.adapter.add("dx", function (dx, target) {
      return -target.maxRight / 2;
    })
  }

  private initializeObligorChartYAxis(data: any[], chart: am4charts.XYChart) {
    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.tooltip.disabled = true;
    yAxis.renderer.axisFills.template.disabled = true;
    yAxis.title.text = "Spread";
    yAxis.min = 0;
    yAxis.data = data;
    yAxis.rangeChangeDuration = 500;
  }
}