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
  ToggleMetricEvent = '[Trade] Toggle Metric Event',
  SelectSecurityForAnalysisEvent = '[Trade] Select Security For Analysis Event'
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

export class TradeToggleMetricEvent implements Action {
  readonly type = TradeActions.ToggleMetricEvent;
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