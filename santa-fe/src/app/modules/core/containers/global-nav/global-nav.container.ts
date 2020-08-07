// dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { interval, Observable, of, Subscription } from 'rxjs';
    import { catchError, filter, first, tap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { GlobalNavState } from 'FEModels/frontend-page-states.interface';

//

@Component({
  selector: 'global-nav',
  templateUrl: './global-nav.container.html',
  styleUrls: ['./global-nav.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class GlobalNav implements OnInit, OnChanges, OnDestroy {
  state: GlobalNavState;

  private initializePageState(): GlobalNavState {
    const state: GlobalNavState = {
      menuIsActive: false
    };
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
  }

  public ngOnChanges() {
  }

  public ngOnDestroy() {
  }

  public onClickNavTrigger() {
    this.state.menuIsActive = !this.state.menuIsActive;
  }

}
