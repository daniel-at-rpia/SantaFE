  // dependencies
    import {
      Component,
      ViewEncapsulation,
      OnInit,
      OnChanges,
      OnDestroy,
      Input
    } from '@angular/core';
    import { Observable, Subscription } from 'rxjs';
    import {
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

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { GlobalAlertState } from 'FEModels/frontend-page-states.interface';
    import { AlertDTO } from 'FEModels/frontend-models.interface';
    import { PayloadSetAlertsToInactive } from 'BEModels/backend-payloads.interface';
    import { AlertSample } from 'Trade/stubs/tradeAlert.stub';
    import {
      ALERT_COUNTDOWN,
      AlertTypes,
      ALERT_PRESENT_LIST_SIZE_CAP,
      ALERT_TOTALSIZE_MAX_DISPLAY_THRESHOLD
    } from 'Core/constants/coreConstants.constant';
    import { CoreToggleAlertThumbnailDisplay } from 'Core/actions/core.actions';
    import { selectNewAlerts } from 'Core/selectors/core.selectors';
    import { CoreReceivedNewAlerts } from 'Core/actions/core.actions';
  //

@Component({
  selector: 'global-alert',
  templateUrl: './global-alert.container.html',
  styleUrls: ['./global-alert.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class GlobalAlert implements OnInit, OnChanges, OnDestroy {
  @Input() ownerInitial: string;
  state: GlobalAlertState;
  subscriptions = {
    newAlertSubscription: null
  }
  constants = {
    sizeCap: ALERT_PRESENT_LIST_SIZE_CAP,
    totalSizeMaxDisplay: ALERT_TOTALSIZE_MAX_DISPLAY_THRESHOLD
  }

  private initializePageState(): GlobalAlertState {
    const state: GlobalAlertState = {
      activated: true,
      displayAlerts: true,
      triggerActionMenuOpen: false,
      presentList: [],
      storeList: [],
      totalSize: 0,
      displayTotalSize: ''
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
    this.subscriptions.newAlertSubscription = this.store$.pipe(
      select(selectNewAlerts),
      filter((alertList) => {
        return alertList.length > 0;
      })
    ).subscribe((alertList) => {
      this.store$.dispatch(new CoreReceivedNewAlerts());
      alertList.forEach((eachAlert) => {
        this.generateNewAlert(this.utilityService.deepCopy(eachAlert));
      });
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
  }

  public onClickAlertThumbnail(targetAlert: AlertDTO) {
    if (targetAlert) {
      targetAlert.state.isSlidedOut = !targetAlert.state.isSlidedOut;
      if (!targetAlert.state.isSlidedOut && !targetAlert.state.isCountdownFinished) {
        targetAlert.state.isCountdownFinished = true;
      }
    }
  }

  public loadAlertToTable(targetAlert: AlertDTO) {
    if (targetAlert) {
    }
  }

  public onClickAlertRemove(targetAlert: AlertDTO) {
    if (targetAlert) {
      targetAlert.state.willBeRemoved = true;
      const removeTarget = () => {
        this.removeTargetFromPresentList(targetAlert, true);
      }
      setTimeout(removeTarget.bind(this), 300);
    }
  }

  private generateNewAlert(newAlert: AlertDTO) {
    if (this.state.presentList.length >= this.constants.sizeCap) {
      this.state.storeList.push(newAlert);
      newAlert.state.isNew = false;
      newAlert.state.isCountdownFinished = true;
    } else {
      this.state.presentList.unshift(newAlert);
      this.initiateStateProgressionForNewAlert(newAlert);
    }
    this.updateTotalSize();
  }

  private initiateStateProgressionForNewAlert(newAlert: AlertDTO) {
    setTimeout(function(){
      newAlert.state.isNew = false;
      newAlert.state.isCountdownFinished = false;
      setTimeout(function(){
        newAlert.state.isCountdownFinished = true;
      }, ALERT_COUNTDOWN);
    }, 10);
  }

  private updateTotalSize() {
    this.state.totalSize = this.state.presentList.length + this.state.storeList.length;
    if (this.state.totalSize > this.constants.totalSizeMaxDisplay) {
      this.state.displayTotalSize = '99+';
    } else {
      this.state.displayTotalSize = `${this.state.totalSize}`;
    }
  }

  private removeTargetFromPresentList(
    targetAlert: AlertDTO,
    isFromPresent: boolean
  ) {
    if (!!targetAlert) {
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
      if (isFromPresent) {
        const indexOfTarget = this.state.presentList.indexOf(targetAlert);
        if (indexOfTarget >= 0) {
          this.state.presentList.splice(indexOfTarget, 1);
          if (this.state.storeList.length > 0) {
            const poppedAlertFromStoreList = this.state.storeList.shift();
            this.state.presentList.push(poppedAlertFromStoreList);
          }
        } else {
          this.restfulCommService.logError('can not find alert to delete in present list', null);
          console.error('can not find alert to delete in present list');
        }
        this.updateTotalSize();
      } else {
        const indexOfTarget = this.state.storeList.indexOf(targetAlert);
        if (indexOfTarget >= 0) {
          this.state.storeList.splice(indexOfTarget, 1);
        } else {
          this.restfulCommService.logError('can not find alert to delete in store list', null);
          console.error('can not find alert to delete in store list');
        }
      }
    }
  }

  private updateAlertTrigger(newState: boolean) {
    this.state.triggerActionMenuOpen = newState;
    this.state.presentList.forEach((eachAlert) => {
      eachAlert.state.isSlidedOut = this.state.triggerActionMenuOpen;
    })
    this.state.storeList.forEach((eachAlert) => {
      eachAlert.state.isSlidedOut = this.state.triggerActionMenuOpen;
    })
  }

}