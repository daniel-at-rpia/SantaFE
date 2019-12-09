export interface PayloadGetSantaGroups {
  source: string;
  yyyyMMdd?: number;
  santaGroupDefinition: object;
  santaGroupFilters: object;
  tenorOptions: Array<string>;
}

export interface PayloadGetPositions {
  source?: string;
  yyyyMMdd?: number;
  partitionOptions: Array<string>
}

export interface PayloadGetBestQuotes {
  quoteMetric: string,
  identifiers: Array<string>
}

export interface PayloadGetAllQuotes {
  identifier: string;
}