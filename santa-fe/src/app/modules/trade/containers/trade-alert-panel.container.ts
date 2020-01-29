import {
  Component,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'trade-alert-panel',
  templateUrl: './trade-alert-panel.container.html',
  styleUrls: ['./trade-alert-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeAlertPanel {

  public onClickSendMail() {
    location.href = "mailto:santa@rpia.ca?subject=Santa%20Feedback";
  }

}