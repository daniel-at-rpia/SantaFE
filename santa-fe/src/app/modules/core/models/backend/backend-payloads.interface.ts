export interface PayloadGetSantaGroups {
  source: string;
  yyyyMMdd?: number;
  santaGroupDefinition: object;
  santaGroupFilters: object;
  tenorOptions: Array<string>;
}

export interface PayloadGetTargetSecurityGroup {
  source: string;
  yyyyMMdd?: number;
  santaGroupIdentifier: object;
  santaGroupFilters: object;
  tenorOptions: Array<string>;
}

export interface PayloadGetSecurityGroupBasedOnSecurity {
  source: string;
  identifier: string;
  santaGroupIdentifier: {
    [property: string]: Array<string>;
  };
  tenorOptions: Array<string>;
  yyyyMMdd?: number;
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

export interface PayloadObligorSecurityIDs {
  identifier: string
}