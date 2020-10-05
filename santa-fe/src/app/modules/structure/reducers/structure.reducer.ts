import { Action } from '@ngrx/store';
import { StructureActions } from 'Structure/actions/structure.actions';
import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
import {
  StructureSetTargetOverlayTransferPack,
  StructureSetTargetPostEditUpdatePack,
  StructureSetViewData,
} from 'FEModels/frontend-adhoc-packages.interface';

export interface StructureState {
  selectedMetric: string;
  setTargetTransfer: StructureSetTargetOverlayTransferPack;
  reloadBreakdownDataPostEdit: StructureSetTargetPostEditUpdatePack;
  viewData: StructureSetViewData;
}

const initialState: StructureState = {
  selectedMetric: PortfolioMetricValues.cs01,
  setTargetTransfer: null,
  reloadBreakdownDataPostEdit: null,
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
        reloadBreakdownDataPostEdit: action.pack
      }
    case StructureActions.SetView:
      return {
        ...state,
        viewData: action.viewData
      }
    default:
      return state;
  }
}

export function reducer(state: StructureState, action: Action) {
  return structureReducer(state,action);
}