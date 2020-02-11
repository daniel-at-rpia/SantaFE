import {
  Action,
  ActionReducer,
  ActionReducerMap
} from '@ngrx/store';

import { AlertDTO } from 'FEModels/frontend-models.interface';
import { CoreActions } from 'Core/actions/core.actions';

export interface CoreState {
  user: {
    initials: string;
  }
  alert: {
    newAlerts: Array<AlertDTO>;
  }
}

const initialState: CoreState = {
  user: {
    initials: null
  },
  alert: {
    newAlerts: []
  }
}

export function coreReducer (
  state: CoreState = initialState,
  action
): CoreState {
  switch (action.type) {
    case CoreActions.UserLoggedIn:
      return {
        ...state,
        user: {
          initials: action.initials
        }
      };
    default:
      return {
        ...state
      };
  }
}

export function reducer(state: CoreState, action: Action) {
  return coreReducer(state, action);
}