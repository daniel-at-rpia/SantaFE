import { Action } from '@ngrx/store';

import { DTOs } from 'Core/models/frontend';
import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';

export enum TradeActions {
  TradeStoreReset = '[Trade] Reset Store Upon Entering',
  LiveUpdateStartEvent = '[Trade] Live Update Start',
  LiveUpdateInProgressEvent = '[Trade] Live Update Processing',
  LiveUpdatePassRawDataToMainTableEvent = '[Trade] Live Update Pass Raw Data to Main Table',
  LiveUpdateProcessingDataCompleteInMainTableEvent = '[Trade] Live Update Processing Data Complete in Main Table',
  TradeLiveUpdateInitiateNewDataFetchFromBackendInMainTableEvent = '[Trade] Live Update Initiate New Data Fetch From Backend In Main Table',
  LiveUpdatePassRawDataToAlertTableEvent = '[Trade] Live Update Pass Raw Data to Alert Table',
  LiveUpdateProcessingDataCompleteInAlertTableEvent = '[Trade] Live Update Processing Data Complete in Alert Table',
  LiveUpdateUtilityInternalCountEvent = '[Trade] Live Update Utility Internal Count',
  LiveUpdateCount = '[Trade] Live Update Count',
  TogglePresetEvent = '[Trade] Toggle Preset Event',
  SelectSecurityForAnalysisEvent = '[Trade] Select Security For Analysis Event',
  SecurityIDListFromAnalysisEvent = '[Trade] Security ID List From Analysis Event',
  SecurityTableRowDTOListForAnalysisEvent = '[Trade] SecurityTableRowDTO List For Analysis Event',
  ChangeBestQuoteValidWindowEvent = '[Trade] Change Best Quote Valid Window Event',
  SelectSecurityForAlertConfigEvent = '[Trade] Select Security For Alert Config Event',
  AlertTableSendNewAlerts = '[Trade] Alert Table Send New Alerts',
  AlertTableReceiveNewAlerts = '[Trade] Alert Table Receive New Alerts',
  KeywordSearchThisSecurity = '[Trade] Keyword Search This Security',
  CenterPanelLoadTableWithFilter = '[Trade] Center Panel Load Table With Filter',
  BICSDataLoaded = '[Trade] BICS Data Loaded'
}

export class TradeStoreResetEvent implements Action {
  readonly type = TradeActions.TradeStoreReset;
  constructor(){}
}

export class TradeLiveUpdateStartEvent implements Action {
  readonly type = TradeActions.LiveUpdateStartEvent;
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

export class TradeLiveUpdatePassRawDataToMainTableEvent implements Action {
  readonly type = TradeActions.LiveUpdatePassRawDataToMainTableEvent;
  constructor(){}
}

export class TradeLiveUpdateProcessDataCompleteInMainTableEvent implements Action {
  readonly type = TradeActions.LiveUpdateProcessingDataCompleteInMainTableEvent;
  constructor(){}
}

export class TradeLiveUpdateInitiateNewDataFetchFromBackendInMainTableEvent implements Action {
  readonly type = TradeActions.TradeLiveUpdateInitiateNewDataFetchFromBackendInMainTableEvent;
  constructor(){}
}

export class TradeLiveUpdatePassRawDataToAlertTableEvent implements Action {
  readonly type = TradeActions.LiveUpdatePassRawDataToAlertTableEvent;
  constructor(){}
}

export class TradeLiveUpdateProcessDataCompleteInAlertTableEvent implements Action {
  readonly type = TradeActions.LiveUpdateProcessingDataCompleteInAlertTableEvent;
  constructor(){}
}

export class TradeTogglePresetEvent implements Action {
  readonly type = TradeActions.TogglePresetEvent;
  constructor(){}
}

export class TradeSelectedSecurityForAnalysisEvent implements Action {
  readonly type = TradeActions.SelectSecurityForAnalysisEvent;
  readonly targetSecurity: DTOs.SecurityDTO;
  constructor(
    targetSecurity: DTOs.SecurityDTO
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
  readonly securityTableRowDTOList: Array<DTOs.SecurityTableRowDTO>;
  constructor(
    securityTableRowDTOList: Array<DTOs.SecurityTableRowDTO>
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
  readonly targetSecurity: DTOs.SecurityDTO;
  constructor(
    targetSecurity: DTOs.SecurityDTO
  ){
    this.targetSecurity = targetSecurity;
  }
}

export class TradeAlertTableSendNewAlertsEvent implements Action {
  readonly type = TradeActions.AlertTableSendNewAlerts;
  readonly list: Array<string>;
  constructor(
    list: Array<string>
  ){
    this.list = list;
  }
}

export class TradeAlertTableReceiveNewAlertsEvent implements Action {
  readonly type = TradeActions.AlertTableReceiveNewAlerts;
  constructor(){}
}

export class TradeKeywordSearchThisSecurityEvent implements Action {
  readonly type = TradeActions.KeywordSearchThisSecurity;
  readonly keyword: string;
  constructor(keyword: string){
    this.keyword = keyword;
  }
}

export class TradeCenterPanelLoadTableWithFilterEvent implements Action {
  readonly type = TradeActions.CenterPanelLoadTableWithFilter;
  readonly filterList: Array<DTOs.SecurityDefinitionDTO>;
  readonly metric: PortfolioMetricValues;
  readonly presetDisplayTitle: string;
  constructor(
    filterList: Array<DTOs.SecurityDefinitionDTO>,
    metric: PortfolioMetricValues,
    presetDisplayTitle: string
  ){
    this.filterList = filterList;
    this.metric = metric;
    this.presetDisplayTitle = presetDisplayTitle;
  }
}

export class TradeBICSDataLoadedEvent implements Action {
  readonly type = TradeActions.BICSDataLoaded;
  constructor(){}
}
