import {
  SecurityGroupMetricBlock,
  SecurityGroupMetricPackBlock,
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
    metricPack: SecurityGroupMetricPackBlock;
    primaryMetric: string;
    sort: {
      primarySortMetricValue: number;
      secondarySortMetricValue: number;
      tertiarySortMetricValue: number;
    },
    definitionConfig: object
  }
  state: {
    isExpanded: boolean;
    isStencil: boolean;
    isSelected: boolean;
    isMetricCompleted: boolean;
    isLandscapeView: boolean;
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
    urlForGetLongOptionListFromServer: string;
    filterOptionList: Array<SecurityGroupDefinitionFilterBlock>;
  }
  style: {
    icon: string;
    secondaryIcon: string;
  }
  state: {
    isLocked: boolean;
    isUnactivated: boolean;
    groupByActive: boolean;
    filterActive: boolean;
  }
}

export interface SecurityGroupDefinitionBundleDTO extends BasicDTOStructure {
  data: {
    label: string;
    list: Array<SecurityGroupDefinitionDTO>
  }
}

export interface SecurityGroupDefinitionConfiguratorDTO extends BasicDTOStructure {
  data: {
    definitionList: Array<SecurityGroupDefinitionBundleDTO>;
    filterSearchInputValue: string;
  }
  state: {
    showLongFilterOptions: boolean;
    isLoading: boolean;
    isLoadingLongOptionListFromServer: boolean;
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
    editingStat: SecurityGroupMetricBlock;
    editingStatSelectedMetric: any;
    editingStatSelectedMetricValueType: string;
    editingStatSelectedMetricDeltaType: string;
  }
}

export interface SearchShortcutDTO extends BasicDTOStructure {
  data: {
    displayTitle: string;
    configuration: Array<SecurityGroupDefinitionDTO>
  },
  style: {
    slotList: Array<SecurityGroupDefinitionDTO>
  },
  state: {
    isSelected: boolean;
    isUserInputBlocked: boolean;
  }
}

export interface QuantComparerDTO extends BasicDTOStructure {
  data: {
    isSpread: boolean;
    delta: number;
    bid: {
      number: number;
      broker: string;
      size: number;
    },
    offer: {
      number: number;
      broker: string;
      size: number;
    }
  },
  style: {
    lineWidth: number;
    bidLineHeight: number;
    offerLineHeight: number;
  }
  state: {
    isStencil: boolean;
    isCalculated: boolean;
    isCrossed: boolean;
    isCrossedTier2: boolean;
  }
}

export interface SecurityTableDTO extends BasicDTOStructure {
  data: {
    headers: Array<SecurityTableHeaderDTO>;
    rows: Array<SecurityTableRowDTO>
  },
  state: {
    isStencil: boolean;
  }
}

export interface SecurityTableHeaderDTO extends BasicDTOStructure {
  data: {
    displayLabel: string;
  },
  state: {
    isQuantVariant: boolean;
  }
}

export interface SecurityTableRowDTO extends BasicDTOStructure {
  data: {
    security: SecurityDTO;
    cells: Array<SecurityTableCellDTO>;
  },
  state: {
    isExpanded: boolean;
  }
}

export interface SecurityTableCellDTO extends BasicDTOStructure {
  data: {
    textData: string;
    quantComparerDTO: QuantComparerDTO;
  },
  state: {
    isQuantVariant: boolean;
    isStencil: boolean;
  }
}