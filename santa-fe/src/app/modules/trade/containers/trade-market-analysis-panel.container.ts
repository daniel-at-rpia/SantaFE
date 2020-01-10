  // dependencies
    import {
      Component,
      ViewEncapsulation,
      OnInit,
      OnDestroy
    } from '@angular/core';
    import {
      Observable,
      Subscription,
      of
    } from 'rxjs';
    import {
      tap,
      first,
      catchError
    } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import {
      SecurityDTO,
      MoveVisualizerDTO,
      SecurityDefinitionDTO
    } from 'FEModels/frontend-models.interface';
    import { TradeMarketAnalysisPanelState } from 'FEModels/frontend-page-states.interface';
    import { PayloadGetSecurityGroupBasedOnSecurity } from 'BEModels/backend-payloads.interface';
    import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';
    import {
      MARKET_ANALYSIS_SPREAD_METRIC_KEY,
      MARKET_ANALYSIS_YIELD_METRIC_KEY
    } from 'Core/constants/tradeConstants.constant';
    import {
      selectSelectedSecurityForAnalysis
    } from 'Trade/selectors/trade.selectors';
    import { HistoricalSummarySampleReturn } from 'Trade/stubs/lilMarket.stub';
  //

@Component({
  selector: 'trade-market-analysis-panel',
  templateUrl: './trade-market-analysis-panel.container.html',
  styleUrls: ['./trade-market-analysis-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeMarketAnalysisPanel implements OnInit, OnDestroy {
  state: TradeMarketAnalysisPanelState;
  subscriptions = {
    receiveSelectedSecuritySub: null
  }
  constants = {
    securityDefinitionMap: SecurityDefinitionMap,
    spreadMetricKey: MARKET_ANALYSIS_SPREAD_METRIC_KEY,
    yieldMetricKey: MARKET_ANALYSIS_YIELD_METRIC_KEY
  };

  test1: MoveVisualizerDTO;
  test2: MoveVisualizerDTO;

  constructor(
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ){
    this.state = {
      receivedSecurity: false,
      moveVisualizer: {
        groupByOptions: [],
        dto: this.dtoService.formMoveVisualizerObject(true),
        targetSecurity: null
      },
      table: {
        securityList: []
      }
    }
    this.populateDefinitionOptions();
    this.state.moveVisualizer.groupByOptions[0].state.groupByActive = true;
    this.test1 = this.dtoService.formMoveVisualizerObject(false, HistoricalSummarySampleReturn.Mom.BaseSecurity.historicalLevel);
    this.test2 = this.dtoService.formMoveVisualizerObject(false, HistoricalSummarySampleReturn.Mom.Group.historicalLevel);
  }

  public onTest(event) {
    console.log('mouse move', event);
  }

  public ngOnInit() {
    this.subscriptions.receiveSelectedSecuritySub = this.store$.pipe(
      select(selectSelectedSecurityForAnalysis)
    ).subscribe((targetSecurity) => {
      !!targetSecurity && this.onSecuritySelected(targetSecurity);
    });
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }

  public onClickGroupByOption(targetOption: SecurityDefinitionDTO){
    targetOption.state.groupByActive = !targetOption.state.groupByActive;
    const activeOptions = this.state.moveVisualizer.groupByOptions.filter((eachOption) => {
      return eachOption.state.groupByActive;
    })
    if (activeOptions.length > 0) {
      this.fetchGroupData();
    }
  }

  private onSecuritySelected(targetSecurity: SecurityDTO) {
    this.state.receivedSecurity = true;
    this.state.moveVisualizer.targetSecurity = this.utilityService.deepCopy(targetSecurity);
    this.state.moveVisualizer.dto = this.dtoService.formMoveVisualizerObject(true);
    this.fetchGroupData();
  }

  private populateDefinitionOptions() {
    const options = [];
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.CURRENCY));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.RATING_BUCKET));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.SECTOR));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.SENIORITY));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.TENOR));
    this.state.moveVisualizer.groupByOptions = options;
  }

  private fetchGroupData() {
    if (this.state.receivedSecurity) {
      const payload : PayloadGetSecurityGroupBasedOnSecurity = {
        source: "Default",
        identifier: this.state.moveVisualizer.targetSecurity.data.securityID,
        groupIdentifier: {},
        tenorOptions: ["2Y", "3Y", "5Y", "7Y", "10Y", "30Y"]
      }
      this.state.moveVisualizer.groupByOptions.forEach((eachOption) => {
        if (eachOption.state.groupByActive) {
          const backendKey = this.utilityService.convertFEKey(eachOption.data.key);
          payload.groupIdentifier[backendKey] = [];
        }
      });
      payload.groupIdentifier['SecurityType'] = [];
      payload.groupIdentifier['CouponType'] = [];
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getGroupFromSecurity, {req: 'POST'}, payload).pipe(
        first(),
        tap((serverReturn) => {

        }),
        catchError(err => {
          console.error('error', err);
          return of('error');
        })
      ).subscribe();
    }
  }

}