import * as moment from 'moment';
import * as am4charts from '@amcharts/amcharts4/charts';

import * as DTOs from './frontend-models.interface';
import * as Blocks from './frontend-blocks.interface';
import * as Stubs from './frontend-stub-models.interface';
import * as AdhocPacks from './frontend-adhoc-packages.interface';
import { SantaDatePicker } from 'Form/models/form-models.interface';
import { AlertTypes, NavigationModule, PortfolioShortNames } from 'Core/constants/coreConstants.constant';
import {
  PortfolioMetricValues,
  BreakdownViewFilter,
  PortfolioView,
  SubPortfolioFilter,
  DeltaScope
} from 'Core/constants/structureConstants.constants';
import {
  BEStructuringBreakdownBlock,
  BEGetPortfolioStructureServerReturn,
  BEFetchAllTradeDataReturn
} from 'BEModels/backend-models.interface';
import {
  TradeCenterPanelSearchModes,
  TradeCenterPanelSearchSaveModes
} from 'Core/constants/tradeConstants.constant';

export interface RootState {
  appReady: boolean;
  authenticated: boolean;
  currentUrl: string;
}

export interface GlobalNavState {
  menuIsActive: boolean;
  version: string;
  user: string;
  currentModule: NavigationModule,
  legend: {
    seniority: Array<Blocks.GlobalNavLegendBlock>;
    rating: Array<Blocks.GlobalNavLegendBlock>;
  }
  currentState: {
    trade: string;
    structure: string;
  }
}

export interface GlobalAlertState {
  activated: boolean;
  displayAlerts: boolean;
  triggerActionMenuOpen: boolean;
  presentList: Array<DTOs.AlertDTO>;
  storeList: Array<DTOs.AlertDTO>;
  totalSize: number;
  displayTotalSize: string;
  originalDocumentTitle: string;
  favicon: HTMLLinkElement;
  allAlertsList: Array<DTOs.AlertDTO>;
  alertUpdateTimeStamp: string;
  receivedActiveAlertsMap: object; // currently BE passes the same marketlist alerts regardless of the timestamp FE provides, until the alert expires. This map is to avoid duplicates being created over and over on each heartbeat
  alertUpdateInProgress: boolean;
  autoUpdateCountdown: number;
  tradeAlertTableReadyToReceiveAdditionalAlerts: boolean;
}

export interface GlobalWorkflowState {
  currentState: DTOs.GlobalWorkflowStateDTO;
  isIndexedDBReady: boolean;
}

export interface MarketState {
}

export interface MarketGroupPanelState {
  powerModeActivated: boolean;
  landscapeViewActivated: boolean;
  isConfiguratorCollapsed: boolean;
  isGroupDataLoaded: boolean;
  configurator: {
    dto: DTOs.SecurityDefinitionConfiguratorDTO;
    showSelectedGroupConfig: boolean;
    cachedOriginalConfig: DTOs.SecurityDefinitionConfiguratorDTO;
    shortcutList: Array<DTOs.SearchShortcutDTO>;
    selectedShortcut: DTOs.SearchShortcutDTO;
  }
  searchResult: {
    securityGroupList: Array<DTOs.SecurityGroupDTO>;
    renderProgress: number;
    searchFailed: boolean;
    searchFailedError: string;
  }
  utility: {
    selectedWidget: string;
    visualizer: DTOs.SecurityGroupAverageVisualizerDTO;
    pieConfigurator: {
      left: {
        selected: boolean;
        options: Array<Stubs.SecurityDefinitionStub>;
        displayText: string;
        activeMetric: Stubs.SecurityDefinitionStub;
      }
      right: {
        selected: boolean;
        options: Array<Stubs.SecurityDefinitionStub>;
        displayText: string;
        activeMetric: Stubs.SecurityDefinitionStub;
      }
    }
  }
}

export interface TradeState {
  sidePanelsCollapsed: boolean;
  lilMarketMaximized: boolean;
  ownerInitial: string;
  displayAlertThumbnail: boolean;
  alertPanelMaximized: boolean;
}

