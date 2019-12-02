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
  TradeLiveUpdateReceiveRawDataEvent,
  TradeLiveUpdatePassTableContentEvent
} from 'Trade/actions/trade.actions';

export interface TradeState {
  liveUpdateSecondCount: number;
  liveUpdateTick: number;
  liveUpdateInProgress: boolean;
  liveUpdatePaused: boolean;
  positionsServerReturn: object;
}

const initialState: TradeState = {
  liveUpdateSecondCount: 0,
  liveUpdateTick: 0,
  liveUpdateInProgress: false,
  liveUpdatePaused: false,
  positionsServerReturn: null
};

export function tradeReducer(
  state = initialState,
  action
  ): TradeState {
  switch (action.type) {
    case TradeActions.LiveUpdateStartEvent:
      let oldTick = state.liveUpdateTick;
      return {
        ...state,
        liveUpdateSecondCount: 0,
        liveUpdateTick: oldTick + 1,
        liveUpdateInProgress: true
      };
    case TradeActions.LiveUpdateInProgressEvent:
      return {
        ...state,
        liveUpdateInProgress: true
      };
    case TradeActions.LiveUpdatePassTableContentEvent:
      return {
        ...state,
        liveUpdateInProgress: false,
        positionsServerReturn: action.serverReturn
      };
    case TradeActions.LiveUpdateCount:
      const oldCount = state.liveUpdateSecondCount;
      return {
        ...state,
        liveUpdateSecondCount: oldCount + 1
      }
    default:
      return state;
  }
}

export function reducer(state: TradeState | undefined, action: Action) {
  return tradeReducer(state, action);
}