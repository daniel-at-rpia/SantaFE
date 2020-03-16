  // dependencies
    import {
      Component,
      ViewEncapsulation,
      OnInit,
      OnChanges,
      OnDestroy,
      Input
    } from '@angular/core';
    import { Observable, Subscription } from 'rxjs';
    import {
      interval,
      of
    } from 'rxjs';
    import {
      tap,
      first,
      delay,
      catchError,
      withLatestFrom,
      filter
    } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { LiveDataProcessingService } from 'Trade/services/LiveDataProcessingService';
    import { TradeCenterPanelState } from 'FEModels/frontend-page-states.interface';
    import {
      SecurityDTO,
      SecurityTableHeaderDTO,
      SecurityTableRowDTO,
      QuantComparerDTO,
      SearchShortcutDTO
    } from 'FEModels/frontend-models.interface';
    import {
      PayloadGetTradeFullData,
      PayloadGetBestQuotes
    } from 'BEModels/backend-payloads.interface';
    import {
      BEPortfolioDTO,
      BESecurityDTO,
      BEBestQuoteDTO,
      BEFetchAllTradeDataReturn
    } from 'BEModels/backend-models.interface';
    import {
      DefinitionConfiguratorEmitterParams,
      ClickedOpenSecurityInBloombergEmitterParams
    } from 'FEModels/frontend-adhoc-packages.interface';

    import {
      TriCoreDriverConfig,
      DEFAULT_DRIVER_IDENTIFIER,
      EngagementActionList
    } from 'Core/constants/coreConstants.constant';
    import {
      SecurityTableMetrics,
      SECURITY_TABLE_FINAL_STAGE
    } from 'Core/constants/securityTableConstants.constant';
    import { SecurityDefinitionMap, FullOwnerList } from 'Core/constants/securityDefinitionConstants.constant';
    import {
      QUANT_COMPARER_PERCENTILE,
      PortfolioShortcuts,
      OwnershipShortcuts,
      StrategyShortcuts
    } from 'Core/constants/tradeConstants.constant';
    import {
      selectLiveUpdateTick,
      selectInitialDataLoaded,
      selectSecurityIDsFromAnalysis,
      selectBestQuoteValidWindow
    } from 'Trade/selectors/trade.selectors';
    import {
      TradeLiveUpdateProcessDataCompleteEvent,
      TradeTogglePresetEvent,
      TradeLiveUpdatePassRawDataEvent,
      TradeSwitchDriverEvent,
      TradeSelectedSecurityForAnalysisEvent,
      TradeSecurityTableRowDTOListForAnalysisEvent
    } from 'Trade/actions/trade.actions';
    import { SecurityTableMetricStub, SearchShortcutStub } from 'FEModels/frontend-stub-models.interface';
  //

