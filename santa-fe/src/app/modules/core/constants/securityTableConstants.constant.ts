import {
  SecurityTableMetricStub,
  SecurityTableQuoteMetric
} from 'FEModels/frontend-stub-models.interface';

import {
  TriCoreMetricConfig,
  SecurityMetricOptions
} from 'Core/constants/coreConstants.constant';


export const SECURITY_TABLE_QUOTE_TYPE_RUN = 'Run';
export const SECURITY_TABLE_QUOTE_TYPE_AXE = 'Axe';

/* Stages:
1: ready after the get-position call
2. ready after the get-securities call
3. ready after the get-best-quotes call
*/

export const SECURITY_TABLE_FINAL_STAGE = 3;

export const SecurityTableMetrics: Array<SecurityTableMetricStub> = [
  {
    key: 'securityCard',
    label: 'Security',
    attrName: null,
    underlineAttrName: null,
    readyStage: 1,
    pureText: true,
    active: true
  },{
    key: 'bestQuote',
    label: 'Best Quote (Bid vs Ask)',
    attrName: null,
    underlineAttrName: null,
    readyStage: 3,
    isForQuantComparer: true,
    active: true,
    targetQuantLocationFromRow: 'bestSpreadQuote'
  },{
    key: 'mark',
    label: 'Mark',
    attrName: 'mark',
    underlineAttrName: 'markRaw',
    blockAttrName: 'mark',
    readyStage: 2,
    active: true
  },{
    key: 'markDriver',
    label: 'Mark Driver',
    attrName: 'markDriver',
    underlineAttrName: 'markDriver',
    blockAttrName: 'mark',
    readyStage: 2,
    active: false
  },{
    key: 'markLastUpdatedBy',
    label: 'Mark Last Updated By',
    attrName: 'markChangedBy',
    underlineAttrName: 'markChangedBy',
    blockAttrName: 'mark',
    readyStage: 2,
    active: false
  },{
    key: 'markLastUpdateTime',
    label: 'Mark Last Update Time',
    attrName: 'markChangedTime',
    underlineAttrName: 'markChangedTime',
    blockAttrName: 'mark',
    readyStage: 2,
    active: false
  },{
    key: 'markDeltaToBid',
    label: 'Mark Delta to Bid',
    attrName: 'markDisBid',
    underlineAttrName: 'markDisBidRaw',
    blockAttrName: 'mark',
    readyStage: 3,
    isFrontEndMetric: true,
    active: false
  },{
    key: 'markDeltaToAsk',
    label: 'Mark Delta to Ask',
    attrName: 'markDisAsk',
    underlineAttrName: 'markDisAskRaw',
    blockAttrName: 'mark',
    readyStage: 3,
    isFrontEndMetric: true,
    active: false
  },{
    key: 'markDeltaToMid',
    label: 'Mark Delta to Mid',
    attrName: 'markDisMid',
    underlineAttrName: 'markDisMidRaw',
    blockAttrName: 'mark',
    readyStage: 3,
    isFrontEndMetric: true,
    active: false
  },{
    key: 'markDeltaToLiquidation',
    label: 'Mark Delta to Liquidation',
    attrName: 'markDisLiquidation',
    underlineAttrName: 'markDisLiquidationRaw',
    blockAttrName: 'mark',
    readyStage: 3,
    isFrontEndMetric: true,
    active: true
  },{
    key: 'currentPosition',
    label: 'Position (MM)',
    attrName: 'positionCurrentInMM',
    underlineAttrName: 'positionCurrent',
    readyStage: 1,
    active: true
  },{
    key: 'firmPosition',
    label: 'Firm Position (MM)',
    attrName: 'positionFirmInMM',
    underlineAttrName: 'positionFirm',
    readyStage: 1,
    active: false
  },{
    key: 'hfPosition',
    label: 'HF Position (MM)',
    attrName: 'positionHFInMM',
    underlineAttrName: 'positionHF',
    readyStage: 1,
    active: false
  },{
    key: 'nlfPosition',
    label: 'NLF Position (MM)',
    attrName: 'positionNLFInMM',
    underlineAttrName: 'positionNLF',
    readyStage: 1,
    active: false
  },{
    key: 'thirtyDayDelta',
    label: '30 Day Delta',
    attrName: TriCoreMetricConfig.Spread.metricLabel,
    underlineAttrName: TriCoreMetricConfig.Spread.metricLabel,
    blockAttrName: 'metricPack',
    readyStage: 2,
    metricPackDeltaScope: 'Mom',
    active: true
  },{
    key: 'quoteCount',
    label: 'Quote Count',
    attrName: null,
    underlineAttrName: null,
    readyStage: 3,
    active: false,
    disabled: true
  },{
    key: 'rating',
    label: 'Rating',
    attrName: 'ratingValue',
    underlineAttrName: 'ratingValue',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    key: 'currency',
    label: 'Currency',
    attrName: 'currency',
    underlineAttrName: 'currency',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    key: 'sector',
    label: 'Sector',
    attrName: 'sector',
    underlineAttrName: 'sector',
    readyStage: 2,
    active: true,
    inversedSortingForText: true
  },{
    key: 'industry',
    label: 'Industry',
    attrName: 'industry',
    underlineAttrName: 'industry',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    key: 'couponType',
    label: 'CouponType',
    attrName: 'couponType',
    underlineAttrName: 'couponType',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    key: 'securityType',
    label: 'Security Type',
    attrName: 'securityType',
    underlineAttrName: 'securityType',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    key: 'seniority',
    label: 'Seniority',
    attrName: 'seniority',
    underlineAttrName: 'seniorityLevel',
    readyStage: 2,
    active: false,
    inversedSortingForText: false
  },{
    key: 'country',
    label: 'Country',
    attrName: 'country',
    underlineAttrName: 'country',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    key: 'maturityType',
    label: 'Maturity Type',
    attrName: 'maturityType',
    underlineAttrName: 'maturityType',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    key: 'primaryPM',
    label: 'Primary PM',
    attrName: 'primaryPmName',
    underlineAttrName: 'primaryPmName',
    readyStage: 2,
    active: true,
    inversedSortingForText: true
  },{
    key: 'backupPM',
    label: 'Backup PM',
    attrName: 'backupPmName',
    underlineAttrName: 'backupPmName',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    key: 'research',
    label: 'Research',
    attrName: 'researchName',
    underlineAttrName: 'researchName',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    key: 'firmStrategy',
    label: 'Firm Strategy',
    attrName: 'strategyFirm',
    underlineAttrName: 'strategyFirm',
    readyStage: 1,
    active: false,
    inversedSortingForText: true
  },{
    key: 'strategy',
    label: 'Strategy',
    attrName: 'strategyCurrent',
    underlineAttrName: 'strategyCurrent',
    readyStage: 1,
    active: false,
    inversedSortingForText: true
  }
];

