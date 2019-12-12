    import {
      Component,
      ViewEncapsulation
    } from '@angular/core';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import {
      QuantitativeVisualizerDTO
    } from 'FEModels/frontend-models.interface';

@Component({
  selector: 'trade-market-analysis-panel',
  templateUrl: './trade-market-analysis-panel.container.html',
  styleUrls: ['./trade-market-analysis-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeMarketAnalysisPanel {
  testData: QuantitativeVisualizerDTO;

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ){
    this.testData = this.dtoService.formQuantVisualizerObject(1, 1, 123, 145, -32, -45, 309, 210);
  }

}