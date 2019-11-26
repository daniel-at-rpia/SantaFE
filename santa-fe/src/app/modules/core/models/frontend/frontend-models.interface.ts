import {
  SecurityGroupMetricBlock,
  SecurityGroupMetricPackBlock,
  SecurityGroupPieChartBlock,
  SecurityGroupDefinitionFilterBlock,
  QuoteMetricBlock
} from 'FEModels/frontend-blocks.interface';

interface BasicDTOStructure {
  [property: string]: object; 
  data: object;
  state: object;
  style?: object;
}

export interface SecurityDTO extends BasicDTOStructure {
  data: {
    securityID: number;
    name: string;
    country: string;
    ratingLevel: number;
    ratingValue: string;
    seniorityLevel: number;
    currency: string;
    sector: string;
    couponType: string;
    industry: string;
    securityType: string;
    seniority: string;
    portfolios: Array<string>;
    position: number;
    positionInMM: string;
    positionHF: number;
    positionHFInMM: string;
    positionNLF: number;
    positionNLFInMM: string;
    metricPack: SecurityGroupMetricPackBlock;
  }
  state: {
    isStencil: boolean;
    isTable: boolean;
    isSelected: boolean;
    isTableExpanded: boolean;
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
    metricType: string;
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
    axeSkew: number;
    runSkew: number;
  }
  state: {
    hasBid: boolean;
    hasOffer: boolean;
    isStencil: boolean;
    isCalculated: boolean;
    isCrossed: boolean;
    isCrossedTier2: boolean;
    axeSkewEnabled: boolean;
    runSkewEnabled: boolean;
    noAxeSkew: boolean;
    noRunSkew: boolean;
  }
}

export interface SecurityTableDTO extends BasicDTOStructure {
  data: {
    headers: Array<SecurityTableHeaderDTO>;
    rows: Array<SecurityTableRowDTO>;
  },
  state: {
    loadedContentStage: number;
    isAddingColumn: boolean;
    selectedHeader: SecurityTableHeaderDTO;
    sortedByHeader: SecurityTableHeaderDTO;
  }
}

export interface SecurityTableHeaderDTO extends BasicDTOStructure {
  data: {
    displayLabel: string;
    attrName: string;
    underlineAttrName: string;
    readyStage: number;
    isPartOfMetricPack: boolean;
    metricPackDeltaScope: string;
    frontendMetric: boolean;
    inversedSortingForText: boolean;
  },
  state: {
    isPureTextVariant: boolean;
    isQuantVariant: boolean;
    isAxeSkewEnabled: boolean;
    isRunSkewEnabled: boolean;
  }
}

export interface SecurityTableRowDTO extends BasicDTOStructure {
  data: {
    security: SecurityDTO;
    cells: Array<SecurityTableCellDTO>;
    quotes: Array<SecurityQuoteDTO>;
    quoteHeaders: Array<QuoteMetricBlock>;
  },
  state: {
    expandViewSortByQuoteMetric: string;
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
    quantComparerUnavail: boolean;
    isStencil: boolean;
  }
}

export interface SecurityQuoteDTO extends BasicDTOStructure {
  data: {
    broker: string;
    time: string;
    unixTimestamp: number;
    dataSource: string;
    consolidatedBenchmark: string;
    bid: {
      isAxe: boolean;
      size: string;
      price: number;
      tspread: number;
      yield: number;
      benchmark: string;
    };
    ask: {
      isAxe: boolean;
      size: string;
      price: number;
      tspread: number;
      yield: number;
      benchmark: string;
    }
  },
  state: {
    isStencil: boolean;
    hasBid: boolean;
    hasAsk: boolean;
    diffBenchmark: boolean;
  }
}