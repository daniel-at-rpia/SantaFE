import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { DTOService } from 'Core/services/DTOService';
import { StructureMainPanelState } from 'FEModels/frontend-page-states.interface';

import { PortfolioMetricValues, PortfolioShortNames } from 'Core/constants/structureConstants.constants';


@Component({
    selector: 'structure-main-panel',
    templateUrl: './structure-main-panel.container.html', 
    styleUrls: ['./structure-main-panel.container.scss'],
    encapsulation: ViewEncapsulation.Emulated
})

export class StructureMainPanel implements OnInit {
  state: StructureMainPanelState;
  portfolioList: PortfolioShortNames[] = [PortfolioShortNames.SOF, PortfolioShortNames.DOF, PortfolioShortNames.AGB, PortfolioShortNames.STIP, PortfolioShortNames.CIP, PortfolioShortNames.BBB, PortfolioShortNames.FIP]
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

  public ngOnInit() {
    this.loadInitialFunds();
  };

  private loadInitialFunds() {
    this.portfolioList.forEach(portfolio => {
      const portfolioData = {
        portfolioShortName: portfolio
      }
      const fund = this.dtoService.formStructureFund(portfolioData);
      this.state.fetchResult.fundList.push(fund);
    })
  }

}