import {
  Action,
  ActionReducer,
  ActionReducerMap
} from '@ngrx/store';

import { AlertDTO, AlertCountSummaryDTO } from 'FEModels/frontend-models.interface';
import { CoreActions } from 'Core/actions/core.actions';
import { SecurityMapEntry } from 'FEModels/frontend-adhoc-packages.interface';

export interface CoreState {
  user: {
    initials: string;
  };
  alert: {
    readAlerts: Array<AlertDTO>;
    newAlerts: Array<AlertDTO>;
    countByTypeArr: Array<AlertCountSummaryDTO>;
    displayThumbnail: boolean;
  };
  securityMap: {
    valid: boolean;
    mapContent: Array<SecurityMapEntry>
  };
}

const initialState: CoreState = {
  user: {
    initials: null
  },
  alert: {
    readAlerts: [],
    newAlerts: [],
    countByTypeArr: [],
    displayThumbnail: true
  },
  securityMap: {
    valid: false,
    mapContent: []
  }
};

export function coreReducer(
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
    case CoreActions.FlushSecurityMap:
      return {
        ...state,
        securityMap: {
          valid: false,
          mapContent: []
        }
      };
    case CoreActions.SendNewAlerts:
      return {
        ...state,
        alert: {
          ...state.alert,
          newAlerts: action.list
        }
      };
    case CoreActions.SendAlertCountsByType:
      return {
        ...state,
        alert: {
          ...state.alert,
          countByTypeArr: action.payload
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
    case CoreActions.SendReadAlerts:
      return {
        ...state,
        alert: {
          ...state.alert,
          readAlerts: action.list
        }
      };
    case CoreActions.ReceivedReadAlerts: 
      return {
        ...state,
        alert: {
          ...state.alert,
          readAlerts: []
        }
      }
    default:
      return {
        ...state
      };
  }
}

export function reducer(state: CoreState, action: Action) {
  return coreReducer(state, action);
}
