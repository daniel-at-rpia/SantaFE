import { Action } from '@ngrx/store';
import { SecurityMapEntry } from 'FEModels/frontend-adhoc-packages.interface';
import {
  AlertDTO,
  AlertCountSummaryDTO,
  GlobalWorkflowStateDTO
} from 'FEModels/frontend-models.interface';

export enum CoreActions {
  UserLoggedIn = '[Core] User Logged In',
  ToggleAlertThumbnailDisplay = '[Core] Toggle Thumbnail Display',
  SendNewAlerts = '[Core] Send New Alerts',
  SendAlertCountsByType = '[Core] Send Alert Counts',
  ReceivedNewAlerts = '[Core] Received New Alerts',
  GlobalWorkflowSendNewState = '[Core] Global Workflow Send New State',
  GlobalWorkflowUpdateCurrentState = '[Core] Global Workflow Update Current State',
  MainThreadOccupiedState = '[Core] Main Thread Is Occupied',
  MainThreadUnoccupiedState = '[Core] Main Thread Is Unoccupied',
  GlobalAlertIncrementInternalCountEvent = '[Core] Global Alert Increment Count Event',
  GlobalAlertMakeAPICall = '[Core] Global Alert Make API Alert Call',
  GlobalAlertsReadyForNextAlertCall = '[Core] Global Alerts Ready For Next Alert Call',
  GlobalAlertsProcessingRawAlertsEvent = '[Core] Processing Raw Global Alerts',
  GlobalAlertsProcessedRawAlerts = '[Core] Raw Alerts Processed For Global Alerts',
  GlobalAlertsPassNewAlertsToTradeAlertPanel = '[Core] Passed Alerts to Trade Alert',
  GlobalAlertsAPIAlertCallFailed = '[Core] Global Alerts Failed to Make API Call For Alerts',
  GlobalAlertsClearAllUrgentAlerts = '[Core] Global Alerts Clear All Urgent Alerts In Store',
  GlobalAlertsClearAllTradeAlertTableAlerts = '[Core] Global Alerts Clear All Alerts For Trade Alert Panel In Store',
  GlobalAlertsTradeAlertTableReadyToReceiveAdditionalAlerts = '[Core] Alert Table Fetch For Alerts',
  GlobalWorkflowUpdateCurrentTradeState = '[Core] Global Workflow Update Current Trade State',
  GlobalWorkflowUpdateCurrentStructureState = '[Core] Global Workflow Update Current Structure State',
  GlobalWorkflowIndexedDBReady = '[Core] Global Workflow IndexedDB Ready',
}

export class CoreUserLoggedIn implements Action {
  readonly type = CoreActions.UserLoggedIn;
  readonly initials: string;
  constructor(
    userInitials: string
  ){
    this.initials = userInitials;
  }
}

export class CoreToggleAlertThumbnailDisplay implements Action {
  readonly type = CoreActions.ToggleAlertThumbnailDisplay;
  readonly value: boolean;
  constructor(
    value: boolean
  ){
    this.value = value;
  }
}

export class CoreSendNewAlerts implements Action {
  readonly type = CoreActions.SendNewAlerts;
  readonly list: Array<AlertDTO>;
  constructor(
    list: Array<AlertDTO>
  ){
    this.list = list;
  }
}

export class CoreSendAlertCountsByType implements Action {
  readonly type = CoreActions.SendAlertCountsByType;
  readonly payload: Array<AlertCountSummaryDTO>;
  constructor(
    payload: Array<AlertCountSummaryDTO> = []
  ) {
    this.payload = payload;
  }
}

export class CoreReceivedNewAlerts implements Action {
  readonly type = CoreActions.ReceivedNewAlerts;
  constructor(){}
}

export class CoreGlobalWorkflowSendNewState implements Action {
  readonly type = CoreActions.GlobalWorkflowSendNewState;
  readonly newState: GlobalWorkflowStateDTO;
  constructor(
    newState: GlobalWorkflowStateDTO
  ){
    this.newState = newState;
  }
}

export class CoreGlobalWorkflowUpdateCurrentTradeState implements Action {
  readonly type = CoreActions.GlobalWorkflowUpdateCurrentTradeState;
  readonly uuid: string;
  constructor(
    uuid: string
  ){
    this.uuid = uuid;
  }
}

export class CoreMainThreadOccupiedState implements Action {
  readonly type = CoreActions.MainThreadOccupiedState;
  readonly occupiedState: boolean;
  constructor(occupiedState: boolean) {
    this.occupiedState = occupiedState;
  };
}

export class CoreMainThreadUnoccupiedState implements Action {
  readonly type = CoreActions.MainThreadUnoccupiedState;
  readonly unoccupiedState: boolean;
  constructor(unoccupiedState: boolean) {
    this.unoccupiedState = unoccupiedState;
  };
}

export class CoreGlobalLiveUpdateInternalCountEvent implements Action {
  readonly type = CoreActions.GlobalAlertIncrementInternalCountEvent;
  readonly count: number;
  constructor(count: number) {
    this.count = count;
  }
}

export class CoreGlobalAlertIsReadyToMakeAlertCall implements Action {
  readonly type = CoreActions.GlobalAlertsReadyForNextAlertCall;
  constructor() {}
}

export class CoreGlobalAlertProcessingEvent implements Action {
  readonly type = CoreActions.GlobalAlertsProcessingRawAlertsEvent;
  constructor() {}
}
export class CoreGlobalAlertsProcessedRawAlerts implements Action {
  readonly type = CoreActions.GlobalAlertsProcessedRawAlerts;
  constructor() {};
}

export class CoreGlobalAlertsMakeAPICallEvent implements Action {
  readonly type = CoreActions.GlobalAlertMakeAPICall;
  readonly newState: boolean;
  constructor(newState: boolean) {
    this.newState = newState;
  };
}

export class CoreGlobalAlertsSendNewAlertsToTradeAlertPanel implements Action {
  readonly type = CoreActions.GlobalAlertsPassNewAlertsToTradeAlertPanel;
  readonly list: Array<AlertDTO>;
  constructor(
    list: Array<AlertDTO>
  ){
    this.list = list;
  }
}

export class CoreGlobalAlertFailedToMakeAlertAPICall implements Action {
  readonly type = CoreActions.GlobalAlertsAPIAlertCallFailed;
  readonly newState: boolean;
  constructor(newState: boolean) {
    this.newState = newState;
  }
}

export class CoreGlobalAlertClearAllUrgentAlerts implements Action {
  readonly type = CoreActions.GlobalAlertsClearAllUrgentAlerts;
  constructor() {};
}

export class CoreGlobalAlertsClearAllTradeAlertTableAlerts implements Action {
  readonly type = CoreActions.GlobalAlertsClearAllTradeAlertTableAlerts;
  constructor() {};
}

export class CoreGlobalAlertsTradeAlertFetch {
  readonly type = CoreActions.GlobalAlertsTradeAlertTableReadyToReceiveAdditionalAlerts;
  readonly lastReceivedTimestamp: number;
  constructor(lastReceivedTimestamp: number) {
    this.lastReceivedTimestamp = lastReceivedTimestamp;
  }
}
export class CoreGlobalWorkflowUpdateCurrentStructureState implements Action {
  readonly type = CoreActions.GlobalWorkflowUpdateCurrentStructureState;
  readonly uuid: string;
  constructor(
    uuid: string
  ){
    this.uuid = uuid;
  }
}

export class CoreGlobalWorkflowIndexedDBReady implements Action {
  readonly type = CoreActions.GlobalWorkflowIndexedDBReady;
  constructor(){}
}
