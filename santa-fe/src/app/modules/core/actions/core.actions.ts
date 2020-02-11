import { Action } from '@ngrx/store';

export enum CoreActions {
  UserLoggedIn = '[Core] User Logged In'
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