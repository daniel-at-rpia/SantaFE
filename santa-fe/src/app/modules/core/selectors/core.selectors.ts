import { createSelector } from '@ngrx/store';

import { CoreState } from 'Core/reducers/core.reducer';
import { getCoreState } from 'App/selectors';

export const selectAlertUpdate = createSelector(
  getCoreState,
  (state: CoreState) => state.globalAlert.newAlerts
);

export const selectUserInitials = createSelector(
  getCoreState,
  (state: CoreState) => state.user.initials
);

export const selectDislayAlertThumbnail = createSelector(
  getCoreState,
  (state: CoreState) => state.globalAlert.displayThumbnail
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
  (state: CoreState) => state.globalAlert.newAlerts
);

export const selectAlertCounts = createSelector(
  getCoreState,
  (state: CoreState) => state.globalAlert.countByTypeArr
);

export const selectGlobalWorkflowNewState = createSelector(
  getCoreState,
  (state: CoreState) => state.globalWorkflow.newState
);

export const selectGlobalWorkflowUpdateCurrentState = createSelector(
  getCoreState,
  (state: CoreState) => state.globalWorkflow.currentStateUUID
);

export const selectMainThreadOccupied = createSelector(
  getCoreState,
  (state: CoreState) => state.globalAlert.mainThreadOccupied
)

export const selectGlobalAlertIsReadyToMakeNextAlertCall = createSelector(
  getCoreState,
  (state: CoreState) => state.globalAlert.readyForNextAlertCall
)

export const selectGlobalAlertProcessingAlertState = createSelector(
  getCoreState,
  (state: CoreState) => state.globalAlert.processingAlerts
)

export const selectGlobalAlertMakeAPICall = createSelector(
  getCoreState,
  (state: CoreState) => state.globalAlert.makeAPICall
)

export const selectGlobalAlertSendNewAlertsToTradePanel = createSelector(
  getCoreState,
  (state: CoreState) => state.globalAlert.newAlertsToTradeAlertPanel
)