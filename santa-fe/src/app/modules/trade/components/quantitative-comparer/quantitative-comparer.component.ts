import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { QuantComparerDTO } from 'FEModels/frontend-models.interface';

@Component({
  selector: 'quant-comparer',
  templateUrl: './quantitative-comparer.component.html',
  styleUrls: ['./quantitative-comparer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class QuantitativeComparer implements OnInit {
  @Input() quantData: QuantComparerDTO;
  constructor(
  ) {
  }

  ngOnInit() {

  }
}
