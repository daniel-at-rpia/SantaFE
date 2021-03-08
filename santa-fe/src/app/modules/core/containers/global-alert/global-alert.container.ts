  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { interval, Observable, of, Subscription } from 'rxjs';
    import { catchError, filter, first, tap, withLatestFrom } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';
    import { Router, NavigationEnd } from '@angular/router';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { GlobalAlertState } from 'FEModels/frontend-page-states.interface';
    import { DTOs } from 'Core/models/frontend';
    import { BEAlertDTO } from 'Core/models/backend/backend-models.interface';
    import { PayloadSetAlertsToInactive } from 'BEModels/backend-payloads.interface';
    import {
      ALERT_COUNTDOWN,
      AlertTypes,
      ALERT_PRESENT_LIST_SIZE_CAP,
      ALERT_TOTALSIZE_MAX_DISPLAY_THRESHOLD
    } from 'Core/constants/coreConstants.constant';
    import { ALERT_UPDATE_COUNTDOWN } from 'Core/constants/tradeConstants.constant';
    import {
      CoreLoadSecurityMap,
      CoreSendAlertCountsByType,
      CoreToggleAlertThumbnailDisplay,
      CoreSendNewAlerts,
      CoreGlobalLiveUpdateInternalCountEvent,
      CoreGlobalAlertProcessingEvent,
      CoreGlobalAlertsProcessedRawAlerts,
      CoreGlobalAlertsSendNewAlertsToTradeAlertPanel,
      CoreGlobalAlertFailedToMakeAlertAPICall,
      CoreGlobalAlertClearAllUrgentAlerts,
      CoreGlobalAlertsClearAllTradeAlertTableAlerts
    } from 'Core/actions/core.actions';
    import {
      selectNewAlerts,
      selectGlobalAlertProcessingAlertState,
      selectGlobalAlertMakeAPICall,
      selectGlobalAlertTradeTableFetchAlertTick,
      selectGlobalAlertTradeTableFetchAlertTimestamp
    } from 'Core/selectors/core.selectors';
    import { NavigationModule } from 'Core/constants/coreConstants.constant';
    import { favAlertBase64, favLogoBase64 } from "src/assets/icons";
    import * as moment from 'moment';
  //

