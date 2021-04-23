import { indexed } from '@amcharts/amcharts4/.internal/core/utils/Iterator';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CoreGlobalWorkflowIndexedDBReady } from 'Core/actions/core.actions';
import { DTOs, Blocks, AdhocPacks, Stubs } from '../models/frontend';
import { TradeWatchlistIndexedDBReady } from 'Trade/actions/trade.actions';
import { NavigationModule } from 'Core/constants/coreConstants.constant';
import { Observable } from 'rxjs';
import {
  INDEXEDDB_WORKFLOW_VERSION,
  INDEXEDDB_WORKFLOW_DATABASE_NAME,
  INDEXEDDB_WATCHLIST_DATABASE_NAME,
  INDEXEDDB_WATCHLIST_VERSION,
  IndexedDBTableConfigs,
  IndexedDBDatabases
} from 'App/modules/core/constants/indexedDB.constants';


@Injectable()

export class IndexedDBService {
  constants = {
    idbWorkflowVersion: INDEXEDDB_WORKFLOW_VERSION,
    idbWatchlistVersion: INDEXEDDB_WATCHLIST_VERSION,
    idbWorkflowDbName: INDEXEDDB_WORKFLOW_DATABASE_NAME,
    idbWatchlistDbName: INDEXEDDB_WATCHLIST_DATABASE_NAME,
    idbTableConfigs: IndexedDBTableConfigs,
    idbDatabaseTypes: IndexedDBDatabases
  }
  allDatabases: AdhocPacks.IndexedDBAllDatabaseMapping = {
    [this.constants.idbDatabaseTypes.GlobalWorkflow]: {
      name: this.constants.idbWorkflowDbName,
      version: this.constants.idbWorkflowVersion,
      ngRxAction: CoreGlobalWorkflowIndexedDBReady,
      api: null,
      configs: IndexedDBTableConfigs.GlobalWorkflow
    },
    [this.constants.idbDatabaseTypes.TradeWatchlist]: {
      name: this.constants.idbWatchlistDbName,
      version: this.constants.idbWatchlistVersion,
      ngRxAction: TradeWatchlistIndexedDBReady,
      api: null,
      configs: IndexedDBTableConfigs.TradeWatchlist
    }
  }
  constructor(
    private store$: Store<any>
  ) {}
  
  public openRequestToIndexDBDatabase(
    databaseName: string,
    version: number
  ): IDBOpenDBRequest {
    const openRequest = window.indexedDB.open(databaseName, version);
    return openRequest;
  }

  public initiateIndexedDBRequestHandler(
    openRequest: IDBOpenDBRequest,
    databaseName: string,
    tableData: AdhocPacks.IndexedDBTableBlock,
    databaseType: IndexedDBDatabases
  ) {
    openRequest.onerror = (errorEvent) => {
      console.error('IDB open request failed', errorEvent);
    }

    openRequest.onsuccess = (successEvent) => {
      console.log('IDB open request success.', successEvent);
      this.allDatabases[databaseType].api = openRequest.result;
      // only dispatch action when request is success, even in case of upgradeNeeded, it will still come to success once the upgrade is completed
      const indexedDBIsReadyAction = this.allDatabases[databaseType].ngRxAction
      this.store$.dispatch(new indexedDBIsReadyAction())
    }

    openRequest.onupgradeneeded = (newVersionDetectedEvent) => {
      console.log('IDB open request upgrade needed.', newVersionDetectedEvent);
      // reconstruct the database upon version change
      this.allDatabases[databaseType].api = openRequest.result;

      if (newVersionDetectedEvent.oldVersion === 0) {
        // version 0 means that the client had no database
        // perform initialization
        if (tableData) {
          for (let table in tableData) {
            if (tableData[table]) {
              const selectedTable = tableData[table];
              this.initializeDatabaseTable(this.allDatabases[databaseType].api, selectedTable.name, selectedTable.key);
            }
          }
        }
      } else {
        // for all other versions, simply destory the database and reload, which will trigger the "version === 0" condition that rebuilds the database
        // this is not the most efficient way to handle upgrade but it is error-proof
        const deleteRequest = window.indexedDB.deleteDatabase(databaseName);
        deleteRequest.onsuccess = (event) => {
          window.location.reload(true);
        }
      }
      this.allDatabases[databaseType].api.onversionchange = (event) => {
        // versionchange event will trigger on other instances of the application that did not trigger the delete of the database
        // this is to handle scenarios where users have multiple tabs of the Santa open. What will happen is, one of the tabs triggers the delete, the other tabs will refresh themselves as the delete is completed.
        this.allDatabases[databaseType].api.close();
        setTimeout(()=>{
          // delayed to reload in order to make sure when reload database is already deleted
          window.location.reload(true);
        }, 1000);
      };

    }
  }

  public retreiveIndexedDBTransaction(
    tableName: string,
    databaseType: IndexedDBDatabases,
    action: string,
    hasCustomHandlers: boolean,
    isReadWrite: boolean = true
  ): IDBTransaction {
    const transaction = isReadWrite ? this.allDatabases[databaseType].api.transaction([tableName], "readwrite") : this.allDatabases[databaseType].api.transaction([tableName]);
    if (!hasCustomHandlers) {
      transaction.onerror = (event) => {
        console.error(`${action}, error`, event);
      }
    }
    return transaction;
  }

