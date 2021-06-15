import { Stubs, AdhocPacks } from 'Core/models/frontend';
import { SecurityDefinitionMap, FullStrategyList } from 'Core/constants/securityDefinitionConstants.constant';
import { SecurityMetricOptions, PortfolioShortNames } from 'Core/constants/coreConstants.constant';

export enum TradeCenterPanelSearchModes {
  internal = 'Internal',
  uob = 'Universe Of Bonds'
}

const allPortfolios: Stubs.SearchShortcutIncludedDefinitionStub = {
  definitionKey: 'PORTFOLIO',
  groupByActive: false,
  selectedOptions: [PortfolioShortNames.DOF, PortfolioShortNames.SOF, PortfolioShortNames.STIP, PortfolioShortNames.FIP, PortfolioShortNames.CIP, PortfolioShortNames.AGB, PortfolioShortNames.BBB]
};

export const SelectedShortcuts: Array<Stubs.SearchShortcutIncludedDefinitionStub> = [
  {
    definitionKey: 'QUOTED_TODAY',
    groupByActive: false,
    selectedOptions: ['Y']
  }
]

export const PortfolioShortcuts: Array<Stubs.SearchShortcutStub> = [{
    displayTitle: 'All Portfolios',
    includedDefinitions: [
      allPortfolios
    ],
    isHero: true
  },
  {
    displayTitle: 'DOF + SOF',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: [PortfolioShortNames.DOF, PortfolioShortNames.SOF]
      }
    ],
    isMajor: true
  },{
    displayTitle: 'STIP + FIP + CIP + AGB + BBB',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: [PortfolioShortNames.STIP, PortfolioShortNames.FIP, PortfolioShortNames.CIP, PortfolioShortNames.AGB, PortfolioShortNames.BBB]
      }
    ],
    isMajor: true
  },{
    displayTitle: 'DOF',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: [PortfolioShortNames.DOF]
      }
    ]
  },{
    displayTitle: 'SOF',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: [PortfolioShortNames.SOF]
      }
    ]
  },{
    displayTitle: 'STIP',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: [PortfolioShortNames.STIP]
      }
    ]
  },{
    displayTitle: 'FIP',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: [PortfolioShortNames.FIP]
      }
    ]
  },{
    displayTitle: 'CIP',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: [PortfolioShortNames.CIP]
      }
    ]
  },{
    displayTitle: 'AGB',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: [PortfolioShortNames.AGB]
      }
    ]
  },{
    displayTitle: 'BBB',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: [PortfolioShortNames.BBB]
      }
    ]
  }
];

export const OwnershipShortcuts: Array<Stubs.SearchShortcutStub> = [
  {
    displayTitle: 'All Securties I Own',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['PLACEHOLDER']
      },
      allPortfolios
    ],
    isHero: true
  },{
    displayTitle: 'Arnav',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['AG']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'Aaron',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['AY']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'Brian',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['BT']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'Daanish',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['DA']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'David Galica',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['DG']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'Derrick',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['DJ']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'David Matheson',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['DM']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'Lorne',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['LC']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'Louise',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['LP']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'Ilias',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['IL']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'Phillip',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['PD']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'Peter',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['PM']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'Ryan',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['RV']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'Sarah',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['SP']
      },
      allPortfolios
    ]
  },{
    displayTitle: 'Tony',
    includedDefinitions: [
      {
        definitionKey: 'PRIMARY_PORTFOLIO_MANAGER',
        groupByActive: false,
        selectedOptions: ['TW']
      },
      allPortfolios
    ]
  }
];

