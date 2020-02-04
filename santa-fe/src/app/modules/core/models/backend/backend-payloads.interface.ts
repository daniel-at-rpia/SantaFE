export interface PayloadGetSantaGroups {
  source: string;
  yyyyMMdd?: number;
  groupDefinition: object;
  groupFilters: object;
  tenorOptions: Array<string>;
}

export interface PayloadGetTargetSecurityGroup {
  source: string;
  yyyyMMdd?: number;
  groupIdentifier: object;
  groupFilters: object;
  tenorOptions: Array<string>;
}

export interface PayloadGetGroupHistoricalSummary {
  source: string;
  identifier: string;
  groupIdentifier: {
    [property: string]: Array<string>;
  };
  tenorOptions: Array<string>;
  deltaTypes: Array<string>;
  metricName: string;
  count: number;
}

export interface PayloadGetPositions {
  source?: string;
  yyyyMMdd?: number;
  partitionOptions: Array<string>
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
  lookbackHrs?: number
}

export interface PayloadSetQuoteStatus {
  identifier: string;
  quoteType: string;  // 'Axe', 'Run'
  dealer: string;  // 'JPM'
  side: string;  // 'Bid', 'Ask'
  quoteStatus: string;  // 'Good', 'Bad', 'Garbage'
}