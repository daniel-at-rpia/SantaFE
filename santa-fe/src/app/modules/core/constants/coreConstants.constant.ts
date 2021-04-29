import {
  SecurityTableHeaderConfigStub,
  SecurityMetricOptionStub,
  TriCoreDriverConfigStub
} from 'FEModels/frontend-stub-models.interface';

export enum NavigationModule {
  trade = 'trade',
  structuring = 'structuring',
  market = 'market'
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

export const APIUrlMap = {
  getUserInitials: `user/get-user-initials`,
  getSecurityIdMap: `security/get-security-identifiers`,
  getSecurityDTOs: `security/get-securities`,
  getPortfolios: `group/get-security-dtos-from-group-identifier`,
  getAllQuotes: `quote/get-all-quotes`,
  getObligorCurves: `group/get-security-dtos-from-security-and-group-definition`,
  getGroups: `group/get-groups`,
  getGroupHistoricalSummary: `group/get-group-historical-summary-from-security`,
  getTickers: `Obligor/get-tickers`,
  getSubIndustries: `obligor/get-subindustries`,
  getCountries: 'obligor/get-countries',
  setQuoteStatus: 'quote/set-quote-status',
  getAlertConfigurations: 'Alert/get-alert-configs',
  updateAlertConfiguration: 'Alert/update-alert-configs',
  getAlerts: 'Alert/get-alerts',
  readAlert: 'Alert/set-alerts-to-inactive',
  deleteAlert: 'Alert/delete-alerts',
  logEngagement: 'feLogger/track',
  logError: 'feLogger/log',
  getAllTradeHistory: 'trade/get-all-trades-for-security',
  getPortfolioStructures: 'portfolioStructuring/get-portfolio-structures',
  updatePortfolioTargets: 'portfolioStructuring/update-portfolio-target',
  updatePortfolioBreakdown: 'portfolioStructuring/update-portfolio-breakdown',
  getBICsCodeDictionary: 'portfolioStructuring/get-bics-code-dictionary',
  getPortfolioOverride: 'portfolioStructuring/get-portfolio-override',
  updatePortfolioOverrides: 'portfolioStructuring/update-portfolio-overrides',
  createPortfolioOverrides: 'portfolioStructuring/create-portfolio-overrides',
  deletePortfolioOverrides: 'portfolioStructuring/delete-portfolio-overrides',
  getViews: 'portfolioStructuring/get-analyst-views',
  setView: 'portfolioStructuring/set-analyst-views',
  getAllTraceTrades: 'TraceTrade/get-all-trace-trades',
  clearPortfolioBreakdown: 'portfolioStructuring/clear-portfolio-breakdown',
  createPortfolioOverridesForAllPortfolios: 'portfolioStructuring/create-portfolio-overrides-for-all-portfolios'
};

export const FAILED_USER_INITIALS_FALLBACK = 'n/a';
export const DevWhitelist = ['DZ', 'RC', 'SC'];

export const SecurityMetricOptions: Array<SecurityMetricOptionStub> = [
  {
    label: 'Default Spread',
    backendDtoAttrName: 'defaultSpread',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd',
      'TMinusTwo'
    ]
  },
  {
    label: 'Price',
    backendDtoAttrName: 'price',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd',
      'TMinusTwo'
    ]
  },
  {
    label: 'Rating',
    backendDtoAttrName: 'ratingDouble',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd',
      'TMinusTwo'
    ]
  },
  {
    label: 'G Spread',
    backendDtoAttrName: 'gSpread',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd',
      'TMinusTwo'
    ]
  },
  {
    label: 'OAS Spread',
    backendDtoAttrName: 'oasSpread',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd',
      'TMinusTwo'
    ]
  },
  {
    label: 'Z-Spread',
    backendDtoAttrName: 'zSpread',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd',
      'TMinusTwo'
    ]
  },
  {
    label: 'YieldWorst',
    backendDtoAttrName: 'yieldWorst',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd',
      'TMinusTwo'
    ]
  },
  {
    label: 'Asset Swap Spread (into USD)',
    backendDtoAttrName: 'aswUsd',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd',
      'TMinusTwo'
    ]
  }
];

export const DEFAULT_DRIVER_IDENTIFIER = 'DEFAULT';
export const TriCoreDriverConfig: TriCoreDriverConfigStub = {
  Spread: {
    label: 'Spread',
    tier2Threshold: 20,
    inversed: false,
    rounding: 0,
    driverLabel: SecurityMetricOptions[0].label,
    backendTargetQuoteAttr: 'bestSpreadQuote'
  },
  Yield: {
    label: 'Yield',
    tier2Threshold: 1,
    inversed: false,
    rounding: 3,
    driverLabel: SecurityMetricOptions[6].label,
    backendTargetQuoteAttr: 'bestYieldQuote'
  },
  Price: {
    label: 'Price',
    tier2Threshold: 3,
    inversed: true,
    rounding: 3,
    driverLabel: SecurityMetricOptions[1].label,
    backendTargetQuoteAttr: 'bestPriceQuote'
  }
}

