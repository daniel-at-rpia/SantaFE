  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { Router } from '@angular/router';
    import { of, Subscription, Subject, Observable } from 'rxjs';
    import { catchError, first, tap, withLatestFrom, combineLatest, debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import { DTOs, Blocks, PageStates, AdhocPacks, Stubs } from 'Core/models/frontend';
    import {
      DTOService,
      UtilityService,
      RestfulCommService,
      BICSDataProcessingService,
      GlobalWorkflowIOService,
      BICSDictionaryLookupService
    } from 'Core/services';
    import { SantaContainerComponentBase } from 'Core/containers/santa-container-component-base';
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
      GlobalWorkflowTypes,
      IndexedDBActions
    } from 'Core/constants/coreConstants.constant';
    import { selectAlertCounts, selectUserInitials } from 'Core/selectors/core.selectors';
    import {
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
      StrategyShortcuts,
      DISPLAY_DRIVER_MAP,
      TrendingShortcuts,
      INDEXEDDB_WATCHLIST_VERSION,
      INDEXEDDB_WATCHLIST_DATABASE_NAME,
      INDEXEDDB_WATCHLIST_RECENT_TABLE_NAME,
      INDEXEDDB_WATCHLIST_SAVED_TABLE_NAME,
      UoBWatchListType
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
      selectBICSDataLoaded,
      selectWatchlistIndexedDBReady
    } from 'Trade/selectors/trade.selectors';
    import {
      TradeLiveUpdatePassRawDataToMainTableEvent,
      TradeLiveUpdateProcessDataCompleteInMainTableEvent,
      TradeSelectedSecurityForAnalysisEvent,
      TradeSecurityTableRowDTOListForAnalysisEvent,
      TradeSelectedSecurityForAlertConfigEvent,
      TradeTogglePresetEvent,
      TradeAlertTableReceiveNewAlertsEvent,
      TradeBICSDataLoadedEvent,
      TradeLiveUpdateInitiateNewDataFetchFromBackendInMainTableEvent
    } from 'Trade/actions/trade.actions';
    import { PortfolioMetricValues } from 'Core/constants/structureConstants.constants';
    import { SecurityMapService } from 'Core/services/SecurityMapService';
    import { IndexedDBService } from 'Core/services/IndexedDBService';
    import * as moment from 'moment';
  //

