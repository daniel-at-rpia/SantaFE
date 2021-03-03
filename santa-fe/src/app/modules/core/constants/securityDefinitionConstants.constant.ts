import {
  SecurityDefinitionStub,
  SecurityDefinitionBundleStub,
  SecurityDefinitionMapStub,
  SecurityMetricOptionStub,
  SearchShortcutStub
} from 'FEModels/frontend-stub-models.interface';
import { FrontendKayToBackendKeyDictionary } from 'Core/constants/coreConstants.constant';
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

  const FilterOptionSecuritySubType = [
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

  export const StructuringTeamPMList = [
    'AY',
    'DM',
    'LP',
    'PM'
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

export const editingViewAvailableUsers = [...FilterOptionsPortfolioResearchList, 'DM'];

export const SecurityDefinitionMap: SecurityDefinitionMapStub = {
  SECURITY_TYPE: {
    key: 'SECURITY_TYPE',
    displayName: 'Security Type',
    icon: 'fal fa-slash',
    optionList: FilterOptionsSecurityType,
    locked: true,
    securityDTOAttr: 'securityType',
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['SECURITY_TYPE']
  },
  SECURITY_SUB_TYPE: {
    key: 'SECURITY_SUB_TYPE',
    displayName: 'Security Sub-Type',
    icon: 'fal fa-slash',
    optionList: FilterOptionSecuritySubType,
    securityDTOAttr: 'securitySubType',
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['SECURITY_SUB_TYPE']
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
    optionList: FilterOptionsBailInStatus,
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['BAIL_IN_STATUS']
  },
  COUPON_TYPE: {
    key: 'COUPON_TYPE',
    displayName: 'Coupon Type',
    icon: 'fas fa-ticket-alt',
    optionList: FilterOptionsCouponType,
    locked: true,
    securityDTOAttr: 'couponType',
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['COUPON_TYPE']
  },
  CURRENCY: {
    key: 'CURRENCY',
    displayName: 'Currency',
    icon: 'fas fa-dollar-sign',
    optionList: FilterOptionsCurrency,
    securityDTOAttr: 'currency',
    locked: true,
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['CURRENCY']
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
    optionList: FilterOptionsMaturityType,
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['MATURITY']
  },
  IS_NEWISSUE: {
    key: 'IS_NEWISSUE',
    displayName: 'New Issue',
    icon: 'far fa-sparkles',
    optionList: FilterOptionsBoolean,
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['IS_NEWISSUE']
  },
  IS_ONTHERUN: {
    key: 'IS_ONTHERUN',
    displayName: 'On-the-Run',
    icon: 'fal fa-handshake',
    optionList: FilterOptionsBoolean,
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['IS_ONTHERUN']
  },
  RATING: {
    key: 'RATING',
    displayName: 'Rating',
    icon: 'fas fa-award',
    optionList: FilterOptionsRating,
    securityDTOAttr: 'ratingValue',
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['RATING']
  },
  RATING_BUCKET: {
    key: 'RATING_BUCKET',
    displayName: 'Rating Bucket',
    icon: 'fas fa-trash',
    optionList: FilterOptionsRatingBucket,
    secondaryIcon: 'fas fa-award',
    securityDTOAttr: 'ratingBucket',
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['RATING_BUCKET']
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
    securityDTOAttr: 'seniority',
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['SENIORITY']
  },
  TENOR: {
    key: 'TENOR',
    displayName: 'Tenor',
    icon: 'fal fa-history',
    optionList: FilterOptionsTenor,
    securityDTOAttr: 'tenor',
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['TENOR']
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
    securityDTOAttr: 'country',
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['COUNTRY']
  },
  QUOTED_TODAY: {
    key: 'QUOTED_TODAY',
    displayName: 'Quoted Today',
    icon: 'far fa-calendar-day',
    optionList: FilterOptionsBoolean,
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['QUOTED_TODAY']
  },
  OVERRIDE: {
    key: 'OVERRIDE',
    displayName: 'Custom',
    icon: 'fas fa-star',
    optionList: []
  },
  BICS_CONSOLIDATED: {
    key: 'BICS_CONSOLIDATED',
    displayName: 'All BICS',
    icon: 'fas fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'code',
    securityDTOAttrBlock: 'bics',
    backendDtoAttrName: 'BicsCode'
  },
  BICS_LEVEL_1: {
    key: 'BICS_LEVEL_1',
    displayName: 'BICS Lv.1',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel1',
    securityDTOAttrBlock: 'bics'
  },
  BICS_LEVEL_2: {
    key: 'BICS_LEVEL_2',
    displayName: 'BICS Lv.2',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel2',
    securityDTOAttrBlock: 'bics'
  },
  BICS_LEVEL_3: {
    key: 'BICS_LEVEL_3',
    displayName: 'BICS Lv.3',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel3',
    securityDTOAttrBlock: 'bics'
  },
  BICS_LEVEL_4: {
    key: 'BICS_LEVEL_4',
    displayName: 'BICS Lv.4',
    icon: 'fal fa-industry-alt',
    optionList: [],
    securityDTOAttr: 'bicsLevel4',
    securityDTOAttrBlock: 'bics'
  },
  TICKER: {
    key: 'TICKER',
    displayName: 'Ticker',
    icon: 'fas fa-user-tie',
    optionList: [],
    securityDTOAttr: 'ticker',
    backendDtoAttrName: FrontendKayToBackendKeyDictionary['TICKER']
  },
};

export const ConfiguratorDefinitionLayout: Array<SecurityDefinitionBundleStub> = [
  {
    label: 'Basic',
    list: [
      SecurityDefinitionMap.PORTFOLIO,
      SecurityDefinitionMap.CURRENCY,
      SecurityDefinitionMap.RATING,
      SecurityDefinitionMap.TENOR,
      SecurityDefinitionMap.STRATEGY,
      SecurityDefinitionMap.COUNTRY,
      SecurityDefinitionMap.SECURITY_TYPE,
      SecurityDefinitionMap.SECURITY_SUB_TYPE
    ]
  }, {
    label: 'BICS',
    list: [
      SecurityDefinitionMap.BICS_CONSOLIDATED
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
      SecurityDefinitionMap.TICKER,
      SecurityDefinitionMap.COUPON_TYPE,
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