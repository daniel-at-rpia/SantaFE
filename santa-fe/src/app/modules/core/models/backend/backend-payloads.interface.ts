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
  maxNumberOfSecurities: number,
  groupIdentifier: object;
  groupFilters: object;
  lookbackHrs?: number
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