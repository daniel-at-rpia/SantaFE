import { createSelector } from '@ngrx/store';
import { StructureState } from 'Structure/reducers/structure.reducer';
import { getStructureState } from 'App/selectors';

export const selectMetricLevel = createSelector(
  getStructureState, 
  (state: StructureState) => state.selectedMetric
);

export const selectSetTargetTransferPack = createSelector(
  getStructureState,
  (state: StructureState) => state.setTargetTransfer
);
