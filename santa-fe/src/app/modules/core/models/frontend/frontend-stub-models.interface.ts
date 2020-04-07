import { Label } from '@amcharts/amcharts4/core';

export interface SearchShortcutStub {
  displayTitle: string;
  includedDefinitions: Array<SearchShortcutIncludedDefinitionStub>;
  isMajor?: boolean;
  isHero?: boolean;
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
  TICKER: SecurityDefinitionStub;
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
  OWNER: SecurityDefinitionStub;
  STRATEGY: SecurityDefinitionStub;
  COUNTRY: SecurityDefinitionStub;
  QUOTED_TODAY: SecurityDefinitionStub;
}

export interface SecurityMetricOptionStub {
  label: string;
  backendDtoAttrName: string;
  deltaOptions: Array<string>
}

export interface SecurityTableQuoteMetric {
  size?: number;
  labelList: Array<string>;
  textOnly: boolean;
  isNonCDS: boolean;
}

export interface SecurityTableMetricStub {
  key: string;
  label: string;
  attrName: string;
  underlineAttrName: string;
  isAttrChangable?: boolean;
  readyStage: number;
  active: boolean;
  pinned?: boolean;
  blockAttrName?: string;
  isFrontEndMetric?: boolean;
  isForQuantComparer?: boolean;
  pureText?: boolean;
  disabled?: boolean;
  isDataTypeText?: boolean;
  isDriverDependent?: boolean;
  metricPackDeltaScope?: string;
}

export interface TriCoreDriverConfigStub {
  Spread: TriCoreDriverIndividualConfigStub;
  Yield: TriCoreDriverIndividualConfigStub;
  Price: TriCoreDriverIndividualConfigStub;
}

interface TriCoreDriverIndividualConfigStub {
  label: string;
  tier2Threshold: number;
  inversed: boolean;
  rounding: number;
  driverLabel: string;
  backendTargetQuoteAttr: string;
}

export interface TradeFilterConstantStub {
  displayLabel: string;
  value: string;
}

export interface ObligorChartCategoryColorSchemeStub {
  categoryScheme: Array<{label: string, value: string}>;
}
