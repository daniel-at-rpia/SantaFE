import { Action } from '@ngrx/store';
import { SecurityMapEntry } from 'FEModels/frontend-adhoc-packages.interface';

export enum CoreActions {
  UserLoggedIn = '[Core] User Logged In',
  ToggleAlertThumbnailDisplay = '[Core] Toggle Thumbnail Display',
  LoadSecurityMap = '[Core] Load Security Map'
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