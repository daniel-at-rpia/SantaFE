import {
  SecurityGroupMetricBlock,
  SecurityGroupMetricPackBlock,
  SecurityGroupPieChartBlock,
  SecurityDefinitionFilterBlock,
  QuoteMetricBlock,
  SecurityPortfolioBlock,
  SecurityMarkBlock,
  QuantitativeEntryBlock,
  QuantitativeEntryStyleBlock,
  AgGridColumnDefinition,
  AgGridRow
} from 'FEModels/frontend-blocks.interface';
import * as agGrid from 'ag-grid-community';

import * as am4charts from "@amcharts/amcharts4/charts";

interface BasicDTOStructure {
  [property: string]: object; 
  data: object;
  state: object;
  style?: object;
  api?: object;
}

export interface SecurityDTO extends BasicDTOStructure {
  data: {
    securityID: string;
    name: string;
    country: string;
    ratingLevel: number;
    ratingValue: string;
    ratingBucket: string;
    seniorityLevel: number;
    currency: string;
    sector: string;
    couponType: string;
    industry: string;
    securityType: string;
    seniority: string;
    maturityType: string;
    primaryPmName: string;
    backupPmName: string;
    researchName: string;
    owner: Array<string>;
    mark: SecurityMarkBlock;
    portfolios: Array<SecurityPortfolioBlock>;
    strategyCurrent: string;
    strategyFirm: string;
    positionCurrent: number;
    positionCurrentInMM: string;
    positionFirm: number;
    positionFirmInMM: string;
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

export interface SecurityDefinitionDTO extends BasicDTOStructure {
  data: {
    name: string;
    key: string;
    urlForGetLongOptionListFromServer: string;
    filterOptionList: Array<SecurityDefinitionFilterBlock>;
    securityDTOAttr: string;
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

export interface SecurityDefinitionBundleDTO extends BasicDTOStructure {
  data: {
    label: string;
    list: Array<SecurityDefinitionDTO>
  }
}

export interface SecurityDefinitionConfiguratorDTO extends BasicDTOStructure {
  data: {
    definitionList: Array<SecurityDefinitionBundleDTO>;
    filterSearchInputValue: string;
  }
  state: {
    groupByDisabled: boolean;
    canApplyFilter: boolean;
    showLongFilterOptions: boolean;
    isLoading: boolean;
    isLoadingLongOptionListFromServer: boolean;
    showFiltersFromDefinition: SecurityDefinitionDTO;
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
    configuration: Array<SecurityDefinitionDTO>
  },
  style: {
    slotList: Array<SecurityDefinitionDTO>
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
    mid: number;
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
    totalSkew: number;
  }
  state: {
    hasBid: boolean;
    hasOffer: boolean;
    isStencil: boolean;
    isCalculated: boolean;
    isCrossed: boolean;
    isCrossedTier2: boolean;
    axeSkewEnabled: boolean;
    totalSkewEnabled: boolean;
    noAxeSkew: boolean;
    noTotalSkew: boolean;
    longEdgeState: boolean;
  }
}

export interface SecurityTableDTO extends BasicDTOStructure {
  data: {
    headers: Array<SecurityTableHeaderDTO>;
    allHeaders: Array<SecurityTableHeaderDTO>;
    rows: Array<SecurityTableRowDTO>;
    agGridColumnDefs: Array<AgGridColumnDefinition>;
    agGridRowData: Array<AgGridRow>;
    agGridFrameworkComponents: object;
  },
  state: {
    loadedContentStage: number;
    isAddingColumn: boolean;
    selectedHeader: SecurityTableHeaderDTO;
    sortedByHeader: SecurityTableHeaderDTO;
    isLiveVariant: boolean;
    isNativeEnabled: boolean;
    isAgGridReady: boolean;
  },
  api: {
    gridApi: agGrid.GridApi,
    columnApi: agGrid.ColumnApi
  }
}

export interface SecurityTableHeaderDTO extends BasicDTOStructure {
  data: {
    key: string;
    displayLabel: string;
    attrName: string;
    underlineAttrName: string;
    blockAttrName: string;
    readyStage: number;
    metricPackDeltaScope: string;
    frontendMetric: boolean;
    inversedSortingForText: boolean;
    targetQuantLocationFromRow: string;
  },
  state: {
    isPureTextVariant: boolean;
    isQuantVariant: boolean;
    isAxeSkewEnabled: boolean;
    istotalSkewEnabled: boolean;
  }
}

export interface SecurityTableRowDTO extends BasicDTOStructure {
  data: {
    security: SecurityDTO;
    cells: Array<SecurityTableCellDTO>;
    quotes: Array<SecurityQuoteDTO>;
    quoteHeaders: Array<QuoteMetricBlock>;
    bestQuotes: {
      bestSpreadQuote: QuantComparerDTO;
      bestYieldQuote: QuantComparerDTO;
      bestPriceQuote: QuantComparerDTO;
    }
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
    currentMetric: string;
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
    isBestBid: boolean;
    isBestOffer: boolean;
    filteredBySpread: boolean;
    filteredByYield: boolean;
    filteredByPrice: boolean;
  }
}

export interface QuantitativeVisualizerDTO extends BasicDTOStructure {
  data: {
    rawEntry: QuantitativeEntryBlock;
    wow: QuantitativeEntryBlock;
    mom: QuantitativeEntryBlock;
    ytd: QuantitativeEntryBlock;
    min: number;
    max: number;
    minDelta: number;
    maxDelta: number;
  }
  style: {
    raw: QuantitativeEntryStyleBlock;
    wow: QuantitativeEntryStyleBlock;
    mom: QuantitativeEntryStyleBlock;
    ytd: QuantitativeEntryStyleBlock;
  }
  state: {
    isWowValid: boolean;
    isMomValid: boolean;
    isYtdValid: boolean;
    isStencil: boolean;
  }

}

export interface ObligorChartBlock {
  name: string;
  chart: am4charts.XYChart;
  rawData: any[];
  colorScheme: string;
  displayMark: boolean;
  displayChart: boolean;
}