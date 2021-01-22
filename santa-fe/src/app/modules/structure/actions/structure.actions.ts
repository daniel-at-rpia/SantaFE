import { Action } from '@ngrx/store';
import * as moment from 'moment';

import {
  PortfolioMetricValues,
  BreakdownViewFilter,
  PortfolioShortNames
} from 'Core/constants/structureConstants.constants';
import {
  StructureSetTargetOverlayTransferPack,
  StructureSetViewTransferPack
} from 'FEModels/frontend-adhoc-packages.interface';
import { BEStructuringFundBlockWithSubPortfolios } from 'BEModels/backend-models.interface';

export enum StructureActions {
  StructureStoreReset = '[Structure] Reset Store Upon Entering',
  SelectedMetricLevel = '[Structure] Metric Level Selected',
  SendSetTargetTransfer = '[Structure] Send Set Target Transfer',
  ReloadBreakdownDataPostEdit = '[Structure] Reload Breakdown Data',
  SetView = '[Structure] View Set For Breakdown Category',
  UpdateMainPanel = '[Structure] Update Main Panel',
  ChangeBreakdownViewFilter = '[Structure] Change Breakdown View Filter',
  ChangePortfolioViewFilter = '[Structure] Change Portfolio View Filter',
  SwitchDataDatestamp = '[Structure] Switch Data Datestamp'
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
  readonly pack: StructureSetTargetOverlayTransferPack;
  constructor(pack: StructureSetTargetOverlayTransferPack) {
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
  readonly viewData: StructureSetViewTransferPack;
  constructor(viewData: StructureSetViewTransferPack) {
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

export class StructureSwitchDataDatestampEvent implements Action {
  readonly type = StructureActions.SwitchDataDatestamp;
  readonly dateStampInUnix: number;
  constructor(dateStampInMoment: moment.Moment) {
    this.dateStampInUnix = parseInt(dateStampInMoment.format('X'));
  }
}
