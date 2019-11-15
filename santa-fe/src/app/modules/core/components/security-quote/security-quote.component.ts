import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import {
  SecurityQuoteDTO
} from 'FEModels/frontend-models.interface';

@Component({
  selector: 'security-quote',
  templateUrl: './security-quote.component.html',
  styleUrls: ['./security-quote.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityQuote {
  @Input() messageData: SecurityQuoteDTO;
  constructor() { }

}
