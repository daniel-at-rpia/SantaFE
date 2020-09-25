import {Component, Input,OnInit, ViewEncapsulation} from '@angular/core';
import { StructurePopoverDTO, StructurePortfolioBreakdownRowDTO } from 'Core/models/frontend/frontend-models.interface';
import { BICsDataProcessingService } from 'Structure/services/BICsDataProcessingService';

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

  public getNextBicsLevel(breakdownRow: StructurePortfolioBreakdownRowDTO ) {
    const subBicsLevel = this.bicsDataProcessingService.formSubTierBreakdown(breakdownRow);
    breakdownRow.data.children = subBicsLevel;
    breakdownRow.state.isSelected = !breakdownRow.state.isSelected;
  }

  private closePopover() {
    this.popover.state.isActive = false;
    this.popover.data.mainRow.state.isSelected = false;
  }

}