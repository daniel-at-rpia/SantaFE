import {
  Action,
  ActionReducer,
  ActionReducerMap
} from '@ngrx/store';

import {
  SecurityTableRowDTO,
  SecurityDTO
} from 'FEModels/frontend-models.interface';
import {
  TradeActions,
  TradeLiveUpdateStartEvent,
  TradeLiveUpdateInProgressEvent,
  TradeLiveUpdatePassRawDataEvent,
  TradeLiveUpdatePassTableContentEvent
} from 'Trade/actions/trade.actions';
import { RouterLinkWithHref } from '@angular/router';

export interface TradeState {
  presetSelected: boolean;
  initialDataLoaded: boolean;
  liveUpdateSecondCount: number;
  liveUpdateTick: number;
  liveUpdateInProgress: boolean;
  liveUpdateProcessingRawData: boolean;
  tableRowUpdateList: Array<SecurityTableRowDTO>;
  selectedSecurityForAnalysis: SecurityDTO;
  securityIDListFromAnalysis: Array<string>;
  securityTableRowDTOListForAnalysis: Array<SecurityTableRowDTO>;
  bestQuoteValidWindow: number;
}

const initialState: TradeState = {
  presetSelected: false,
  initialDataLoaded: false,
  liveUpdateSecondCount: 0,
  liveUpdateTick: 0,
  liveUpdateInProgress: false,
  liveUpdateProcessingRawData: false,
  tableRowUpdateList: [],
  selectedSecurityForAnalysis: null,
  securityIDListFromAnalysis: [],
  securityTableRowDTOListForAnalysis: [],
  bestQuoteValidWindow: null
};

export function tradeReducer(
  state = initialState,
  action
  ): TradeState {
  switch (action.type) {
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
          initialDataLoaded: false
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
        liveUpdateInProgress: true
      };
    case TradeActions.LiveUpdatePassRawDataEvent:
      return {
        ...state,
        liveUpdateInProgress: false,
        liveUpdateProcessingRawData: true
      };
    case TradeActions.LiveUpdatePassTableContentEvent:
      return {
        ...state,
        tableRowUpdateList: action.rowList
      };
    case TradeActions.LiveUpdateProcessingDataCompleteEvent:
      if (state.initialDataLoaded) {
        return {
          ...state,
          liveUpdateProcessingRawData: false
        };
      } else {
        return {
          ...state,
          liveUpdateProcessingRawData: false,
          initialDataLoaded: true
        }
      }
    case TradeActions.SwitchDriverEvent:
      return {
        ...state,
        initialDataLoaded: false
      }
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
    default:
      return state;
  }
}

export function reducer(state: TradeState | undefined, action: Action) {
  return tradeReducer(state, action);
}