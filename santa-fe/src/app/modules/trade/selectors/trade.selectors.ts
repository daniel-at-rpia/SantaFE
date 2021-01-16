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

export const selectPresetSelected = createSelector(
  getTradeState,
  (state: TradeState) => state.presetSelected
);

export const selectLiveUpdateInProgress = createSelector(
  getTradeState,
  // Right now there are two places access the InProg flag:
  // 1. in trade.effects.ts, convert an internal count to an external count
  (state: TradeState) => state.tradeMainTable.liveUpdateInProgress
);

export const selectInitialDataLoadedInAlertTable = createSelector(
  getTradeState,
  (state: TradeState) => state.tradeAlertTable.initialDataLoaded
);

export const selectLiveUpdateProcessingRawDataInAlertTable = createSelector(
  getTradeState,
  (state: TradeState) => state.tradeAlertTable.liveUpdateProcessingRawData
);

export const selectInitialDataLoadedInMainTable = createSelector(
  getTradeState,
  (state: TradeState) => state.tradeMainTable.initialDataLoaded
);

export const selectLiveUpdateProcessingRawDataToMainTable = createSelector(
  getTradeState,
  (state: TradeState) => state.tradeMainTable.liveUpdateProcessingRawData
);

export const selectSelectedSecurityForAnalysis = createSelector(
  getTradeState,
  (state: TradeState) => state.selectedSecurityForAnalysis
);

export const selectSecurityIDsFromAnalysis = createSelector(
  getTradeState,
  (state: TradeState) => state.securityIDListFromAnalysis
);

export const selectSecurityTableRowDTOListForAnalysis = createSelector(
  getTradeState,
  (state: TradeState) => state.securityTableRowDTOListForAnalysis
);

export const selectBestQuoteValidWindow = createSelector(
  getTradeState,
  (state: TradeState) => state.bestQuoteValidWindow
);

export const selectSelectedSecurityForAlertConfig = createSelector(
  getTradeState,
  (state: TradeState) => state.selectedSecurityForAlertConfig
);

export const selectNewAlertsForAlertTable = createSelector(
  getTradeState,
  (state: TradeState) => state.newAlertsForAlertTable
);

export const selectKeywordSearchInMainTable = createSelector(
  getTradeState,
  (state: TradeState) => state.keywordSearchInMainTable
);

export const selectCenterPanelFilterListForTableLoad = createSelector(
  getTradeState,
  (state: TradeState) => state.centerPanel.autoLoadTable
);

export const selectBICSDataLoaded = createSelector(
  getTradeState,
  (state: TradeState) => state.bicsDataLoaded
);
