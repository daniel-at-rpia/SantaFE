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
  securityMap: {
    valid: boolean;
    mapContent: Array<AdhocPacks.SecurityMapEntry>;
  };
  globalWorkflow: {
    newState: DTOs.GlobalWorkflowStateDTO;
    currentStateUUID: string;
  }
  globalAlert: {
    displayThumbnail: boolean;
    countByTypeArr: Array<DTOs.AlertCountSummaryDTO>;
    newUrgentAlerts: Array<DTOs.AlertDTO>;
    newTradeAlertTableAlerts: Array<DTOs.AlertDTO>;
    mainThreadOccupied: boolean;
    readyForNextAlertCall: boolean;
    processingAlerts: boolean;
    makeAPICall: boolean;
    apiCallForAlertFailed: boolean;
    //passedProcessedAlertsToAlertTable: boolean;
  }
}

const initialState: CoreState = {
  user: {
    initials: null
  },
  securityMap: {
    valid: false,
    mapContent: []
  },
  globalWorkflow: {
    newState: null,
    currentStateUUID: null
  },
  globalAlert: {
    displayThumbnail: true,
    countByTypeArr: [],
    newUrgentAlerts: [],
    newTradeAlertTableAlerts: [],
    mainThreadOccupied: false,
    readyForNextAlertCall: false,
    processingAlerts: false,
    makeAPICall: false,
    apiCallForAlertFailed: false
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
         globalAlert: {
           ...state.globalAlert,
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
        globalAlert: {
          ...state.globalAlert,
          newUrgentAlerts: action.list
        }
      };
    case CoreActions.SendAlertCountsByType:
      return {
        ...state,
        globalAlert: {
          ...state.globalAlert,
          countByTypeArr: action.payload
        }
      };
    case CoreActions.ReceivedNewAlerts:
      return {
        ...state,
        globalAlert: {
          ...state.globalAlert,
          newUrgentAlerts: []
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
    case CoreActions.MainThreadOccupiedState:
      return {
        ...state,
        globalAlert: {
          ...state.globalAlert,
          mainThreadOccupied: action.occupiedState
        }
      }
    case CoreActions.MainThreadUnoccupiedState:
      return {
        ...state,
        globalAlert: {
          ...state.globalAlert,
          mainThreadOccupied: action.unoccupiedState
        }
      }
    case CoreActions.GlobalAlertsReadyForNextAlertCall:
      return {
        ...state,
        globalAlert: {
          ...state.globalAlert,
          readyForNextAlertCall: true
        }
      }
    case CoreActions.GlobalAlertsProcessingRawAlertsEvent:
      return {
        ...state,
        globalAlert: {
          ...state.globalAlert,
          readyForNextAlertCall: false,
          processingAlerts: true,
        }
      }
    case CoreActions.GlobalAlertsProcessedRawAlerts:
      return {
        ...state,
        globalAlert: {
          ...state.globalAlert,
          makeAPICall: false,
          processingAlerts: false
        }
      }
    case CoreActions.GlobalAlertMakeAPICall:
      return {
        ...state,
        globalAlert: {
          ...state.globalAlert,
          makeAPICall: action.newState
        }
      }
    case CoreActions.GlobalAlertsPassNewAlertsToTradeAlertPanel:
      return {
        ...state,
        globalAlert: {
          ...state.globalAlert,
          newTradeAlertTableAlerts: action.list
        }
      }
    case CoreActions.GlobalAlertsAPIAlertCallFailed:
      return {
        ...state,
        globalAlert: {
          ...state.globalAlert,
          apiCallForAlertFailed: action.newState
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
