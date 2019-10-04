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
    leftPie: SecurityGroupPieChartDTO;
    rightPie: SecurityGroupPieChartDTO
  }
}

export interface SecurityGroupPieChartDTO {
  name: string;
  colorScheme: SecurityGroupPieChartColorSchemeDTO;
  chart: am4charts.PieChart
}

export interface SecurityGroupPieChartDataDTO {
  label: string;
  value: number;
  color: any;
}

export interface SecurityGroupPieChartColorSchemeDTO {
  type: string;
  scheme: Array<any>
}

export interface SecurityGroupDefinitionDTO {
  data: {
    name: string;
  }
  style: {
    icon: string;
    isStacked: boolean;
    stackedIcon: string;
  }
  state: {
    isSelected: boolean,
    isStatic: boolean
  }
}

interface SecurityGroupStatDTO {
  label: string;
  value: number;
  max: number;
  percentage: number;
}