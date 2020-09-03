import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DTOService } from 'Core/services/DTOService';
import { StructureMainPanelState } from 'FEModels/frontend-page-states.interface';
import { Store, select } from '@ngrx/store';
import { selectMetricLevel } from 'Structure/selectors/structure.selectors';
import { Subscription, of } from 'rxjs';
import { StructureMetricSelect } from 'Structure/actions/structure.actions';
import { ownerInitials } from 'Core/selectors/core.selectors';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { catchError, first, tap} from 'rxjs/operators';
import { UtilityService } from 'Core/services/UtilityService';
import * as moment from 'moment';
import {
  PortfolioMetricValues,
  PortfolioShortNames,
  STRUCTURE_EDIT_MODAL_ID
} from 'Core/constants/structureConstants.constants';
import { PortfolioStructuringSample } from 'Structure/stubs/structure.stub';
import { PortfolioStructureDTO, TargetBarDTO } from 'Core/models/frontend/frontend-models.interface';
import { BEPortfolioStructuringDTO } from 'App/modules/core/models/backend/backend-models.interface';
import { CoreSendNewAlerts } from 'Core/actions/core.actions';

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
  constants = {
    cs01: PortfolioMetricValues.cs01,
    creditLeverage: PortfolioMetricValues.creditLeverage,
    portfolioShortNames: PortfolioShortNames,
    editModalId: STRUCTURE_EDIT_MODAL_ID
  };
  portfolioList: Array<PortfolioShortNames> = [this.constants.portfolioShortNames.FIP, this.constants.portfolioShortNames.BBB, this.constants.portfolioShortNames.CIP, this.constants.portfolioShortNames.STIP, this.constants.portfolioShortNames.AGB, this.constants.portfolioShortNames.DOF, this.constants.portfolioShortNames.SOF];
  
  constructor(
    private dtoService: DTOService,
    private store$: Store<any>,
    private restfulCommService: RestfulCommService,
    private utilityService: UtilityService
    ) {
    this.state = this.initializePageState();
  }
  
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
  
  public ngOnInit() {
    this.state = this.initializePageState();
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      select(ownerInitials)
    ).subscribe((value) => {
      this.state.ownerInitial = value;
      this.state.fetchResult.fundList.forEach(fund => {
        fund.state.isEditing = this.state.ownerInitial === 'DM';
      })
    });
    this.subscriptions.selectedMetricLevelSub = this.store$.pipe(
      select(selectMetricLevel)
    ).subscribe((value) => {
      const metric = value === this.constants.cs01 ? this.constants.cs01 : this.constants.creditLeverage
      this.state.selectedMetricValue = metric;
      this.state.fetchResult.fundList.forEach(fund => {
        fund.state.isStencil = true; 
        //Switch active and inactive target bars
        fund.data.creditLeverageTargetBar.state.isInactiveMetric = this.state.selectedMetricValue === this.constants.cs01;
        fund.data.cs01TargetBar.state.isInactiveMetric = this.state.selectedMetricValue === this.constants.creditLeverage;
        //Switch values to be displayed in breakdowns
        fund.data.children.forEach(breakdown => {
          breakdown.state.isDisplayingCs01 = this.state.selectedMetricValue === this.constants.cs01;
          breakdown.state.isStencil = true;
          const targetList  = breakdown.state.isDisplayingCs01 ? breakdown.data.rawCs01CategoryList : breakdown.data.rawLeverageCategoryList;
          targetList.forEach(target => {
            target.moveVisualizer.state.isStencil = true;
          })
        })

        setTimeout(() => {
          fund.state.isStencil = false;
        }, 500)
      })
    });
    const initialWaitForIcons = this.loadStencilFunds.bind(this);
    setTimeout(() => {
      initialWaitForIcons();
    }, 200);
    const loadData = this.fetchFunds.bind(this);
    setTimeout(() => {
      loadData();
    }, 500);
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(eachItem)) {
        const eachSub = this.subscriptions[eachItem] as Subscription;
        eachSub.unsubscribe();
      }
    }
  }

  private loadStencilFunds() {
    this.state.fetchResult.fundList = this.portfolioList.map((eachPortfolioName) => {
      const eachFund = this.dtoService.formStructureFundObject(PortfolioStructuringSample, true);
      eachFund.data.portfolioShortName = eachPortfolioName;
      return eachFund;
    });
  }

  private getFundFromNewTargets(fund: PortfolioStructureDTO) {
    const payload = {
      portfolioStructure: fund.data.originalBEData
    }
    fund.state.isStencil = true;
    fund.data.cs01TargetBar.state.isStencil = true;
    fund.data.creditLeverageTargetBar.state.isStencil = true;
    fund.data.children.forEach(breakdown => {
      breakdown.state.isStencil = true;
      breakdown.data.displayCategoryList.forEach(category => {
        category.moveVisualizer.state.isStencil = true;
      })
    })
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.updatePortfolioStructures, {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn) => {
        const updatedFund = this.dtoService.formStructureFundObject(serverReturn, false);
        updatedFund.data.cs01TotalsInK.currentTotal = updatedFund.data.currentTotals.cs01 / 1000; //this is used in the set funds input fields, which are numbers - parseNumberToThousands() returns a string
        updatedFund.data.cs01TargetBar.data.displayedCurrentValue = this.utilityService.parseNumberToThousands(updatedFund.data.currentTotals.cs01, true);
        updatedFund.data.cs01TargetBar.data.displayedTargetValue = this.utilityService.parseNumberToThousands(updatedFund.data.target.target.cs01, true);
        const selectedFund = this.state.fetchResult.fundList.find(fund => fund.data.portfolioId === updatedFund.data.portfolioId);
        const selectedFundIndex = this.state.fetchResult.fundList.indexOf(selectedFund);
        this.state.fetchResult.fundList[selectedFundIndex] = updatedFund;
        const alert = this.dtoService.formSystemAlertObject('Structuring', 'Updated', `Successfully updated ${updatedFund.data.portfolioShortName} target CS01 level as ${updatedFund.data.cs01TargetBar.data.displayedTargetValue} and Credit Leverage level as ${updatedFund.data.creditLeverageTargetBar.data.displayedTargetValue}`, null);
        this.store$.dispatch(new CoreSendNewAlerts([alert]));
      
      }),
      catchError(err => {
        const alert = this.dtoService.formSystemAlertObject('Structuring', 'ERROR', `Unable to update ${fund.data.portfolioShortName} target levels`, null);
        alert.state.isError = true;
        this.store$.dispatch(new CoreSendNewAlerts([alert]));
        fund.state.isStencil = false;
        fund.data.cs01TargetBar.state.isStencil = false;
        fund.data.creditLeverageTargetBar.state.isStencil = false;
        fund.data.children.forEach(breakdown => {
          breakdown.state.isStencil = false;
          breakdown.data.displayCategoryList.forEach(category => {
            category.moveVisualizer.state.isStencil = false;
          })
        })
        this.restfulCommService.logError('Cannot retrieve fund with updated targets');
        return of('error');
      })
    ).subscribe()
  }

  private resetAPIErrors() {
    this.state.fetchResult.fetchFundDataFailed = false;
    this.state.fetchResult.fetchFundDataFailedError = '';
  }

  private sortFunds(funds: Array<PortfolioStructureDTO>) {
    funds.sort((fundA, fundB) => {
      const fundAShortName = fundA.data.portfolioShortName;
      const fundBShortName = fundB.data.portfolioShortName;
      return this.portfolioList.indexOf(fundAShortName) - this.portfolioList.indexOf(fundBShortName);
    })
  }

  private setEmptyTargetBar(targetBar: TargetBarDTO) {
    targetBar.state.isDataUnavailable = true;
    targetBar.state.isStencil = false;
    targetBar.data.displayedResults = '-';
  }

  private fetchFunds() {
    this.loadStencilFunds();
    const payload = { // assumes current date if nothing is passed in
      yyyyMMDD: ""
    }
    this.state.fetchResult.fetchFundDataFailed && this.resetAPIErrors();
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getPortfolioStructures, { req: 'POST' }, payload, false, false).pipe(
      first(),
      tap((serverReturn: Array<BEPortfolioStructuringDTO>) => {
        this.state.fetchResult.fundList = [];
        serverReturn.forEach(eachFund => {
          const newFund = this.dtoService.formStructureFundObject(eachFund, false);
          this.state.fetchResult.fundList.push(newFund);
        })
        this.state.fetchResult.fundList.length > 1 && this.sortFunds(this.state.fetchResult.fundList);
      }),
      catchError(err => {
        setTimeout(() => {
          this.state.fetchResult.fetchFundDataFailed = true;
          this.state.fetchResult.fetchFundDataFailedError = err.message;
          this.state.fetchResult.fundList.forEach(eachFund => {
            eachFund.state.isDataUnavailable = this.state.fetchResult.fetchFundDataFailed;
            this.setEmptyTargetBar(eachFund.data.creditLeverageTargetBar);
            this.setEmptyTargetBar(eachFund.data.cs01TargetBar);
          })
        }, 500);
        this.restfulCommService.logError('Get portfolio funds failed')
        console.error(`${this.restfulCommService.apiMap.getPortfolioStructures} failed`, err);
        return of('error')
      })
    ).subscribe()
  }
}
