  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { of, Subscription, Subject } from 'rxjs';
    import { catchError, first, tap, withLatestFrom, combineLatest, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import { DTOs, Blocks, PageStates, AdhocPacks, Stubs } from 'Core/models/frontend';
    import { DTOService, UtilityService, RestfulCommService, BICsDataProcessingService } from 'Core/services';
    import { LiveDataProcessingService } from 'Trade/services/LiveDataProcessingService';
    import { PayloadGetTradeFullData } from 'BEModels/backend-payloads.interface';
    import {
      BEPortfolioDTO,
      BESecurityDTO,
      BEBestQuoteDTO,
      BEFetchAllTradeDataReturn,
      BEBICsHierarchyBlock,
      BESecurityMap
    } from 'BEModels/backend-models.interface';
    import {
      TriCoreDriverConfig,
      DEFAULT_DRIVER_IDENTIFIER,
      EngagementActionList,
      AlertTypes,
      KEYWORDSEARCH_DEBOUNCE_TIME,
      FAILED_USER_INITIALS_FALLBACK,
      DevWhitelist,
      NavigationModule,
      GlobalWorkflowTypes
    } from 'Core/constants/coreConstants.constant';
    import { selectAlertCounts, selectUserInitials } from 'Core/selectors/core.selectors';
    import {
      CoreLoadSecurityMap,
      CoreUserLoggedIn,
      CoreGlobalWorkflowSendNewState
    } from 'Core/actions/core.actions';
    import {
      SecurityTableHeaderConfigs,
      SECURITY_TABLE_FINAL_STAGE,
      SecurityTableHeaderConfigGroups,
      SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_START,
      SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_END,
      AggridSortOptions
    } from 'Core/constants/securityTableConstants.constant';
    import {
      SecurityDefinitionMap,
      FullOwnerList
    } from 'Core/constants/securityDefinitionConstants.constant';
    import {
      PortfolioShortcuts,
      OwnershipShortcuts,
      StrategyShortcuts
    } from 'Core/constants/tradeConstants.constant';
    import {
      selectLiveUpdateTick,
      selectInitialDataLoadedInMainTable,
      selectSecurityIDsFromAnalysis,
      selectBestQuoteValidWindow,
      selectNewAlertsForAlertTable,
      selectLiveUpdateProcessingRawDataToMainTable,
      selectKeywordSearchInMainTable,
      selectCenterPanelFilterListForTableLoad,
      selectBICSDataLoaded
    } from 'Trade/selectors/trade.selectors';
    import {
      TradeLiveUpdatePassRawDataToMainTableEvent,
      TradeLiveUpdateProcessDataCompleteInMainTableEvent,
      TradeSelectedSecurityForAnalysisEvent,
      TradeSecurityTableRowDTOListForAnalysisEvent,
      TradeSelectedSecurityForAlertConfigEvent,
      TradeTogglePresetEvent,
      TradeAlertTableReceiveNewAlertsEvent,
      TradeBICSDataLoadedEvent
    } from 'Trade/actions/trade.actions';
    import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
    import { SecurityMapService } from 'Core/services/SecurityMapService';
  //

@Component({
  selector: 'trade-center-panel',
  templateUrl: './trade-center-panel.container.html',
  styleUrls: ['./trade-center-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeCenterPanel implements OnInit, OnDestroy {
  state: PageStates.TradeCenterPanelState;
  subscriptions = {
    userInitialsSub: null,
    startNewUpdateSub: null,
    securityIDListFromAnalysisSub: null,
    validWindowSub: null,
    keywordSearchSub: null,
    receiveKeywordSearchInMainTable: null,
    selectCenterPanelFilterListForTableLoadSub: null
  };
  keywordChanged$: Subject<string> = new Subject<string>();
  constants = {
    defaultMetricIdentifier: DEFAULT_DRIVER_IDENTIFIER,
    portfolioShortcuts: PortfolioShortcuts,
    ownershipShortcuts: OwnershipShortcuts,
    strategyShortcuts: StrategyShortcuts,
    securityGroupDefinitionMap: SecurityDefinitionMap,
    securityTableFinalStage: SECURITY_TABLE_FINAL_STAGE,
    fullOwnerList: FullOwnerList,
    alertTypes: AlertTypes,
    keywordSearchDebounceTime: KEYWORDSEARCH_DEBOUNCE_TIME,
    userInitialsFallback: FAILED_USER_INITIALS_FALLBACK,
    devWhitelist: DevWhitelist,
    portolioMetricValues: PortfolioMetricValues,
    securityTableHeaderConfigGroups: SecurityTableHeaderConfigGroups,
    weigthHeaderNameDelimiterStart: SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_START,
    weigthHeaderNameDelimiterEnd: SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_END,
    sortOption: AggridSortOptions,
    defaultMetrics: SecurityTableHeaderConfigs,
    navigationModule: NavigationModule,
    globalWorkflowTypes: GlobalWorkflowTypes
  }

  private initializePageState(): PageStates.TradeCenterPanelState {
    const mainTableMetrics = this.constants.defaultMetrics.filter((eachStub) => {
      const targetSpecifics = eachStub.content.tableSpecifics.tradeMain || eachStub.content.tableSpecifics.default;
      return !targetSpecifics.disabled;
    });
    const state: PageStates.TradeCenterPanelState = {
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
        dto: this.dtoService.createSecurityDefinitionConfigurator(true, false, true),
        boosted: false
      },
      table: {
        metrics: this.utilityService.deepCopy(mainTableMetrics),
        dto: this.dtoService.formSecurityTableObject(true, true)
      },
      fetchResult: {
        fetchTableDataFailed: false,
        fetchTableDataFailedError: '',
        mainTable: {
          currentContentStage: 0,
          fetchComplete: false,
          rowList: [],
          prinstineRowList: [],
          liveUpdatedRowList: [],
          removalRowList: []
        },
        initialDataLoadedInternalSyncFlag: false
      },
      filters: {
        keyword: {
          defaultValueForUI: '',
          actualValue: ''
        },
        driverType: this.constants.defaultMetricIdentifier,
        quickFilters: {
          portfolios: [],
          owner: [],
          strategy: [],
          tenor: []
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
    private processingService: LiveDataProcessingService,
    private bicsDataProcessingService: BICsDataProcessingService,
    private securityMapService: SecurityMapService
  ) {
    this.state = this.initializePageState();
  }

  public ngOnInit() {
    this.state = this.initializePageState();
    this.subscriptions.startNewUpdateSub = this.store$.pipe(
      select(selectLiveUpdateTick),
      withLatestFrom(
        this.store$.pipe(select(selectInitialDataLoadedInMainTable))
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

    this.subscriptions.keywordSearchSub = this.keywordChanged$.pipe(
      debounceTime(this.constants.keywordSearchDebounceTime),
      distinctUntilChanged()
    ).subscribe((keyword) => {
      const targetTable = this.state.fetchResult.mainTable;
      if (!!keyword && keyword.length >= 2) {
        this.state.filters.keyword.actualValue = keyword;
        targetTable.rowList = this.filterPrinstineRowList(targetTable.prinstineRowList);
      } else if (!keyword || keyword.length < 2) {
        this.state.filters.keyword.actualValue = keyword;
        targetTable.rowList = this.filterPrinstineRowList(targetTable.prinstineRowList);
      }
    });

    this.subscriptions.receiveKeywordSearchInMainTable = this.store$.pipe(
      select(selectKeywordSearchInMainTable)
    ).subscribe((keyword) => {
      this.state.filters.keyword.defaultValueForUI = keyword;
      this.keywordChanged$.next(keyword);
    });

    this.subscriptions.userInitialsSub = this.store$.pipe(
      select(selectUserInitials)
    ).subscribe((userInitials) => {
      if (userInitials) {
        const matchedInitial = this.constants.fullOwnerList.find((eachInitial) => {
          return eachInitial === userInitials;
        });
        if (!!matchedInitial) {
          const filter = [];
          filter.push(userInitials);
          this.constants.ownershipShortcuts[0].includedDefinitions[0].selectedOptions = filter;
        } else {
          this.constants.ownershipShortcuts.splice(0, 1);
        }
        this.fetchBICsHierarchy();
      }
    });

    this.subscriptions.selectCenterPanelFilterListForTableLoadSub = this.store$.pipe(
      select(selectCenterPanelFilterListForTableLoad),
      combineLatest(
        this.store$.pipe(select(selectBICSDataLoaded))
      )
    ).subscribe(([pack, bicsLoaded]) => {
      if (!!pack) {
        const filterList = pack.filterList;
        const metric = pack.metric;
        if (!!filterList && filterList.length > 0 && bicsLoaded && !!metric) {
          this.autoLoadTable(filterList, metric);
        }
      }
    });
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }

  public onSelectPresetCategory(targetCategory: Array<DTOs.SearchShortcutDTO>) {
    if (this.state.presets.selectedList === targetCategory) {
      this.state.presets.selectedList = null;
    } else {
      this.state.presets.selectedList = targetCategory;
    }
  }

  public onSelectPreset(targetPreset: DTOs.SearchShortcutDTO) {
    if (this.state.presets.selectedPreset === targetPreset) {
      targetPreset.state.isSelected = false;
      this.state.presets.selectedPreset = null;
      this.state.configurator.dto = this.dtoService.resetSecurityDefinitionConfigurator(this.state.configurator.dto);
    } else {
      this.checkInitialPageLoadData();
      this.restfulCommService.logEngagement(
        EngagementActionList.selectPreset,
        'n/a',
        targetPreset.data.displayTitle,
        'Trade - Center Panel'
      );
      targetPreset.state.isSelected = true;
      this.state.presets.selectedPreset = targetPreset;
      this.state.configurator.dto = this.utilityService.applyShortcutToConfigurator(targetPreset, this.state.configurator.dto);
      const params = this.utilityService.packDefinitionConfiguratorEmitterParams(this.state.configurator.dto);
      this.onApplyFilter(params, false);
      this.loadFreshData();
    }
    this.store$.dispatch(new TradeTogglePresetEvent);
  }

  public onUnselectPreset(captureNewState: boolean) {
    const newState = this.initializePageState();
    this.state.presets.selectedPreset.state.isSelected = false;
    this.state.presets.selectedPreset = null;
    this.state.configurator.dto = this.dtoService.resetSecurityDefinitionConfigurator(this.state.configurator.dto);
    this.state.table.metrics = this.utilityService.deepCopy(this.constants.defaultMetrics).filter((eachStub) => {
      const targetSpecifics = eachStub.content.tableSpecifics.tradeMain || eachStub.content.tableSpecifics.default;
      return !targetSpecifics.disabled;
    });
    this.state.filters = newState.filters;
    this.state.fetchResult = newState.fetchResult;
    this.store$.dispatch(new TradeTogglePresetEvent);
    if (!!captureNewState) {
      const newWorkflowState = this.dtoService.formGlobalWorkflow(this.constants.navigationModule.trade, false, this.constants.globalWorkflowTypes.unselectPreset);
      this.store$.dispatch(new CoreGlobalWorkflowSendNewState(newWorkflowState));
    }
  }

  public buryConfigurator() {
    this.state.configurator.boosted = false;
  }

  public boostConfigurator() {
    this.state.configurator.boosted = true;
  }

  public onSwitchDriver(targetDriver) {
    if (this.state.filters.driverType !== targetDriver) {
      this.restfulCommService.logEngagement(
        EngagementActionList.switchDriver,
        'n/a',
        targetDriver,
        'Trade - Center Panel'
      );
      this.state.filters.driverType = targetDriver;
      // driver update needs to be to both tables
      const newMetrics: Array<Stubs.SecurityTableHeaderConfigStub> = this.utilityService.deepCopy(this.state.table.metrics);
      newMetrics.forEach((eachMetricStub) => {
        if (eachMetricStub.content.isDriverDependent && eachMetricStub.content.isAttrChangable) {
          if (targetDriver === this.constants.defaultMetricIdentifier) {
            eachMetricStub.content.attrName = targetDriver;
            eachMetricStub.content.underlineAttrName = targetDriver;
          } else {
            eachMetricStub.content.attrName = TriCoreDriverConfig[targetDriver].driverLabel;
            eachMetricStub.content.underlineAttrName = TriCoreDriverConfig[targetDriver].driverLabel;
          }
        }
      });
      this.state.table.metrics = newMetrics;
    }
  }

  public onApplyFilter(params: AdhocPacks.DefinitionConfiguratorEmitterParams, logEngagement: boolean) {
    this.state.filters.securityFilters = params.filterList;
    this.state.filters.quickFilters = this.initializePageState().filters.quickFilters;
    params.filterList.forEach((eachFilter) => {
      if (eachFilter.targetAttribute === 'portfolios') {
        this.state.filters.quickFilters.portfolios = eachFilter.filterBy;
      } else if (eachFilter.targetAttribute === 'owner') {
        this.state.filters.quickFilters.owner = eachFilter.filterBy;
      } else if (eachFilter.targetAttribute === 'strategyList') {
        this.state.filters.quickFilters.strategy = eachFilter.filterBy;
      } else if (eachFilter.targetAttribute === 'tenor') {
        this.state.filters.quickFilters.tenor = eachFilter.filterByBlocks.map((eachFilterBlock) => {
          return eachFilterBlock.shortKey;
        });
      }
    });
    this.state.fetchResult.mainTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.mainTable.prinstineRowList);
    if (this.state.filters.quickFilters.portfolios.length === 1) {
      this.modifyWeightColumnHeadersUpdateFundName();
    }
    if (!!logEngagement) {
      let filterValue = '';
      params.filterList.forEach((eachFilter) => {
        filterValue = `${filterValue} | ${eachFilter.targetAttribute}: ${eachFilter.filterBy.toString()}`; 
      });
      this.restfulCommService.logEngagement(
        EngagementActionList.applyFilter,
        'n/a',
        `Filter By : ${filterValue}`,
        'Trade - Center Panel'
      );
    }
  }

  public onSelectSecurityForAnalysis(targetSecurity: DTOs.SecurityDTO) {
    this.store$.dispatch(new TradeSelectedSecurityForAnalysisEvent(this.utilityService.deepCopy(targetSecurity)));
    this.restfulCommService.logEngagement(
      EngagementActionList.selectSecurityForAnalysis,
      targetSecurity.data.securityID,
      'n/a',
      'Trade - Center Panel'
    );
  }

  public onSelectSecurityForAlertConfig(targetSecurity: DTOs.SecurityDTO) {
    this.store$.dispatch(new TradeSelectedSecurityForAlertConfigEvent(this.utilityService.deepCopy(targetSecurity)));
  }

  public openLinkForCertificate() {
    window.open('https://rpiadev01:1225/portfolio/get-credit-positions');
  }

  public refreshAfterOpenLink() {
    window.location.reload(false);
  }

  public onSearchKeywordChange(newKeyword: string) {
    this.keywordChanged$.next(newKeyword);
  }

  private fetchBICsHierarchy() {
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getBICsCodeDictionary, {req: 'GET'}).pipe(
      first(),
      tap((serverReturn: BEBICsHierarchyBlock) => {
        if (!!serverReturn) {
          this.bicsDataProcessingService.loadBICSData(serverReturn, {children: []});
          this.dtoService.loadBICSOptionsIntoConfigurator(
            this.state.configurator.dto,
            this.bicsDataProcessingService.returnAllBICSBasedOnHierarchyDepth(1),
            this.bicsDataProcessingService.returnAllBICSBasedOnHierarchyDepth(2),
            this.bicsDataProcessingService.returnAllBICSBasedOnHierarchyDepth(3),
            this.bicsDataProcessingService.returnAllBICSBasedOnHierarchyDepth(4)
          )
          this.populateSearchShortcuts();
          this.store$.dispatch(new TradeBICSDataLoadedEvent());
        }
      }),
      catchError(err => {
        this.restfulCommService.logError('Cannot retrieve BICs hierarchy data');
        return of('error');
      })
    ).subscribe()
  }

  private populateSearchShortcuts() {
    this.state.presets = this.initializePageState().presets;
    this.state.presets.portfolioShortcutList = this.populateSingleShortcutList(this.constants.portfolioShortcuts);
    this.state.presets.ownershipShortcutList = this.populateSingleShortcutList(this.constants.ownershipShortcuts);
    this.state.presets.strategyShortcutList = this.populateSingleShortcutList(this.constants.strategyShortcuts);
    this.state.presets.presetsReady = true;
  }

  private populateSingleShortcutList(
    stubList: Array<Stubs.SearchShortcutStub>
  ): Array<DTOs.SearchShortcutDTO> {
    const list: Array<DTOs.SearchShortcutDTO> = [];
    stubList.forEach((eachShortcutStub) => {
      const definitionList = eachShortcutStub.includedDefinitions.map((eachIncludedDef) => {
        const definitionDTO = this.dtoService.formSecurityDefinitionObject(this.constants.securityGroupDefinitionMap[eachIncludedDef.definitionKey]);
        definitionDTO.state.groupByActive = !!eachIncludedDef.groupByActive;
        if (eachIncludedDef.selectedOptions.length > 0) {
          definitionDTO.state.filterActive = true;
          definitionDTO.data.displayOptionList.forEach((eachFilterOption) => {
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
    this.state.fetchResult.mainTable.prinstineRowList = [];
    this.loadInitialStencilTable();
    this.updateStage(0, this.state.fetchResult.mainTable, this.state.table.dto);
    this.fetchAllData(true);
  }

  private loadInitialStencilTable() {
    const stencilMainTableHeaderBuffer: Array<DTOs.SecurityTableHeaderDTO> = [];
    this.state.table.metrics.forEach((eachStub) => {
      const targetSpecifics = eachStub.content.tableSpecifics.tradeMain || eachStub.content.tableSpecifics.default;
      if (eachStub.content.isForSecurityCard || targetSpecifics.active) {
        stencilMainTableHeaderBuffer.push(this.dtoService.formSecurityTableHeaderObject(eachStub, 'tradeMain', []));
      }
    });
    for (let i = 0; i < 10; ++i) {
      const stencilSecurity = this.dtoService.formSecurityCardObject(null, null, true, false);
      stencilSecurity.state.isInteractionDisabled = true;
      const newMainTableRow = this.dtoService.formSecurityTableRowObject(stencilSecurity, null, false);
      stencilMainTableHeaderBuffer.forEach((eachHeader) => {
        if (!eachHeader.state.isSecurityCardVariant) {
          if (eachHeader.state.isBestQuoteVariant) {
            const bestQuoteStencil = this.dtoService.formBestQuoteComparerObject(true, this.state.filters.driverType, null, null, false);
            newMainTableRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, eachHeader, bestQuoteStencil, null));
          } else {
            newMainTableRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, eachHeader, null, null));
          }
        }
      });
      this.state.fetchResult.mainTable.prinstineRowList.push(this.utilityService.deepCopy(newMainTableRow));
    };
    this.state.fetchResult.mainTable.rowList = this.utilityService.deepCopy(this.state.fetchResult.mainTable.prinstineRowList);
  }

  private fetchAllData(isInitialFetch: boolean) {
    this.fetchDataForMainTable(isInitialFetch);
  }

  private fetchDataForMainTable(isInitialFetch: boolean) {
    const payload: PayloadGetTradeFullData = {
      maxNumberOfSecurities: 2000,
      groupIdentifier: {},
      groupFilters: {
        PortfolioShortName: ["DOF","SOF","STIP","FIP","CIP","AGB","BBB"]
        // SecurityIdentifier: ['17163', '338|5Y']
      }
    };
    if (!!this.state.bestQuoteValidWindow) {
      payload.lookbackHrs = this.state.bestQuoteValidWindow;
    }
    this.state.fetchResult.mainTable.fetchComplete = false;
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getPortfolios, { req: 'POST' }, payload, false, false).pipe(
      first(),
      tap((serverReturn) => {
        if (!isInitialFetch) {
          this.store$.dispatch(new TradeLiveUpdatePassRawDataToMainTableEvent());
        } else {
          this.updateStage(0, this.state.fetchResult.mainTable, this.state.table.dto);
        }
        this.loadDataForMainTable(serverReturn);
      }),
      catchError(err => {
        this.restfulCommService.logError(`Get portfolios failed`);
        this.store$.dispatch(new TradeLiveUpdatePassRawDataToMainTableEvent());
        this.store$.dispatch(new TradeLiveUpdateProcessDataCompleteInMainTableEvent());
        this.updateStage(this.constants.securityTableFinalStage, this.state.fetchResult.mainTable, this.state.table.dto);
        console.error('error', err);
        this.state.fetchResult.fetchTableDataFailed = true;
        this.state.fetchResult.fetchTableDataFailedError = err.message;
        this.state.fetchResult.mainTable.prinstineRowList = [];
        this.state.fetchResult.mainTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.mainTable.prinstineRowList);
        return of('error');
      })
    ).subscribe();
  }

  private loadDataForMainTable(serverReturn: BEFetchAllTradeDataReturn) {
    this.state.fetchResult.mainTable.prinstineRowList = [];  // flush out the stencils
    this.state.fetchResult.mainTable.prinstineRowList = this.processingService.loadFinalStageData(
      this.state.table.dto.data.headers,
      this.state.filters.driverType,
      serverReturn,
      this.onSelectSecurityForAnalysis.bind(this),
      this.onSelectSecurityForAlertConfig.bind(this),
      this.state.filters
    );
    this.calculateBestQuoteComparerWidthAndHeight();
    this.state.fetchResult.mainTable.fetchComplete = true;
    this.updateStage(this.constants.securityTableFinalStage, this.state.fetchResult.mainTable, this.state.table.dto);
  }

  private updateStage(
    stageNumber: number,
    targetTableBlock: Blocks.TableFetchResultBlock,
    targetTableDTO: DTOs.SecurityTableDTO
  ) {
    targetTableBlock.currentContentStage = stageNumber;
    if (targetTableBlock.currentContentStage === this.constants.securityTableFinalStage) {
      this.store$.pipe(
        select(selectInitialDataLoadedInMainTable),
        withLatestFrom(
          this.store$.pipe(select(selectLiveUpdateProcessingRawDataToMainTable))
        ),
        first(),
        tap(([isInitialDataLoaded, processingRawData]) => {
          if (isInitialDataLoaded && this.state.fetchResult.initialDataLoadedInternalSyncFlag) {
            const newFilteredList = this.filterPrinstineRowList(targetTableBlock.prinstineRowList);
            targetTableBlock.liveUpdatedRowList = this.processingService.returnDiff(targetTableDTO, newFilteredList).newRowList;
          } else {
            targetTableBlock.rowList = this.filterPrinstineRowList(targetTableBlock.prinstineRowList);
            this.state.fetchResult.initialDataLoadedInternalSyncFlag = true;
          }
          // only dispatch the action when both tables are done
          if (!!this.state.fetchResult.mainTable.fetchComplete) {
            this.store$.dispatch(new TradeLiveUpdateProcessDataCompleteInMainTableEvent());
          }
        })
      ).subscribe();
    }
  }

  private filterPrinstineRowList(
    targetPrinstineList: Array<DTOs.SecurityTableRowDTO>
  ): Array<DTOs.SecurityTableRowDTO> {
    return this.processingService.filterPrinstineRowList(targetPrinstineList, this.state.filters);
  }

  private calculateBestQuoteComparerWidthAndHeight() {
    const bestSpreadList = [];
    const bestPriceList = [];
    const bestYieldList = [];
    const combinedRowList = this.state.fetchResult.mainTable.prinstineRowList;
    combinedRowList.forEach((eachRow) => {
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
    this.utilityService.calculateBestQuoteComparerWidthAndHeightPerSet(bestSpreadList);
    this.utilityService.calculateBestQuoteComparerWidthAndHeightPerSet(bestYieldList);
    this.utilityService.calculateBestQuoteComparerWidthAndHeightPerSet(bestPriceList);
  }

  private processSecurityIDsFromAnalysis(securityIDList: any[]) {
    const targetTable = this.state.fetchResult.mainTable;
    if (securityIDList) {
      if (securityIDList.length > 0) {
        let securityTableRowDTOList: Array<DTOs.SecurityTableRowDTO> = [];
        for (let securityTableRowDTO in targetTable.prinstineRowList) {
          for (let securityID of securityIDList) {
            if (targetTable.prinstineRowList[securityTableRowDTO].data.security.data.securityID === securityID) {
              securityTableRowDTOList.push(targetTable.prinstineRowList[securityTableRowDTO])
            }
          }
        }

        this.store$.dispatch(new TradeSecurityTableRowDTOListForAnalysisEvent(this.utilityService.deepCopy(securityTableRowDTOList)));
      }
    }
  }

  private checkInitialPageLoadData() {
    this.store$.pipe(
      first(),
      select(selectUserInitials)
    ).subscribe((userInitials) => {
      // use userInitial as an indicator for whether the inital page load data was fetched successfully, since it should be the last API to fail
      if (userInitials === this.constants.userInitialsFallback) {
        this.fetchSecurityMap();
        this.fetchOwnerInitial();
      }
    });
  }

  private fetchOwnerInitial() {
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getUserInitials, {req: 'GET'}).pipe(
      first(),
      tap((serverReturn) => {
        this.loadOwnerInitial(serverReturn);
      }),
      catchError(err => {
        if (!!err && !!err.error && !!err.error.text) {
          this.loadOwnerInitial(err.error.text);
        } else {
          this.loadOwnerInitial(this.constants.userInitialsFallback);
          this.restfulCommService.logError(`Can not find user, error`);
        }
        return of('error');
      })
    ).subscribe();
  }

  private loadOwnerInitial(serverReturn: string) {
    const ownerInitials = this.constants.devWhitelist.indexOf(serverReturn) !== -1 ? 'DM' : serverReturn;
    this.restfulCommService.updateUser(ownerInitials);
    this.store$.dispatch(new CoreUserLoggedIn(ownerInitials));
  }

  private fetchSecurityMap() {
    // this first call happens in app.root.ts, this function is only called when the first call fails due to BE server being unavail
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getSecurityIdMap, {req: 'GET'}).pipe(
      first(),
      tap((serverReturn: BESecurityMap) => {
        if (!!serverReturn) {
          this.securityMapService.storeSecurityMap(serverReturn);
          const map = this.securityMapService.getSecurityMap();
          this.store$.dispatch(new CoreLoadSecurityMap(map));
        } else {
          this.restfulCommService.logError('Failed to load SecurityId map, can not populate alert configuration');
        }
      })
    ).subscribe();
  }

  private autoLoadTable(
    filterList: Array<DTOs.SecurityDefinitionDTO>,
    portfolioMetric: PortfolioMetricValues
  ) {
    if (!!this.state.presets.selectedPreset) {
      this.onUnselectPreset(false);
      const delayToLoad = 1;  // the actual load needs to be executed on a delay because we need to give time for agGrid to react on santaTable's "activated" flag being set to false, this way when the autoLoadTable actually set it to "true" again, it will rebuild the header, otherwise the headers won't be rebuild. The time it takes for agGrid to react is trivial, we just need to wait for a single frame
      setTimeout(
        function(){
          this.autoLoadTablePerformLoad(filterList, portfolioMetric);
        }.bind(this),
        delayToLoad
      );
    } else {
      this.autoLoadTablePerformLoad(filterList, portfolioMetric);
    }
  }

  private autoLoadTablePerformLoad(
    filterList: Array<DTOs.SecurityDefinitionDTO>,
    portfolioMetric: PortfolioMetricValues
  ){
    this.onSelectPreset(this.state.presets.portfolioShortcutList[0]);
    filterList.forEach((eachFilterDefinition) => {
      this.state.configurator.dto.data.definitionList.forEach((eachBundle) => {
        eachBundle.data.list.forEach((eachDefinition) => {
          if (eachDefinition.data.key === eachFilterDefinition.data.key) {
            // deepCopy is necessary because the array was already set to readonly because it's from the store
            eachDefinition.data.highlightSelectedOptionList = this.utilityService.deepCopy(eachFilterDefinition.data.highlightSelectedOptionList);
            eachDefinition.data.highlightSelectedOptionList.forEach((eachHighlightedFilterOption) => {
              const findMatchInFilterOptionList = eachDefinition.data.displayOptionList.find((eachFilterOption) => {
                return eachFilterOption.shortKey === eachHighlightedFilterOption.shortKey;
              });
              if (!!findMatchInFilterOptionList) {
                findMatchInFilterOptionList.isSelected = true;
              } else {
                // it's common for BICS to not find the selected option from the entire option list, because the option list only contain level.1 on default. This is already handled at the convertSecurityDefinitionConfiguratorBICSOptionsEmitterParamsToCode() level
              }
            });
            eachDefinition.state.filterActive = true;
          }
        });
      })
    });
    const params = this.utilityService.packDefinitionConfiguratorEmitterParams(this.state.configurator.dto);
    this.bicsDataProcessingService.convertSecurityDefinitionConfiguratorBICSOptionsEmitterParamsToCode(params);
    this.modifyWeightColumnHeadersUpdateActiveAndPinState(portfolioMetric);
    this.onApplyFilter(params, false);
  }

  private modifyWeightColumnHeadersUpdateFundName() {
    const targetFund = this.state.filters.quickFilters.portfolios[0];
    this.state.table.metrics.forEach((eachHeader) => {
      if (eachHeader.key === 'weightFundCS01') {
        let newLabel = eachHeader.content.label;
        newLabel = newLabel.replace(this.constants.weigthHeaderNameDelimiterStart, '|');
        newLabel = newLabel.replace(this.constants.weigthHeaderNameDelimiterEnd, '|');
        const array = newLabel.split('|');
        if (array.length === 3) {
          eachHeader.content.label = array[0].concat(` ${this.constants.weigthHeaderNameDelimiterStart}${targetFund}${this.constants.weigthHeaderNameDelimiterEnd}`).concat(array[2]);
        }
      }
      if (eachHeader.key === 'weightFundBEV') {
        let newLabel = eachHeader.content.label;
        newLabel = newLabel.replace(this.constants.weigthHeaderNameDelimiterStart, '|');
        newLabel = newLabel.replace(this.constants.weigthHeaderNameDelimiterEnd, '|');
        const array = newLabel.split('|');
        if (array.length === 3) {
          eachHeader.content.label = array[0].concat(` ${this.constants.weigthHeaderNameDelimiterStart}${targetFund}${this.constants.weigthHeaderNameDelimiterEnd} `).concat(array[2]);
        }
      }
    });
    // trigger the ngOnChanges in santa table
    this.state.table.metrics = this.utilityService.deepCopy(this.state.table.metrics);
  }

  private modifyWeightColumnHeadersUpdateActiveAndPinState(targetMetric: PortfolioMetricValues) {
    const fundCS01Header = this.state.table.metrics.find((eachHeaderMetric) => {
      return eachHeaderMetric.key === 'weightFundCS01';
    });
    const tableCS01Header = this.state.table.metrics.find((eachHeaderMetric) => {
      return eachHeaderMetric.key === 'weightTableCS01';
    });
    const fundBEVHeader = this.state.table.metrics.find((eachHeaderMetric) => {
      return eachHeaderMetric.key === 'weightFundBEV';
    });
    const tableBEVHeader = this.state.table.metrics.find((eachHeaderMetric) => {
      return eachHeaderMetric.key === 'weightTableBEV';
    });
    if (targetMetric === this.constants.portolioMetricValues.cs01) {
      fundCS01Header.content.tableSpecifics.default = {
        pinned: true,
        active: true,
        groupShow: true,
        sortActivated: this.constants.sortOption.desc
      };
      tableCS01Header.content.tableSpecifics.default = {
        pinned: true,
        active: true,
        groupShow: true,
        sortActivated: null
      };
      fundBEVHeader.content.tableSpecifics.default = {
        pinned: true,
        active: true,
        groupShow: false,
        sortActivated: null
      };
      tableBEVHeader.content.tableSpecifics.default = {
        pinned: true,
        active: true,
        groupShow: false,
        sortActivated: null
      };
    } else if (targetMetric === this.constants.portolioMetricValues.creditLeverage) {
      fundCS01Header.content.tableSpecifics.default = {
        pinned: true,
        active: true,
        groupShow: false,
        sortActivated: null
      };
      tableCS01Header.content.tableSpecifics.default = {
        pinned: true,
        active: true,
        groupShow: false,
        sortActivated: null
      };
      fundBEVHeader.content.tableSpecifics.default = {
        pinned: true,
        active: true,
        groupShow: true,
        sortActivated: this.constants.sortOption.desc
      };
      tableBEVHeader.content.tableSpecifics.default = {
        pinned: true,
        active: true,
        groupShow: true,
        sortActivated: null
      };
    }
    // trigger the ngOnChanges in santa table, normally would be already triggered by modifyWeightColumnHeadersUpdateFundName(), so this is just defensive programming
    this.state.table.metrics = this.utilityService.deepCopy(this.state.table.metrics);
  }
}
