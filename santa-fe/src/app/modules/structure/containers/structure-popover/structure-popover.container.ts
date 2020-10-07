import {Component, EventEmitter, Input,OnInit, Output, ViewEncapsulation} from '@angular/core';
import { StructurePopoverDTO, StructurePortfolioBreakdownRowDTO } from 'Core/models/frontend/frontend-models.interface';
import { BICsDataProcessingService } from 'Core/services/BICsDataProcessingService';

@Component({
  selector: 'structure-popover',
  templateUrl: './structure-popover.container.html',
  styleUrls: ['./structure-popover.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructurePopover implements OnInit {
  @Input() popover: StructurePopoverDTO
  constructor(
  private bicsDataProcessingService: BICsDataProcessingService
  ) {}
  public ngOnInit() {};

  public getNextBicsLevel(breakdownRow: StructurePortfolioBreakdownRowDTO) {
    if (breakdownRow.state.isBicsLevel1) {
      this.closePopover();
    } else if (breakdownRow.data.children) {
      breakdownRow.state.isSelected = !breakdownRow.state.isSelected;
    } else {
      const subBicsLevel = this.bicsDataProcessingService.formSubLevelBreakdown(breakdownRow, this.popover.state.isDisplayCs01);
      breakdownRow.data.children = subBicsLevel;
      breakdownRow.state.isSelected = true;
    }
  }

  public closePopover() {
    this.popover.state.isActive = false;
    this.popover.data.mainRow.state.isSelected = false;
  }

}