export const FrontendKeyToBackendKeyDictionary = {
  // definitions
  'SECURITY_TYPE': 'SecurityType',
  'SECURITY_SUB_TYPE': 'SecuritySubType',
  'RATING': 'RatingNoNotch',
  'CURRENCY': 'Ccy',
  'TENOR': 'Tenor',
  'IS_ONTHERUN': 'IsOnTheRun',
  'RATING_BUCKET': 'RatingBucket',
  'BAIL_IN_STATUS': 'BailInStatus',
  'COUPON_TYPE': 'CouponType',
  'INDUSTRY': 'Industry',
  'IS_NEWISSUE': 'IsNewIssue',
  'ISSUER': 'Issuer',
  'MATURITY': 'MaturityType',
  'SECTOR': 'Sector',
  'SENIORITY': 'Seniority',
  'SUB_INDUSTRY': 'SubIndustry',
  'BACKEND_TENOR': 'BackendTenor',
  'TICKER': 'Ticker',
  'COUNTRY': 'Country',
  'QUOTED_TODAY': 'QuotedToday',
  'BICS_LEVEL_1': 'BicsLevel1',
  'BICS_LEVEL_2': 'BicsLevel2',
  'BICS_LEVEL_3': 'BicsLevel3',
  'BICS_LEVEL_4': 'BicsLevel4',
  'BICS_LEVEL_5': 'BicsLevel5',
  'BICS_LEVEL_6': 'BicsLevel6',
  'BICS_LEVEL_7': 'BicsLevel7',
  'BICS_CONSOLIDATED': 'BicsCode',
  'PORTFOLIO': 'PortfolioShortName',

  // metrics
  'SPREAD': 'oasSpread',
  'PRICE': 'price',
  'YIELD': 'yieldWorst',
  'SIZE': 'marketValue'
};

export const BackendKeyToDisplayLabelDictionary = {
  'SecurityType': 'Security Type',
  'RatingNoNotch': 'Rating',
  'Ccy': 'Currency',
  'Tenor': 'Tenor',
  'IsOnTheRun': 'Is On The Run',
  'RatingBucket': 'Rating Bucket',
  'BailInStatus': 'Bail In Status',
  'CouponType': 'Coupon Type',
  'Industry': 'Industry',
  'IsNewIssue': 'Is New Issue',
  'Issuer': 'Issuer',
  'MaturityType': 'Maturity Type',
  'Sector': 'Sector',
  'Seniority': 'Seniority',
  'SubIndustry': 'Sub Industry',
  'BackendTenor': 'Backend Tenor',
  'Ticker': 'Ticker',
  'Country': 'Country',
  'QuotedToday': 'Quoted Today',
  'BicsLevel1': 'BICS Lv.1',
  'BicsLevel2': 'BICS Lv.2',
  'BicsLevel3': 'BICS Lv.3',
  'BicsLevel4': 'BICS Lv.4',
  'BicsLevel5': 'BICS Lv.5',
  'BicsLevel6': 'BICS Lv.6',
  'BicsLevel7': 'BICS Lv.7',
  'BicsCode': 'BicsCode'
}

export const MIN_OBLIGOR_CURVE_VALUES = 2;

export const EngagementActionList = {
  sendEmail: 'Send Email',
  selectPreset: 'Select Preset',
  switchDriver: 'Switch Driver',
  applyFilter: 'Apply Filter',
  applyKeywordSearch: 'Apply Keyword Search',
  selectSecurityForAnalysis: 'Select Security For Analysis',
  bloombergRedict: 'Bloomberg Redirect',
  clickGroupByOption: 'Click Group By Option',
  changeTimeScope: 'Change Time Scope',
  changeDriver: 'Change Driver',
  thumbdownSecurity: 'Thumbdown Security',
  populateGraph: 'Populate Graph',
  midnightReload: 'Midnight Reload',
  sendToAlertConfig: 'Send To Alert Config',
  globalAlertToggledHide: 'Global Alert Toggled Hide',
  globalAlertClearedAll: 'Global Alert Clear All',
  globalAlertClearedSingle: 'Global Alert Cleared Single',
  globalAlertInteractedAlert: 'Global Alert Interacted Alert',
  tradeAlertOpenConfiguration: 'Trade Alert Open/Close Configuration',
  tradeAlertConfigure: 'Trade Alert Configure',
  tradeAlertAddSingleSecurity: 'Trade Alert Add Single Security',
  tradeAlertClickedTab: 'Trade Alert Click Tab',
  santaTableAllQuotesDisplayTradeHistory: 'Switch To Display Trade History',
  santaTableAllQuotesDisplayQuotes: 'Switch To Display Quotes',
  santaTableAllQuotesDisplayTrace: 'Switch To Display Trace Data',
  portfolioStructureSetView: 'Portfolio Breakdown Category View Set'
}

export enum AlertTypes {
  axeAlert = 'Axe',
  markAlert = 'Mark',
  tradeAlert = 'Trade',
  traceAlert = 'TraceTrade',
  system = 'System'
}

export enum AlertSubTypes {
  bid = 'Bid',
  ask = 'Ask',
  both = 'Both',
  liquidation = 'Liquidation',
  quantityChange = 'QuantityChange',
  ratingChange = 'RatingChange',
  buy = 'Buy',
  sell = 'Sell',
  mid = 'Mid',
  default = ''
}

export const ALERT_COUNTDOWN = 5000;
export const ALERT_PRESENT_LIST_SIZE_CAP = 20;
export const ALERT_TOTALSIZE_MAX_DISPLAY_THRESHOLD = 99;
export const ALERT_STATUS_SORTINGVALUE_UNIT = 315360000;  // 10 years in seconds
export const TRACE_VOLUME_REPORTED_THRESHOLD = 1000000;

export const QUANT_COMPARER_PERCENTILE = 90;
export const KEYWORDSEARCH_DEBOUNCE_TIME = 500;

export enum GlobalWorkflowTypes {
  genericType = 'Generic',
  launchTradeToSeeBonds = 'Launch Trade To See Bonds',
  routeHandlerPlaceholder = 'Placeholder for Route Handler',
  changedStructureUtilityConfig = 'Changed Structure Utility Config',
  unselectPreset = 'Unselect Trade Preset'
}

export const GLOBAL_WORKFLOW_STATE_ID_KEY = 'stateId';
