import {
  SecurityDTO,
  SecurityGroupDTO,
  SecurityGroupDefinitionDTO,
  SecurityGroupDefinitionConfiguratorDTO,
  SecurityGroupAverageVisualizerDTO
} from 'App/models/frontend/frontend-models.interface';
import { SecurityDefinitionStub } from 'App/models/frontend/frontend-stub-models.interface';

export interface MarketState {
  configurator: SecurityGroupDefinitionConfiguratorDTO;
  securityList: Array<SecurityDTO>;
  securityList2: Array<SecurityDTO>;
  securityList3: Array<SecurityDTO>;
  securityList4: Array<SecurityDTO>;
  securityGroupList1: Array<SecurityGroupDTO>;
  securityGroupList2: Array<SecurityGroupDTO>;
  securityGroupList3: Array<SecurityGroupDTO>;
  securityGroupList4: Array<SecurityGroupDTO>;
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