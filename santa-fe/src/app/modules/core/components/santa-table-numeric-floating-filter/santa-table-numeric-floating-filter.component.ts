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

import { NumericFilterDTO } from 'FEModels/frontend-models.interface';
import {
  SantaTableNumericFloatingFilterChange,
  SantaTableNumericFloatingFilterParams
} from 'FEModels/frontend-adhoc-packages.interface';


@Component({
  selector: 'santa-table-numeric-floating-filter',
  templateUrl: './santa-table-numeric-floating-filter.component.html',
  styleUrls: ['./santa-table-numeric-floating-filter.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SantaTableNumericFloatingFilter implements 
  IFloatingFilter<
    NumericFilterDTO,
    SantaTableNumericFloatingFilterChange,
    SantaTableNumericFloatingFilterParams>,
  AgFrameworkComponent<SantaTableNumericFloatingFilterParams>
{
  public filterData: NumericFilterDTO;

  constructor() { }

  public agInit(params: SantaTableNumericFloatingFilterParams) {
    this.filterData = this.initDTO(params);
  }

  public onParentModelChanged(parentModel: NumericFilterDTO) {
    // When DTO is passed between floatingFilter and parentFilter, the numerical data is automatically converted to string, this is an agGrid defect we have to workaround
    this.filterData.data = {
      minNumber: parentModel.data.minNumber === "" ? parentModel.data.minNumber : parseFloat(parentModel.data.minNumber as string),
      maxNumber: parentModel.data.maxNumber === "" ? parentModel.data.maxNumber : parseFloat(parentModel.data.maxNumber as string)
    };
    this.checkIsFilled();
  }

  public onChangeMin(newValue): void {
    this.filterData.data.minNumber = newValue === "" ? newValue : parseFloat(newValue);
    this.checkIsFilled();
    this.filterData.api.floatingParams.onFloatingFilterChanged(this.filterData);
  }

  public onChangeMax(newValue): void {
    this.filterData.data.maxNumber = newValue === "" ? newValue : parseFloat(newValue);
    this.checkIsFilled();
    this.filterData.api.floatingParams.onFloatingFilterChanged(this.filterData);
  }

  public onClickedClear() {
    this.filterData.data = {
      minNumber: "",
      maxNumber: ""
    };
    this.checkIsFilled();
    this.filterData.api.floatingParams.onFloatingFilterChanged(this.filterData);
  }

  private initDTO(params: SantaTableNumericFloatingFilterParams) {
    return {
      data: {
        minNumber: '',
        maxNumber: ''
      },
      api: {
        params: null,
        valueGetter: null,
        floatingParams: params
      },
      state: {
        isFilled: false
      }
    };
  }

  private checkIsFilled() {
    if (this.filterData.data.minNumber !== "" || this.filterData.data.maxNumber !== "") {
      this.filterData.state.isFilled = true;
    } else {
      this.filterData.state.isFilled = false;
    }
  }

}
