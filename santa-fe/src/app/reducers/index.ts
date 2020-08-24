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
import {
  StructureState,
  structureReducer
} from 'Structure/reducers/structure.reducer';

export interface AppState {
  core: CoreState;
  trade: TradeState;
  structure: StructureState;
}

export const appReducers: ActionReducerMap<AppState> = {
  core: coreReducer,
  trade: tradeReducer,
  structure: structureReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
