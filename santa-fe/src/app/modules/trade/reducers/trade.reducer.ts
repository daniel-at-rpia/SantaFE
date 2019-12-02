import { TradeTestEvent } from 'Trade/actions/trade.actions';

export interface TradeState {
  testString: string;
}

const initialState: TradeState = {
  testString: ''
};

export function TradeReducer(
  state = initialState,
  action
  ): TradeState {
  switch (action.type) {
    case 'test':
      console.log('test, at reducer', state);
      return { ...state, testString: 'aloha'};
    default:
      return state;
  }
}