  public retrieveIndexedDBObjectStore(
    tableName: string,
    transaction: IDBTransaction
  ): IDBObjectStore {
    return transaction.objectStore(tableName);
  }

  public retrieveAndStoreDataToIndexedDB (
    tableName: string,
    databaseType: IndexedDBDatabases,
    entry: AdhocPacks.IndexedDBEntryBlock,
    action: string,
    customTransactionHandlers: boolean
  ) {
    const transaction = this.retreiveIndexedDBTransaction(tableName, databaseType, action, customTransactionHandlers);
    const objectStore = this.retrieveIndexedDBObjectStore(tableName, transaction);
    if (!!objectStore) {
      this.addDataToIndexedDB(objectStore, entry, action);
    }
  }

  public retrieveAndGetAllIndexedDBData(
    tableName: string,
    databaseType: IndexedDBDatabases,
    action: string,
    customTransactionHandlers: boolean
  ) {
    return new Observable(subscriber => {
      const transaction = this.retreiveIndexedDBTransaction(tableName, databaseType, action, customTransactionHandlers);
      const objectStore = this.retrieveIndexedDBObjectStore(tableName, transaction);
      const getAllObjectStores = objectStore.getAll();
      // Type casting event to 'any' for now as otherwise it will throw error TS2339: Property 'result' does not exist on type 'EventTarget'
      // Known issue in TS: https://github.com/microsoft/TypeScript/issues/30669
      getAllObjectStores.onsuccess = (event: any) => {
        if (event.target.result) {
          subscriber.next(event.target.result)
        }
      }
      getAllObjectStores.onerror = (event: any) => {
        console.error(`${action}, Cannot retrieve all store objects`, event);
        subscriber.next(null)
      }
    })
  }

  public createTableBlock(items: Array<AdhocPacks.IndexedDBTableBlockItem>): AdhocPacks.IndexedDBTableBlock {
    let tableBlock: AdhocPacks.IndexedDBTableBlock = {};
    if (items.length > 0) {
      items.forEach((item: AdhocPacks.IndexedDBTableBlockItem) => {
        const { name, key } = item;
        if (!tableBlock[name]) {
          tableBlock[name] = { name, key };
        }
      })
    }
    return tableBlock;
  }

  public retrieveSpecificDataFromIndexedDB(
    objectStore: IDBObjectStore,
    identifier: string 
  ): IDBRequest {
    const request = objectStore.get(identifier);
    return request;
  }
 
  public addDataToIndexedDB(
    objectStore: IDBObjectStore,
    identifier: AdhocPacks.IndexedDBEntryBlock,
    action: string
  ) {
    const requestUpdate = objectStore.put(identifier);
    requestUpdate.onerror = (event) => {
      console.error(`${action} error`, event)
    }
    requestUpdate.onsuccess = (event) => {
      console.log(`${action} success`, event)
    }
  }

  public initializeIndexedDB(
    databaseType: IndexedDBDatabases
  ) {
    const openRequest = this.openRequestToIndexDBDatabase(this.allDatabases[databaseType].name, this.allDatabases[databaseType].version);
    const indexedDBTableBlock = this.createTableBlock(this.allDatabases[databaseType].configs);
    indexedDBTableBlock && this.initiateIndexedDBRequestHandler(openRequest, this.allDatabases[databaseType].name, indexedDBTableBlock, databaseType);
  }

  public storeLastState(
    tableName: string,
    targetModule: NavigationModule,
    targetUUID: string,
    databaseType: IndexedDBDatabases
  ) {
    if (!!this.allDatabases[databaseType].api) {
      // this if condition serves both as a null-check and a guard for not recording the initial state on app load, because it is unnecessary to store it
      const newEntry: AdhocPacks.GlobalWorkflowLastState = {
        module: targetModule,
        stateUUID: targetUUID
      };
      this.retrieveAndStoreDataToIndexedDB(tableName, databaseType, newEntry, `${databaseType} - Store Last State`, false);
    }
  }

  public retrieveAndDeleteDataFromIndexedDB(
    uuid: string,
    tableName: string,
    databaseType: IndexedDBDatabases,
    action: string,
    customTransactionHandlers: boolean
  ) {
    const transaction = this.retreiveIndexedDBTransaction(tableName, databaseType, action, customTransactionHandlers);
    const objectStore = this.retrieveIndexedDBObjectStore(tableName, transaction);
    if (!!objectStore) {
      this.deleteDataFromIndexedDB(objectStore, uuid, action);
    }
  }

  public deleteDataFromIndexedDB(
    objectStore: IDBObjectStore,
    uuid: string,
    action: string
  ) {
    const requestDelete = objectStore.delete(uuid);
    requestDelete.onerror = (event) => {
      console.error(`${action} error`, event)
    }
    requestDelete.onsuccess = (event) => {
      console.log(`${action} success`, event)
    }
  }

  private initializeDatabaseTable(
    indexedDBAPI: IDBDatabase,
    tableName: string,
    key: string
  ) {
    indexedDBAPI.createObjectStore(tableName, {keyPath: key})
  }

}