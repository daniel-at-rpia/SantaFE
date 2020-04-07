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
  @Output() clickedUpVote = new EventEmitter<SecurityQuoteDTO>();
  @Output() clickedDownVote = new EventEmitter<SecurityQuoteDTO>();
  constructor() { console.log(this);}

  public onClickDownVote() {
    !!this.clickedDownVote && this.clickedDownVote.emit(this.messageData);
  }

  public onClickUpVote() {
    !!this.clickedUpVote && this.clickedUpVote.emit(this.messageData);
  }

  public onClickSpecificQuote(isOnBidSide: boolean, targetDriver: string) {
    const payload: ClickedSpecificQuoteEmitterParams = {
      targetQuote: this.messageData,
      isOnBidSide: isOnBidSide,
      targetDriver: targetDriver
    };
    !!this.clickedSpecificQuote && this.clickedSpecificQuote.emit(payload);
  }
}
