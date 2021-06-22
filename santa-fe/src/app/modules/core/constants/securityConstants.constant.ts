import { AdhocPacks, Blocks } from 'App/modules/core/models/frontend';
import { SecurityDefinitionMap } from './securityDefinitionConstants.constant';

export enum SecurityActionMenuOptionsRawText {
  pinRow = 'pinRow',
  sendToGraph = 'sendToGraph',
  setAlert = 'setAlert',
  uofB = 'uofB',
  bloomberg = 'bloomberg',
  moreActions = 'moreActions',
  ticker = 'ticker',
  bics = 'BICS',
  bloombergDES = 'DES',
  bloombergQMGR = 'QMGR',
  bloombergYAS = 'YAS',
  bloombergTDH = 'TDH'
}

export enum SecurityActionMenuOptionsDisplayText {
  pinRow = 'Pin Row',
  sendToGraph = 'View Graph',
  setAlert = 'Set Alert',
  uofB = 'Search',
  bloomberg = 'Bloomberg',
  moreActions = 'More',
  ticker = 'Ticker',
  bics = 'BICS',
  bloombergDES = 'DES',
  bloombergQMGR = 'QMGR',
  bloombergYAS = 'YAS',
  bloombergTDH = 'TDH'
}

export enum SecurityActionMenuOptionPositioningIdentifier {
  one = 1,
  two,
  three,
  four,
  five
}

export const SecurityActionMenuList: Array<Blocks.SecurityActionMenuOptionBlock> = [{
    displayTitle: SecurityActionMenuOptionsDisplayText.uofB,
    icon: 'fal fa-table',
    level: 1,
    coreAction: null,
    subActions: [
      SecurityActionMenuOptionsRawText.bics,
      SecurityActionMenuOptionsRawText.ticker
    ],
    rawText: SecurityActionMenuOptionsRawText.uofB,
    positionIdentifier: '',
    isAvailableSubAction: true
  },
  {
    displayTitle: SecurityActionMenuOptionsDisplayText.ticker,
    icon: SecurityDefinitionMap.TICKER.icon,
    coreAction: SecurityActionMenuOptionsRawText.uofB,
    level: 2,
    subActions: [],
    rawText:  SecurityActionMenuOptionsRawText.ticker,
    positionIdentifier: '',
    isAvailableSubAction: false
  },
  {
    displayTitle: SecurityActionMenuOptionsDisplayText.bics,
    icon: SecurityDefinitionMap.BICS_CONSOLIDATED.icon,
    level: 2,
    coreAction: SecurityActionMenuOptionsRawText.uofB,
    subActions: [],
    rawText: SecurityActionMenuOptionsRawText.bics,
    positionIdentifier: '',
    isAvailableSubAction: false
  },
  {
    displayTitle: SecurityActionMenuOptionsDisplayText.setAlert,
    icon: 'fal fa-bell',
    level: 1,
    coreAction: null,
    subActions: [],
    rawText: SecurityActionMenuOptionsRawText.setAlert,
    positionIdentifier: '',
    isAvailableSubAction: true
  },
  {
    displayTitle: SecurityActionMenuOptionsDisplayText.moreActions,
    icon: 'fal fa-chevron-down',
    level: 1,
    coreAction: null,
    subActions: [
      SecurityActionMenuOptionsRawText.pinRow,
      SecurityActionMenuOptionsRawText.sendToGraph,
      SecurityActionMenuOptionsRawText.bloomberg
    ],
    rawText: SecurityActionMenuOptionsRawText.moreActions,
    positionIdentifier: '',
    isAvailableSubAction: true
  },
  {
    displayTitle: SecurityActionMenuOptionsDisplayText.pinRow,
    icon: 'fal fa-thumbtack',
    level: 2,
    coreAction: SecurityActionMenuOptionsRawText.moreActions,
    subActions: [],
    rawText: SecurityActionMenuOptionsRawText.pinRow,
    positionIdentifier: '',
    isAvailableSubAction: false
  },
  {
    displayTitle: SecurityActionMenuOptionsDisplayText.sendToGraph,
    icon: 'fal fa-chart-line',
    level: 2,
    coreAction: SecurityActionMenuOptionsRawText.moreActions,
    subActions: [],
    rawText: SecurityActionMenuOptionsRawText.sendToGraph,
    positionIdentifier: '',
    isAvailableSubAction: false
  },
  {
    displayTitle: SecurityActionMenuOptionsDisplayText.bloomberg,
    icon: null,
    level: 2,
    coreAction: SecurityActionMenuOptionsRawText.moreActions,
    subActions: [
      SecurityActionMenuOptionsRawText.bloombergDES,
      SecurityActionMenuOptionsRawText.bloombergQMGR,
      SecurityActionMenuOptionsRawText.bloombergTDH,
      SecurityActionMenuOptionsRawText.bloombergYAS
    ],
    rawText: SecurityActionMenuOptionsRawText.bloomberg,
    positionIdentifier: '',
    isAvailableSubAction: false
  },
  {
    displayTitle: SecurityActionMenuOptionsDisplayText.bloombergDES,
    icon: null,
    level: 3,
    coreAction: SecurityActionMenuOptionsRawText.bloomberg,
    subActions: [],
    rawText: SecurityActionMenuOptionsRawText.bloombergDES,
    positionIdentifier: '',
    isAvailableSubAction: false
  },
  {
    displayTitle: SecurityActionMenuOptionsDisplayText.bloombergQMGR,
    icon: null,
    level: 3,
    coreAction: SecurityActionMenuOptionsRawText.bloomberg,
    subActions: [],
    rawText: SecurityActionMenuOptionsRawText.bloombergQMGR,
    positionIdentifier: '',
    isAvailableSubAction: false
  },
  {
    displayTitle: SecurityActionMenuOptionsDisplayText.bloombergTDH,
    icon: null,
    level: 3,
    coreAction: SecurityActionMenuOptionsRawText.bloomberg,
    subActions: [],
    rawText: SecurityActionMenuOptionsRawText.bloombergTDH,
    positionIdentifier: '',
    isAvailableSubAction: false
  },
  {
    displayTitle: SecurityActionMenuOptionsDisplayText.bloombergYAS,
    icon: null,
    level: 3,
    coreAction: SecurityActionMenuOptionsRawText.bloomberg,
    subActions: [],
    rawText: SecurityActionMenuOptionsRawText.bloombergYAS,
    positionIdentifier: '',
    isAvailableSubAction: false
  }
]

export const UofBCategoryMapping: AdhocPacks.UofBCategoryMappingBlock = {
  [SecurityDefinitionMap.BICS_CONSOLIDATED.key]: SecurityDefinitionMap.BICS_CONSOLIDATED,
  [SecurityDefinitionMap.TICKER.key]: SecurityDefinitionMap.TICKER
}