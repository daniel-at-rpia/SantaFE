import { Injectable } from '@angular/core';
import { UtilityService } from './UtilityService';
import {
  SecurityGroupPieChartBlock,
  SecurityGroupPieChartDataBlock
} from 'FEModels/frontend-blocks.interface';

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
    pieSeries.labels.template.text = "{value.percent.formatNumber('#.')}%";
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
    const data = this.generateGroupPieChartTestData(pieChartDTO);
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

  public generateGroupPieChartTestData(
    pieChartDTO: SecurityGroupPieChartBlock
  ): Array<SecurityGroupPieChartDataBlock> {
    const colorScheme = pieChartDTO.colorScheme.scheme;
    if (pieChartDTO.colorScheme.type === 'Rating') {
      const newEntry1:SecurityGroupPieChartDataBlock = {
        label: 'AAA',
        value: Math.floor(Math.random()*100),
        color: am4core.color(colorScheme[1].value)
      };
      const newEntry2:SecurityGroupPieChartDataBlock = {
        label: 'AA',
        value: Math.floor(Math.random()*100),
        color: am4core.color(colorScheme[2].value)
      };
      const newEntry3:SecurityGroupPieChartDataBlock = {
        label: 'A',
        value: Math.floor(Math.random()*100),
        color: am4core.color(colorScheme[4].value)
      };
      return [newEntry1, newEntry2, newEntry3];
    } else if (pieChartDTO.colorScheme.type === 'Seniority') {
      const newEntry1:SecurityGroupPieChartDataBlock = {
        label: colorScheme[1].label,
        value: Math.floor(Math.random()*100),
        color: am4core.color(colorScheme[1].value)
      };
      const newEntry2:SecurityGroupPieChartDataBlock = {
        label: colorScheme[2].label,
        value: Math.floor(Math.random()*100),
        color: am4core.color(colorScheme[2].value)
      };
      const newEntry3:SecurityGroupPieChartDataBlock = {
        label: colorScheme[3].label,
        value: Math.floor(Math.random()*100),
        color: am4core.color(colorScheme[3].value)
      };
      const newEntry4:SecurityGroupPieChartDataBlock = {
        label: colorScheme[4].label,
        value: Math.floor(Math.random()*100),
        color: am4core.color(colorScheme[4].value)
      };
      const newEntry5:SecurityGroupPieChartDataBlock = {
        label: colorScheme[5].label,
        value: Math.floor(Math.random()*100),
        color: am4core.color(colorScheme[5].value)
      };
      return [newEntry1, newEntry2, newEntry3, newEntry4, newEntry5];
    }
  }
}