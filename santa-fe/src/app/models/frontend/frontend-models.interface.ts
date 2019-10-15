import {
  SecurityGroupMetricBlock,
  SecurityGroupPieChartBlock,
  SecurityGroupDefinitionFilterBlock
} from 'FEModels/frontend-blocks.interface';

interface BasicDTOStructure {
  [property: string]: object; 
  data: object;
  state: object;
  style?: object;
}

export interface SecurityDTO extends BasicDTOStructure {
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

export interface SecurityGroupDTO extends BasicDTOStructure {
  data: {
    name: string;
    ratingLevel: number;
    ratingValue: string;
    numOfSecurities: number;
    stats: Array<SecurityGroupMetricBlock>;
  }
  state: {
    isExpanded: boolean;
    isStencil: boolean;
    isSelected: boolean;
    stencilAnimationComplete: boolean;
  }
  graph: {
    leftPie: SecurityGroupPieChartBlock;
    rightPie: SecurityGroupPieChartBlock;
  }
}

export interface SecurityGroupDefinitionDTO extends BasicDTOStructure {
  data: {
    name: string;
    key: string;
    filterOptionList: Array<SecurityGroupDefinitionFilterBlock>;
  }
  style: {
    icon: string;
    secondaryIcon: string;
  }
  state: {
    isLocked: boolean;
    isUnactivated: boolean;
    filterActive: boolean;
  }
}

export interface SecurityGroupDefinitionConfiguratorDTO extends BasicDTOStructure {
  data: {
    definitionList: Array<SecurityGroupDefinitionDTO>;
    selectedDefinitionList: Array<SecurityGroupDefinitionDTO>;
    filterSearchInputValue: string;
  }
  state: {
    showLongFilterOptions: boolean;
    isLoading: boolean;
    showFiltersFromDefinition: SecurityGroupDefinitionDTO;
  }
}

export interface SecurityGroupAverageVisualizerDTO extends BasicDTOStructure {
  data: {
    stats: Array<SecurityGroupMetricBlock>;
  },
  state: {
    isEmpty: boolean;
    isStencil: boolean;
    isExpanded: boolean;
    selectingStat: SecurityGroupMetricBlock;
    editingStat: SecurityGroupMetricBlock;
    editingStatSelectedMetric: any;
    editingStatSelectedMetricValueType: string;
    editingStatSelectedMetricDeltaType: string; 
  }
}