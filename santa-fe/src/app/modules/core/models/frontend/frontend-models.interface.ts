import { SafeHtml } from '@angular/platform-browser';
import * as agGrid from 'ag-grid-community';
import * as moment from 'moment';
import * as am4Charts from '@amcharts/amcharts4/charts';
import { DetachedRouteHandle } from '@angular/router';

import * as Blocks from './frontend-blocks.interface';
import * as AdhocPacks from './frontend-adhoc-packages.interface';
import {
  AlertSubTypes,
  AlertTypes,
  NavigationModule,
  GlobalWorkflowTypes
} from 'Core/constants/coreConstants.constant';
import { Alert } from "Core/components/alert/alert.component";
import { AxeAlertScope, AxeAlertType } from 'Core/constants/tradeConstants.constant';
import {
  PortfolioShortNames,
  PortfolioMetricValues,
  DeltaScope
} from 'Core/constants/structureConstants.constants';
import { BEStructuringFundBlock } from 'Core/models/backend/backend-models.interface';
import { TraceTradeParty, AggridSortOptions } from 'Core/constants/securityTableConstants.constant';
import { StructureUtilityPanelState } from './frontend-page-states.interface';

interface BasicDTOStructure {
  id?: string;
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
    tenor: number;
    couponType: string;
    currency: string;
    sector: string;
    industry: string;
    subIndustry: string;
    securityType: string;
    securitySubType: string;
    seniority: string;
    genericSeniority: string;
    maturityType: string;
    primaryPmName: string;
    backupPmName: string;
    researchName: string;
    owner: Array<string>;
    mark: Blocks.SecurityMarkBlock;
    portfolios: Array<Blocks.SecurityPortfolioBlock>;
    strategyFirm: string;
    strategyList: Array<string>;
    weight: {
      currentGroupCS01Value: number;
      currentGroupBEVValue: number;
      fundCS01Pct: number;
      fundCS01PctDisplay: string;
      groupCS01Pct: number;
      groupCS01PctDisplay: string;
      fundBEVPct: number;
      fundBEVPctDisplay: string;
      groupBEVPct: number;
      groupBEVPctDisplay: string;
    }
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
      current: Blocks.SecurityCostPortfolioBlock;
      firm: Blocks.SecurityCostPortfolioBlock;
      DOF: Blocks.SecurityCostPortfolioBlock;
      SOF: Blocks.SecurityCostPortfolioBlock;
      STIP: Blocks.SecurityCostPortfolioBlock;
      FIP: Blocks.SecurityCostPortfolioBlock;
      CIP: Blocks.SecurityCostPortfolioBlock;
      AGB: Blocks.SecurityCostPortfolioBlock;
      BBB: Blocks.SecurityCostPortfolioBlock;
    }
    metricPack: Blocks.SecurityGroupMetricPackBlock;
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
    bondEquivalentValueCurrent: number;
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
      alertIsBenchmarkHedged?: string;
      shortcutConfig: {
        numericFilterDTO: NumericFilterDTO;
        driver: string;
        side: Array<string>;
        isUrgent: boolean;
        sendEmail: boolean;
      },
      alertTraceContraParty?: TraceTradeParty;
      alertTraceReportingParty?: TraceTradeParty;
      alertTraceVolumeEstimated?: number;
      alertTraceVolumeReported?: number;
      alertTraceBenchmarkName?: string;
      alertTracePrice?: number;
      alertTraceSpread?: number;
    }
    tradeHistory: Array<TradeDTO>;
    traceTrades: Array<Blocks.TraceTradeBlock>;
    lastTrace: {
      lastTraceSpread: number;
      lastTracePrice: number;
      lastTraceVolumeEstimated: number;
      lastTraceVolumeReported: number;
    }
    bics: {
      code: string;
      bicsLevel1: string;
      bicsLevel2: string;
      bicsLevel3: string;
      bicsLevel4: string;
    }
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
    stats: Array<Blocks.SecurityGroupMetricBlock>;
    metricPack: Blocks.SecurityGroupMetricPackBlock;
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
    leftPie: Blocks.SecurityGroupPieChartBlock;
    rightPie: Blocks.SecurityGroupPieChartBlock;
  }
}

