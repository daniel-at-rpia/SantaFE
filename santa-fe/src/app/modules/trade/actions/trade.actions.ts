import { Action } from '@ngrx/store';

import { SecurityTableRowDTO } from 'FEModels/frontend-models.interface';

export enum TradeActions {
  LiveUpdateStartEvent = '[Trade] Live Update Start',
  LiveUpdateInProgressEvent = '[Trade] Live Update Processing',
  LiveUpdateReceiveRawDataEvent = '[Trade] Live Update Receive Raw Data',
  LiveUpdatePassTableContentEvent = '[Trade] Live Update Pass Table Content',
  LiveUpdateUtilityInternalCountEvent = '[Trade] Live Update Utility Internal Count',
  LiveUpdateCount = '[Trade] Live Update Count'
}

export class TradeLiveUpdateStartEvent implements Action {
  readonly type = TradeActions.LiveUpdateStartEvent;
  constructor(){}
}

export class TradeLiveUpdateInProgressEvent implements Action {
  readonly type = TradeActions.LiveUpdateInProgressEvent;
  constructor(){}
}

export class TradeLiveUpdateReceiveRawDataEvent implements Action {
  readonly type = TradeActions.LiveUpdateReceiveRawDataEvent;
  constructor(){}
}

export class TradeLiveUpdatePassTableContentEvent implements Action {
  readonly type = TradeActions.LiveUpdatePassTableContentEvent;
  readonly rowList: Array<SecurityTableRowDTO>;
  constructor(){}
}

export class TradeLiveUpdateUtilityInternalCountEvent implements Action {
  readonly type = TradeActions.LiveUpdateUtilityInternalCountEvent;
  constructor(){}
}

export class TradeLiveUpdateCount implements Action {
  readonly type = TradeActions.LiveUpdateCount;
  constructor(){}
}