@Component({
  selector: 'trade-center-panel',
  templateUrl: './trade-center-panel.container.html',
  styleUrls: ['./trade-center-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeCenterPanel implements OnInit, OnChanges, OnDestroy {
  @Input() ownerInitial: string;
  state: TradeCenterPanelState;
  subscriptions = {
    startNewUpdateSub: null,
    securityIDListFromAnalysisSub: null,
    validWindowSub: null
  }
  constants = {
    defaultMetricIdentifier: DEFAULT_DRIVER_IDENTIFIER,
    portfolioShortcuts: PortfolioShortcuts,
    ownershipShortcuts: OwnershipShortcuts,
    strategyShortcuts: StrategyShortcuts,
    securityGroupDefinitionMap: SecurityDefinitionMap,
    securityTableFinalStage: SECURITY_TABLE_FINAL_STAGE,
    fullOwnerList: FullOwnerList
  }

  private initializePageState(): TradeCenterPanelState {
    const state: TradeCenterPanelState = {
      currentContentStage: 0,
      bestQuoteValidWindow: null,
      presets: {
        presetsReady: false,
        selectedPreset: null,
        selectedList: null,
        recentShortcutList: [],
        portfolioShortcutList: [],
        ownershipShortcutList: [],
        strategyShortcutList: [],
        individualShortcutList: []
      },
      configurator: {
        dto: this.dtoService.createSecurityDefinitionConfigurator(true),
        boosted: false
      },
      table: {
        metrics: SecurityTableMetrics,
        dto: this.dtoService.formSecurityTableObject(true)
      },
      fetchResult: {
        fetchTableDataFailed: false,
        fetchTableDataFailedError: '',
        rowList: [],
        prinstineRowList: [],
        liveUpdatedRowList: []
      },
      filters: {
        quickFilters: {
          driverType: this.constants.defaultMetricIdentifier,
          portfolios: [],
          keyword: '',
          owner: [],
          strategy: []
        },
        securityFilters: []
      }
    };
    return state;
  }

  constructor(
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService,
    private processingService: LiveDataProcessingService
  ) {
    this.state = this.initializePageState();
  }

  public ngOnInit() {
    this.subscriptions.startNewUpdateSub = this.store$.pipe(
      select(selectLiveUpdateTick),
      withLatestFrom(
        this.store$.pipe(select(selectInitialDataLoaded))
      )
    ).subscribe(([tick, isInitialDataLoaded]) => {
      if (tick > 0 && isInitialDataLoaded) {  // skip first beat
        if (this.state.fetchResult.fetchTableDataFailed) {
          window.location.reload(true);
        } else {
          this.fetchAllData(false);
        }
      }
    });

    this.subscriptions.securityIDListFromAnalysisSub = this.store$.pipe(
      select(selectSecurityIDsFromAnalysis)
    ).subscribe((data) => {
      this.processSecurityIDsFromAnalysis(data)
    });

    this.subscriptions.validWindowSub = this.store$.pipe(
      select(selectBestQuoteValidWindow)
    ).subscribe((window) => {
      this.state.bestQuoteValidWindow = window;
    });
  }

  public ngOnChanges() {
    if (!!this.ownerInitial) {
      const matchedInitial = this.constants.fullOwnerList.find((eachInitial) => {
        return eachInitial === this.ownerInitial;
      });
      if (!!matchedInitial) {
        const filter = [];
        filter.push(this.ownerInitial);
        this.constants.ownershipShortcuts[0].includedDefinitions[0].selectedOptions = filter;
      } else {
        this.constants.ownershipShortcuts.splice(0, 1);
      }
      this.populateSearchShortcuts();
    }
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }

  public onSelectPresetCategory(targetCategory: Array<SearchShortcutDTO>) {
    if (this.state.presets.selectedList === targetCategory) {
      this.state.presets.selectedList = null;
    } else {
      this.state.presets.selectedList = targetCategory;
    }
  }

  public onSelectPreset(targetPreset: SearchShortcutDTO) {
    if (this.state.presets.selectedPreset === targetPreset) {
      targetPreset.state.isSelected = false;
      this.state.presets.selectedPreset = null;
      this.state.configurator.dto = this.dtoService.createSecurityDefinitionConfigurator(true);
    } else {
      this.restfulCommService.logEngagement(
        EngagementActionList.selectPreset,
        'n/a',
        targetPreset.data.displayTitle,
        this.ownerInitial,
        'Trade - Center Panel'
      );
      targetPreset.state.isSelected = true;
      this.state.presets.selectedPreset = targetPreset;
      this.state.configurator.dto = this.utilityService.applyShortcutToConfigurator(targetPreset, this.state.configurator.dto);
      const params = this.utilityService.packDefinitionConfiguratorEmitterParams(this.state.configurator.dto);
      this.onApplyFilter(params);
      this.loadFreshData();
    }
    this.store$.dispatch(new TradeTogglePresetEvent);
  }

  public onUnselectPreset() {
    this.state.presets.selectedPreset.state.isSelected = false;
    this.state.presets.selectedPreset = null;
    this.state.configurator.dto = this.dtoService.createSecurityDefinitionConfigurator(true);
    this.state.filters.quickFilters = this.initializePageState().filters.quickFilters;
    this.state.fetchResult = this.initializePageState().fetchResult;
    this.store$.dispatch(new TradeTogglePresetEvent);
  }

  public buryConfigurator() {
    this.state.configurator.boosted = false;
  }

  public boostConfigurator() {
    this.state.configurator.boosted = true;
  }

  public onswitchDriver(targetDriver) {
    if (this.state.filters.quickFilters.driverType !== targetDriver) {
      this.restfulCommService.logEngagement(
        EngagementActionList.switchDriver,
        'n/a',
        targetDriver,
        this.ownerInitial,
        'Trade - Center Panel'
      );
      this.state.filters.quickFilters.driverType = targetDriver;
      const newMetrics: Array<SecurityTableMetricStub> = this.utilityService.deepCopy(this.state.table.metrics);
      newMetrics.forEach((eachMetricStub) => {
        if (eachMetricStub.isDriverDependent && eachMetricStub.isAttrChangable) {
          if (targetDriver === this.constants.defaultMetricIdentifier) {
            eachMetricStub.attrName = targetDriver;
            eachMetricStub.underlineAttrName = targetDriver;
          } else {
            eachMetricStub.attrName = TriCoreDriverConfig[targetDriver].driverLabel;
            eachMetricStub.underlineAttrName = TriCoreDriverConfig[targetDriver].driverLabel;
          }
        }
      });
      this.state.table.metrics = newMetrics;
      // this.calculateQuantComparerWidthAndHeight();
      // TODO: remove this event and all associated logic from ngrx
      // this.store$.dispatch(new TradeSwitchDriverEvent());
    }
  }

  public onApplyFilter(params: DefinitionConfiguratorEmitterParams) {
    this.state.filters.securityFilters = params.filterList;
    this.state.filters.quickFilters.portfolios = [];
    this.state.filters.quickFilters.owner = [];
    this.state.filters.quickFilters.strategy = [];
    params.filterList.forEach((eachFilter) => {
      if (eachFilter.targetAttribute === 'portfolios') {
        this.state.filters.quickFilters.portfolios = eachFilter.filterBy;
      } else if (eachFilter.targetAttribute === 'owner') {
        this.state.filters.quickFilters.owner = eachFilter.filterBy;
      } else if (eachFilter.targetAttribute === 'strategyList') {
        this.state.filters.quickFilters.strategy = eachFilter.filterBy;
      };
    });
    // if (this.state.currentContentStage === this.constants.securityTableFinalStage) {
      this.state.fetchResult.rowList = this.filterPrinstineRowList();
    // }
    this.restfulCommService.logEngagement(
      EngagementActionList.applyFilter,
      'n/a',
      'n/a',
      this.ownerInitial,
      'Trade - Center Panel'
    );
  }

  public onSelectSecurityForAnalysis(targetSecurity: SecurityDTO) {
    this.store$.dispatch(new TradeSelectedSecurityForAnalysisEvent(this.utilityService.deepCopy(targetSecurity)));
    this.restfulCommService.logEngagement(
      EngagementActionList.selectSecurityForAnalysis,
      targetSecurity.data.securityID,
      'n/a',
      this.ownerInitial,
      'Trade - Center Panel'
    );
  }

  public onClickOpenSecurityInBloomberg(pack: ClickedOpenSecurityInBloombergEmitterParams) {
    const url = `bbg://securities/${pack.targetSecurity.data.globalIdentifier}%20${pack.yellowCard}/${pack.targetBBGModule}`;
    window.open(url);
    this.restfulCommService.logEngagement(
      EngagementActionList.bloombergRedict,
      pack.targetSecurity.data.securityID,
      `BBG - ${pack.targetBBGModule}`,
      this.ownerInitial,
      'Trade - Center Panel'
    );
  }

  public openLinkForCertificate() {
    window.open('https://rpiadev01:1225/portfolio/get-credit-positions');
  }

  public refreshAfterOpenLink() {
    window.location.reload(false);
  }

  public onSearchKeywordChange(newKeyword: string) {
    if (!!newKeyword && newKeyword.length >= 2 && newKeyword != this.state.filters.quickFilters.keyword) {
      this.state.filters.quickFilters.keyword = newKeyword;
      this.state.fetchResult.rowList = this.filterPrinstineRowList();
    } else if ((!newKeyword || newKeyword.length < 2) && !!this.state.filters.quickFilters.keyword && this.state.filters.quickFilters.keyword.length >= 2) {
      this.state.filters.quickFilters.keyword = newKeyword;
      this.state.fetchResult.rowList = this.filterPrinstineRowList();
    }
  }

  private populateSearchShortcuts() {
    this.state.presets = this.initializePageState().presets;
    this.state.presets.portfolioShortcutList = this.populateSingleShortcutList(this.constants.portfolioShortcuts);
    this.state.presets.ownershipShortcutList = this.populateSingleShortcutList(this.constants.ownershipShortcuts);
    this.state.presets.strategyShortcutList = this.populateSingleShortcutList(this.constants.strategyShortcuts);
    this.state.presets.presetsReady = true;
  }

  private populateSingleShortcutList(
    stubList: Array<SearchShortcutStub>
  ): Array<SearchShortcutDTO> {
    const list: Array<SearchShortcutDTO> = [];
    stubList.forEach((eachShortcutStub) => {
      const definitionList = eachShortcutStub.includedDefinitions.map((eachIncludedDef) => {
        const definitionDTO = this.dtoService.formSecurityDefinitionObject(this.constants.securityGroupDefinitionMap[eachIncludedDef.definitionKey]);
        definitionDTO.state.groupByActive = !!eachIncludedDef.groupByActive;
        if (eachIncludedDef.selectedOptions.length > 0) {
          definitionDTO.state.filterActive = true;
          definitionDTO.data.filterOptionList.forEach((eachFilterOption) => {
            if (eachIncludedDef.selectedOptions.indexOf(eachFilterOption.shortKey) >= 0) {
              eachFilterOption.isSelected = true;
            }
          });
        }
        return definitionDTO;
      });
      list.push(this.dtoService.formSearchShortcutObject(
        definitionList,
        eachShortcutStub.displayTitle,
        false,
        !!eachShortcutStub.isMajor,
        !!eachShortcutStub.isHero
      ));
    });
    return list;
  }

  private loadFreshData() {
    this.state.fetchResult.prinstineRowList = [];
    this.loadInitialStencilTable();
    this.updateStage(0);
    this.fetchAllData(true);
  }

  private loadInitialStencilTable() {
    const stencilHeaderBuffer: Array<SecurityTableHeaderDTO> = [];
    SecurityTableMetrics.forEach((eachStub) => {
      if (eachStub.label === 'Security' || eachStub.active) {
        stencilHeaderBuffer.push(this.dtoService.formSecurityTableHeaderObject(eachStub));
      }
    });
    for (let i = 0; i < 10; ++i) {
      const stencilSecurity = this.dtoService.formSecurityCardObject(null, null, true);
      stencilSecurity.state.isInteractionDisabled = true;
      const newRow = this.dtoService.formSecurityTableRowObject(stencilSecurity);
      stencilHeaderBuffer.forEach((eachHeader) => {
        if (eachHeader.data.displayLabel !== 'Security') {
          if (eachHeader.state.isQuantVariant) {
            const bestQuoteStencil = this.dtoService.formQuantComparerObject(true, this.state.filters.quickFilters.driverType, null, null, false);
            newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, true, bestQuoteStencil));
          } else {
            newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, false));
          }
        }
      });
      this.state.fetchResult.prinstineRowList.push(newRow);
    };
    this.state.fetchResult.rowList = this.utilityService.deepCopy(this.state.fetchResult.prinstineRowList);
  }

  private fetchAllData(isInitialFetch: boolean) {
    const payload: PayloadGetTradeFullData = {
      maxNumberOfSecurities: 2000,
      groupIdentifier: {},
      groupFilters: {
        PortfolioShortName: ["DOF","SOF","STIP","FIP","CIP","AGB","BBB"]
      }
    };
    if (!!this.state.bestQuoteValidWindow) {
      payload.lookbackHrs = this.state.bestQuoteValidWindow;
    }
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getPortfolios, { req: 'POST' }, payload, false, false).pipe(
      first(),
      tap((serverReturn) => {
        if (!isInitialFetch) {
          this.store$.dispatch(new TradeLiveUpdatePassRawDataEvent());
        } else {
          this.updateStage(0);
        }
        this.loadAllData(serverReturn);
      }),
      catchError(err => {
        this.restfulCommService.logError(`Get portfolios failed`, this.ownerInitial);
        this.store$.dispatch(new TradeLiveUpdatePassRawDataEvent());
        this.store$.dispatch(new TradeLiveUpdateProcessDataCompleteEvent());
        this.updateStage(3);
        console.error('error', err);
        this.state.fetchResult.fetchTableDataFailed = true;
        this.state.fetchResult.fetchTableDataFailedError = err.message;
        this.state.fetchResult.prinstineRowList = [];
        this.state.fetchResult.rowList = this.filterPrinstineRowList();
        return of('error');
      })
    ).subscribe();
  }

  private loadAllData(serverReturn: BEFetchAllTradeDataReturn) {
    this.state.fetchResult.prinstineRowList = [];  // flush out the stencils
    this.state.fetchResult.prinstineRowList = this.processingService.loadFinalStageData(
      this.state.table.dto.data.headers,
      this.state.filters.quickFilters.driverType,
      serverReturn,
      this.onSelectSecurityForAnalysis.bind(this),
      this.onClickOpenSecurityInBloomberg.bind(this)
    );
    this.calculateQuantComparerWidthAndHeight();
    this.updateStage(this.constants.securityTableFinalStage);
  }

  private updateStage(stageNumber: number) {
    this.state.currentContentStage = stageNumber;
    if (this.state.currentContentStage === this.constants.securityTableFinalStage) {
      this.store$.pipe(
        select(selectInitialDataLoaded),
        first(),
        tap(isInitialDataLoaded => {
          if (isInitialDataLoaded) {
            const newFilteredList = this.filterPrinstineRowList();
            this.state.fetchResult.liveUpdatedRowList = this.processingService.returnDiff(this.state.table.dto, newFilteredList).newRowList;
          } else {
            this.state.fetchResult.rowList = this.filterPrinstineRowList();
          }
          this.store$.dispatch(new TradeLiveUpdateProcessDataCompleteEvent());
        })
      ).subscribe();
    }
  }

  private filterPrinstineRowList(): Array<SecurityTableRowDTO> {
    console.log('applying filter');
    const filteredList: Array<SecurityTableRowDTO> = [];
    this.state.fetchResult.prinstineRowList.forEach((eachRow) => {
      try {
        if (this.utilityService.caseInsensitiveKeywordMatch(eachRow.data.security.data.name, this.state.filters.quickFilters.keyword)) {
          let portfolioIncludeFlag = this.filterByPortfolio(eachRow);
          let ownerFlag = this.filterByOwner(eachRow);
          let strategyFlag = this.filterByStrategy(eachRow);
          let securityLevelFilterResultCombined = true;
          if (this.state.filters.securityFilters.length > 0) {
            const securityLevelFilterResult = this.state.filters.securityFilters.map((eachFilter) => {
              return this.filterBySecurityAttribute(eachRow, eachFilter.targetAttribute, eachFilter.filterBy);
            });
            // as long as one of the filters failed, this security will not show
            securityLevelFilterResultCombined = securityLevelFilterResult.filter((eachResult) => {
              return eachResult;
            }).length === securityLevelFilterResult.length;
          }
          strategyFlag && ownerFlag && securityLevelFilterResultCombined && portfolioIncludeFlag && filteredList.push(eachRow);
        }
      } catch {
        // ignore, seems AgGrid causes some weird read only error
        console.warn('caught read only issue', eachRow);
      }
    });
    return filteredList;
  }

  private filterBySecurityAttribute(targetRow: SecurityTableRowDTO, targetAttribute: string, filterBy: Array<string>): boolean {
    let includeFlag = false;
    if (targetAttribute === 'portfolios' || targetAttribute === 'owner' || targetAttribute === 'strategyList') {
      // bypass portfolio filter since it is handled via this.filterByPortfolio() and this.filterByOwner() and this.filterByStrategy()
      return true;
    } else {
      filterBy.forEach((eachValue) => {
        if (targetRow.data.security.data[targetAttribute] === eachValue) {
          includeFlag = true;
        }
      });
      return includeFlag;
    }
  }

  private filterByPortfolio(targetRow: SecurityTableRowDTO): boolean {
    const targetSecurity = targetRow.data.security;
    let includeFlag = false;
    if (this.state.filters.quickFilters.portfolios.length > 0) {
      targetRow.data.security.data.positionCurrent = 0;
      targetRow.data.security.data.cs01CadCurrent = 0;
      targetRow.data.security.data.cs01LocalCurrent = 0;
      this.state.filters.quickFilters.portfolios.forEach((eachPortfolio) => {
        const portfolioExist = targetRow.data.security.data.portfolios.find((eachPortfolioBlock) => {
          return eachPortfolioBlock.portfolioName === eachPortfolio;
        });
        if (!!portfolioExist) {
          targetRow.data.security.data.positionCurrent = targetRow.data.security.data.positionCurrent + portfolioExist.quantity;
          targetRow.data.security.data.cs01CadCurrent = targetRow.data.security.data.cs01CadCurrent + portfolioExist.cs01Cad;
          targetRow.data.security.data.cs01LocalCurrent = targetRow.data.security.data.cs01LocalCurrent + portfolioExist.cs01Local;
          includeFlag = true;
        }
      });
    } else {
      includeFlag = true;
      targetRow.data.security.data.positionCurrent = targetRow.data.security.data.positionFirm;
      targetRow.data.security.data.cs01CadCurrent = targetRow.data.security.data.cs01CadFirm;
      targetRow.data.security.data.cs01LocalCurrent = targetRow.data.security.data.cs01LocalFirm;
    }
    targetRow.data.security.data.positionCurrentInMM = this.utilityService.parsePositionToMM(targetRow.data.security.data.positionCurrent, false);
    targetRow.data.security.data.cs01CadCurrentInK = this.utilityService.parseNumberToThousands(targetRow.data.security.data.cs01CadCurrent, false);
    targetRow.data.security.data.cs01LocalCurrentInK = this.utilityService.parseNumberToThousands(targetRow.data.security.data.cs01LocalCurrent, false);
    return includeFlag;
  }

  private filterByOwner(targetRow: SecurityTableRowDTO): boolean {
    let includeFlag = false;
    if (this.state.filters.quickFilters.owner.length > 0) {
      this.state.filters.quickFilters.owner.forEach((eachOwner) => {
        const ownerExist = targetRow.data.security.data.owner.indexOf(eachOwner) > -1;
        if (!!ownerExist) {
          includeFlag = true;
        }
      });
    } else {
      includeFlag = true;
    }
    return includeFlag;
  }

  private filterByStrategy(targetRow: SecurityTableRowDTO): boolean {
    let includeFlag = false;
    if (this.state.filters.quickFilters.strategy.length > 0) {
      this.state.filters.quickFilters.strategy.forEach((eachStrategy) => {
        const strategyExist = targetRow.data.security.data.strategyList.indexOf(eachStrategy) > -1;
        if (!!strategyExist) {
          includeFlag = true;
        }
      });
    } else {
      includeFlag = true;
    }
    return includeFlag;
  }

  private calculateQuantComparerWidthAndHeight() {
    const bestSpreadList = [];
    const bestPriceList = [];
    const bestYieldList = [];
    this.state.fetchResult.prinstineRowList.forEach((eachRow) => {
      const bestSpreadQuote = eachRow.data.bestQuotes.combined.bestSpreadQuote;
      const bestPriceQuote = eachRow.data.bestQuotes.combined.bestPriceQuote;
      const bestYieldQuote = eachRow.data.bestQuotes.combined.bestYieldQuote;
      const bestAxeSpreadQuote = eachRow.data.bestQuotes.axe.bestSpreadQuote;
      const bestAxePriceQuote = eachRow.data.bestQuotes.axe.bestPriceQuote;
      const bestAxeYieldQuote = eachRow.data.bestQuotes.axe.bestYieldQuote;
      !!bestSpreadQuote && bestSpreadList.push(bestSpreadQuote);
      !!bestAxeSpreadQuote && bestSpreadList.push(bestAxeSpreadQuote);
      !!bestPriceQuote && bestPriceList.push(bestPriceQuote);
      !!bestAxePriceQuote && bestPriceList.push(bestAxePriceQuote);
      !!bestYieldQuote && bestYieldList.push(bestYieldQuote);
      !!bestYieldQuote && bestYieldList.push(bestAxeYieldQuote);
    });
    this.calculateQuantComparerWidthAndHeightPerSet(bestSpreadList);
    this.calculateQuantComparerWidthAndHeightPerSet(bestYieldList);
    this.calculateQuantComparerWidthAndHeightPerSet(bestPriceList);
  }

  private calculateQuantComparerWidthAndHeightPerSet(list: Array<QuantComparerDTO>) {
    const deltaList = [];
    const sizeList = [];
    list.forEach((eachComparer) => {
      if (!!eachComparer && eachComparer.state.hasBid && eachComparer.state.hasOffer) {
        deltaList.push(Math.abs(eachComparer.data.delta));
        sizeList.push(eachComparer.data.bid.size, eachComparer.data.offer.size);
      }
    });
    const maxDelta = this.utilityService.findPercentile(deltaList, QUANT_COMPARER_PERCENTILE);
    const maxSize = this.utilityService.findPercentile(sizeList, QUANT_COMPARER_PERCENTILE);

    list.forEach((eachComparer) => {
      if (eachComparer.state.hasBid && eachComparer.state.hasOffer) {
        eachComparer.style.lineWidth = this.calculateSingleQuantComparerWidth(eachComparer.data.delta, maxDelta);
      } else {
        eachComparer.style.lineWidth = 15;
      }
      eachComparer.style.bidLineHeight = Math.round(eachComparer.data.bid.size / maxSize * 100);
      eachComparer.style.offerLineHeight = Math.round(eachComparer.data.offer.size / maxSize * 100);
      eachComparer.state.isCalculated = true;
    });
  }

  private calculateSingleQuantComparerWidth(delta: number, maxAbsDelta: number): number {
    if (delta < 0) {
      return 100;
    } else {
      const result = 100 - Math.round(delta / maxAbsDelta * 100);
      return result;
    }
  }

  private processSecurityIDsFromAnalysis(securityIDList: any[]) {
    if (securityIDList) {
      if (securityIDList.length > 0) {
        let securityTableRowDTOList: SecurityTableRowDTO[] = [];
        for (let securityTableRowDTO in this.state.fetchResult.prinstineRowList) {
          for (let securityID of securityIDList) {
            if (this.state.fetchResult.prinstineRowList[securityTableRowDTO].data.security.data.securityID === securityID) {
              securityTableRowDTOList.push(this.state.fetchResult.prinstineRowList[securityTableRowDTO])
            }
          }
        }

        this.store$.dispatch(new TradeSecurityTableRowDTOListForAnalysisEvent(this.utilityService.deepCopy(securityTableRowDTOList)));
      }
    }
  }

}