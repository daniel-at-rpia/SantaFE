import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';

import { RestfulCommService } from 'Core/services/RestfulCommService';
import { TradeAlertPanelState } from 'FEModels/frontend-page-states.interface';
import { EngagementActionList } from 'Core/constants/coreConstants.constant';

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
    private restfulCommService: RestfulCommService,
  ){
    this.state = this.initializePageState();
  }

  private initializePageState(): TradeAlertPanelState {
    const state: TradeAlertPanelState = {
      configureAlert: false
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