import {
  SecurityTableMetricStub,
  SecurityTableQuoteMetric
} from 'FEModels/frontend-stub-models.interface';

import {
  TriCoreDriverConfig,
  SecurityMetricOptions,
  DEFAULT_DRIVER_IDENTIFIER
} from 'Core/constants/coreConstants.constant';


export const SECURITY_TABLE_QUOTE_TYPE_RUN = 'Run';
export const SECURITY_TABLE_QUOTE_TYPE_AXE = 'Axe';

// Currently all data comes in a single bulk return, so there is no need for additional stages, but the logic should remain in case it is needed in the future
export const SECURITY_TABLE_FINAL_STAGE = 1;

export const AGGRID_DETAIL_COLUMN_WIDTH = 50;
export const AGGRID_SECURITY_CARD_COLUMN_WIDTH = 270;
export const AGGRID_QUOTE_COLUMN_WIDTH = 244;    // $securityTable_cell_width_quant + $spacing_small * 2
export const AGGRID_SIMPLE_NUM_COLUMN_WIDTH = 117;
export const AGGRID_SIMPLE_TEXT_COLUMN_WIDTH = 135;
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

export const SECURITY_TABLE_HEADER_NO_GROUP = 'NoGroup';
export const SecurityTableMetricGroups = {
  bestQuote: 'Best Quote',
  mark: 'Mark',
  markDiscrepancies: 'Mark Discrepancies',
  position: 'Position (MM)',
  cs01: 'CS01 (k)',
  delta: 'Security Driver Deltas',
  securityInfo: 'Security Info',
  ownership: 'Ownership'
};
export const SecurityTableMetrics: Array<SecurityTableMetricStub> = [
  {
    key: 'securityCard',
    label: 'Security',
    attrName: null,
    underlineAttrName: null,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    pureText: true,
    active: true,
    pinned: true,
    groupBelongs: SECURITY_TABLE_HEADER_NO_GROUP
  },{
    key: 'bestQuote',
    label: 'Best Quote (Bid vs Ask)',
    attrName: null,
    blockAttrName: 'combined',
    underlineAttrName: null,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isForQuantComparer: true,
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.bestQuote,
    groupShow: true
  },{
    key: 'bestAxeQuote',
    label: 'Best Axe Quote (Bid vs Ask)',
    attrName: null,
    blockAttrName: 'axe',
    underlineAttrName: null,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isForQuantComparer: true,
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.bestQuote,
    groupShow: true
  },{
    key: 'bestBid',
    label: 'Best Bid',
    attrName: 'bid',
    blockAttrName: 'bestQuote',
    underlineAttrName: 'bid',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    active: false,
    groupBelongs: SecurityTableMetricGroups.bestQuote,
    groupShow: false
  },{
    key: 'bestAsk',
    label: 'Best Ask',
    attrName: 'ask',
    blockAttrName: 'bestQuote',
    underlineAttrName: 'ask',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    active: false,
    groupBelongs: SecurityTableMetricGroups.bestQuote,
    groupShow: false
  },{
    key: 'mark',
    label: 'Mark',
    attrName: 'mark',
    underlineAttrName: 'markRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.mark,
    groupShow: true
  },{
    key: 'markDriver',
    label: 'Driver',
    attrName: 'markDriver',
    underlineAttrName: 'markDriver',
    blockAttrName: 'mark',
    isDataTypeText: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.mark,
    groupShow: false
  },{
    key: 'indexMark',
    label: 'Index Mark (t-1)',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.mark,
    groupShow: false
  },{
    key: 'markDeltaToIndex',
    label: 'Δ to Index Mark (t-1)',
    attrName: 'markDisIndex',
    underlineAttrName: 'markDisIndexRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    active: false,
    groupBelongs: SecurityTableMetricGroups.mark,
    groupShow: false
  },{
    key: 'markLastUpdatedBy',
    label: 'Mark Last Updated By',
    attrName: 'markChangedBy',
    underlineAttrName: 'markChangedBy',
    blockAttrName: 'mark',
    isDataTypeText: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    groupBelongs: SecurityTableMetricGroups.mark,
    groupShow: false
  },{
    key: 'markLastUpdateTime',
    label: 'Mark Last Update Time',
    attrName: 'markChangedTime',
    underlineAttrName: 'markChangedTime',
    blockAttrName: 'mark',
    isDataTypeText: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    groupBelongs: SecurityTableMetricGroups.mark,
    groupShow: false
  },{
    key: 'markDeltaToBid',
    label: 'Δ to Bid',
    attrName: 'markDisBid',
    underlineAttrName: 'markDisBidRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.markDiscrepancies,
    groupShow: false
  },{
    key: 'markDeltaToAsk',
    label: 'Δ to Ask',
    attrName: 'markDisAsk',
    underlineAttrName: 'markDisAskRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.markDiscrepancies,
    groupShow: false
  },{
    key: 'markDeltaToMid',
    label: 'Δ to Mid',
    attrName: 'markDisMid',
    underlineAttrName: 'markDisMidRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.markDiscrepancies,
    groupShow: false
  },{
    key: 'markDeltaToLiquidation',
    label: 'Δ to Liquidation',
    attrName: 'markDisLiquidation',
    underlineAttrName: 'markDisLiquidationRaw',
    blockAttrName: 'mark',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    isFrontEndMetric: true,
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.markDiscrepancies,
    groupShow: true
  },{
    key: 'currentPosition',
    label: 'Current Preset Position',
    attrName: 'positionCurrentInMM',
    underlineAttrName: 'positionCurrent',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.position,
    groupShow: true
  },{
    key: 'firmPosition',
    label: 'Firm Position',
    attrName: 'positionFirmInMM',
    underlineAttrName: 'positionFirm',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.position,
    groupShow: true
  },{
    key: 'hfPosition',
    label: 'HF Position',
    attrName: 'positionHFInMM',
    underlineAttrName: 'positionHF',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.position,
    groupShow: false
  },{
    key: 'nlfPosition',
    label: 'NLF Position',
    attrName: 'positionNLFInMM',
    underlineAttrName: 'positionNLF',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.position,
    groupShow: false
  },{
    key: 'dofPosition',
    label: 'DOF Position',
    attrName: 'positionDOFInMM',
    underlineAttrName: 'positionDOF',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.position,
    groupShow: false
  },{
    key: 'sofPosition',
    label: 'SOF Position',
    attrName: 'positionSOFInMM',
    underlineAttrName: 'positionSOF',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.position,
    groupShow: false
  },{
    key: 'stipPosition',
    label: 'STIP Position',
    attrName: 'positionSTIPInMM',
    underlineAttrName: 'positionSTIP',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.position,
    groupShow: false
  },{
    key: 'fipPosition',
    label: 'FIP Position',
    attrName: 'positionFIPInMM',
    underlineAttrName: 'positionFIP',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.position,
    groupShow: false
  },{
    key: 'cipPosition',
    label: 'CIP Position',
    attrName: 'positionCIPInMM',
    underlineAttrName: 'positionCIP',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.position,
    groupShow: false
  },{
    key: 'agbPosition',
    label: 'AGB Position',
    attrName: 'positionAGBInMM',
    underlineAttrName: 'positionAGB',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.position,
    groupShow: false
  },{
    key: 'bbbPosition',
    label: 'BBB Position',
    attrName: 'positionBBBInMM',
    underlineAttrName: 'positionBBB',
    blockAttrName: 'position',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.position,
    groupShow: false
  },{
    key: 'cs01CadCurrent',
    label: 'CS01 Cad',
    attrName: 'cs01CadCurrentInK',
    underlineAttrName: 'cs01CadCurrent',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.cs01,
    groupShow: false
  },{
    key: 'cs01LocalCurrent',
    label: 'CS01 Local',
    attrName: 'cs01LocalCurrentInK',
    underlineAttrName: 'cs01LocalCurrent',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.cs01,
    groupShow: false
  },{
    key: 'cs01CadFirm',
    label: 'Firm CS01 CAD',
    attrName: 'cs01CadFirmInK',
    underlineAttrName: 'cs01CadFirm',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.cs01,
    groupShow: true
  },{
    key: 'cs01LocalFirm',
    label: 'Firm CS01 Local',
    attrName: 'cs01LocalFirmInK',
    underlineAttrName: 'cs01LocalFirm',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SecurityTableMetricGroups.cs01,
    groupShow: false
  },{
    key: 'dodDelta',
    label: 'DoD Δ',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Dod',
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.delta,
    groupShow: false
  },{
    key: 'wowDelta',
    label: 'WoW Δ',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Wow',
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.delta,
    groupShow: true
  },{
    key: 'thirtyDayDelta',
    label: 'MoM Δ',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Mom',
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.delta,
    groupShow: false
  },{
    key: 'yoyDelta',
    label: 'YoY Δ',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Yoy',
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.delta,
    groupShow: false
  },{
    key: 'ytdDelta',
    label: 'YtD Δ',
    attrName: DEFAULT_DRIVER_IDENTIFIER,
    underlineAttrName: DEFAULT_DRIVER_IDENTIFIER,
    blockAttrName: 'metricPack',
    isAttrChangable: true,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    metricPackDeltaScope: 'Ytd',
    isDriverDependent: true,
    active: true,
    groupBelongs: SecurityTableMetricGroups.delta,
    groupShow: false
  },{
    key: 'quoteCount',
    label: 'Quote Count',
    attrName: null,
    underlineAttrName: null,
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    disabled: true,
    groupBelongs: SECURITY_TABLE_HEADER_NO_GROUP
  },{
    key: 'ticker',
    label: 'Ticker',
    attrName: 'ticker',
    underlineAttrName: 'ticker',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    groupShow: false
  },{
    key: 'rating',
    label: 'Rating',
    attrName: 'ratingValue',
    underlineAttrName: 'ratingValue',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    groupShow: false
  },{
    key: 'currency',
    label: 'Currency',
    attrName: 'currency',
    underlineAttrName: 'currency',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    groupShow: false
  },{
    key: 'sector',
    label: 'Sector',
    attrName: 'sector',
    underlineAttrName: 'sector',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    groupShow: true
  },{
    key: 'industry',
    label: 'Industry',
    attrName: 'industry',
    underlineAttrName: 'industry',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    groupShow: false
  },{
    key: 'securityType',
    label: 'Security Type',
    attrName: 'securityType',
    underlineAttrName: 'securityType',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    groupShow: false
  },{
    key: 'seniority',
    label: 'Seniority',
    attrName: 'seniority',
    underlineAttrName: 'seniority',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    groupShow: false
  },{
    key: 'country',
    label: 'Country',
    attrName: 'country',
    underlineAttrName: 'country',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    groupShow: false
  },{
    key: 'maturityType',
    label: 'Maturity Type',
    attrName: 'maturityType',
    underlineAttrName: 'maturityType',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.securityInfo,
    groupShow: false
  },{
    key: 'primaryPM',
    label: 'Primary',
    attrName: 'primaryPmName',
    underlineAttrName: 'primaryPmName',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.ownership,
    groupShow: true
  },{
    key: 'backupPM',
    label: 'Backup',
    attrName: 'backupPmName',
    underlineAttrName: 'backupPmName',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.ownership,
    groupShow: false
  },{
    key: 'research',
    label: 'Research',
    attrName: 'researchName',
    underlineAttrName: 'researchName',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    isDataTypeText: true,
    groupBelongs: SecurityTableMetricGroups.ownership,
    groupShow: true
  },{
    key: 'strategy',
    label: 'Strategy',
    attrName: 'strategyFirm',
    underlineAttrName: 'strategyFirm',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: false,
    isDataTypeText: true,
    groupBelongs: SECURITY_TABLE_HEADER_NO_GROUP
  },{
    key: 'hedgeFactor',
    label: 'Hedge Factor',
    attrName: 'hedgeFactor',
    underlineAttrName: 'hedgeFactor',
    readyStage: SECURITY_TABLE_FINAL_STAGE,
    active: true,
    groupBelongs: SECURITY_TABLE_HEADER_NO_GROUP
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
    size: 3,
    textOnly: true,
    isNonCDS: true
  },{
    labelList: ['B Sprd', 'A Sprd'],
    size: 3,
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
