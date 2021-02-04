import { Injectable } from '@angular/core';
import { DetachedRouteHandle } from '@angular/router';

import { DTOs } from '../models/frontend';
import { UtilityService } from 'Core/services/UtilityService';
import { DTOService } from 'Core/services/DTOService';
import { GlobalWorkflowTypes } from 'Core/constants/coreConstants.constant';

@Injectable()

export class GlobalWorkflowIOService {
  // given that storing workflow state is the only application of indexedDB in Santa at the moment, there is no need to over-engineer the indexedDB layer in santa, just put it in IOService for now
  private INDEXEDDB_VERSION = 1;
  private INDEXEDDB_WORKFLOW_DATABASE_NAME = 'GlobalWorkflow';
  private INDEXEDDB_WORKFLOW_STORE_NAME = 'WorkflowStore';

  private temporaryStore: Map<string, DTOs.GlobalWorkflowStateDTO> = new Map();
  private workflowIndexedDBAPI: IDBDatabase;
  private workflowStore: IDBObjectStore;
  private workflowIO: IDBTransaction;

  constructor(
    private utilityService: UtilityService,
    private dtoService: DTOService
  ){
    const openRequest = window.indexedDB.open(this.INDEXEDDB_WORKFLOW_DATABASE_NAME, this.INDEXEDDB_VERSION);
    this.initiateIndexedDBRequestHandler(openRequest);
  }

  public storeState(targetState: DTOs.GlobalWorkflowStateDTO) {
    const writableCopy = this.utilityService.deepCopy(targetState);
    writableCopy.data.stateInfo = JSON.stringify(writableCopy.data.stateInfo);
    writableCopy.api = null;
    this.workflowIO = this.workflowIndexedDBAPI.transaction([this.INDEXEDDB_WORKFLOW_STORE_NAME], "readwrite");
    this.workflowStore = this.workflowIO.objectStore(this.INDEXEDDB_WORKFLOW_STORE_NAME);
    this.workflowIO.oncomplete = (event) => {
      console.log('IDB fetch complete', event);
    }
    this.workflowIO.onerror = (event) => {
      console.log('IDB fetch error', event);
    }
    this.workflowStore.put(writableCopy);
    // const exist = this.temporaryStore.get(writableCopy.data.uuid);
    // if (!!exist && exist.data.workflowType === GlobalWorkflowTypes.routeHandlerPlaceholder) {
    //   writableCopy.api.routeHandler = exist.api.routeHandler;
    // }
    // this.temporaryStore.set(targetState.data.uuid, writableCopy);
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

  private initiateIndexedDBRequestHandler(openRequest: IDBOpenDBRequest) {
    openRequest.onerror = (errorEvent) => {
      // do something if necessary
    }

    openRequest.onsuccess = (successEvent) => {
      console.log('IDB open request success.', successEvent);
      this.workflowIndexedDBAPI = openRequest.result;
    }

    openRequest.onupgradeneeded = (newVersionDetectedEvent) => {
      console.log('IDB open request upgrade needed.', newVersionDetectedEvent);
      // reconstruct the database upon version change
      this.workflowIndexedDBAPI = openRequest.result;
      switch(newVersionDetectedEvent.oldVersion) {
        case 0:
          // version 0 means that the client had no database
          // perform initialization
          this.workflowStore = this.workflowIndexedDBAPI.createObjectStore(this.INDEXEDDB_WORKFLOW_STORE_NAME, { keyPath: "uuid" });  // this key field has to be the "id" field 
          break;
        default:
          window.indexedDB.deleteDatabase(this.INDEXEDDB_WORKFLOW_DATABASE_NAME);
          break;
      }
    }
  }

}