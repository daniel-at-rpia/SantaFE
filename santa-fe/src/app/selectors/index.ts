
import { AppState } from 'App/reducers';
import { TradeState } from 'Trade/reducers/trade.reducer';
import { CoreState } from 'Core/reducers/core.reducer';
import { StructureState } from 'Structure/reducers/structure.reducer'

export const getCoreState = (appState: AppState) => {
  return appState.core;
} 

export const getTradeState = (appState: AppState) => {
  return appState.trade;
}

export const getStructureState = (appState: AppState) => {
  return appState.structuring;
}