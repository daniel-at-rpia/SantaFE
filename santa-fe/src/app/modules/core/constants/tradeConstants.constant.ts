import {
  TradeFilterConstantStub,
  SearchShortcutStub
} from 'FEModels/frontend-stub-models.interface';
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
    displayTitle: 'STIP + FIP + CIP + AGB',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['STIP', 'FIP', 'CIP', 'AGB']
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
    displayTitle: 'All Securties I Own',
    includedDefinitions: [
      {
        definitionKey: 'OWNER',
        groupByActive: false,
        selectedOptions: ['PLACEHOLDER']
      }
    ]
  },{
    displayTitle: 'DOF + SOF',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['DOF', 'SOF']
      }
    ]
  },{
    displayTitle: 'STIP + FIP + CIP + AGB',
    includedDefinitions: [
      {
        definitionKey: 'PORTFOLIO',
        groupByActive: false,
        selectedOptions: ['STIP', 'FIP', 'CIP', 'AGB']
      }
    ]
  }
];


export const LIVE_UPDATE_COUNTDOWN = 30;

export const LIVE_UPDATE_INPROG_PROMPT = 'Fetching Update ...';
export const LIVE_UPDATE_PROCESSING_PROMPT = 'Processing ...';

export const MARKET_ANALYSIS_SPREAD_METRIC_KEY = SecurityMetricOptions[0].label;
export const MARKET_ANALYSIS_YIELD_METRIC_KEY = SecurityMetricOptions[6].label;

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
  }];