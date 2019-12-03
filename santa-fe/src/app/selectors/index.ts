
import { AppState } from 'App/reducers';
import { TradeState } from 'Trade/reducers/trade.reducer';

export const getTradeState = (appState: AppState) => {
  return appState.trade;
}