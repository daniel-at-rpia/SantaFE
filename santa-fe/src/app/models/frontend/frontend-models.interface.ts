import * as am4charts from "@amcharts/amcharts4/charts";

export interface SecurityDTO {
  data: {
    name: string;
    ratingLevel: number;
    ratingValue: string;
    seniorityLevel: number;
  }
  state: {
    isStencil: boolean;
    isTable: boolean;
    isSelected: boolean;
  }
}

export interface SecurityGroupDTO {
  data: {
    name: string;
    ratingLevel: number;
    ratingValue: string;
    numOfSecurities: number;
    stats: Array<SecurityGroupStatDTO>
  }
  state: {
    isStencil: boolean;
    isSelected: boolean;
  }
  graph: {
    chartNameLeft: string;
    chartNameRight: string;
    pieChartLeft: am4charts.PieChart;
    pieChartRight: am4charts.PieChart;
  }
}

interface SecurityGroupStatDTO {
  label: string;
  value: number;
  max: number;
  percentage: number;
}