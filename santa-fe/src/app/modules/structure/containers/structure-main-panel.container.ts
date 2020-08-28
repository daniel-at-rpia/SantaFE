import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DTOService } from 'Core/services/DTOService';
import { StructureMainPanelState } from 'FEModels/frontend-page-states.interface';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ownerInitials } from 'Core/selectors/core.selectors';
import {
  PortfolioMetricValues,
  PortfolioShortNames,
  STRUCTURE_EDIT_MODAL_ID
} from 'Core/constants/structureConstants.constants';
import { PortfolioStructuringSample } from 'Structure/stubs/structure.stub';

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
    portfolioShortNames: PortfolioShortNames,
    editModalId: STRUCTURE_EDIT_MODAL_ID
  };
  portfolioList: PortfolioShortNames[] = [this.constants.portfolioShortNames.SOF, this.constants.portfolioShortNames.DOF, this.constants.portfolioShortNames.AGB, this.constants.portfolioShortNames.STIP, this.constants.portfolioShortNames.CIP, this.constants.portfolioShortNames.BBB, this.constants.portfolioShortNames.FIP];
  
  constructor(
    private dtoService: DTOService,
    private store$: Store<any>
    ) {
    this.state = this.initializePageState();
  }
  
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
  
  public ngOnInit() {
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      select(ownerInitials)
    ).subscribe((value) => {
      this.state.ownerInitial = value;
    });
    const initialWaitForIcons = this.loadStencilFunds.bind(this
      );
    setTimeout(() => {
      initialWaitForIcons();
    }, 200);
    const fakeAsyncLoadData = this.loadInitialFunds.bind(this);
    setTimeout(() => {
      fakeAsyncLoadData();
    }, 2000);
  }

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
      const eachFund = this.dtoService.formStructureFundObject(PortfolioStructuringSample, false);
      eachFund.data.portfolioShortName = portfolio;
      this.state.fetchResult.fundList.forEach((eachPortfolio) => {
        if (eachPortfolio.data.portfolioShortName === portfolio) {
          eachPortfolio.data.children = eachFund.data.children;
        }
      });
    });
    const flipStencil = this.loadFundsData.bind(this);
    setTimeout(() => {
      flipStencil();
    }, 1);
  }

  private loadStencilFunds() {
    this.state.fetchResult.fundList = this.portfolioList.map((eachPortfolioName) => {
      const eachFund = this.dtoService.formStructureFundObject(PortfolioStructuringSample, true);
      eachFund.data.portfolioShortName = eachPortfolioName;
      return eachFund;
    });
  }

  private loadFundsData() {
    this.state.fetchResult.fundList.forEach((eachFund) => {
      eachFund.state.isStencil = false;
      eachFund.data.children.forEach((eachChild) => {
        eachChild.state.isStencil = false;
        eachChild.data.categoryList.forEach((eachCategory) => {
          eachCategory.moveVisualizer.state.isStencil = false;
        })
      })
    })
  }
}