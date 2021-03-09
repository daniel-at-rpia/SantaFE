
  export const INDEXEDDB_VERSION = 2;
  export const INDEXEDDB_WORKFLOW_DATABASE_NAME = 'GlobalWorkflow';
  export const INDEXEDDB_WORKFLOW_TABLE_NAME = 'All_Workflow_State_Table';
  export const INDEXEDDB_LAST_STATE_TABLE_NAME = 'Last_State_Table';
  export const ROUTE_REUSE_HANDLER_STORE_SIZE_CAP = 5;

  /* indexedDB version record:
    Version 1:
      WorkflowStore: 
        Key: uuid
        Value: {
          uuid: string;
          data: {
            uuid: string;
            module: NavigationModule;
            workflowType: GlobalWorkflowTypes;
            stateInfo: {
              filterList?: Array<SecurityDefinitionDTO>;
              activeMetric?: PortfolioMetricValues;
              structureUtilityPanelSnapshot?: StructureUtilityPanelState;
            }
          },
          api: {
            routeHandler: DetachedRouteHandle;
          }
          state: {
            triggersRedirect: boolean;
            updateCurrentState: boolean;
          }
        }
    Version 2:
      AllWorkflowStateTable:
        (no change from ver.1)
      LastStateTable:
        Key: NavigationModule
        Value: uuid
  */
