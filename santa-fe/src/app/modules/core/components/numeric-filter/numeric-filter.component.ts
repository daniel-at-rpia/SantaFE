import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  NumericFilterDTO
} from 'FEModels/frontend-models.interface';

@Component({
  selector: 'numeric-filter',
  templateUrl: './numeric-filter.component.html',
  styleUrls: ['./numeric-filter.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class NumericFilter {
  @Input() filterData: NumericFilterDTO;
  @Output() detectedMinChange = new EventEmitter<Number>();
  @Output() detectedMaxChange = new EventEmitter<Number>();
  constructor() { }

  private onChangeMin(newValue): void {
    console.log('test, send', newValue);
    this.detectedMinChange.emit(newValue);
  }

  private onChangeMax(newValue): void {
    this.detectedMaxChange.emit(newValue);
  }
}
