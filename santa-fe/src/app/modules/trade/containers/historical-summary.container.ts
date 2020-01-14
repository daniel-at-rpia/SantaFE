  // dependencies
    import {
      Component,
      ViewEncapsulation,
      Input
    } from '@angular/core';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import {
      SecurityDTO,
      MoveVisualizerDTO,
      HistoricalSummaryDTO
    } from 'FEModels/frontend-models.interface';
    import { HISTORICAL_SUMMARY_CURSOR_OFFSET } from 'Core/constants/tradeConstants.constant';
  //

@Component({
  selector: 'historical-summary',
  templateUrl: './historical-summary.container.html',
  styleUrls: ['./historical-summary.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class HistoricalSummary {
  @Input() summaryData: HistoricalSummaryDTO;
  subscriptions = {
  }
  constants = {
  };

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ){

  }

  public hoveringSummary(event) {
    // console.log('mouse move', event.offsetX, event);
    this.summaryData.style.rulerPosition = event.offsetX - HISTORICAL_SUMMARY_CURSOR_OFFSET;

  }

}