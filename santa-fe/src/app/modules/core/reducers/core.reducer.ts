import {
  Action,
  ActionReducer,
  ActionReducerMap
} from '@ngrx/store';

import { DTOs, AdhocPacks } from 'Core/models/frontend';
import { CoreActions } from 'Core/actions/core.actions';

export interface CoreState {
  user: {
    initials: string;
  };
  alert: {
    newAlerts: Array<DTOs.AlertDTO>;
    countByTypeArr: Array<DTOs.AlertCountSummaryDTO>;
    displayThumbnail: boolean;
  };
  securityMap: {
    valid: boolean;
    mapContent: Array<AdhocPacks.SecurityMapEntry>;
  };
  globalWorkflow: {
    newState: DTOs.GlobalWorkflowStateDTO;
    currentStateUUID: string;
    indexedDBReady: boolean;
  }
}

const initialState: CoreState = {
  user: {
    initials: null
  },
  alert: {
    newAlerts: [],
    countByTypeArr: [],
    displayThumbnail: true
  },
  securityMap: {
    valid: false,
    mapContent: []
  },
  globalWorkflow: {
    newState: null,
    currentStateUUID: null,
    indexedDBReady: false
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
    case CoreActions.GlobalWorkflowSendNewState:
      return {
        ...state,
        globalWorkflow: {
          ...state.globalWorkflow,
          newState: action.newState
        }
      };
    case CoreActions.GlobalWorkflowUpdateCurrentState:
      return {
        ...state,
        globalWorkflow: {
          ...state.globalWorkflow,
          currentStateUUID: action.uuid
        }
      }
    case CoreActions.GlobalWorkflowIndexedDBReady:
      return {
        ...state,
        globalWorkflow: {
          ...state.globalWorkflow,
          indexedDBReady: true
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
