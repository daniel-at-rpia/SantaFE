// dependencies
    import {
      Component,
      ViewEncapsulation,
      Input,
      Output,
      EventEmitter,
      OnInit,
      OnChanges,
      OnDestroy
    } from '@angular/core';
    import { Store, select } from '@ngrx/store';
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

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { TradeAlertPanelState } from 'FEModels/frontend-page-states.interface';
    import {
      EngagementActionList,
      AlertTypes
    } from 'Core/constants/coreConstants.constant';
    import {
      selectSecurityMapContent,
      selectSecurityMapValidStatus
    } from 'Core/selectors/core.selectors';
  //

@Component({
  selector: 'trade-alert-panel',
  templateUrl: './trade-alert-panel.container.html',
  styleUrls: ['./trade-alert-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeAlertPanel implements OnInit, OnChanges, OnDestroy {
  @Input() ownerInitial: string;
  @Input() sidePanelsDisplayed: boolean;
  @Input() collapseConfiguration: boolean;
  @Output() configureAlert = new EventEmitter();
  state: TradeAlertPanelState;
  subscriptions = {
    securityMapSub: null
  }

  constructor(
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService,
  ){
    this.state = this.initializePageState();
  }

  private initializePageState(): TradeAlertPanelState {
    const state: TradeAlertPanelState = {
      configureAlert: false,
      isAlertPaused: false,
      testDto: this.dtoService.createSecurityDefinitionConfigurator(true, true),
      securityMap: [],
      configuration: {
        selectedAlert: null,
        axe: {
          securitySearchKeyword: '',
          securityList: []
        },
        mark: {

        }
      }
    };
    return state;
  }

  public ngOnInit() {
    this.subscriptions.securityMapSub = this.store$.pipe(
      select(selectSecurityMapContent),
      withLatestFrom(
        this.store$.pipe(select(selectSecurityMapValidStatus))
      )
    ).subscribe(([mapContent, isValid]) => {
      if (!!isValid) {
        this.state.securityMap = mapContent;
      }
    });
  }

  public ngOnChanges() {
    if (!!this.collapseConfiguration) {
      this.state.configureAlert = false;
    }
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }

  public onClickConfigureAlert() {
    this.configureAlert.emit();
    this.state.configureAlert = true;
  }

  public onTogglePauseAlert() {
    this.state.isAlertPaused = !this.state.isAlertPaused;
  }

  public selectAlertForConfigure(targetType: AlertTypes) {
    this.state.configuration.selectedAlert = targetType;
  }

  // public onClickSendMail() {
  //   this.restfulCommService.logEngagement(
  //     EngagementActionList.sendEmail,
  //     'n/a',
  //     'n/a',
  //     this.ownerInitial,
  //     'Trade - Alert Panel'
  //   );
  //   location.href = "mailto:santa@rpia.ca?subject=Santa%20Feedback";
  // }

}