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
    label: 'Security',
    attrName: null,
    underlineAttrName: null,
    readyStage: 1,
    pureText: true,
    active: true
  },{
    label: 'Best Quote (Bid vs Ask)',
    attrName: null,
    underlineAttrName: null,
    readyStage: 3,
    isForQuantComparer: true,
    active: true,
    targetQuantLocationFromRow: 'bestSpreadQuote'
  },{
    label: 'Mark',
    attrName: 'mark',
    underlineAttrName: 'markRaw',
    blockAttrName: 'mark',
    readyStage: 2,
    active: true
  },{
    label: 'Mark Driver',
    attrName: 'markDriver',
    underlineAttrName: 'markDriver',
    blockAttrName: 'mark',
    readyStage: 2,
    active: false
  },{
    label: 'Mark Last Updated By',
    attrName: 'markChangedBy',
    underlineAttrName: 'markChangedBy',
    blockAttrName: 'mark',
    readyStage: 2,
    active: false
  },{
    label: 'Mark Last Update Time',
    attrName: 'markChangedTime',
    underlineAttrName: 'markChangedTime',
    blockAttrName: 'mark',
    readyStage: 2,
    active: false
  },{
    label: 'Mark Delta to Bid',
    attrName: 'markDisBid',
    underlineAttrName: 'markDisBidRaw',
    blockAttrName: 'mark',
    readyStage: 3,
    isFrontEndMetric: true,
    active: false
  },{
    label: 'Mark Delta to Ask',
    attrName: 'markDisAsk',
    underlineAttrName: 'markDisAskRaw',
    blockAttrName: 'mark',
    readyStage: 3,
    isFrontEndMetric: true,
    active: false
  },{
    label: 'Mark Delta to Mid',
    attrName: 'markDisMid',
    underlineAttrName: 'markDisMidRaw',
    blockAttrName: 'mark',
    readyStage: 3,
    isFrontEndMetric: true,
    active: false
  },{
    label: 'Mark Delta to Liquidation',
    attrName: 'markDisLiquidation',
    underlineAttrName: 'markDisLiquidationRaw',
    blockAttrName: 'mark',
    readyStage: 3,
    isFrontEndMetric: true,
    active: true
  },{
    label: 'Position (MM)',
    attrName: 'positionCurrentInMM',
    underlineAttrName: 'positionCurrent',
    readyStage: 1,
    active: true
  },{
    label: 'Firm Position (MM)',
    attrName: 'positionFirmInMM',
    underlineAttrName: 'positionFirm',
    readyStage: 1,
    active: false
  },{
    label: 'HF Position (MM)',
    attrName: 'positionHFInMM',
    underlineAttrName: 'positionHF',
    readyStage: 1,
    active: false
  },{
    label: 'NLF Position (MM)',
    attrName: 'positionNLFInMM',
    underlineAttrName: 'positionNLF',
    readyStage: 1,
    active: false
  },{
    label: '30 Day Delta',
    attrName: TriCoreMetricConfig.Spread.metricLabel,
    underlineAttrName: TriCoreMetricConfig.Spread.metricLabel,
    blockAttrName: 'metricPack',
    readyStage: 2,
    metricPackDeltaScope: 'Mom',
    active: true
  },{
    label: 'Quote Count',
    attrName: null,
    underlineAttrName: null,
    readyStage: 3,
    active: false,
    disabled: true
  },{
    label: 'Rating',
    attrName: 'ratingValue',
    underlineAttrName: 'ratingValue',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    label: 'Currency',
    attrName: 'currency',
    underlineAttrName: 'currency',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    label: 'Sector',
    attrName: 'sector',
    underlineAttrName: 'sector',
    readyStage: 2,
    active: true,
    inversedSortingForText: true
  },{
    label: 'Industry',
    attrName: 'industry',
    underlineAttrName: 'industry',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    label: 'CouponType',
    attrName: 'couponType',
    underlineAttrName: 'couponType',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    label: 'Security Type',
    attrName: 'securityType',
    underlineAttrName: 'securityType',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    label: 'Seniority',
    attrName: 'seniority',
    underlineAttrName: 'seniority',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    label: 'Country',
    attrName: 'country',
    underlineAttrName: 'country',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    label: 'Maturity Type',
    attrName: 'maturityType',
    underlineAttrName: 'maturityType',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    label: 'Primary PM',
    attrName: 'primaryPmName',
    underlineAttrName: 'primaryPmName',
    readyStage: 2,
    active: true,
    inversedSortingForText: true
  },{
    label: 'Backup PM',
    attrName: 'backupPmName',
    underlineAttrName: 'backupPmName',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    label: 'Research',
    attrName: 'researchName',
    underlineAttrName: 'researchName',
    readyStage: 2,
    active: false,
    inversedSortingForText: true
  },{
    label: 'Firm Strategy',
    attrName: 'strategyFirm',
    underlineAttrName: 'strategyFirm',
    readyStage: 1,
    active: true,
    inversedSortingForText: true
  },{
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