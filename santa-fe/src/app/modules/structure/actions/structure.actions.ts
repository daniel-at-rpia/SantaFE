import { Action } from '@ngrx/store';
import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
import {
  StructureSetTargetOverlayTransferPack,
  StructureSetViewData
} from 'FEModels/frontend-adhoc-packages.interface';
import { BEPortfolioStructuringDTO } from 'BEModels/backend-models.interface';

export enum StructureActions {
  StructureStoreReset = '[Structure] Reset Store Upon Entering',
  SelectedMetricLevel = '[Structure] Metric Level Selected',
  SendSetTargetTransfer = '[Structure] Send Set Target Transfer',
  ReloadBreakdownDataPostEdit = '[Structure] Reload Breakdown Data',
  SetView = '[Structure] View Set For Breakdown Category',
  UpdateMainPanel = '[Structure] Update Main Panel'
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
  readonly targetRawFund: BEPortfolioStructuringDTO;
  constructor(targetRawFund: BEPortfolioStructuringDTO) {
    this.targetRawFund = targetRawFund;
  }
}

export class StructureUpdateMainPanelEvent implements Action {
  readonly type = StructureActions.UpdateMainPanel;
  constructor(){}
}

export class StructureSetView implements Action {
  readonly type = StructureActions.SetView;
  readonly viewData: StructureSetViewData;
  constructor(viewData: StructureSetViewData) {
    this.viewData = viewData;
  }
}
