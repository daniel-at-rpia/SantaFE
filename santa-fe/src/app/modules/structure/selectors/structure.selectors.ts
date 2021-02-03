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

export const selectReloadFundDataPostEdit = createSelector(
  getStructureState,
  (state: StructureState) => state.reloadFundDataPostEdit
);

export const selectSetViewData = createSelector(
  getStructureState,
  (state: StructureState) => state.viewData
);

export const selectMainPanelUpdateTick = createSelector(
  getStructureState,
  (state: StructureState) => state.updateTick
);

export const selectActiveBreakdownViewFilter = createSelector(
  getStructureState,
  (state: StructureState) => state.activeBreakdownViewFilter
);

export const selectActivePortfolioViewFilter = createSelector(
  getStructureState,
  (state: StructureState) => state.activePortfolioViewFilter
);

export const selectDataDatestamp = createSelector(
  getStructureState,
  (state: StructureState) => state.dataDatestamp
);

export const selectActiveSubPortfolioFilter = createSelector(
  getStructureState,
  (state: StructureState) => state.activeSubPortfolioFilter
);

export const selectActiveDeltaScope = createSelector(
  getStructureState,
  (state: StructureState) => state.activeDeltaScope
);

