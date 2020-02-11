import {
  Component,
  ViewEncapsulation,
  Input
} from '@angular/core';

import { RestfulCommService } from 'Core/services/RestfulCommService';
import { EngagementActionList } from 'Core/constants/coreConstants.constant';

@Component({
  selector: 'trade-alert-panel',
  templateUrl: './trade-alert-panel.container.html',
  styleUrls: ['./trade-alert-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeAlertPanel {
  @Input() ownerInitial: string;

  constructor(
    private restfulCommService: RestfulCommService,
  ){}

  public onClickSendMail() {
    this.restfulCommService.logEngagement(
      EngagementActionList.sendEmail,
      'n/a',
      'n/a',
      this.ownerInitial,
      'Trade - Alert Panel'
    );
    location.href = "mailto:santa@rpia.ca?subject=Santa%20Feedback";
  }

}