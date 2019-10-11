/*
Blocks are the "building blocks" for DTO models.

The main difference between blocks and components is blocks does not carry any context, any meanings, and it rarely has any interactions/states, even if it does, the interactions and states are not meant to function on its own.

Because of this, while component models need to follow "BasicDTOStructure", blocks don't.
*/

import * as am4charts from "@amcharts/amcharts4/charts";

export interface SecurityGroupStatBlock {
  label: string;
  value: number;
  max: number;
  percentage: number;
}

export interface SecurityGroupPieChartBlock {
  name: string;
  colorScheme: SecurityGroupPieChartColorSchemeBlock;
  chart: am4charts.PieChart
}

export interface SecurityGroupPieChartDataBlock {
  label: string;
  value: number;
  color: any;
}

export interface SecurityGroupPieChartColorSchemeBlock {
  type: string;
  scheme: Array<any>
}

export interface SecurityGroupDefinitionFilterBlock {
  isSelected: boolean;
  isFilteredOut: boolean;
  displayLabel: string;
  shortKey: string;
  key: string;
}

export interface SecurityGroupAverageVisualizerMetric {
  data
}