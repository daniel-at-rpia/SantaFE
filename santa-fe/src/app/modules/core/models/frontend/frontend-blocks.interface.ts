/*
Blocks are the "building blocks" for DTO models.

The main difference between blocks and components is blocks does not carry any context, any meanings, and it rarely has any interactions/states, even if it does, the interactions and states are not meant to function on its own.

Because of this, while component models need to follow "BasicDTOStructure", blocks don't.
*/

import * as am4charts from "@amcharts/amcharts4/charts";

export interface SecurityGroupMetricBlock {
  isEmpty: boolean;
  sortHierarchy: number;
  deltaScope: string;
  label: string;
  value: number;
  absMax: number;
  percentage: number;
}

export interface SecurityGroupMetricPackBlock {
  raw: object;
  delta: {
    DoD: object;
    WoW: object;
    MoM: object;
    Ytd: object;
  }
}

export interface SecurityGroupPieChartBlock {
  name: string;
  colorScheme: SecurityGroupPieChartColorSchemeBlock;
  chart: am4charts.PieChart;
  rawSupportingData: object;
}

export interface SecurityGroupPieChartDataBlock {
  label: string;
  value: number;
  index: number;
  color: any;
}

export interface SecurityGroupPieChartColorSchemeBlock {
  type: string;
  scheme: Array<any>
}

export interface SecurityGroupDefinitionFilterBlock {
  isSelected: boolean;  // means it is selected for filtering
  isFilteredOut: boolean;  // means it is hidden/disabled in the UI, sry about this naming failure, it's just not worth it to mass-rename it in the code
  displayLabel: string;
  shortKey: string;
  key: string;
}