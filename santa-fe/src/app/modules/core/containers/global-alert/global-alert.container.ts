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
    import { PortfolioList } from 'Core/stubs/securities.stub';
    import {
      ALERT_COUNTDOWN,
      AlertTypes
    } from 'Core/constants/coreConstants.constant';
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
  }
  constants = {
  }

  private initializePageState(): GlobalAlertState {
    const state: GlobalAlertState = {
      activated: true,
      displayAlerts: true,
      triggerActionMenuOpen: false,
      presentList: []
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
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }

  public onClickAlertTrigger() {
    this.state.triggerActionMenuOpen = !this.state.triggerActionMenuOpen;
    this.state.presentList.forEach((eachAlert) => {
      eachAlert.state.isHovered = this.state.triggerActionMenuOpen;
    })
  }

  public onToggleDisplayAlerts() {
    this.state.displayAlerts = !this.state.displayAlerts;
    this.state.triggerActionMenuOpen = false;
  }

  public onClickClearAlerts() {
    this.generateNewAlert();
    // this.state.triggerActionMenuOpen = false;
  }

  public onClickAlertThumbnail(targetAlert: AlertDTO) {
    if (targetAlert) {
      targetAlert.state.isHovered = !targetAlert.state.isHovered;
      if (!targetAlert.state.isHovered && !targetAlert.state.isCountdownFinished) {
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
        this.removeTargetFromPresentList(targetAlert);
      }
      setTimeout(removeTarget.bind(this), 300);
    }
  }

  private generateNewAlert() {
    const newAlert = this.dtoService.formAlertObject(PortfolioList.securityDtos.securityDtos['128'].security);
    newAlert.data.message = `${newAlert.data.message} - ${this.state.presentList.length}`
    if ((this.state.presentList.length%2) !== 0) {
      newAlert.data.type = AlertTypes.owic;
    }
    this.state.presentList.unshift(newAlert);
    setTimeout(function(){
      newAlert.state.isNew = false;
      newAlert.state.isCountdownFinished = false;
      setTimeout(function(){
        newAlert.state.isCountdownFinished = true;
      }, ALERT_COUNTDOWN);
    }, 10);
  }

  private removeTargetFromPresentList(targetAlert: AlertDTO) {
    const indexOfTarget = this.state.presentList.indexOf(targetAlert);
    if (indexOfTarget >= 0) {
      this.state.presentList.splice(indexOfTarget, 1);
    }
  }

}