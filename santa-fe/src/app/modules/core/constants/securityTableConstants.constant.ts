import {
  SecurityTableMetricStub,
  SecurityTableQuoteMetric
} from 'FEModels/frontend-stub-models.interface';

import {
  TriCoreMetricConfig,
  SecurityMetricOptions,
  DEFAULT_METRIC_IDENTIFIER
} from 'Core/constants/coreConstants.constant';


export const SECURITY_TABLE_QUOTE_TYPE_RUN = 'Run';
export const SECURITY_TABLE_QUOTE_TYPE_AXE = 'Axe';

// Currently all data comes in a single bulk return, so there is no need for additional stages, but the logic should remain in case it is needed in the future
export const SECURITY_TABLE_FINAL_STAGE = 1;

export const AGGRID_DETAIL_COLUMN_WIDTH = 50;
export const AGGRID_SECURITY_CARD_COLUMN_WIDTH = 270;
export const AGGRID_QUOTE_COLUMN_WIDTH = 244;    // $securityTable_cell_width_quant + $spacing_small * 2 
export const AGGRID_SIMPLE_NUM_COLUMN_WIDTH = 105;
export const AGGRID_SIMPLE_TEXT_COLUMN_WIDTH = 150;
export const AGGRID_ROW_HEIGHT = 40;
export const AGGRID_DETAIL_ROW_HEIGHT_PER_ROW = 34;
export const AGGRID_DETAIL_ROW_HEIGHT_OFFSET = 120;
export const AGGRID_DETAIL_ROW_HEIGHT_OFFSET_OFFTHERUNCDS = 155;
export const AGGRID_DETAIL_ROW_DEFAULT_COUNT = 10;
export const AGGRID_DETAIL_ROW_HEIGHT_MAX = AGGRID_DETAIL_ROW_HEIGHT_OFFSET + AGGRID_DETAIL_ROW_HEIGHT_PER_ROW * AGGRID_DETAIL_ROW_DEFAULT_COUNT;
export const AGGRID_DETAIL_ROW_HEIGHT_DEFAULT = 200;
export const AGGRID_HEADER_CLASS = 'santaTable__agGridTable-agGrid-header';
export const AGGRID_ROW_CLASS = 'santaTable__agGridTable-agGrid-row';
export const AGGRID_CELL_CLASS = 'santaTable__agGridTable-agGrid-cell';
export const AGGRID_DETAIL_COLUMN_KEY = 'Quotes';

