

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
    isCurveSecurity: boolean;
    isSingleSecurity: boolean;
  };
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
  primaryPmName: string;
  backupPmName: string;
  researchName: string;
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
  axeSkew: number;
  totalSkew: number;
}

export interface BEQuoteDTO {
  quoteType: string; //Run,
  dealer: string; // JEFF,
  time: string; // 2019-11-22T13:32:40,
  isActive: boolean; // true,
  bidVenue: string; // MSG1,
  askVenue: string; // null,
  bidIsNatural: boolean; // false,
  askIsNatural: boolean; // null,
  bidYieldType: number; // null,
  askYieldType: number; // null,
  bidYield: number; // null,
  askYield: number; // null,
  bidTSpread: number; // null,
  askTSpread: number; // null,
  bidPrice: number; // 97.2099990844726,
  askPrice: number; // null,
  bidQuantity: number; // null,
  askQuantity: number; // null,
  bidQualifier: string; // null,
  askQualifier: string; // null
}