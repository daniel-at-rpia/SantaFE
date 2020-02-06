

export interface BESecurityGroupDTO {
  source: string;
  date: string;
  metricsType: string;
  groupIdentifier: {
    source: string;
    date: string;
    groupOptionValues: {
      [property: string]: Array<string>;
    };
    filters: any;
    singleSecurityTenorOptions: Array<string>;
    weightField: string;
    metricContextFieldMinMax?: any;
  }
  numSecurities: number;
  name: string;
  ccy: string;
  securityType: string;
  couponType: string;
  type: string;
  metrics: BEGroupMetricDTO,
  deltaMetrics: {
    Dod: BEGroupMetricDTO,
    Wow?: BEGroupMetricDTO,
    Mtd?: BEGroupMetricDTO,
    Mom?: BEGroupMetricDTO,
    Ytd?: BEGroupMetricDTO,
    Yoy?: BEGroupMetricDTO
  }
}

interface BEGroupMetricDTO {
  tenor: string;
  backendTenor: string;
  propertyToNumSecurities: {
    WorkoutTerm: number;
    BackendWorkoutTerm?: number;
    AmtOutstanding?: number;
    RatingDouble?: number;
    Spread?: number;
    ZSpread?: number;
    AswUsd: number;
    GSpread?: number;
    CitiSpread?: number;
    ModelSpread?: number;
    OasSpread?: number;
    Price?: number;
    YieldMaturity?: number;
    YieldWorst?: number;
    ModelPrice?: number;
    MarketValue?: number;
  }
  isDelta?: boolean;
  workoutTerm?: number;
  backendWorkoutTerm?: number;
  marketValue?: number;
  amtOutstanding?: number;
  spread?: number;
  zSpread?: number;
  aswUsd?: number;
  gSpread?: number;
  citiSpread?: number;
  modelSpread?: number;
  oasSpread?: number;
  price?: number;
  modelPrice?: number;
  yieldMaturity?: number;
  yieldWorst?: number;
  isRated?: boolean;
  rating?: string;
  ratingNoNotch?: string;
  ratingDouble?: number;
  ratingBucket?: string;
}

export interface BESecurityDTO {
  globalIdentifier: string;  // CUSIP, i.e US02376RAC60
  securityIdentifier: string;
  name: string;
  baseType: string;
  securityType: string;
  securitySubType: string;
  couponType?: string;
  ccy: string;
  country: string;
  sector: string;
  seniority: string;
  industry: string;
  subIndustry: string;
  issuer: string;
  obligorName: string;
  obligorId: number;
  ticker: string;
  maturityType: string;
  maturityDate: string;
  isGovt: boolean;
  isBailIn: boolean;
  isCallable: boolean;
  isPerpetual: boolean;
  metrics: BESecurityMetricDTO;
  deltaMetrics: {
    Dod: BESecurityDeltaMetricDTO;
    Wow: BESecurityDeltaMetricDTO;
    Mom: BESecurityDeltaMetricDTO;
    Mtd: BESecurityDeltaMetricDTO;
    Ytd: BESecurityDeltaMetricDTO;
    Yoy: BESecurityDeltaMetricDTO;
  };
  issueDate: string;
  isValidForCreditGrouping: boolean;
  paymentRank: string;
  isSingleSecurity?: boolean;
  isCurveSecurity?: boolean;
  isBond?: boolean;
  isLoan?: boolean;
  isPreferred?: boolean;
  isCds?: boolean;
}

interface BESecurityMetricDTO {
  isFixedForLife: boolean;
  isFixedToFloatInFixed: boolean;
  isFloat: boolean;
  isNewIssue: boolean,
  isOnTheRun: boolean,
  benchmarkId: number,
  benchmarkName: string,
  underlyingSecurityId: number,
  workoutTerm: number,
  ratingDouble: number,
  price: number,
  backendWorkoutTerm?: number,
  oasSpread: number,
  zSpread: number,
  aswUsd: number,
  gSpread: number,
  yieldWorst: number,
  amtOutstanding: number,
  marketValue: number,
  rating: string,
  ratingNoNotch: string,
  ratingBucket: string
  isRated: boolean;
}