@Component({
  selector: 'global-alert',
  templateUrl: './global-alert.container.html',
  styleUrls: ['./global-alert.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class GlobalAlert implements OnInit, OnChanges, OnDestroy {
  state: GlobalAlertState;
  subscriptions = {
    newAlertSubscription: null,
    browserTabNotificationSub: null,
    autoCountForRawAlertsSub: null,
    makeAlertAPICallSub: null,
    navigationStartSub: null,
    receiveTradeAlertTableFetchRequestSub: null
  }
  browserTabNotificationCount$: Observable<any>;
  autoCountForRawAlerts$: Observable<any>;
  constants = {
    sizeCap: ALERT_PRESENT_LIST_SIZE_CAP,
    totalSizeMaxDisplay: ALERT_TOTALSIZE_MAX_DISPLAY_THRESHOLD,
    alertTypes: AlertTypes,
    countdown: ALERT_UPDATE_COUNTDOWN,
    moduleUrl: NavigationModule

  };

  private initializePageState(): GlobalAlertState {
    const state: GlobalAlertState = {
      activated: true,
      displayAlerts: true,
      triggerActionMenuOpen: false,
      presentList: [],
      storeList: [],
      allAlertsList: [],
      totalSize: 0,
      displayTotalSize: '',
      originalDocumentTitle: document.title,
      favicon: null,
      alertUpdateTimeStamp: '',
      receivedActiveAlertsMap: {},
      alertUpdateInProgress: false,
      autoUpdateCountdown: 0,
      tradeAlertTableReadyToReceiveAdditionalAlerts: false
    };
    return state;
  }

  constructor(
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService,
    private router: Router
  ) {
    this.state = this.initializePageState();
  }

  public ngOnInit() {
    this.autoCountForRawAlerts$ = interval(1000);
    this.subscriptions.autoCountForRawAlertsSub = this.autoCountForRawAlerts$.subscribe((count: Observable<number>) => {
      this.state.autoUpdateCountdown = this.state.autoUpdateCountdown + 1;
      if (!this.state.alertUpdateInProgress) {
        this.store$.dispatch(new CoreGlobalLiveUpdateInternalCountEvent(this.state.autoUpdateCountdown))
      }
    });
    this.subscriptions.makeAlertAPICallSub = this.store$.pipe(
      select(selectGlobalAlertMakeAPICall)
      ).subscribe((makeAPICall: boolean) => {
      !!makeAPICall && this.getRawAlerts();
    });
    this.subscriptions.newAlertSubscription = this.store$.pipe(
      select(selectNewAlerts),
    ).subscribe((alertList: Array<DTOs.AlertDTO>) => {
      alertList.length > 0 && this.getAlertsForUrgentAlertList(alertList);
    });
    this.subscriptions.receiveTradeAlertTableFetchRequestSub = this.store$.pipe(
      select(selectGlobalAlertTradeTableFetchAlertTick),
      withLatestFrom(
        this.store$.pipe(select(selectGlobalAlertTradeTableFetchAlertTimestamp))
      )
    ).subscribe(([tick, lastReceiveTimestamp]) => {
      if (tick > 0) {
        // filter out initial state
        const sendList = this.findTradeAlertPanelMissingAlerts(lastReceiveTimestamp);
        this.store$.dispatch(new CoreGlobalAlertsSendNewAlertsToTradeAlertPanel(sendList));
      }
    });
    this.subscriptions.navigationStartSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const modulePortion = this.utilityService.getModulePortionFromNavigation(event);
        if (this.constants.moduleUrl.trade === modulePortion) {
          this.state.tradeAlertTableReadyToReceiveAdditionalAlerts = true;
        } else {
          this.state.tradeAlertTableReadyToReceiveAdditionalAlerts = false;
          // TradeAlertPanel will take care of clearing the store as long as it is active, but when it is no longer active, then global alert will clear it out
          this.store$.dispatch(new CoreGlobalAlertsClearAllTradeAlertTableAlerts());
        }
      }
    });
    this.browserTabNotificationCount$ = interval(500);
    this.state.favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    this.subscriptions.browserTabNotificationSub = this.browserTabNotificationCount$.subscribe(count => {
      if (this.state.presentList.length > 0) {
        if (document.title === this.state.originalDocumentTitle) {
          document.title = '[New Alerts] ' + this.state.originalDocumentTitle;
        }
        if (count % 2 === 0) {
          this.state.favicon.rel = 'shortcut icon';
          this.state.favicon.href = 'data:image/png;base64,' + favAlertBase64;
        } else {
          this.state.favicon.rel = 'shortcut icon';
          this.state.favicon.href = 'data:image/png;base64,' + favLogoBase64;
        }
      } else {
        document.title = this.state.originalDocumentTitle;
        this.state.favicon.rel = 'shortcut icon';
        this.state.favicon.href = 'data:image/png;base64,' + favLogoBase64;
      }
    });
  }

  public ngOnChanges() {
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }

  public onClickAlertTrigger() {
    this.updateAlertTrigger(!this.state.triggerActionMenuOpen);
  }

  public onToggleDisplayAlerts() {
    this.state.displayAlerts = !this.state.displayAlerts;
    this.store$.dispatch(new CoreToggleAlertThumbnailDisplay(this.state.displayAlerts));
    this.updateAlertTrigger(false);
    this.restfulCommService.logEngagement(
      this.restfulCommService.engagementMap.globalAlertToggledHide,
      null,
      `display = ${this.state.displayAlerts}`,
      'Global Alert Container'
    );
  }

  public onClickClearAlerts() {
    const payload: PayloadSetAlertsToInactive = {
      alertIds: this.state.presentList.map((eachAlert) => {
        return eachAlert.data.id;
      })
    };
    this.state.storeList.forEach((eachAlert) => {
      payload.alertIds.push(eachAlert.data.id);
    });
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.readAlert, {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn) => {}),
      catchError(err => {
        console.error(`${this.restfulCommService.apiMap.readAlert} failed`, err);
        return of('error')
      })
    ).subscribe();
    this.state.presentList = [];
    this.state.storeList = [];
    this.updateTotalSize();
    this.state.triggerActionMenuOpen = false;
    this.restfulCommService.logEngagement(
      this.restfulCommService.engagementMap.globalAlertClearedAll,
      null,
      `cleared ${payload.alertIds.length} alerts`,
      'Global Alert Container'
    );
  }

  public onClickAlertThumbnail(targetAlert: DTOs.AlertDTO) {
    if (targetAlert) {
      targetAlert.state.isSlidedOut = !targetAlert.state.isSlidedOut;
      if (!targetAlert.state.isSlidedOut && !targetAlert.state.isCountdownFinished) {
        targetAlert.state.isCountdownFinished = true;
      }
      this.restfulCommService.logEngagement(
        this.restfulCommService.engagementMap.globalAlertInteractedAlert,
        null,
        `Target Alert ${targetAlert.data.titleTop}, ${targetAlert.data.message}`,
        'Global Alert Container'
      );
    }
  }

  public loadAlertToTable(targetAlert: DTOs.AlertDTO) {
    if (targetAlert) {
    }
  }

  public onClickAlertRemove(targetAlert: DTOs.AlertDTO) {
    if (targetAlert) {
      targetAlert.state.willBeRemoved = true;
      const removeTarget = () => {
        this.removeSingleAlert(targetAlert, true);
      };
      setTimeout(removeTarget.bind(this), 300);
      this.restfulCommService.logEngagement(
        this.restfulCommService.engagementMap.globalAlertClearedSingle,
        null,
        `Still has ${this.state.totalSize - 1} alerts`,
        'Global Alert Container'
      );
    }
  }

  public onAlertExpired(targetAlert: DTOs.AlertDTO) {
    if (targetAlert) {
      const isFromPresent = !!this.state.presentList.find((eachAlert) => {
        return targetAlert.data.id === eachAlert.data.id;
      });
      const isFromStore = !!this.state.storeList.find((eachAlert) => {
        return targetAlert.data.id === eachAlert.data.id;
      });
      if (isFromPresent || isFromStore) {
        targetAlert.state.willBeRemoved = true;
        const removeTarget = () => {
          this.removeSingleAlert(targetAlert, isFromPresent);
        };
        setTimeout(removeTarget.bind(this), 300);
      }
    }
  }

  private generateNewAlert(
    newAlert: DTOs.AlertDTO,
    entireListForDebugging: Array<DTOs.AlertDTO>
  ) {
    const existIndexInPresent = this.state.presentList.findIndex((eachAlert) => {
      return eachAlert.data.id === newAlert.data.id;
    });
    const existIndexInStore = this.state.storeList.findIndex((eachAlert) => {
      return eachAlert.data.id === newAlert.data.id;
    });
    if (existIndexInPresent > -1) {
      console.log('Global Alert - new alert is an update, the old one is in the sidebar', newAlert.data.id);

      const targetAlert = this.state.presentList[existIndexInPresent];
      targetAlert.state.willBeRemoved = true;
      const removeTarget = () => {
        const indexOfTarget = this.state.presentList.indexOf(targetAlert);
        if (indexOfTarget >= 0) {
          this.state.presentList.splice(indexOfTarget, 1);
        } else {
          // we want to check the storeList again because within the 300 milliseconds, the alert might have moved from the presentList to the storeList
          const movedToStoreList = this.state.storeList.findIndex((eachAlert) => {
            return eachAlert.data.id === targetAlert.data.id;
          });
          if (movedToStoreList >= 0) {
            this.state.storeList.splice(movedToStoreList, 1);
          } else {
            const entireList = entireListForDebugging.map((each) => {return each.data.id});
            const oldList = this.state.presentList.map((each) => {return each.data.id});
            this.restfulCommService.logError(`can not find alert to replace in present list, alert = ${targetAlert.data.id}, entire list = ${entireList.toString()}, oldList = ${oldList.toString()}`);
            console.error('can not find alert to replace in present list');
          }
        }
      }
      setTimeout(removeTarget.bind(this), 300);
    } else if (existIndexInStore >= 0) {
      console.log('Global Alert - new alert is an update, the old one is not in the sidebar, buried in the queue', newAlert.data.id);
      this.state.storeList.splice(existIndexInStore, 1);
    }
    this.state.presentList.unshift(newAlert);
    if (this.state.presentList.length >= this.constants.sizeCap) {
      const lastAlert = this.state.presentList[this.state.presentList.length - 1];
      this.state.storeList.unshift(lastAlert);
      this.state.presentList.splice(this.state.presentList.length - 1, 1);
    }
  }

  private initiateStateProgressionForNewAlert(newAlert: DTOs.AlertDTO) {
    setTimeout(function(){
      if (!!newAlert) {
        newAlert.state.isNew = false;
        newAlert.state.isCountdownFinished = false;
        newAlert.state.isSlidedOut = this.state.triggerActionMenuOpen;
        setTimeout(function(){
          if (!!newAlert) {
            newAlert.state.isCountdownFinished = true;
          }
        }, ALERT_COUNTDOWN);
      }
    }.bind(this), 10);
  };

  private groupBy(list: any[], keyGetter: (obj: any) => string) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
  }

  private updateTotalSize() {
    this.state.totalSize = this.state.presentList.length + this.state.storeList.length;
    if (this.state.totalSize > this.constants.totalSizeMaxDisplay) {
      this.state.displayTotalSize = '99+';
    } else {
      this.state.displayTotalSize = `${this.state.totalSize}`;
    }
    // counting all types in buckets
    const allAlerts = [...this.state.presentList, ...this.state.storeList];
    const grouped = this.groupBy(allAlerts, alert => alert.data.type);
    const payload: Array<DTOs.AlertCountSummaryDTO> = [];
    grouped.forEach((value, key) => {
      payload.push(this.dtoService.formAlertCountSummaryObject(key, value.length));
    });
    this.store$.dispatch(new CoreSendAlertCountsByType(this.utilityService.deepCopy(payload)));
  }

  private removeSingleAlert(
    targetAlert: DTOs.AlertDTO,
    isFromPresent: boolean
  ) {
    if (!!targetAlert) {
      if (targetAlert.data.type !== AlertTypes.system) {
        const payload: PayloadSetAlertsToInactive = {
          alertIds: [targetAlert.data.id]
        };
        this.restfulCommService.callAPI(this.restfulCommService.apiMap.readAlert, {req: 'POST'}, payload).pipe(
          first(),
          tap((serverReturn) => {}),
          catchError(err => {
            console.error(`${this.restfulCommService.apiMap.readAlert} failed`, err);
            return of('error')
          })
        ).subscribe();
      }
      if (isFromPresent) {
        const indexOfTarget = this.state.presentList.findIndex((eachAlert) => {
          return eachAlert.data.id === targetAlert.data.id;
        });
        if (indexOfTarget >= 0) {
          this.state.presentList.splice(indexOfTarget, 1);
          if (this.state.storeList.length > 0) {
            const poppedAlertFromStoreList = this.state.storeList.shift();
            this.state.presentList.push(poppedAlertFromStoreList);
          }
        } else {
          this.restfulCommService.logError('can not find alert to delete in present list');
          console.error('can not find alert to delete in present list');
        }
        this.updateTotalSize();
      } else {
        const indexOfTarget = this.state.storeList.findIndex((eachAlert) => {
          return eachAlert.data.id === targetAlert.data.id;
        });
        if (indexOfTarget >= 0) {
          this.state.storeList.splice(indexOfTarget, 1);
        } else {
          this.restfulCommService.logError('can not find alert to delete in store list');
          console.error('can not find alert to delete in store list');
        }
      }
    }
  }

  private updateAlertTrigger(newState: boolean) {
    this.state.triggerActionMenuOpen = newState;
    this.state.presentList.forEach((eachAlert) => {
      eachAlert.state.isSlidedOut = this.state.triggerActionMenuOpen;
    });
    this.state.storeList.forEach((eachAlert) => {
      eachAlert.state.isSlidedOut = this.state.triggerActionMenuOpen;
    });
  }

  private getRawAlerts() {
    const payload = {
      "timeStamp": this.state.alertUpdateTimeStamp ||  moment().hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ss.SSS")
    };
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getAlerts, {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn: Array<BEAlertDTO>) => {
        this.state.alertUpdateTimeStamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSS");
        // using synthetic alerts for dev purposes
        // serverReturn = !this.state.alert.initialAlertListReceived ? AlertSample : [];
        const filteredServerReturn = !!serverReturn ? serverReturn.filter((eachRawAlert) => {
          // no filtering logic for now
          return true;
        }) : [];
        const [urgentAlertUpdateList, allAlertsUpdateList ] = this.createAlertsLists(filteredServerReturn);
        this.store$.dispatch(new CoreGlobalAlertsProcessedRawAlerts());
        urgentAlertUpdateList.length > 0 && this.getAlertsForUrgentAlertList(urgentAlertUpdateList);
        if (allAlertsUpdateList.length > 0) {
          this.state.allAlertsList = [...this.state.allAlertsList, ...allAlertsUpdateList];
        }
        this.state.alertUpdateInProgress = false;
      }),
      catchError(err => {
        this.state.alertUpdateInProgress = false;
        console.error(`${this.restfulCommService.apiMap.getAlerts} failed`, err);
        this.store$.dispatch(new CoreGlobalAlertFailedToMakeAlertAPICall(true))
        return of('error');
      })
    ).subscribe();
    this.store$.dispatch(new CoreGlobalAlertProcessingEvent());
  }

  private getAlertsForUrgentAlertList(alertList: Array<DTOs.AlertDTO>) {
    // the BE returns the array in a sequential order with the latest one on top, because the Alert present list is in a first-in-last-out order, we need to sort it reversely so it is presented in a sequential order
    const alertListSorted: Array<DTOs.AlertDTO> = this.utilityService.deepCopy(alertList).reverse();
    try {
      alertListSorted.forEach((eachAlert) => {
        if (eachAlert.state.isCancelled) {
          if (eachAlert.state.isExpired) {
            // if it is naturally expired, then don't do anything
            // because if it is the first load after refreshing the FE, then nothing needs to be done for the naturally expired ones
            // and if it is not the first load, the expiration will be picked up at individual alert level
          } else {
            console.log('cancel alert ', eachAlert);
            this.onAlertExpired(eachAlert);
          }
        } else if (eachAlert.data.isUrgent) {
          this.generateNewAlert(eachAlert, alertListSorted);
        }
      });
      this.state.presentList.forEach((alert: DTOs.AlertDTO, index: number) => {
        const displayCutOff = alertList.length < this.constants.sizeCap ? alertList.length : this.constants.sizeCap;
        if (index < displayCutOff) {
          this.initiateStateProgressionForNewAlert(alert);
        }
      })
      this.updateTotalSize();
      this.store$.dispatch(new CoreGlobalAlertClearAllUrgentAlerts());
    } catch {
      this.restfulCommService.logError('received new alerts but failed to generate');
      console.error('received new alerts but failed to generate');
    }
  }

  private createAlertsLists(serverReturn: Array<BEAlertDTO>):Array<Array<DTOs.AlertDTO>> {
    const urgentAlertUpdateList: Array<DTOs.AlertDTO> = [];
    const allAlertsUpdateList: Array<DTOs.AlertDTO> = [];
    serverReturn.forEach((eachRawAlert: BEAlertDTO) => {
      if (!!eachRawAlert) {
          const newAlert = this.dtoService.formAlertObjectFromRawData(eachRawAlert);
        // Inquiry alerts are handled differently since BE passes the same inquiry alerts regardless of the timestamp FE provides
        if (!!eachRawAlert.marketListAlert) {
          if (this.state.receivedActiveAlertsMap[eachRawAlert.alertId]) {
            // ignore, already have it
          } else if (!eachRawAlert.isActive) {
            // ignore, already expired
            if (newAlert.data.security && newAlert.data.security.data.securityID) {
              allAlertsUpdateList.push(newAlert);
            }
          } else {
            this.state.receivedActiveAlertsMap[eachRawAlert.alertId] = eachRawAlert.keyWord;
            urgentAlertUpdateList.push(newAlert);
            if (newAlert.data.security && newAlert.data.security.data.securityID) {
              allAlertsUpdateList.push(newAlert);
            }
          }
        } else {
          if (eachRawAlert.isCancelled) {
            // cancellation of alerts carries diff meaning depending on the alert type:
            // axe & mark & inquiry: it could be the trader entered it by mistake, but it could also be the trader changed his mind so he/she cancels the previous legitmate entry. So when such an cancelled alert comes in
            !newAlert.state.isRead && allAlertsUpdateList.push(newAlert);
            if (newAlert.data.type === this.constants.alertTypes.markAlert || newAlert.data.type === this.constants.alertTypes.axeAlert) {
              urgentAlertUpdateList.push(newAlert);
            }
          } else {
            if (!newAlert.state.isRead && newAlert.data.isUrgent) {
              urgentAlertUpdateList.push(newAlert);
            }
            if (newAlert.data.security && newAlert.data.security.data.securityID) {
              allAlertsUpdateList.push(newAlert)
            }
          }
        }
      }
    });
    return [urgentAlertUpdateList, allAlertsUpdateList];
  }

  private findTradeAlertPanelMissingAlerts(lastReceiveTimestamp: number): Array<DTOs.AlertDTO> {
    const lastReceiveTime = moment.unix(lastReceiveTimestamp);
    if (!!lastReceiveTime) {
      const missingAlerts = this.state.allAlertsList.filter((eachAlert) => {
        return !moment.unix(eachAlert.data.unixTimestamp).isBefore(lastReceiveTime);
      });
      return missingAlerts;
    } else {
      return [];
    }
  }
}
