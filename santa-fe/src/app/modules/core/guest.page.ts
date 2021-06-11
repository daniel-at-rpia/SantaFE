  // dependencies
    import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
    import { ActivatedRoute, Router } from '@angular/router';
    import { Observable, Subscription, interval, of } from 'rxjs';
    import { tap, first, withLatestFrom, switchMap, catchError, combineLatest, filter, map } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';
    import { DevWhitelist } from 'Core/constants/coreConstants.constant';
    import {
      DTOService,
      UtilityService,
      RestfulCommService,
      GlobalWorkflowIOService
    } from 'Core/services';
    import { SantaContainerComponentBase } from 'Core/containers/santa-container-component-base';
    import { CoreUserLoggedIn } from 'Core/actions/core.actions';
    import { FAILED_USER_INITIALS_FALLBACK } from 'Core/constants/coreConstants.constant';
  //

@Component({
  selector: 'santa-guest',
  templateUrl: './guest.page.html',
  styleUrls: ['./guest.page.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class GuestPage extends SantaContainerComponentBase implements OnInit {
  state = {};
  subscriptions = {
    userInitialsSub: null
  };
  constants = {
    devWhitelist: DevWhitelist,
    usersInitialFallback: FAILED_USER_INITIALS_FALLBACK
  }

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

  public ngOnInit() {
    this.subscriptions.userInitialsSub = this.fetchOwnerInitials().subscribe((isUser: boolean) => {
      isUser && this.reloadPage();
    })
    return super.ngOnInit();
  }

  private fetchOwnerInitials() {
    return this.restfulCommService.authenticate().pipe(
      first(),
      map((serverReturn) => {
        if (typeof serverReturn === "string" && serverReturn.length === 2) {
          this.loadOwnerInitial(serverReturn);
          return true;
        } else {
          return false;
        }
      }),
      catchError(err => {
        console.error('Unable to authenticate user on Guest page');;
        return of(false);
      })
    );
  }

  private loadOwnerInitial(serverReturn: string) {
    const ownerInitials = this.constants.devWhitelist.indexOf(serverReturn) !== -1 ? 'DM' : serverReturn;
    this.restfulCommService.updateUser(ownerInitials);
    this.store$.dispatch(new CoreUserLoggedIn(ownerInitials));
  }

  public reloadPage() {
    window.location.href = "/";
  }

}
