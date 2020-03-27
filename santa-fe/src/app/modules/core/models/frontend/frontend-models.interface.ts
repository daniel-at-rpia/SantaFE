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
  AgGridRow,
  SecurityTableRowQuoteBlock
} from 'FEModels/frontend-blocks.interface';
import {
  AlertSubTypes
} from 'Core/constants/coreConstants.constant';
import { SantaTableNumericFloatingFilterParams, ClickedOpenSecurityInBloombergEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';
import * as agGrid from 'ag-grid-community';


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
    globalIdentifier: string;  // CUSIP
    name: string;
    ticker: string;
    obligorName: string;
    country: string;
    isGovt: boolean;
    ratingLevel: number;
    ratingValue: string;
    ratingBucket: string;
    seniorityLevel: number;
    currency: string;
    sector: string;
    industry: string;
    securityType: string;
    seniority: string;
    genericSeniority: string;
    maturityType: string;
    primaryPmName: string;
    backupPmName: string;
    researchName: string;
    owner: Array<string>;
    mark: SecurityMarkBlock;
    portfolios: Array<SecurityPortfolioBlock>;
    strategyFirm: string;
    strategyList: Array<string>;
    positionCurrent: number;
    positionCurrentInMM: string;
    positionFirm: number;
    positionFirmInMM: string;
    positionHF: number;
    positionHFInMM: string;
    positionNLF: number;
    positionNLFInMM: string;
    metricPack: SecurityGroupMetricPackBlock;
    bestQuote: {
      bid: number;
      displayBid: string;
      ask: number;
      displayAsk: string;
    }
    cs01LocalFirm: number;
    cs01LocalFirmInK: string;
    cs01LocalCurrent: number;
    cs01LocalCurrentInK: string;
    cs01CadFirm: number;
    cs01CadFirmInK: string;
    cs01CadCurrent: number;
    cs01CadCurrentInK: string;
    hasIndex: boolean;
    hedgeFactor: number;
  }
  api: {
    onClickCard: (card: SecurityDTO) => void;
    onClickSendToGraph: (card: SecurityDTO) => void;
    onClickThumbDown: (card: SecurityDTO) => void;
    onClickOpenSecurityInBloomberg: (params: ClickedOpenSecurityInBloombergEmitterParams) => void;
    onClickSendToAlertConfig: (card: SecurityDTO) => void;
  }
  state: {
    isStencil: boolean;
    isInteractionDisabled: boolean;
    isInteractionThumbDownDisabled: boolean;
    isSelected: boolean;
    isMultiLineVariant: boolean;
    isWidthFlexible: boolean;
    isAtListCeiling: boolean;
    isActionMenuPrimaryActionsDisabled: boolean;
    isActionMenuMinorActionsDisabled: boolean;
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
    displayName: string;
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
    isMiniPillVariant: boolean;
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
    noMainCTA: boolean;
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
    configuration: Array<SecurityDefinitionDTO>;
  },
  style: {
    slotList: Array<SecurityDefinitionDTO>
  },
  state: {
    isSelected: boolean;
    isUserInputBlocked: boolean;
    isMajorShortcut: boolean;
    isHeroShortcut: boolean;
  }
}

export interface QuantComparerDTO extends BasicDTOStructure {
  data: {
    driverType: string;
    delta: number;
    mid: number;
    bid: {
      number: number;
      displayNumber: string;
      broker: string;
      size: number;
    },
    offer: {
      number: number;
      displayNumber: string;
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
    bidIsStale: boolean;
    askIsStale: boolean;
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
    agGridAggregationMap: object;
  },
  state: {
    loadedContentStage: number;
    isAddingColumn: boolean;
    selectedHeader: SecurityTableHeaderDTO;
    sortedByHeader: SecurityTableHeaderDTO;
    isLiveVariant: boolean;
    isNativeEnabled: boolean;
    isAgGridReady: boolean;
    selectedSecurityCard: SecurityDTO;
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
    isAttrChangable: boolean;
    readyStage: number;
    metricPackDeltaScope: string;
    frontendMetric: boolean;
    isDataTypeText: boolean;
    isDriverDependent: boolean;
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
    quotes: SecurityTableRowQuoteBlock;
    quoteHeaders: Array<QuoteMetricBlock>;
    bestQuotes: {
      combined: {
        bestSpreadQuote: QuantComparerDTO;
        bestYieldQuote: QuantComparerDTO;
        bestPriceQuote: QuantComparerDTO;
      }
      axe: {
        bestSpreadQuote: QuantComparerDTO;
        bestYieldQuote: QuantComparerDTO;
        bestPriceQuote: QuantComparerDTO;
      }
    }
  },
  state: {
    expandViewSortByQuoteMetric: string;
    isExpanded: boolean;
    presentingAllQuotes: boolean;
    isCDSVariant: boolean;
    isCDSOffTheRun: boolean;
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
    uuid: string;
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
      time: string;
    };
    ask: {
      isAxe: boolean;
      size: string;
      price: number;
      tspread: number;
      yield: number;
      benchmark: string;
      time: string;
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
    menuActiveSide: string;
    menuActiveDriver: string;
    isBidDownVoted: boolean;
    isAskDownVoted: boolean;
    isCDSVariant: boolean;
  }
}

export interface NumericFilterDTO extends BasicDTOStructure {
  data: {
    minNumber: number|string;
    maxNumber: number|string;
  },
  api: {
    params: agGrid.IFilterParams;
    valueGetter: (rowNode: agGrid.RowNode) => any;
    floatingParams: SantaTableNumericFloatingFilterParams;
  }
  state: {
    isFilled: boolean;
  }
}

export interface MoveVisualizerDTO extends BasicDTOStructure {
  data: {
    identifier: string;
    start: number;
    end: number;
    min: number;
    max: number;
    isBasis: boolean;
    timeSeries: Array<any>;
  }
  style: {
    leftGap: number;
    leftEdge: number;
    moveDistance: number;
    rightEdge: number;
    rightGap: number;
    endPinLocation: number;
  }
  state: {
    isInversed: boolean;
    isInvalid: boolean;
    isPlaceholder: boolean;
    isStencil: boolean;
    isColorCodeInversed: boolean;
  }
}

export interface HistoricalSummaryDTO extends BasicDTOStructure {
  data: {
    list: Array<MoveVisualizerDTO>;
    globalMin: number;
    globalMax: number;
    globalDistance: number;
    centerPoint: number;
    rulerValue: number;
  };
  style: {
    rulerPosition: number;
  }
  state: {
    isStencil: boolean;
  }
}

export interface AlertDTO extends BasicDTOStructure {
  data: {
    id: string;
    subType: AlertSubTypes;
    security: SecurityDTO;
    titleTop: string;
    titleBottom: string;
    message: string;
    time: string;
  }
  state: {
    isRead: boolean;
    isNew: boolean;
    isSlidedOut: boolean;
    isCountdownFinished: boolean;
    willBeRemoved: boolean;
  }
}