export const SecurityTableMetrics: Array<SecurityTableMetricStub> = [
  {
    key: 'securityCard',
    label: 'Security',
    attrName: null,
    underlineAttrName: null,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    pureText: true,
    active: true
  },{
    key: 'bestQuote',
    label: 'Best Quote (Bid vs Ask)',
    attrName: null,
    underlineAttrName: null,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isForQuantComparer: true,
    isDriverDependent: true,
    active: true
  },{
    key: 'bestBid',
    label: 'Best Bid',
    attrName: 'bid',
    blockAttrName: 'bestQuote',
    underlineAttrName: 'bid',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    active: true
  },{
    key: 'bestAsk',
    label: 'Best Ask',
    attrName: 'ask',
    blockAttrName: 'bestQuote',
    underlineAttrName: 'ask',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    active: true
  },{
    key: 'mark',
    label: 'Mark',
    attrName: 'mark',
    underlineAttrName: 'markRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDriverDependent: true,
    active: true
  },{
    key: 'markDriver',
    label: 'Driver',
    attrName: 'markDriver',
    underlineAttrName: 'markDriver',
    blockAttrName: 'mark',
    isDataTypeText: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDriverDependent: true,
    active: false
  },{
    key: 'indexMark',
    label: 'Index Mark',
    attrName: DEFAULT_METRIC_IDENTIFIER,
    underlineAttrName: DEFAULT_METRIC_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDriverDependent: true,
    active: true
  },{
    key: 'markLastUpdatedBy',
    label: 'Mark Last Updated By',
    attrName: 'markChangedBy',
    underlineAttrName: 'markChangedBy',
    blockAttrName: 'mark',
    isDataTypeText: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false
  },{
    key: 'markLastUpdateTime',
    label: 'Mark Last Update Time',
    attrName: 'markChangedTime',
    underlineAttrName: 'markChangedTime',
    blockAttrName: 'mark',
    isDataTypeText: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false
  },{
    key: 'markDeltaToBid',
    label: 'Δ Mark to Bid',
    attrName: 'markDisBid',
    underlineAttrName: 'markDisBidRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    active: false
  },{
    key: 'markDeltaToAsk',
    label: 'Δ Mark to Ask',
    attrName: 'markDisAsk',
    underlineAttrName: 'markDisAskRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    active: false
  },{
    key: 'markDeltaToMid',
    label: 'Δ Mark to Mid',
    attrName: 'markDisMid',
    underlineAttrName: 'markDisMidRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    active: false
  },{
    key: 'markDeltaToLiquidation',
    label: 'Δ Mark to Liquidation',
    attrName: 'markDisLiquidation',
    underlineAttrName: 'markDisLiquidationRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    active: true
  },{
    key: 'currentPosition',
    label: 'Position (MM)',
    attrName: 'positionCurrentInMM',
    underlineAttrName: 'positionCurrent',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true
  },{
    key: 'firmPosition',
    label: 'Firm Position (MM)',
    attrName: 'positionFirmInMM',
    underlineAttrName: 'positionFirm',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false
  },{
    key: 'hfPosition',
    label: 'HF Position (MM)',
    attrName: 'positionHFInMM',
    underlineAttrName: 'positionHF',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false
  },{
    key: 'nlfPosition',
    label: 'NLF Position (MM)',
    attrName: 'positionNLFInMM',
    underlineAttrName: 'positionNLF',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false
  },{
    key: 'wowDelta',
    label: 'WoW Delta',
    attrName: DEFAULT_METRIC_IDENTIFIER,
    underlineAttrName: DEFAULT_METRIC_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Wow',
    isDriverDependent: true,
    active: false
  },{
    key: 'thirtyDayDelta',
    label: 'MoM Delta',
    attrName: DEFAULT_METRIC_IDENTIFIER,
    underlineAttrName: DEFAULT_METRIC_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Mom',
    isDriverDependent: true,
    active: true
  },{
    key: 'yoyDelta',
    label: 'YoY Delta',
    attrName: DEFAULT_METRIC_IDENTIFIER,
    underlineAttrName: DEFAULT_METRIC_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Yoy',
    isDriverDependent: true,
    active: false
  },{
    key: 'ytdDelta',
    label: 'YtD Delta',
    attrName: DEFAULT_METRIC_IDENTIFIER,
    underlineAttrName: DEFAULT_METRIC_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Ytd',
    isDriverDependent: true,
    active: false
  },{
    key: 'quoteCount',
    label: 'Quote Count',
    attrName: null,
    underlineAttrName: null,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    disabled: true
  },{
    key: 'rating',
    label: 'Rating',
    attrName: 'ratingValue',
    underlineAttrName: 'ratingValue',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    isDataTypeText: true
  },{
    key: 'currency',
    label: 'Currency',
    attrName: 'currency',
    underlineAttrName: 'currency',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    isDataTypeText: true
  },{
    key: 'sector',
    label: 'Sector',
    attrName: 'sector',
    underlineAttrName: 'sector',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    isDataTypeText: true
  },{
    key: 'industry',
    label: 'Industry',
    attrName: 'industry',
    underlineAttrName: 'industry',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    isDataTypeText: true
  },{
    key: 'couponType',
    label: 'CouponType',
    attrName: 'couponType',
    underlineAttrName: 'couponType',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    isDataTypeText: true
  },{
    key: 'securityType',
    label: 'Security Type',
    attrName: 'securityType',
    underlineAttrName: 'securityType',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    isDataTypeText: true
  },{
    key: 'seniority',
    label: 'Seniority',
    attrName: 'seniority',
    underlineAttrName: 'seniority',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    isDataTypeText: true
  },{
    key: 'country',
    label: 'Country',
    attrName: 'country',
    underlineAttrName: 'country',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    isDataTypeText: true
  },{
    key: 'maturityType',
    label: 'Maturity Type',
    attrName: 'maturityType',
    underlineAttrName: 'maturityType',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    isDataTypeText: true
  },{
    key: 'primaryPM',
    label: 'Primary',
    attrName: 'primaryPmName',
    underlineAttrName: 'primaryPmName',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    isDataTypeText: true
  },{
    key: 'backupPM',
    label: 'Backup',
    attrName: 'backupPmName',
    underlineAttrName: 'backupPmName',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    isDataTypeText: true
  },{
    key: 'research',
    label: 'Research',
    attrName: 'researchName',
    underlineAttrName: 'researchName',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    isDataTypeText: true
  },{
    key: 'strategy',
    label: 'Strategy',
    attrName: 'strategyFirm',
    underlineAttrName: 'strategyFirm',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    isDataTypeText: true
  },{
    key: 'cs01CadCurrent',
    label: 'CS01 Cad (k)',
    attrName: 'cs01CadCurrentInK',
    underlineAttrName: 'cs01CadCurrent',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false
  },{
    key: 'cs01LocalCurrent',
    label: 'CS01 Local (k)',
    attrName: 'cs01LocalCurrentInK',
    underlineAttrName: 'cs01LocalCurrent',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false
  },{
    key: 'cs01CadFirm',
    label: 'Firm CS01 CAD (k)',
    attrName: 'cs01CadFirmInK',
    underlineAttrName: 'cs01CadFirm',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false
  },{
    key: 'cs01LocalFirm',
    label: 'Firm CS01 Local (k)',
    attrName: 'cs01LocalFirmInK',
    underlineAttrName: 'cs01LocalFirm',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false
  }
];

export const QuoteMetricList: Array<SecurityTableQuoteMetric> = [
  {
    labelList: ['B Time', 'A Time'],
    textOnly: true,
    size: 2,
    isNonCDS: false
  },
  {
    labelList: ['Source'],
    textOnly: true,
    isNonCDS: false
  },{
    labelList: ['Dealer'],
    textOnly: true,
    isNonCDS: false
  },{
    labelList: ['B Px', 'A Px'],
    size: 3,
    textOnly: true,
    isNonCDS: true
  },{
    labelList: ['B YTW', 'A YTW'],
    size: 2,
    textOnly: true,
    isNonCDS: true
  },{
    labelList: ['B Sprd', 'A Sprd'],
    size: 2,
    textOnly: true,
    isNonCDS: false
  },{
    labelList: ['B Size', 'A Size'],
    size: 3,
    textOnly: true,
    isNonCDS: false
  },{
    labelList: ['Benchmarks'],
    size: 4,
    textOnly: true,
    isNonCDS: true
  }
];