import {
  SecurityTableMetricStub,
  SecurityMetricOptionStub
} from 'FEModels/frontend-stub-models.interface';

export const SecurityMetricOptions: Array<SecurityMetricOptionStub> = [
  {
    label: 'Default Spread',
    backendDtoAttrName: 'defaultSpread',
    deltaOptions: [
      'DoD',
      'WoW',
      'MoM',
      'Ytd'
    ]
  },
  {
    label: 'Price',
    backendDtoAttrName: 'price',
    deltaOptions: [
      'DoD',
      'WoW',
      'MoM',
      'Ytd'
    ]
  },
  {
    label: 'Rating',
    backendDtoAttrName: 'ratingDouble',
    deltaOptions: [
      'DoD',
      'WoW',
      'MoM',
      'Ytd'
    ]
  },
  {
    label: 'G Spread',
    backendDtoAttrName: 'gSpread',
    deltaOptions: [
      'DoD',
      'WoW',
      'MoM',
      'Ytd'
    ]
  },
  {
    label: 'OAS Spread',
    backendDtoAttrName: 'oasSpread',
    deltaOptions: [
      'DoD',
      'WoW',
      'MoM',
      'Ytd'
    ]
  },
  {
    label: 'Z-Spread',
    backendDtoAttrName: 'zSpread',
    deltaOptions: [
      'DoD',
      'WoW',
      'MoM',
      'Ytd'
    ]
  },
  {
    label: 'YieldWorst',
    backendDtoAttrName: 'yieldWorst',
    deltaOptions: [
      'DoD',
      'WoW',
      'MoM',
      'Ytd'
    ]
  },
  {
    label: 'Asset Swap Spread (into USD)',
    backendDtoAttrName: 'aswUsd',
    deltaOptions: [
      'DoD',
      'WoW',
      'MoM',
      'Ytd'
    ]
  }
];

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
  },
  {
    label: 'Best Quote (Bid vs Ask)',
    attrName: null,
    underlineAttrName: null,
    readyStage: 3,
    isForQuantComparer: true,
    active: true
  },{
    label: 'Mark',
    attrName: null,
    underlineAttrName: null,
    readyStage: 3,
    active: true
  },{
    label: 'Mark Discrepancy',
    attrName: null,
    underlineAttrName: null,
    readyStage: 3,
    isFrontEndMetric: true,
    active: true
  },
  {
    label: 'Position',
    attrName: 'positionInMM',
    underlineAttrName: 'position',
    readyStage: 1,
    active: true
  },{
    label: '30 Day Delta',
    attrName: SecurityMetricOptions[0].label,
    underlineAttrName: SecurityMetricOptions[0].label,
    readyStage: 2,
    isPartOfMetricPack: true,
    metricPackDeltaScope: 'MoM',
    active: true
  },{
    label: 'Quote Count (48hrs)',
    attrName: null,
    underlineAttrName: null,
    readyStage: 3,
    active: false,
    disabled: true
  },{
    label: 'Rating',
    attrName: null,
    underlineAttrName: null,
    readyStage: 2,
    active: false,
    disabled: true
  },{
    label: 'Tenor',
    attrName: null,
    underlineAttrName: null,
    readyStage: 2,
    active: false,
    disabled: true
  },{
    label: 'Seniority',
    attrName: null,
    underlineAttrName: null,
    readyStage: 2,
    active: false,
    disabled: true
  },{
    label: 'Obligor',
    attrName: null,
    underlineAttrName: null,
    readyStage: 2,
    active: false,
    disabled: true
  }
];