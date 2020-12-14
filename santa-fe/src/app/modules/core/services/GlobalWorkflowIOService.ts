import { Injectable } from '@angular/core';
import { DetachedRouteHandle } from '@angular/router';

import { GlobalWorkflowStateDTO } from 'FEModels/frontend-models.interface';
import { UtilityService } from 'Core/services/UtilityService';

@Injectable()

export class GlobalWorkflowIOService {
  private temporaryStore: Map<string, GlobalWorkflowStateDTO> = new Map();

  constructor(
    private utilityService: UtilityService
  ){}

  public storeState(targetState: GlobalWorkflowStateDTO) {
    this.temporaryStore.set(targetState.data.uuid, this.utilityService.deepCopy(targetState));
  }

  public fetchState(targetUUID: string): GlobalWorkflowStateDTO {
    if (!!targetUUID) {
      return this.temporaryStore.get(targetUUID) || null;
    } else {
      return null;
    }
  }

  public attachRouteHandlerToState(targetUUID: string, targetHandler: DetachedRouteHandle) {
    if (!!targetUUID) {
      const targetState = this.temporaryStore.get(targetUUID);
      if (!!targetState && targetState.state.triggersRedirect) {
        targetState.api.routeHandler = targetHandler;
      } else {
        console.warn('Attaching route handler to a null state or non-redirect state', targetState);
      }
    }
  }

  public fetchHandler(targetUUID: string): DetachedRouteHandle {
    if (!!targetUUID) {
      const targetState = this.temporaryStore.get(targetUUID);
      if (!!targetState && targetState.state.triggersRedirect) {
        if (!!targetState.api.routeHandler) {
          return targetState.api.routeHandler;
        } else {
          console.warn('Tried to fetch for route handler while it is not stored', targetState);
          return null;
        }
      } else {
        console.warn('Fetching route handler from a null state or non-redirect state', targetState);
        return null;
      }
    } else {
      return null;
    }
  }
}