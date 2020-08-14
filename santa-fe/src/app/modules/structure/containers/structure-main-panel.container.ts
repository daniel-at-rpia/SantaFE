import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DTOService } from 'Core/services/DTOService';
import { StructureMainPanelState } from 'FEModels/frontend-page-states.interface';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ownerInitials } from 'Core/selectors/core.selectors';
import { PortfolioMetricValues, PortfolioShortNames } from 'Core/constants/structureConstants.constants';

@Component({
    selector: 'structure-main-panel',
    templateUrl: './structure-main-panel.container.html', 
    styleUrls: ['./structure-main-panel.container.scss'],
    encapsulation: ViewEncapsulation.Emulated
})

export class StructureMainPanel implements OnInit, OnDestroy {
  state: StructureMainPanelState; 
  selectedMetricValue: PortfolioMetricValues = PortfolioMetricValues.CSO1;
  subscriptions = {
    ownerInitialsSub: null
  };
  constants = {
    portfolioMetricValues: PortfolioMetricValues,
    portfolioShortNames: PortfolioShortNames
  };
  portfolioList: PortfolioShortNames[] = [this.constants.portfolioShortNames.SOF, this.constants.portfolioShortNames.DOF, this.constants.portfolioShortNames.AGB, this.constants.portfolioShortNames.STIP, this.constants.portfolioShortNames.CIP, this.constants.portfolioShortNames.BBB, this.constants.portfolioShortNames.FIP]
  private initializePageState(): StructureMainPanelState { 
    const state: StructureMainPanelState = {
        ownerInitial: null,
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
  constructor(
    private dtoService: DTOService,
    private store$: Store<any>
    ) {
    this.state = this.initializePageState();
  }
  public ngOnInit() {
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      select(ownerInitials)
    ).subscribe((value) => {
      this.state.ownerInitial = value;
    });
    this.loadInitialFunds();
    this.fetchFunds();
  };
  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(eachItem)) {
        const eachSub = this.subscriptions[eachItem] as Subscription;
        eachSub.unsubscribe();
      }
    }
  }
  private loadInitialFunds() {
    this.portfolioList.forEach(portfolio => {
      const fund = this.dtoService.formStructureFund(portfolio);
      this.state.fetchResult.fundList.push(fund);
    })
  }
  private fetchFunds() {
    this.state.fetchResult.fundList.forEach(fund => {
      fund.state.isStencil = true;
    })
  }
}