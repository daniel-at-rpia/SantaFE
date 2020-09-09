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
    import { StructureState } from 'FEModels/frontend-page-states.interface';
    import { StructureStoreResetEvent } from 'Structure/actions/structure.actions';
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
  };
  constants = {
  };

  private initializePageState() {}

  constructor(
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ) {}

  public ngOnInit() {
    this.store$.dispatch(new StructureStoreResetEvent);
  }

  public ngOnDestroy() {
  }
}
