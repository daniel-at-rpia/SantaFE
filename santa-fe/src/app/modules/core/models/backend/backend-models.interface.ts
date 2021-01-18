import { AlertTypes } from 'Core/constants/coreConstants.constant';
import {AxeAlertType} from "Core/constants/tradeConstants.constant";
import { PortfolioShortNames } from 'Core/constants/structureConstants.constants';
import { TraceTradeParty } from '../../constants/securityTableConstants.constant';
export interface BEFetchAllTradeDataReturn {
  numberOfSecurities: number;
  securityDtos: BEFullSecurityCollection;
}

export interface BEFullSecurityCollection {
  groupIdentifier: {
    source: string;
    date: string;
    groupOptionValues: {
      "SecurityType"?: Array<string>;
      "CouponType"?: Array<string>;
      "Ccy"?: Array<string>;
      "Seniority"?: Array<string>;
      [property: string]: Array<string>;
    };
    groupFilters: {
      [property: string]: Array<string>;
    };
  };
  securityDtos: {
    [property: string]: BEFullSecurityDTO;
  }
}

export interface BEFullSecurityDTO {
  securityIdentifier: string;
  security: BESecurityDTO;
  bestQuotes: BEBestQuoteDTO;
  positions: Array<BEPortfolioDTO>;
  lastTraceSpread: number;
  lastTracePrice: number;
  lastTraceVolumeEstimated: number;
  lastTraceVolumeReported: number;
}

export interface BEPortfolioDTO {
  source: string;
  partitionOptionValues: {
    PortfolioShortName: string;
    StrategyName: string;
  }
  quantity: number;
  cs01Local: number;
  cs01Cad: number;
  cs01CadWeightFund: number;
  bondEquivalentValueCad: number;
  bondEquivalentValueCadWeightFund: number;
  trades: Array<BETradeBlock>;
}

export interface BESecurityDTO {
  globalIdentifier: string;  // CUSIP; i.e US02376RAC60
  securityIdentifier: string;
  name: string;
  securityType: string;
  securitySubType: string;
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
  metrics: {
    Default: BESecurityMetricDTO;
    Index?: BESecurityMetricDTO;
    FO?: BESecurityMetricDTO;
    FTSE?: BESecurityMetricDTO;
    BB?: BESecurityMetricDTO;
  };
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
  unitPosition?: {
    mark: {
      driver: string;
      enteredTime: string;
      user: string;
      value: number;
      price: number;
      spread: number;
      yield: number;
    },
    primaryPmName: string;
    backupPmName: string;
    researchName: string;
    owners: Array<string>;
    partitionOptionValues: {
      PortfolioShortName: Array<string>;
      StrategyName: Array<string>;
    };
    date?: string;
    securityIdentifier: string;
    quantity?: number;
    cs01Local?: number;
    cs01Cad?: number;
    hedgeFactor: number;
    strategies: Array<string>;
    strategyAsOfDate: string;
  }
  curveSubType?: string;  // CDS only
  bicsCode: string;
  bicsLevel1: string;
  bicsLevel2: string;
  bicsLevel3: string;
  bicsLevel4: string;
}

export interface BEBestQuoteDTO {
  bestSpreadQuote: BESingleBestQuoteDTO;
  bestPriceQuote: BESingleBestQuoteDTO;
  bestYieldQuote: BESingleBestQuoteDTO;
}

export interface BESecurityGroupDTO {
  source: string;
  date: string;
  isValid: boolean;
  groupIdentifier: {
    source: string;
    date: string;
    groupOptionValues: {
      [property: string]: Array<string>;
    };
    groupFilters: any;
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
    Dod?: BEGroupMetricDTO;
    Wow?: BEGroupMetricDTO;
    Mtd?: BEGroupMetricDTO;
    Mom?: BEGroupMetricDTO;
    Ytd?: BEGroupMetricDTO;
    Yoy?: BEGroupMetricDTO
  }
}

