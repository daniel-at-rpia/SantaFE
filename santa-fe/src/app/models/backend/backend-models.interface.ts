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