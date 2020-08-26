import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DTOService } from 'Core/services/DTOService';
import { StructureMainPanelState } from 'FEModels/frontend-page-states.interface';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ownerInitials } from 'Core/selectors/core.selectors';
import { PortfolioMetricValues, PortfolioShortNames } from 'Core/constants/structureConstants.constants';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { of  } from 'rxjs';
import { catchError, first, tap} from 'rxjs/operators';
import { UtilityService } from 'Core/services/UtilityService';
import * as moment from 'moment';
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
    portfolioShortNames: PortfolioShortNames
  };
  portfolioList: PortfolioShortNames[] = [this.constants.portfolioShortNames.SOF, this.constants.portfolioShortNames.DOF, this.constants.portfolioShortNames.AGB, this.constants.portfolioShortNames.STIP, this.constants.portfolioShortNames.CIP, this.constants.portfolioShortNames.BBB, this.constants.portfolioShortNames.FIP];
  
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
    this.fetchFunds();
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
      eachFund.api.convertToK = this.convertValuesToK.bind(this);
      this.state.fetchResult.fundList.forEach((eachPortfolio) => {
        if (eachPortfolio.data.portfolioShortName === portfolio) {
          eachPortfolio.data.children = eachFund.data.children;
        }
      });
    });
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

  private resetAPIErrors() {
    this.state.fetchResult.fetchFundDataFailed = false;
    this.state.fetchResult.fetchFundDataFailedError = '';
  }

  private fetchFunds() {
    const currentDate = new Date();
    const currentDateFormat = 'YYYYMMDD';
    const formattedDate = moment(currentDate).format(currentDateFormat);
    const payload = {
      date: formattedDate
    }
    this.state.fetchResult.fetchFundDataFailed && this.resetAPIErrors();
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getPortfolioStructures, { req: 'POST' }, payload, false, false).pipe(
      first(),
      tap((serverReturn) => {
        this.state.fetchResult.fundList = [];
        serverReturn.forEach(eachFund => {
          const newFund = this.dtoService.formStructureFundObject(eachFund, false);
          newFund.api.convertToK = this.convertValuesToK;
          this.state.fetchResult.fundList.push(newFund);
          const flipStencil = this.loadFundsData.bind(this);
          setTimeout(() => {
            flipStencil();
          }, 1);
        })
      }),
      catchError(err => {
        this.state.fetchResult.fetchFundDataFailed = true;
        this.state.fetchResult.fetchFundDataFailedError = err.message;
        this.restfulCommService.logError('Get portfolio funds failed')
        console.error(`${this.restfulCommService.apiMap.getPortfolioStructures} failed`, err);
        return of('error')
      })
    ).subscribe()
  }

  private convertValuesToK(value: number) {
    return value / 1000;
  }
 }