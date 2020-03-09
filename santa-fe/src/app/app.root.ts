  // dependencies
    import {
      Component,
      OnInit,
      OnDestroy
    } from '@angular/core';
    import { Title } from '@angular/platform-browser';
    import { LicenseManager } from 'ag-grid-enterprise';
    import {
      Observable,
      Subscription,
      interval,
      of
    } from 'rxjs';
    import {
      tap,
      first,
      delay,
      catchError,
      withLatestFrom,
      filter
    } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { EngagementActionList } from 'Core/constants/coreConstants.constant';
    import { SecurityMapEntry } from 'FEModels/frontend-adhoc-packages.interface';
    import { CoreLoadSecurityMap } from 'Core/actions/core.actions';
  //

declare const VERSION: string;

@Component({
  selector: 'app-root',
  templateUrl: './app.root.html'
})
export class AppRoot implements OnInit, OnDestroy {
  title = `Santa - RPIA Trading & Portfolio Management - Ver.${VERSION}`;
  globalCount$: Observable<any>;
  subscriptions = {
    globalCountSub: null
  };

  constructor(
    private titleService: Title,
    private store$: Store<any>,
    private restfulCommService: RestfulCommService
  ) {
    LicenseManager.setLicenseKey("RPIA_RPIA_Risk_Reporting_1Devs13_March_2019__MTU1MjQzNTIwMDAwMA==7be91d469fa0bf581cca26d77da1f928");
    this.titleService.setTitle(this.title);
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
          null,
          `App Root`
        );
        window.location.reload(true);
      }
    });
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getSecurityIdMap, {req: 'GET'}).pipe(
      first(),
      tap((serverReturn: Object) => {
        if (!!serverReturn) {
          const map:Array<SecurityMapEntry> = [];
          for (const eachKeyword in serverReturn) {
            const existIndex = map.findIndex((eachItem) => {
              return eachItem.secruityId === serverReturn[eachKeyword];
            });
            if (existIndex >= 0) {
              map[existIndex].keywords.push(eachKeyword);
            } else {
              map.push({
                keywords: [eachKeyword],
                secruityId: serverReturn[eachKeyword]
              });
            }
          }
          this.store$.dispatch(new CoreLoadSecurityMap(map));
        } else {
          this.restfulCommService.logError('Failed to load SecurityId map, can not populate alert configuration', null);
        }
      })
    ).subscribe();
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }
}
