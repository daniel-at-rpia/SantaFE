import {
  SecurityDefinitionStub,
  SecurityDefinitionBundleStub,
  SecurityMetricOptionStub,
  SearchShortcutStub
} from 'FEModels/frontend-stub-models.interface';

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
    'EUR',
    'GBP',
    'USD'
  ];

  const FilterOptionsCouponType = [
    'Float',
    'Fixed',
    'None'
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
    'HY',
    'IG',
    'NR',
    'Xover'
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

export const SecurityDefinitionMap: Array<SecurityDefinitionStub> = [
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
    urlForGetLongOptionListFromServer: 'santaObligor/get-santa-issuers'
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
    urlForGetLongOptionListFromServer: 'santaObligor/get-santa-subindustries'
  },{
    key: 'TENOR',
    displayName: 'Tenor',
    icon: 'fal fa-history',
    optionList: FilterOptionsTenor
  }
];

export const ConfiguratorDefinitionLayout: Array<SecurityDefinitionBundleStub> = [
  {
    label: 'Basic',
    list: [
      SecurityDefinitionMap[3],
      SecurityDefinitionMap[4],
      SecurityDefinitionMap[10],
      SecurityDefinitionMap[12],
      SecurityDefinitionMap[15]
    ]
  },{
    label: 'Quality',
    list: [
      SecurityDefinitionMap[11],
      SecurityDefinitionMap[13]
    ]
  },{
    label: 'Issuer',
    list: [
      SecurityDefinitionMap[5],
      SecurityDefinitionMap[14],
      SecurityDefinitionMap[6]
    ]
  },{
    label: 'Bond',
    list: [
      SecurityDefinitionMap[0],
      SecurityDefinitionMap[1],
      SecurityDefinitionMap[2],
      SecurityDefinitionMap[7],
      SecurityDefinitionMap[8],
      SecurityDefinitionMap[9]
    ]
  }
];
