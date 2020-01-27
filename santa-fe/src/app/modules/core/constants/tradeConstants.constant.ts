import {
  TradeFilterConstantStub,
  SearchShortcutStub,
  SecurityDefinitionStub
} from 'FEModels/frontend-stub-models.interface';
import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';
import { SecurityMetricOptions } from 'Core/constants/coreConstants.constant';

export const PortfolioList: Array<TradeFilterConstantStub> = [
  {
    displayLabel: 'DOF',
    value: 'DOF'
  }, {
    displayLabel: 'SOF',
    value: 'SOF'
  }, {
    displayLabel: 'STIP',
    value: 'STIP'
  }, {
    displayLabel: 'FIP',
    value: 'FIP'
  }, {
    displayLabel: 'CIP',
    value: 'CIP'
  }, {
    displayLabel: 'AGB',
    value: 'AGB'
  }
]; 

export const SecurityTypeList: Array<TradeFilterConstantStub> = [{
    displayLabel: 'Bond',
    value: 'Bond'
  }, {
    displayLabel: 'CDS Index',
    value: 'CdsIndex'
  }, {
    displayLabel: 'CDS',
    value: 'Cds'
  }, {
    displayLabel: 'Preferred',
    value: 'Preferred'
  }
];

export const CurrencyList: Array<TradeFilterConstantStub> = [
  {
    displayLabel: 'USD',
    value: 'USD'
  }, {
    displayLabel: 'CAD',
    value: 'CAD'
  }, {
    displayLabel: 'GBP',
    value: 'GBP'
  }, {
    displayLabel: 'EUR',
    value: 'EUR'
  }
];

export const QUANT_COMPARER_PERCENTILE = 90;

export const PortfolioShortcuts: Array<SearchShortcutStub> = [
  {
    displayTitle: 'DOF + SOF',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF']
      }
    ],
    isMajor: true
  },{
    displayTitle: 'STIP + FIP + CIP + AGB + BBB',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['STIP', 'FIP', 'CIP', 'AGB', 'BBB']
      }
    ],
    isMajor: true
  },{
    displayTitle: 'DOF',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF']
      }
    ]
  },{
    displayTitle: 'SOF',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['SOF']
      }
    ]
  },{
    displayTitle: 'STIP',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['STIP']
      }
    ]
  },{
    displayTitle: 'FIP',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['FIP']
      }
    ]
  },{
    displayTitle: 'CIP',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['CIP']
      }
    ]
  },{
    displayTitle: 'AGB',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['AGB']
      }
    ]
  },{
    displayTitle: 'BBB',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['BBB']
      }
    ]
  }
];

export const OwnershipShortcuts: Array<SearchShortcutStub> = [
  {
    displayTitle: 'All Securties I Own',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['PLACEHOLDER']
      }
    ],
    isMajor: true
  },{
    displayTitle: 'Owned by Arnav',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['AG']
      }
    ]
  },{
    displayTitle: 'Owned by Brian',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['BT']
      }
    ]
  },{
    displayTitle: 'Owned by Daanish',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['DA']
      }
    ]
  },{
    displayTitle: 'Owned by Derrick',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['DJ']
      }
    ]
  },{
    displayTitle: 'Owned by David',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['DM']
      }
    ]
  },{
    displayTitle: 'Owned by Lorne',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['LC']
      }
    ]
  },{
    displayTitle: 'Owned by Louise',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['LP']
      }
    ]
  },{
    displayTitle: 'Owned by Ilias',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['IL']
      }
    ]
  },{
    displayTitle: 'Owned by Phillip',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['PD']
      }
    ]
  },{
    displayTitle: 'Owned by Peter',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['PM']
      }
    ]
  },{
    displayTitle: 'Owned by Rory',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['RS']
      }
    ]
  },{
    displayTitle: 'Owned by Sarah',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['SP']
      }
    ]
  },{
    displayTitle: 'Owned by Stephen',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['ST']
      }
    ]
  },{
    displayTitle: 'Owned by Tony',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['TW']
      }
    ]
  }
];

export const StrategyShortcuts: Array<SearchShortcutStub> = [
  {
    displayTitle: 'Short Carry in DOF',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF']
      },{
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: ['Short Carry']
      }
    ],
    isMajor: true
  },{
    displayTitle: 'Non-Short Carry in DOF',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF']
      },{
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: ['STOV', 'Relative Value', 'Portfolio Shorts', 'LTOV - Yield', 'LTOV - Spread', 'LTOV - Special Situations', 'HEDGE', 'Basis']
      }
    ],
    isMajor: true
  },{
    displayTitle: 'Short Carry',
    includedDefinitions: [{
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: ['Short Carry']
      }
    ]
  },{
    displayTitle: 'STOV',
    includedDefinitions: [{
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: ['STOV']
      }
    ]
  },{
    displayTitle: 'Relative Value',
    includedDefinitions: [{
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: ['Relative Value']
      }
    ]
  },{
    displayTitle: 'Portfolio Shorts',
    includedDefinitions: [{
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: ['Portfolio Shorts']
      }
    ]
  },{
    displayTitle: 'LTOV - Yield',
    includedDefinitions: [{
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: ['LTOV - Yield']
      }
    ]
  },{
    displayTitle: 'LTOV - Spread',
    includedDefinitions: [{
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: ['LTOV - Spread']
      }
    ]
  },{
    displayTitle: 'LTOV - Special Situations',
    includedDefinitions: [{
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: ['LTOV - Special Situations']
      }
    ]
  },{
    displayTitle: 'HEDGE',
    includedDefinitions: [{
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: ['HEDGE']
      }
    ]
  },{
    displayTitle: 'Basis',
    includedDefinitions: [{
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: ['Basis']
      }
    ]
  }
];


export const LIVE_UPDATE_COUNTDOWN = 30;

export const LIVE_UPDATE_INPROG_PROMPT = 'Fetching Update ...';
export const LIVE_UPDATE_PROCESSING_PROMPT = 'Processing ...';

export const UTILITY_VALID_WINDOW_OPTIONS = [
  {
    value: 0.5,
    label: '30 mins',
  },{
    value: 2,
    label: '2 hrs',
  },{
    value: 4,
    label: '4 hrs'
  },{
    value: 99,
    label: 'Entire Day'
  }
];

export const MARKET_ANALYSIS_SPREAD_METRIC_KEY = SecurityMetricOptions[0].label;
export const MARKET_ANALYSIS_YIELD_METRIC_KEY = SecurityMetricOptions[6].label;

export const HISTORICAL_SUMMARY_ROUNDING = 2;

export const MarketAnalysisGroupByOptions: Array<SecurityDefinitionStub> = [
  SecurityDefinitionMap.CURRENCY,
  SecurityDefinitionMap.SECURITY_TYPE,
  SecurityDefinitionMap.COUPON_TYPE,
  SecurityDefinitionMap.SENIORITY,
  SecurityDefinitionMap.RATING,
  SecurityDefinitionMap.SECTOR,
  SecurityDefinitionMap.TENOR,
  SecurityDefinitionMap.TICKER,
  SecurityDefinitionMap.COUNTRY,
  SecurityDefinitionMap.QUOTED_TODAY
];

export const MarketAnalysisGroupByOpionsDefaultActiveList: Array<string> = [
  SecurityDefinitionMap.SENIORITY.key,
  SecurityDefinitionMap.RATING.key,
  SecurityDefinitionMap.SECTOR.key,
  SecurityDefinitionMap.TENOR.key,
  SecurityDefinitionMap.COUNTRY.key
];