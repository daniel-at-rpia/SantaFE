import {
  Action,
  ActionReducer,
  ActionReducerMap
} from '@ngrx/store';

import {
  SecurityTableRowDTO,
  SecurityDTO,
  AlertDTO
} from 'FEModels/frontend-models.interface';
import { TradeActions } from 'Trade/actions/trade.actions';

export interface TradeState {
  presetSelected: boolean;
  liveUpdateSecondCount: number;
  liveUpdateTick: number;
  tableRowUpdateList: Array<SecurityTableRowDTO>;
  selectedSecurityForAnalysis: SecurityDTO;
  securityIDListFromAnalysis: Array<string>;
  securityTableRowDTOListForAnalysis: Array<SecurityTableRowDTO>;
  bestQuoteValidWindow: number;
  selectedSecurityForAlertConfig: SecurityDTO;
  darkMode: boolean;
  newAlertsForAlertTable: Array<AlertDTO>;
  tradeAlertTable: {
    initialDataLoaded: boolean;
    liveUpdateInProgress: boolean;
    liveUpdateProcessingRawData: boolean;
  },
  tradeMainTable: {
    initialDataLoaded: boolean;
    liveUpdateInProgress: boolean;
    liveUpdateProcessingRawData: boolean;
  },
  keywordSearchInMainTable: string;
}

const initialState: TradeState = {
  presetSelected: false,
  liveUpdateSecondCount: 0,
  liveUpdateTick: 0,
  tableRowUpdateList: [],
  selectedSecurityForAnalysis: null,
  securityIDListFromAnalysis: [],
  securityTableRowDTOListForAnalysis: [],
  bestQuoteValidWindow: null,
  selectedSecurityForAlertConfig: null,
  darkMode: false,
  newAlertsForAlertTable: [],
  tradeAlertTable: {
    initialDataLoaded: false,
    liveUpdateInProgress: false,
    liveUpdateProcessingRawData: false
  },
  tradeMainTable: {
    initialDataLoaded: false,
    liveUpdateInProgress: false,
    liveUpdateProcessingRawData: false
  },
  keywordSearchInMainTable: ''
};

export function tradeReducer(
  state = initialState,
  action
  ): TradeState {
  switch (action.type) {
    case TradeActions.TradeStoreReset:
      return initialState;
    case TradeActions.TogglePresetEvent:
      const oldFlag = state.presetSelected;
      if (!oldFlag) {
        return {
          ...state,
          presetSelected: !oldFlag
        };
      } else {
        return {
          ...state,
          presetSelected: !oldFlag,
          tradeMainTable: {
            ...state.tradeMainTable,
            initialDataLoaded: false
          }
        };
      }
    case TradeActions.LiveUpdateCount:
      const oldCount = state.liveUpdateSecondCount;
      return {
        ...state,
        liveUpdateSecondCount: oldCount + 1
      };
    case TradeActions.LiveUpdateStartEvent:
      let oldTick = state.liveUpdateTick;
      return {
        ...state,
        liveUpdateSecondCount: 0,
        liveUpdateTick: oldTick + 1,
        tradeMainTable: {
          ...state.tradeMainTable,
          liveUpdateInProgress: true
        },
        tradeAlertTable: {
          ...state.tradeAlertTable,
          liveUpdateInProgress: true
        }
      };
    case TradeActions.LiveUpdatePassRawDataToMainTableEvent:
      return {
        ...state,
        tradeMainTable: {
          ...state.tradeMainTable,
          liveUpdateProcessingRawData: true
        }
      };
    case TradeActions.LiveUpdatePassRawDataToAlertTableEvent:
      return {
        ...state,
        tradeAlertTable: {
          ...state.tradeAlertTable,
          liveUpdateProcessingRawData: true
        }
      };
    case TradeActions.LiveUpdateProcessingDataCompleteInMainTableEvent:
      if (state.tradeMainTable.initialDataLoaded) {
        return {
          ...state,
          tradeMainTable: {
            ...state.tradeMainTable,
            liveUpdateInProgress: false,
            liveUpdateProcessingRawData: false
          }
        };
      } else {
        return {
          ...state,
          tradeMainTable: {
            ...state.tradeMainTable,
            liveUpdateInProgress: false,
            liveUpdateProcessingRawData: false,
            initialDataLoaded: true
          }
        }
      };
    case TradeActions.LiveUpdateProcessingDataCompleteInAlertTableEvent:
      if (state.tradeAlertTable.initialDataLoaded) {
        return {
          ...state,
          tradeAlertTable: {
            ...state.tradeAlertTable,
            liveUpdateInProgress: false,
            liveUpdateProcessingRawData: false
          }
        };
      } else {
        return {
          ...state,
          tradeAlertTable: {
            ...state.tradeAlertTable,
            liveUpdateInProgress: false,
            liveUpdateProcessingRawData: false,
            initialDataLoaded: true
          }
        }
      };
    case TradeActions.SelectSecurityForAnalysisEvent:
      return {
        ...state,
        selectedSecurityForAnalysis: action.targetSecurity
      }
    case TradeActions.SecurityIDListFromAnalysisEvent:
      return {
        ...state,
        securityIDListFromAnalysis: action.securityIDList
      }
    case TradeActions.SecurityTableRowDTOListForAnalysisEvent:
      return {
        ...state,
        securityTableRowDTOListForAnalysis: action.securityTableRowDTOList
      }
    case TradeActions.ChangeBestQuoteValidWindowEvent:
      return {
        ...state,
        bestQuoteValidWindow: action.window
      }
    case TradeActions.SelectSecurityForAlertConfigEvent:
      return {
        ...state,
        selectedSecurityForAlertConfig: action.targetSecurity
      }
    case TradeActions.AlertTableSendNewAlerts:
      return {
        ...state,
        newAlertsForAlertTable: state.newAlertsForAlertTable.concat(action.list)
      }
    case TradeActions.AlertTableReceiveNewAlerts:
      return {
        ...state,
        newAlertsForAlertTable: []
      }
    case TradeActions.KeywordSearchThisSecurity:
      return {
        ...state,
        keywordSearchInMainTable: action.keyword
      }
    default:
      return state;
  }
}

export function reducer(state: TradeState, action: Action) {
  return tradeReducer(state, action);
}
