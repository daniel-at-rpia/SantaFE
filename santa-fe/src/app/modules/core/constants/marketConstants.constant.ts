import {
  SecurityDefinitionStub,
  SecurityDefinitionBundleStub,
  SecurityMetricOptionStub,
  WatchlistStub
} from 'FEModels/frontend-stub-models.interface';

import { SecurityMetricOptions } from './coreConstants.constant';

export const MetricRenderDelay = 300;

export const Watchlists: Array<WatchlistStub> = [
  {
    displayTitle: 'Grouped by rating',
    includedDefinitions: [
      {
        definitionKey: 'SECURITY_TYPE',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'RATING',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'CURRENCY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: true,
        selectedOptions: ['Fixed', 'Float']
      }
    ]
  },{
    displayTitle: 'Grouped by sector',
    includedDefinitions: [
      {
        definitionKey: 'SECURITY_TYPE',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'SECTOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'CURRENCY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: true,
        selectedOptions: ['Fixed', 'Float']
      }
    ]
  },{
    displayTitle: 'Grouped by tenor',
    includedDefinitions: [
      {
        definitionKey: 'SECURITY_TYPE',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'TENOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'CURRENCY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: true,
        selectedOptions: ['Fixed', 'Float']
      }
    ]
  },{
    displayTitle: 'Grouped by rating and sector',
    includedDefinitions: [
      {
        definitionKey: 'SECURITY_TYPE',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'RATING',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'SECTOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'CURRENCY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: true,
        selectedOptions: ['Fixed', 'Float']
      }
    ]
  },{
    displayTitle: 'Grouped by sector and tenor',
    includedDefinitions: [
      {
        definitionKey: 'SECURITY_TYPE',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'SECTOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'TENOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'CURRENCY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: true,
        selectedOptions: ['Fixed', 'Float']
      }
    ]
  },{
    displayTitle: 'Grouped by rating, sector and tenor',
    includedDefinitions: [
      {
        definitionKey: 'SECURITY_TYPE',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'RATING',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'SECTOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'TENOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'CURRENCY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: true,
        selectedOptions: ['Fixed', 'Float']
      }
    ]
  },{
    displayTitle: 'Financials grouped by rating, seniority, and tenor',
    includedDefinitions: [
      {
        definitionKey: 'SECURITY_TYPE',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'SECTOR',
        groupByActive: false,
        selectedOptions: ['Financials']
      },{
        definitionKey: 'CURRENCY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'RATING',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'TENOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'SENIORITY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: true,
        selectedOptions: ['Fixed', 'Float']
      }
    ]
  },
];

export const GroupMetricOptions:Array<SecurityMetricOptionStub> = SecurityMetricOptions;

export const PieChartConfiguratorOptions = {
  left: [
    'BAIL_IN_STATUS',
    'CURRENCY',
    'COUPON_TYPE',
    'INDUSTRY',
    'TICKER',
    'RATING'
  ],
  right: [
    'RATING_BUCKET',
    'SECTOR',
    'SENIORITY',
    'SUB_INDUSTRY',
    'TENOR',
    'MATURITY'
  ]
}