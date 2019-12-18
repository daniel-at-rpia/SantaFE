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
    import { FullOwnerList } from 'Core/constants/securityDefinitionConstants.constant';
    import { selectSelectedSecurityForAnalysis } from 'Trade/selectors/trade.selectors';
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
    receiveSelectedSecuritySub: null
  };
  constants = {
    fullOwnerList: FullOwnerList
  };

  private initializePageState() {
    this.state = {
      graphsCollapsed: true,
      ownerInitial: ''
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
    this.restfulCommService.callAPI('user/get-user-initials', {req: 'GET'}).pipe(
      first(),
      tap((serverReturn) => {
        this.loadOwnerInitial(serverReturn);
      }),
      catchError(err => {
        this.loadOwnerInitial('n/a');
        return of('error');
      })
    ).subscribe();
    this.subscriptions.receiveSelectedSecuritySub = this.store$.pipe(
      select(selectSelectedSecurityForAnalysis)
    ).subscribe((targetSecurity) => {
      this.state.graphsCollapsed = !targetSecurity;
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

  private loadOwnerInitial(serverReturn: string) {
    const matchedInitial = this.constants.fullOwnerList.find((eachInitial) => {
      eachInitial === serverReturn;
    })
    this.state.ownerInitial = matchedInitial || 'DM';
  }

}
