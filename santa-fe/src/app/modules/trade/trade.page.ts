  // dependencies
    import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
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
    import { selectDislayAlertThumbnail } from 'Core/selectors/core.selectors';
    import { SecurityMapEntry } from 'FEModels/frontend-adhoc-packages.interface';
    import { CoreLoadSecurityMap } from 'Core/actions/core.actions';
    import { FAILED_USER_INITIALS_FALLBACK, DevWhitelist } from 'Core/constants/coreConstants.constant';
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
    receiveSelectedSecuritySub: null,
    displayAlertThumbnailSub: null
  };
  constants = {
    userInitialsFallback: FAILED_USER_INITIALS_FALLBACK,
    devWhitelist: DevWhitelist
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
    private restfulCommService: RestfulCommService
  ) {
    this.initializePageState();
  }

  public ngOnInit() {
    this.fetchOwnerInitial();
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

  private fetchOwnerInitial() {
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getUserInitials, {req: 'GET'}).pipe(
      first(),
      tap((serverReturn) => {
        this.loadOwnerInitial(serverReturn);
      }),
      catchError(err => {
        if (!!err && !!err.error && !!err.error.text) {
          this.loadOwnerInitial(err.error.text);
        } else {
          this.loadOwnerInitial(this.constants.userInitialsFallback);
          this.restfulCommService.logError(`Can not find user, error`);
        }
        return of('error');
      })
    ).subscribe();
  }

  private loadOwnerInitial(serverReturn: string) {
    if (this.constants.devWhitelist.indexOf(serverReturn) !== -1) {
      this.state.ownerInitial = 'DM';
    } else {
      this.state.ownerInitial = serverReturn;
    }
    this.restfulCommService.updateUser(this.state.ownerInitial);
    this.store$.dispatch(new CoreUserLoggedIn(this.state.ownerInitial));
  }
}
