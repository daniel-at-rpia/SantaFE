import {Component, Input,OnInit, ViewEncapsulation} from '@angular/core';
import { StructurePopoverDTO, StructurePortfolioBreakdownRowDTO } from 'Core/models/frontend/frontend-models.interface';
import { BICsDataProcessingService } from 'Structure/services/BICsDataProcessingService';
import { Store, select } from '@ngrx/store';
import { selectMetricLevel } from 'Structure/selectors/structure.selectors';
import { PortfolioMetricValues } from 'App/modules/core/constants/structureConstants.constants';
import { UtilityService } from 'Core/services/UtilityService';
@Component({
  selector: 'structure-popover',
  templateUrl: './structure-popover.container.html',
  styleUrls: ['./structure-popover.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructurePopover implements OnInit {
  @Input() popover: StructurePopoverDTO
  subscriptions = {
    selectedMetricLevelSub: null
  }
  constructor(
  private bicsDataProcessingService: BICsDataProcessingService,
  private store$: Store<any>
  ) {}
  public ngOnInit() {
    this.subscriptions.selectedMetricLevelSub = this.store$.pipe(
      select(selectMetricLevel)
    ).subscribe((value) => {
      if (!!value) {
        this.popover.state.isDisplayCs01 = value === PortfolioMetricValues.cs01;
        this.popover.data.mainRow.data.children.data.displayCategoryList = this.popover.state.isDisplayCs01 ? this.popover.data.mainRow.data.children.data.rawCs01CategoryList : this.popover.data.mainRow.data.children.data.rawLeverageCategoryList;
      }
    });
  };

  public getNextBicsLevel(breakdownRow: StructurePortfolioBreakdownRowDTO) {
    if (breakdownRow.state.isBicsLevel1) {
      this.closePopover();
      return;
    }
    const subBicsLevel = this.bicsDataProcessingService.formSubLevelBreakdown(breakdownRow, this.popover.state.isDisplayCs01);
    breakdownRow.data.children = subBicsLevel;
    breakdownRow.state.isSelected = !breakdownRow.state.isSelected;
  }

  public closePopover() {
    this.popover.state.isActive = false;
    this.popover.data.mainRow.state.isSelected = false;
  }

}