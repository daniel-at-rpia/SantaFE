import {
  SecurityDefinitionStub,
  SecurityDefinitionBundleStub,
  SecurityDefinitionMapStub,
  SecurityMetricOptionStub,
  SearchShortcutStub
} from 'FEModels/frontend-stub-models.interface';
import { FrontendKeyToBackendKeyDictionary } from 'Core/constants/coreConstants.constant';
import {
  TraceTradeParty,
  traceTradeNumericalFilters
} from 'Core/constants/securityTableConstants.constant';
import { SecurityDefinitionFilterOptionTenorRange } from 'FEModels/frontend-adhoc-packages.interface';
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

  export const FilterOptionsCouponType = [
    'Float',
    'Fixed For Life',
    'Fixed To Float'
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
    '2Y',
    '3Y',
    '5Y',
    '7Y',
    '10Y',
    '20Y',
    '30Y',
  ];

  export const FilterOptionSecuritySubType = [
    'AmortizingBond',
    'BA',
    'GovtBond',
    'Corp',
    'FRN',
    'Loan',
    'AT1',
    'Hybrid',
    'Preferred',
    'SPAC',
    'Stock',
    'CDS',
    'CDSIndex'
  ];

  export const FilterOptionsTenorRange: SecurityDefinitionFilterOptionTenorRange  = {
    '2Y': {
      displayLabel: '2Y (<= 2.5)',
      min: 0,
      max: 2.5
    },
    '2Y (<= 2.5)': {
      displayLabel: '2Y (<= 2.5)',
      min: 0,
      max: 2.5
    },
    '3Y': {
      displayLabel: '3Y (2.6 ~ 4.0)',
      min: 2.6,
      max: 4.0
    },
    '3Y (2.6 ~ 4.0)': {
      displayLabel: '3Y (2.6 ~ 4.0)',
      min: 2.6,
      max: 4.0
    },
    '5Y': {
      displayLabel: '5Y (4.1 ~ 6.0)',
      min: 4.1,
      max: 6.0
    },
    '5Y (4.1 ~ 6.0)': {
      displayLabel: '5Y (4.1 ~ 6.0)',
      min: 4.1,
      max: 6.0
    },
    '7Y': {
      displayLabel: '7Y (6.1 ~ 8.5)',
      min: 6.1,
      max: 8.5
    },
    '7Y (6.1 ~ 8.5)': {
      displayLabel: '7Y (6.1 ~ 8.5)',
      min: 6.1,
      max: 8.5
    },
    '10Y': {
      displayLabel: '10Y (8.6 ~ 15.0)',
      min: 8.6,
      max: 15.0
    },
    '10Y (8.6 ~ 15.0)': {
      displayLabel: '10Y (8.6 ~ 15.0)',
      min: 8.6,
      max: 15.0
    },
    '20Y': {
      displayLabel: '20Y (15.1 ~ 25.0)',
      min: 15.1,
      max: 25.0
    },
    '20Y (15.1 ~ 25.0)': {
      displayLabel: '20Y (15.1 ~ 25.0)',
      min: 15.1,
      max: 25.0
    },
    '30Y': {
      displayLabel: '30Y (25.1 ~ 99.9)',
      min: 25.1,
      max: 99.9
    },
    '30Y (25.1 ~ 99.9)': {
      displayLabel: '30Y (25.1 ~ 99.9)',
      min: 25.1,
      max: 99.9
    }
  }

  const FilterOptionsSecurityType = [
    'Bond',
    'GovtBond',
    'Loan',
    'Preferred',
    'Stock',
    'CDS',
    'CDSIndex'
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
    'SECURED',  // 1
    'SR',  // 2
    'SLA',  // 3
    'SUB'  // 4
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
    'DG',
    'DJ',
    'DM',
    'IL',
    'PM',
    'SP',
    'TW'
  ];

  export const FilterOptionsPortfolioResearchList = [
    'AG',
    'LC',
    'LP',
    'PD',
    'RV',
    'TW'
  ];

  export const FullOwnerList = [
    'AG',
    'AY',
    'BT',
    'DA',
    'DG',
    'DJ',
    'DM',
    'LC',
    'LP',
    'IL',
    'PD',
    'PM',
    'RV',
    'SP',
    'TW'
  ];

  export const StructuringAllFunctionalityAvailableList = [
    'AY',
    'DM'
  ]

  export const StructuringTeamPMList = [
    ...StructuringAllFunctionalityAvailableList,
    'LP',
    'PM'
  ];

  export const StructuringEditingViewAvilableList = [
    ...FilterOptionsPortfolioResearchList,
    ...StructuringAllFunctionalityAvailableList
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


  export const FullStrategyList = [
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
    locked: true,
    securityDTOAttr: 'securityType',
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['SECURITY_TYPE'],
    internalOnly: false
  },
  SECURITY_SUB_TYPE: {
    key: 'SECURITY_SUB_TYPE',
    displayName: 'Security Sub-Type',
    icon: 'fal fa-slash',
    optionList: FilterOptionSecuritySubType,
    securityDTOAttr: 'securitySubType',
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['SECURITY_SUB_TYPE'],
    internalOnly: false
  },
  BACKEND_TENOR: {
    key: 'BACKEND_TENOR',
    displayName: 'Backend Tenor',
    icon: 'fal fa-desktop',
    secondaryIcon: 'fas fa-history',
    optionList: FilterOptionsTenor,
    internalOnly: false
  },
  BAIL_IN_STATUS: {
    key: 'BAIL_IN_STATUS',
    displayName: 'Bail-in Status',
    icon: 'fas fa-shield-alt',
    optionList: FilterOptionsBailInStatus,
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['BAIL_IN_STATUS'],
    internalOnly: false
  },
  COUPON_TYPE: {
    key: 'COUPON_TYPE',
    displayName: 'Coupon Type',
    icon: 'fas fa-ticket-alt',
    optionList: FilterOptionsCouponType,
    locked: true,
    securityDTOAttr: 'couponType',
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['COUPON_TYPE'],
    internalOnly: false
  },
  CURRENCY: {
    key: 'CURRENCY',
    displayName: 'Currency',
    icon: 'fas fa-dollar-sign',
    optionList: FilterOptionsCurrency,
    securityDTOAttr: 'currency',
    locked: true,
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['CURRENCY'],
    internalOnly: false
  },
  INDUSTRY: {
    key: 'INDUSTRY',
    displayName: 'Industry',
    icon: 'fal fa-city',
    optionList: FilterOptionsIndustryType,
    securityDTOAttr: 'industry',
    internalOnly: false
  },
  MATURITY: {
    key: 'MATURITY',
    displayName: 'Maturity Type',
    icon: 'fal fa-seedling',
    optionList: FilterOptionsMaturityType,
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['MATURITY'],
    internalOnly: false
  },
  IS_NEWISSUE: {
    key: 'IS_NEWISSUE',
    displayName: 'New Issue',
    icon: 'far fa-sparkles',
    optionList: FilterOptionsBoolean,
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['IS_NEWISSUE'],
    internalOnly: false
  },
  IS_ONTHERUN: {
    key: 'IS_ONTHERUN',
    displayName: 'On-the-Run',
    icon: 'fal fa-handshake',
    optionList: FilterOptionsBoolean,
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['IS_ONTHERUN'],
    internalOnly: false
  },
  RATING: {
    key: 'RATING',
    displayName: 'Rating',
    icon: 'fas fa-award',
    optionList: FilterOptionsRating,
    securityDTOAttr: 'ratingValue',
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['RATING'],
    internalOnly: false
  },
  RATING_BUCKET: {
    key: 'RATING_BUCKET',
    displayName: 'Rating Bucket',
    icon: 'fas fa-trash',
    optionList: FilterOptionsRatingBucket,
    secondaryIcon: 'fas fa-award',
    securityDTOAttr: 'ratingBucket',
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['RATING_BUCKET'],
    internalOnly: false
  },
  SECTOR: {
    key: 'SECTOR',
    displayName: 'Sector',
    icon: 'fas fa-chart-pie',
    optionList: FilterOptionsSectorType,
    securityDTOAttr: 'sector',
    internalOnly: false
  },
  SENIORITY: {
    key: 'SENIORITY',
    displayName: 'Seniority',
    icon: 'fal fa-gavel',
    optionList: FilterOptionsSeniorityType,
    securityDTOAttr: 'seniority',
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['SENIORITY'],
    internalOnly: false
  },
  TENOR: {
    key: 'TENOR',
    displayName: 'Tenor',
    icon: 'fal fa-history',
    optionList: FilterOptionsTenor,
    securityDTOAttr: 'tenor',
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['TENOR'],
    internalOnly: false
  },
  PORTFOLIO: {
    key: 'PORTFOLIO',
    displayName: 'Portfolio',
    icon: 'fal fa-file-invoice-dollar',
    optionList: FilterOptionsPortfolioList,
    securityDTOAttr: 'portfolios',
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['PORTFOLIO'],
    internalOnly: true
  },
  PRIMARY_PORTFOLIO_MANAGER: {
    key: 'PRIMARY_PORTFOLIO_MANAGER',
    displayName: 'Primary',
    icon: 'fas fa-user-tie',
    optionList: FilterOptionsPortfolioManagerList,
    securityDTOAttr: 'primaryPmName',
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['PRIMARY'],
    internalOnly: true
  },
  BACKUP_PORTFOLIO_MANAGER: {
    key: 'BACKUP_PORTFOLIO_MANAGER',
    displayName: 'Backup',
    icon: 'fal fa-user-tie',
    optionList: FilterOptionsPortfolioManagerList,
    securityDTOAttr: 'backupPmName',
    internalOnly: true
  },
  RESEARCH: {
    key: 'RESEARCH',
    displayName: 'Research',
    icon: 'fas fa-user-chart',
    optionList: FilterOptionsPortfolioResearchList,
    securityDTOAttr: 'researchName',
    internalOnly: true
  },
  OWNER: {
    key: 'OWNER',
    displayName: 'Owner',
    icon: 'fad fa-users',
    optionList: FullOwnerList,
    securityDTOAttr: 'owner',
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['OWNER'],
    internalOnly: true
  },
  STRATEGY: {
    key: 'STRATEGY',
    displayName: 'Strategy',
    icon: 'fal fa-chess',
    optionList: FullStrategyList,
    securityDTOAttr: 'strategyList',
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['STRATEGY'],
    internalOnly: true
  },
  COUNTRY: {
    key: 'COUNTRY',
    displayName: 'Country',
    icon: 'fal fa-globe-americas',
    optionList: [],
    securityDTOAttr: 'country',
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['COUNTRY'],
    internalOnly: false
  },
  QUOTED_TODAY: {
    key: 'QUOTED_TODAY',
    displayName: 'Quoted Today',
    icon: 'far fa-calendar-day',
    securityDTOAttr: 'quotedToday',
    optionList: FilterOptionsBoolean,
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['QUOTED_TODAY'],
    internalOnly: false
  },
  OVERRIDE: {
    key: 'OVERRIDE',
    displayName: 'Custom',
    icon: 'fas fa-star',
    optionList: [],
    internalOnly: true
  },
  BICS_CONSOLIDATED: {
    key: 'BICS_CONSOLIDATED',
    displayName: 'All BICS',
    icon: 'fas fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'code',
    securityDTOAttrBlock: 'bics',
    backendDtoAttrName: 'BicsCode',
    internalOnly: false
  },
  BICS_LEVEL_1: {
    key: 'BICS_LEVEL_1',
    displayName: 'BICS Lv.1',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel1',
    securityDTOAttrBlock: 'bics',
    internalOnly: false
  },
  BICS_LEVEL_2: {
    key: 'BICS_LEVEL_2',
    displayName: 'BICS Lv.2',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel2',
    securityDTOAttrBlock: 'bics',
    internalOnly: false
  },
  BICS_LEVEL_3: {
    key: 'BICS_LEVEL_3',
    displayName: 'BICS Lv.3',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel3',
    securityDTOAttrBlock: 'bics',
    internalOnly: false
  },
  BICS_LEVEL_4: {
    key: 'BICS_LEVEL_4',
    displayName: 'BICS Lv.4',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel4',
    securityDTOAttrBlock: 'bics',
    internalOnly: false
  },
  BICS_LEVEL_5: {
    key: 'BICS_LEVEL_5',
    displayName: 'BICS Lv.5',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel5',
    securityDTOAttrBlock: 'bics',
    internalOnly: false
  },
  BICS_LEVEL_6: {
    key: 'BICS_LEVEL_6',
    displayName: 'BICS Lv.6',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel6',
    securityDTOAttrBlock: 'bics',
    internalOnly: false
  },
  BICS_LEVEL_7: {
    key: 'BICS_LEVEL_7',
    displayName: 'BICS Lv.7',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel7',
    securityDTOAttrBlock: 'bics',
    internalOnly: false
  },
  TICKER: {
    key: 'TICKER',
    displayName: 'Ticker',
    icon: 'fas fa-user-tie',
    optionList: [],
    securityDTOAttr: 'ticker',
    backendDtoAttrName: FrontendKeyToBackendKeyDictionary['TICKER'],
    internalOnly: false
  }
};

