import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {
  TradeState,
  TradeReducer
} from 'Trade/reducers/trade.reducer';

export interface State {
  trade: TradeState
}

export const reducers: ActionReducerMap<State> = {
  trade: TradeReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
