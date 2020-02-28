import { Action } from '@ngrx/store';

export enum CoreActions {
  UserLoggedIn = '[Core] User Logged In',
  ToggleAlertThumbnailDisplay = '[Core] Toggle Thumbnail Display'
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