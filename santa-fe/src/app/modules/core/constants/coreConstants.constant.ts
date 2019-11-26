import {
  SecurityTableMetricStub,
  SecurityMetricOptionStub,
  TriCoreMetricConfigStub
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

export const TriCoreMetricConfig: TriCoreMetricConfigStub = {
  TSpread: {
    label: 'TSpread',
    tier2Threshold: 20,
    inversed: false,
    rounding: 0,
    metricLabel: SecurityMetricOptions[0].label
  },
  Yield: {
    label: 'Yield',
    tier2Threshold: 1,
    inversed: false,
    rounding: 3,
    metricLabel: SecurityMetricOptions[6].label
  },
  Price: {
    label: 'Price',
    tier2Threshold: 3,
    inversed: true,
    rounding: 1,
    metricLabel: SecurityMetricOptions[1].label
  }
}