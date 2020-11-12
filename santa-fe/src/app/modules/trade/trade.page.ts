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
    import { TradeState } from 'FEModels/frontend-page-states.interface';
    import { selectSelectedSecurityForAnalysis } from 'Trade/selectors/trade.selectors';
    import { CoreUserLoggedIn } from 'Core/actions/core.actions';
    import { selectDislayAlertThumbnail, selectUserInitials } from 'Core/selectors/core.selectors';
    import { SecurityMapEntry } from 'FEModels/frontend-adhoc-packages.interface';
    import { CoreLoadSecurityMap } from 'Core/actions/core.actions';
    import { TradeStoreResetEvent } from 'Trade/actions/trade.actions';
  //

@Component({
  selector: 'santa-trade',
  templateUrl: './trade.page.html',
  styleUrls: ['./trade.page.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TradePage implements OnInit, OnDestroy {
  state: TradeState;
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
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService,
    private route: ActivatedRoute
  ) {
    this.initializePageState();
  }

  public ngOnInit() {
    this.initializePageState();
    this.store$.dispatch(new TradeStoreResetEvent());
    this.subscriptions.routeChange = this.route.paramMap.pipe(
      tap(params => {
        console.log('test, route in Trade', params.get('stateId'));
      })
    ).subscribe();

    this.subscriptions.receiveSelectedSecuritySub = this.store$.pipe(
      select(selectSelectedSecurityForAnalysis)
    ).subscribe((targetSecurity) => {
      this.state.sidePanelsCollapsed = !targetSecurity;
      this.state.lilMarketMaximized = false;
    });
    this.subscriptions.displayAlertThumbnailSub = this.store$.pipe(
      select(selectDislayAlertThumbnail)
    ).subscribe((value) => {
      this.state.displayAlertThumbnail = !!value;
    });
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      select(selectUserInitials)
    ).subscribe((value) => {
      this.state.ownerInitial = value;
    });
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(eachItem)) {
        const eachSub = this.subscriptions[eachItem] as Subscription;
        eachSub.unsubscribe();
      }
    }
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
}
