import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { BestQuoteComparerDTO } from 'FEModels/frontend-models.interface';

@Component({
  selector: 'best-quote-comparer',
  templateUrl: './best-quote-comparer.component.html',
  styleUrls: ['./best-quote-comparer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class BestQuoteComparer implements OnInit {
  @Input() bestQuoteData: BestQuoteComparerDTO;
  constructor(
  ) {
  }

  ngOnInit() {

  }
}