export const StrategyShortcuts: Array<Stubs.SearchShortcutStub> = [
  {
    displayTitle: `${FullStrategyList[0]} in DOF`,
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: [PortfolioShortNames.DOF]
      },{
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: [FullStrategyList[0]]
      }
    ],
    isMajor: true
  },{
    displayTitle: `Non-${FullStrategyList[0]} in DOF`,
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: [PortfolioShortNames.DOF]
      },{
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: FullStrategyList.filter((eachStrategy) => {
          return eachStrategy !== FullStrategyList[0]
        })
      }
    ],
    isMajor: true
  },{
    displayTitle: `${FullStrategyList[0]}`,
    includedDefinitions: [
      {
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: [FullStrategyList[0]]
      },
      allPortfolios
    ]
  },{
    displayTitle: `${FullStrategyList[1]}`,
    includedDefinitions: [
      {
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: [FullStrategyList[1]]
      },
      allPortfolios
    ]
  },{
    displayTitle: `${FullStrategyList[2]}`,
    includedDefinitions: [
      {
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: [FullStrategyList[2]]
      },
      allPortfolios
    ]
  },{
    displayTitle: `${FullStrategyList[3]}`,
    includedDefinitions: [
      {
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: [FullStrategyList[3]]
      },
      allPortfolios
    ]
  },{
    displayTitle: `${FullStrategyList[4]}`,
    includedDefinitions: [
      {
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: [FullStrategyList[4]]
      },
      allPortfolios
    ]
  },{
    displayTitle: `${FullStrategyList[5]}`,
    includedDefinitions: [
      {
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: [FullStrategyList[5]]
      },
      allPortfolios
    ]
  },{
    displayTitle: `${FullStrategyList[6]}`,
    includedDefinitions: [
      {
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: [FullStrategyList[6]]
      },
      allPortfolios
    ]
  },{
    displayTitle: `${FullStrategyList[7]}`,
    includedDefinitions: [
      {
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: [FullStrategyList[7]]
      },
      allPortfolios
    ]
  },{
    displayTitle: `${FullStrategyList[8]}`,
    includedDefinitions: [
      {
        definitionKey: 'STRATEGY',
        groupByActive: false,
        selectedOptions: [FullStrategyList[8]]
      },
      allPortfolios
    ]
  }
];

export const TrendingShortcuts: Array<Stubs.SearchShortcutStub> = [
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

export const MarketAnalysisGroupByOptions: Array<Stubs.SecurityDefinitionStub> = [
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

export const TradeUoBDefaultSecurityTableHeaderOverwriteConfigs: Array<AdhocPacks.SecurityTableHeaderConfigOverwrite> = [
  {
    key: 'ticker',
    groupBy: true,
    groupShow: true,
    active: true
  },{
    key: 'bicsLevel2',
    groupShow: true,
    active: true
  },{
    key: 'bicsLevel3',
    groupShow: true,
    active: true
  },{
    key: 'bicsLevel4',
    groupShow: true,
    active: true
  },
  {
    key: 'costDOFWeightedAvg',
    active: false
  },{
    key: 'costSOFWeightedAvg',
    active: false
  },{
    key: 'costSTIPWeightedAvg',
    active: false
  },{
    key: 'costFIPWeightedAvg',
    active: false
  },{
    key: 'costCIPWeightedAvg',
    active: false
  },{
    key: 'costAGBWeightedAvg',
    active: false
  },{
    key: 'costBBBWeightedAvg',
    active: false
  },{
    key: 'currentPosition',
    active: false
  },{
    key: 'unitPosition',
    active: false
  },{
    key: 'hfPosition',
    active: false
  },{
    key: 'nlfPosition',
    active: false
  },{
    key: 'dofPosition',
    active: false
  },{
    key: 'sofPosition',
    active: false
  },{
    key: 'stipPosition',
    active: false
  },{
    key: 'fipPosition',
    active: false
  },{
    key: 'cipPosition',
    active: false
  },{
    key: 'agbPosition',
    active: false
  },{
    key: 'bbbPosition',
    active: false
  },{
    key: 'primaryPM',
    active: false
  },{
    key: 'backupPM',
    active: false
  },{
    key: 'research',
    active: false
  },{
    key: 'strategy',
    active: false
  },{
    key: 'hedgeFactor',
    active: false
  }
]

export const SEARCH_ENGINE_TYPEAHEAD_SIZE_CAP = 25;
export const SEARCH_ENGINE_TYPEAHEAD_MINIMUM_CHAR_LENGTH = 1;
export const SEARCH_ENGINE_BREAK_KEY = 9;
export const SEARCH_ENGINE_DOWNWARD_KEY = 40;
export const SEARCH_ENGINE_UPWARD_KEY = 38;
export const SEARCH_ENGINE_ENTER_KEY = 13;
export const SEARCH_ENGINE_TYPES = {
  BICS: 'BICS',
  TICKER: 'Ticker'
}
export const SEARCH_ENGINE_LONG_TYPEAHEAD_THRESHOLD = 7;  // because we set the max-height on the typeahead element, more than 7 results would trigger the scrollbar
