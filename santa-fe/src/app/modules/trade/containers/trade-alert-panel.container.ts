// dependencies
    import {
      Component,
      ViewEncapsulation,
      Input,
      Output,
      EventEmitter,
      OnChanges
    } from '@angular/core';
    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { TradeAlertPanelState } from 'FEModels/frontend-page-states.interface';
    import {
      EngagementActionList,
      AlertTypes
    } from 'Core/constants/coreConstants.constant';
  //

@Component({
  selector: 'trade-alert-panel',
  templateUrl: './trade-alert-panel.container.html',
  styleUrls: ['./trade-alert-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeAlertPanel implements OnChanges {
  @Input() ownerInitial: string;
  @Input() sidePanelsDisplayed: boolean;
  @Input() collapseConfiguration: boolean;
  @Output() configureAlert = new EventEmitter();
  state: TradeAlertPanelState;

  constructor(
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

  public ngOnChanges() {
    if (!!this.collapseConfiguration) {
      this.state.configureAlert = false;
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