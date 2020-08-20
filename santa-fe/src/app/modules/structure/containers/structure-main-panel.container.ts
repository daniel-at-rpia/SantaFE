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
import { BreakdownSampleStructureBlock } from 'Structure/stubs/structure.stub';


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
    private store$: Store<any>,
    private restfulCommService: RestfulCommService,
    private utilityService: UtilityService
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
      const fund = this.dtoService.formStructureFundObject(BreakdownSampleStructureBlock);
      fund.state.isStencil = true;
      fund.data.portfolioShortName = portfolio;
      this.state.fetchResult.fundList.push(fund);
    })
  }
  private fetchFunds() {
    const currentDate = new Date();
    const currentDateFormat = 'YYYYMMDD';
    const formattedDate = moment(currentDate).format(currentDateFormat);
    const payload = {
      date: formattedDate
    }
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getPortfolioStructures, { req: 'POST' }, payload, false, false).pipe(
      first(),
      tap((serverReturn) => {
        this.state.fetchResult.fundList = [];
        serverReturn.forEach(fund => {
          const newFund = this.dtoService.formStructureFundObject(fund);
          const fundKeys = Object.keys(fund);
          fundKeys.forEach(key => {
            if (key.indexOf('Breakdown') >= 0) {
              if (key === 'bicsLevel2Breakdown' || key === 'bicsLevel3Breakdown') {
                if (newFund.data.children.length > 0) {
                  const existingBICsBreakdown = newFund.data.children.find(breakdown => breakdown.data.groupOption === 'bics');
                  const breakdownIndex = newFund.data.children.indexOf(existingBICsBreakdown);
                  if (key === 'bicsLevel2Breakdown') {
                    newFund.data.children[breakdownIndex].data.breakdownLevel2 = fund[key].breakdown;
                    return;
                  }
                  newFund.data.children[breakdownIndex].data.breakdownLevel3 = fund[key].breakdown;
                  return;
                }
              }
              const eachBreakdown = this.dtoService.formStructureBreakdownObject(fund[key]);
              newFund.data.children.push(eachBreakdown);
            }
          })
          newFund.state.isStencil = false;
          this.state.fetchResult.fundList.push(newFund);
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
}