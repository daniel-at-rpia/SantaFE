import {
  SecurityDTO,
  SecurityGroupDTO,
  SecurityGroupDefinitionDTO,
  SecurityGroupDefinitionConfiguratorDTO,
  SecurityGroupAverageVisualizerDTO
} from 'FEModels/frontend-models.interface';
import { SecurityDefinitionStub } from 'FEModels/frontend-stub-models.interface';

export interface MarketState {
}

export interface MarketGroupPanelState {
  configurator: {
    dto: SecurityGroupDefinitionConfiguratorDTO;
    showSelectedGroupConfig: boolean;
    cachedOriginalConfig: SecurityGroupDefinitionConfiguratorDTO;
  }
  searchResult: {
    securityGroupList: Array<SecurityGroupDTO>;
    renderProgress: number;
  }
  isConfiguratorCollapsed: boolean;
  isGroupDataLoaded: boolean;
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

export interface TradeCenterPanelState {
  tableList: Array<any>;
}