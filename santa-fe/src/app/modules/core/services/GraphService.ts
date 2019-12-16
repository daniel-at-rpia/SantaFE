import { Injectable } from '@angular/core';
import { UtilityService } from './UtilityService';
import {
  SecurityGroupPieChartBlock,
  SecurityGroupPieChartDataBlock
} from 'FEModels/frontend-blocks.interface';

import {
  ObligorChartBlock
} from 'FEModels/frontend-adhoc-packages.interface';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import * as am4plugins_regression from "@amcharts/amcharts4/plugins/regression";

// Apply the themes
//am4core.useTheme(am4themes_animated);
//am4core.useTheme(am4themes_material);

@Injectable()
export class GraphService {
  constructor(
    private utility: UtilityService
  ){}

  public generateSecurityGroupPieChart(
    pieChartDTO: SecurityGroupPieChartBlock,
  ) : am4charts.PieChart {
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
  ){
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
    const dataList:Array<SecurityGroupPieChartDataBlock> = [];
    //if (pieChartDTO.colorScheme.type === 'Rating') {
      for (const attrName in pieChartDTO.rawSupportingData) {
        const colorMappingIndex = this.findColorMapping(pieChartDTO.colorScheme.type, attrName);
        const newEntry:SecurityGroupPieChartDataBlock = {
          label: pieChartDTO.colorScheme.type === 'Seniority' ? this.utility.convertSenioritiesToAcronyms(attrName) :attrName,
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


  generateObligorChartDumbells(obligorChartDTO: ObligorChartBlock, yAxisValue: string): am4charts.ColumnSeries
  {

    // Create the column representing the mark discrepency.
    let dumbBellseries = obligorChartDTO.chart.series.push(new am4charts.ColumnSeries());
    dumbBellseries.data = obligorChartDTO.rawData;
    dumbBellseries.dataFields.categoryX = "category";

    if(yAxisValue === "spread")
    {
      dumbBellseries.dataFields.openValueY = "spreadMid";
      dumbBellseries.dataFields.valueY = "spreadMark";
    }
    else if(yAxisValue === "yield")
    {
      dumbBellseries.dataFields.openValueY = "yieldMid";
      dumbBellseries.dataFields.valueY = "yieldMark";
    }

    dumbBellseries.sequencedInterpolation = true;
    dumbBellseries.strokeOpacity = 1;
    dumbBellseries.columns.template.width = 3;
    dumbBellseries.tooltip.pointerOrientation = "horizontal";
    dumbBellseries.dataFields.value = "securityCount";
    dumbBellseries.name = obligorChartDTO.name;
    dumbBellseries.fill = am4core.color(obligorChartDTO.colorScheme);
    dumbBellseries.stroke = am4core.color(obligorChartDTO.colorScheme);
    dumbBellseries.legendSettings.labelText = "[bold {color}]{name}[/]";

    // Modify the column color based on mark discrepency.
    let columnTemplate = dumbBellseries.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color(obligorChartDTO.colorScheme);
    columnTemplate.adapter.add("fill", function (fill, target) {
      let index: number = target.dataItem.index;
      if (dumbBellseries.data[index].spreadMid > dumbBellseries.data[index].spreadMark) {
        return am4core.color("#cc3300"); // red
      }
      else
      {
        return am4core.color("#5cd65c"); // green
      }
    })
    
    columnTemplate.adapter.add("stroke", function (stroke, target) {
      let index: number = target.dataItem.index;
      if (dumbBellseries.data[index].spreadMid > dumbBellseries.data[index].spreadMark) {
        return am4core.color("#cc3300"); // red
      }
      else
      {
        return am4core.color("#5cd65c"); // green
      }
    })

    // Add a circle bullet to represent the mid.
    let midBullet = dumbBellseries.bullets.push(new am4charts.CircleBullet());
    midBullet.fill = am4core.color(obligorChartDTO.colorScheme);
    midBullet.locationY = 1;
    midBullet.tooltipHTML = `<b>{security}</b>`;

    //Add a circle bullet to represent the mark.
    var markBullet = dumbBellseries.bullets.push(new am4charts.CircleBullet());
    markBullet.circle.fill = am4core.color(obligorChartDTO.colorScheme);
    markBullet.circle.fillOpacity = 0.5;
    markBullet.circle.stroke = am4core.color(obligorChartDTO.colorScheme);
    markBullet.circle.strokeOpacity = 0.5;
    markBullet.strokeOpacity = 5;
    markBullet.fillOpacity = 10;
    markBullet.nonScalingStroke = true;
    markBullet.tooltipHTML = `<b>{security}</b>`;
    dumbBellseries.heatRules.push({
      target: markBullet.circle,
      min: 5,
      max: 20,
      property: "radius",
    });

    dumbBellseries.events.on("hidden", function () {
      dumbBellseries.hide();
    });

    return dumbBellseries;
  }

  generateObligorChartTrendCurve(obligorChartDTO: ObligorChartBlock): am4charts.LineSeries
  {
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

    var reg2 = curveSeries.plugins.push(new am4plugins_regression.Regression());
    reg2.method = "polynomial";

    return curveSeries;
  }

  initializeObligorChartXAxis(data: any[], chart: am4charts.XYChart) {
    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.renderer.grid.template.location = 0;
    xAxis.dataFields.category = "category";
    xAxis.renderer.minGridDistance = 0.1;
    xAxis.renderer.grid.template.location = 0.5;
    xAxis.renderer.grid.template.strokeDasharray = "1,3";
    xAxis.renderer.labels.template.rotation = -90;
    xAxis.renderer.labels.template.horizontalCenter = "left";
    xAxis.renderer.labels.template.location = 0.5;
    xAxis.renderer.inside = true;
    xAxis.data = data;

    xAxis.renderer.labels.template.adapter.add("dx", function (dx, target) {
    return -target.maxRight / 2;
    })
  }

initializeObligorChartYAxis(data: any[], chart: am4charts.XYChart)
{
  let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
  yAxis.tooltip.disabled = true;
  yAxis.renderer.ticks.template.disabled = true;
  yAxis.renderer.axisFills.template.disabled = true;
  yAxis.data = data;
}
}