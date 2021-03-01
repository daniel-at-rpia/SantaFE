  // dependencies
    import { Component, ViewEncapsulation, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
    import { Observable, Subscription, of } from 'rxjs';
    import { tap, first, catchError, delay } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import { DTOs, PageStates, AdhocPacks } from 'Core/models/frontend';
    import { DTOService, UtilityService, GraphService, RestfulCommService, GlobalWorkflowIOService } from 'Core/services';
    import { SantaContainerComponentBase } from 'Core/containers/santa-container-component-base';
    import {
      BEHistoricalSummaryDTO,
      BEHistoricalSummaryOverviewDTO,
      BEHistoricalQuantBlock
    } from 'BEModels/backend-models.interface';
    import { PayloadGetGroupHistoricalSummary } from 'BEModels/backend-payloads.interface';
    import { EngagementActionList } from 'Core/constants/coreConstants.constant';
    import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';
    import {
      MARKET_ANALYSIS_SPREAD_METRIC_KEY,
      MARKET_ANALYSIS_YIELD_METRIC_KEY,
      MarketAnalysisGroupByOptions,
      MarketAnalysisGroupByOpionsDefaultActiveList
    } from 'Core/constants/tradeConstants.constant';
    import { selectSelectedSecurityForAnalysis } from 'Trade/selectors/trade.selectors';
    import { TradeSelectedSecurityForAlertConfigEvent } from 'Trade/actions/trade.actions';
    import { HistoricalSummarySampleReturn } from 'Trade/stubs/lilMarket.stub';
  //

@Component({
  selector: 'trade-market-analysis-panel',
  templateUrl: './trade-market-analysis-panel.container.html',
  styleUrls: ['./trade-market-analysis-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeMarketAnalysisPanel extends SantaContainerComponentBase implements OnInit, OnChanges {
  @Input() stateActive: boolean;
  @Output() populateGraph = new EventEmitter();
  @Input() collapseGraph: boolean;
  state: PageStates.TradeMarketAnalysisPanelState;
  subscriptions = {
    receiveSelectedSecuritySub: null
  }
  constants = {
    marketAnalysisGroupByOptions: MarketAnalysisGroupByOptions,
    optionDefaultActiveList: MarketAnalysisGroupByOpionsDefaultActiveList,
    securityDefinitionMap: SecurityDefinitionMap,
    spreadMetricKey: MARKET_ANALYSIS_SPREAD_METRIC_KEY,
    yieldMetricKey: MARKET_ANALYSIS_YIELD_METRIC_KEY
  };

  private initializePageState(): PageStates.TradeMarketAnalysisPanelState {
    if (!!this.state) {
      // there is an old state exists
      if (!!this.state.chart) {
        this.state.chart.dispose();
      }
    }
    const state: PageStates.TradeMarketAnalysisPanelState = {
      receivedSecurity: false,
      receivedSecurityIsCDS: false,
      targetSecurity: null,
      displayGraph: false,
      apiReturnedState: false,
      apiErrorState: false,
      graphDataEmptyState: false,
      config: {
        timeScope: 'Mom',
        groupByOptions: [],
        activeOptions: [],
        driver: 'Spread'
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
    private graphService: GraphService,
    protected globalWorkflowIOService: GlobalWorkflowIOService
  ){
    super(globalWorkflowIOService);
    this.state = this.initializePageState();
  }

  public ngOnInit() {
    this.subscriptions.receiveSelectedSecuritySub = this.store$.pipe(
      select(selectSelectedSecurityForAnalysis),
      delay(500)
    ).subscribe((targetSecurity) => {
      !!targetSecurity && this.onSecuritySelected(targetSecurity);
    });
    return super.ngOnInit();
  }

  public ngOnChanges() {
    if (!!this.collapseGraph) {
      this.state.displayGraph = false;
    }
  }

  public onClickGroupByOption(targetOption: DTOs.SecurityDefinitionDTO){
    if (!!this.state.apiReturnedState) {
      if (!targetOption.state.isLocked) {
        this.restfulCommService.logEngagement(
          EngagementActionList.clickGroupByOption,
          this.state.targetSecurity.data.securityID,
          targetOption.data.key,
          'Trade - Lil Market Panel'
        );
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
        this.restfulCommService.logEngagement(
          EngagementActionList.changeTimeScope,
          this.state.targetSecurity.data.securityID,
          targetScope,
          'Trade - Lil Market Panel'
        );
        this.state.config.timeScope = targetScope;
        this.fetchGroupData();
      }
    }
  }

  public onClickDriver(targetDriver: string) {
    if (this.state.config.driver !== targetDriver) {
      this.restfulCommService.logEngagement(
        EngagementActionList.changeDriver,
        this.state.targetSecurity.data.securityID,
        targetDriver,
        'Trade - Lil Market Panel'
      );
      this.state.config.driver = targetDriver;
      this.fetchGroupData();
    }
  }

  public onSelectSecurityCardInPresentList(targetSecurity: DTOs.SecurityDTO) {
    this.state.table.presentList.forEach((eachCard) => {
      if (eachCard.data.securityID !== targetSecurity.data.securityID) {
        eachCard.state.isSelected = false;
      }
    })
  }

  public onClickSecurityCardThumbDown(targetSecurity: DTOs.SecurityDTO) {
    this.restfulCommService.logEngagement(
      EngagementActionList.thumbdownSecurity,
      targetSecurity.data.securityID,
      'Thumbdown',
      'Trade - Lil Market Panel'
    );
  }

  public onClickSecurityCardSendToGraph(targetSecurity: DTOs.SecurityDTO) {
    if (!this.state.displayGraph) {
      this.populateGraph.emit();
    }
    const targetIndex = this.state.table.presentList.indexOf(targetSecurity);
    const targetData = this.state.table.levelSummary.data.list[targetIndex].data.timeSeries;
    if (!!targetData && targetData.length > 0) {
      this.restfulCommService.logEngagement(
        EngagementActionList.populateGraph,
        targetSecurity.data.name || this.state.table.presentList[1].data.name || 'Something is Wrong',
        'Main Graph',
        'Trade - Lil Market Panel'
      );
      this.state.graphDataEmptyState = false;
      if (!!this.state.chart) {
        this.state.chart.dispose();
      }
      const buildGraph = () => {
        this.state.displayGraph = true;
        const baseSecurity = this.state.table.levelSummary.data.list[0];
        const basePack: AdhocPacks.LilMarketGraphSeriesDataPack = {
          name: baseSecurity.data.identifier,
          data: baseSecurity.data.timeSeries
        };
        const targetPack: AdhocPacks.LilMarketGraphSeriesDataPack = {
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

  public onClickSecurityCardSentToAlertConfig(targetSecurity: DTOs.SecurityDTO) {
    this.store$.dispatch(new TradeSelectedSecurityForAlertConfigEvent(this.utilityService.deepCopy(targetSecurity)));
  }

  private onSecuritySelected(targetSecurity: DTOs.SecurityDTO) {
    this.state = this.initializePageState();
    this.state.receivedSecurity = true;
    this.state.receivedSecurityIsCDS = this.utilityService.isCDS(false, this.state.targetSecurity);
    this.state.targetSecurity = this.utilityService.deepCopy(targetSecurity);
    this.state.targetSecurity.state.isSelected = false;
    this.applyStatesToSecurityCards(this.state.targetSecurity);
    this.loadStencilList();
    this.fetchGroupData();
  }

  private populateDefinitionOptions(newState: PageStates.TradeMarketAnalysisPanelState) {
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
        if (this.constants.optionDefaultActiveList.indexOf(definitionDTO.data.key) >= 0) {
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
          const inverseColorCode = !this.utilityService.isCDS(false, this.state.targetSecurity) && this.state.config.driver === 'Price';
          this.populateGroupOptionText(serverReturn);
          this.loadSecurityList(serverReturn[targetScope]);
          this.state.table.levelSummary = this.dtoService.formHistoricalSummaryObject(false, serverReturn[targetScope], true, inverseColorCode);
          this.state.table.basisSummary = this.dtoService.formHistoricalSummaryObject(false, serverReturn[targetScope], false, inverseColorCode);
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
    const group = this.dtoService.formSecurityCardObject('', null, true, false);
    group.state.isStencil = false;
    group.data.name = 'Group';
    const stencilCard = this.dtoService.formSecurityCardObject('', null, true, false);
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
    this.state.table.levelSummary = this.dtoService.formHistoricalSummaryObject(true, null, true, false);
    this.state.table.levelSummary.data.list = [
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false)
    ];
    this.state.table.basisSummary = this.dtoService.formHistoricalSummaryObject(true, null, false, false);
    this.state.table.basisSummary.data.list = [
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false),
      this.dtoService.formMoveVisualizerObject(true, null, false)
    ];
  }

  private loadSecurityList(rawData: BEHistoricalSummaryDTO) {
    this.state.table = this.initializePageState().table;
    if (!!rawData.BaseSecurity && !!rawData.Group) {
      const baseSecurityDTO = this.dtoService.formSecurityCardObject('', rawData.BaseSecurity.security, false, false);
      baseSecurityDTO.state.isActionMenuPrimaryActionsDisabled = true;
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
      const groupDTO = this.dtoService.formSecurityCardObject('', null, true, false);
      groupDTO.state.isStencil = false;
      groupDTO.state.isActionMenuMinorActionsDisabled = true;
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
      const targetFieldForCount = 'RatingDouble';
      try {
        this.state.table.numOfSecurities = rawData.Group.group.deltaMetrics[this.state.config.timeScope].propertyToNumSecurities[targetFieldForCount];
      } catch {
        console.error('something is null in there', rawData.Group.group);
      }
    }
    if (!!rawData.Top) {
      let index = 1;
      for (const eachSecurityIdentifier in rawData.Top) {
        const eachTopSecurityDTO = this.dtoService.formSecurityCardObject(eachSecurityIdentifier, rawData.Top[eachSecurityIdentifier].security, false, false);
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
        const eachBottomSecurityDTO = this.dtoService.formSecurityCardObject(eachSecurityIdentifier, rawData.Bottom[eachSecurityIdentifier].security, false, false);
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

  private applyStatesToSecurityCards(targetSecurity: DTOs.SecurityDTO) {
    targetSecurity.state.isMultiLineVariant = false;
    targetSecurity.state.isWidthFlexible = true;
    targetSecurity.api.onClickCard = this.onSelectSecurityCardInPresentList.bind(this);
    // targetSecurity.api.onClickThumbDown = this.onClickSecurityCardThumbDown.bind(this);
    targetSecurity.api.onClickSendToGraph = this.onClickSecurityCardSendToGraph.bind(this);
    targetSecurity.api.onClickSendToAlertConfig = this.onClickSecurityCardSentToAlertConfig.bind(this);
  }

  private populateGroupOptionText(rawData: BEHistoricalSummaryOverviewDTO) {
    if (!!rawData && !!rawData.GroupIdentifierWithInclusiveOptions && !!rawData.GroupIdentifierWithInclusiveOptions.groupOptionValues) {
      const valueObject = rawData.GroupIdentifierWithInclusiveOptions.groupOptionValues;
      this.state.config.groupByOptions.forEach((eachOption) => {
        const beKey = this.utilityService.convertFEKey(eachOption.data.key);
        if (!!valueObject[beKey] && valueObject[beKey].length > 0) {
          const value = valueObject[beKey][0];
          if (value == null) {
            eachOption.data.displayName = 'None';
          } else {
            eachOption.data.displayName = value;
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