import {
  SecurityDTO,
  SecurityGroupDTO,
  SecurityGroupDefinitionDTO
} from 'App/models/frontend/frontend-models.interface';

export interface MarketState {
  groupDefinitionList: Array<SecurityGroupDefinitionDTO>;
  securityList: Array<SecurityDTO>;
  securityList2: Array<SecurityDTO>;
  securityList3: Array<SecurityDTO>;
  securityList4: Array<SecurityDTO>;
  securityGroupList1: Array<SecurityGroupDTO>;
  securityGroupList2: Array<SecurityGroupDTO>;
  securityGroupList3: Array<SecurityGroupDTO>;
  securityGroupList4: Array<SecurityGroupDTO>;
}