import { AdhocPacks, Blocks, DTOs, PageStates } from 'App/modules/core/models/frontend';
  
  // Global Workflow
  export const INDEXEDDB_WORKFLOW_VERSION = 1;
  export const INDEXEDDB_WORKFLOW_DATABASE_NAME = 'GlobalWorkflow';
  export const INDEXEDDB_WORKFLOW_TABLE_NAME = 'All_Workflow_State_Table';
  export const INDEXEDDB_LAST_STATE_TABLE_NAME = 'Last_State_Table';
  export const ROUTE_REUSE_HANDLER_STORE_SIZE_CAP = 5;

  // Watchlists
  export const INDEXEDDB_WATCHLIST_VERSION = 1;
  export const INDEXEDDB_WATCHLIST_DATABASE_NAME = 'WatchList';
  export const INDEXEDDB_WATCHLIST_RECENT_TABLE_NAME = 'Recent_Table_Name';
  export const INDEXEDDB_WATCHLIST_SAVED_TABLE_NAME = 'Saved_Table_Name';

  export enum IndexedDBDatabases {
    GlobalWorkflow = 'GlobalWorkflow',
    TradeWatchlist = 'TradeWatchlist'
  }
  
  export enum IndexedDBWatchListType {
    recent = 'Recent',
    saved = 'Saved'
  }

  export const IndexedDBTableConfigs: AdhocPacks.IndexedDBConfigBlock = {
    [IndexedDBDatabases.GlobalWorkflow]: [
      {
        name: INDEXEDDB_WORKFLOW_TABLE_NAME,
        key: 'uuid'
      },
      {
        name: INDEXEDDB_LAST_STATE_TABLE_NAME,
        key: 'module'
      }
    ],
    [IndexedDBDatabases.TradeWatchlist]: [
      {
        name: INDEXEDDB_WATCHLIST_RECENT_TABLE_NAME,
        key: 'data.uuid'
      }
    ]
  }