import { Action } from '@ngrx/store';
import { StructureActions } from 'Structure/actions/structure.actions';
import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
import {
  StructureSetTargetOverlayTransferPack,
  StructureSetViewData,
} from 'FEModels/frontend-adhoc-packages.interface';
import { BEPortfolioStructuringDTO } from 'BEModels/backend-models.interface';

export interface StructureState {
  selectedMetric: string;
  setTargetTransfer: StructureSetTargetOverlayTransferPack;
  reloadFundDataPostEdit: BEPortfolioStructuringDTO;
  updateTick: number;
  viewData: StructureSetViewData;
}

const initialState: StructureState = {
  selectedMetric: PortfolioMetricValues.cs01,
  setTargetTransfer: null,
  reloadFundDataPostEdit: null,
  updateTick: 0,
  viewData: null
}

export function structureReducer(
  state = initialState,
  action
): StructureState {
  switch(action.type) {
    case StructureActions.StructureStoreReset:
      return initialState;
    case StructureActions.SelectedMetricLevel:
      return {
        ...state,
        selectedMetric: action.selectedMetric
      };
    case StructureActions.SendSetTargetTransfer:
      return {
        ...state,
        setTargetTransfer: action.pack
      };
    case StructureActions.ReloadBreakdownDataPostEdit:
      return {
        ...state,
        reloadFundDataPostEdit: action.targetRawFund
      }
    case StructureActions.SetView:
      return {
        ...state,
        viewData: action.viewData
      }
    case StructureActions.UpdateMainPanel:
      return {
        ...state,
        updateTick: state.updateTick + 1
      };
    default:
      return state;
  }
}

export function reducer(state: StructureState, action: Action) {
  return structureReducer(state,action);
}