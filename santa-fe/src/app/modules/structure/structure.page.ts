  // dependencies
    import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
    import { ActivatedRoute, Router } from '@angular/router';
    import { Observable, Subscription, interval, of } from 'rxjs';
    import { tap, first, withLatestFrom, switchMap, catchError, combineLatest, filter } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import { PageStates, DTOs } from 'Core/models/frontend';
    import { DTOService, UtilityService, RestfulCommService, GlobalWorkflowIOService } from 'Core/services';
    import { SantaContainerComponentBase } from 'Core/containers/santa-container-component-base';
    import { selectGlobalWorkflowIndexedDBReadyState } from 'Core/selectors/core.selectors';
    import { StructureStoreResetEvent, StructureUtilityPanelLoadStateEvent } from 'Structure/actions/structure.actions';
    import {
      STRUCTURE_EDIT_MODAL_ID,
      STRUCTURE_SET_BULK_OVERRIDES_MODAL_ID
    } from 'Core/constants/structureConstants.constants';
    import { BEBICsHierarchyBlock } from 'Core/models/backend/backend-models.interface';
    import { BICsDataProcessingService } from 'Core/services/BICsDataProcessingService';
    import { GLOBAL_WORKFLOW_STATE_ID_KEY, GlobalWorkflowTypes } from 'Core/constants/coreConstants.constant';

  //

@Component({
  selector: 'santa-structure',
  templateUrl: './structure.page.html',
  styleUrls: ['./structure.page.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class StructurePage extends SantaContainerComponentBase implements OnInit, OnDestroy {
  stateActive: boolean = true;
  state: PageStates.StructureState;
  subscriptions = {
    routeChange: null
  };
  constants = {
    editModalId: STRUCTURE_EDIT_MODAL_ID,
    setBulkOverridesModalId: STRUCTURE_SET_BULK_OVERRIDES_MODAL_ID,
    stateId: GLOBAL_WORKFLOW_STATE_ID_KEY,
    workflowType: GlobalWorkflowTypes
  };

  private initializePageState(): PageStates.StructureState {
    const state: PageStates.StructureState = {
      BICsData: {
        formattedBICsHierarchy: {
          children: [],
        },
      },
      fetchResult: {
        fetchBICsHierarchyFailed: false,
        fetchBICsHierarchyError: ''
      }
    }
    return state;
  }

  constructor(
    protected utilityService: UtilityService,
    protected globalWorkflowIOService: GlobalWorkflowIOService,
    protected router: Router,
    private store$: Store<any>,
    private dtoService: DTOService,
    private restfulCommService: RestfulCommService,
    private bicsDataProcessingService: BICsDataProcessingService,
    private route: ActivatedRoute
  ) {
    super(utilityService, globalWorkflowIOService, router);
    this.state = this.initializePageState();
  }

  public ngOnInit() {
    this.state = this.initializePageState();
    this.store$.dispatch(new StructureStoreResetEvent);
    this.fetchBICsHierarchy();
    this.subscriptions.routeChange = this.route.paramMap.pipe(
      filter((params) => {
        return this.stateActive;
      }),
      combineLatest(
        this.store$.pipe(select(selectGlobalWorkflowIndexedDBReadyState))
      ),
      filter(([params, indexedDBIsReady]) => {
        return !!indexedDBIsReady;
      }),
      switchMap(([params, indexedDBIsReady]) => {
        return this.globalWorkflowIOService.fetchState(params.get(this.constants.stateId));
      })
    ).subscribe((result: DTOs.GlobalWorkflowStateDTO) => {
      this.globalStateHandler(result);
    });
    return super.ngOnInit();
  }

  private updateBICsFetch(receivedData: boolean, message: string = '') {
    this.state.fetchResult.fetchBICsHierarchyFailed = !receivedData;
    this.state.fetchResult.fetchBICsHierarchyError = message;
  }

  private fetchBICsHierarchy() {
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getBICsCodeDictionary, {req: 'GET'}).pipe(
      first(),
      tap((serverReturn: BEBICsHierarchyBlock) => {
       if (!!serverReturn) {
         this.updateBICsFetch(true);
         this.bicsDataProcessingService.loadBICSData(serverReturn, this.state.BICsData.formattedBICsHierarchy);
       }
      }),
      catchError(err => {
        this.updateBICsFetch(false, err);
        this.restfulCommService.logError('Cannot retrieve BICs hierarchy data');
        return of('error');
      })
    ).subscribe()
  }

  private globalStateHandler(state: DTOs.GlobalWorkflowStateDTO) {
    if (!!state) {
      switch(state.data.workflowType) {
        case this.constants.workflowType.changedStructureUtilityConfig: 
          if (!!state.data.stateInfo && !!state.data.stateInfo.structureUtilityPanelSnapshot) {
            this.store$.dispatch(new StructureUtilityPanelLoadStateEvent(state.data.stateInfo.structureUtilityPanelSnapshot));
          }
          break;
        default:
          break;
      }
    }
  }
}
