import {
  Action,
  ActionReducer,
  ActionReducerMap
} from '@ngrx/store';

import { AlertDTO } from 'FEModels/frontend-models.interface';
import { CoreActions } from 'Core/actions/core.actions';
import { SecurityMapEntry } from 'FEModels/frontend-adhoc-packages.interface';

export interface CoreState {
  user: {
    initials: string;
  }
  alert: {
    newAlerts: Array<AlertDTO>;
    displayThumbnail: boolean;
  }
  securityMap: {
    valid: boolean;
    mapContent: Array<SecurityMapEntry>
  }
}

const initialState: CoreState = {
  user: {
    initials: null
  },
  alert: {
    newAlerts: [],
    displayThumbnail: true
  },
  securityMap: {
    valid: false,
    mapContent: []
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
    case CoreActions.ToggleAlertThumbnailDisplay:
       return {
         ...state,
         alert: {
           ...state.alert,
           displayThumbnail: action.value
         }
       };
    case CoreActions.LoadSecurityMap:
      return {
        ...state,
        securityMap: {
          valid: true,
          mapContent: action.map
        }
      };
    case CoreActions.SendNewAlerts:
      return {
        ...state,
        alert: {
          ...state.alert,
          newAlerts: state.alert.newAlerts.concat(action.list)
        }
      };
    case CoreActions.ReceivedNewAlerts:
      return {
        ...state,
        alert: {
          ...state.alert,
          newAlerts: []
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