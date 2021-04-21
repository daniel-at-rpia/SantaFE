import { indexed } from '@amcharts/amcharts4/.internal/core/utils/Iterator';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CoreGlobalWorkflowIndexedDBReady } from 'Core/actions/core.actions';
import { DTOs, Blocks, AdhocPacks, Stubs } from '../models/frontend';
import { TradeWatchlistIndexedDBReady } from 'Trade/actions/trade.actions';
import { IndexedDBActions } from 'Core/constants/coreConstants.constant';
import { Observable } from 'rxjs';

@Injectable()

export class IndexedDBService {
  constants = {
    ngRxActions: {
      [IndexedDBActions.GlobalWorkflow]: CoreGlobalWorkflowIndexedDBReady,
      [IndexedDBActions.TradeWatchlist]: TradeWatchlistIndexedDBReady
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
    indexedDBAPI: AdhocPacks.IndexedDBAPIBlock,
    databaseName: string,
    tableData: AdhocPacks.IndexedDBTableBlock,
    action: IndexedDBActions
  ) {
    openRequest.onerror = (errorEvent) => {
      console.error('IDB open request failed', errorEvent);
    }

    openRequest.onsuccess = (successEvent) => {
      console.log('IDB open request success.', successEvent);
      indexedDBAPI.api = openRequest.result;
      // only dispatch action when request is success, even in case of upgradeNeeded, it will still come to success once the upgrade is completed
      const indexedDBIsReadyAction = this.constants.ngRxActions[action]
      this.store$.dispatch(new indexedDBIsReadyAction())
    }

    openRequest.onupgradeneeded = (newVersionDetectedEvent) => {
      console.log('IDB open request upgrade needed.', newVersionDetectedEvent);
      // reconstruct the database upon version change
      indexedDBAPI.api = openRequest.result;

      if (newVersionDetectedEvent.oldVersion === 0) {
        // version 0 means that the client had no database
        // perform initialization
        if (tableData) {
          for (let table in tableData) {
            if (tableData[table]) {
              const selectedTable = tableData[table];
              this.initializeDatabaseTable(indexedDBAPI.api, selectedTable.name, selectedTable.key);
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
      indexedDBAPI.api.onversionchange = (event) => {
        // versionchange event will trigger on other instances of the application that did not trigger the delete of the database
        // this is to handle scenarios where users have multiple tabs of the Santa open. What will happen is, one of the tabs triggers the delete, the other tabs will refresh themselves as the delete is completed.
        indexedDBAPI.api.close();
        setTimeout(()=>{
          // delayed to reload in order to make sure when reload database is already deleted
          window.location.reload(true);
        }, 1000);
      };

    }
  }

  public retreiveIndexedDBTransaction(
    tableName: string,
    indexedDBAPI: IDBDatabase,
    message: string,
    hasCustomHandlers: boolean,
    isReadWrite: boolean = true
  ): IDBTransaction {
    const transaction = isReadWrite ? indexedDBAPI.transaction([tableName], "readwrite") : indexedDBAPI.transaction([tableName]);
    if (!hasCustomHandlers) {
      transaction.onerror = (event) => {
        console.error(`${message}, error`, event);
      }
    }
    return transaction;
  }

  public retrieveIndexedDBStoreObject(
    tableName: string,
    transaction: IDBTransaction
  ): IDBObjectStore {
    return transaction.objectStore(tableName);
  }

  public storeState(
    tableName: string,
    indexedDBAPI: IDBDatabase,
    entry: AdhocPacks.IndexedDBEntryBlock,
    message: string,
    customTransactionHandlers: boolean
  ) {
    const transaction = this.retreiveIndexedDBTransaction(tableName, indexedDBAPI, message, customTransactionHandlers);
    const storeObject = this.retrieveIndexedDBStoreObject(tableName, transaction);
    if (!!storeObject) {
      storeObject.put(entry);
    }
  }

  public getAllState(
    tableName: string,
    indexedDBAPI: IDBDatabase,
    action: string,
    customTransactionHandlers: boolean
  ) {
    return new Observable(subscriber => {
      const transaction = this.retreiveIndexedDBTransaction(tableName, indexedDBAPI, action, customTransactionHandlers);
      const storeObject = this.retrieveIndexedDBStoreObject(tableName, transaction);
      const getAllStoreObjects = storeObject.getAll();
      // Type casting event to 'any' for now as otherwise it will throw error TS2339: Property 'result' does not exist on type 'EventTarget'
      // Known issue in TS: https://github.com/microsoft/TypeScript/issues/30669
      getAllStoreObjects.onsuccess = (event: any) => {
        if (event.target.result) {
          subscriber.next(event.target.result)
        }
      }
      getAllStoreObjects.onerror = (event: any) => {
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

  private initializeDatabaseTable(
    indexedDBAPI: IDBDatabase,
    tableName: string,
    key: string
  ) {
    indexedDBAPI.createObjectStore(tableName, {keyPath: key})
  }
}