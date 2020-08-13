import {
  AgGridColumnDefinition,
  AgGridRow,
  QuoteMetricBlock,
  SecurityDefinitionFilterBlock,
  SecurityGroupMetricBlock,
  SecurityGroupMetricPackBlock,
  SecurityGroupPieChartBlock,
  SecurityMarkBlock,
  SecurityPortfolioBlock,
  SecurityTableRowQuoteBlock,
  SecurityCostPortfolioBlock, 
  PortfolioMetricTotal,
  PortfolioBreakDownValues,
  NestedPortfolioBreakdownValues,
  PortfolioBreakDownOverrides
} from 'FEModels/frontend-blocks.interface';
import {AlertSubTypes, AlertTypes} from 'Core/constants/coreConstants.constant';
import { SantaTableNumericFloatingFilterParams } from 'FEModels/frontend-adhoc-packages.interface';
import * as agGrid from 'ag-grid-community';
import * as moment from 'moment';
import * as am4Charts from '@amcharts/amcharts4/charts';
import {Alert} from "Core/components/alert/alert.component";
import { AxeAlertScope, AxeAlertType } from 'Core/constants/tradeConstants.constant';
import { PortfolioShortNames } from 'Core/constants/structureConstants.constants';

interface BasicDTOStructure {
  [property: string]: object;
  data: object;
  state: object;
  style?: object;
  api?: object;
  graph?: object;
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
    position: {
      positionCurrent: number;
      positionCurrentInMM: string;
      positionFirm: number;
      positionFirmInMM: string;
      positionHF: number;
      positionHFInMM: string;
      positionNLF: number;
      positionNLFInMM: string;
      positionDOF: number;
      positionDOFInMM: string;
      positionSOF: number;
      positionSOFInMM: string;
      positionSTIP: number;
      positionSTIPInMM: string;
      positionFIP: number;
      positionFIPInMM: string;
      positionCIP: number;
      positionCIPInMM: string;
      positionAGB: number;
      positionAGBInMM: string;
      positionBBB: number;
      positionBBBInMM: string;
    };
    cost: {
      current: SecurityCostPortfolioBlock;
      firm: SecurityCostPortfolioBlock;
      DOF: SecurityCostPortfolioBlock;
      SOF: SecurityCostPortfolioBlock;
      STIP: SecurityCostPortfolioBlock;
      FIP: SecurityCostPortfolioBlock;
      CIP: SecurityCostPortfolioBlock;
      AGB: SecurityCostPortfolioBlock;
      BBB: SecurityCostPortfolioBlock;
    }
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
    alert: {
      alertId: string;
      alertTime: string;
      alertTimeRaw: number;
      alertType: string;
      alertMessage: string;
      alertValue: string;
      alertTarget: string;
      alertSide: string;
      alertLevel: string;
      alertLevelRaw: number;
      alertQuantity: string;
      alertQuantityRaw: number;
      alertQuoteDealer: string;
      alertTradeTrader: string;
      alertStatus: string;
      shortcutConfig: {
        numericFilterDTO: NumericFilterDTO;
        driver: string;
        side: Array<string>;
        isUrgent: boolean;
        sendEmail: boolean;
      }
    }
    tradeHistory: Array<TradeDTO>;
  }
  api: {
    onClickCard: (card: SecurityDTO) => void;
    onClickSendToGraph: (card: SecurityDTO) => void;
    onClickSendToAlertConfig: (card: SecurityDTO) => void;
    onClickSearch: (card: SecurityDTO) => void;
    onClickPin: (card: SecurityDTO) => void;
  }
  state: {
    isStencil: boolean;
    isInteractionDisabled: boolean;
    isSelected: boolean;
    isMultiLineVariant: boolean;
    isWidthFlexible: boolean;
    isAtListCeiling: boolean;
    isActionMenuPrimaryActionsDisabled: boolean;
    isActionMenuMinorActionsDisabled: boolean;
    isSlimVariant: boolean;
    configAlertState: boolean;
    isTradeAlertTableVariant: boolean;
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
    agGridPinnedTopRowData: Array<AgGridRow>;
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
    isActivated: boolean;
    isGroupEnabled: boolean;
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
    pinned: boolean;
    groupBelongs: string;
    groupShow: boolean;
    activePortfolios: Array<string>;
  },
  state: {
    isSecurityCardVariant: boolean;
    isQuantVariant: boolean;
    isCustomComponent: boolean;
    isAxeSkewEnabled: boolean;
    istotalSkewEnabled: boolean;
    isNarrowColumnVariant: boolean;
  }
}

export interface SecurityTableRowDTO extends BasicDTOStructure {
  data: {
    rowId: string;
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
    alert: AlertDTO;
    historicalTradeVisualizer: HistoricalTradeVisualizerDTO;
  },
  style: {
    rowHeight: number;
  },
  state: {
    expandViewSortByQuoteMetric: string;
    isExpanded: boolean;
    presentingAllQuotes: boolean;
    isCDSVariant: boolean;
    isCDSOffTheRun: boolean;
    viewHistoryState: boolean;
    quotesLoaded: boolean;
    isAgGridFullSizeVariant: boolean;
  }
}

