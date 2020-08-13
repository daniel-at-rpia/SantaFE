import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { DTOService } from 'Core/services/DTOService';
import { StructureMainPanelState } from 'FEModels/frontend-page-states.interface';

import { PortfolioMetricValues} from 'Core/constants/structureConstants.constants';


@Component({
    selector: 'structure-main-panel',
    templateUrl: './structure-main-panel.container.html', 
    styleUrls: ['./structure-main-panel.container.scss'],
    encapsulation: ViewEncapsulation.Emulated
})

export class StructureMainPanel implements OnInit {
  state: StructureMainPanelState; 
  selectedMetricValue: PortfolioMetricValues = PortfolioMetricValues.CSO1;
  constants = {
    portfolioMetricValues: PortfolioMetricValues
  };

  private initializePageState(): StructureMainPanelState { 
    const state: StructureMainPanelState = {
        isUserPM: false,
        selectedMetricValue: this.constants.portfolioMetricValues.CSO1,
        fetchResult: {
          fundList: [],
          fetchFundDataFailed: false,
          fetchFundDataFailedError: ''
        }
    }
    return state; 
  }
  
  constructor(private dtoService: DTOService) {
    this.state = this.initializePageState();
  }

  public ngOnInit() {}; 
}