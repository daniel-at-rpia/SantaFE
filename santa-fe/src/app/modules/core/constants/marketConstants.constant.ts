import {
  SecurityDefinitionStub,
  SecurityDefinitionBundleStub,
  SecurityMetricOptionStub,
  SearchShortcutStub
} from 'FEModels/frontend-stub-models.interface';

export const MetricRenderDelay = 300;

export const SearchShortcuts: Array<SearchShortcutStub> = [
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


export const BackendKeyDictionary = {
  // definitions
  'SECURITY_TYPE': 'SecurityType',
  'RATING': 'RatingNoNotch',
  'CURRENCY': 'Ccy',
  'TENOR': 'Tenor',
  'IS_ONTHERUN': 'IsOnTheRun',
  'RATING_BUCKET': 'RatingBucket',
  'BAIL_IN_STATUS': 'BailInStatus',
  'COUPON_TYPE': 'CouponType',
  'INDUSTRY': 'Industry',
  'IS_NEWISSUE': 'IsNewIssue',
  'ISSUER': 'Issuer',
  'MATURITY': 'MaturityType',
  'SECTOR': 'Sector',
  'SENIORITY': 'Seniority',
  'SUB_INDUSTRY': 'SubIndustry',
  'BACKEND_TENOR': 'BackendTenor',


  // metrics
  'SPREAD': 'oasSpread',
  'PRICE': 'price',
  'YIELD': 'yieldWorst',
  'SIZE': 'marketValue'
};

export const GroupMetricOptions:Array<SecurityMetricOptionStub> = [
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
]

export const PieChartConfiguratorOptions = {
  left: [
    'BAIL_IN_STATUS',
    'CURRENCY',
    'COUPON_TYPE',
    'INDUSTRY',
    'ISSUER',
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