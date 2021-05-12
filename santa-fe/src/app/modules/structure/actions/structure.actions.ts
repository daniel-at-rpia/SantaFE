import { Action } from '@ngrx/store';
import * as moment from 'moment';

import {
  PortfolioMetricValues,
  BreakdownViewFilter,
  SubPortfolioFilter,
  DeltaScope
} from 'Core/constants/structureConstants.constants';
import { AdhocPacks, PageStates } from 'Core/models/frontend';
import { BEStructuringFundBlockWithSubPortfolios } from 'BEModels/backend-models.interface';
import { PortfolioShortNames } from 'Core/constants/coreConstants.constant';

export enum StructureActions {
  StructureStoreReset = '[Structure] Reset Store Upon Entering',
  SelectedMetricLevel = '[Structure] Metric Level Selected',
  SendSetTargetTransfer = '[Structure] Send Set Target Transfer',
  ReloadBreakdownDataPostEdit = '[Structure] Reload Breakdown Data',
  SetView = '[Structure] View Set For Breakdown Category',
  UpdateMainPanel = '[Structure] Update Main Panel',
  ChangeBreakdownViewFilter = '[Structure] Change Breakdown View Filter',
  ChangePortfolioViewFilter = '[Structure] Change Portfolio View Filter',
  ChangeSubPortfolioViewFilter = '[Structure] Change Sub-Portfolio View Filter',
  ChangeDeltaScope = '[Structure] Change Delta Scope',
  SwitchDataDatestamp = '[Structure] Switch Data Datestamp',
  UtilityPanelLoadState = '[Structure] Utility Panel Load State',
  SetBulkOverridesEvent = '[Structure] Set Bulk Overrides Event',
  SendSetBulkOverridesTransfer = '[Structure] Send Set Bulk Overrides Transfer',
  FullStructureDataLoaded = '[Structure] Initial Structure Data Loaded',
  StructureOverrideDataTransfer = '[Structure] Structure Overrride Data Transfer Event',
  StructureSetBulkOverridesTransfer = '[Structure] Structure Set Bulk Override Transfer Event'
}

export class StructureStoreResetEvent implements Action {
  readonly type = StructureActions.StructureStoreReset;
  constructor(){}
}

export class StructureMetricSelect implements Action {
  readonly type = StructureActions.SelectedMetricLevel;
  readonly selectedMetric: PortfolioMetricValues;
  constructor(selectedMetric: PortfolioMetricValues) {
    this.selectedMetric = selectedMetric
  };
}

export class StructureSendSetTargetTransferEvent implements Action {
  readonly type = StructureActions.SendSetTargetTransfer;
  readonly pack: AdhocPacks.StructureSetTargetOverlayTransferPack;
  constructor(pack: AdhocPacks.StructureSetTargetOverlayTransferPack) {
    this.pack = pack;
  }
}

export class StructureReloadFundDataPostEditEvent implements Action {
  readonly type = StructureActions.ReloadBreakdownDataPostEdit;
  readonly targetRawFund: BEStructuringFundBlockWithSubPortfolios;
  constructor(targetRawFund: BEStructuringFundBlockWithSubPortfolios) {
    this.targetRawFund = targetRawFund;
  }
}

export class StructureUpdateMainPanelEvent implements Action {
  readonly type = StructureActions.UpdateMainPanel;
  constructor(){}
}

export class StructureSetView implements Action {
  readonly type = StructureActions.SetView;
  readonly viewData: AdhocPacks.StructureSetViewTransferPack;
  constructor(viewData: AdhocPacks.StructureSetViewTransferPack) {
    this.viewData = viewData;
  }
}

export class StructureChangeBreakdownViewFilterEvent implements Action {
  readonly type = StructureActions.ChangeBreakdownViewFilter;
  readonly filterOption: BreakdownViewFilter;
  constructor(filterOption) {
    this.filterOption = filterOption;
  }
}

export class StructureChangePortfolioViewFilterEvent implements Action {
  readonly type = StructureActions.ChangePortfolioViewFilter;
  readonly filterOption: Array<PortfolioShortNames>;
  constructor(filterOption: Array<PortfolioShortNames>) {
    this.filterOption = filterOption;
  }
}

export class StructureChangeSubPortfolioViewFilterEvent implements Action {
  readonly type = StructureActions.ChangeSubPortfolioViewFilter;
  readonly filterOption: SubPortfolioFilter;
  constructor(filterOption: SubPortfolioFilter) {
    this.filterOption = filterOption;
  }
}

export class StructureSwitchDataDatestampEvent implements Action {
  readonly type = StructureActions.SwitchDataDatestamp;
  readonly dateStampInUnix: number;
  constructor(dateStampInMoment: moment.Moment) {
    this.dateStampInUnix = parseInt(dateStampInMoment.format('X'));
  }
}

export class StructureChangeDeltaScopeEvent implements Action {
  readonly type = StructureActions.ChangeDeltaScope;
  readonly deltaScope: DeltaScope;
  constructor(newDeltaScope: DeltaScope) {
    this.deltaScope = newDeltaScope;
  }
}

export class StructureUtilityPanelLoadStateEvent implements Action {
  readonly type = StructureActions.UtilityPanelLoadState;
  readonly panelState: PageStates.StructureUtilityPanelState;
  constructor(panelState: PageStates.StructureUtilityPanelState) {
    this.panelState = panelState;
  }
}

export class StructureSetBulkOverridesEvent implements Action {
  readonly type = StructureActions.SetBulkOverridesEvent;
  constructor() {}
}

export class StructureFullDataLoadedEvent implements Action {
  readonly type = StructureActions.FullStructureDataLoaded;
  readonly fullDataLoaded: boolean;
  constructor(fullDataLoaded: boolean) {
    this.fullDataLoaded = fullDataLoaded;
  }
}

export class StructureOverrideDataTransferEvent implements Action {
  readonly type = StructureActions.StructureOverrideDataTransfer;
  readonly transferPack: AdhocPacks.StructureSetTargetOverrideTransferPack;
  constructor(transferPack: AdhocPacks.StructureSetTargetOverrideTransferPack) {
    this.transferPack = transferPack;
  }
}

export class StructureSetBulkOverridesTransferEvent implements Action {
  readonly type = StructureActions.StructureSetBulkOverridesTransfer;
  readonly transferPack: AdhocPacks.StructureSetBulkOverrideTransferPack;
  constructor(transferPack: AdhocPacks.StructureSetBulkOverrideTransferPack) {
    this.transferPack = transferPack
  }
}