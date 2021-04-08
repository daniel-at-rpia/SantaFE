import {
  TradeFilterConstantStub,
  SearchShortcutStub,
  SecurityDefinitionStub
} from 'FEModels/frontend-stub-models.interface';
import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';
import { SecurityMetricOptions } from 'Core/constants/coreConstants.constant';

export const PortfolioShortcuts: Array<SearchShortcutStub> = [{
    displayTitle: 'All Portfolios',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: []
      }
    ],
    isHero: true
  },
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
    isHero: true
  },{
    displayTitle: 'Arnav',
    includedDefinitions: [
      {
        definitionKey: 'RESEARCH',
        groupByActive: false,
        selectedOptions: ['AG']
      }
    ]
  },{
    displayTitle: 'Aaron',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['AY']
      }
    ]
  },{
    displayTitle: 'Brian',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['BT']
      }
    ]
  },{
    displayTitle: 'Daanish',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['DA']
      }
    ]
  },{
    displayTitle: 'David Galica',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['DG']
      }
    ]
  },{
    displayTitle: 'Derrick',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['DJ']
      }
    ]
  },{
    displayTitle: 'David Matheson',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['DM']
      }
    ]
  },{
    displayTitle: 'Lorne',
    includedDefinitions: [
      {
        definitionKey: 'RESEARCH',
        groupByActive: false,
        selectedOptions: ['LC']
      }
    ]
  },{
    displayTitle: 'Louise',
    includedDefinitions: [
      {
        definitionKey: 'RESEARCH',
        groupByActive: false,
        selectedOptions: ['LP']
      }
    ]
  },{
    displayTitle: 'Ilias',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['IL']
      }
    ]
  },{
    displayTitle: 'Phillip',
    includedDefinitions: [
      {
        definitionKey: 'RESEARCH',
        groupByActive: false,
        selectedOptions: ['PD']
      }
    ]
  },{
    displayTitle: 'Peter',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['PM']
      }
    ]
  },{
    displayTitle: 'Ryan',
    includedDefinitions: [
      {
        definitionKey: 'RESEARCH',
        groupByActive: false,
        selectedOptions: ['RV']
      }
    ]
  },{
    displayTitle: 'Sarah',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['SP']
      }
    ]
  },{
    displayTitle: 'Tony',
    includedDefinitions: [
      {
        definitionKey: 'RESEARCH',
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


export const LIVE_UPDATE_COUNTDOWN = 30;  // seconds
export const ALERT_UPDATE_COUNTDOWN = 5;  // seconds

export const LIVE_UPDATE_INPROG_PROMPT = 'Fetching ...';
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
  SecurityDefinitionMap.BICS_LEVEL_1,
  SecurityDefinitionMap.BICS_LEVEL_2,
  SecurityDefinitionMap.TENOR,
  SecurityDefinitionMap.COUNTRY,
  SecurityDefinitionMap.QUOTED_TODAY
];

export const MarketAnalysisGroupByOpionsDefaultActiveList: Array<string> = [
  SecurityDefinitionMap.SENIORITY.key,
  SecurityDefinitionMap.RATING.key,
  SecurityDefinitionMap.BICS_LEVEL_1.key,
  SecurityDefinitionMap.TENOR.key
];

export const ALERT_MAX_SECURITY_SEARCH_COUNT = 100;

export enum AxeAlertScope {
  bid = "Bid",
  ask = 'Ask',
  liquidation = "Liquidation",
  both = 'Both'
}

export enum AxeAlertType {
  marketList = 'MarketList',
  normal = 'Axe',
  both = 'Both'
}