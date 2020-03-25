import {
  SecurityTableMetricStub,
  SecurityMetricOptionStub,
  TriCoreDriverConfigStub
} from 'FEModels/frontend-stub-models.interface';

export const APIUrlMap = {
  getUserInitials: `user/get-user-initials`,
  getSecurityIdMap: `security/get-security-identifiers`,
  getSecurityDTOs: `security/get-securities`,
  getPortfolios: `group/get-security-dtos-from-group-identifier`,
  getAllQuotes: `liveQuote/get-all-quotes`,
  getObligorCurves: `group/get-security-dtos-from-security-and-group-definition`,
  getGroups: `group/get-groups`,
  getGroupHistoricalSummary: `group/get-group-historical-summary-from-security`,
  getTickers: `Obligor/get-tickers`,
  getSubIndustries: `obligor/get-subindustries`,
  getCountries: 'obligor/get-countries',
  setQuoteStatus: 'liveQuote/set-quote-status',
  getAlertConfigurations: 'Alert/get-alert-configs',
  updateAlertConfiguration: 'Alert/update-alert-configs',
  getAlerts: 'Alert/get-alerts',
  readAlert: 'Alert/set-alerts-to-inactive',
  deleteAlert: 'Alert/delete-alerts',
  logEngagement: 'feLogger/track',
  logError: 'feLogger/log'
};

export const SecurityMetricOptions: Array<SecurityMetricOptionStub> = [
  {
    label: 'Default Spread',
    backendDtoAttrName: 'defaultSpread',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd',
      'Yoy'
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
      'Yoy'
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
      'Yoy'
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
      'Yoy'
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
      'Yoy'
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
      'Yoy'
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
      'Yoy'
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
      'Yoy'
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

export const BackendKeyDictionary = {
  // definitions
  'SECURITY_TYPE': 'SecurityType',
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

  // metrics
  'SPREAD': 'oasSpread',
  'PRICE': 'price',
  'YIELD': 'yieldWorst',
  'SIZE': 'marketValue'
};

export const MIN_OBLIGOR_CURVE_VALUES = 2;

export const EngagementActionList = {
  sendEmail: 'Send Email',
  selectPreset: 'Select Preset',
  switchDriver: 'Switch Driver',
  applyFilter: 'Apply Filter',
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
  tradeAlertPause: 'Trade Alert Pause',
  tradeAlertAddSingleSecurity: 'Trade Alert Add Single Security'
}

export enum AlertTypes {
  axeAlert = 'Axe',
  markAlert = 'Mark'
}

export enum AlertSubTypes {
  bid = 'Bid',
  ask = 'Ask',
  both = 'Both',
  liquidation = 'Liquidation',
  bwic = 'Bwic',
  owic = 'Owic',
  quantityChange = 'QuantityChange',
  ratingChange = 'RatingChange'
}

export const ALERT_COUNTDOWN = 5000;
export const ALERT_PRESENT_LIST_SIZE_CAP = 15;
export const ALERT_TOTALSIZE_MAX_DISPLAY_THRESHOLD = 99;