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

  const FilterOptionsPortfolioList = [
    'DOF',
    'SOF',
    'STIP',
    'FIP',
    'CIP',
    'AGB'
  ];

  const FilterOptionsPortfolioManagerList = [
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

  const FilterOptionsPortfolioResearchList = [
    'AG',
    'LC',
    'LP',
    'PD',
    'TW'
  ];

  export const FullOwnerList = [
    'AG',
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
  'SECURITY_TYPE': {
    key: 'SECURITY_TYPE',
    displayName: 'Security Type',
    icon: 'fal fa-slash',
    optionList: FilterOptionsSecurityType,
    locked: true
  },
  'BACKEND_TENOR': {
    key: 'BACKEND_TENOR',
    displayName: 'Backend Tenor',
    icon: 'fal fa-desktop',
    secondaryIcon: 'fas fa-history',
    optionList: FilterOptionsTenor
  },
  'BAIL_IN_STATUS': {
    key: 'BAIL_IN_STATUS',
    displayName: 'Bail-in Status',
    icon: 'fas fa-shield-alt',
    optionList: FilterOptionsBailInStatus
  },
  'COUPON_TYPE': {
    key: 'COUPON_TYPE',
    displayName: 'Coupon Type',
    icon: 'fas fa-ticket-alt',
    optionList: FilterOptionsCouponType
  },
  'CURRENCY': {
    key: 'CURRENCY',
    displayName: 'Currency',
    icon: 'fal fa-dollar-sign',
    optionList: FilterOptionsCurrency,
    securityDTOAttr: 'currency'
  },
  'INDUSTRY': {
    key: 'INDUSTRY',
    displayName: 'Industry',
    icon: 'fal fa-city',
    optionList: FilterOptionsIndustryType,
    securityDTOAttr: 'industry'
  },
  'ISSUER': {
    key: 'ISSUER',
    displayName: 'Issuer',
    icon: 'fas fa-user-tie',
    optionList: [],
    urlForGetLongOptionListFromServer: APIUrlMap.getIssuers
  },
  'MATURITY': {
    key: 'MATURITY',
    displayName: 'Maturity Type',
    icon: 'fal fa-seedling',
    optionList: FilterOptionsMaturityType
  },
  'IS_NEWISSUE': {
    key: 'IS_NEWISSUE',
    displayName: 'New Issue',
    icon: 'far fa-sparkles',
    optionList: FilterOptionsBoolean
  },
  'IS_ONTHERUN': {
    key: 'IS_ONTHERUN',
    displayName: 'On-the-Run',
    icon: 'fal fa-handshake',
    optionList: FilterOptionsBoolean
  },
  'RATING': {
    key: 'RATING',
    displayName: 'Rating',
    icon: 'fas fa-award',
    optionList: FilterOptionsRating,
    securityDTOAttr: 'ratingValue'
  },
  'RATING_BUCKET': {
    key: 'RATING_BUCKET',
    displayName: 'Rating Bucket',
    icon: 'fas fa-trash',
    optionList: FilterOptionsRatingBucket,
    secondaryIcon: 'fas fa-award',
    securityDTOAttr: 'ratingBucket'
  },
  'SECTOR': {
    key: 'SECTOR',
    displayName: 'Sector',
    icon: 'fal fa-chart-pie',
    optionList: FilterOptionsSectorType,
    securityDTOAttr: 'sector'
  },
  'SENIORITY': {
    key: 'SENIORITY',
    displayName: 'Seniority',
    icon: 'fal fa-gavel',
    optionList: FilterOptionsSeniorityType,
    securityDTOAttr: 'seniority'
  },
  'SUB_INDUSTRY': {
    key: 'SUB_INDUSTRY',
    displayName: 'Sub-Industry',
    icon: 'fal fa-building',
    optionList: [],
    urlForGetLongOptionListFromServer: APIUrlMap.getSubIndustries
  },
  'TENOR': {
    key: 'TENOR',
    displayName: 'Tenor',
    icon: 'fal fa-history',
    optionList: FilterOptionsTenor
  },
  'PORTFOLIO': {
    key: 'PORTFOLIO',
    displayName: 'Portfolio',
    icon: 'fal fa-file-invoice-dollar',
    optionList: FilterOptionsPortfolioList,
    securityDTOAttr: 'portfolios'
  },
  'PRIMARY_PORTFOLIO_MANAGER': {
    key: 'PRIMARY_PORTFOLIO_MANAGER',
    displayName: 'Primary PM',
    icon: 'fas fa-user-tie',
    optionList: FilterOptionsPortfolioManagerList,
    securityDTOAttr: 'primaryPmName'
  },
  'BACKUP_PORTFOLIO_MANAGER': {
    key: 'BACKUP_PORTFOLIO_MANAGER',
    displayName: 'Backup PM',
    icon: 'fal fa-user-tie',
    optionList: FilterOptionsPortfolioManagerList,
    securityDTOAttr: 'backupPmName'
  },
  'RESEARCH': {
    key: 'RESEARCH',
    displayName: 'Research',
    icon: 'fal fa-user-chart',
    optionList: FilterOptionsPortfolioResearchList,
    securityDTOAttr: 'researchName'
  },
  'OWNER': {
    key: 'OWNER',
    displayName: 'Owner',
    icon: 'fad fa-users',
    optionList: FullOwnerList,
    securityDTOAttr: 'owner'
  },
  'STRATEGY': {
    key: 'STRATEGY',
    displayName: 'Strategy',
    icon: 'fal fa-chess',
    optionList: FullStrategyList,
    securityDTOAttr: 'strategyList'
  }
};

export const ConfiguratorDefinitionLayout: Array<SecurityDefinitionBundleStub> = [
  {
    label: 'Basic',
    list: [
      SecurityDefinitionMap.PORTFOLIO,
      SecurityDefinitionMap.COUPON_TYPE,
      SecurityDefinitionMap.CURRENCY,
      SecurityDefinitionMap.RATING,
      SecurityDefinitionMap.SECTOR,
      SecurityDefinitionMap.TENOR,
      SecurityDefinitionMap.STRATEGY
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
    label: 'Issuer',
    list: [
      SecurityDefinitionMap.INDUSTRY,
      SecurityDefinitionMap.SUB_INDUSTRY,
      SecurityDefinitionMap.ISSUER
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
