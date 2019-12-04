import {
  TradeFilterConstantStub,
  SearchShortcutStub
} from 'FEModels/frontend-stub-models.interface';

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

export const SearchShortcuts: Array<SearchShortcutStub> = [
  {
    displayTitle: 'All Portfolios',
    includedDefinitions: []
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

export const LIVE_UPDATE_COUNTDOWN = 59;

export const LIVE_UPDATE_INPROG_PROMPT = 'Fetching Update ...';
export const LIVE_UPDATE_PROCESSING_PROMPT = 'Processing ...';