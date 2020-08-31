import { AlertTypes } from 'Core/constants/coreConstants.constant';
import {AxeAlertType} from "Core/constants/tradeConstants.constant";

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
}

export interface BEPortfolioDTO {
  partitionOptionValues: {
    PortfolioShortName: string;
    StrategyName: string;
  }
  quantity: number;
  cs01Local: number;
  cs01Cad: number;
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
    metrics: {
      [property: string]: {
        [date: string]: {
          backupPmName: string;
          date: string;
          hedgeFactor: number;
          mark: {
            driver: string;
            enteredTime: string;
            price: number;
            spread: number;
            user: string;
            value: number;
          };
          owners: Array<string>;
          partitionOptionValues: {
            PortfolioShortName: Array<string>;
            StrategyName: Array<string>;
          };
          primaryPmName: string;
          researchName: string;
          source: number;
        }
      }
    }
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
  tenor: string;
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
  isOnTheRun: boolean;
  workoutTerm: number;
  ratingDouble: number;
  isRated: boolean;
  rating: string;
  ratingNoNotch: string;
  ratingBucket: string
  price: number;
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
  trades?: Array<BETradeBlock>;
  quote?: BEAlertRegularQuoteBlock|BEAlertMarketListQuoteBlock|BEAlertCDSQuoteBlock;
  marketListAlert?: BEAlertMarketListBlock;
  sendEmail: boolean;
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
  isGreyMarket: boolean
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
  upfrontPoints?: number
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
  isTraded: boolean
}