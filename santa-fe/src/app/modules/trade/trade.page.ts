  // dependencies
    import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
    import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
    import * as globalConstants from 'Core/constants';
    import { selectSelectedSecurityForAnalysis } from 'Trade/selectors/trade.selectors';
    import { selectGlobalWorkflowIndexedDBReadyState } from 'Core/selectors/core.selectors';
    import { CoreUserLoggedIn } from 'Core/actions/core.actions';
    import { selectDislayAlertThumbnail, selectUserInitials } from 'Core/selectors/core.selectors';
    import {
      TradeStoreResetEvent,
      TradeCenterPanelLoadTableWithFilterEvent
    } from 'Trade/actions/trade.actions';
  //

@Component({
  selector: 'santa-trade',
  templateUrl: './trade.page.html',
  styleUrls: ['./trade.page.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TradePage extends SantaContainerComponentBase implements OnInit {
  state: PageStates.TradeState;
  constants = globalConstants;
  subscriptions = {
    routeChange: null,
    receiveSelectedSecuritySub: null,
    displayAlertThumbnailSub: null,
    ownerInitialsSub: null
  };

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
        return this.globalWorkflowIOService.fetchState(params.get(this.constants.globalWorkflow.GLOBAL_WORKFLOW_STATE_ID_KEY));
      })
    ).subscribe((result: DTOs.GlobalWorkflowStateDTO) => {
      if (this.initialState !== 'n/a') {
        this.globalStateHandler(result);
      }
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
        case this.constants.globalWorkflow.GlobalWorkflowTypes.launchTradeToSeeBonds:
          if (!!state.data.stateInfo.filterList && state.data.stateInfo.filterList.length > 0) {
            this.store$.dispatch(
              new TradeCenterPanelLoadTableWithFilterEvent(
                state.data.stateInfo.filterList,
                state.data.stateInfo.activeMetric,
                state.data.stateInfo.associatedDisplayTitle || null
              )
            );
          }
          break;
        case this.constants.globalWorkflow.GlobalWorkflowTypes.unselectWatchlist:
          // do nothing as nothing is needed
          break;
        default:
          // code...
          break;
      }
    }
  }
}