export interface SecurityTableCellDTO extends BasicDTOStructure {
  data: {
    textData: string;
    quantComparerDTO: QuantComparerDTO;
    alertSideDTO: SantaTableAlertSideCellDTO;
    alertStatusDTO: SantaTableAlertStatusCellDTO;
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
      rawTime: string;
    };
    ask: {
      isAxe: boolean;
      size: string;
      price: number;
      tspread: number;
      yield: number;
      benchmark: string;
      time: string;
      rawTime: string;
    }
  },
  state: {
    isStencil: boolean;
    hasBid: boolean;
    hasAsk: boolean;
    diffBenchmark: boolean;
    isBestBid: boolean;
    isBestOffer: boolean;
    isBestAxeBid: boolean;
    isBestAxeOffer: boolean;
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
    type: AlertTypes;
    subType: AlertSubTypes;
    security: SecurityDTO;
    titleTop: string;
    titleBottom: string;
    message: string;
    time: string;
    unixTimestamp: number;
    titlePin: string;
    validUntilTime: string;
    validUntilMoment: moment.Moment;
    level: number;
    quantity: number;
    isUrgent: boolean;
    trader: string;
    dealer: string;
    status: string;
    isMarketListTraded: boolean;
  },
  state: {
    isRead: boolean;
    isNew: boolean;
    isSlidedOut: boolean;
    isCountdownFinished: boolean;
    willBeRemoved: boolean;
    hasSecurity: boolean;
    hasTitlePin: boolean;
    isCancelled: boolean;
    isMarketListVariant: boolean;
    isExpired: boolean;
  };
}

export interface AlertCountSummaryDTO extends BasicDTOStructure {
  data: {
    count: number;
    alertType: AlertTypes;
  };
  state: {
    isAxe: boolean;
    isMark: boolean;
    isTrade: boolean;
  };
}

export interface SantaTableAlertSideCellDTO extends BasicDTOStructure {
  data: {
    side: string;
  },
  state: {
    isStencil: boolean;
    askSided: boolean;
    bidSided: boolean;
  }
}

export interface TradeDTO extends BasicDTOStructure {
  data: {
    tradeId: string;
    trader: string;
    counterPartyName: string;
    quantity: string;
    rawQuantity: number;
    postTradeSumQuantity: string;
    tradeDateTime: number;
    tradeDateTimeParsed: string;
    price: string;
    spread: string;
    wgtAvgSpread: string;
    wgtAvgPrice: string;
    vestedPortfolio: string;
    vestedStrategy: string;
  }
  state: {
    isCancelled: boolean;
  }
}

export interface HistoricalTradeVisualizerDTO extends BasicDTOStructure {
  data: {
    prinstineTradeList: Array<TradeDTO>;
    displayTradeList: Array<TradeDTO>;
    positionList: Array<SecurityPortfolioBlock>;
    timeSeriesId: string;
    positionPieId: string;
    volumeLeftPieId: string;
    volumeRightPieId: string;
  };
  state: {
    disabledPortfolio: Array<string>;
    selectedPortfolio: Array<string>;
    graphReceived: boolean;
  };
  graph: {
    timeSeries: am4Charts.XYChart;
    positionPie: am4Charts.PieChart;
    volumeLeftPie: am4Charts.PieChart;
    volumeRightPie: am4Charts.PieChart;
  }
}

export interface SantaTableAlertStatusCellDTO extends BasicDTOStructure {
  data: {
    statusText: string;
    countdownPercent: number;
    sortingValue: number;
  }
  state: {
    grayedOutState: boolean;
    highlightedState: boolean;
  }
}

export interface TradeAlertConfigurationAxeGroupBlockDTO extends BasicDTOStructure {
  data: {
    card: SecurityDTO;
    groupId: string;
    scopes: Array<AxeAlertScope>;
    axeAlertTypes: Array<AxeAlertType>;
    targetDriver: string;
    targetRange: NumericFilterDTO;
    sendEmail: boolean;
  },
  state: {
    isDeleted: boolean;
    isDisabled: boolean;
    isUrgent: boolean;
    isRangeActive: boolean;
  }
}

export interface PortfolioBreakdownDTO extends BasicDTOStructure {
  data: {
    category: string;
    values: Array<PortfolioBreakDownValues | NestedPortfolioBreakdownValues>;
    overrides?: Array<PortfolioBreakDownOverrides>
  },
  style: {
    icon: string
  },
  state: {
    isEditing: boolean;
    isStencil: boolean;
  }
}
export interface PortfolioStructureDTO extends BasicDTOStructure {
  data: {
    portfolioName: string,
    portfolioId: number;
    portfolioShortName: PortfolioShortNames;
    indexId: number;
    indexShortName: string;
    CS01Values: PortfolioMetricTotal;
    LeverageValues: PortfolioMetricTotal;
    children: Array<PortfolioBreakdownDTO>;
  },
  api: {
    onSubmitMetricValues: (CS01: number, leverage: number) => void;
  }
  state: {
    isEditing: boolean;
    isStencil: boolean;
  }
}