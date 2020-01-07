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
      QuantitativeVisualizerDTO,
      SecurityDefinitionDTO
    } from 'FEModels/frontend-models.interface';
    import { TradeMarketAnalysisPanelState } from 'FEModels/frontend-page-states.interface';
    import { PayloadGetSecurityGroupBasedOnSecurity } from 'BEModels/backend-payloads.interface';
    import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';
    import {
      MARKET_ANALYSIS_SPREAD_METRIC_KEY,
      MARKET_ANALYSIS_YIELD_METRIC_KEY
    } from 'Core/constants/tradeConstants.constant';
    import { QuantVisualizerParams } from 'FEModels/frontend-adhoc-packages.interface';
    import {
      selectSelectedSecurityForAnalysis
    } from 'Trade/selectors/trade.selectors';

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

  constructor(
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ){
    this.state = {
      receivedSecurity: false,
      quantVisualizer: {
        groupByOptions: [],
        dto: this.dtoService.formQuantVisualizerObject(true, null),
        targetSecurity: null
      },
      table: {
        securityList: []
      }
    }
    this.populateDefinitionOptions();
    this.state.quantVisualizer.groupByOptions[0].state.groupByActive = true;
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
    const activeOptions = this.state.quantVisualizer.groupByOptions.filter((eachOption) => {
      return eachOption.state.groupByActive;
    })
    if (activeOptions.length > 0) {
      this.fetchGroupData();
    }
  }

  private onSecuritySelected(targetSecurity: SecurityDTO) {
    this.state.receivedSecurity = true;
    this.state.quantVisualizer.targetSecurity = this.utilityService.deepCopy(targetSecurity);
    this.state.quantVisualizer.dto = this.dtoService.formQuantVisualizerObject(true, null);
    this.fetchGroupData();
  }

  private populateDefinitionOptions() {
    const options = [];
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.CURRENCY));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.RATING_BUCKET));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.SECTOR));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.SENIORITY));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.TENOR));
    this.state.quantVisualizer.groupByOptions = options;
  }

  private fetchGroupData() {
    if (this.state.receivedSecurity) {
      const payload : PayloadGetSecurityGroupBasedOnSecurity = {
        source: "Default",
        identifier: this.state.quantVisualizer.targetSecurity.data.securityID,
        groupIdentifier: {},
        tenorOptions: ["2Y", "3Y", "5Y", "7Y", "10Y", "30Y"]
      }
      this.state.quantVisualizer.groupByOptions.forEach((eachOption) => {
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
          this.populateVisualizer(serverReturn);
          this.testPopulateTableWithSamples();
        }),
        catchError(err => {
          console.error('error', err);
          return of('error');
        })
      ).subscribe();
    }
  }

  private populateVisualizer(serverReturn) {
    const groupDTO = this.dtoService.formSecurityGroupObject(serverReturn);
    const securityMetricPack = this.state.quantVisualizer.targetSecurity.data.metricPack;
    const params: QuantVisualizerParams = {
      tRaw: securityMetricPack.raw[this.constants.spreadMetricKey],
      gRaw: groupDTO.data.metricPack.raw[this.constants.spreadMetricKey],
      tWow: securityMetricPack.delta.Wow[this.constants.spreadMetricKey],
      gWow: groupDTO.data.metricPack.delta.Wow[this.constants.spreadMetricKey],
      tMom: securityMetricPack.delta.Mom[this.constants.spreadMetricKey],
      gMom: groupDTO.data.metricPack.delta.Mom[this.constants.spreadMetricKey],
      tYtd: securityMetricPack.delta.Ytd[this.constants.spreadMetricKey],
      gYtd: groupDTO.data.metricPack.delta.Ytd[this.constants.spreadMetricKey]
    }
    this.state.quantVisualizer.dto = this.dtoService.formQuantVisualizerObject(false, params);
  }

  private testPopulateTableWithSamples() {
    this.state.quantVisualizer.targetSecurity.state.isTableExpanded = false;
    const newSecurity1 = this.utilityService.deepCopy(this.state.quantVisualizer.targetSecurity);
    const newSecurity2 = this.utilityService.deepCopy(this.state.quantVisualizer.targetSecurity);
    const newSecurity3 = this.utilityService.deepCopy(this.state.quantVisualizer.targetSecurity);
    this.state.table.securityList = [newSecurity1, newSecurity2, newSecurity3];
  }
}