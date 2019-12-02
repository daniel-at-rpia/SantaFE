import { createSelector } from '@ngrx/store';

import { TradeState } from 'Trade/reducers/trade.reducer';
import { getTradeState } from 'App/selectors';

export const selectLiveUpdateTick = createSelector(
  getTradeState,
  (state: TradeState) => state.liveUpdateTick
);

export const selectLiveUpdateCount = createSelector(
  getTradeState,
  (state: TradeState) => state.liveUpdateSecondCount
);

export const selectLiveUpdatePaused = createSelector(
  getTradeState,
  (state: TradeState) => state.liveUpdatePaused
);

export const selectLiveUpdateInProgress = createSelector(
  getTradeState,
  (state: TradeState) => state.liveUpdateInProgress
);