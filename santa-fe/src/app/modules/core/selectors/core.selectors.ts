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

export const selectDislayAlertThumbnail = createSelector(
  getCoreState,
  (state: CoreState) => state.alert.displayThumbnail
);

export const selectSecurityMapContent = createSelector(
  getCoreState,
  (state:CoreState) => state.securityMap.mapContent
);

export const selectSecurityMapValidStatus = createSelector(
  getCoreState,
  (state:CoreState) => state.securityMap.valid
);

export const selectNewAlerts = createSelector(
  getCoreState,
  (state: CoreState) => state.alert.newAlerts
);

export const selectAlertCounts = createSelector(
  getCoreState,
  (state: CoreState) => state.alert.countByTypeArr
);

export const ownerInitials = createSelector(
  getCoreState,
  (state: CoreState) => state.user.initials
)