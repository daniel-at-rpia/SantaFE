import { Injectable } from '@angular/core';
import { DetachedRouteHandle } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { DTOs, AdhocPacks } from '../models/frontend';
import * as globalConstants from 'Core/constants';
import { UtilityService } from 'Core/services/UtilityService';
import { DTOService } from 'Core/services/DTOService';
import { IndexedDBService } from 'Core/services/IndexedDBService';

@Injectable()

export class GlobalWorkflowIOService {
  constants = {
    idbWorkflowAllStateTableName: globalConstants.indexedDB.INDEXEDDB_WORKFLOW_TABLE_NAME,
    idbWorkflowLastStateTableName: globalConstants.indexedDB.INDEXEDDB_LAST_STATE_TABLE_NAME,
    idbDatabase: globalConstants.indexedDB.IndexedDBDatabases,
    moduleUrl: globalConstants.core.NavigationModule
  }
  private currentState: string = 'initialState';
  private currentModule: globalConstants.core.NavigationModule = null;
  private routeHandlerStore: Array<AdhocPacks.RouteHandlerStoreBlock> = [];
  private subscriptionStore: 
    Map<
      globalConstants.core.NavigationModule,
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
    this.indexedDBService.initializeIndexedDB(this.constants.idbDatabase.GlobalWorkflow)
    this.initializeSubscriptionStore();
  }

  // Global Workflow States

    public storeState(targetState: DTOs.GlobalWorkflowStateDTO) {
      const writableCopy = this.utilityService.deepCopy(targetState);
      writableCopy.data.stateInfo = JSON.stringify(writableCopy.data.stateInfo);
      writableCopy.api = null;
      this.indexedDBService.retrieveAndStoreDataToIndexedDB(this.constants.idbWorkflowAllStateTableName, this.constants.idbDatabase.GlobalWorkflow, writableCopy, `${this.constants.idbDatabase.GlobalWorkflow} - Store State`, false);
    }

    public fetchState(targetUUID: string): Observable<DTOs.GlobalWorkflowStateDTO> {
      return new Observable(subscriber => {
        if (!!targetUUID) {
          const IOTransaction = this.indexedDBService.retreiveIndexedDBTransaction(this.constants.idbWorkflowAllStateTableName, this.constants.idbDatabase.GlobalWorkflow, null, true);
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
  
    public loadLastStates(): Observable<Array<AdhocPacks.GlobalWorkflowLastState>> {
      return new Observable(subscriber => {
        const results = [];
        let expectedNumOfResults = 0;
        for (let eachModule in globalConstants.core.NavigationModule) {
          expectedNumOfResults++;
        }
        for (let eachModule in globalConstants.core.NavigationModule) {
          const IOTransaction = this.indexedDBService.retreiveIndexedDBTransaction(this.constants.idbWorkflowLastStateTableName, this.constants.idbDatabase.GlobalWorkflow, null, true);
          const IOService = this.indexedDBService.retrieveIndexedDBObjectStore(this.constants.idbWorkflowLastStateTableName, IOTransaction);
          const request = IOService.get(eachModule);
          IOTransaction.oncomplete = ((event) => {
            results.push(request.result);
            if (results.length >= expectedNumOfResults) {
              subscriber.next(results);
            }
          });
          IOTransaction.onerror = ((event) => {
            console.error(`${this.constants.idbDatabase.GlobalWorkflow}, retrieve state failure`, event, eachModule);
          });
        }
      });
    }

  // Global Workflow States End

  // Work with RouteReuseStrategy

    public updateCurrentState(newModule: globalConstants.core.NavigationModule ,newStateId: string) {
      this.currentModule = newModule;
      this.currentState = newStateId;
      this.indexedDBService.storeLastState(this.constants.idbWorkflowLastStateTableName, newModule, newStateId, this.constants.idbDatabase.GlobalWorkflow);
    }

    public attachRouteHandlerToState(targetUUID: string, targetHandler: DetachedRouteHandle) {
      if (!!targetUUID) {
        const alreadyExist = this.routeHandlerStore.find((eachEntry) => {
          return targetUUID === eachEntry.state;
        });
        if (alreadyExist) {
          alreadyExist.handle = targetHandler;
        } else {
          if (this.routeHandlerStore.length >= globalConstants.globalWorkflow.ROUTE_REUSE_HANDLER_STORE_SIZE_CAP) {
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
      this.subscriptionStore.set(globalConstants.core.NavigationModule.trade, new Map());
      this.subscriptionStore.set(globalConstants.core.NavigationModule.structuring, new Map());
      this.subscriptionStore.set(globalConstants.core.NavigationModule.market, new Map());
    }
    
  // Work with RouteReuseStrategy End

}