export const THIRTY_DAY_DELTA_METRIC_INDEX = SecurityTableMetrics.findIndex((eachMetric) => {
  return eachMetric.label === '30 Day Delta';
});

export const QuoteMetricList: Array<SecurityTableQuoteMetric> = [
  {
    labelList: ['Source'],
    isDoubleWidthColumn: false,
    isTripleWidthColumn: false,
    textOnly: false
  },{
    labelList: ['Dealer'],
    isDoubleWidthColumn: false,
    isTripleWidthColumn: false,
    textOnly: false
  },{
    labelList: ['B Px', 'A Px'],
    isDoubleWidthColumn: true,
    isTripleWidthColumn: false,
    textOnly: false
  },{
    labelList: ['B YTW', 'A YTW'],
    isDoubleWidthColumn: true,
    isTripleWidthColumn: false,
    textOnly: false
  },{
    labelList: ['B Sprd', 'A Sprd'],
    isDoubleWidthColumn: true,
    isTripleWidthColumn: false,
    textOnly: false
  },{
    labelList: ['B Size (MM)', 'A Size (MM)'],
    isDoubleWidthColumn: false,
    isTripleWidthColumn: true,
    textOnly: false
  },{
    labelList: ['Benchmarks'],
    isDoubleWidthColumn: false,
    isTripleWidthColumn: true,
    textOnly: true
  }
];

export const AGGRID_DETAIL_COLUMN_WIDTH = 50;
export const AGGRID_SECURITY_CARD_COLUMN_WIDTH = 270;
export const AGGRID_QUOTE_COLUMN_WIDTH = 244;    // $securityTable_cell_width_quant + $spacing_small * 2 
export const AGGRID_SIMPLE_NUM_COLUMN_WIDTH = 100;
export const AGGRID_ROW_HEIGHT = 40;
export const AGGRID_HEADER_CLASS = 'santaTable__agGridTable-agGrid-header';
export const AGGRID_ROW_CLASS = 'santaTable__agGridTable-agGrid-row';
export const AGGRID_CELL_CLASS = 'santaTable__agGridTable-agGrid-cell';
export const AGGRID_DETAIL_COLUMN_KEY = 'Quotes';