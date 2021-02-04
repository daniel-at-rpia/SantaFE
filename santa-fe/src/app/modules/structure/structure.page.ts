  // dependencies
    import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
    import { ActivatedRoute } from '@angular/router';
    import {
      Observable,
      Subscription,
      interval,
      of
    } from 'rxjs';
    import {
      tap,
      first,
      withLatestFrom,
      switchMap,
      catchError
    } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import {
      DTOService,
      UtilityService,
      RestfulCommService,
      GlobalWorkflowIOService
    } from 'Core/services';
    import { StructureState } from 'FEModels/frontend-page-states.interface';
    import { StructureStoreResetEvent, StructureUtilityPanelLoadStateEvent } from 'Structure/actions/structure.actions';
    import { STRUCTURE_EDIT_MODAL_ID } from 'Core/constants/structureConstants.constants';
    import { BICsHierarchyAllDataBlock, BICsHierarchyBlock } from 'FEModels/frontend-blocks.interface';
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
export class StructurePage implements OnInit, OnDestroy {
  state: StructureState;
  subscriptions = {
    routeChange: null
  };
  constants = {
    editModalId: STRUCTURE_EDIT_MODAL_ID,
    stateId: GLOBAL_WORKFLOW_STATE_ID_KEY,
    workflowType: GlobalWorkflowTypes
  };

  private initializePageState(): StructureState {
    const state: StructureState = {
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
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService,
    private bicsDataProcessingService: BICsDataProcessingService,
    private route: ActivatedRoute,
    private globalWorkflowIOService: GlobalWorkflowIOService
  ) {
    this.state = this.initializePageState();
  }

  public ngOnInit() {
    this.state = this.initializePageState();
    this.store$.dispatch(new StructureStoreResetEvent);
    this.fetchBICsHierarchy();
    this.subscriptions.routeChange = this.route.paramMap.pipe(
      switchMap((params) => {
        return this.globalWorkflowIOService.fetchState(params.get(this.constants.stateId));
      })
    ).subscribe((result) => {
      console.log('test, result is', result);
    });
  }

  public ngOnDestroy() {
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
}