export enum SecurityDefinitionConfiguratorGroupLabels {
  selected = 'Selected',
  popular = 'Popular',
  standard = 'Standard',
  internal = 'Internal',
  common = 'Common',
  bics = 'BICS',
  bond = 'Bond'
}

export const ConfiguratorDefinitionLayout: Array<SecurityDefinitionBundleStub> = [
  {
    label: SecurityDefinitionConfiguratorGroupLabels.selected,
    list: [
      SecurityDefinitionMap.QUOTED_TODAY
    ]
  },
  {
    label: SecurityDefinitionConfiguratorGroupLabels.popular,
    list: [
      SecurityDefinitionMap.TICKER,
      SecurityDefinitionMap.CURRENCY,
      SecurityDefinitionMap.BICS_CONSOLIDATED,
      SecurityDefinitionMap.SENIORITY,
      SecurityDefinitionMap.RATING,
    ]
  },
  {
    label: SecurityDefinitionConfiguratorGroupLabels.standard,
    list: [
      SecurityDefinitionMap.TENOR,
      SecurityDefinitionMap.COUNTRY,
      SecurityDefinitionMap.RATING_BUCKET,
      SecurityDefinitionMap.SECURITY_TYPE,
      SecurityDefinitionMap.SECURITY_SUB_TYPE,
      SecurityDefinitionMap.COUPON_TYPE,
      SecurityDefinitionMap.MATURITY,
      SecurityDefinitionMap.QUOTED_TODAY
    ]
  },
  {
    label: SecurityDefinitionConfiguratorGroupLabels.internal,
    list: [
      SecurityDefinitionMap.PORTFOLIO,
      SecurityDefinitionMap.STRATEGY,
      SecurityDefinitionMap.OWNER,
      SecurityDefinitionMap.PRIMARY_PORTFOLIO_MANAGER
    ]
  }
]

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

