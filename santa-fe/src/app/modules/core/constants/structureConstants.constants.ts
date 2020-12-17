import { PortfolioStructureDTO } from 'FEModels/frontend-models.interface';
import { SecurityDefinitionBundleStub } from 'FEModels/frontend-stub-models.interface';
import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';

export enum PortfolioView {
  positive = 'Positive',
  improving = 'Improving',
  neutral = 'Neutral',
  deteriorating = 'Deteriorating',
  negative = 'Negative'
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

export const SUPPORTED_PORTFOLIO_LIST: Array<PortfolioShortNames> = [
  PortfolioShortNames.FIP,
  PortfolioShortNames.BBB,
  PortfolioShortNames.CIP,
  PortfolioShortNames.STIP,
  PortfolioShortNames.AGB,
  PortfolioShortNames.DOF,
  PortfolioShortNames.SOF
];

export const BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER = 'BicsCodeLevel';

export const BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX = 'BicsSubLevel.';

export const BICS_OVERRIDES_IDENTIFIER = 'BicsCode';

export const BICS_OVERRIDES_TITLE = 'BICS Override'

export const BICS_BRANCH_DEFAULT_HEIGHT = 50;

export const BICS_BRANCH_DEFAULT_HEIGHT_LARGE = 55;

export const BICS_BRANCH_CHARACTER_LIMIT = 26;

export const BICS_NON_DISPLAYED_CATEGORY_IDENTIFIER_LIST: Array<string> = ['None', '*'];

export enum PortfolioMetricValues {
  cs01 = 'CS01',
  creditLeverage = 'Credit Leverage',
  creditDuration = 'Credit Duration'
}

export enum BICsLevels {
  bicsLevel1 = 1,
  bicsLevel2,
  bicsLevel3,
  bicsLevel4
}

export const STRUCTURE_EDIT_MODAL_ID = 'Edit Fund Target';

export const BICS_DICTIONARY_KEY_PREFIX = 'item';

export const CustomeBreakdownConfiguratorDefinitionLayout: Array<SecurityDefinitionBundleStub> = [
  {
    label: 'Common',
    list: [
      SecurityDefinitionMap.CURRENCY,
      SecurityDefinitionMap.RATING,
      SecurityDefinitionMap.TENOR,
      SecurityDefinitionMap.COUNTRY
    ]
  },{
    label: 'BICS',
    list: [
      SecurityDefinitionMap.BICS_CONSOLIDATED
    ]
  },{
    label: 'Bond',
    list: [
      SecurityDefinitionMap.TICKER,
      SecurityDefinitionMap.RATING_BUCKET,
      SecurityDefinitionMap.SENIORITY
    ]
  }
];

export enum BEPortfolioTargetMetricValues {
  CreditLeverage = 'CreditLeverage',
  CreditDuration = 'CreditDuration',
  Cs01 = 'Cs01'
}