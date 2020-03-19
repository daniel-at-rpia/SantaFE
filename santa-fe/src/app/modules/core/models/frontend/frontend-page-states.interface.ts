import * as DTOs from 'FEModels/frontend-models.interface';
import {
  ObligorChartCategoryBlock,
  TradeAlertConfigurationAxeGroupBlock
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
import { AlertTypes } from 'Core/constants/coreConstants.constant';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

export interface GlobalAlertState {
  activated: boolean;
  displayAlerts: boolean;
  triggerActionMenuOpen: boolean;
  presentList: Array<DTOs.AlertDTO>;
  storeList: Array<DTOs.AlertDTO>;
  totalSize: number;
  displayTotalSize: string;
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
}

export interface TradeCenterPanelState {
  currentContentStage: number;
  bestQuoteValidWindow: number;
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
    rowList: Array<DTOs.SecurityTableRowDTO>;
    prinstineRowList: Array<DTOs.SecurityTableRowDTO>;
    liveUpdatedRowList: Array<DTOs.SecurityTableRowDTO>;
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
  configureAlert: boolean;
  isAlertPaused: boolean;
  testDto: any;
  securityMap: Array<SecurityMapEntry>;
  alertUpdateTimestamp: string;
  configuration: {
    selectedAlert: AlertTypes,
    axe: {
      myGroup: TradeAlertConfigurationAxeGroupBlock;
      securitySearchKeyword: string;
      securityList: Array<TradeAlertConfigurationAxeGroupBlock>;
      searchList: Array<DTOs.SecurityDTO>;
      matchedResultCount: number;
      searchIsValid: boolean;
    },
    mark: {

    }
  }
  autoUpdateCountdown: number;
  alertUpdateInProgress: boolean;
}