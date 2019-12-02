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
  TradeLiveUpdateReceiveRawData,
  TradeLiveUpdatePassTableContent
} from 'Trade/actions/trade.actions';

export interface TradeState {
  liveUpdateTimeCount: number;
  liveUpdateTick: number;
  liveUpdateInProgress: boolean;
  tableContentList: Array<SecurityTableRowDTO>;
}

const initialState: TradeState = {
  liveUpdateTimeCount: 0,
  liveUpdateTick: 0,
  liveUpdateInProgress: false,
  tableContentList: []
};

export function tradeReducer(
  state = initialState,
  action
  ): TradeState {
  switch (action.type) {
    case TradeActions.LiveUpdateStartEvent:
      let newTick = state.liveUpdateTick;
      newTick = newTick + 1;
      console.log('at reducer, tick =', newTick);
      return {
        ...state,
        liveUpdateTick: newTick
      };
    case TradeActions.LiveUpdateInProgressEvent:
      return {
        ...state,
        liveUpdateInProgress: true
      };
    case TradeActions.LiveUpdatePassTableContent:
      return {
        ...state,
        liveUpdateInProgress: false,
        tableContentList: action.rowList
      };
    default:
      return state;
  }
}

export function reducer(state: TradeState | undefined, action: Action) {
  return tradeReducer(state, action);
}