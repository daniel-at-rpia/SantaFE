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
  tradeReducer
} from 'Trade/reducers/trade.reducer';

export interface AppState {
  trade: TradeState
}

export const appReducers: ActionReducerMap<AppState> = {
  trade: tradeReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