@Component({
  selector: 'trade-center-panel',
  templateUrl: './trade-center-panel.container.html',
  styleUrls: ['./trade-center-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeCenterPanel extends SantaContainerComponentBase implements OnInit {
  private watchlistIndexedDBAPI: AdhocPacks.IndexedDBAPIBlock = {
    api: null
  }
  state: PageStates.TradeCenterPanelState;
  subscriptions = {
    userInitialsSub: null,
    startNewUpdateSub: null,
    securityIDListFromAnalysisSub: null,
    validWindowSub: null,
    keywordSearchSub: null,
    receiveKeywordSearchInMainTable: null,
    selectCenterPanelFilterListForTableLoadSub: null,
    indexedDBReadySub: null
  };
  keywordChanged$: Subject<string> = new Subject<string>();
  constants = {
    defaultMetricIdentifier: DEFAULT_DRIVER_IDENTIFIER,
    portfolioShortcuts: PortfolioShortcuts,
    ownershipShortcuts: OwnershipShortcuts,
    strategyShortcuts: StrategyShortcuts,
    trendingShortcuts: TrendingShortcuts,
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
    globalWorkflowTypes: GlobalWorkflowTypes,
    displayDriverMap: DISPLAY_DRIVER_MAP,
    idbVersion: INDEXEDDB_WATCHLIST_VERSION,
    idbWatchlistDbName: INDEXEDDB_WATCHLIST_DATABASE_NAME,
    idbWatchlistRecentTableName: INDEXEDDB_WATCHLIST_RECENT_TABLE_NAME,
    idbWatchlistSavedTableName: INDEXEDDB_WATCHLIST_SAVED_TABLE_NAME,
    watchlistType: UoBWatchListType,
    indexedDBAction: IndexedDBActions
  }
  private indexedDBTableBlockItems: Array<AdhocPacks.IndexedDBTableBlockItem> = [
    {
      name: this.constants.idbWatchlistRecentTableName,
      key: 'uuid'
    }
  ]
  private initializePageState(): PageStates.TradeCenterPanelState {
    const existingRecentWatchlist = this.state && this.state.presets ? this.state.presets.recentWatchlistShortcutList : [];
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
        selectedCategoryFromTop: false,
        selectedCategoryFromBottom: false,
        portfolioShortcutList: [],
        ownershipShortcutList: [],
        strategyShortcutList: [],
        recentWatchlistShortcutList: existingRecentWatchlist,
        savedWatchlistShortcutList: [],
        trendingWatchlistShortcutList: []
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
        initialDataLoadedInternalSyncFlag: false,
        totalCount: 0,
        lastFetchBucket: null,
        lastFetchServerReturn: null
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
      },
      editingDriver: false,
      currentSearch: {
        previewShortcut: null,
        redirectedFromStrurturing: false
      },
      isIndexedDBReady: false
    };

    return state;
  }

  constructor(
    protected utilityService: UtilityService,
    protected globalWorkflowIOService: GlobalWorkflowIOService,
    protected router: Router,
    private store$: Store<any>,
    private dtoService: DTOService,
    private restfulCommService: RestfulCommService,
    private processingService: LiveDataProcessingService,
    private bicsDataProcessingService: BICSDataProcessingService,
    private securityMapService: SecurityMapService,
    private bicsDictionaryLookupService: BICSDictionaryLookupService,
    private indexedDBService: IndexedDBService
  ) {
    super(utilityService, globalWorkflowIOService, router);
    this.state = this.initializePageState();
  }

  public ngOnInit() {
    this.state = this.initializePageState();
    const openRequest = this.indexedDBService.openRequestToIndexDBDatabase(this.constants.idbWatchlistDbName, this.constants.idbVersion);
    const indexedDBTableBlock: AdhocPacks.IndexedDBTableBlock = this.indexedDBService.createTableBlock(this.indexedDBTableBlockItems);
    indexedDBTableBlock && this.indexedDBService.initiateIndexedDBRequestHandler(openRequest, this.watchlistIndexedDBAPI, this.constants.idbWatchlistDbName, indexedDBTableBlock, this.constants.indexedDBAction.TradeWatchlist);
    this.subscriptions.startNewUpdateSub = this.store$.pipe(
      filter((tick) => {
        return this.stateActive;
      }),
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
      filter((data) => {
        return this.stateActive;
      }),
      select(selectSecurityIDsFromAnalysis)
    ).subscribe((data) => {
      this.processSecurityIDsFromAnalysis(data)
    });

    this.subscriptions.validWindowSub = this.store$.pipe(
      filter((window) => {
        return this.stateActive;
      }),
      select(selectBestQuoteValidWindow)
    ).subscribe((window) => {
      this.state.bestQuoteValidWindow = window;
    });

    this.subscriptions.keywordSearchSub = this.keywordChanged$.pipe(
      filter((keyword) => {
        return this.stateActive;
      }),
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
      filter((keyword) => {
        return this.stateActive;
      }),
      select(selectKeywordSearchInMainTable)
    ).subscribe((keyword) => {
      this.state.filters.keyword.defaultValueForUI = keyword;
      this.keywordChanged$.next(keyword);
    });

    this.subscriptions.userInitialsSub = this.store$.pipe(
      filter((userInitials) => {
        return this.stateActive;
      }),
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
      filter((pack) => {
        return this.stateActive;
      }),
      select(selectCenterPanelFilterListForTableLoad),
      combineLatest(
        this.store$.pipe(select(selectBICSDataLoaded))
      )
    ).subscribe(([pack, bicsLoaded]) => {
      if (!!pack && !!this.stateActive) {
        const filterList = pack.filterList;
        const metric = pack.metric;
        if (!!filterList && filterList.length > 0 && bicsLoaded && !!metric) {
          this.autoLoadTable(filterList, metric, pack.presetDisplayTitle);
        }
      }
    });

    return super.ngOnInit();
  }

  public onSelectPresetCategory(
    targetCategory: Array<DTOs.SearchShortcutDTO>,
    fromTop: boolean
  ) {
    if (this.state.presets.selectedList === targetCategory) {
      this.state.presets.selectedList = null;
      if (fromTop) {
        this.state.presets.selectedCategoryFromTop = false;
      } else {
        this.state.presets.selectedCategoryFromBottom = false
      }
    } else {
      this.state.presets.selectedList = targetCategory;
      if (fromTop) {
        this.state.presets.selectedCategoryFromTop = true;
        this.state.presets.selectedCategoryFromBottom = false;
      } else {
        this.state.presets.selectedCategoryFromBottom = true;
        this.state.presets.selectedCategoryFromTop = false;
      }
    }
  }

  public onSelectPreset(
    targetPreset: DTOs.SearchShortcutDTO,
    userTriggered: boolean
  ) {
    if (this.state.presets.selectedPreset === targetPreset) {
      targetPreset.state.isSelected = false;
      this.state.presets.selectedPreset = null;
      this.state.currentSearch.previewShortcut = null;
      this.state.configurator.dto = this.dtoService.resetSecurityDefinitionConfigurator(this.state.configurator.dto);
    } else {
      targetPreset.state.isSelected = true;
      this.state.presets.selectedPreset = targetPreset;
      const previewCopy: DTOs.SearchShortcutDTO = this.utilityService.deepCopy(targetPreset);
      previewCopy.state.isPreviewVariant = true;
      previewCopy.state.isSelected = false;
      previewCopy.state.isUserInputBlocked = true;
      this.state.currentSearch.previewShortcut = previewCopy;
      this.state.configurator.dto.data = this.utilityService.applyShortcutToConfigurator(targetPreset, this.state.configurator.dto).data;
      this.checkInitialPageLoadData();
      if (userTriggered) {
        this.restfulCommService.logEngagement(
          EngagementActionList.selectPreset,
          'n/a',
          targetPreset.data.displayTitle,
          'Trade - Center Panel'
        );
        const params = this.utilityService.packDefinitionConfiguratorEmitterParams(this.state.configurator.dto);
        this.bicsDataProcessingService.convertSecurityDefinitionConfiguratorBICSOptionsEmitterParamsToCode(params);
        this.onApplyFilter(params, false);
        this.loadFreshData();
      }
    }
    this.store$.dispatch(new TradeTogglePresetEvent);
  }

  public onUnselectPreset() {
    this.performUnselectPresetInBackground();
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
      this.state.editingDriver = false;
    }
  }

  public onApplyFilter(
    params: AdhocPacks.DefinitionConfiguratorEmitterParams,
    userTriggered: boolean
  ) {
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
    const isUoBWatchlist = this.checkIfUoBWatchList();
    if (isUoBWatchlist) {
      this.storeRecentWatchList(params);
    }
    // just comment it out because we will bring it back in some way in a later task
    // this.state.fetchResult.mainTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.mainTable.prinstineRowList);
    if (this.state.filters.quickFilters.portfolios.length === 1) {
      this.modifyWeightColumnHeadersUpdateFundName();
    }
    if (!!userTriggered) {
      this.store$.dispatch(new TradeLiveUpdateInitiateNewDataFetchFromBackendInMainTableEvent());
      this.loadFreshData();
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

  public onEditDriver() {
    this.state.editingDriver = true;
  }

  private fetchBICsHierarchy() {
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getBICsCodeDictionary, {req: 'GET'}).pipe(
      first(),
      tap((serverReturn: BEBICsHierarchyBlock) => {
        if (!!serverReturn) {
          this.bicsDataProcessingService.loadBICSData(
            serverReturn, 
            {children: []},
            this.state.configurator.dto
          );
          this.populateSearchShortcuts();
          this.subscriptions.indexedDBReadySub = this.store$.pipe(
            select(selectWatchlistIndexedDBReady)
          ).subscribe((isReady) => {
            this.state.isIndexedDBReady = isReady;
            if (isReady) {
              this.indexedDBService.retrieveAndGetAllIndexedDBData(this.constants.idbWatchlistRecentTableName, this.watchlistIndexedDBAPI.api, `${this.constants.indexedDBAction.TradeWatchlist} Get All Recent Watchlist`, true).pipe(
                first()
              ).subscribe((storedRecentWatchlists: Array<DTOs.UoBWatchlistDTO>) => {
                if (storedRecentWatchlists.length > 0) {
                  const displayedRecentWatchLists: Array<DTOs.SearchShortcutDTO> = storedRecentWatchlists.map((watchlist: DTOs.UoBWatchlistDTO) => ({...watchlist.data.searchShortcut}));
                  this.state.presets.recentWatchlistShortcutList = [...this.state.presets.recentWatchlistShortcutList, ...displayedRecentWatchLists];
                }
              })
            }
          })
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
    this.state.presets.trendingWatchlistShortcutList = this.populateSingleShortcutList(this.constants.trendingShortcuts);
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
          if (this.constants.securityGroupDefinitionMap[eachIncludedDef.definitionKey].optionList.length === 0) {
            definitionDTO.data.highlightSelectedOptionList = eachIncludedDef.selectedOptions.map((eachOption) => {
                const bicsLevel = eachIncludedDef.definitionKey === this.constants.securityGroupDefinitionMap.BICS_CONSOLIDATED.key ? Math.floor(eachOption.length/2) : null;
                const optionValue = this.constants.securityGroupDefinitionMap[eachIncludedDef.definitionKey].securityDTOAttrBlock === 'bics' ? this.bicsDictionaryLookupService.BICSCodeToBICSName(eachOption) : eachOption;
                const selectedOption = this.dtoService.generateSecurityDefinitionFilterIndividualOption(
                  eachIncludedDef.definitionKey,
                  optionValue,
                  bicsLevel
                );
                selectedOption.isSelected = true;
                return selectedOption;
            });
          } else {
            definitionDTO.data.displayOptionList.forEach((eachFilterOption) => {
              if (eachIncludedDef.selectedOptions.indexOf(eachFilterOption.shortKey) >= 0) {
                eachFilterOption.isSelected = true;
                definitionDTO.data.highlightSelectedOptionList.push(eachFilterOption);
              }
            });
          }
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
    this.state.fetchResult.initialDataLoadedInternalSyncFlag = false;
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
    const packedGroupFilters = this.utilityService.getSimpleBucketFromConfigurator({filterList: this.state.filters.securityFilters});
    if (isInitialFetch && this.existFetchResultContainsNewSearchFilters(packedGroupFilters)) {
      this.updateStage(0, this.state.fetchResult.mainTable, this.state.table.dto);
      this.loadDataForMainTable(this.state.fetchResult.lastFetchServerReturn);
    } else {
      this.fetchDataForMainTable(isInitialFetch, packedGroupFilters);
    }
  }

  private fetchDataForMainTable(isInitialFetch: boolean, packedGroupFilters: object) {
    const payload: PayloadGetTradeFullData = {
      maxNumberOfSecurities: 5000,
      groupIdentifier: {},
      groupFilters: {
        // SecurityIdentifier: ['17163', '338|5Y']
      }
    };
    payload.groupFilters = packedGroupFilters;
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
          // only capture the lastFetch data if the API returned and the return was the entire payload (not truncated due to the 5000 cap)
          if (serverReturn.totalNumberOfSecurities <= 5000) {
            this.state.fetchResult.lastFetchServerReturn = serverReturn;
            this.state.fetchResult.lastFetchBucket = packedGroupFilters;
          }
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
    this.state.fetchResult.totalCount = serverReturn.totalNumberOfSecurities;
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
        } else {
          this.restfulCommService.logError('Failed to load SecurityId map, can not populate alert configuration');
        }
      })
    ).subscribe();
  }

  private autoLoadTable(
    filterList: Array<DTOs.SecurityDefinitionDTO>,
    portfolioMetric: PortfolioMetricValues,
    presetDisplayTitle: string
  ) {
    if (!!this.state.presets.selectedPreset) {
      this.performUnselectPresetInBackground();
      const delayToLoad = 1;  // the actual load needs to be executed on a delay because we need to give time for agGrid to react on santaTable's "activated" flag being set to false, this way when the autoLoadTable actually set it to "true" again, it will rebuild the header, otherwise the headers won't be rebuild. The time it takes for agGrid to react is trivial, we just need to wait for a single frame
      setTimeout(
        function(){
          this.autoLoadTablePerformLoad(filterList, portfolioMetric, presetDisplayTitle);
        }.bind(this),
        delayToLoad
      );
    } else {
      this.autoLoadTablePerformLoad(filterList, portfolioMetric, presetDisplayTitle);
    }
  }

  private autoLoadTablePerformLoad(
    filterList: Array<DTOs.SecurityDefinitionDTO>,
    portfolioMetric: PortfolioMetricValues,
    presetDisplayTitle: string
  ){
    const targetPortfolioDefinition = filterList.find((eachDefinition) => {
      return eachDefinition.data.key === this.constants.securityGroupDefinitionMap.PORTFOLIO.key;
    });
    if (!!targetPortfolioDefinition) {
      const targetPreset = this.state.presets.portfolioShortcutList.find((eachShortcut) => {
        const primaryFilterGroupInShortcut = eachShortcut.data.searchFilters[0];
        const portfolioDefinitionInThisShortcut = primaryFilterGroupInShortcut.find((eachDefinition) => {
          return eachDefinition.data.key === this.constants.securityGroupDefinitionMap.PORTFOLIO.key;
        });
        if (portfolioDefinitionInThisShortcut.data.highlightSelectedOptionList.length === 1) {
          // always use the individual-fund presets, since "see bond" is always on a singular fund
          return portfolioDefinitionInThisShortcut.data.highlightSelectedOptionList[0].shortKey === targetPortfolioDefinition.data.highlightSelectedOptionList[0].shortKey;
        }
      });
      if (!!targetPreset) {
        this.onSelectPreset(targetPreset, false);
      } else {
        this.onSelectPreset(this.state.presets.portfolioShortcutList[0], false);
      }
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
      this.store$.dispatch(new TradeLiveUpdateInitiateNewDataFetchFromBackendInMainTableEvent());
      this.loadFreshData();
      this.state.currentSearch.redirectedFromStrurturing = true;
      this.state.currentSearch.previewShortcut.data.highlightTitle = 'From Structuring';
      this.autoLoadTableFillCurrentSearchPresetSlotlist(filterList);
      if (!!presetDisplayTitle && presetDisplayTitle.length > 0) {
        this.state.currentSearch.previewShortcut.data.displayTitle = ` ${this.state.currentSearch.previewShortcut.data.displayTitle} - ${presetDisplayTitle}`;
      }
    } else {
      console.warn('see bond does not have a portfolio definition', filterList);
      this.restfulCommService.logError('see bond does not have a portfolio definition');
    }
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

  private performUnselectPresetInBackground() {
    const newState = this.initializePageState();
    this.state.presets.selectedPreset.state.isSelected = false;
    this.state.presets.selectedPreset = null;
    this.state.configurator.dto = this.dtoService.resetSecurityDefinitionConfigurator(this.state.configurator.dto);
    this.state.table.metrics = this.utilityService.deepCopy(this.constants.defaultMetrics).filter((eachStub) => {
      const targetSpecifics = eachStub.content.tableSpecifics.tradeMain || eachStub.content.tableSpecifics.default;
      return !targetSpecifics.disabled;
    });
    this.state.filters.quickFilters = newState.filters.quickFilters;
    this.state.filters.keyword.defaultValueForUI = null;
    this.state.fetchResult = newState.fetchResult;
    this.store$.dispatch(new TradeTogglePresetEvent);
  }

  private existFetchResultContainsNewSearchFilters(newSearchFilters): boolean {
    const lastFetchBucket = this.state.fetchResult.lastFetchBucket;
    if (!!lastFetchBucket) {
      let allContained = true;
      for (const eachDefinition in lastFetchBucket) {
        if (!!newSearchFilters[eachDefinition]) {
          // TODO: this logic may or may not need to be modified once we introduce the feature to exclude options via the "!" symbol. 
          let containAllOptions = true;
          const lastFetchOptionsParsed = lastFetchBucket[eachDefinition].toString();
          const newSearchOptionsParsed = newSearchFilters[eachDefinition].toString();
          if (lastFetchOptionsParsed != newSearchOptionsParsed) {
            newSearchFilters[eachDefinition].forEach((eachOption) => {
              if (lastFetchBucket[eachDefinition].indexOf(eachOption) < 0){
                containAllOptions = false;
              };
            });
          }
          if (!containAllOptions) {
            allContained = false;
          }
        } else {
          allContained = false;
        }
      }
      return allContained;
    } else {
      return false;
    }
  }

  private autoLoadTableFillCurrentSearchPresetSlotlist(filterList: Array<DTOs.SecurityDefinitionDTO>) {
    if (!!this.state.currentSearch.previewShortcut && filterList.length > 0) {
      filterList.forEach((eachFilterDefinition) => {
        const alreadyExist = this.state.currentSearch.previewShortcut.style.slotList.find((eachSlot) => {
          return !!eachSlot && eachSlot.data.key === eachFilterDefinition.data.key;
        });
        if (!alreadyExist) {
          const copy = this.utilityService.deepCopy(eachFilterDefinition);  // the original is read-only
          copy.state.filterActive = true;
          copy.state.isMiniPillVariant = false;
          const indexToEmptySlot = this.state.currentSearch.previewShortcut.style.slotList.findIndex((eachSlot) => {
            return eachSlot === null;
          });
          if (indexToEmptySlot < 4) {
            this.state.currentSearch.previewShortcut.style.slotList[indexToEmptySlot] = copy;
          }
        }
      });
    }
  }

  private storeRecentWatchList(params: AdhocPacks.DefinitionConfiguratorEmitterParams) {
    if (params.filterList.length > 0) {
      const searchShortcutDefinitionList: Array<Stubs.SearchShortcutIncludedDefinitionStub> = [];
      let customDisplayTitle = '';
      params.filterList.forEach((definitionItem: AdhocPacks.DefinitionConfiguratorEmitterParamsItem) => {
        const shortcutDefinition: Stubs.SearchShortcutIncludedDefinitionStub = {
          definitionKey: definitionItem.key,
          groupByActive: false,
          selectedOptions: definitionItem.filterBy.map((item: string) => item)
        }
        if (customDisplayTitle === '') {
          customDisplayTitle = shortcutDefinition.selectedOptions.length > 2 ? `${definitionItem.key}(${shortcutDefinition.selectedOptions.length})` : `${shortcutDefinition.selectedOptions.map((option: string) => option)}`;
        } else {
          customDisplayTitle = shortcutDefinition.selectedOptions.length > 2 ? `${customDisplayTitle} ${definitionItem.key}(${shortcutDefinition.selectedOptions.length})` : `${customDisplayTitle} ${shortcutDefinition.selectedOptions.map((option: string) => option)}`;
        }
        searchShortcutDefinitionList.push(shortcutDefinition);
      })
      const recentShortcutStub: Stubs.SearchShortcutStub = {
        displayTitle: customDisplayTitle,
        includedDefinitions: searchShortcutDefinitionList
      }
      const [ recentShortcut ] = this.populateSingleShortcutList([recentShortcutStub]);
      const recentWatchlist = this.dtoService.formUoBWatchlistObject(recentShortcut, this.constants.watchlistType.recent);
      const recentWatchlistCopy: DTOs.UoBWatchlistDTO = this.utilityService.deepCopy(recentWatchlist);
      recentWatchlistCopy.data.searchShortcut.data.metadata.dbStoredTime = moment().unix();
      this.indexedDBService.retrieveAndStoreDataToIndexedDB(this.constants.idbWatchlistRecentTableName, this.watchlistIndexedDBAPI.api, recentWatchlistCopy, `${this.constants.indexedDBAction.TradeWatchlist} - Recent Watchlist`, false);
      const recentShortcutCopy: DTOs.SearchShortcutDTO = this.utilityService.deepCopy(recentShortcut);
      recentShortcutCopy.state.isPreviewVariant = true;
      recentShortcutCopy.state.isUserInputBlocked = true;
      this.state.presets.recentWatchlistShortcutList.push(recentShortcut);
      this.state.currentSearch.previewShortcut = recentShortcutCopy;
    }
  }

  private checkIfWatchlistSearchExists(
    filterList: Array<AdhocPacks.DefinitionConfiguratorEmitterParamsItem>,
    watchlists: Array<DTOs.SearchShortcutDTO>
  ): DTOs.SearchShortcutDTO {
    let isExist = false;
    let matchedWatchlist: DTOs.SearchShortcutDTO = null;
    let allFiltersForConfigurator: Array<string> = [];
    filterList.forEach((filterList: AdhocPacks.DefinitionConfiguratorEmitterParamsItem) => {
      const formattedFilters = filterList.filterByBlocks.map((filterBlock: Blocks.SecurityDefinitionFilterBlock) => this.convertFiltersForWatchlistCompare(filterBlock.shortKey));
      allFiltersForConfigurator = [...allFiltersForConfigurator, ...formattedFilters];
    })
    watchlists.forEach((watchlist: DTOs.SearchShortcutDTO) => {
      if (!isExist) {
        if (watchlist.data.searchFilters.length > 0) {
          watchlist.data.searchFilters.forEach((searchFilter: Array<DTOs.SecurityDefinitionDTO>) => {
            let allFiltersForWatchlist: Array<string> = [];
            searchFilter.forEach((filter) => {
              filter.data.highlightSelectedOptionList.forEach((highlightedOption: Blocks.SecurityDefinitionFilterBlock) => {
                if (highlightedOption.shortKey) {
                  const formattedShortkey = this.convertFiltersForWatchlistCompare(highlightedOption.shortKey);
                  allFiltersForWatchlist = [...allFiltersForWatchlist, formattedShortkey];
                }
              })
            })
            if (allFiltersForWatchlist.length > 0) {
              if (allFiltersForConfigurator.length !== allFiltersForWatchlist.length) {
                matchedWatchlist = null;
              } else {
                const allFiltersForConfiguratorSorted = allFiltersForConfigurator.sort();
                const allWatchlistFiltersSorted = allFiltersForWatchlist.sort();
                isExist = allFiltersForConfiguratorSorted.every((filter: string, i: number) => filter === allWatchlistFiltersSorted[i]);
                if (!!isExist) {
                  matchedWatchlist = watchlist;
                }
              }
            }
          })
        }
      }
    })
    return matchedWatchlist;
  }

  private convertFiltersForWatchlistCompare(filter: string): string {
    return filter.trim().split(' ').join('').toLowerCase();
  }

  private changeRecentWatchlistTimeStamp(uuid: string) {
    const transaction = this.indexedDBService.retreiveIndexedDBTransaction(this.constants.idbWatchlistRecentTableName, this.watchlistIndexedDBAPI.api, `${this.constants.idbWatchlistRecentTableName} - Change Recent TimeStamp for ${uuid}`, false);
    const storeObject = this.indexedDBService.retrieveIndexedDBObjectStore(this.constants.idbWatchlistRecentTableName, transaction);
    const request = this.indexedDBService.retrieveSpecificDataFromIndexedDB(storeObject, uuid);
    request.onerror = (event) => {
      console.error(`${this.constants.indexedDBAction.TradeWatchlist} (Recent) - Get stored watchlist for uuid: ${uuid} error`, event)
    };
    request.onsuccess = (event) => {
      const storedWatchlist: DTOs.UoBWatchlistDTO = request.result;
      const storedWatchlistCopy: DTOs.UoBWatchlistDTO = this.utilityService.deepCopy(storedWatchlist);
      const currentTime = moment().unix();
      storedWatchlistCopy.data.searchShortcut.data.metadata.lastUseTime = currentTime;
      storedWatchlistCopy.data.searchShortcut.data.metadata.dbStoredTime = currentTime;
      this.indexedDBService.addDataToIndexedDB(storeObject, storedWatchlistCopy, `${this.constants.indexedDBAction.TradeWatchlist} (Recent) - Updating time stamp for uuid: ${uuid}`);
    };
  }
}
