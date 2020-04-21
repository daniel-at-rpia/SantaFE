import { Action } from '@ngrx/store';

import {
  SecurityTableRowDTO,
  SecurityDTO
} from 'FEModels/frontend-models.interface';

export enum TradeActions {
  LiveUpdateStartEvent = '[Trade] Live Update Start',
  LiveUpdateInProgressEvent = '[Trade] Live Update Processing',
  LiveUpdatePassRawDataEvent = '[Trade] Live Update Pass Raw Data',
  LiveUpdatePassTableContentEvent = '[Trade] Live Update Pass Table Content',
  LiveUpdateUtilityInternalCountEvent = '[Trade] Live Update Utility Internal Count',
  LiveUpdateCount = '[Trade] Live Update Count',
  LiveUpdateProcessingDataCompleteEvent = '[Trade] Live Update Processing Data Complete Event',
  TogglePresetEvent = '[Trade] Toggle Preset Event',
  SwitchDriverEvent = '[Trade] Toggle Driver Event',
  SelectSecurityForAnalysisEvent = '[Trade] Select Security For Analysis Event',
  SecurityIDListFromAnalysisEvent = '[Trade] Security ID List From Analysis Event',
  SecurityTableRowDTOListForAnalysisEvent = '[Trade] SecurityTableRowDTO List For Analysis Event',
  ChangeBestQuoteValidWindowEvent = '[Trade] Change Best Quote Valid Window Event',
  SelectSecurityForAlertConfigEvent = '[Trade] Select Security For Alert Config Event',
  SetFocusMode = '[Trade] Set Focus Mode'
}

export class TradeLiveUpdateStartEvent implements Action {
  readonly type = TradeActions.LiveUpdateStartEvent;
  constructor(){}
}

export class TradeLiveUpdateInProgressEvent implements Action {
  readonly type = TradeActions.LiveUpdateInProgressEvent;
  constructor(){}
}

export class TradeLiveUpdatePassRawDataEvent implements Action {
  readonly type = TradeActions.LiveUpdatePassRawDataEvent;
  constructor(){}
}

export class TradeLiveUpdatePassTableContentEvent implements Action {
  readonly type = TradeActions.LiveUpdatePassTableContentEvent;
  readonly rowList: Array<SecurityTableRowDTO>;
  constructor(
    rowList: Array<SecurityTableRowDTO>
  ){
    this.rowList = rowList;
  }
}

export class TradeLiveUpdateUtilityInternalCountEvent implements Action {
  readonly type = TradeActions.LiveUpdateUtilityInternalCountEvent;
  constructor(){}
}

export class TradeLiveUpdateCount implements Action {
  readonly type = TradeActions.LiveUpdateCount;
  constructor(){}
}

export class TradeLiveUpdateProcessDataCompleteEvent implements Action {
  readonly type = TradeActions.LiveUpdateProcessingDataCompleteEvent;
  constructor(){}
}

export class TradeTogglePresetEvent implements Action {
  readonly type = TradeActions.TogglePresetEvent;
  constructor(){}
}

export class TradeSwitchDriverEvent implements Action {
  readonly type = TradeActions.SwitchDriverEvent;
  constructor(){}
}

export class TradeSelectedSecurityForAnalysisEvent implements Action {
  readonly type = TradeActions.SelectSecurityForAnalysisEvent;
  readonly targetSecurity: SecurityDTO;
  constructor(
    targetSecurity: SecurityDTO
  ){
    this.targetSecurity = targetSecurity;
  }
}

export class TradeSecurityIDsFromAnalysisEvent implements Action {
  readonly type = TradeActions.SecurityIDListFromAnalysisEvent;
  readonly securityIDList: Array<string>;
  constructor(
    securityIDList: Array<string>
  ){
    this.securityIDList = securityIDList;
  }
}

export class TradeSecurityTableRowDTOListForAnalysisEvent implements Action {
  readonly type = TradeActions.SecurityTableRowDTOListForAnalysisEvent;
  readonly securityTableRowDTOList: Array<SecurityTableRowDTO>;
  constructor(
    securityTableRowDTOList: Array<SecurityTableRowDTO>
  ){
    this.securityTableRowDTOList = securityTableRowDTOList;
  }
}

export class TradeChangeBestQuoteValidWindowEvent implements Action {
  readonly type = TradeActions.ChangeBestQuoteValidWindowEvent;
  readonly window: number;
  constructor(
    window: number
  ){
    this.window = window;
  }
}

export class TradeSelectedSecurityForAlertConfigEvent implements Action {
  readonly type = TradeActions.SelectSecurityForAlertConfigEvent;
  readonly targetSecurity: SecurityDTO;
  constructor(
    targetSecurity: SecurityDTO
  ){
    this.targetSecurity = targetSecurity;
  }
}
export class TradeSetFocusMode implements Action {
  readonly type = TradeActions.SetFocusMode;
  readonly payload: boolean;
  constructor(
    payload: boolean
  ) {
    this.payload = payload;
  }
}
