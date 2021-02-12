import { createSelector } from '@ngrx/store';

import { CoreState } from 'Core/reducers/core.reducer';
import { getCoreState } from 'App/selectors';


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
  (state: CoreState) => state.globalAlert.newUrgentAlerts
);

export const selectAlertCounts = createSelector(
  getCoreState,
  (state: CoreState) => state.globalAlert.countByTypeArr
);

export const selectGlobalWorkflowNewState = createSelector(
  getCoreState,
  (state: CoreState) => state.globalWorkflow.newState
);

export const selectGlobalWorkflowUpdateTradeState = createSelector(
  getCoreState,
  (state: CoreState) => state.globalWorkflow.currentStateInTrade
);

export const selectGlobalWorkflowUpdateStructureState = createSelector(
  getCoreState,
  (state: CoreState) => state.globalWorkflow.currentStateInStructure
);

export const selectGlobalWorkflowIndexedDBReadyState = createSelector(
  getCoreState,
  (state: CoreState) => state.globalWorkflow.indexedDBReady
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
  (state: CoreState) => state.globalAlert.newTradeAlertTableAlerts
)

export const selectGlobalAlertFailedToMakeAlertAPICall = createSelector(
  getCoreState,
  (state: CoreState) => state.globalAlert.apiCallForAlertFailed
)

export const selectGlobalAlertTradeAlertTableIsReadyToReceiveAdditionalAlerts = createSelector(
  getCoreState,
  (state: CoreState) => state.globalAlert.tradeTableReadyToReceiveAdditionalAlerts
)

export const selectGlobalAlertLiveInternalCountEvent = createSelector(
  getCoreState,
  (state: CoreState) => state.globalAlert.liveInternalCountEvent
)