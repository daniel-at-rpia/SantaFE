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
  MATURITY: SecurityDefinitionStub;
  IS_NEWISSUE: SecurityDefinitionStub;
  IS_ONTHERUN: SecurityDefinitionStub;
  RATING: SecurityDefinitionStub;
  RATING_BUCKET: SecurityDefinitionStub;
  SECTOR: SecurityDefinitionStub;
  SENIORITY: SecurityDefinitionStub;
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
  deltaOptions: Array<string>;
}

export interface SecurityTableQuoteHeaderConfigStub {
  size?: number;
  labelList: Array<string>;
  textOnly: boolean;
  isNonCDS: boolean;
}

export interface SecurityTableHeaderConfigStub {
  key: string;
  content: {
    label: string;
    attrName: string;
    underlineAttrName: string;
    readyStage: number;
    tableSpecifics: {
      default: SecurityTableHeaderConfigStubTableSpecificsBlock;
      tradeMain?: SecurityTableHeaderConfigStubTableSpecificsBlock;
      tradeAlert?: SecurityTableHeaderConfigStubTableSpecificsBlock;
    };
    blockAttrName?: string;
    isFrontEndMetric?: boolean;
    isForBestQuoteComparer?: boolean;
    isForSecurityCard?: boolean;
    isDataTypeText?: boolean;
    isDriverDependent?: boolean;  // isDriverDependent means the cells will be re-processed when driver is changed
    isAttrChangable?: boolean;  // isAttrChangable means the 'attrName' & 'underlineAttrName' will be overwritten with driver-specific attributes, commonly used for columns that are switching between spread/price/yield
    metricPackDeltaScope?: string;
    groupBelongs: string;
    isColumnWidthNarrow?: boolean;
    isCustomComponent?: boolean;
  }
}

export interface SecurityTableSpecificAlertHeaderStub {
  include: string[];
  exclude: string[];
}
export interface SecurityTableSpecificAlertHeaderConfigsStub {
  axe: SecurityTableSpecificAlertHeaderStub;
  mark: SecurityTableSpecificAlertHeaderStub;
  trade: SecurityTableSpecificAlertHeaderStub;
  all: SecurityTableSpecificAlertHeaderStub;
}

interface SecurityTableHeaderConfigStubTableSpecificsBlock {
  active: boolean;
  pinned?: boolean;
  disabled?: boolean;
  groupShow?: boolean;
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

export interface TradeHistoryHeaderConfigStub {
  headerKey: string;
  headerDisplayLabel: string;
  attrName: string;
  underlineAttrName?: string;
  size?: number;
  applyQuantColorCodes?: boolean;
}