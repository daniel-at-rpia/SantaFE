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
  fetchTableDataFailed: boolean;
  fetchTableDataFailedError: string;
  table: SecurityTableDTO;
  tableMetrics: Array<SecurityTableMetricStub>;
  rowList: Array<SecurityTableRowDTO>;
  prinstineRowList: Array<SecurityTableRowDTO>;
  currentContentStage: number;
  filters: {
    quickFilters: {
      metricType: string;
      portfolios: Array<string>;
      securityType: Array<string>;
      currency: Array<string>;
      keyword: string;
    }
  }
}