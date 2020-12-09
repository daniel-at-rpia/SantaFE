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

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { StructureState } from 'FEModels/frontend-page-states.interface';
    import { StructureStoreResetEvent } from 'Structure/actions/structure.actions';
    import { STRUCTURE_EDIT_MODAL_ID } from 'Core/constants/structureConstants.constants';
    import { BICsHierarchyAllDataBlock, BICsHierarchyBlock } from 'FEModels/frontend-blocks.interface';
    import { BEBICsHierarchyBlock } from 'Core/models/backend/backend-models.interface';
    import { BICsDataProcessingService } from 'Core/services/BICsDataProcessingService';

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
    editModalId: STRUCTURE_EDIT_MODAL_ID
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
    private route: ActivatedRoute
  ) {
    this.state = this.initializePageState();
  }

  public ngOnInit() {
    this.state = this.initializePageState();
    this.store$.dispatch(new StructureStoreResetEvent);
    this.fetchBICsHierarchy();
    this.subscriptions.routeChange = this.route.paramMap.pipe(
      tap(params => {
        console.log('test, route in Structure', params.get('stateId'));
      })
    ).subscribe();
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
