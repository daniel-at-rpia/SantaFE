import { DTOs, Blocks, AdhocPacks, Stubs } from 'Core/models/frontend';
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
  SecuritySubType = 'SecuritySubType',
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

export const PORTFOLIO_ID_TO_SHORTNAMES = {
  5: 'FIP',
  6: 'STIP',
  7: 'CIP',
  12: 'DOF',
  15: 'SOF',
  18: 'BBB',
  19: 'AGB'
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

export const BICS_BREAKDOWN_FRONTEND_KEY = 'bicsLevel';

export const BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER = 'BicsCodeLevel';

export const BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX = 'BicsSubLevel.';

export const BICS_OVERRIDES_IDENTIFIER = 'BicsCode';

export const BICS_OVERRIDES_TITLE = 'BICS Override'

export const BICS_BRANCH_DEFAULT_HEIGHT = 50;

export const BICS_BRANCH_DEFAULT_HEIGHT_LARGE = 55;

export const BICS_BRANCH_CHARACTER_LIMIT = 26;

export const BICS_NON_DISPLAYED_CATEGORY_IDENTIFIER_LIST: Array<string> = ['None', '*'];

export const BICS_CODE_DELIMITER_AMOUNT = 2;

export const BICS_DIVE_IN_UNAVAILABLE_CATEGORIES = ['99'];

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

export const STRUCTURE_SET_BULK_OVERRIDES_MODAL_ID = 'Set Bulk Overrides'

export const BICS_DICTIONARY_KEY_PREFIX = 'item';

export const CustomeBreakdownConfiguratorDefinitionLayout: Array<Stubs.SecurityDefinitionBundleStub> = [
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
      SecurityDefinitionMap.COUPON_TYPE,
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

export enum BreakdownViewFilter {
  overridesOnly = 'Overrides',
  BICSOnly = 'BICS',
  regularsOnly = 'Regulars',
  all = 'All'
}

export const UTILITY_PANEL_HISTORICAL_TIME_LABEL = 'Beginning Of Day';

export enum SubPortfolioFilter {
  all = 'All',
  nonHedging = 'Non-Hedging',
  nonShortCarry = 'Non-Short Carry',
  shortCarry = 'Short Carry'
}

// for the sake of simplicity, the values of the DeltaScope enum are exact matches to their counterparts in BE, expect Index obviously
export enum DeltaScope {
  dod = 'Dod',
  wow = 'Wow',
  mom = 'Mom',
  ytd = 'Ytd',
  tMinusTwo = 'TMinusTwo'
}

export enum DeltaScopeDisplayText {
  DoD = 'DoD',
  TMinusTwo = 'T-2',
  WoW = 'WoW',
  MoM = 'MoM',
  YtD = 'YtD'
}

export const DeltaScopeBEToFEMapping = {
  [DeltaScope.dod]: DeltaScopeDisplayText.DoD,
  [DeltaScope.tMinusTwo]: DeltaScopeDisplayText.TMinusTwo,
  [DeltaScope.wow]: DeltaScopeDisplayText.WoW,
  [DeltaScope.mom]: DeltaScopeDisplayText.MoM,
  [DeltaScope.ytd]: DeltaScopeDisplayText.YtD
}

export const DELTA_SCOPE_SIGNIFICANT_THRESHOLD_COEFFICIENT = {
  Dod: 0.1,
  Wow: 0.2,
  Mom: 0.3,
  Ytd: 0.4
}


export const SET_TARGET_CLEAR_ALL_OPTIONS_MAP: Blocks.StructureClearTargetsOptionMapBlock = {
  BICS: [
    {
      key: 'Level 1',
      backendIdentifier: 'BicsCodeLevel1',
      isSelected: false
    },
    {
      key: 'Level 2',
      backendIdentifier: 'BicsCodeLevel2',
      isSelected: false
    },
    {
      key: 'Level 3',
      backendIdentifier: 'BicsCodeLevel3',
      isSelected: false
    },
    {
      key: 'Level 4',
      backendIdentifier: 'BicsCodeLevel4',
      isSelected: false
    }
  ]
}