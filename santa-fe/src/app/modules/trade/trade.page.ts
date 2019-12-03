  // dependencies
    import {
      Component,
      ViewEncapsulation,
      OnInit,
      OnDestroy
    } from '@angular/core';
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
    import { TradeLiveUpdatePassRawDataEvent } from 'Trade/actions/trade.actions';
    import {
      selectLiveUpdateTick
    } from 'Trade/selectors/trade.selectors';
    import {
      PayloadGetPositions
    } from 'BEModels/backend-payloads.interface';
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
    startNewUpdateSub: null
  }

  private initializePageState() {
    this.state = {
      graphsCollapsed: true
    }
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
    this.subscriptions.startNewUpdateSub = this.store$.pipe(
      select(selectLiveUpdateTick)
    ).subscribe(tick => {
      console.log('at Trade Page, got tick', tick);
      if (tick > 0) {  // skip first beat
        this.fetchUpdate();
      }
    });
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }

  public onToggleCollapseGraphs() {
    this.state.graphsCollapsed = !this.state.graphsCollapsed;
  }

  private fetchUpdate() {
    const payload : PayloadGetPositions = {
      partitionOptions: ['Portfolio', 'Strategy']
    };
    this.restfulCommService.callAPI('santaPortfolio/get-santa-credit-positions', {req: 'POST'}, payload, false, false).pipe(
      first(),
      tap((serverReturn) => {
        this.store$.dispatch(new TradeLiveUpdatePassRawDataEvent(serverReturn));
      }),
      catchError(err => {
        console.error('error', err);
        return of('error');
      })
    ).subscribe();
  }

}
