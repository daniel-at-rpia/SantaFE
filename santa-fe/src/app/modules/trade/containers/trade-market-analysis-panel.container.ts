  // dependencies
    import {
      Component,
      ViewEncapsulation,
      OnInit,
      OnDestroy,
      OnChanges,
      Input,
      Output,
      EventEmitter
    } from '@angular/core';
    import {
      Observable,
      Subscription,
      of
    } from 'rxjs';
    import {
      tap,
      first,
      catchError,
      delay
    } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { GraphService } from 'Core/services/GraphService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import {
      SecurityDTO,
      MoveVisualizerDTO,
      SecurityDefinitionDTO
    } from 'FEModels/frontend-models.interface';
    import { TradeMarketAnalysisPanelState } from 'FEModels/frontend-page-states.interface';
    import {
      BEHistoricalSummaryDTO,
      BEHistoricalSummaryOverviewDTO,
      BEHistoricalQuantBlock
    } from 'BEModels/backend-models.interface';
    import { PayloadGetGroupHistoricalSummary } from 'BEModels/backend-payloads.interface';
    import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';
    import {
      MARKET_ANALYSIS_SPREAD_METRIC_KEY,
      MARKET_ANALYSIS_YIELD_METRIC_KEY,
      MarketAnalysisGroupByOptions
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

export class TradeMarketAnalysisPanel implements OnInit, OnDestroy, OnChanges {
  @Output() populateGraph = new EventEmitter();
  @Input() collapseGraph: boolean;
  state: TradeMarketAnalysisPanelState;
  subscriptions = {
    receiveSelectedSecuritySub: null
  }
  constants = {
    marketAnalysisGroupByOptions: MarketAnalysisGroupByOptions,
    securityDefinitionMap: SecurityDefinitionMap,
    spreadMetricKey: MARKET_ANALYSIS_SPREAD_METRIC_KEY,
    yieldMetricKey: MARKET_ANALYSIS_YIELD_METRIC_KEY
  };

  private initializePageState(): TradeMarketAnalysisPanelState {
    const state: TradeMarketAnalysisPanelState = {
      receivedSecurity: false,
      targetSecurity: null,
      populateGroupOptionText: false,
      displayGraph: false,
      apiErrorState: false,
      config: {
        timeScope: 'Mom',
        groupByOptions: [],
        activeOptions: []
      },
      table: {
        numOfSecurities: 0,
        presentList: [],
        prinstineTopSecurityList: [],
        prinstineBottomSecurityList: [],
        levelSummary: null,
        basisSummary: null,
        rankingList: [],
        moveDistanceLevelList: [],
        moveDistanceBasisList: []
      }
    };
    return state;
  }

  constructor(
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService,
    private graphService: GraphService
  ){
    this.state = this.initializePageState();
    this.populateDefinitionOptions();
  }

  public ngOnInit() {
    this.subscriptions.receiveSelectedSecuritySub = this.store$.pipe(
      select(selectSelectedSecurityForAnalysis),
      delay(500)
    ).subscribe((targetSecurity) => {
      !!targetSecurity && this.onSecuritySelected(targetSecurity);
    });
  }

  public ngOnChanges() {
    if (!!this.collapseGraph) {
      this.state.displayGraph = false;
    }
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }

  public onClickGroupByOption(targetOption: SecurityDefinitionDTO){
    if (!targetOption.state.isLocked) {
      const indexOfTargetOption = this.state.config.activeOptions.indexOf(targetOption);
      if (indexOfTargetOption >= 0) {
        this.state.config.activeOptions.splice(indexOfTargetOption, 1);
      } else {
        this.state.config.activeOptions.push(targetOption);
      }
      if (this.state.config.activeOptions.length > 0) {
        this.fetchGroupData();
      }
    }
  }

  public onClickTimeScope(targetScope: string) {
    if (this.state.config.timeScope !== targetScope) {
      this.state.config.timeScope = targetScope;
      this.fetchGroupData();
    }
  }

  public onClickSecurityCardThumbDown(targetSecurity: SecurityDTO) {
  }

  public onClickSecurityCardSendToGraph(targetSecurity: SecurityDTO) {
    if (!this.state.displayGraph) {
      this.state.displayGraph = true;
      this.populateGraph.emit();
    }
    setTimeout(this.graphService.buildLilMarketTimeSeriesGraph.bind(this), 200);
  }

  public onMouseLeaveSecurityCard(targetSecurity: SecurityDTO) {
    targetSecurity.state.isSelected = false;
  }

  private onSecuritySelected(targetSecurity: SecurityDTO) {
    this.state.receivedSecurity = true;
    this.state.populateGroupOptionText = false;
    this.state.targetSecurity = this.utilityService.deepCopy(targetSecurity);
    this.applyStatesToSecurityCards(this.state.targetSecurity);
    this.loadStencilList();
    this.fetchGroupData();
  }

  private populateDefinitionOptions() {
    const options = [];
    const activeOptions = [];
    this.constants.marketAnalysisGroupByOptions.forEach((eachDefinitionStub) => {
      const definitionDTO = this.dtoService.formSecurityDefinitionObject(eachDefinitionStub);
      definitionDTO.state.isMiniPillVariant = true;
      definitionDTO.state.groupByActive = true;
      if (
        definitionDTO.data.key === this.constants.securityDefinitionMap.CURRENCY.key || 
        definitionDTO.data.key === this.constants.securityDefinitionMap.COUPON_TYPE.key ||
        definitionDTO.data.key === this.constants.securityDefinitionMap.SECURITY_TYPE.key) {
        definitionDTO.state.isLocked = true;
      } else {
        if (definitionDTO.data.key !== this.constants.securityDefinitionMap.TICKER.key) {
          activeOptions.push(definitionDTO);
        }
      }
      options.push(definitionDTO);
    });
    this.state.config.groupByOptions = options;
    this.state.config.activeOptions = activeOptions;
  }

  private fetchGroupData() {
    if (this.state.receivedSecurity) {
      const targetScope = this.state.config.timeScope;
      const payload : PayloadGetGroupHistoricalSummary = {
        source: "Default",
        identifier: this.state.targetSecurity.data.securityID,
        groupIdentifier: {},
        tenorOptions: ["2Y", "3Y", "5Y", "7Y", "10Y", "30Y"],
        deltaTypes: [targetScope],
        metricName: this.utilityService.isCDS(false, this.state.targetSecurity) ? 'Spread' : 'GSpread',
        count: 5
      }
      this.state.config.activeOptions.forEach((eachOption) => {
        const backendKey = this.utilityService.convertFEKey(eachOption.data.key);
        if (backendKey !== 'n/a') {
          payload.groupIdentifier[backendKey] = [];
        }
      });
      payload.groupIdentifier['Ccy'] = [];
      payload.groupIdentifier['SecurityType'] = [];
      payload.groupIdentifier['CouponType'] = [];
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getGroupHistoricalSummary, {req: 'POST'}, payload).pipe(
        first(),
        tap((serverReturn: BEHistoricalSummaryOverviewDTO) => {
          this.state.apiErrorState = false;
          !this.state.populateGroupOptionText && this.populateGroupOptionText(serverReturn[targetScope]);
          this.loadSecurityList(serverReturn[targetScope]);
          this.state.table.levelSummary = this.dtoService.formHistoricalSummaryObject(false, serverReturn[targetScope], true);
          this.state.table.basisSummary = this.dtoService.formHistoricalSummaryObject(false, serverReturn[targetScope], false);
        }),
        catchError(err => {
          console.error('error', err);
          this.state.apiErrorState = true;
          return of('error');
        })
      ).subscribe();
    }
  }

  private loadStencilList() {
    const group = this.dtoService.formSecurityCardObject('', null, true);
    group.state.isStencil = false;
    group.data.name = 'Group';
    const stencilCard = this.dtoService.formSecurityCardObject('', null, true);
    this.applyStatesToSecurityCards(group);
    this.applyStatesToSecurityCards(stencilCard);
    this.state.table.presentList = [
      this.state.targetSecurity,
      group,
      stencilCard,
      stencilCard,
      stencilCard,
      stencilCard,
      stencilCard,
      stencilCard,
      stencilCard,
      stencilCard,
      stencilCard,
      stencilCard
    ];
    this.state.table.rankingList = ['', '', '','', '', '','', '', '','','',''];
    this.state.table.levelSummary = this.dtoService.formHistoricalSummaryObject(true, null, true);
    this.state.table.levelSummary.data.list = [
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true)
    ];
    this.state.table.basisSummary = this.dtoService.formHistoricalSummaryObject(true, null, false);
    this.state.table.basisSummary.data.list = [
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true),
      this.dtoService.formMoveVisualizerObject(true)
    ];
  }

  private loadSecurityList(rawData: BEHistoricalSummaryDTO) {
    this.state.table = this.initializePageState().table;
    if (!!rawData.BaseSecurity && !!rawData.Group) {
      const baseSecurityDTO = this.dtoService.formSecurityCardObject('', rawData.BaseSecurity.security, false);
      baseSecurityDTO.state.isInteractionDisabled = true;
      this.applyStatesToSecurityCards(baseSecurityDTO);
      this.state.table.presentList.push(baseSecurityDTO);
      this.state.table.rankingList.push('Base');
      this.state.table.moveDistanceLevelList.push('');
      this.state.table.moveDistanceBasisList.push('');
      const groupDTO = this.dtoService.formSecurityCardObject('', null, true);
      groupDTO.state.isStencil = false;
      groupDTO.state.isInteractionDisabled = true;
      groupDTO.data.name = rawData.Group.group.name;
      this.applyStatesToSecurityCards(groupDTO);
      this.state.table.presentList.push(groupDTO);
      this.state.table.rankingList.push('Group');
      this.state.table.moveDistanceLevelList.push('');
      this.state.table.moveDistanceBasisList.push('');
      this.state.table.numOfSecurities = rawData.Group.group.metrics.propertyToNumSecurities.GSpread;
    }
    if (!!rawData.Top) {
      let index = 1;
      for (const eachSecurityIdentifier in rawData.Top) {
        const eachTopSecurityDTO = this.dtoService.formSecurityCardObject(eachSecurityIdentifier, rawData.Top[eachSecurityIdentifier].security, false);
        this.applyStatesToSecurityCards(eachTopSecurityDTO);
        this.state.table.presentList.push(eachTopSecurityDTO);
        this.state.table.prinstineTopSecurityList.push(eachTopSecurityDTO);
        this.state.table.rankingList.push(`Top ${index}`);
        const levelDistance = this.retrieveMoveDistance(rawData.Top[eachSecurityIdentifier].historicalLevel);
        this.state.table.moveDistanceLevelList.push(levelDistance);
        const basisDistance = this.retrieveMoveDistance(rawData.Top[eachSecurityIdentifier].historicalBasis);
        this.state.table.moveDistanceBasisList.push(basisDistance);
        index++;
      }
    }
    if (!!rawData.Bottom) {
      let index = 1;
      for (const eachSecurityIdentifier in rawData.Bottom) {
        const eachBottomSecurityDTO = this.dtoService.formSecurityCardObject(eachSecurityIdentifier, rawData.Bottom[eachSecurityIdentifier].security, false);
        this.applyStatesToSecurityCards(eachBottomSecurityDTO);
        this.state.table.presentList.push(eachBottomSecurityDTO);
        this.state.table.prinstineBottomSecurityList.push(eachBottomSecurityDTO);
        this.state.table.rankingList.push(`Bottom ${index}`);
        const levelDistance = this.retrieveMoveDistance(rawData.Bottom[eachSecurityIdentifier].historicalLevel);
        this.state.table.moveDistanceLevelList.push(levelDistance);
        const basisDistance = this.retrieveMoveDistance(rawData.Bottom[eachSecurityIdentifier].historicalBasis);
        this.state.table.moveDistanceBasisList.push(basisDistance);
        index++;
      }
    }
  }

  private applyStatesToSecurityCards(targetSecurity: SecurityDTO) {
    targetSecurity.state.isMultiLineVariant = false;
    targetSecurity.state.isWidthFlexible = true;
  }

  private populateGroupOptionText(rawData: BEHistoricalSummaryDTO) {
    if (!!rawData && !!rawData.Group && !!rawData.Group.group && !!rawData.Group.group.groupIdentifier) {
      this.state.config.groupByOptions.forEach((eachOption) => {
        if (this.state.config.activeOptions.indexOf(eachOption) >= 0 || eachOption.state.isLocked) {
          const backendKey = this.utilityService.convertFEKey(eachOption.data.key);
          if (backendKey !== 'n/a') {
            const value = !!rawData.Group.group.groupIdentifier.groupOptionValues[backendKey] ? rawData.Group.group.groupIdentifier.groupOptionValues[backendKey][0] : 'n/a';
            eachOption.data.name = value;
          }
        } else if (!!eachOption.data.securityDTOAttr) {
          eachOption.data.name = this.state.targetSecurity.data[eachOption.data.securityDTOAttr];
        }
      })
    }
    this.state.populateGroupOptionText = true;
  }

  private retrieveMoveDistance(rawQuantBlock: BEHistoricalQuantBlock): string {
    const number = rawQuantBlock.endMetric - rawQuantBlock.startMetric;
    const text = this.utilityService.round(number);
    return text;
  }
}