  // dependencies
    import { Component, OnInit, OnDestroy } from '@angular/core';
    import { Title } from '@angular/platform-browser';
    import { LicenseManager } from 'ag-grid-enterprise';
    import { Observable, Subscription, interval, of } from 'rxjs';
    import { tap, first, delay, catchError, withLatestFrom, filter, combineLatest } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import { CoreUserLoggedIn } from 'Core/actions/core.actions';
    import { selectAuthenticated } from 'Core/selectors/core.selectors';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { EngagementActionList } from 'Core/constants/coreConstants.constant';
    import { PageStates, AdhocPacks } from 'Core/models/frontend';
    import { FAILED_USER_INITIALS_FALLBACK, DevWhitelist } from 'Core/constants/coreConstants.constant';
    import { SecurityMapService } from 'Core/services/SecurityMapService';
    import { BESecurityMap } from 'Core/models/backend/backend-models.interface';
  //

declare const VERSION: string;

@Component({
  selector: 'app-root',
  templateUrl: './app.root.html',
  styleUrls: ['./app.root.scss']
})
export class AppRoot implements OnInit, OnDestroy {
  state: PageStates.RootState;
  title = `Santa - RPIA Trading & Portfolio Management - Ver.${VERSION}`;
  globalCount$: Observable<any>;
  subscriptions = {
    globalCountSub: null,
    authenticationSub: null
  };

  constructor(
    private titleService: Title,
    private store$: Store<any>,
    private restfulCommService: RestfulCommService,
    private securityMapService: SecurityMapService
  ) {
    LicenseManager.setLicenseKey("CompanyName=RPIA LP,LicensedGroup=RPIA Risk Reporting,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=2,LicensedProductionInstancesCount=0,AssetReference=AG-009115,ExpiryDate=27_July_2021_[v2]_MTYyNzM0MDQwMDAwMA==d6f3ed228387383c08504da9e3fe52e6");
    this.titleService.setTitle(this.title);
    this.initializedRootState();
  }

  private initializedRootState() {
    this.state = {
      authenticated: false
    };
  }

  public ngOnInit() {
    this.globalCount$ = interval(2700000);  // 45 minutes
    this.subscriptions.globalCountSub = this.globalCount$.subscribe(globalCount => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      console.log('Global Count,', globalCount, ' hours =', currentHour);
      if (currentHour === 3) {
        this.restfulCommService.logEngagement(
          EngagementActionList.midnightReload,
          null,
          `${currentTime.getHours()} : ${currentTime.getMinutes()} under version: ${VERSION}`,
          `App Root`
        );
        window.location.reload(true);
      }
    });
    this.subscriptions.authenticationSub = this.store$.pipe(
      select(selectAuthenticated),
      filter((authenticated) => {
        return !!authenticated;
      })
    ).subscribe(authenticated => {
      this.state.authenticated = true;
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getSecurityIdMap, {req: 'GET'}).pipe(
        first(),
        tap((serverReturn: BESecurityMap) => {
          if (!!serverReturn) {
            this.securityMapService.storeSecurityMap(serverReturn);
          } else {
            this.restfulCommService.logError('Failed to load SecurityId map, can not populate alert configuration');
          }
        })
      ).subscribe();
    });
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }
}
