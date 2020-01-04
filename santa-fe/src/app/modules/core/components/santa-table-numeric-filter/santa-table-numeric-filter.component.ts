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

import { NumericFilterDTO } from 'FEModels/frontend-models.interface';


@Component({
  selector: 'santa-table-numeric-filter',
  templateUrl: './santa-table-numeric-filter.component.html',
  styleUrls: ['./santa-table-numeric-filter.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SantaTableNumericFilter implements  IFilterAngularComp {
  public filterData: NumericFilterDTO;

  public agInit(params: IFilterParams): void {
    this.filterData = this.initDTO(params);
  }

  public isFilterActive(): boolean {
    return (this.filterData.data.minNumber != null && this.filterData.data.minNumber !== "") || (this.filterData.data.maxNumber != null && this.filterData.data.maxNumber !== "");
  }

  public doesFilterPass(params: IDoesFilterPassParams): boolean {
    const value = this.filterData.api.valueGetter(params.node);
    const parsedValue = parseFloat(value);
    const min = this.filterData.data.minNumber === "" ? null : this.filterData.data.minNumber;
    const max = this.filterData.data.maxNumber === "" ? null : this.filterData.data.maxNumber;
    if (min != null && max != null) {
      this.filterData.data.minNumber = parseFloat(min as string);
      this.filterData.data.maxNumber = parseFloat(max as string);
      return value >= min && value <= max;
    } else if (min != null) {
      this.filterData.data.minNumber = parseFloat(min as string);
      return value >= min;
    } else if (max != null) {
      this.filterData.data.maxNumber = parseFloat(max as string);
      return value <= max;
    } else {
      return true;
    }
  }

  public getModel(): NumericFilterDTO {
    return this.filterData;
  }

  public setModel(model: NumericFilterDTO): void {
    this.filterData = model || this.initDTO(this.filterData.api.params);
  }

  private initDTO(params: IFilterParams) {
    return {
      data: {
        minNumber: '',
        maxNumber: ''
      },
      api: {
        params: params,
        valueGetter: params.valueGetter
      },
      state: {
      }
    };
  }

  private onChangeMin(newValue): void {
    this.filterData.data.minNumber = newValue === "" ? newValue : parseFloat(newValue);
    this.filterData.api.params.filterChangedCallback();
  }

  private onChangeMax(newValue): void {
    this.filterData.data.maxNumber = newValue === "" ? newValue : parseFloat(newValue);
    this.filterData.api.params.filterChangedCallback();
  }
}