export interface TradeCenterPanelState {
  bestQuoteValidWindow: number;
  presets : {
    presetsReady: boolean;
    selectedPreset: DTOs.SearchShortcutDTO;
    selectedList: Array<DTOs.SearchShortcutDTO>;
    selectedCategoryFromTop: boolean;
    selectedCategoryFromBottom: boolean;  // the reason we want to do two flags instead of one is so that we can have the default set to be "neither" which is more correct in the UI
    portfolioShortcutList: Array<DTOs.SearchShortcutDTO>;
    ownershipShortcutList: Array<DTOs.SearchShortcutDTO>;
    strategyShortcutList: Array<DTOs.SearchShortcutDTO>;
    recentWatchlistShortcuts: {
      fullList: Array<DTOs.SearchShortcutDTO>;
      todayList: Array<DTOs.SearchShortcutDTO>,
      thisWeekList: Array<DTOs.SearchShortcutDTO>,
      lastWeekList: Array<DTOs.SearchShortcutDTO>
    }
    savedWatchlistShortcutList: Array<DTOs.SearchShortcutDTO>;
    savedWatchlistDeleteActivated: boolean;
    trendingWatchlistShortcutList: Array<DTOs.SearchShortcutDTO>;
  }
  searchEngine: {
    typeaheadActive: boolean;
    selectedTypeaheadEntryIndex: number;
    activeKeyword: string;
    indexedKeywords: Array<AdhocPacks.TradeCenterPanelSearchEngineIndexEntry>;  // switch to <object> if we want to guarantee unique-ness
    typeaheadEntries: Array<AdhocPacks.TradeCenterPanelSearchEngineIndexEntry>;
    constructedSearchBucket: {
      TICKER: Array<AdhocPacks.TradeCenterPanelSearchEngineIndexEntry>,
      BICS: Array<AdhocPacks.TradeCenterPanelSearchEngineIndexEntry>
    };
    searchBucketDefinitionDTOs: {
      TICKER: DTOs.SecurityDefinitionDTO;
      BICS: DTOs.SecurityDefinitionDTO;
    }
  }
  configurator: {
    dto: DTOs.SecurityDefinitionConfiguratorDTO;
    boosted: boolean;
  }
  table: {
    metrics: Array<Stubs.SecurityTableHeaderConfigStub>;
    dto: DTOs.SecurityTableDTO;
  }
  fetchResult: {
    fetchTableDataFailed: boolean;
    fetchTableDataFailedError: string;
    mainTable: Blocks.TableFetchResultBlock;
    initialDataLoadedInternalSyncFlag: boolean;
    totalCount: number;
    lastFetchBucket: object;
    lastFetchServerReturn: BEFetchAllTradeDataReturn;
  }
  filters: Blocks.TradeCenterPanelStateFilterBlock;
  editingDriver: boolean;
  currentSearch: {
    previewShortcut: DTOs.SearchShortcutDTO;
    redirectedFromStrurturing: boolean;
    mode: TradeCenterPanelSearchModes;
    saveMode: TradeCenterPanelSearchSaveModes;
  }
  isIndexedDBReady: boolean;
}

export interface StructureMainPanelState {
  ownerInitial: string;
  isUserPM: boolean;
  currentDataDatestamp: moment.Moment;
  selectedMetricValue: PortfolioMetricValues;
  activeBreakdownViewFilter: BreakdownViewFilter;
  activePortfolioViewFilter: Array<PortfolioShortNames>;
  activeSubPortfolioFilter: SubPortfolioFilter;
  activeDeltaScope: DeltaScope;
  fetchResult: {
    fundList: DTOs.PortfolioFundDTO[];
    fetchFundDataFailed: boolean;
    fetchFundDataFailedError: string;
    rawServerReturnCache: BEGetPortfolioStructureServerReturn;  // need to store a copy of the serverReturn because we don't make new API call when switching strategy & deltas
  }
  overrideModifications: {
    totalNumberOfNecessaryCalls: number;
    callCount: number;
  }
}

export interface TradeUtilityPanelState {
  tongueExpanded: boolean;
  prompt: string;
  updateCountdown: string;
  isPaused: boolean;
  isCallingAPI: boolean;
  isProcessingData: boolean;
  isPresetSelected: boolean;
  isInitialDataLoaded: boolean;
  validWindowConfig: {
    valueRaw: number;
    valueDisplay: string;
    isEditing: boolean;
  }
}

export interface TradeMarketAnalysisPanelState {
  receivedSecurity: boolean;
  receivedSecurityIsCDS: boolean;
  apiReturnedState: boolean;
  apiErrorState: boolean;
  graphDataEmptyState: boolean;
  displayGraph: boolean;
  targetSecurity: DTOs.SecurityDTO;
  config: {
    timeScope: string;
    groupByOptions: Array<DTOs.SecurityDefinitionDTO>;
    activeOptions: Array<DTOs.SecurityDefinitionDTO>;
    driver: string;
  }
  table: {
    numOfSecurities: number;
    presentList: Array<DTOs.SecurityDTO>;
    prinstineTopSecurityList: Array<DTOs.SecurityDTO>;
    prinstineBottomSecurityList: Array<DTOs.SecurityDTO>;
    levelSummary: DTOs.HistoricalSummaryDTO;
    basisSummary: DTOs.HistoricalSummaryDTO;
    rankingList: Array<string>;
    moveDistanceLevelList: Array<string>;
    moveDistanceBasisList: Array<string>;
  }
  chart: am4charts.XYChart;
}

export interface TradeObligorGraphPanelState {
  obligorChart: am4charts.XYChart;
  obligorSecurityID: string;
  obligorName: string;
  obligorCurrency: string;
  securityTableRowDTOList: DTOs.SecurityTableRowDTO[];
  lookBackHours: number;
  axesZoomState: AdhocPacks.ObligorGraphAxesZoomState;
  metric: {
    spread: boolean;
    yield: boolean;
  }
  markValue: {
    cS01: boolean;
    quantity: boolean;
  }
  activeCharts: {
    srBond: boolean;
    subBond: boolean;
    srCDS: boolean;
    subCDS: boolean;
  }
  chartCategories: Blocks.ObligorChartCategoryBlock[];
}

