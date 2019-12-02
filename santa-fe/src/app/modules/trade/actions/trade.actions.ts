import { Action } from '@ngrx/store';

import { SecurityTableRowDTO } from 'FEModels/frontend-models.interface';

export enum TradeActions {
  LiveUpdateStartEvent = '[Trade] Live Update Start',
  LiveUpdateInProgressEvent = '[Trade] Live Update Processing',
  LiveUpdateReceiveRawData = '[Trade] Live Update Receive Raw Data',
  LiveUpdatePassTableContent = '[Trade] Live Update Pass Table Content'
}

export class TradeLiveUpdateStartEvent implements Action {
  readonly type = TradeActions.LiveUpdateStartEvent;
  constructor(){}
}

export class TradeLiveUpdateInProgressEvent implements Action {
  readonly type = TradeActions.LiveUpdateInProgressEvent;
  constructor(){}
}

export class TradeLiveUpdateReceiveRawData implements Action {
  readonly type = TradeActions.LiveUpdateReceiveRawData;
  constructor(){}
}

export class TradeLiveUpdatePassTableContent implements Action {
  readonly type = TradeActions.LiveUpdatePassTableContent;
  readonly rowList: Array<SecurityTableRowDTO>;
  constructor(){}
}