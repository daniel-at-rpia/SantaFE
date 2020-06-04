import { Action } from '@ngrx/store';
import { SecurityMapEntry } from 'FEModels/frontend-adhoc-packages.interface';
import { AlertDTO, AlertCountSummaryDTO } from 'FEModels/frontend-models.interface';

export enum CoreActions {
  UserLoggedIn = '[Core] User Logged In',
  ToggleAlertThumbnailDisplay = '[Core] Toggle Thumbnail Display',
  LoadSecurityMap = '[Core] Load Security Map',
  FlushSecurityMap = '[Core] Fluahs Security Map',
  SendNewAlerts = '[Core] Send New Alerts',
  SendAlertCountsByType = '[Core] Send Alert Counts',
  ReceivedNewAlerts = '[Core] Received New Alerts',
  SendReadAlerts = '[Core] Send Read Alerts',
  ReceivedReadAlerts = '[Core] Received Read Alerts'
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

export class CoreSendReadAlerts implements Action {
  readonly type = CoreActions.SendReadAlerts;
  readonly list: Array<AlertDTO>;
  constructor(
    list: Array<AlertDTO>
  ){
    this.list = list;
  }
}

export class CoreReceivedReadAlerts implements Action {
  readonly type = CoreActions.ReceivedReadAlerts;
  constructor(){}
}
