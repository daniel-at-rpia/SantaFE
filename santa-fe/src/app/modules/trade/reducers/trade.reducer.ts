import {
  Action,
  ActionReducer,
  ActionReducerMap
} from '@ngrx/store';

import { SecurityTableRowDTO } from 'FEModels/frontend-models.interface';
import {
  TradeActions,
  TradeLiveUpdateStartEvent,
  TradeLiveUpdateInProgressEvent,
  TradeLiveUpdatePassRawDataEvent,
  TradeLiveUpdatePassTableContentEvent
} from 'Trade/actions/trade.actions';

export interface TradeState {
  presetSelected: boolean;
  liveUpdateSecondCount: number;
  liveUpdateTick: number;
  liveUpdateInProgress: boolean;
  liveUpdateProcessingRawData: boolean;
  positionsServerReturn: object;
  tableRowUpdateList: Array<SecurityTableRowDTO>;
}

const initialState: TradeState = {
  presetSelected: false,
  liveUpdateSecondCount: 0,
  liveUpdateTick: 0,
  liveUpdateInProgress: false,
  liveUpdateProcessingRawData: false,
  positionsServerReturn: null,
  tableRowUpdateList: []
};

export function tradeReducer(
  state = initialState,
  action
  ): TradeState {
  switch (action.type) {
    case TradeActions.TogglePresetEvent:
      const oldFlag = state.presetSelected;
      return {
        ...state,
        presetSelected: !oldFlag
      };
    case TradeActions.LiveUpdateCount:
      const oldCount = state.liveUpdateSecondCount;
      return {
        ...state,
        liveUpdateSecondCount: oldCount + 1
      }
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
        liveUpdateProcessingRawData: true,
        positionsServerReturn: action.serverReturn
      };
    case TradeActions.LiveUpdatePassTableContentEvent:
      return {
        ...state,
        tableRowUpdateList: action.rowList
      };
    case TradeActions.LiveUpdateProcessingDataCompleteEvent:
      return {
        ...state,
        liveUpdateProcessingRawData: false
      };
    default:
      return state;
  }
}

export function reducer(state: TradeState | undefined, action: Action) {
  return tradeReducer(state, action);
}