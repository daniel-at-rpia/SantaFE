

export interface BESecurityGroupDTO {
  source: string;
  date: string;
  metricsType: string;
  groupIdentifier: {
    groupOptionValues: {
      SecurityType: string;
      Ccy: string;
      Tenor: string;
    };
    tenorOptions: Array<string>;
    weightField: string;
  }
  numSecurities: number;
  name: string;
  metrics: BEGroupMetricDTO,
  deltaMetrics: {
    Dod: BEGroupMetricDTO,
    Wow?: BEGroupMetricDTO,
    Mtd?: BEGroupMetricDTO,
    Mom?: BEGroupMetricDTO,
    Ytd?: BEGroupMetricDTO
  },
  descriptiveMetrics: {
    SecurityType: any;
    BailInStatus: any;
    Ccy: any;
    CouponType: any;
    Industry: any;
    Issuer: any;
    RatingNoNotch: any;
    RatingBucket: any;
    Sector: any;
    Seniority: any;
    SubIndustry: any;
    Tenor: any;
  }
}

interface BEGroupMetricDTO {
  tenor: string;
  propertyToNumSecurities: {
    WorkoutTerm: number;
    AmtOutstanding?: number;
    RatingDouble?: number;
    Spread?: number;
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
  workoutTerm: number;
  marketValue?: number;
  amtOutstanding?: number;
  spread?: number;
  citiSpread?: number;
  modelSpread?: number;
  oasSpread?: number;
  price?: number;
  modelPrice?: number;
  yieldMaturity?: number;
  yieldWorst?: number;
  rating?: string;
  ratingNoNotch?: string;
  ratingDouble?: number;
}

export interface BESecurityDTO {
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
  backendWorkoutTerm: number,
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
  quoteType: string; //Run,
  dealer: string; // JEFF,
  time: string; // 2019-11-22T13:32:40,
  isActive: boolean; // true,
  benchmarkName: string;
  bidVenue: string; // MSG1,
  askVenue: string; // null,
  bidIsNatural: boolean; // false,
  askIsNatural: boolean; // null,
  bidYieldType: number; // null,
  askYieldType: number; // null,
  bidYield: number; // null,
  askYield: number; // null,
  bidSpread: number; // null,
  askSpread: number; // null,
  bidPrice: number; // 97.2099990844726,
  askPrice: number; // null,
  bidQuantity: number; // null,
  askQuantity: number; // null,
  bidQualifier: string; // null,
  askQualifier: string; // null
}

export interface BEHistoricalSummaryOverviewDTO {
  Yoy?: BEHistoricalSummaryDTO;
  Mom?: BEHistoricalSummaryDTO;
}

interface BEHistoricalSummaryDTO {
  BaseSecurity: BEHistoricalInfoDTO;
  Group: BEHistoricalInfoDTO;
  Top: {
    [property: string]: BEHistoricalInfoDTO;
  };
  Bottom: {
    [property: string]: BEHistoricalInfoDTO;
  }
}

interface BEHistoricalInfoDTO {
  source: string;
  deltaType: string;
  startDate: string;
  endDate: string;
  metricName: string;
  historicalLevel: BEHistoricalQuantBlock;
  historicalBasis?: BEHistoricalQuantBlock;
  security?: BESecurityDTO;
  groupIdentifier?: any;
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
  minDateTime: string;
  maxMetric: number;
  maxDateTime: string;
  isLevelRange: boolean;
  isBasisRange: boolean;
}