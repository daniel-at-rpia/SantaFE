import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import {
  SecurityTableDTO,
  SecurityTableRowDTO
} from 'FEModels/frontend-models.interface';

@Component({
  selector: 'security-trading-message',
  templateUrl: './security-trading-message.component.html',
  styleUrls: ['./security-trading-message.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityTradingMessage {
  @Input() messageData: SecurityTableDTO;
  constructor() { }

}
