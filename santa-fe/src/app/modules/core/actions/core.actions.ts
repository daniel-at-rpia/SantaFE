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
  LoadSecurityMap = '[Core] Load Security Map',
  FlushSecurityMap = '[Core] Fluahs Security Map',
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
  GlobalAlertsAPIAlertCallFailed = '[Core] Global Alerts Failed to Make API Call For Alerts'
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

export class CoreLoadSecurityMap implements Action {
  readonly type = CoreActions.LoadSecurityMap;
  readonly map: Array<SecurityMapEntry>;
  constructor(
    map: Array<SecurityMapEntry>
  ){
    this.map = map;
  }
}

export class CoreFlushSecurityMap implements Action {
  readonly type = CoreActions.FlushSecurityMap;
  constructor(){}
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

export class CoreGlobalWorkflowUpdateCurrentState implements Action {
  readonly type = CoreActions.GlobalWorkflowUpdateCurrentState;
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

export class CoreIsReadyToMakeAlertCall implements Action {
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
