import { Injectable } from '@angular/core';
import { UtilityService } from './UtilityService';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";

// Apply the themes
//am4core.useTheme(am4themes_animated);
//am4core.useTheme(am4themes_material);

@Injectable()
export class GraphService {
  constructor(
    private utility: UtilityService
  ){}

  public generateSecurityGroupPieChart(
    canvasId: string,
    data: any,
    spacingColor: string
  ) : am4charts.PieChart {
    const chart = am4core.create(canvasId, am4charts.PieChart);
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields = {
      "value": "litres",
      "category": "country"
    };
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;
    pieSeries.tooltip.disabled = true;
    pieSeries.slices.template.stroke = am4core.color(spacingColor);
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.strokeWidth = 4;
    pieSeries.alignLabels = false;
    pieSeries.labels.template.text = "12%";
    pieSeries.labels.template.fontFamily = "SantaOpenSans";
    pieSeries.labels.template.fontSize = '8px';
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");
    //pieSeries.slices.template.states.getKey("hover").properties.innerRadius = 0.2;
    pieSeries.slices.template.states.getKey("hover").properties.scale = 1;
    pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
    //pieSeries.innerRadius = am4core.percent(60);
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
    chart: am4charts.PieChart,
    isSelected: boolean,
    defaultSpacingColor: string,
    activeSpacingColor: string
  ){
    const pieSeries = chart.series.getIndex(0);
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
}