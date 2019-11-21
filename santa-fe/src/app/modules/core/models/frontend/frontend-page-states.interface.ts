import {
  SecurityDTO,
  SecurityTableDTO,
  SecurityTableRowDTO,
  SecurityGroupDTO,
  SecurityGroupDefinitionDTO,
  SecurityGroupDefinitionConfiguratorDTO,
  SecurityGroupAverageVisualizerDTO,
  SearchShortcutDTO,
  QuantComparerDTO
} from 'FEModels/frontend-models.interface';
import { SecurityDefinitionStub } from 'FEModels/frontend-stub-models.interface';

export interface MarketState {
}

export interface MarketGroupPanelState {
  powerModeActivated: boolean;
  landscapeViewActivated: boolean;
  isConfiguratorCollapsed: boolean;
  isGroupDataLoaded: boolean;
  configurator: {
    dto: SecurityGroupDefinitionConfiguratorDTO;
    showSelectedGroupConfig: boolean;
    cachedOriginalConfig: SecurityGroupDefinitionConfiguratorDTO;
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
  table: SecurityTableDTO;
  rowList: Array<SecurityTableRowDTO>;
}