export interface TradeAlertPanelState {
  isUserPM: boolean;
  configureAlert: boolean;
  // focusMode: boolean;
  isAlertPaused: boolean;
  lastReceiveAlertUnitTimestamp: number;
  securityMap: Array<AdhocPacks.SecurityMapEntry>;
  configuration: {
    axe: {
      securitySearchKeyword: string;
      securityList: Array<DTOs.TradeAlertConfigurationAxeGroupBlockDTO>;
      searchList: Array<DTOs.SecurityDTO>;
      matchedResultCount: number;
      searchIsValid: boolean;
    }
  }
  alertUpdateInProgress: boolean;
  isCenterPanelPresetSelected: boolean;
  displayAlertTable: boolean;
  table: {
    alertMetrics: Array<Stubs.SecurityTableHeaderConfigStub>;
    alertDto: DTOs.SecurityTableDTO;
  }
  fetchResult: {
    fetchTableDataFailed: boolean;
    fetchTableDataFailedError: string;
    alertTable: Blocks.TableFetchResultBlock;
  }
  filters: {
    keyword: {
      defaultValueForUI: string;
    }
    quickFilters: {
      keyword: string;
      driverType: string;
      portfolios: Array<string>;
    }
  }
  alert: {
    alertTableAlertList: AdhocPacks.AlertDTOMap;
    initialAlertListReceived: boolean;
    nonMarketListAxeAlertCount: number;
    marketListAxeAlertCount: number;
    unreadAxeAlertCount: number;
    markAlertCount: number;
    unreadMarkAlertCount: number;
    tradeAlertCount: number;
    traceAlertCount: number;
    scopedAlertType: AlertTypes;
    scopedForMarketListOnly: boolean;
    recentUpdatedAlertList: Array<string>;  // the rowId of the alerts that are recently updated on FE, we need to track them because those rows needs to be forced to be updated in the next update call, the diffing logic wouldnt work because every update we are just fetching new securities, so agGrid has to be updated through manually tracking the alerts that are updated recently
  }
}

export interface StructureState {
  fetchResult: {
    fetchBICsHierarchyFailed: boolean;
    fetchBICsHierarchyError: string;
  }
}

export interface StructureUtilityPanelState {
  selectedMetricValue: PortfolioMetricValues;
  lastUpdateTime: string;
  currentDatestamp: moment.Moment;
  currentDatestampDisplayText: string;
  activeBreakdownViewFilter: BreakdownViewFilter;
  activePortfolioViewFilter: Array<PortfolioShortNames>;
  activeSubPortfolioFilter: SubPortfolioFilter;
  currentDeltaScope: DeltaScope;
  viewingHistoricalData: boolean;
  switchDate: {
    datepicker: SantaDatePicker;
    changeDate: moment.Moment;
  }
}

export interface StructureSetTargetPanelState {
  targetFund: DTOs.PortfolioFundDTO;
  targetBreakdown: DTOs.PortfolioBreakdownDTO;
  targetBreakdownRawData: BEStructuringBreakdownBlock;
  targetBreakdownRawDataDisplayLabelMap: object;
  editRowList: Array<Blocks.StructureSetTargetPanelEditRowBlock>;
  totalUnallocatedCS01: number;
  totalUnallocatedCreditLeverage: number;
  remainingUnallocatedCS01: number;
  remainingUnallocatedCreditLeverage: number;
  displayCs01BtnText: string;
  displayCreditLeverageBtnText: string;
  displayRemainingUnallocatedCS01: string;
  displayRemainingUnallocatedCreditLeverage: string;
  displayPercentageUnallocatedCS01: number;
  displayPercentageUnallocatedCreditLeverage: number;
  activeMetric: PortfolioMetricValues;
  targetBreakdownIsOverride: boolean;
  configurator: {
    dto: DTOs.SecurityDefinitionConfiguratorDTO;
    display: boolean;
    newOverrideNameCache: string;
  }
  removalList: Array<Blocks.StructureSetTargetPanelEditRowBlock>;
  editViewMode: boolean;
  ownerInitial: string;
  activeSubPortfolioFilter: SubPortfolioFilter;
  isViewingIndexOnBICS: boolean;
  isViewingClearTargets: boolean;
  clearTargetsOptionsList: Array<Blocks.StructureClearTargetsOptionBlock>;
  distributeUtilityText: string;
}

export interface StructureSetBulkOverridesPanelState {
  editRowList: Array<Blocks.StructureSetBulkOverridesEditRow>;
  configurator: {
    dto: DTOs.SecurityDefinitionConfiguratorDTO;
    display: boolean;
    newOverrideNameCache: string;
  }
}