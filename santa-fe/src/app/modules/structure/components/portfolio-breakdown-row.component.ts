import {Component, Input, Output, OnInit, ViewEncapsulation, EventEmitter} from '@angular/core';
import { StructurePortfolioBreakdownRowDTO } from 'Core/models/frontend/frontend-models.interface';
import { Store, select } from '@ngrx/store';
import { selectMetricLevel } from 'Structure/selectors/structure.selectors';
import { PortfolioMetricValues } from 'App/modules/core/constants/structureConstants.constants';


@Component({
  selector: 'portfolio-breakdown-row',
  templateUrl: './portfolio-breakdown-row.component.html',
  styleUrls: ['./portfolio-breakdown-row.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class PortfolioBreakdownRow implements OnInit {
  @Input() breakdownRow: StructurePortfolioBreakdownRowDTO;
  @Output() breakdownRowDiveIn = new EventEmitter<StructurePortfolioBreakdownRowDTO>();
  subscriptions = {
    selectedMetricLevelSub: null
  }
  constructor(private store$: Store<any>) {}
  public ngOnInit() {
    this.subscriptions.selectedMetricLevelSub = this.store$.pipe(
      select(selectMetricLevel)
    ).subscribe((value) => {
      if (!!value) {
        this.breakdownRow.data.state.isDisplayCs01 = value === PortfolioMetricValues.cs01;
        if (this.breakdownRow.data.children) {
          this.breakdownRow.data.children.data.displayCategoryList = this.breakdownRow.data.state.isDisplayCs01 ?  this.breakdownRow.data.children.data.rawCs01CategoryList :  this.breakdownRow.data.children.data.rawLeverageCategoryList;
        }
      }
    });
    this.breakdownRow.state.isBtnDiveIn = this.breakdownRow.data.bicsLevel < 4;
  };

  public onClickDiveIn(row: StructurePortfolioBreakdownRowDTO) {
    if (!row.data.bicsLevel) return;
    !!this.breakdownRowDiveIn && this.breakdownRowDiveIn.emit(row);
  }
}