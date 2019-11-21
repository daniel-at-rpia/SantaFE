import {
  Component,
  OnInit,
  OnChanges,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { SecurityMetricOptionStub } from 'FEModels/frontend-stub-models.interface';

@Component({
  selector: 'metric-selection-dropdown',
  templateUrl: './metric-selection-dropdown.component.html',
  styleUrls: ['./metric-selection-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MetricSelectionDropdown implements OnChanges {
  @Input() metricList: Array<SecurityMetricOptionStub>;
  @Input() selectedMetric: SecurityMetricOptionStub;
  @Input() selectedMetricValueType: string;
  @Input() selectedMetricDeltaType: string;
  @Output() dropdownClosed = new EventEmitter();
  @Output() dropdownMetricSelected = new EventEmitter<SecurityMetricOptionStub>();
  @Output() dropdownMetricValueTypeSelected = new EventEmitter<string>();
  @Output() dropdownMetricDeltaTypeSelected = new EventEmitter<string>();

  constructor() { }

  ngOnChanges() {

  }

  public onClickCloseDropdown(){
    this.dropdownClosed.emit();
  }

  public onSelectMetric(targetMetric){
    this.dropdownMetricSelected.emit(targetMetric);
  }

  public onSelectMetricValue(targetValue){
    this.dropdownMetricValueTypeSelected.emit(targetValue);
  }

  public onSelectMetricDelta(targetDeltaScope){
    this.dropdownMetricDeltaTypeSelected.emit(targetDeltaScope);
  }

}
