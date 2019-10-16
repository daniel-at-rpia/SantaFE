export interface BESecurityDTO {
  securitySubType: string;
  paymentRank: string;
  couponType: string;
  isBailIn: boolean;
  isGovt: boolean;
  securityIdentifier: {
    securityId: string;
  }
  isValidForCreditGrouping: boolean;
  issuer: string;
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  subIndustry: string;
  seniority: string;
  ccy: string;
  mostRecentDeltaMetrics: object;
}

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
    tenorOptions: Array<string>
  }
  numSecurities: number;
  groupName: string;
  metrics: BEMetricDTO,
  deltaMetrics: {
    DoD: BEMetricDTO,
    WoW?: BEMetricDTO,
    Mtd?: BEMetricDTO,
    MoM?: BEMetricDTO,
    Ytd?: BEMetricDTO
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

interface BEMetricDTO {
  tenor: string;
  propertyToNumSecurities: {
    WorkoutTerm: number;
    AmtOutstanding: number;
    RatingDouble: number;
    OasSpread?: number;
    Price: number;
    YieldMaturity?: number;
    YieldWorst?: number;
  }
  workoutTerm: number;
  amtOutstanding: number;
  oasSpread: number;
  price: number;
  yieldMaturity: number;
  yieldWorst: number;
  rating: string;
  ratingNoNotch: string;
}