import { Injectable } from '@angular/core';
import { DetachedRouteHandle } from '@angular/router';

import { DTOs } from '../models/frontend';
import { UtilityService } from 'Core/services/UtilityService';
import { DTOService } from 'Core/services/DTOService';
import { GlobalWorkflowTypes } from 'Core/constants/coreConstants.constant';

@Injectable()

export class GlobalWorkflowIOService {
  private temporaryStore: Map<string, DTOs.GlobalWorkflowStateDTO> = new Map();

  constructor(
    private utilityService: UtilityService,
    private dtoService: DTOService
  ){}

  public storeState(targetState: DTOs.GlobalWorkflowStateDTO) {
    const writableCopy = this.utilityService.deepCopy(targetState);
    const exist = this.temporaryStore.get(writableCopy.data.uuid);
    if (!!exist && exist.data.workflowType === GlobalWorkflowTypes.routeHandlerPlaceholder) {
      writableCopy.api.routeHandler = exist.api.routeHandler;
    }
    this.temporaryStore.set(targetState.data.uuid, writableCopy);
  }

  public fetchState(targetUUID: string): DTOs.GlobalWorkflowStateDTO {
    if (!!targetUUID) {
      return this.temporaryStore.get(targetUUID) || null;
    } else {
      return null;
    }
  }

  public attachRouteHandlerToState(targetUUID: string, targetHandler: DetachedRouteHandle) {
    if (!!targetUUID) {
      const targetState = this.temporaryStore.get(targetUUID);
      if (!!targetState) {
        targetState.api.routeHandler = targetHandler;
      } else {
        const newState = this.dtoService.formGlobalWorkflow(null, false, GlobalWorkflowTypes.routeHandlerPlaceholder);
        newState.data.uuid = targetUUID;
        this.storeState(newState);
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