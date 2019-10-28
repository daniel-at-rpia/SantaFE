import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { QuantitativeComparerDTO } from 'FEModels/frontend-models.interface';

@Component({
  selector: 'quant-comparer',
  templateUrl: './quantitative-comparer.component.html',
  styleUrls: ['./quantitative-comparer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class QuantitativeComparer implements OnInit {
  @Input() quantData: QuantitativeComparerDTO;
  constructor(
  ) {
  }

  ngOnInit() {

  }
}
