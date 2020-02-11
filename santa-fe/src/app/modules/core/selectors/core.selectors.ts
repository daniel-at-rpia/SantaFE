import { createSelector } from '@ngrx/store';

import { CoreState } from 'Core/reducers/core.reducer';
import { getCoreState } from 'App/selectors';

export const selectAlertUpdate = createSelector(
  getCoreState,
  (state: CoreState) => state.alert.newAlerts
);

export const selectUserInitials = createSelector(
  getCoreState,
  (state: CoreState) => state.user.initials
);