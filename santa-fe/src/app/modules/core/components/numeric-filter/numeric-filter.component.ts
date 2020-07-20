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
  @Input() numericRangeActive: boolean;
  @Output() detectedMinChange = new EventEmitter<Number>();
  @Output() detectedMaxChange = new EventEmitter<Number>();
  @Output() detectedClickedClear = new EventEmitter;
  constructor() { }

  public onChangeMin(newValue): void {
    this.detectedMinChange.emit(newValue);
  }

  public onChangeMax(newValue): void {
    this.detectedMaxChange.emit(newValue);
  }

  public onClickedClear() {
    !!this.filterData.state.isFilled && this.detectedClickedClear.emit();
  }
}
