import { SecurityDefinitionStub } from 'App/models/frontend/frontend-stub-models.interface';

const FilterOptionsBoolean = [
  'Yes',
  'No'
];

const FilterOptionsBailInStatus = [
  'Bail In',
  'Not Bail In'
];

const FilterOptionsCurrency = [
  'CAD',
  'USD',
  'EUR',
  'GBP'
];

const FilterOptionsCouponType = [
  'Float',
  'None',
  'Fixed for Life',
  'Fixed-to-Float'
];

const FilterOptionsRating = [
  'AAA',
  'AA+',
  'AA',
  'AA-',
  'A+',
  'A',
  'A-',
  'BBB+',
  'BBB',
  'BBB-',
  'BB+',
  'BB',
  'BB-',
  'B+',
  'B',
  'B-',
  'CCC+',
  'CCC',
  'CCC-',
  'CC+',
  'CC',
  'CC-',
  'C',
  'D',
  'NR'
];

const FilterOptionsRatingBucket = [
  'Xover',
  'IG',
  'HY',
  'NR'
];

const FilterOptionsTenor = [
  '0.25Y',
  '0.5Y',
  '0.75Y',
  '1Y',
  '2Y',
  '3Y',
  '4Y',
  '5Y',
  '6Y',
  '7Y',
  '8Y',
  '9Y',
  '10Y',
  '15Y',
  '20Y',
  '25Y',
  '30Y',
  '40Y',
  '50Y'
];

const FilterOptionsSecurityType = [
  'Bond',
  'CDS'
];

const FilterOptionsTempPlaceholder = [
  'Option 1',
  'Option 2',
  'Option 3'
]

export const SecurityGroupDefinitionMap: Array<SecurityDefinitionStub> = [
  {
    key: 'SECURITY_TYPE',
    displayName: 'Security Type',
    icon: 'fal fa-slash',
    optionList: FilterOptionsSecurityType,
    locked: true
  },{
    key: 'RATING',
    displayName: 'Rating',
    icon: 'fas fa-award',
    optionList: FilterOptionsRating
  },{
    key: 'CURRENCY',
    displayName: 'Currency',
    icon: 'fal fa-dollar-sign',
    optionList: FilterOptionsCurrency
  },{
    key: 'TENOR',
    displayName: 'Tenor',
    icon: 'fal fa-history',
    optionList: FilterOptionsTenor
  },{
    key: 'BACKEND_TENOR',
    displayName: 'Backend Tenor',
    icon: 'fal fa-desktop',
    secondaryIcon: 'fas fa-history',
    optionList: FilterOptionsTenor
  },{
    key: 'BAIL_IN_STATUS',
    displayName: 'Bail-in Status',
    icon: 'fas fa-shield-alt',
    optionList: FilterOptionsBailInStatus
  },{
    key: 'COUPON_TYPE',
    displayName: 'Coupon Type',
    icon: 'fas fa-ticket-alt',
    optionList: FilterOptionsCouponType
  },{
    key: 'INDUSTRY',
    displayName: 'Industry',
    icon: 'fal fa-city',
    optionList: FilterOptionsTempPlaceholder
  },{
    key: 'ISSUER',
    displayName: 'Issuer',
    icon: 'fas fa-user-tie',
    optionList: FilterOptionsTempPlaceholder
  },{
    key: 'RATING_BUCKET',
    displayName: 'Rating Bucket',
    icon: 'fas fa-trash',
    optionList: FilterOptionsRatingBucket,
    secondaryIcon: 'fas fa-award'
  },{
    key: 'SECTOR',
    displayName: 'Sector',
    icon: 'fal fa-chart-pie',
    optionList: FilterOptionsTempPlaceholder
  },{
    key: 'SENIORITY',
    displayName: 'Seniority',
    icon: 'fal fa-gavel',
    optionList: FilterOptionsTempPlaceholder
  },{
    key: 'SUB_INDUSTRY',
    displayName: 'Sub-Industry',
    icon: 'fal fa-building',
    optionList: FilterOptionsTempPlaceholder
  },{
    key: 'MATURITY',
    displayName: 'Bullet',
    icon: 'fas fa-bolt',
    optionList: FilterOptionsBoolean
  },{
    key: 'IS_NEWISSUE',
    displayName: 'New Issue',
    icon: 'far fa-sparkles',
    optionList: FilterOptionsBoolean
  },{
    key: 'IS_ONTHERUN',
    displayName: 'On-the-Run',
    icon: 'far fa-running',
    optionList: FilterOptionsBoolean
  }
];

export const MetricOptions = [
  {
    label: 'Tenor',
    deltaOptions: [
      'DoD',
      'WoW',
      'Mtd',
      'MoM',
      'Ytd'
    ]
  },
  {
    label: 'Size',
    deltaOptions: [
      'DoD',
      'WoW',
      'Mtd',
      'MoM',
      'Ytd'
    ]
  },
  {
    label: 'oasSpread',
    deltaOptions: [
      'DoD',
      'WoW',
      'Mtd',
      'MoM',
      'Ytd'
    ]
  },
  {
    label: 'Price',
    deltaOptions: [
      'DoD',
      'WoW',
      'Mtd',
      'MoM',
      'Ytd'
    ]
  },
  {
    label: 'YieldMaturity',
    deltaOptions: [
      'DoD',
      'WoW',
      'Mtd',
      'MoM',
      'Ytd'
    ]
  },
  {
    label: 'YieldWorst',
    deltaOptions: [
      'DoD',
      'WoW',
      'Mtd',
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