// using the values from SubPortfolioFilter enum
// however importing it to be used here creates a circular dependency, which is why it had to be written manually
export const StrategyExcludedFiltersMapping = {
  'Short Carry': {
    excluded: [
      'STOV',
      'Relative Value',
      'Portfolio Shorts',
      'LTOV - Yield',
      'LTOV - Spread',
      'LTOV - Special Situations',
      'HEDGE',
      'Basis'
    ]
  },
  'Non-Short Carry': {
    excluded: [
      'Short Carry'
    ]
  },
  'Non-Hedging': {
    excluded: [
      'Portfolio Shorts',
      'HEDGE',
    ]
  },
  'All': {
    excluded: [...FullStrategyList]
  }
}

export const FilterTraceTradesOptions = [
  TraceTradeParty.Dealer,
  TraceTradeParty.Client,
  TraceTradeParty.ClientAffiliate,
  TraceTradeParty.ATS,
  traceTradeNumericalFilters.filter250K,
  traceTradeNumericalFilters.filter1M,
  traceTradeNumericalFilters.filter5M
]

export const DEFINITION_LONG_THRESHOLD = 5;

export const DEFINITION_CAPPED_THRESHOLD = 300;

export const DEFINITION_DISPLAY_OPTION_CAPPED_THRESHOLD = 100;