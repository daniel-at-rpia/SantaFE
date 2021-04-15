import { Label } from '@amcharts/amcharts4/core';
import { AggridSortOptions } from 'Core/constants/securityTableConstants.constant';

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
  securityDTOAttrBlock?: string;
}

export interface SecurityDefinitionBundleStub {
  label: string;
  list: Array<SecurityDefinitionStub>;
}

export interface SecurityDefinitionMapStub {
  SECURITY_TYPE: SecurityDefinitionStub;
  SECURITY_SUB_TYPE: SecurityDefinitionStub;
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
  OVERRIDE: SecurityDefinitionStub;
  BICS_CONSOLIDATED: SecurityDefinitionStub;
  BICS_LEVEL_1: SecurityDefinitionStub;
  BICS_LEVEL_2: SecurityDefinitionStub;
  BICS_LEVEL_3: SecurityDefinitionStub;
  BICS_LEVEL_4: SecurityDefinitionStub;
  BICS_LEVEL_5: SecurityDefinitionStub;
  BICS_LEVEL_6: SecurityDefinitionStub;
  BICS_LEVEL_7: SecurityDefinitionStub;
  TICKER: SecurityDefinitionStub;
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
    isFrontendAggregation?: boolean;  // just because the column is calculated on FE, doesn't mean it need to hanlded differently. The ones that do need to be handled differently are the ones aggregated on FE, so we only care about those
    isForBestQuoteComparer?: boolean;
    isForSecurityCard?: boolean;
    isDataTypeText?: boolean;
    isDriverDependent?: boolean;  // isDriverDependent means the cells will be re-processed when driver is changed
    isAttrChangable?: boolean;  // isAttrChangable means the 'attrName' & 'underlineAttrName' will be overwritten with driver-specific attributes, commonly used for columns that are switching between spread/price/yield
    metricPackDeltaScope?: string;
    groupBelongs: string;
    columnWidth?: number;
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
  trace: SecurityTableSpecificAlertHeaderStub;
  all: SecurityTableSpecificAlertHeaderStub;
}

interface SecurityTableHeaderConfigStubTableSpecificsBlock {
  active: boolean;
  pinned?: boolean;
  disabled?: boolean;
  groupShow?: boolean;
  sortActivated?: AggridSortOptions;
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

export interface TradeTraceHeaderConfigStub {
  headerKey: string;
  headerDisplayLabel: string;
  attrName: string;
  size?: number;
  applyQuantColorCodes?: boolean;
}