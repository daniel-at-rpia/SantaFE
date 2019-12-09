export interface SearchShortcutStub {
  displayTitle: string;
  includedDefinitions: Array<SearchShortcutIncludedDefinitionStub>
}

interface SearchShortcutIncludedDefinitionStub {
  definitionKey: string;
  groupByActive: boolean;
  selectedOptions: Array<string>;
}

export interface SecurityDefinitionStub {
  key: string;
  backendDtoAttrName?: string;
  displayName: string;
  icon: string;
  optionList: Array<string>;
  secondaryIcon?: string;
  locked?: boolean;
  urlForGetLongOptionListFromServer?: string;
  securityDTOAttr?: string;
}

export interface SecurityDefinitionBundleStub {
  label: string;
  list: Array<SecurityDefinitionStub>;
}

export interface SecurityDefinitionMapStub {
  SECURITY_TYPE: SecurityDefinitionStub;
  BACKEND_TENOR: SecurityDefinitionStub;
  BAIL_IN_STATUS: SecurityDefinitionStub;
  COUPON_TYPE: SecurityDefinitionStub;
  CURRENCY: SecurityDefinitionStub;
  INDUSTRY: SecurityDefinitionStub;
  ISSUER: SecurityDefinitionStub;
  MATURITY: SecurityDefinitionStub;
  IS_NEWISSUE: SecurityDefinitionStub;
  IS_ONTHERUN: SecurityDefinitionStub;
  RATING: SecurityDefinitionStub;
  RATING_BUCKET: SecurityDefinitionStub;
  SECTOR: SecurityDefinitionStub;
  SENIORITY: SecurityDefinitionStub;
  SUB_INDUSTRY: SecurityDefinitionStub;
  TENOR: SecurityDefinitionStub;
  PORTFOLIO: SecurityDefinitionStub;
  PRIMARY_PORTFOLIO_MANAGER: SecurityDefinitionStub;
  BACKUP_PORTFOLIO_MANAGER: SecurityDefinitionStub;
  RESEARCH: SecurityDefinitionStub;
}

export interface SecurityMetricOptionStub {
  label: string;
  backendDtoAttrName: string;
  deltaOptions: Array<string>
}

export interface SecurityTableQuoteMetric {
  isDoubleWidthColumn: boolean;
  isTripleWidthColumn: boolean;
  labelList: Array<string>;
  textOnly: boolean;
}

export interface SecurityTableMetricStub {
  label: string;
  attrName: string;
  underlineAttrName: string;
  readyStage: number;
  active: boolean;
  blockAttrName?: string;
  isPartOfMarkBlock?: boolean;
  metricPackDeltaScope?: string;
  isFrontEndMetric?: boolean;
  isForQuantComparer?: boolean;
  pureText?: boolean;
  disabled?: boolean;
  inversedSortingForText?: boolean;
}

export interface TriCoreMetricConfigStub {
  Spread: TriCoreMetricIndividualConfigStub;
  Yield: TriCoreMetricIndividualConfigStub;
  Price: TriCoreMetricIndividualConfigStub;
}

interface TriCoreMetricIndividualConfigStub {
  label: string;
  tier2Threshold: number;
  inversed: boolean;
  rounding: number;
  metricLabel: string;
  backendTargetQuoteAttr: string;
}

export interface TradeFilterConstantStub {
  displayLabel: string;
  value: string;
}