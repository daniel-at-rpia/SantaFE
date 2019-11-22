

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
  groupName: string;
  metrics: BEGroupMetricDTO,
  deltaMetrics: {
    DoD: BEGroupMetricDTO,
    WoW?: BEGroupMetricDTO,
    Mtd?: BEGroupMetricDTO,
    MoM?: BEGroupMetricDTO,
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
  securityIdentifier: {
    securityId: number;
  };
  name: string;
  baseType: string;
  securityType: string;
  securitySubType: string;
  couponType?: string;
  ccy: string;
  sector: string;
  seniority: string;
  industry: string;
  subIndustry: string;
  issuer: string;
  ticker: string;
  maturityType: string;
  isGovt: boolean;
  isBailIn: boolean;
  isCallable: boolean;
  isPerpetual: boolean;
  metrics: BESecurityMetricDTO;
  deltaMetrics: {
    DoD: BESecurityDeltaMetricDTO;
    WoW: BESecurityDeltaMetricDTO;
    MoM: BESecurityDeltaMetricDTO;
    Ytd: BESecurityDeltaMetricDTO;
  };
  issueDate: string;
  isValidForCreditGrouping: boolean;
  paymentRank: string;
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
  workoutTerm: number;
  ratingDouble: number;
  price: number;
  backendWorkoutTerm: number;
  oasSpread: number;
  zSpread: number;
  aswUsd: number;
  gSpread: number;
  yieldWorst: number;
  amtOutstanding: number;
  marketValue: number;
  rating: number;
  ratingNoNotch: string;
  ratingBucket: string;
}

export interface BEPortfolioDTO {
  marketValueCad: number;
  marketValueLocal: number;
  portfolioShortName: string;
  quantity: number;
  santaSecurity: BESecurityDTO;
  [property: string]: any;
}

export interface BEBestQuoteDTO {
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
}

export interface BEQuoteDTO {
  side: number,
  quoteType: number,
  dealer: string,
  time: string,
  isActive: boolean,
  venue: string,
  isNatural: boolean,
  yieldType: string,
  yield: number,
  price: number,
  quantity: number,
  qualifier: string
}