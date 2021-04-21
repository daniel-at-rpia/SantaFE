import { Injectable } from '@angular/core';
import { DetachedRouteHandle } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { DTOs, AdhocPacks } from '../models/frontend';
import { UtilityService } from 'Core/services/UtilityService';
import { DTOService } from 'Core/services/DTOService';
import {
  GlobalWorkflowTypes,
  NavigationModule,
  IndexedDBActions
} from 'Core/constants/coreConstants.constant';
import {
  INDEXEDDB_VERSION,
  INDEXEDDB_WORKFLOW_DATABASE_NAME,
  INDEXEDDB_WORKFLOW_TABLE_NAME,
  INDEXEDDB_LAST_STATE_TABLE_NAME,
  ROUTE_REUSE_HANDLER_STORE_SIZE_CAP
} from 'Core/constants/globalWorkflowConstants.constants';
import { IndexedDBService } from 'Core/services/IndexedDBService';

@Injectable()

export class GlobalWorkflowIOService {
  // given that storing workflow state is the only application of indexedDB in Santa at the moment, there is no need to over-engineer the indexedDB layer in santa, just put it in IOService for now
  private workflowIndexedDBAPI: AdhocPacks.IndexedDBAPIBlock = {
    api: null
  }
  constants = {
    idbVersion: INDEXEDDB_VERSION,
    idbWorkflowDbName: INDEXEDDB_WORKFLOW_DATABASE_NAME,
    idbWorkflowAllStateTableName: INDEXEDDB_WORKFLOW_TABLE_NAME,
    idbWorkflowLastStateTableName: INDEXEDDB_LAST_STATE_TABLE_NAME,
    IndexedDBAction: IndexedDBActions
  }
  private indexedDBTableBlockItems: Array<AdhocPacks.IndexedDBTableBlockItem> = [
    {
      name: this.constants.idbWorkflowAllStateTableName,
      key: 'uuid'
    },
    {
      name: this.constants.idbWorkflowLastStateTableName,
      key: 'module'
    }
  ]
  private currentState: string = 'initialState';
  private currentModule: NavigationModule = null;
  private routeHandlerStore: 
    Array<
      {
        state: string,
        handle: DetachedRouteHandle
      }
    > = [];
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
    private dtoService: DTOService,
    private indexedDBService: IndexedDBService
  ){
    const openRequest = this.indexedDBService.openRequestToIndexDBDatabase(this.constants.idbWorkflowDbName, this.constants.idbVersion);
    const indexedDBTableBlock = this.indexedDBService.createTableBlock(this.indexedDBTableBlockItems);
    indexedDBTableBlock && this.indexedDBService.initiateIndexedDBRequestHandler(openRequest, this.workflowIndexedDBAPI, this.constants.idbWorkflowDbName, indexedDBTableBlock, this.constants.IndexedDBAction.GlobalWorkflow);
    this.initializeSubscriptionStore();
  }

  // Global Workflow States

    public storeState(targetState: DTOs.GlobalWorkflowStateDTO) {
      const writableCopy = this.utilityService.deepCopy(targetState);
      writableCopy.data.stateInfo = JSON.stringify(writableCopy.data.stateInfo);
      writableCopy.api = null;
      this.indexedDBService.retrieveAndStoreDataToIndexedDB(this.constants.idbWorkflowAllStateTableName, this.workflowIndexedDBAPI.api, writableCopy, `${this.constants.IndexedDBAction.GlobalWorkflow} - Store State`, false);
    }

    public fetchState(targetUUID: string): Observable<DTOs.GlobalWorkflowStateDTO> {
      return new Observable(subscriber => {
        if (!!targetUUID) {
          const IOTransaction = this.indexedDBService.retreiveIndexedDBTransaction(this.constants.idbWorkflowAllStateTableName, this.workflowIndexedDBAPI.api, null, true);
          const IOService = this.indexedDBService.retrieveIndexedDBObjectStore(this.constants.idbWorkflowAllStateTableName, IOTransaction);
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

    private storeLastState(targetModule: NavigationModule, targetUUID: string) {

      if (!!this.workflowIndexedDBAPI.api) {
        // this if condition serves both as a null-check and a guard for not recording the initial state on app load, because it is unnecessary to store it
        const newEntry: AdhocPacks.GlobalWorkflowLastState = {
          module: targetModule,
          stateUUID: targetUUID
        };
        this.indexedDBService.retrieveAndStoreDataToIndexedDB(this.constants.idbWorkflowLastStateTableName, this.workflowIndexedDBAPI.api, newEntry, `${this.constants.IndexedDBAction.GlobalWorkflow} - Store Last State`, false);
      }
    }

    public loadLastStates(): Observable<Array<AdhocPacks.GlobalWorkflowLastState>> {
      return new Observable(subscriber => {
        const results = [];
        let expectedNumOfResults = 0;
        for (let eachModule in NavigationModule) {
          expectedNumOfResults++;
        }
        for (let eachModule in NavigationModule) {
          const IOTransaction = this.indexedDBService.retreiveIndexedDBTransaction(this.constants.idbWorkflowLastStateTableName, this.workflowIndexedDBAPI.api, null, true);
          const IOService = this.indexedDBService.retrieveIndexedDBObjectStore(this.constants.idbWorkflowLastStateTableName, IOTransaction);
          const request = IOService.get(eachModule);
          IOTransaction.oncomplete = ((event) => {
            results.push(request.result);
            if (results.length >= expectedNumOfResults) {
              subscriber.next(results);
            }
          });
          IOTransaction.onerror = ((event) => {
            console.error(`${this.constants.IndexedDBAction.GlobalWorkflow}, retrieve state failure`, event, eachModule);
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

    private initializeSubscriptionStore(){
      this.subscriptionStore.set(NavigationModule.trade, new Map());
      this.subscriptionStore.set(NavigationModule.structuring, new Map());
      this.subscriptionStore.set(NavigationModule.market, new Map());
    }
    
  // Work with RouteReuseStrategy End

}