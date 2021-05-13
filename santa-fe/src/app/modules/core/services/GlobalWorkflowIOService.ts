import { Injectable } from '@angular/core';
import { DetachedRouteHandle } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { DTOs, AdhocPacks } from '../models/frontend';
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
  INDEXEDDB_WORKFLOW_TABLE_NAME,
  INDEXEDDB_LAST_STATE_TABLE_NAME,
  ROUTE_REUSE_HANDLER_STORE_SIZE_CAP
} from 'Core/constants/globalWorkflowConstants.constants';

@Injectable()

export class GlobalWorkflowIOService {
  // given that storing workflow state is the only application of indexedDB in Santa at the moment, there is no need to over-engineer the indexedDB layer in santa, just put it in IOService for now
  private workflowIndexedDBAPI: IDBDatabase;
  constants = {
    idbVersion: INDEXEDDB_VERSION,
    idbWorkflowDbName: INDEXEDDB_WORKFLOW_DATABASE_NAME,
    idbWorkflowAllStateTableName: INDEXEDDB_WORKFLOW_TABLE_NAME,
    idbWorkflowLastStateTableName: INDEXEDDB_LAST_STATE_TABLE_NAME,
    moduleUrl: NavigationModule
  }

  private currentState: string = 'initialState';
  private currentModule: NavigationModule = null;
  private routeHandlerStore: Array<AdhocPacks.RouteHandlerStoreBlock> = [];
  private subscriptionStore: 
    Map<
      NavigationModule,
      Map<
        string, 
        Array<Subscription>
      >
    > = new Map();

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
      const IOTransaction = this.workflowIndexedDBAPI.transaction([this.constants.idbWorkflowAllStateTableName], "readwrite");
      const IOService = IOTransaction.objectStore(this.constants.idbWorkflowAllStateTableName);
      IOTransaction.onerror = (event) => {
        console.error('Global Workflow, store state error', event);
      }
      IOService.put(writableCopy);
    }

    public fetchState(targetUUID: string): Observable<DTOs.GlobalWorkflowStateDTO> {
      return new Observable(subscriber => {
        if (!!targetUUID) {
          const IOTransaction = this.workflowIndexedDBAPI.transaction([this.constants.idbWorkflowAllStateTableName], "readwrite");
          const IOService = IOTransaction.objectStore(this.constants.idbWorkflowAllStateTableName);
          const request = IOService.get(targetUUID);
          IOTransaction.oncomplete = ((event) => {
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
          IOTransaction.onerror = ((event) => {
            console.error('Global Workflow, retrieve state failure', event, targetUUID);
          });
        } else {
          subscriber.next(null);
        }
      });
    }

    public loadLastStates(): Observable<Array<AdhocPacks.GlobalWorkflowLastState>> {
      return new Observable(subscriber => {
        const results = [];
        let expectedNumOfResults = 0;
        for (let eachModule in NavigationModule) {
          expectedNumOfResults++;
        }
        for (let eachModule in NavigationModule) {
          const IOTransaction = this.workflowIndexedDBAPI.transaction([this.constants.idbWorkflowLastStateTableName], "readwrite");
          const IOService = IOTransaction.objectStore(this.constants.idbWorkflowLastStateTableName);
          const request = IOService.get(eachModule);
          IOTransaction.oncomplete = ((event) => {
            results.push(request.result);
            if (results.length >= expectedNumOfResults) {
              subscriber.next(results);
            }
          });
          IOTransaction.onerror = ((event) => {
            console.error('Global Workflow, retrieve state failure', event, eachModule);
          });
        }
      });
    }

  // Global Workflow States End

  // Work with RouteReuseStrategy

    public updateCurrentState(newModule: NavigationModule ,newStateId: string) {
      this.currentModule = newModule;
      this.currentState = newStateId;
      this.storeLastState(newModule, newStateId)
    }

    public attachRouteHandlerToState(targetUUID: string, targetHandler: DetachedRouteHandle) {
      if (!!targetUUID) {
        const alreadyExist = this.routeHandlerStore.find((eachEntry) => {
          return targetUUID === eachEntry.state;
        });
        if (alreadyExist) {
          alreadyExist.handle = targetHandler;
        } else {
          if (this.routeHandlerStore.length >= ROUTE_REUSE_HANDLER_STORE_SIZE_CAP) {
            const removedState = this.routeHandlerStore.shift();
            this.closeLooseSubscriptions(removedState.state);
          }
          this.routeHandlerStore.push({
            state: targetUUID,
            handle: targetHandler
          });
        }
      }
    }

    public fetchHandler(targetUUID: string): DetachedRouteHandle {
      if (!!targetUUID) {
        const targetHandler = this.routeHandlerStore.find((eachEntry) => {
          return targetUUID === eachEntry.state;
        });
        if (!!targetHandler) {
          return targetHandler.handle;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }

    public storeSubscriptions(subscriptionList: Array<Subscription>){
      if (!!this.currentModule && !!this.currentState && subscriptionList && subscriptionList.length > 0) {
        const moduleStore = this.subscriptionStore.get(this.currentModule);
        if (!!moduleStore) {
          const existingSubscriptions = moduleStore.get(this.currentState) || [];
          moduleStore.set(this.currentState, existingSubscriptions.concat(subscriptionList));
          this.subscriptionStore.set(this.currentModule, moduleStore);
        }
      }
    }

    public closeLooseSubscriptions(targetStateId: string){
      this.subscriptionStore.forEach((eachModuleStore) => {
        if (!!eachModuleStore) {
          const existingSubscriptions = eachModuleStore.get(targetStateId) || [];
          existingSubscriptions.forEach((eachSub) => {
            if (!eachSub.closed) {
              eachSub.unsubscribe();
            }
          });
          eachModuleStore.delete(targetStateId);
        }
      });
    }

    public removeTradeRoutesinRouteHandlerStore() {
      if (this.routeHandlerStore.length > 0 ) {
        this.routeHandlerStore = this.routeHandlerStore.filter((handle: any) => {
          if (!!handle && !!handle.handle && !!handle.handle.route && !!handle.handle.route.value && !!handle.handle.route.value.snapshot && !!handle.handle.route.value.snapshot.url && handle.handle.route.value.snapshot.url.length > 0) {
            const isTradeRoute = handle.handle.route.value.snapshot.url.find(url => url.path === this.constants.moduleUrl.trade);
            return !isTradeRoute;
          } else {
            return true;
          }
        })
      }
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

        if (newVersionDetectedEvent.oldVersion === 0) {
          // version 0 means that the client had no database
          // perform initialization
          this.initializeWorkflowTable();
          this.initializeLastStateTable();
        } else {
          // for all other versions, simply destory the database and reload, which will trigger the "version === 0" condition that rebuilds the database
          // this is not the most efficient way to handle upgrade but it is error-proof
          const deleteRequest = window.indexedDB.deleteDatabase(this.constants.idbWorkflowDbName);
          deleteRequest.onsuccess = (event) => {
            window.location.reload(true);
          }
        }
        this.workflowIndexedDBAPI.onversionchange = (event) => {
          // versionchange event will trigger on other instances of the application that did not trigger the delete of the database
          // this is to handle scenarios where users have multiple tabs of the Santa open. What will happen is, one of the tabs triggers the delete, the other tabs will refresh themselves as the delete is completed.
          this.workflowIndexedDBAPI.close();
          setTimeout(()=>{
            // delayed to reload in order to make sure when reload database is already deleted
            window.location.reload(true);
          }, 1000);
        };

      }
    }

    private initializeWorkflowTable() {
      this.workflowIndexedDBAPI.createObjectStore(this.constants.idbWorkflowAllStateTableName, { keyPath: "uuid" });  // this key field has to be the "id" field 
    }

    private initializeLastStateTable() {
      this.workflowIndexedDBAPI.createObjectStore(this.constants.idbWorkflowLastStateTableName, { keyPath: "module" });
    }

    private storeLastState(targetModule: NavigationModule, targetUUID: string) {
      if (!!this.workflowIndexedDBAPI) {
        // this if condition serves both as a null-check and a guard for not recording the initial state on app load, because it is unnecessary to store it
        const IOTransaction = this.workflowIndexedDBAPI.transaction([this.constants.idbWorkflowLastStateTableName], "readwrite");
        const IOService = IOTransaction.objectStore(this.constants.idbWorkflowLastStateTableName);
        IOTransaction.onerror = (event) => {
          console.error('Global Workflow, store last state error', event);
        }
        const newEntry: AdhocPacks.GlobalWorkflowLastState = {
          module: targetModule,
          stateUUID: targetUUID
        };
        IOService.put(newEntry);
      }
    }

    private initializeSubscriptionStore(){
      this.subscriptionStore.set(NavigationModule.trade, new Map());
      this.subscriptionStore.set(NavigationModule.structuring, new Map());
      this.subscriptionStore.set(NavigationModule.market, new Map());
    }
    
  // Work with RouteReuseStrategy End

}