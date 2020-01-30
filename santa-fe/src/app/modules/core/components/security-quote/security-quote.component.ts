import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { SecurityQuoteDTO } from 'FEModels/frontend-models.interface';
import { ClickedSpecificQuoteEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';

@Component({
  selector: 'security-quote',
  templateUrl: './security-quote.component.html',
  styleUrls: ['./security-quote.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityQuote {
  @Input() messageData: SecurityQuoteDTO;
  @Output() clickedSpecificQuote = new EventEmitter<ClickedSpecificQuoteEmitterParams>();
  @Output() clickedThumbdown = new EventEmitter<SecurityQuoteDTO>();
  constructor() { }

  public onClickThumbdown() {
    !!this.clickedThumbdown && this.clickedThumbdown.emit(this.messageData);
  }

  public onClickSpecificQuote(isOnBidSide: boolean, targetMetric: string) {
    const payload: ClickedSpecificQuoteEmitterParams = {
      targetQuote: this.messageData,
      isOnBidSide: isOnBidSide,
      targetMetric: targetMetric
    };
    !!this.clickedSpecificQuote && this.clickedSpecificQuote.emit(payload);
  }
}
