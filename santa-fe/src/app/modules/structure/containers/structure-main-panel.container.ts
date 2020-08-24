import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DTOService } from 'Core/services/DTOService';
import { StructureMainPanelState } from 'FEModels/frontend-page-states.interface';
import { Store, select } from '@ngrx/store';
import { selectMetricLevel } from 'Structure/selectors/structure.selectors';
import { StructureMetricSelect } from 'Structure/actions/structure.actions';
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
    ownerInitialsSub: null,
    selectedMetricLevelSub: null
  };
  portfolioList: PortfolioShortNames[] = [PortfolioShortNames.SOF, PortfolioShortNames.DOF, PortfolioShortNames.AGB, PortfolioShortNames.STIP, PortfolioShortNames.CIP, PortfolioShortNames.BBB, PortfolioShortNames.FIP]
  constants = {
    cs01: PortfolioMetricValues.CSO1,
    leverage: PortfolioMetricValues.Leverage
  };

  private initializePageState(): StructureMainPanelState { 
    const state: StructureMainPanelState = {
        ownerInitial: null,
        isUserPM: false,
        selectedMetricValue: null,
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
    this.subscriptions.selectedMetricLevelSub = this.store$.pipe(
      select(selectMetricLevel)
    ).subscribe((value) => {
      const metric = value === this.constants.cs01 ? this.constants.cs01 : this.constants.leverage
      this.state.selectedMetricValue = metric;
    });
    this.loadInitialFunds();
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
}