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
    displayTitle: 'Grouped by rating',
    includedDefinitions: [
      {
        definitionKey: 'SECURITY_TYPE',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'RATING',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'CURRENCY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: true,
        selectedOptions: ['Fixed', 'Float']
      }
    ]
  },{
    displayTitle: 'Grouped by sector',
    includedDefinitions: [
      {
        definitionKey: 'SECURITY_TYPE',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'SECTOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'CURRENCY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: true,
        selectedOptions: ['Fixed', 'Float']
      }
    ]
  },{
    displayTitle: 'Grouped by tenor',
    includedDefinitions: [
      {
        definitionKey: 'SECURITY_TYPE',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'TENOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'CURRENCY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: true,
        selectedOptions: ['Fixed', 'Float']
      }
    ]
  },{
    displayTitle: 'Grouped by rating and sector',
    includedDefinitions: [
      {
        definitionKey: 'SECURITY_TYPE',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'RATING',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'SECTOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'CURRENCY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: true,
        selectedOptions: ['Fixed', 'Float']
      }
    ]
  },{
    displayTitle: 'Grouped by sector and tenor',
    includedDefinitions: [
      {
        definitionKey: 'SECURITY_TYPE',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'SECTOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'TENOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'CURRENCY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: true,
        selectedOptions: ['Fixed', 'Float']
      }
    ]
  },{
    displayTitle: 'Grouped by rating, sector and tenor',
    includedDefinitions: [
      {
        definitionKey: 'SECURITY_TYPE',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'RATING',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'SECTOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'TENOR',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'CURRENCY',
        groupByActive: true,
        selectedOptions: []
      },{
        definitionKey: 'COUPON_TYPE',
        groupByActive: true,
        selectedOptions: ['Fixed', 'Float']
      }
    ]
  }
];

export const LIVE_UPDATE_COUNTDOWN = 30;

export const LIVE_UPDATE_INPROG_PROMPT = 'Fetching Update ...';
export const LIVE_UPDATE_PROCESSING_PROMPT = 'Processing ...';