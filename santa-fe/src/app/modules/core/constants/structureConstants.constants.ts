import { PortfolioStructureDTO } from 'FEModels/frontend-models.interface';
import { SecurityDefinitionBundleStub } from 'FEModels/frontend-stub-models.interface';
import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';

export enum PortfolioView {
  overweight = 'Overweight',
  underweight = 'Underweight',
  neutral = 'Neutral'
}

export enum PortfolioBreakdownGroupOptions {
  Ccy = 'Currency',
  Tenor = 'Tenor',
  RatingNoNotch = 'Rating',
  BICs = 'BICS'
}

export enum PortfolioShortNames {
  DOF = 'DOF',
  SOF = 'SOF',
  STIP = 'STIP',
  FIP = 'FIP',
  CIP = 'CIP',
  AGB = 'AGB',
  BBB = 'BBB'
}

export enum PortfolioMetricValues {
  cs01 = 'CS01',
  creditLeverage = 'Credit Leverage'
}

export enum BICsLevels {
  bicsLevel1 = 1,
  bicsLevel2,
  bicsLevel3,
  bicsLevel4
}

export const STRUCTURE_EDIT_MODAL_ID = 'Edit Fund Target';



export const CustomeBreakdownConfiguratorDefinitionLayout: Array<SecurityDefinitionBundleStub> = [
  {
    label: 'Basic',
    list: [
      SecurityDefinitionMap.CURRENCY,
      SecurityDefinitionMap.RATING,
      SecurityDefinitionMap.TENOR,
      SecurityDefinitionMap.COUNTRY,
      SecurityDefinitionMap.TICKER
    ]
  },{
    label: 'BICS',
    list: [
      SecurityDefinitionMap.BICS_LEVEL_1,
      SecurityDefinitionMap.BICS_LEVEL_2,
      SecurityDefinitionMap.BICS_LEVEL_3,
      SecurityDefinitionMap.BICS_LEVEL_4
    ]
  },{
    label: 'Quality',
    list: [
      SecurityDefinitionMap.RATING_BUCKET,
      SecurityDefinitionMap.SENIORITY
    ]
  }
];
