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
    import { LilMarketGraphSeriesDataPack } from 'FEModels/frontend-adhoc-packages.interface';
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
    if (!!this.state) {
      // there is an old state exists
      if (!!this.state.chart) {
        this.state.chart.dispose();
      }
    }
    const state: TradeMarketAnalysisPanelState = {
      receivedSecurity: false,
      targetSecurity: null,
      displayGraph: false,
      apiReturnedState: false,
      apiErrorState: false,
      graphDataEmptyState: false,
      config: {
        timeScope: 'Mom',
        groupByOptions: [],
        activeOptions: [],
        driver: 'GSpread'
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
      },
      chart: null
    };
    this.populateDefinitionOptions(state);
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
    if (!!this.state.apiReturnedState) {
      if (!targetOption.state.isLocked) {
        const indexOfTargetOption = this.state.config.activeOptions.indexOf(targetOption);
        if (indexOfTargetOption >= 0) {
          this.state.config.activeOptions.splice(indexOfTargetOption, 1);
        } else {
          this.state.config.activeOptions.push(targetOption);
        }
        this.fetchGroupData();
      }
    }
  }

  public onClickTimeScope(targetScope: string) {
    if (!!this.state.apiReturnedState) {
      if (this.state.config.timeScope !== targetScope) {
        this.state.config.timeScope = targetScope;
        this.fetchGroupData();
      }
    }
  }

  public onClickDriver(targetDriver: string) {
    if (this.state.config.driver !== targetDriver) {
      this.state.config.driver = targetDriver;
      this.fetchGroupData();
    }
  }

  public onClickSecurityCardThumbDown(targetSecurity: SecurityDTO) {
  }

  public onClickSecurityCardSendToGraph(targetSecurity: SecurityDTO) {
    if (!this.state.displayGraph) {
      this.populateGraph.emit();
    }
    const targetIndex = this.state.table.presentList.indexOf(targetSecurity);
    const targetData = this.state.table.levelSummary.data.list[targetIndex].data.timeSeries;
    if (!!targetData && targetData.length > 0) {
      this.state.graphDataEmptyState = false;
      if (!!this.state.chart) {
        this.state.chart.dispose();
      }
      const buildGraph = () => {
        this.state.displayGraph = true;
        const baseSecurity = this.state.table.levelSummary.data.list[0];
        const basePack: LilMarketGraphSeriesDataPack = {
          name: baseSecurity.data.identifier,
          data: baseSecurity.data.timeSeries
        };
        const targetPack: LilMarketGraphSeriesDataPack = {
          name: this.state.table.levelSummary.data.list[targetIndex].data.identifier,
          data: targetData
        }
        this.state.chart = this.graphService.buildLilMarketTimeSeriesGraph(basePack, targetPack);
      }
      setTimeout(buildGraph.bind(this), 200);
    } else {
      this.state.graphDataEmptyState = true;
    }
  }

  public onMouseLeaveSecurityCard(targetSecurity: SecurityDTO) {
    targetSecurity.state.isSelected = false;
  }

  private onSecuritySelected(targetSecurity: SecurityDTO) {
    this.state = this.initializePageState();
    this.state.receivedSecurity = true;
    this.state.targetSecurity = this.utilityService.deepCopy(targetSecurity);
    this.applyStatesToSecurityCards(this.state.targetSecurity);
    this.loadStencilList();
    this.fetchGroupData();
  }

  private populateDefinitionOptions(newState: TradeMarketAnalysisPanelState) {
    const options = [];
    const activeOptions = [];
    this.constants.marketAnalysisGroupByOptions.forEach((eachDefinitionStub) => {
      const definitionDTO = this.dtoService.formSecurityDefinitionObject(eachDefinitionStub);
      definitionDTO.state.isMiniPillVariant = true;
      definitionDTO.state.groupByActive = true;
      definitionDTO.state.isLocked = true;
      if (
        definitionDTO.data.key === this.constants.securityDefinitionMap.CURRENCY.key || 
        definitionDTO.data.key === this.constants.securityDefinitionMap.COUPON_TYPE.key ||
        definitionDTO.data.key === this.constants.securityDefinitionMap.SECURITY_TYPE.key) {
        // do nothing
      } else {
        if (definitionDTO.data.key !== this.constants.securityDefinitionMap.TICKER.key) {
          activeOptions.push(definitionDTO);
        }
      }
      options.push(definitionDTO);
    });
    newState.config.groupByOptions = options;
    newState.config.activeOptions = activeOptions;
  }

  private fetchGroupData() {
    if (this.state.receivedSecurity) {
      this.state.apiReturnedState = false;
      this.state.config.groupByOptions.forEach((eachOption) => {
        eachOption.state.isLocked = true;
      });
      const targetScope = this.state.config.timeScope;
      const payload : PayloadGetGroupHistoricalSummary = {
        source: "Default",
        identifier: this.state.targetSecurity.data.securityID,
        groupIdentifier: {},
        tenorOptions: ["2Y", "3Y", "5Y", "7Y", "10Y", "30Y"],
        deltaTypes: [targetScope],
        metricName: this.utilityService.isCDS(false, this.state.targetSecurity) ? 'Spread' : this.state.config.driver,
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
          this.state.apiReturnedState = true;
          this.state.apiErrorState = false;
          this.populateGroupOptionText(serverReturn);
          this.loadSecurityList(serverReturn[targetScope]);
          this.state.table.levelSummary = this.dtoService.formHistoricalSummaryObject(false, serverReturn[targetScope], true);
          this.state.table.basisSummary = this.dtoService.formHistoricalSummaryObject(false, serverReturn[targetScope], false);
        }),
        catchError(err => {
          console.error('error', err);
          this.state.apiReturnedState = true;
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
    this.state.table.moveDistanceLevelList = ['', '', '','', '', '','', '', '','','',''];
    this.state.table.moveDistanceBasisList = ['', '', '','', '', '','', '', '','','',''];
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
      if (rawData.BaseSecurity.historicalLevel && rawData.BaseSecurity.historicalLevel.isValid) {
        const levelDistance = this.retrieveMoveDistance(rawData.BaseSecurity.historicalLevel);
        this.state.table.moveDistanceLevelList.push(levelDistance);
      } else {
        this.state.table.moveDistanceLevelList.push('');
      }
      this.state.table.moveDistanceBasisList.push('');
      const groupDTO = this.dtoService.formSecurityCardObject('', null, true);
      groupDTO.state.isStencil = false;
      groupDTO.state.isInteractionThumbDownDisabled = true;
      groupDTO.data.name = rawData.Group.group.name;
      this.applyStatesToSecurityCards(groupDTO);
      this.state.table.presentList.push(groupDTO);
      this.state.table.rankingList.push('Group');
      if (rawData.Group.historicalLevel && rawData.Group.historicalLevel.isValid) {
        const levelDistance = this.retrieveMoveDistance(rawData.Group.historicalLevel);
        this.state.table.moveDistanceLevelList.push(levelDistance);
      } else {
        this.state.table.moveDistanceLevelList.push('');
      }
      if (rawData.Group.historicalBasis && rawData.Group.historicalBasis.isValid) {
        const basisDistance = this.retrieveMoveDistance(rawData.Group.historicalBasis);
        this.state.table.moveDistanceBasisList.push(basisDistance);
      } else {
        this.state.table.moveDistanceBasisList.push('');
      }
      const targetFieldForCount = this.utilityService.isCDS(false, this.state.targetSecurity) ? 'Spread' : this.state.config.driver;
      try {
        this.state.table.numOfSecurities = rawData.Group.group.deltaMetrics[this.state.config.timeScope].propertyToNumSecurities[targetFieldForCount];
      } catch {
        console.error('something is null in there', rawData.Group.group);
      }
    }
    if (!!rawData.Top) {
      let index = 1;
      for (const eachSecurityIdentifier in rawData.Top) {
        const eachTopSecurityDTO = this.dtoService.formSecurityCardObject(eachSecurityIdentifier, rawData.Top[eachSecurityIdentifier].security, false);
        this.applyStatesToSecurityCards(eachTopSecurityDTO);
        this.state.table.presentList.push(eachTopSecurityDTO);
        this.state.table.prinstineTopSecurityList.push(eachTopSecurityDTO);
        this.state.table.rankingList.push(`Top ${index}`);
        if (rawData.Top[eachSecurityIdentifier].historicalLevel && rawData.Top[eachSecurityIdentifier].historicalLevel.isValid) {
          const levelDistance = this.retrieveMoveDistance(rawData.Top[eachSecurityIdentifier].historicalLevel);
          this.state.table.moveDistanceLevelList.push(levelDistance);
        } else {
          this.state.table.moveDistanceLevelList.push('');
        }
        if (rawData.Top[eachSecurityIdentifier].historicalBasis && rawData.Top[eachSecurityIdentifier].historicalBasis.isValid) {
          const basisDistance = this.retrieveMoveDistance(rawData.Top[eachSecurityIdentifier].historicalBasis);
          this.state.table.moveDistanceBasisList.push(basisDistance);
        } else {
          this.state.table.moveDistanceBasisList.push('');
        }
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
        if (rawData.Bottom[eachSecurityIdentifier].historicalLevel && rawData.Bottom[eachSecurityIdentifier].historicalLevel.isValid) {
          const levelDistance = this.retrieveMoveDistance(rawData.Bottom[eachSecurityIdentifier].historicalLevel);
          this.state.table.moveDistanceLevelList.push(levelDistance);
        } else {
          this.state.table.moveDistanceLevelList.push('');
        }
        if (rawData.Bottom[eachSecurityIdentifier].historicalBasis && rawData.Bottom[eachSecurityIdentifier].historicalBasis.isValid) {
          const basisDistance = this.retrieveMoveDistance(rawData.Bottom[eachSecurityIdentifier].historicalBasis);
          this.state.table.moveDistanceBasisList.push(basisDistance);
        } else {
          this.state.table.moveDistanceBasisList.push('');
        }
        index++;
      }
    }
  }

  private applyStatesToSecurityCards(targetSecurity: SecurityDTO) {
    targetSecurity.state.isMultiLineVariant = false;
    targetSecurity.state.isWidthFlexible = true;
  }

  private populateGroupOptionText(rawData: BEHistoricalSummaryOverviewDTO) {
    if (!!rawData && !!rawData.GroupIdentifierWithInclusiveOptions && !!rawData.GroupIdentifierWithInclusiveOptions.groupOptionValues) {
      const valueObject = rawData.GroupIdentifierWithInclusiveOptions.groupOptionValues;
      this.state.config.groupByOptions.forEach((eachOption) => {
        const beKey = this.utilityService.convertFEKey(eachOption.data.key);
        if (!!valueObject[beKey] && valueObject[beKey].length > 0) {
          const value = valueObject[beKey][0];
          if (value == null) {
            eachOption.data.name = 'None';
          } else {
            eachOption.data.name = value;
          }
        }
        if (
          eachOption.data.key === this.constants.securityDefinitionMap.CURRENCY.key || 
          eachOption.data.key === this.constants.securityDefinitionMap.COUPON_TYPE.key ||
          eachOption.data.key === this.constants.securityDefinitionMap.SECURITY_TYPE.key) {
          // do nothing
        } else {
          eachOption.state.isLocked = false;
        }
      })
    }
  }

  private retrieveMoveDistance(rawQuantBlock: BEHistoricalQuantBlock): string {
    const number = rawQuantBlock.endMetric - rawQuantBlock.startMetric;
    const text = this.utilityService.round(number);
    return text;
  }
}