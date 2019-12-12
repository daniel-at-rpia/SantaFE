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
    import { TradeMarketAnalysisPanelState } from 'FEModels/frontend-page-states.interface';

@Component({
  selector: 'trade-market-analysis-panel',
  templateUrl: './trade-market-analysis-panel.container.html',
  styleUrls: ['./trade-market-analysis-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeMarketAnalysisPanel {
  state: TradeMarketAnalysisPanelState;
  testData: QuantitativeVisualizerDTO;

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ){
    this.state = {
      quantVisualizer: {
        groupByOptions: ['Currency'],
        dto: this.dtoService.formQuantVisualizerObject(1, 1, 123, 145, -32, -45, 309, 210)
      }
    }
  }

  public onClickGroupByOption(targetOption: string){
    if (this.state.quantVisualizer.groupByOptions.indexOf(targetOption) >= 0) {
      this.state.quantVisualizer.groupByOptions = this.state.quantVisualizer.groupByOptions.filter((eachOption) => {
        return eachOption !== targetOption;
      })
    } else {
      this.state.quantVisualizer.groupByOptions.push(targetOption);
    }
  }

}