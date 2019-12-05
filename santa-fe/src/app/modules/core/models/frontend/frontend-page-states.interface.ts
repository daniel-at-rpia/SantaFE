import {
  SecurityDTO,
  SecurityTableDTO,
  SecurityTableRowDTO,
  SecurityGroupDTO,
  SecurityDefinitionDTO,
  SecurityDefinitionConfiguratorDTO,
  SecurityGroupAverageVisualizerDTO,
  SearchShortcutDTO,
  QuantComparerDTO
} from 'FEModels/frontend-models.interface';
import {
  SecurityDefinitionStub,
  SecurityTableMetricStub
} from 'FEModels/frontend-stub-models.interface';
import { DefinitionConfiguratorEmitterParamsItem } from 'FEModels/frontend-adhoc-packages.interface';

export interface MarketState {
}

export interface MarketGroupPanelState {
  powerModeActivated: boolean;
  landscapeViewActivated: boolean;
  isConfiguratorCollapsed: boolean;
  isGroupDataLoaded: boolean;
  configurator: {
    dto: SecurityDefinitionConfiguratorDTO;
    showSelectedGroupConfig: boolean;
    cachedOriginalConfig: SecurityDefinitionConfiguratorDTO;
    shortcutList: Array<SearchShortcutDTO>;
    selectedShortcut: SearchShortcutDTO;
  }
  searchResult: {
    securityGroupList: Array<SecurityGroupDTO>;
    renderProgress: number;
    searchFailed: boolean;
    searchFailedError: string;
  }
  utility: {
    selectedWidget: string;
    visualizer: SecurityGroupAverageVisualizerDTO;
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
  graphsCollapsed: boolean;
}

export interface TradeCenterPanelState {
  currentContentStage: number;
  presets : {
    selectedPreset: any;
    shortcutList: Array<SearchShortcutDTO>;
  }
  configurator: {
    dto: SecurityDefinitionConfiguratorDTO;
  }
  table: {
    metrics: Array<SecurityTableMetricStub>;
    dto: SecurityTableDTO;
  }
  fetchResult: {
    fetchTableDataFailed: boolean;
    fetchTableDataFailedError: string;
    rowList: Array<SecurityTableRowDTO>;
    prinstineRowList: Array<SecurityTableRowDTO>;
    liveUpdatedRowList: Array<SecurityTableRowDTO>;
  }
  filters: {
    quickFilters: {
      metricType: string;
      portfolios: Array<string>;
      keyword: string;
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
}