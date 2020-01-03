import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output
} from '@angular/core';

import {
  IFloatingFilter,
  IFloatingFilterParams,
  SerializedNumberFilter
} from 'ag-grid-community';
import { AgFrameworkComponent } from 'ag-grid-angular';


interface SantaTableNumericFloatingFilterChange {
  model: SerializedNumberFilter
}

interface SantaTableNumericFloatingFilterParams extends IFloatingFilterParams<SerializedNumberFilter, SantaTableNumericFloatingFilterChange> {
  value: number;
  maxValue: number;
}

@Component({
  selector: 'santa-table-numeric-floating-filter',
  templateUrl: './santa-table-numeric-floating-filter.component.html',
  styleUrls: ['./santa-table-numeric-floating-filter.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SantaTableNumericFloatingFilter implements 
  IFloatingFilter<
    SerializedNumberFilter,
    SantaTableNumericFloatingFilterChange,
    SantaTableNumericFloatingFilterParams>,
  AgFrameworkComponent<SantaTableNumericFloatingFilterParams>
{
  private params: SantaTableNumericFloatingFilterParams;
  public maxValue: number;
  public currentValue: number | SerializedNumberFilter;

  constructor() { }

  public agInit(params: SantaTableNumericFloatingFilterParams) {
    this.params = params;
    this.maxValue = this.params.maxValue;
    this.currentValue = 0;
  }

  public valueChanged() {
    this.params.onFloatingFilterChanged(this.currentValue as SerializedNumberFilter);
  }

  public onParentModelChanged(parentModel: SerializedNumberFilter) {
    this.currentValue = parentModel || 0;
  }

}
