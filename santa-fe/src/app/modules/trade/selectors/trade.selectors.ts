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

export const selectLiveUpdateInProgress = createSelector(
  getTradeState,
  (state: TradeState) => state.liveUpdateInProgress
);

export const selectLiveUpdateProcessingRawData = createSelector(
  getTradeState,
  (state: TradeState) => state.liveUpdateProcessingRawData
);

export const selectPresetSelected = createSelector(
  getTradeState,
  (state: TradeState) => state.presetSelected
);

export const selectInitialDataLoaded = createSelector(
  getTradeState,
  (state: TradeState) => state.initialDataLoaded
);

export const selectSelectedSecurityForAnalysis = createSelector(
  getTradeState,
  (state: TradeState) => state.selectedSecurityForAnalysis
);

export const selectSecurityIDsFromAnalysis = createSelector(
  getTradeState,
  (state: TradeState) => state.securityIDListFromAnalysis
);

export const securityTableRowDTOListForAnalysis = createSelector(
  getTradeState,
  (state: TradeState) => state.securityTableRowDTOListForAnalysis
);