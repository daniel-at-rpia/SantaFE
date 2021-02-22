import { Injectable } from '@angular/core';
import { DetachedRouteHandle } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { DTOs } from '../models/frontend';
import { UtilityService } from 'Core/services/UtilityService';
import { DTOService } from 'Core/services/DTOService';
import {
  GlobalWorkflowTypes,
  NavigationModule
} from 'Core/constants/coreConstants.constant';
import { CoreGlobalWorkflowIndexedDBReady } from 'Core/actions/core.actions';
import {
  INDEXEDDB_VERSION,
  INDEXEDDB_WORKFLOW_DATABASE_NAME,
  INDEXEDDB_WORKFLOW_STORE_NAME
} from 'Core/constants/globalWorkflowConstants.constants';

@Injectable()

export class GlobalWorkflowIOService {
  // given that storing workflow state is the only application of indexedDB in Santa at the moment, there is no need to over-engineer the indexedDB layer in santa, just put it in IOService for now
  private workflowIndexedDBAPI: IDBDatabase;
  private workflowStore: IDBObjectStore;
  private workflowIO: IDBTransaction;
  constants = {
    idbVersion: INDEXEDDB_VERSION,
    idbWorkflowDbName: INDEXEDDB_WORKFLOW_DATABASE_NAME,
    idbWorkflowStoreName: INDEXEDDB_WORKFLOW_STORE_NAME
  }

  private currentState: string = 'initialState';
  private currentModule: NavigationModule = null;
  private routeHanlderStore: Map<string, DetachedRouteHandle> = new Map();
  private subscriptionStore: Map<NavigationModule, Map<string, Array<Subscription>>> = new Map();

  constructor(
    private store$: Store<any>,
    private utilityService: UtilityService,
    private dtoService: DTOService
  ){
    const openRequest = window.indexedDB.open(this.constants.idbWorkflowDbName, this.constants.idbVersion);
    this.initiateIndexedDBRequestHandler(openRequest);
    this.initializeSubscriptionStore();
  }

  // Global Workflow States

    public storeState(targetState: DTOs.GlobalWorkflowStateDTO) {
      const writableCopy = this.utilityService.deepCopy(targetState);
      writableCopy.data.stateInfo = JSON.stringify(writableCopy.data.stateInfo);
      writableCopy.api = null;
      this.workflowIO = this.workflowIndexedDBAPI.transaction([this.constants.idbWorkflowStoreName], "readwrite");
      this.workflowStore = this.workflowIO.objectStore(this.constants.idbWorkflowStoreName);
      this.workflowIO.onerror = (event) => {
        console.error('Global Workflow, store state error', event);
      }
      this.workflowStore.put(writableCopy);
    }

    public fetchState(targetUUID: string): Observable<DTOs.GlobalWorkflowStateDTO> {
      return new Observable(subscriber => {
        if (!!targetUUID) {
          this.workflowIO = this.workflowIndexedDBAPI.transaction([this.constants.idbWorkflowStoreName], "readwrite");
          this.workflowStore = this.workflowIO.objectStore(this.constants.idbWorkflowStoreName);
          const request = this.workflowStore.get(targetUUID);
          this.workflowIO.oncomplete = ((event) => {
            if (!!request.result && !!request.result.data) {
              const workflowDTO: DTOs.GlobalWorkflowStateDTO = {
                uuid: request.result.uuid,
                data: {
                  uuid: request.result.data.uuid,
                  module: request.result.data.module,
                  workflowType: request.result.data.workflowType,
                  stateInfo: {}
                },
                api: request.result.api,
                state: request.result.state
              };
              workflowDTO.data.stateInfo = JSON.parse(request.result['data']['stateInfo']);
              console.log('Global Workflow, Retrieved State', workflowDTO);
              subscriber.next(workflowDTO);
            } else {
              console.warn('Global Workflow, could not find state', targetUUID);
              subscriber.next(null);
            }
          });
          this.workflowIO.onerror = ((event) => {
            console.error('Global Workflow, retrieve state failure', event, targetUUID);
          });
        } else {
          subscriber.next(null);
        }
      });
    }

