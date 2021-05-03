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
    import { SantaContainerComponentBase } from 'Core/containers/santa-container-component-base';
  //

@Component({
  selector: 'santa-guest',
  templateUrl: './guest.page.html',
  styleUrls: ['./guest.page.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class GuestPage extends SantaContainerComponentBase implements OnInit {
  state = {};
  subscriptions = {};
  constants = {}

  private initializePageState() {}

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

}
