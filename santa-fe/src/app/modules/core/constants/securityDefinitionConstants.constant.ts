import {
  SecurityDefinitionStub,
  SecurityDefinitionBundleStub,
  SecurityDefinitionMapStub,
  SecurityMetricOptionStub,
  SearchShortcutStub
} from 'FEModels/frontend-stub-models.interface';

import { APIUrlMap } from 'Core/constants/coreConstants.constant';

// internal constants
  const FilterOptionsBoolean = [
    'Y',
    'N'
  ];

  const FilterOptionsBailInStatus = [
    'Bail in',
    'Not bail in'
  ];

  export const FilterOptionsCurrency = [
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

  export const FilterOptionsRating = [
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

  export const FilterOptionsTenor = [
    // '0.25Y','0.5Y','0.75Y','1Y',
    '2Y',
    '3Y',
    // '4Y',
    '5Y',
    // '6Y',
    '7Y',
    // '8Y',
    // '9Y',
    '10Y',
    // '15Y','25Y',
    '20Y',
    '30Y',
    // '40Y','50Y'
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
    'Technology',
    'Consumer Discretionary'
  ];

  const FilterOptionsMaturityType = [
    'Bullet',
    'Callable',
    'Perpetual'
  ];

  const FilterOptionsSeniorityType = [
    'Secured',  // 0
    '1st lien',  // 1
    '2nd lien',  // 2
    '3rd lien',  // 3
    'Asset Backed',  // 4
    'Sr Preferred',  // 5
    'Sr Unsecured',  // 6
    'Sr Non Preferred',  // 7
    'Unsecured',  // 8
    'SLA',  // 9
    'Sr Subordinated',  // 10
    'Subordinated',  // 11
    'Jr Subordinated'  // 12
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

  export const FilterOptionsPortfolioList = [
    'DOF',
    'SOF',
    'STIP',
    'FIP',
    'CIP',
    'AGB',
    'BBB'
  ];

  const FilterOptionsPortfolioManagerList = [
    'AY',
    'BT',
    'DA',
    'DJ',
    'DM',
    'IL',
    'PM',
    'RS',
    'SP',
    'ST'
  ];

  export const FilterOptionsPortfolioResearchList = [
    'AG',
    'LC',
    'LP',
    'PD',
    'TW'
  ];

  export const FullOwnerList = [
    'AG',
    'AY',
    'BT',
    'DA',
    'DJ',
    'DM',
    'LC',
    'LP',
    'IL',
    'PD',
    'PM',
    'RS',
    'SP',
    'ST',
    'TW'
  ];

  export const StructuringTeamPMList = [
    'AY',
    'DM',
    'LP'
  ];

  export const BICsLevel1DefinitionList = [
    'Communications',
    'Consumer Discretionary',
    'Consumer Staples',
    'Energy',
    'Financials',
    'Government',
    'Health Care',
    'Industrials',
    'Materials',
    'Not Classified',
    'Real Estate',
    'Technology',
    'Utilities'
  ];


  const FullStrategyList = [
    'Short Carry',
    'STOV',
    'Relative Value',
    'Portfolio Shorts',
    'LTOV - Yield',
    'LTOV - Spread',
    'LTOV - Special Situations',
    'HEDGE',
    'Basis'
  ];

export const SecurityDefinitionMap: SecurityDefinitionMapStub = {
  SECURITY_TYPE: {
    key: 'SECURITY_TYPE',
    displayName: 'Security Type',
    icon: 'fal fa-slash',
    optionList: FilterOptionsSecurityType,
    locked: true
  },
  BACKEND_TENOR: {
    key: 'BACKEND_TENOR',
    displayName: 'Backend Tenor',
    icon: 'fal fa-desktop',
    secondaryIcon: 'fas fa-history',
    optionList: FilterOptionsTenor
  },
  BAIL_IN_STATUS: {
    key: 'BAIL_IN_STATUS',
    displayName: 'Bail-in Status',
    icon: 'fas fa-shield-alt',
    optionList: FilterOptionsBailInStatus
  },
  COUPON_TYPE: {
    key: 'COUPON_TYPE',
    displayName: 'Coupon Type',
    icon: 'fas fa-ticket-alt',
    optionList: FilterOptionsCouponType,
    locked: true
  },
  CURRENCY: {
    key: 'CURRENCY',
    displayName: 'Currency',
    icon: 'fas fa-dollar-sign',
    optionList: FilterOptionsCurrency,
    securityDTOAttr: 'currency',
    locked: true
  },
  INDUSTRY: {
    key: 'INDUSTRY',
    displayName: 'Industry',
    icon: 'fal fa-city',
    optionList: FilterOptionsIndustryType,
    securityDTOAttr: 'industry'
  },
  MATURITY: {
    key: 'MATURITY',
    displayName: 'Maturity Type',
    icon: 'fal fa-seedling',
    optionList: FilterOptionsMaturityType
  },
  IS_NEWISSUE: {
    key: 'IS_NEWISSUE',
    displayName: 'New Issue',
    icon: 'far fa-sparkles',
    optionList: FilterOptionsBoolean
  },
  IS_ONTHERUN: {
    key: 'IS_ONTHERUN',
    displayName: 'On-the-Run',
    icon: 'fal fa-handshake',
    optionList: FilterOptionsBoolean
  },
  RATING: {
    key: 'RATING',
    displayName: 'Rating',
    icon: 'fas fa-award',
    optionList: FilterOptionsRating,
    securityDTOAttr: 'ratingValue'
  },
  RATING_BUCKET: {
    key: 'RATING_BUCKET',
    displayName: 'Rating Bucket',
    icon: 'fas fa-trash',
    optionList: FilterOptionsRatingBucket,
    secondaryIcon: 'fas fa-award',
    securityDTOAttr: 'ratingBucket'
  },
  SECTOR: {
    key: 'SECTOR',
    displayName: 'Sector',
    icon: 'fas fa-chart-pie',
    optionList: FilterOptionsSectorType,
    securityDTOAttr: 'sector'
  },
  SENIORITY: {
    key: 'SENIORITY',
    displayName: 'Seniority',
    icon: 'fal fa-gavel',
    optionList: FilterOptionsSeniorityType,
    securityDTOAttr: 'seniority'
  },
  TENOR: {
    key: 'TENOR',
    displayName: 'Tenor',
    icon: 'fal fa-history',
    optionList: FilterOptionsTenor
  },
  PORTFOLIO: {
    key: 'PORTFOLIO',
    displayName: 'Portfolio',
    icon: 'fal fa-file-invoice-dollar',
    optionList: FilterOptionsPortfolioList,
    securityDTOAttr: 'portfolios'
  },
  PRIMARY_PORTFOLIO_MANAGER: {
    key: 'PRIMARY_PORTFOLIO_MANAGER',
    displayName: 'Primary',
    icon: 'fas fa-user-tie',
    optionList: FilterOptionsPortfolioManagerList,
    securityDTOAttr: 'primaryPmName'
  },
  BACKUP_PORTFOLIO_MANAGER: {
    key: 'BACKUP_PORTFOLIO_MANAGER',
    displayName: 'Backup',
    icon: 'fal fa-user-tie',
    optionList: FilterOptionsPortfolioManagerList,
    securityDTOAttr: 'backupPmName'
  },
  RESEARCH: {
    key: 'RESEARCH',
    displayName: 'Research',
    icon: 'fas fa-user-chart',
    optionList: FilterOptionsPortfolioResearchList,
    securityDTOAttr: 'researchName'
  },
  OWNER: {
    key: 'OWNER',
    displayName: 'Owner',
    icon: 'fad fa-users',
    optionList: FullOwnerList,
    securityDTOAttr: 'owner'
  },
  STRATEGY: {
    key: 'STRATEGY',
    displayName: 'Strategy',
    icon: 'fal fa-chess',
    optionList: FullStrategyList,
    securityDTOAttr: 'strategyList'
  },
  COUNTRY: {
    key: 'COUNTRY',
    displayName: 'Country',
    icon: 'fal fa-globe-americas',
    optionList: [],
    securityDTOAttr: 'country'
  },
  QUOTED_TODAY: {
    key: 'QUOTED_TODAY',
    displayName: 'Quoted Today',
    icon: 'far fa-calendar-day',
    optionList: FilterOptionsBoolean
  },
  OVERRIDE: {
    key: 'OVERRIDE',
    displayName: 'Custom',
    icon: 'fas fa-star',
    optionList: []
  },
  BICS_LEVEL_1: {
    key: 'BICS_LEVEL_1',
    displayName: 'BICS Lv.1',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel1'
  },
  BICS_LEVEL_2: {
    key: 'BICS_LEVEL_2',
    displayName: 'BICS Lv.2',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel2'
  },
  BICS_LEVEL_3: {
    key: 'BICS_LEVEL_3',
    displayName: 'BICS Lv.3',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel3'
  },
  BICS_LEVEL_4: {
    key: 'BICS_LEVEL_4',
    displayName: 'BICS Lv.4',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel4'
  },
  TICKER: {
    key: 'TICKER',
    displayName: 'Ticker',
    icon: 'fas fa-user-tie',
    optionList: [],
    securityDTOAttr: 'ticker'
  },
};

export const ConfiguratorDefinitionLayout: Array<SecurityDefinitionBundleStub> = [
  {
    label: 'Basic',
    list: [
      SecurityDefinitionMap.PORTFOLIO,
      SecurityDefinitionMap.COUPON_TYPE,
      SecurityDefinitionMap.CURRENCY,
      SecurityDefinitionMap.RATING,
      SecurityDefinitionMap.TENOR,
      SecurityDefinitionMap.STRATEGY,
      SecurityDefinitionMap.COUNTRY
    ]
  }, {
    label: 'BICS',
    list: [
      SecurityDefinitionMap.BICS_LEVEL_1,
      SecurityDefinitionMap.BICS_LEVEL_2,
      SecurityDefinitionMap.BICS_LEVEL_3,
      SecurityDefinitionMap.BICS_LEVEL_4
    ]
  },{
    label: 'Owner',
    list: [
      SecurityDefinitionMap.OWNER,
      SecurityDefinitionMap.PRIMARY_PORTFOLIO_MANAGER,
      SecurityDefinitionMap.BACKUP_PORTFOLIO_MANAGER,
      SecurityDefinitionMap.RESEARCH
    ]
  },{
    label: 'Quality',
    list: [
      SecurityDefinitionMap.RATING_BUCKET,
      SecurityDefinitionMap.SENIORITY
    ]
  },{
    label: 'Bond',
    list: [
      SecurityDefinitionMap.SECURITY_TYPE,
      SecurityDefinitionMap.BACKEND_TENOR,
      SecurityDefinitionMap.BAIL_IN_STATUS,
      SecurityDefinitionMap.MATURITY,
      SecurityDefinitionMap.IS_NEWISSUE,
      SecurityDefinitionMap.IS_ONTHERUN
    ]
  }
];

export const SeniorityValueToLevelMapping = [
  {
    level: 1,
    values: ['Secured']
  },{
    level: 2,
    values: ['Senior']
  },{
    level: 3,
    values: ['SLA']
  },{
    level: 4,
    values: ['Subordinated']
  }
];

export const RatingValueToLevelMapping = [
  {
    level: 1,
    values: ['AAA', 'AA']
  },{
    level: 2,
    values: ['A']
  },{
    level: 3,
    values: ['BBB']
  },{
    level: 4,
    values: ['BB', 'B']
  },{
    level: 5,
    values: ['CCC', 'CC', 'C', 'D']
  },{
    level: 6,
    values: ['NR']
  }
];

export const FILTER_OPTION_LIST_EXTREME_LONG_THRESHOLD = 200;