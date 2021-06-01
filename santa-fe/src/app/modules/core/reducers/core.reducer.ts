import {
  Action,
  ActionReducer,
  ActionReducerMap
} from '@ngrx/store';

import { DTOs, AdhocPacks, Blocks } from 'Core/models/frontend';
import { CoreActions } from 'Core/actions/core.actions';
import { FAILED_USER_INITIALS_FALLBACK } from 'Core/constants/coreConstants.constant';

export interface CoreState {
  authentication: {
    authenticated: boolean;
  }
  user: {
    initials: string;
  };
  globalWorkflow: {
    newState: DTOs.GlobalWorkflowStateDTO;
    currentStateInStructure: string;
    currentStateInTrade: string;
    indexedDBReady: boolean;
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
    tradeTableFetchAlertTick: number;
    tradeTableFetchAlertLastReceiveTimestamp: number;
  },
  securityActionMenu: {
    launchUofBPack: AdhocPacks.SecurityActionLaunchUofBTransferPack
  }
}

const initialState: CoreState = {
  authentication: {
    authenticated: false
  },
  user: {
    initials: null
  },
  globalWorkflow: {
    newState: null,
    currentStateInStructure: null,
    currentStateInTrade: null,
    indexedDBReady: false
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
    apiCallForAlertFailed: false,
    tradeTableFetchAlertTick: 0,
    tradeTableFetchAlertLastReceiveTimestamp: 0
  },
  securityActionMenu: {
    launchUofBPack: null
  }
};

export function coreReducer(
  state: CoreState = initialState,
  action
): CoreState {
  switch (action.type) {
    case CoreActions.UserLoggedIn:
    if (action.initials === FAILED_USER_INITIALS_FALLBACK) {
      return {
        ...state,
        authentication: {
          authenticated: false
        },
        user: {
          initials: action.initials
        }
      };
    } else {
      return {
        ...state,
        authentication: {
          authenticated: true
        },
        user: {
          initials: action.initials
        }
      };
    }
    case CoreActions.ToggleAlertThumbnailDisplay:
       return {
         ...state,
         globalAlert: {
           ...state.globalAlert,
           displayThumbnail: action.value
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
    case CoreActions.GlobalWorkflowUpdateCurrentTradeState:
      return {
        ...state,
        globalWorkflow: {
          ...state.globalWorkflow,
          currentStateInTrade: action.uuid
        }
      };
    case CoreActions.GlobalWorkflowUpdateCurrentStructureState:
      return {
        ...state,
        globalWorkflow: {
          ...state.globalWorkflow,
          currentStateInStructure: action.uuid
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
      if (!!action.newState) {
        return {
          ...state,
          globalAlert: {
            ...state.globalAlert,
            processingAlerts: false,
            makeAPICall: false,
            apiCallForAlertFailed: true
          }
        }
      } else {
        return {
          ...state,
          globalAlert: {
            ...state.globalAlert,
            apiCallForAlertFailed: false
          }
        }
      }
    case CoreActions.GlobalAlertsClearAllUrgentAlerts:
      return {
        ...state,
        globalAlert: {
          ...state.globalAlert,
          newUrgentAlerts: []
        }
      }
    case CoreActions.GlobalAlertsClearAllTradeAlertTableAlerts:
      return {
        ...state,
        globalAlert: {
          ...state.globalAlert,
          newTradeAlertTableAlerts: []
        }
      }
    case CoreActions.GlobalAlertsTradeAlertTableReadyToReceiveAdditionalAlerts:
      return {
        ...state,
        globalAlert: {
          ...state.globalAlert,
          tradeTableFetchAlertTick: state.globalAlert.tradeTableFetchAlertTick + 1,
          tradeTableFetchAlertLastReceiveTimestamp: action.lastReceivedTimestamp
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
    case CoreActions.LaunchUofBThroughSecurityActionMenu:
      return {
        ...state,
        securityActionMenu: {
          launchUofBPack: action.pack
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
