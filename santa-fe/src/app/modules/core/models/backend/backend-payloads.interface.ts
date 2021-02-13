import { AlertTypes, AlertSubTypes } from 'Core/constants/coreConstants.constant';
import { AxeAlertType } from "Core/constants/tradeConstants.constant";
import {
  PortfolioView,
  BEPortfolioTargetMetricValues,
  SubPortfolioFilter,
  DeltaScope
} from 'Core/constants/structureConstants.constants'
import { StructureBucketDataBlock } from 'Core/models/frontend/frontend-blocks.interface';
import {
  BEStructuringOverrideBlockWithSubPortfolios,
  BEStructuringBreakdownMetricBlockWithSubPortfolios
} from './backend-models.interface';

export interface PayloadGetSantaGroups {
  source: string;
  yyyyMMdd?: number;
  groupDefinition: object;
  groupFilters: object;
  tenorOptions?: Array<string>;  // don't provide this means BE can use it's default
}

export interface PayloadGetGroupHistoricalSummary {
  source: string;
  identifier: string;
  groupIdentifier: {
    [property: string]: Array<string>;
  };
  tenorOptions?: Array<string>;  // don't provide this means BE can use it's default
  deltaTypes: Array<string>;
  metricName: string;
  count: number;
}

export interface PayloadGetTradeFullData {
  maxNumberOfSecurities?: number;  // when this is not passed, then there is no cap to the NumberOfSecurities, it always return
  groupIdentifier: object;
  groupFilters: {
    PortfolioShortName?: Array<string>;
    SecurityIdentifier?: Array<string>;
  };
  lookbackHrs?: number;
}

export interface PayloadGetBestQuotes {
  lookbackHrs?: number,
  identifiers: Array<string>
}

export interface PayloadGetAllQuotes {
  identifier: string;
}

export interface PayloadObligorSecurityIDs {
  identifier: string,
  groupDefinition: any;
  groupFilters: any;
  lookbackHrs?: number
}

export interface PayloadSetQuoteStatus {
  identifier: string;
  quoteType: string;  // 'Axe', 'Run'
  dealer: string;  // 'JPM'
  side: string;  // 'Bid', 'Ask'
  quoteStatus: string;  // 'Good', 'Bad', 'Garbage'
}

export interface PayloadLogEngagement {
  type: string;
  security: string;
  elementId: string;
  user: string;
}

export interface PayloadGetSecurities {
  identifiers: Array<string>
}

export interface PayloadUpdateAlertConfig {
  alertConfigs: Array<PayloadUpdateSingleAlertConfig>;
}

export interface PayloadUpdateSingleAlertConfig {
  alertConfigID?: string;
  type: AlertTypes;
  subType: AlertSubTypes;
  groupFilters: {
    Owner?: Array<string>;
    SecurityIdentifier?: Array<string>;
    PrimaryPmName?: Array<string>;
    ResearchName?: Array<string>;
  };
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
  isEnabled?: boolean;
  isDeleted?: boolean;
  isUrgent?: boolean;
  sendEmail: boolean;
}

export interface PayloadSetAlertsToInactive {
  alertIds: Array<string>;
}

export interface PayloadGetPortfolioStructures {
  yyyyMMdd?: number;
  deltaTypes?: Array<DeltaScope>;
}

export interface PayloadUpdatePortfolioStructuresTargets {
  portfolioTarget: {
    date?: string,
    portfolioId: number,
    target: {
      [subPortfolio in SubPortfolioFilter]?: {
        [metric in BEPortfolioTargetMetricValues]?: number;
      }
    }
  },
  shouldAutoScale: boolean
}

export interface PayloadUpdateBreakdown {
  portfolioBreakdown: {
    date: string;
    groupOption: string;
    portfolioId: number;
    breakdown: {
      [property: string]: BEStructuringBreakdownMetricBlockWithSubPortfolios;
    }
  };
}

export interface PayloadUpdateOverride {
  portfolioOverride: BEStructuringOverrideBlockWithSubPortfolios;
}

export interface PayloadDeleteOverride {
  portfolioOverride: BEStructuringOverrideBlockWithSubPortfolios;
}

export interface PayloadGetPortfolioOverride {
  portfolioOverride: BEStructuringOverrideBlockWithSubPortfolios;
}

export interface PayloadSetView {
  buckets: Array<StructureBucketDataBlock>;
  views: Array<PortfolioView>;
}

export interface PayloadGetAllTraceTrades {
  identifiers: Array<string>;
}

export interface PayloadClearPortfolioBreakdown {
  portfolioBreakdown: {
    date?: string;
    portfolioId: number;
    groupOption: string;
  }
  groupOptionValue?: string;
}

export interface PayloadUpdatePortfolioOverridesForAllPortfolios {
  portfolioOverride: {
    date?: string;
    simpleBucket: StructureBucketDataBlock;
    title: string;
  }
}