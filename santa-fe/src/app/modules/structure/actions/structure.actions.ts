import { Action } from '@ngrx/store';
import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
import {
  StructureSetTargetOverlayTransferPack,
  StructureSetTargetPostEditUpdatePack,
  StructureSetViewData
} from 'FEModels/frontend-adhoc-packages.interface';

export enum StructureActions {
  StructureStoreReset = '[Structure] Reset Store Upon Entering',
  SelectedMetricLevel = '[Structure] Metric Level Selected',
  SendSetTargetTransfer = '[Structure] Send Set Target Transfer',
  ReloadBreakdownDataPostEdit = '[Structure] Reload Breakdown Data',
  SetView = '[Structure] View Set For Breakdown Category'
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

export class StructureReloadBreakdownDataPostEditEvent implements Action {
  readonly type = StructureActions.ReloadBreakdownDataPostEdit;
  readonly pack: StructureSetTargetPostEditUpdatePack;
  constructor(pack: StructureSetTargetPostEditUpdatePack) {
    this.pack = pack;
  }
}

export class StructureSetView implements Action {
  readonly type = StructureActions.SetView;
  readonly viewData: StructureSetViewData;
  constructor(viewData: StructureSetViewData) {
    this.viewData = viewData;
  }
}
