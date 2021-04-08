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
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
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
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
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
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
      }
    ]
  },{
    displayTitle: 'Aaron',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['AY']
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
      }
    ]
  },{
    displayTitle: 'Brian',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['BT']
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
      }
    ]
  },{
    displayTitle: 'Daanish',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['DA']
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
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
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
      }
    ]
  },{
    displayTitle: 'David Matheson',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['DM']
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
      }
    ]
  },{
    displayTitle: 'Lorne',
    includedDefinitions: [
      {
        definitionKey: 'RESEARCH',
        groupByActive: false,
        selectedOptions: ['LC']
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
      }
    ]
  },{
    displayTitle: 'Louise',
    includedDefinitions: [
      {
        definitionKey: 'RESEARCH',
        groupByActive: false,
        selectedOptions: ['LP']
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
      }
    ]
  },{
    displayTitle: 'Ilias',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['IL']
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
      }
    ]
  },{
    displayTitle: 'Phillip',
    includedDefinitions: [
      {
        definitionKey: 'RESEARCH',
        groupByActive: false,
        selectedOptions: ['PD']
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
      }
    ]
  },{
    displayTitle: 'Peter',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['PM']
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
      }
    ]
  },{
    displayTitle: 'Ryan',
    includedDefinitions: [
      {
        definitionKey: 'RESEARCH',
        groupByActive: false,
        selectedOptions: ['RV']
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
      }
    ]
  },{
    displayTitle: 'Sarah',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['SP']
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
      }
    ]
  },{
    displayTitle: 'Tony',
    includedDefinitions: [
      {
        definitionKey: 'RESEARCH',
        groupByActive: false,
        selectedOptions: ['TW']
      },
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF', 'STIP', 'FIP', 'CIP', 'AGB', 'BBB']
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

export const TrendingShortcuts: Array<SearchShortcutStub> = [
  {
    displayTitle: 'COVID Sensitive',
    includedDefinitions: [
      {
        definitionKey: 'BICS_CONSOLIDATED',
        groupByActive: false,
        selectedOptions: ['101011','101012','101013','111011','111012','11101310','11101311','11101410','11111010','11111011','11111013','111111','11121110','11121112','11121113','11121114','11121116','1310','14111110','14111111','15','171011','17101410','17101411','17101510','17111010','17111110','17111111','17111113','17111114','17111115','17111116','171112','171113','18101010','18101012','18101013','181011','181012','18101311','181014','181015']
      }
    ]
  },{
    displayTitle: 'Targeted COVID',
    includedDefinitions: [
      {
        definitionKey: 'BICS_CONSOLIDATED',
        groupByActive: false,
        selectedOptions: ["111011","111111","14111110","15","171011"]
      }
    ]
  },{
    displayTitle: 'USD FRNs Beyond Libor Cessation',
    includedDefinitions: [
      {
        definitionKey: 'CURRENCY',
        groupByActive: false,
        selectedOptions: ['USD']
      },{
        definitionKey: 'TENOR',
        groupByActive: false,
        selectedOptions: ["10Y","20Y","30Y","3Y","5Y","7Y"]
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: false,
        selectedOptions: ["Float"]
      }
    ]
  },{
    displayTitle: 'Airlines Secured Notes',
    includedDefinitions: [
      {
        definitionKey: 'BICS_CONSOLIDATED',
        groupByActive: false,
        selectedOptions: ["17111210"]
      },{
        definitionKey: 'SENIORITY',
        groupByActive: false,
        selectedOptions: ["SECURED"]
      }
    ]
  },{
    displayTitle: 'Biden Tax Increases',
    includedDefinitions: [
      {
        definitionKey: 'TICKER',
        groupByActive: false,
        selectedOptions: ["A","ABMD","AJG","AMGN","ATVI","AVGO","CB","CCL","CDNS","COO","CTXS","DXC","ETN","GE","GM","GOOGL","HIG","INFO","IPG","JCI","KO","LNT","LRCX","LVS","MCHP","MDLZ","MET","MOS","NCLH","NFLX","NVDA","OKE","PFG","PKI","RE","SLB","SNPS","SRE","STX","STZ","TAP","TMO","UAL","VTRS","VZ","WDC","WLTW","WU","WYNN","XLNX"]
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

export const DISPLAY_DRIVER_MAP  = {
  'DEFAULT': 'Combined',
  'Combined': 'Combined',
  'Spread': 'Spread',
  'Yield': 'Yield',
  'Price': 'Price'
};
