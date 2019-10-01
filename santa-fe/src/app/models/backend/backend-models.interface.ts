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
  date: string;
  source: string;
  metricsType: string;
  groupIdentifier: {
    securityType: string;
    ccy: string;
    tenor: string;
  }
  mostRecentTimeSeriesDate: string;
  numOfSecurities: number;
  metrics: BEMetricDTO,
  mostRecentDeltaMetrics: {
    DoD: BEMetricDTO;
    WoW: BEMetricDTO;
    Mtd: BEMetricDTO;
    MoM: BEMetricDTO;
    Ytd: BEMetricDTO;
  }
}

interface BEMetricDTO {
  //fieldToSecurityIdentifiers: {
    //amtOutstanding: Array<number>;
    //ratingDouble: Array<number>;
  //}
  numOfSecurities: number;
  workoutTerm: number;
  amtOutstanding: number;
  ratingDouble: number;
  oasSpread: number;
  price: number;
  yieldMaturity: number;
  yieldWorst: number;
}