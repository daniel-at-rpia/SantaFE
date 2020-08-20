import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DTOService } from 'Core/services/DTOService';
import { StructureMainPanelState } from 'FEModels/frontend-page-states.interface';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ownerInitials } from 'Core/selectors/core.selectors';
import { PortfolioMetricValues, PortfolioShortNames } from 'Core/constants/structureConstants.constants';
import { PortfolioStructureDTO } from 'Core/models/frontend/frontend-models.interface';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { catchError, first, tap } from 'rxjs/operators';
import { UtilityService } from 'Core/services/UtilityService';
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
      this.state.fetchResult.fundList.push(fund);
    })
  }
  private getFundFromNewTargets(fund: PortfolioStructureDTO) {
    const payload = fund;
    const fundListCopy = this.utilityService.deepCopy(this.state.fetchResult.fundList);
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getFundWithUpdatedMetric, {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn) => {
        if (serverReturn) {
          const updatedFund = this.dtoService.formStructureFundObject(serverReturn);
          this.state.fetchResult.fundList = [];
          this.state.fetchResult.fundList = fundListCopy.map(fund => {
            return fund.data.portfolioId === updatedFund.data.portfolioId ? updatedFund : fund;
          })
        } else {
          this.restfulCommService.logError(`Cannot receive updated target and leverage value`)
        }
      })
    ).subscribe()
  }
}