    private initiateIndexedDBRequestHandler(openRequest: IDBOpenDBRequest) {
      openRequest.onerror = (errorEvent) => {
        console.error('IDB open request failed', errorEvent);
      }

      openRequest.onsuccess = (successEvent) => {
        console.log('IDB open request success.', successEvent);
        this.workflowIndexedDBAPI = openRequest.result;
        // only dispatch action when request is success, even in case of upgradeNeeded, it will still come to success once the upgrade is completed
        this.store$.dispatch(new CoreGlobalWorkflowIndexedDBReady());
      }

      openRequest.onupgradeneeded = (newVersionDetectedEvent) => {
        console.log('IDB open request upgrade needed.', newVersionDetectedEvent);
        // reconstruct the database upon version change
        this.workflowIndexedDBAPI = openRequest.result;
        switch(newVersionDetectedEvent.oldVersion) {
          case 0:
            // version 0 means that the client had no database
            // perform initialization
            this.upgradeIndexedDB(newVersionDetectedEvent);
            break;
          default:
            window.indexedDB.deleteDatabase(this.constants.idbWorkflowDbName);
            break;
        }
      }
    }

    private upgradeIndexedDB(newVersionDetectedEvent: IDBVersionChangeEvent) {
      this.workflowStore = this.workflowIndexedDBAPI.createObjectStore(this.constants.idbWorkflowStoreName, { keyPath: "uuid" });  // this key field has to be the "id" field 
    }

  // Global Workflow States End

  // Work with RouteReuseStrategy

    public updateCurrentState(newModule: NavigationModule ,newStateId: string) {
      this.currentModule = newModule;
      this.currentState = newStateId;
    }

    public attachRouteHandlerToState(targetUUID: string, targetHandler: DetachedRouteHandle) {
      if (!!targetUUID) {
        this.routeHanlderStore.set(targetUUID, targetHandler);
        // const targetState = this.temporaryStore.get(targetUUID);
        // if (!!targetState) {
        //   targetState.api.routeHandler = targetHandler;
        // } else {
        //   const newState = this.dtoService.formGlobalWorkflow(null, false, GlobalWorkflowTypes.routeHandlerPlaceholder);
        //   newState.data.uuid = targetUUID;
        //   this.storeState(newState);
        // }
      }
    }

    public fetchHandler(targetUUID: string): DetachedRouteHandle {
      if (!!targetUUID) {
        return this.routeHanlderStore.get(targetUUID) || null;
        // const targetState = this.temporaryStore.get(targetUUID);
        // if (!!targetState && targetState.state.triggersRedirect) {
        //   if (!!targetState.api.routeHandler) {
        //     return targetState.api.routeHandler;
        //   } else {
        //     console.warn('Tried to fetch for route handler while it is not stored', targetState);
        //     return null;
        //   }
        // } else {
        //   console.warn('Fetching route handler from a null state or non-redirect state', targetState);
        //   return null;
        // }
      } else {
        return null;
      }
    }

    public storeSubscriptions(subscriptionList: Array<Subscription>){
      if (!!this.currentModule && !!this.currentState && subscriptionList && subscriptionList.length > 0) {
        const moduleStore = this.subscriptionStore[this.currentModule];
        if (!!moduleStore) {
          console.log('test, storing subs', this.currentModule, this.currentState, subscriptionList);
          const existingSubscriptions = moduleStore.get(this.currentState) || [];
          moduleStore.set(this.currentState, existingSubscriptions.concat(subscriptionList));
          this.subscriptionStore.set(this.currentModule, moduleStore);
        }
      }
    }

    public closeLooseSubscriptions(targetModule: NavigationModule){
      if (!!targetModule) {
        const moduleStore = this.subscriptionStore[targetModule];
        if (!!moduleStore) {
          moduleStore.forEach((eachSubList) => {
            eachSubList.forEach((eachSub) => {
              if (!eachSub.closed) {
                eachSub.unsubscribe();
              }
            })
          });
          this.subscriptionStore[targetModule] = new Map();
        }
      }
    }

    private initializeSubscriptionStore(){
      this.subscriptionStore[NavigationModule.trade] = new Map();
      this.subscriptionStore[NavigationModule.structuring] = new Map();
      this.subscriptionStore[NavigationModule.market] = new Map();
    }

    // public closeSubscriptions(stateId: ){

    // }

  // Work with RouteReuseStrategy End

}