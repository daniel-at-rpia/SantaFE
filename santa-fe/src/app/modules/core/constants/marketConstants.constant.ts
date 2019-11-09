import {
  SecurityDefinitionStub,
  SecurityDefinitionSectionStub,
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
        selectedOptions: []
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
        selectedOptions: []
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
        selectedOptions: []
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
        selectedOptions: []
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
        selectedOptions: []
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
        selectedOptions: []
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
        selectedOptions: []
      }
    ]
  },
];

// internal constants
  const FilterOptionsBoolean = [
    'Y',
    'N'
  ];

  const FilterOptionsBailInStatus = [
    'Bail in',
    'Not bail in'
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
    'Fixed'
  ];

  const FilterOptionsRating = [
    'AAA',
    'AA',
    'A',
    'BBB',
    'BB',
    'B',
    'CCC',
    'CC',
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
  //  '0.25Y',
  //  '0.5Y',
  //  '0.75Y',
  //  '1Y',
    '2Y',
    '3Y',
  //  '4Y',
    '5Y',
  //  '6Y',
    '7Y',
  //  '8Y',
  //  '9Y',
    '10Y',
  //  '15Y',
  //  '20Y',
  //  '25Y',
    '30Y',
  //  '40Y',
  //  '50Y'
  ];

  const FilterOptionsSecurityType = [
    'Bond',
    'CDS'
  ];

  const FilterOptionsSectorType = [
    'Auto',
    'Basic Material',
    'Communication',
    'Consumers',
    'Diversified',
    'Energy',
    'Financials',
    'Health Care',
    'Industrial',
    'Real Estate',
    'Technology'
  ];

  const FilterOptionsMaturityType = [
    'Bullet',
    'Callable',
    'Perpetual'
  ];

  const FilterOptionsSeniorityType = [
    'Secured',
    '1st lien',
    '2nd lien',
    '3rd lien',
    'Asset Backed',
    'Sr Preferred',
    'Sr Unsecured',
    'Sr Non Preferred',
    'Unsecured',
    'Sr Subordinated',
    'Subordinated',
    'Jr Subordinated'
  ];

  const FilterOptionsTempPlaceholder = [
    'Option 1',
    'Option 2',
    'Option 3'
  ];

  const FilterOptionsIndustryType = [
    'Advertising & Marketing',
    'Aerospace & Defense',
    'Airlines',
    'Apparel & Textile Products',
    'Auto Parts Manufacturing',
    'Automobiles Manufacturing',
    'Banks',
    'Biotechnology',
    'Cable & Satellite',
    'Casinos & Gaming',
    'Chemicals',
    'Coal Operations',
    'Commercial Finance',
    'Communications Equipment',
    'Construction Materials Manufacturing',
    'Consumer Finance',
    'Consumer Products',
    'Consumer Services',
    'Containers & Packaging',
    'Department Stores',
    'Design, Manufacturing & Distribution',
    'Distributors - Consumer Discretionary',
    'Diversified Banks',
    'Diversified Finan Serv',
    'Educational Services',
    'Electrical Equipment Manufacturing',
    'Entertainment Content',
    'Entertainment Resources',
    'Exploration & Production',
    'Financial Services',
    'Food & Beverage',
    'Forest & Paper Products Manufacturing',
    'Funds & Trusts',
    'Hardware',
    'Health Care Facilities & Services',
    'Home & Office Products Manufacturing',
    'Home Improvement',
    'Homebuilders',
    'Industrial Other',
    'Integrated Oils',
    'Internet Media',
    'Leisure Products Manufacturing',
    'Life Insurance',
    'Machinery Manufacturing',
    'Managed Care',
    'Manufactured Goods',
    'Mass Merchants',
    'Medical Equipment & Devices Manufacturing',
    'Metals & Mining',
    'Oil & Gas Services & Equipment',
    'Pharmaceuticals',
    'Pipeline',
    'Power Generation',
    'Property & Casualty Insurance',
    'Publishing & Broadcasting',
    'Railroad',
    'Real Estate',
    'Refining & Marketing',
    'Renewable Energy',
    'Restaurants',
    'Retail - Consumer Discretionary',
    'Retail - Consumer Staples',
    'Semiconductors',
    'Software & Services',
    'Supermarkets & Pharmacies',
    'Tobacco',
    'Transportation & Logistics',
    'Travel & Lodging',
    'Utilities',
    'Waste & Environment Services & Equipment',
    'Wireless Telecommunications Services'
  ];

export const SecurityGroupDefinitionMap: Array<SecurityDefinitionStub> = [
  {
    key: 'SECURITY_TYPE',
    displayName: 'Security Type',
    icon: 'fal fa-slash',
    optionList: FilterOptionsSecurityType,
    locked: true
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
    key: 'CURRENCY',
    displayName: 'Currency',
    icon: 'fal fa-dollar-sign',
    optionList: FilterOptionsCurrency
  },{
    key: 'INDUSTRY',
    displayName: 'Industry',
    icon: 'fal fa-city',
    optionList: FilterOptionsIndustryType
  },{
    key: 'ISSUER',
    displayName: 'Issuer',
    icon: 'fas fa-user-tie',
    optionList: [],
    urlForGetLongOptionListFromServer: 'santaSecurity/get-santa-issuers'
  },{
    key: 'MATURITY',
    displayName: 'Maturity Type',
    icon: 'fal fa-seedling',
    optionList: FilterOptionsMaturityType
  },{
    key: 'IS_NEWISSUE',
    displayName: 'New Issue',
    icon: 'far fa-sparkles',
    optionList: FilterOptionsBoolean
  },{
    key: 'IS_ONTHERUN',
    displayName: 'On-the-Run',
    icon: 'fal fa-handshake',
    optionList: FilterOptionsBoolean
  },{
    key: 'RATING',
    displayName: 'Rating',
    icon: 'fas fa-award',
    optionList: FilterOptionsRating
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
    optionList: FilterOptionsSectorType
  },{
    key: 'SENIORITY',
    displayName: 'Seniority',
    icon: 'fal fa-gavel',
    optionList: FilterOptionsSeniorityType
  },{
    key: 'SUB_INDUSTRY',
    displayName: 'Sub-Industry',
    icon: 'fal fa-building',
    optionList: [],
    urlForGetLongOptionListFromServer: 'santaSecurity/get-santa-subindustries'
  },{
    key: 'TENOR',
    displayName: 'Tenor',
    icon: 'fal fa-history',
    optionList: FilterOptionsTenor
  }
];

export const ConfiguratorDefinitionLayout: Array<SecurityDefinitionSectionStub> = [
  {
    label: 'Basic',
    list: [
      SecurityGroupDefinitionMap[3],
      SecurityGroupDefinitionMap[4],
      SecurityGroupDefinitionMap[10],
      SecurityGroupDefinitionMap[12],
      SecurityGroupDefinitionMap[15]
    ]
  },{
    label: 'Quality',
    list: [
      SecurityGroupDefinitionMap[11],
      SecurityGroupDefinitionMap[13]
    ]
  },{
    label: 'Issuer',
    list: [
      SecurityGroupDefinitionMap[5],
      SecurityGroupDefinitionMap[14],
      SecurityGroupDefinitionMap[6]
    ]
  },{
    label: 'Bond',
    list: [
      SecurityGroupDefinitionMap[0],
      SecurityGroupDefinitionMap[1],
      SecurityGroupDefinitionMap[2],
      SecurityGroupDefinitionMap[7],
      SecurityGroupDefinitionMap[8],
      SecurityGroupDefinitionMap[9]
    ]
  }
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

export const MetricOptions:Array<SecurityMetricOptionStub> = [
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