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

  }

  public onToggleDisplayAlerts() {
    this.state.displayAlerts = !this.state.displayAlerts;
    this.state.triggerActionMenuOpen = false;
  }

  public onClickClearAlerts() {
    this.generateNewAlert();
    this.state.triggerActionMenuOpen = false;
  }

  public onMouseEnterAlert(targetAlert: AlertDTO) {
    targetAlert.state.isHovered = true;
  }

  public onMouseLeaveAlert(targetAlert: AlertDTO) {
    targetAlert.state.isHovered = false;
  }

  private generateNewAlert() {
    const newAlert = this.dtoService.formAlertObject(PortfolioList['128'].security);
    this.state.presentList.unshift(newAlert);
    setTimeout(function(){
      newAlert.state.isNew = false;
      newAlert.state.isCountdownFinished = false;
      setTimeout(function(){
        newAlert.state.isCountdownFinished = true;
      }, 5000);
    }, 10);
  }

}