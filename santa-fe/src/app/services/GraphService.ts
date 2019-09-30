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
    data: any
  ) {
    const chart = am4core.create(canvasId, am4charts.PieChart);
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields = {
      "value": "litres",
      "category": "country"
    };
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;
    pieSeries.tooltip.disabled = true;
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.strokeWidth = 3;
    pieSeries.slices.template.states.getKey("hover").properties.scale = 1;
    pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
    chart.innerRadius = am4core.percent(60);
    chart.data = data;
  }
}