import { Action } from '@ngrx/store';
import { StructureActions } from 'Structure/actions/structure.actions';
import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';

export interface StructureState {
  selectedMetric: string;
}

const initialState: StructureState = {
  selectedMetric: PortfolioMetricValues.cs01
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
      }
    default:
      return state;
  }
}

export function reducer(state: StructureState, action: Action) {
  return structureReducer(state,action);
}