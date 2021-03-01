  // dependencies
    import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
    import { ActivatedRoute, Router } from '@angular/router';
    import { Observable, Subscription, interval, of } from 'rxjs';
    import { tap, first, withLatestFrom, switchMap, catchError, combineLatest, filter } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import {
      DTOService,
      UtilityService,
      RestfulCommService,
      GlobalWorkflowIOService
    } from 'Core/services';
    import { DTOs, PageStates, AdhocPacks } from 'Core/models/frontend';
    import { SantaContainerComponentBase } from 'Core/containers/santa-container-component-base';
    import { selectSelectedSecurityForAnalysis } from 'Trade/selectors/trade.selectors';
    import { selectGlobalWorkflowIndexedDBReadyState } from 'Core/selectors/core.selectors';
    import { CoreUserLoggedIn, CoreLoadSecurityMap } from 'Core/actions/core.actions';
    import { selectDislayAlertThumbnail, selectUserInitials } from 'Core/selectors/core.selectors';
    import {
      TradeStoreResetEvent,
      TradeCenterPanelLoadTableWithFilterEvent
    } from 'Trade/actions/trade.actions';
    import { GlobalWorkflowTypes, GLOBAL_WORKFLOW_STATE_ID_KEY } from 'Core/constants/coreConstants.constant';
    import { SecurityDefinitionDTO } from 'FEModels/frontend-models.interface';
  //

@Component({
  selector: 'santa-trade',
  templateUrl: './trade.page.html',
  styleUrls: ['./trade.page.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TradePage extends SantaContainerComponentBase implements OnInit {
  state: PageStates.TradeState;
  subscriptions = {
    routeChange: null,
    receiveSelectedSecuritySub: null,
    displayAlertThumbnailSub: null,
    ownerInitialsSub: null
  };
  constants = {
    globalWorkflowTypes: GlobalWorkflowTypes,
    stateId: GLOBAL_WORKFLOW_STATE_ID_KEY
  }

  private initializePageState() {
    this.state = {
      sidePanelsCollapsed: true,
      lilMarketMaximized: false,
      ownerInitial: null,
      displayAlertThumbnail: true,
      alertPanelMaximized: false
    };
  }

  constructor(
    protected utilityService: UtilityService,
    protected globalWorkflowIOService: GlobalWorkflowIOService,
    protected router: Router,
    private store$: Store<any>,
    private dtoService: DTOService,
    private restfulCommService: RestfulCommService,
    private route: ActivatedRoute
  ) {
    super(utilityService, globalWorkflowIOService, router);
    this.initializePageState();
  }

  public ngOnInit() {
    this.initializePageState();
    this.store$.dispatch(new TradeStoreResetEvent());
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

    this.subscriptions.receiveSelectedSecuritySub = this.store$.pipe(
      filter((targetSecurity) => {
        return this.stateActive;
      }),
      select(selectSelectedSecurityForAnalysis)
    ).subscribe((targetSecurity) => {
      this.state.sidePanelsCollapsed = !targetSecurity;
      this.state.lilMarketMaximized = false;
    });
    this.subscriptions.displayAlertThumbnailSub = this.store$.pipe(
      filter((value) => {
        return this.stateActive;
      }),
      select(selectDislayAlertThumbnail)
    ).subscribe((value) => {
      this.state.displayAlertThumbnail = !!value;
    });
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      filter((value) => {
        return this.stateActive;
      }),
      select(selectUserInitials)
    ).subscribe((value) => {
      this.state.ownerInitial = value;
    });
    // const listOfSubs = [];
    // for (const eachItem in this.subscriptions) {
    //   if (!!this.subscriptions[eachItem]) {
    //     const eachSub = this.subscriptions[eachItem] as Subscription;
    //     listOfSubs.push(eachSub);
    //   }
    // }
    // this.globalWorkflowIOService.storeSubscriptions(listOfSubs);
    return super.ngOnInit();
  }

  public onToggleCollapseGraphs() {
    this.state.sidePanelsCollapsed = !this.state.sidePanelsCollapsed;
  }

  public maximizeLilMarket() {
    this.state.lilMarketMaximized = true;
  }

  public unMaximizeLilMarket() {
    this.state.lilMarketMaximized = false;
  }

  public maximizeAlertPanel() {
    this.state.alertPanelMaximized = true;
  }

  public unMaximizeAlertPanel() {
    this.state.alertPanelMaximized = false;
  }

  private globalStateHandler(state: DTOs.GlobalWorkflowStateDTO) {
    if (!!state) {
      switch (state.data.workflowType) {
        case this.constants.globalWorkflowTypes.launchTradeToSeeBonds:
          if (!!state.data.stateInfo.filterList && state.data.stateInfo.filterList.length > 0) {
            this.store$.dispatch(new TradeCenterPanelLoadTableWithFilterEvent(state.data.stateInfo.filterList, state.data.stateInfo.activeMetric));
          }
          break;
        case this.constants.globalWorkflowTypes.unselectPreset:
          // do nothing as nothing is needed
        default:
          // code...
          break;
      }
    }
  }
}
