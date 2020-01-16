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
    import { BEHistoricalSummaryDTO } from 'BEModels/backend-models.interface';
    import { PayloadGetGroupHistoricalSummary } from 'BEModels/backend-payloads.interface';
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

  constructor(
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ){
    this.state = {
      receivedSecurity: false,
      targetSecurity: null,
      config: {
        groupByOptions: [],
      },
      table: {
        presentList: [],
        prinstineTopSecurityList: [],
        prinstineBottomSecurityList: [],
        levelSummary: null,
        basisSummary: null
      }
    }
    this.populateDefinitionOptions();
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
    const activeOptions = this.state.config.groupByOptions.filter((eachOption) => {
      return eachOption.state.groupByActive;
    })
    if (activeOptions.length > 0) {
      this.fetchGroupData();
    }
  }

  private onSecuritySelected(targetSecurity: SecurityDTO) {
    this.state.receivedSecurity = true;
    this.state.targetSecurity = this.utilityService.deepCopy(targetSecurity);
    this.fetchGroupData();
  }

  private populateDefinitionOptions() {
    const options = [];
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.CURRENCY));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.RATING_BUCKET));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.SECTOR));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.SENIORITY));
    options.push(this.dtoService.formSecurityDefinitionObject(this.constants.securityDefinitionMap.TENOR));
    this.state.config.groupByOptions = options;
  }

  private fetchGroupData() {
    if (this.state.receivedSecurity) {
      const targetScope = 'Yoy'
      const payload : PayloadGetGroupHistoricalSummary = {
        source: "Default",
        identifier: this.state.targetSecurity.data.securityID,
        groupIdentifier: {
          'Ccy': [],
          'Seniority': [],
          'RatingNoNotch': [],
          'Sector': [],
          'Tenor': []
        },
        tenorOptions: ["2Y", "3Y", "5Y", "7Y", "10Y", "30Y"],
        deltaTypes: [targetScope],
        metricName: 'GSpread',
        count: 10
      }
      // this.state.moveVisualizer.groupByOptions.forEach((eachOption) => {
      //   if (eachOption.state.groupByActive) {
      //     const backendKey = this.utilityService.convertFEKey(eachOption.data.key);
      //     payload.groupIdentifier[backendKey] = [];
      //   }
      // });
      payload.groupIdentifier['SecurityType'] = [];
      payload.groupIdentifier['CouponType'] = [];
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getGroupHistoricalSummary, {req: 'POST'}, payload).pipe(
        first(),
        tap((serverReturn) => {
          this.loadSecurityList(serverReturn[targetScope]);
          this.state.table.levelSummary = this.dtoService.formHistoricalSummaryObject(serverReturn[targetScope], true);
        }),
        catchError(err => {
          console.error('error', err);
          return of('error');
        })
      ).subscribe();
    }
  }

  private loadSecurityList(rawData: BEHistoricalSummaryDTO) {
    this.state.table.presentList = [];
    this.state.table.prinstineBottomSecurityList = [];
    this.state.table.prinstineTopSecurityList = [];
    if (!!rawData.BaseSecurity && !!rawData.Group) {
      const baseSecurityDTO = this.dtoService.formSecurityCardObject('', rawData.BaseSecurity.security, false);
      baseSecurityDTO.state.isMultiLineVariant = true;
      baseSecurityDTO.state.isTable = true;
      this.state.table.presentList.push(baseSecurityDTO);
      const groupDTO = this.dtoService.formSecurityCardObject('', null, true);
      groupDTO.data.name = 'Group';
      groupDTO.state.isMultiLineVariant = true;
      groupDTO.state.isTable = true;
      groupDTO.state.isStencil = false;
      this.state.table.presentList.push(groupDTO);
    }
    if (!!rawData.Top) {
      for (const eachSecurityIdentifier in rawData.Top) {
        const eachTopSecurityDTO = this.dtoService.formSecurityCardObject(eachSecurityIdentifier, rawData.Top[eachSecurityIdentifier].security, false);
        eachTopSecurityDTO.state.isTable = true;
        eachTopSecurityDTO.state.isMultiLineVariant = true;
        this.state.table.presentList.push(eachTopSecurityDTO);
        this.state.table.prinstineTopSecurityList.push(eachTopSecurityDTO);
      }
    }
    if (!!rawData.Bottom) {
      for (const eachSecurityIdentifier in rawData.Bottom) {
        const eachBottomSecurityDTO = this.dtoService.formSecurityCardObject(eachSecurityIdentifier, rawData.Bottom[eachSecurityIdentifier].security, false);
        eachBottomSecurityDTO.state.isTable = true;
        eachBottomSecurityDTO.state.isMultiLineVariant = true;
        this.state.table.presentList.push(eachBottomSecurityDTO);
        this.state.table.prinstineBottomSecurityList.push(eachBottomSecurityDTO);
      }
    }
  }

}