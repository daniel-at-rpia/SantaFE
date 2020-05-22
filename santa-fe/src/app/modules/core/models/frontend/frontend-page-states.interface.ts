import * as DTOs from 'FEModels/frontend-models.interface';
import {
  ObligorChartCategoryBlock,
  TradeAlertConfigurationAxeGroupBlock,
  TableFetchResultBlock
} from 'FEModels/frontend-blocks.interface';
import {
  SecurityDefinitionStub,
  SecurityTableMetricStub
} from 'FEModels/frontend-stub-models.interface';
import {
  DefinitionConfiguratorEmitterParamsItem,
  ObligorGraphAxesZoomState,
  SecurityMapEntry
} from 'FEModels/frontend-adhoc-packages.interface';
import {AlertTypes} from 'Core/constants/coreConstants.constant';
import * as am4charts from '@amcharts/amcharts4/charts';

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
  secondaryStoreList: Array<DTOs.AlertDTO>;  // for alerts that are not suppose to be displayed, need this for calculating total count
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
        options: Array<SecurityDefinitionStub>;
        displayText: string;
        activeMetric: SecurityDefinitionStub;
      }
      right: {
        selected: boolean;
        options: Array<SecurityDefinitionStub>;
        displayText: string;
        activeMetric: SecurityDefinitionStub;
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
  focusMode: boolean;
}

export interface TradeCenterPanelState {
  bestQuoteValidWindow: number;
  isFocusMode: boolean;
  presets : {
    presetsReady: boolean;
    selectedPreset: DTOs.SearchShortcutDTO;
    selectedList: Array<DTOs.SearchShortcutDTO>;
    recentShortcutList: Array<DTOs.SearchShortcutDTO>;
    portfolioShortcutList: Array<DTOs.SearchShortcutDTO>;
    ownershipShortcutList: Array<DTOs.SearchShortcutDTO>;
    strategyShortcutList: Array<DTOs.SearchShortcutDTO>;
    individualShortcutList: Array<DTOs.SearchShortcutDTO>;
  }
  configurator: {
    dto: DTOs.SecurityDefinitionConfiguratorDTO;
    boosted: boolean;
  }
  table: {
    metrics: Array<SecurityTableMetricStub>;
    dto: DTOs.SecurityTableDTO;
  }
  fetchResult: {
    fetchTableDataFailed: boolean;
    fetchTableDataFailedError: string;
    mainTable: TableFetchResultBlock;
  }
  filters: {
    quickFilters: {
      driverType: string;
      portfolios: Array<string>;
      keyword: string;
      owner: Array<string>;
      strategy: Array<string>;
    }
    securityFilters: Array<DefinitionConfiguratorEmitterParamsItem>
  }
}

export interface TradeUtilityPanelState {
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
  axesZoomState: ObligorGraphAxesZoomState;
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
  chartCategories: ObligorChartCategoryBlock[];
}

export interface TradeAlertPanelState {
  isUserPM: boolean;
  configureAlert: boolean;
  // focusMode: boolean;
  isAlertPaused: boolean;
  securityMap: Array<SecurityMapEntry>;
  alertUpdateTimestamp: string;
  // configuration: {
  //   selectedAlert: AlertTypes,
  //   axe: {
  //     myGroup: TradeAlertConfigurationAxeGroupBlock;
  //     securitySearchKeyword: string;
  //     securityList: Array<TradeAlertConfigurationAxeGroupBlock>;
  //     searchList: Array<DTOs.SecurityDTO>;
  //     matchedResultCount: number;
  //     searchIsValid: boolean;
  //   },
  //   mark: {
  //     myGroup: {
  //       disabled: boolean;
  //       groupId: string;
  //       makeMoneySpread: number;
  //       makeMoneyPrice: number;
  //       loseMoneySpread: number;
  //       loseMoneyPrice: number;
  //     }
  //   }
  // }
  autoUpdateCountdown: number;
  alertUpdateInProgress: boolean;
  isCenterPanelPresetSelected: boolean;
  receivedActiveAlertsMap: object;  // currently BE passes the same marketlist alerts regardless of the timestamp FE provides, until the alert expires. This map is to avoid duplicates being created over and over on each heartbeat
  displayAlertTable: boolean;
  table: {
    alertMetrics: Array<SecurityTableMetricStub>;
    alertDto: DTOs.SecurityTableDTO;
  }
  fetchResult: {
    fetchTableDataFailed: boolean;
    fetchTableDataFailedError: string;
    alertTable: TableFetchResultBlock;
  }
  filters: {
    quickFilters: {
      keyword: string;
      driverType: string;
      portfolios: Array<string>;
    }
  }
  alert: {
    alertTableAlertList: Array<DTOs.AlertDTO>;
    initialAlertListReceived: boolean;
    axeAlertCount: number;
    unreadAxeAlertCount: number;
    markAlertCount: number;
    unreadMarkAlertCount: number;
    tradeAlertCount: number;
    unreadTradeAlertCount: number;
    scopedAlertType: AlertTypes;
  }
}
