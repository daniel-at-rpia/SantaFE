
export interface BEFetchAllTradeDataReturn {
  numberOfSecurities: number;
  securityDtos: {
    [property: string]: BEFullSecurityDTO;
  }
}

export interface BEFullSecurityDTO {
  securityIdentifier: string;
  security: BESecurityDTO;
  bestQuotes: BEBestQuoteDTO;
  positions: Array<BEPortfolioDTO>;
}

export interface BEPortfolioDTO {
  date: string;
  securityIdentifier: string;
  partitionOptionValue: {
    AccountName: string;
    AttributionOwner: string;
    PortfolioShortName: string;
    StrategyName: string;
  }
  quantity: number;
  cs01Local: number;
  cs01Cad: number;
}

export interface BESecurityDTO {
  globalIdentifier: string;  // CUSIP; i.e US02376RAC60
  securityIdentifier: string;
  name: string;
  securityType: string;
  securitySubType: string;
  couponType?: string;
  ccy: string;
  country: string;
  sector: string;
  genericSeniority: string;
  maturityType?: string;
  industry: string;
  subIndustry: string;
  obligorName: string;
  obligorId: number;
  ticker: string;
  isSovereign?: boolean;
  isGovt?: boolean;
  isEm?: boolean;
  metrics: BESecurityMetricDTO;
  deltaMetrics: {
    Dod: BESecurityDeltaMetricDTO;
    Wow: BESecurityDeltaMetricDTO;
    Mom: BESecurityDeltaMetricDTO;
    Mtd: BESecurityDeltaMetricDTO;
    Ytd: BESecurityDeltaMetricDTO;
    Yoy: BESecurityDeltaMetricDTO;
  };
  paymentRank: string;
  isSingleSecurity?: boolean;
  isCurveSecurity?: boolean;
  isBond?: boolean;
  isLoan?: boolean;
  isPreferred?: boolean;
  isCds?: boolean;
  firmPosition?: {
    mark: {
      driver: string;
      enteredTime: string;
      user: string;
      value: number;
    },
    primaryPmName: string;
    backupPmName: string;
    researchName: string;
    owners: Array<string>;
    partitionOptionValues: any;
    date: string;
    securityIdentifier: string;
    quantity: number;
    cs01Local: number;
    cs01Cad: number;
  }
  curveSubType?: string;  // CDS only
}

export interface BEBestQuoteDTO {
  bestSpreadQuote: BESingleBestQuoteDTO;
  bestPriceQuote: BESingleBestQuoteDTO;
  bestYieldQuote: BESingleBestQuoteDTO;
}

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
  metrics: BEGroupMetricDTO;
  deltaMetrics: {
    Dod: BEGroupMetricDTO;
    Wow?: BEGroupMetricDTO;
    Mtd?: BEGroupMetricDTO;
    Mom?: BEGroupMetricDTO;
    Ytd?: BEGroupMetricDTO;
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
  isIndex?: false;
}

interface BESecurityMetricDTO {
  // CDSs don't have a lot of those attributes
  isOnTheRun: boolean;
  workoutTerm: number;
  ratingDouble: number;
  isRated: boolean;
  rating: string;
  ratingNoNotch: string;
  ratingBucket: string
  price: number;
  isIndex: boolean;
  isFixedForLife?: boolean;
  isFixedToFloatInFixed?: boolean;
  isFloat?: boolean;
  isNewIssue?: boolean;
  benchmarkId?: number;
  benchmarkSecurityIdentifier?: string;
  benchmarkName?: string;
  underlyingSecurityId?: number;
  backendWorkoutTerm?: number;
  oasSpread?: number;
  zSpread?: number;
  aswUsd?: number;
  gSpread?: number;
  spread?: number;
  yieldWorst?: number;
  amtOutstanding?: number;
  marketValue?: number;
}

export interface BESecurityDeltaMetricDTO {
  // CDSs don't have a lot of those attributes
  ratingDouble: number;
  price: number;
  zSpread?: number;
  gSpread?: number;
  spread?: number;
  yieldWorst?: number;
  workoutTerm?: number;
  backendWorkoutTerm?: number;
  oasSpread?: number;
  aswUsd?: number;
  amtOutstanding?: number;
  marketValue?: number;
  rating?: number;
}

export interface BESingleBestQuoteDTO {
  isValid: boolean;
  quoteMetric: string;
  bidQuoteType: string;
  askQuoteType: string;
  bidDealer: string;
  askDealer: string;
  bidQuantity: number;
  askQuantity: number;
  totalAxeBidQuantity: number;
  totalAxeAskQuantity: number;
  totalRunBidQuantity: number;
  totalRunAskQuantity: number;
  bidQuoteValue: number;
  askQuoteValue: number;
  bidTime: string;
  askTime: string;
  bidVenue: string;
  askVenue: string;
  axeSkew: number;
  totalSkew: number;
  bidIsOld: boolean;
  askIsOld: boolean;
  isOffTheRunCds: boolean;
  globalIdentifier: string;
}

export interface BEQuoteDTO {
  dealer: string; // JEFF;
  quoteType: string; //Run;
  isActive: boolean; // true;
  identifier: string;  // 28643
  name: string;  // AAL 5 06/01/22
  benchmarkName: string;
  time: string; // 2019-11-22T13:32:40;
  globalIdentifier: string;  // CUSIP; i.e US02376RAC60
  bidQuoteId: string; // "77d78117-5f89-41ab-a697-8f1475eb8006"
  bidQuoteStatus: number; // 0; -1; -2
  bidTime: string; // "2020-02-03T10:12:17-05:00"
  bidVenue: string; // MSG1;
  bidYieldType: number; // null;
  bidYield: number; // null;
  bidSpread: number; // null;
  bidPrice: number; // 97.2099990844726;
  bidQuantity: number; // null;
  bidIsNatural: boolean; // false;
  bidQualifier: string; // null;
  askQuoteId: string;
  askQuoteStatus: number;  // 0; -1; -2
  askTime: string;
  askVenue: string; // null;
  askYieldType: number; // null;
  askYield: number; // null;
  askSpread: number; // null;
  askPrice: number; // null;
  askQuantity: number; // null;
  askIsNatural: boolean; // null;
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

export interface BEObligorCurveDTO {
  [property: string]: BEObligorCurveSecurityMapBlock;
}

interface BEObligorCurveSecurityMapBlock {
  [property: string]: BEFullSecurityDTO;
}