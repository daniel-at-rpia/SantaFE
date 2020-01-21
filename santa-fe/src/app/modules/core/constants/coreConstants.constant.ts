import {
  SecurityTableMetricStub,
  SecurityMetricOptionStub,
  TriCoreMetricConfigStub
} from 'FEModels/frontend-stub-models.interface';

export const APIUrlMap = {
  getUserInitials: `user/get-user-initials`,
  getPortfolios: `portfolio/get-credit-positions`,
  getBestQuotes: `liveQuote/get-best-quotes`,
  getAllQuotes: `liveQuote/get-all-quotes`,
  getObligorCurves: `curve/get-obligor-curves-per-ccy`,
  getGroups: `group/get-groups`,
  getGroupHistoricalSummary: `group/get-group-historical-summary-from-security`,
  getTickers: `Obligor/get-tickers`,
  getSubIndustries: `obligor/get-subindustries`
};

export const SecurityMetricOptions: Array<SecurityMetricOptionStub> = [
  {
    label: 'Default Spread',
    backendDtoAttrName: 'defaultSpread',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd'
    ]
  },
  {
    label: 'Price',
    backendDtoAttrName: 'price',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd'
    ]
  },
  {
    label: 'Rating',
    backendDtoAttrName: 'ratingDouble',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd'
    ]
  },
  {
    label: 'G Spread',
    backendDtoAttrName: 'gSpread',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd'
    ]
  },
  {
    label: 'OAS Spread',
    backendDtoAttrName: 'oasSpread',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd'
    ]
  },
  {
    label: 'Z-Spread',
    backendDtoAttrName: 'zSpread',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd'
    ]
  },
  {
    label: 'YieldWorst',
    backendDtoAttrName: 'yieldWorst',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd'
    ]
  },
  {
    label: 'Asset Swap Spread (into USD)',
    backendDtoAttrName: 'aswUsd',
    deltaOptions: [
      'Dod',
      'Wow',
      'Mom',
      'Ytd'
    ]
  }
];

export const DEFAULT_METRIC_IDENTIFIER = 'DEFAULT';
export const TriCoreMetricConfig: TriCoreMetricConfigStub = {
  Spread: {
    label: 'Spread',
    tier2Threshold: 20,
    inversed: false,
    rounding: 0,
    metricLabel: SecurityMetricOptions[0].label,
    backendTargetQuoteAttr: 'bestSpreadQuote'
  },
  Yield: {
    label: 'Yield',
    tier2Threshold: 1,
    inversed: false,
    rounding: 3,
    metricLabel: SecurityMetricOptions[6].label,
    backendTargetQuoteAttr: 'bestYieldQuote'
  },
  Price: {
    label: 'Price',
    tier2Threshold: 3,
    inversed: true,
    rounding: 3,
    metricLabel: SecurityMetricOptions[1].label,
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


  // metrics
  'SPREAD': 'oasSpread',
  'PRICE': 'price',
  'YIELD': 'yieldWorst',
  'SIZE': 'marketValue'
};

export const MIN_OBLIGOR_CURVE_VALUES = 2;