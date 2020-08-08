// dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { interval, Observable, of, Subscription } from 'rxjs';
    import { catchError, filter, first, tap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { GlobalNavState } from 'FEModels/frontend-page-states.interface';
    import { selectUserInitials } from 'Core/selectors/core.selectors';
    import { SeniorityLegendList } from 'Core/stubs/securities.stub';

//

declare const VERSION: string;

@Component({
  selector: 'global-nav',
  templateUrl: './global-nav.container.html',
  styleUrls: ['./global-nav.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class GlobalNav implements OnInit, OnChanges, OnDestroy {
  state: GlobalNavState;
  subscriptions = {
    userInitialsSub: null
  }

  private initializePageState(): GlobalNavState {
    const state: GlobalNavState = {
      menuIsActive: false,
      version: VERSION,
      user: 'Anonymous User',
      legend: {
        seniorityCards: []
      }
    };
    state.legend.seniorityCards = SeniorityLegendList.map((eachStub)=>{
      const card = this.dtoService.formSecurityCardObject(null, eachStub, false, false);
      card.state.isInteractionDisabled = true;
      card.state.isWidthFlexible = true;
      return card;
    });
    return state;
  }

  constructor(
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ) {
    this.state = this.initializePageState();
  }

  public ngOnInit() {
    this.subscriptions.userInitialsSub = this.store$.pipe(
      select(selectUserInitials)
    ).subscribe((userInitials) => {
      if (userInitials) {
        this.state.user = userInitials;
      }
    });
  }

  public ngOnChanges() {
  }

  public ngOnDestroy() {
  }

  public onClickNavTrigger() {
    this.state.menuIsActive = !this.state.menuIsActive;
  }

}
