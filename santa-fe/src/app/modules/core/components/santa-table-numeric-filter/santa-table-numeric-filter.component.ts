import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import {
  IAfterGuiAttachedParams,
  IDoesFilterPassParams,
  IFilterParams,
  RowNode
} from 'ag-grid-community';
import { IFilterAngularComp } from 'ag-grid-angular';


@Component({
  selector: 'santa-table-numeric-filter',
  templateUrl: './santa-table-numeric-filter.component.html',
  styleUrls: ['./santa-table-numeric-filter.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SantaTableNumericFilter implements IFilterAngularComp {
  private params: IFilterParams;
  private valueGetter: (rowNode: RowNode) => any;
  private filterVal: string = '';

  @ViewChild('input', {static: false}) private input;

  agInit(params: IFilterParams): void {
    this.params = params;
    this.valueGetter = params.valueGetter;
  }

  isFilterActive(): boolean {
    return this.filterVal !== null && this.filterVal !== undefined && this.filterVal !== '';
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return this.valueGetter(params.node) >= this.filterVal
  }

  getModel(): any {
    return this.filterVal;
  }

  setModel(model: any): void {
    this.filterVal = model ? model : null;
  }

  onChange(newValue): void {
    this.filterVal = newValue !== null ? newValue : 0;
    this.params.filterChangedCallback();
  }

  onFloatingFilterChanged(change) {
    this.onChange(change);
    this.input.element.nativeElement.value = change;
  }

  // noinspection JSMethodCanBeStatic
  componentMethod(message: string): void {
    alert(`Alert from MoreThanOrEqualToFilter
       ${message}`);
  }
}