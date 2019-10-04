import {
  SecurityDTO,
  SecurityGroupDTO,
  SecurityGroupDefinitionDTO,
  SecurityGroupDefinitionConfiguratorDTO
} from 'App/models/frontend/frontend-models.interface';

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