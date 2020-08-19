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
  subscriptions = {
    ownerInitialsSub: null
  };
  portfolioList: PortfolioShortNames[] = [PortfolioShortNames.SOF, PortfolioShortNames.DOF, PortfolioShortNames.AGB, PortfolioShortNames.STIP, PortfolioShortNames.CIP, PortfolioShortNames.BBB, PortfolioShortNames.FIP]
  constants = {
    portfolioMetricValues: PortfolioMetricValues
  };

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
    this.loadStencilFunds();
    const fakeAsyncLoadData = this.loadInitialFunds.bind(this);
    setTimeout(() => {
      fakeAsyncLoadData();
    }, 3000);
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
    this.state.fetchResult.fundList = this.portfolioList.map(portfolio => {
      const eachFund = this.dtoService.formStructureFund(portfolio, false);
      return eachFund;
    })
  }

  private loadStencilFunds() {
    this.state.fetchResult.fundList = this.portfolioList.map((eachPortfolioName) => {
      const eachFund = this.dtoService.formStructureFund(eachPortfolioName, true);
      return eachFund;
    });
  }
}