interface BEGroupMetricDTO {
  tenor?: string;
  backendTenor?: string;
  propertyToNumSecurities: {
    WorkoutTerm: number;
    BackendWorkoutTerm?: number;
    AmtOutstanding?: number;
    RatingDouble?: number;
    Spread?: number;
    ZSpread?: number;
    AswUsd?: number;
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
  workoutTerm: number;
  ratingDouble: number;
  isRated: boolean;
  rating: string;
  ratingNoNotch: string;
  ratingBucket: string
  price: number;
  isOnTheRun?: boolean;
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
  tenor?: string;
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
  quoteMetric: string;
  bidQuoteType: string;
  askQuoteType: string;
  bidDealer: string;
  bidAxeDealer: string;
  askDealer: string;
  askAxeDealer: string;
  totalActiveAxeBidQuantity: number;
  totalActiveAxeAskQuantity: number;
  totalActiveBidQuantity: number;
  totalActiveAskQuantity: number;
  bidQuoteValue: number;
  bidAxeQuoteValue: number;
  askQuoteValue: number;
  askAxeQuoteValue: number;
  bidTime: string;
  bidAxeTime: string;
  askTime: string;
  askAxeTime: string;
  axeSkew: number;
  totalSkew: number;
  bidIsOld: boolean;
  bidAxeIsOld: boolean;
  askIsOld: boolean;
  askAxeIsOld: boolean;
  isOffTheRunCds: boolean;
  globalIdentifier: string;
  bestBidQuoteCondition: string;
  bestAskQuoteCondition: string;
}

export interface BEQuoteDTO {
  dealer: string; // JEFF;
  quoteType: string; //Run;
  identifier: string;  // 28643
  name: string;  // AAL 5 06/01/22
  benchmarkName: string;
  time: string; // 2019-11-22T13:32:40;
  globalIdentifier: string;  // CUSIP; i.e US02376RAC60
  bidQuoteId: string; // "77d78117-5f89-41ab-a697-8f1475eb8006"
  bidQuoteStatus: number; // 0; -1; -2
  bidTime: string; // "2020-02-03T10:12:17-05:00"
  bidVenues: Array<string>; // MSG1;
  bidYieldType: number; // null;
  bidYield: number; // null;
  bidSpread: number; // null;
  bidPrice: number; // 97.2099990844726;
  bidQuantity: number; // null;
  bidIsNatural: boolean; // false;
  bidQualifier: string; // null;
  bidQuoteCondition: string;  // 'A'
  askQuoteId: string;
  askQuoteStatus: number;  // 0; -1; -2
  askTime: string;
  askVenues: Array<string>; // null;
  askYieldType: number; // null;
  askYield: number; // null;
  askSpread: number; // null;
  askPrice: number; // null;
  askQuantity: number; // null;
  askIsNatural: boolean; // null;
  askQualifier: string; // null
  askQuoteCondition: string;  // 'A'
}

export interface BEHistoricalSummaryOverviewDTO {
  Yoy?: BEHistoricalSummaryDTO;
  Ytd?: BEHistoricalSummaryDTO;
  Mom?: BEHistoricalSummaryDTO;
  Mtd?: BEHistoricalSummaryDTO;
  GroupIdentifierWithInclusiveOptions: {
    source: string;
    date: string;
    groupOptionValues: object;
    groupFilters: object;
  };
}

export interface BEHistoricalSummaryDTO {
  BaseSecurity: BEHistoricalInfoDTO;
  Group: BEHistoricalInfoDTO;
  Top: Array<BEHistoricalInfoDTO>;
  Bottom: Array<BEHistoricalInfoDTO>;
}

interface BEHistoricalInfoDTO {
  sourceInDb?: string;
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

export interface BEAlertConfigurationReturn {
  Axe?: {
    [property: string]: BEAlertConfigurationDTO;
  };
  Mark?: {
    [property: string]: BEAlertConfigurationDTO;
  };
}

export interface BEAlertConfigurationDTO {
  groupFilters: {
    SecurityIdentifier?: Array<string>;
    Owner?: Array<string>;
    PrimaryPmName?: Array<string>;
    ResearchName?: Array<string>;
    [property: string]: any;
  };
  alertConfigID: string;
  title: string;
  userName: string;
  type: string;
  subType: string;
  parameters?: {
    LoseMoneyPriceThreshold?: number;
    MakeMoneyPriceThreshold?: number;
    LoseMoneySpreadThreshold?: number;
    MakeMoneySpreadThreshold?: number;
    WatchType?: AxeAlertType;
    UpperPriceThreshold?: number;
    UpperSpreadThreshold?: number;
    LowerPriceThreshold?: number;
    LowerSpreadThreshold?: number;
  };
  isEnabled: boolean;
  isUrgent: boolean;
  sendEmail: boolean;
}

export interface BEAlertDTO {
  alertId: string;
  alertConfigId: string;
  timeStamp: string;
  type: string;
  subType: string;
  keyWord: string;
  message: string;
  isActive: boolean;  // true if the alert has not been read/deleted in the FE, false otherwise
  isCancelled: boolean;
  isUrgent: boolean;
  isDeleted: boolean;
  isMarketListAlert?: boolean;
  quoteId?: string;
  security?: BESecurityDTO;
  marketListDescription?: string;
  securityIdentifierToQuoteId?: {
    [property: string]: string;
  };
  trades?: Array<BETradeBlock>; // for trade alerts
  quote?: BEAlertRegularQuoteBlock|BEAlertMarketListQuoteBlock|BEAlertCDSQuoteBlock;
  marketListAlert?: BEAlertMarketListBlock;
  sendEmail: boolean;
  trade?: BETraceTradesBlock; // for trace alerts
}

export interface BETradeBlock {
  partitionOptionValue: {
    PortfolioShortName: string;
    StrategyName: string;
  };
  tradeId: string;
  parentTradeId: string;
  quantity: number;
  tradeDateTime: string;
  price: number;
  counterpartyName: string;
  spread: number;
  quantityAfterTrade: number;
  wgtAvgSpread: number;
  wgtAvgPrice: number;
  trader: string;
  isCancelled: boolean;
  isValid: boolean;
}

interface BEAlertMarketListBlock {
  type: string;
  subType: string;
  keyWord: string;
  message: string;
  validUntilTime: string;
  marketListType: string;
  marketListDescription: string;
  securityIdentifierToQuoteId: object;
  numUnderlyingSecurities: number;
  alertConfigId: string;
  alertId: string;
  timeStamp: string;
  isUrgent: boolean;
  isActive: boolean;
  isDeleted: boolean;
  isCancelled: boolean;
}

interface BEQuoteBaseBlock {
  quoteID: string,
  eventDate: string,
  creationTime: string,
  lastModifiedTime: string,
  discriminator: string,
  quoteStatus: string,
  venue: string,
  eventTime: string,
  securityID: number,
  globalIdentifierType: string,
  globalIdentifier: string,
  benchmarkSecurityID: number,
  globalBenchmarkIdentifierType: string,
  globalBenchmarkIdentifier: string,
  curveID: string,
  tenor: string,
  securityType: string,
  securityName: string,
  ticker: string,
  issuer: string,
  industrySector: string,
  currency: string,
  actionFlag: string,
  isActive: boolean,
  dealer: string,
  side: string,
  quantity: number,
  price: number,
  yieldType: string,
  yield: number,
  spread: number,
  rate: number,
  type: string,
  stringQuantity: string
}

interface BEAlertRegularQuoteBlock extends BEQuoteBaseBlock {
  class: string,
  msG1MessageID: string,
  messageSequenceNumber: number,
  messageSequenceTimestamp: number,
  priceValidityIndicator: boolean,
  bloombergIdentifier: string,
  bloombergGlobalIdentifier: string,
  benchmarkYellowkey: string,
  isSpreadDerived: boolean,
  isYieldDerived: boolean,
  isPriceDerived: boolean,
  coupon: number,
  maturity: string,
  equityReferencePrice: boolean,
  isGreyMarket: boolean,
  isBenchmarkHedged?: boolean
}
interface BEAlertCDSQuoteBlock extends BEQuoteBaseBlock {
  class: string,
  msG1MessageID: string,
  messageSequenceNumber: number,
  messageSequenceTimestamp: number,
  priceValidityIndicator: boolean,
  bloombergIdentifier: string,
  bloombergGlobalIdentifier: string,
  senoirity: string,
  term: string,
  upfrontPoints?: number,
  isBenchmarkHedged?: boolean
}

export interface BEAlertMarketListQuoteBlock extends BEQuoteBaseBlock {
  partyIds: string,
  partySubIds: string,
  allowAddOns: string,
  allowPartialFill: string,
  inquiryType: string,
  inquiryState: string,
  openTradingLevelMarkup: number,
  partyRank: number,
  settleDate: number,
  sizeIsMaximum: string,
  timersAllowed: string,
  tradingProtocol: string,
  workflowType: string,
  marketListType: string,
  marketListDescription: string,
  fixid: string,
  fixRefID: string,
  validUntilTime: string,
  priceType: string,
  isNatural: string,
  ioiQualifier: string,
  isTraded: boolean,
  isBenchmarkHedged?: boolean
}

export interface BEGetPortfolioStructureServerReturn {
  Now: Array<BEStructuringFundBlock>;
  DoD?: Array<BEStructuringFundBlock>;
  Wow?: Array<BEStructuringFundBlock>;
  Mom?: Array<BEStructuringFundBlock>;
  Ytd?: Array<BEStructuringFundBlock>;
}

export interface BEStructuringFundBlock {
  date: string;
  portfolioId: number;
  portfolioShortName: PortfolioShortNames;
  portfolioNav: number;
  target: {
    portfolioTargetId: string;
    date: string;
    portfolioId: number;
    target: BEStructuringFundMetricTotalBlock;
  }
  currentTotals: BEStructuringFundMetricTotalBlock
  indexId: number;
  indexShortName: string;
  indexNav: number;
  indexTotals: BEStructuringFundMetricTotalBlock;
  breakdowns: {
    BicsCodeLevel1?: BEStructuringBreakdownBlock;
    BicsCodeLevel2?: BEStructuringBreakdownBlock;
    BicsCodeLevel3?: BEStructuringBreakdownBlock;
    BicsCodeLevel4?: BEStructuringBreakdownBlock;
    BicsCodeLevel5?: BEStructuringBreakdownBlock;
    BicsCodeLevel6?: BEStructuringBreakdownBlock;
    BicsCodeLevel7?: BEStructuringBreakdownBlock;
    Ccy?: BEStructuringBreakdownBlock;
    RatingNoNotch?: BEStructuringBreakdownBlock;
    Tenor?: BEStructuringBreakdownBlock;
  }
  overrides?: Array<BEStructuringOverrideBlock>;
  isIndexValid: boolean;
}

interface BEStructuringFundMetricTotalBlock {
  CreditLeverage: number;
  Cs01: number;
  CreditDuration: number;
}

export interface BEStructuringBreakdownBlock {
  date: string;
  groupOption: string;
  indexId: number
  portfolioBreakdownId?: string;
  portfolioId: number;
  breakdown: {
    [property: string]: BEStructuringBreakdownMetricBlock;
  }
}

export interface BEStructuringOverrideBlock {
  portfolioOverrideId?: string;
  date: string;
  portfolioId: number;
  indexId?: number;
  bucket?: {  // this is optional because in some API calls where FE passes this to BE, we just pass with "simple bucket" only and BE will form "bucket" itself
    [property: string]: Array<string>;
  };
  simpleBucket: {
    [property: string]: Array<string>;
  }
  breakdown?: BEStructuringBreakdownMetricBlock;
  title?: string;
}

export interface BEStructuringBreakdownMetricBlock {
  metricBreakdowns: {
    CreditLeverage?: BEStructuringBreakdownMetricSingleEntryBlock;
    Cs01?: BEStructuringBreakdownMetricSingleEntryBlock;
    CreditDuration?: BEStructuringBreakdownMetricSingleEntryBlock;
  },
  view?: string;
  simpleBucket?: {  // exist merely for being compatible with override block in order to make the override-convertted blocks to pass over data more easily
    [property: string]: Array<string>;
  }
  bucket?: {  // exist merely for being compatible with override block in order to make the override-convertted blocks to pass over data more easily
    [property: string]: Array<string>;
  }
}

export interface BEStructuringBreakdownMetricSingleEntryBlock {
  targetLevel?: number;
  targetPct: number;
  currentLevel?: number;
  currentPct?: number;
  indexLevel?: number;
  indexPct?: number;
}

export interface BEBICsCodeBlock {
  item1: string;
  item2: string;
  item3: string;
  item4: string;
  item5: string;
  item6: string;
  item7: string;
}

export interface BEBICsHierarchyBlock {
  [code: string]: BEBICsCodeBlock;
}

export interface BEGetAllTraceTradesBlock {
  [identifier: number]: Array<BETraceTradesBlock>;
}

export interface BETraceTradesBlock {
  actionFlag: string;
  contraParty: TraceTradeParty;
  reportingParty: TraceTradeParty;
  creationTime: string;
  discriminator: string;
  eventDate: string;
  eventTime: string;
  gSpread: number;
  globalIdentifier: string;
  globalIdentifierType: string;
  iSpread: number;
  isAtsTrade: boolean;
  lastModifiedTime: string;
  oasSpread: number;
  parSpread: number;
  price: number;
  publishingTime: string;
  securityID: number;
  sequenceNumber: number;
  settleDate: string;
  side: string;
  spread: number;
  traceTradeID: string;
  tradeTradeRefID: string;
  type: string;
  volumeReported: number;
  volumeEstimated: number;
  yield: number;
}