export interface BESecurityDeltaMetricDTO {
  workoutTerm?: number;
  ratingDouble: number;
  price: number;
  backendWorkoutTerm?: number;
  oasSpread: number;
  zSpread: number;
  aswUsd: number;
  gSpread: number;
  yieldWorst: number;
  amtOutstanding?: number;
  marketValue?: number;
  rating?: number;
}

export interface BEPortfolioDTO {
  marketValueCad: number;
  marketValueLocal: number;
  portfolioShortName: string;
  quantity: number;
  security: BESecurityDTO;
  strategyName: string;
  primaryPmName: string;
  backupPmName: string;
  researchName: string;
  cs01Local: number;
  cs01Cad: number;
  mark: {
    driver: string;
    enteredTime: string;
    user: string;
    value: number;
  }
  [property: string]: any;
}

export interface BEBestQuoteDTO {
  bestDiscountQuote: BESingleBestQuoteDTO;
  bestSpreadQuote: BESingleBestQuoteDTO;
  bestPriceQuote: BESingleBestQuoteDTO;
  bestYieldQuote: BESingleBestQuoteDTO;
}

export interface BESingleBestQuoteDTO {
  isValid: boolean;
  quoteMetric: number
  bidType: number;
  askType: number;
  bidDealer: string;
  askDealer: string;
  bidQuantity: number;
  askQuantity: number;
  bidQuoteValue: number;
  askQuoteValue: number;
  bidTime: number;
  askTime: string;
  bidVenue: string;
  askVenue: string;
  axeSkew: number;
  totalSkew: number;
}

export interface BEQuoteDTO {
  dealer: string; // JEFF,
  quoteType: string; //Run,
  isActive: boolean; // true,
  identifier: string;  // 28643
  name: string;  // AAL 5 06/01/22
  benchmarkName: string;
  time: string; // 2019-11-22T13:32:40,
  globalIdentifier: string;  // CUSIP, i.e US02376RAC60
  bidQuoteId: string; // "77d78117-5f89-41ab-a697-8f1475eb8006"
  bidQuoteStatus: number; // 0, -1, -2
  bidTime: string; // "2020-02-03T10:12:17-05:00"
  bidVenue: string; // MSG1,
  bidYieldType: number; // null,
  bidYield: number; // null,
  bidSpread: number; // null,
  bidPrice: number; // 97.2099990844726,
  bidQuantity: number; // null,
  bidIsNatural: boolean; // false,
  bidQualifier: string; // null,
  askQuoteId: string;
  askQuoteStatus: number;  // 0, -1, -2
  askTime: string;
  askVenue: string; // null,
  askYieldType: number; // null,
  askYield: number; // null,
  askSpread: number; // null,
  askPrice: number; // null,
  askQuantity: number; // null,
  askIsNatural: boolean; // null,
  askQualifier: string; // null
}

export interface BEHistoricalSummaryOverviewDTO {
  Yoy?: BEHistoricalSummaryDTO;
  Ytd?: BEHistoricalSummaryDTO;
  Mom?: BEHistoricalSummaryDTO;
  Mtd?: BEHistoricalSummaryDTO;
  GroupIdentifierWithInclusiveOptions: {
    groupOptionValues: object;
    [property: string]: any;
  };
}

export interface BEHistoricalSummaryDTO {
  BaseSecurity: BEHistoricalInfoDTO;
  Group: BEHistoricalInfoDTO;
  Top: Array<BEHistoricalInfoDTO>;
  Bottom: Array<BEHistoricalInfoDTO>;
}

interface BEHistoricalInfoDTO {
  databaseSource: string;
  startDate: string;
  endDate: string;
  metricName: string;
  historicalLevel: BEHistoricalQuantBlock;
  historicalBasis?: BEHistoricalQuantBlock;
  security?: BESecurityDTO;
  group?: BESecurityGroupDTO;
  rank: number;
  name: string;
  isSecurityHistoricalSummary: boolean;
  isGroupHistoricalSummary: boolean;
}

export interface BEHistoricalQuantBlock {
  targetSecurityIdentifier: string;
  startMetric: number;
  endMetric: number;
  minMetric: number;
  maxMetric: number;
  isLevelRange: boolean;
  isBasisRange: boolean;
  isValid: boolean;
  timeSeries?: object;
}