export interface SecurityDefinitionDTO extends BasicDTOStructure {
  data: {
    name: string;
    displayName: string;
    key: string;
    urlForGetLongOptionListFromServer: string;
    prinstineFilterOptionList: Array<Blocks.SecurityDefinitionFilterBlock>;
    displayOptionList: Array<Blocks.SecurityDefinitionFilterBlock>;
    highlightSelectedOptionList: Array<Blocks.SecurityDefinitionFilterBlock>;
    securityDTOAttr: string;
    securityDTOAttrBlock: string;
    backendDtoAttrName: string;
    totalMatchingResults: number;
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
    isFilterLong: boolean;
    currentFilterPathInConsolidatedBICS: Array<string>;
    isFilterCapped: boolean;
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
    isLoading: boolean;
    showFiltersFromDefinition: SecurityDefinitionDTO;
    noMainCTA: boolean;
    securityAttrOnly: boolean;
  }
}

export interface SecurityGroupAverageVisualizerDTO extends BasicDTOStructure {
  data: {
    stats: Array<Blocks.SecurityGroupMetricBlock>;
  },
  state: {
    isEmpty: boolean;
    isStencil: boolean;
    isExpanded: boolean;
    editingStat: Blocks.SecurityGroupMetricBlock;
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

export interface BestQuoteComparerDTO extends BasicDTOStructure {
  data: {
    driverType: string;
    delta: number;
    mid: number;
    bid: {
      number: number;
      displayNumber: string;
      broker: string;
      size: number;
      isExecutable: boolean;
    },
    offer: {
      number: number;
      displayNumber: string;
      broker: string;
      size: number;
      isExecutable: boolean;
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
    hasExecutableQuote: boolean;
  }
}

export interface SecurityTableDTO extends BasicDTOStructure {
  data: {
    headers: Array<SecurityTableHeaderDTO>;
    allHeaders: Array<SecurityTableHeaderDTO>;
    rows: Array<SecurityTableRowDTO>;
    agGridColumnDefs: Array<Blocks.AgGridColumnDefinition>;
    agGridRowData: Array<Blocks.AgGridRow>;
    agGridFrameworkComponents: object;
    agGridAggregationMap: object;
    agGridPinnedTopRowData: Array<Blocks.AgGridRow>;
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
    isFrontendAggregation: boolean;
    isDataTypeText: boolean;
    isDriverDependent: boolean;
    pinned: boolean;
    sortActivated: AggridSortOptions;
    groupBelongs: string;
    groupShow: boolean;
    activePortfolios: Array<string>;
  },
  style: {
    columnWidthOverride: number;
  },
  state: {
    isSecurityCardVariant: boolean;
    isBestQuoteVariant: boolean;
    isCustomComponent: boolean;
    isAxeSkewEnabled: boolean;
    istotalSkewEnabled: boolean;
  }
}

export interface SecurityTableRowDTO extends BasicDTOStructure {
  data: {
    rowId: string;
    security: SecurityDTO;
    cells: Array<SecurityTableCellDTO>;
    quotes: Blocks.SecurityTableRowQuoteBlock;
    quoteHeaders: Array<Blocks.QuoteMetricBlock>;
    bestQuotes: {
      combined: {
        bestSpreadQuote: BestQuoteComparerDTO;
        bestYieldQuote: BestQuoteComparerDTO;
        bestPriceQuote: BestQuoteComparerDTO;
      }
      axe: {
        bestSpreadQuote: BestQuoteComparerDTO;
        bestYieldQuote: BestQuoteComparerDTO;
        bestPriceQuote: BestQuoteComparerDTO;
      }
    }
    alert: AlertDTO;
    historicalTradeVisualizer: HistoricalTradeVisualizerDTO;
    traceTradeVisualizer: TraceTradesVisualizerDTO;
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
    viewTraceState: boolean;
    quotesLoaded: boolean;
    isAgGridFullSizeVariant: boolean;
  }
}

export interface SecurityTableCellDTO extends BasicDTOStructure {
  data: {
    textData: string;
    bestQuoteComparerDTO: BestQuoteComparerDTO;
    alertSideDTO: SantaTableAlertSideCellDTO;
    alertStatusDTO: SantaTableAlertStatusCellDTO;
  },
  state: {
    isBestQuoteVariant: boolean;
    bestQuoteComparerUnavail: boolean;
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
      isExecutable: boolean;
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
      isExecutable: boolean;
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
    isQuoteExecutable: boolean;
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
    floatingParams: AdhocPacks.SantaTableNumericFloatingFilterParams;
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
    endPinText: string;
    diveInLevel?: number;
  }
  style: {
    leftGap: number;
    leftEdge: number;
    moveDistance: number;
    rightEdge: number;
    rightGap: number;
    endPinLocation: number;
    backgroundColor: string;
  }
  state: {
    isInversed: boolean;
    isInvalid: boolean;
    isPlaceholder: boolean;
    isStencil: boolean;
    isColorCodeInversed: boolean;
    structuringBreakdownVariant: boolean;
    structuringBreakdownExceededState: boolean;
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
    paragraphMessage: SafeHtml;
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
    isBenchmarkHedged: boolean;
    traceContraParty?: TraceTradeParty;
    traceReportingParty?: TraceTradeParty;
    traceSide?: string;
    traceVolumeEstimated?: number;
    traceVolumeReported?: number;
    traceBenchmarkName?: string;
    tracePrice?: number;
    traceSpread?: number;
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
    isError?: boolean;
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
    isTrace: boolean;
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
    positionList: Array<Blocks.SecurityPortfolioBlock>;
    timeSeriesId: string;
    positionPieId: string;
    volumeLeftPieId: string;
    volumeRightPieId: string;
  };
  state: {
    disabledPortfolio: Array<string>;
    selectedPortfolio: Array<string>;
    graphReceived: boolean;
    showAllTradeHistory: boolean;
    isCDSVariant: boolean;
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
    securityIdentifier?: string;
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
    title: string;
    definition: SecurityDefinitionDTO;
    displayCategoryList: Array<StructurePortfolioBreakdownRowDTO>;
    ratingHoverText: string;
    rawCs01CategoryList: Array<StructurePortfolioBreakdownRowDTO>;
    rawLeverageCategoryList: Array<StructurePortfolioBreakdownRowDTO>;
    backendGroupOptionIdentifier: string;
    popoverMainRow: Blocks.BICSMainRowDataBlock;
    portfolioId: number;
    portfolioName: string;
    diveInLevel: number;
    indexName: string;
  },
  style: {
    ratingFillWidth: number;
  }
  state: {
    isEditable: boolean;
    isStencil: boolean;
    isDisplayingCs01: boolean;
    isTargetAlignmentRatingAvail: boolean;
    isPreviewVariant: boolean;
    isBICs: boolean;
    isOverrideVariant: boolean;
    isEditingViewAvail: boolean;
    isDisplaySubLevels: boolean;
    isDisplayPopover: boolean;
    isViewingHistoricalData: boolean;
    isViewingIndex: boolean;
  }
}

export interface PortfolioFundDTO extends BasicDTOStructure {
  data: {
    date: string;
    portfolioId: number;
    portfolioShortName: PortfolioShortNames;
    portfolioNav: number;
    target : {
      portfolioTargetId: string;
      date: string;
      portfolioId: number;
      target: Blocks.PortfolioMetricTotals;
    };
    currentTotals: Blocks.PortfolioMetricTotals;
    indexId: number;
    indexShortName: string;
    indexNav: number;
    indexTotals: Blocks.PortfolioMetricTotals;
    children: Array<PortfolioBreakdownDTO>;
    displayChildren: Array<PortfolioBreakdownDTO>;
    cs01TargetBar: TargetBarDTO;
    creditLeverageTargetBar: TargetBarDTO;
    creditDurationTargetBar: TargetBarDTO;
    creditDurationIndexBar: TargetBarDTO;
    creditLeverageIndexBar: TargetBarDTO;
    activeDelta: DeltaScope;
    originalBEData: BEStructuringFundBlock; // used when updating portfolios for portfolio structuring,
    currentTotalDeltaCreditLeverage: number;
    currentTotalDeltaCreditDuration: number;
    currentTotalDeltaCreditLeverageDisplayText: string;
    currentTotalDeltaCreditDurationDisplayText: string;
    currentTotalDeltaCreditLeverageSignificantPositive: boolean;
    currentTotalDeltaCreditLeverageSignificantNegative: boolean;
    currentTotalDeltaCreditDurationSignificantPositive: boolean;
    currentTotalDeltaCreditDurationSignificantNegative: boolean;
  },
  api: {
    onSubmitMetricValues: (CS01: number, leverage: number) => void;
  }
  state: {
    isEditAvailable: boolean;
    isStencil: boolean;
    isNumeric: boolean;
    isDataUnavailable: boolean;
    isEditingFund: boolean;
    modifiedFundTargets: {
      creditDuration: number;
      creditLeverage: number;
    }
    hasErrors: {
      updatedCreditLeverage: boolean;
      updatedCreditDuration: boolean;
      errorMessage: string;
    }
    autoScalingAvailable: boolean;
    autoScalingActive: boolean;
    isViewingHistoricalData: boolean;
  }
}

export interface TargetBarDTO extends BasicDTOStructure {
  data: {
    targetMetric: PortfolioMetricValues;
    currentValue: number;
    targetValue: number;
    displayedCurrentValue: string;
    displayedTargetValue: string;
    currentPercentage: string;
    exceededPercentage: string;
    displayedResults: string;
    index: number;
    title: string;
    additionalMetricTargetData?: {
      metric: PortfolioMetricValues;
      current: string;
      target: string;
    }
  }
  state: {
    isInactiveMetric: boolean,
    isStencil: boolean;
    isEmpty: boolean;
    isDataUnavailable: boolean;
    isIndexVariant: boolean;
  }
}

export interface SantaModalDTO extends BasicDTOStructure {
  data: {
    id: string;
    modalElement: Node;
    title: string;
  },
  state: {
    isPresenting: boolean;
  },
  api: {
    openModal: () => void;
    closeModal: () => void;
    saveModal: () => boolean;
  }
}

export interface StructurePopoverDTO extends BasicDTOStructure {
  data: {
    mainRow: StructurePortfolioBreakdownRowDTO;
  }
  state: {
    isActive: boolean;
    isDisplayCs01: boolean;
    isViewingIndex: boolean;
  }
}

export interface StructurePortfolioBreakdownRowDTO extends BasicDTOStructure {
  data: Blocks.PortfolioBreakdownCategoryBlock;
  style: {
    branchHeight: string;
    top: string;
  }
  state: {
    isSelected: boolean;
    isBtnDiveIn: boolean;
    isStencil: boolean;
    isEditingView: boolean;
    isWithinPopover: boolean;
    isVisibleSubLevel: boolean;
    isShowingSubLevels: boolean;
    isEditingViewAvail: boolean;
    isDoveIn: boolean;
    isWithinEditRow: boolean;
    isWithinSetTargetPreview: boolean;
    isViewingHistoricalData: boolean;
    isViewingIndex: boolean;
  }
}

export interface TraceTradesVisualizerDTO extends BasicDTOStructure {
  data: {
    pristineRowList: Array<Blocks.TraceTradeBlock>;
    displayList: Array<Blocks.TraceTradeBlock>;
    scatterGraphId: string;
    pieGraphLeftId: string;
    pieGraphRightId: string;
    filterList: Array<string>;
    availableFiltersList: Array<string>;
  },
  state: {
    isDisplayAllTraceTrades: boolean;
    graphReceived: boolean;
    selectedFiltersList: Array<string>;
    showGraphs: boolean;
    isShowingDailyTradesOnly: boolean;
  },
  graph: {
    scatterGraph: am4Charts.XYChart;
    pieGraphLeft: am4Charts.PieChart;
    pieGraphRight: am4Charts.PieChart;
  }
}

// Even though this is not used for any component, but we still want it as a DTO because in the future it will likely be a component when we decide to visualize the workflow through UI
export interface GlobalWorkflowStateDTO extends BasicDTOStructure {
  uuid: string;  // this is necessary because indexedDB requires a root level id
  data: {
    uuid: string;
    module: NavigationModule;
    workflowType: GlobalWorkflowTypes;
    stateInfo: {
      filterList?: Array<SecurityDefinitionDTO>;
      activeMetric?: PortfolioMetricValues;
      structureUtilityPanelSnapshot?: StructureUtilityPanelState;
    }
  },
  api: {
    routeHandler: DetachedRouteHandle;
  }
  state: {
    triggersRedirect: boolean;
  }
}
