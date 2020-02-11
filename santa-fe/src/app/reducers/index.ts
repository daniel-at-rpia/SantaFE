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
import {
  CoreState,
  coreReducer
} from 'Core/reducers/core.reducer';

export interface AppState {
  core: CoreState;
  trade: TradeState;
}

export const appReducers: ActionReducerMap<AppState> = {
  core: coreReducer,
  trade: tradeReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
