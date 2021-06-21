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
    import * as globalConstants from 'Core/constants';
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
      selectUserInitials
    } from 'Core/selectors/core.selectors';
    import {
      CoreUserLoggedIn,
      CoreGlobalWorkflowSendNewState
    } from 'Core/actions/core.actions';
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
      selectWatchlistIndexedDBReady,
      selectSecurityActionToLaunchUofB
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
      TradeLiveUpdateInitiateNewDataFetchFromBackendInMainTableEvent,
      TradeLaunchUofBThroughSecurityActionMenu
    } from 'Trade/actions/trade.actions';
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
  state: PageStates.TradeCenterPanelState;
  subscriptions = {
    userInitialsSub: null,
    startNewUpdateSub: null,
    securityIDListFromAnalysisSub: null,
    validWindowSub: null,
    keywordSearchSub: null,
    receiveKeywordSearchInMainTable: null,
    selectCenterPanelFilterListForTableLoadSub: null,
    indexedDBReadySub: null,
    securityActionLaunchUofB: null
  };
  keywordChanged$: Subject<string> = new Subject<string>();
  constants = globalConstants;

  // General
    private initializePageState(): PageStates.TradeCenterPanelState {
      const existingRecentWatchlist = this.state && this.state.presets ? this.state.presets.recentWatchlistShortcuts.fullList : [];
      const mainTableMetrics = this.constants.table.SecurityTableHeaderConfigs.filter((eachStub) => {
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
          recentWatchlistShortcuts: {
            fullList: existingRecentWatchlist,
            todayList: [],
            thisWeekList: [],
            lastWeekList: []
          },
          savedWatchlistShortcutList: [],
          trendingWatchlistShortcutList: []
        },
        searchEngine: {
          typeaheadActive: false,
          selectedTypeaheadEntryIndex: 0,
          activeKeyword: '',
          indexedKeywords: [],
          typeaheadEntries: [],
          constructedSearchBucket: {
            TICKER: [],
            BICS: []
          },
          searchBucketDefinitionDTOs: {
            TICKER: this.dtoService.formSecurityDefinitionObject(this.constants.definition.SecurityDefinitionMap.TICKER),
            BICS: this.dtoService.formSecurityDefinitionObject(this.constants.definition.SecurityDefinitionMap.BICS_CONSOLIDATED)
          }
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
          driverType: this.constants.core.DEFAULT_DRIVER_IDENTIFIER,
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
          redirectedFromStrurturing: false,
          mode: null
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
      this.indexedDBService.initializeIndexedDB(this.constants.indexedDB.IndexedDBDatabases.TradeWatchlist);
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
        debounceTime(this.constants.core.KEYWORDSEARCH_DEBOUNCE_TIME),
        distinctUntilChanged()
      ).subscribe((keyword) => {
        const targetTable = this.state.fetchResult.mainTable;
        this.state.filters.keyword.actualValue = keyword;
        targetTable.rowList = this.filterPrinstineRowList(targetTable.prinstineRowList);
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
          const matchedInitial = this.constants.definition.FullOwnerList.find((eachInitial) => {
            return eachInitial === userInitials;
          });
          if (!!matchedInitial) {
            const filter = [];
            filter.push(userInitials);
            this.constants.trade.OwnershipShortcuts[0].includedDefinitions[0].selectedOptions = filter;
          } else {
            this.constants.trade.OwnershipShortcuts.splice(0, 1);
          }
          this.fetchBICsHierarchy();
          this.fetchTickers();
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
          if (!!filterList && filterList.length > 0 && bicsLoaded && !!metric && this.initialState !== 'n/a') {
            this.autoLoadTable(filterList, metric, pack.presetDisplayTitle);
          }
        }
      });
      this.subscriptions.securityActionLaunchUofB = this.store$.pipe(
        filter((pack) => {
          return this.stateActive
        }),
        select(selectSecurityActionToLaunchUofB)
      ).subscribe((pack: AdhocPacks.SecurityActionLaunchUofBTransferPack) => {
        if (!!pack) {
          const definitionType = this.constants.definition.SecurityDefinitionMap[pack.type];
          if (!!definitionType) {
            const definitionDTO = this.dtoService.formSecurityDefinitionObject(definitionType);
            definitionDTO.data.highlightSelectedOptionList = [pack].map((eachEntry: AdhocPacks.SecurityActionLaunchUofBTransferPack) => {
              const bicsLevel = eachEntry.bicsLevel || null;
              const optionValue = eachEntry.value;
              const selectedOption = this.dtoService.generateSecurityDefinitionFilterIndividualOption(
                definitionDTO.data.key,
                optionValue,
                bicsLevel
              );
              selectedOption.isSelected = true;
              return selectedOption;
            });
            definitionDTO.state.filterActive = true;
            const shortcut = this.dtoService.formSearchShortcutObject(
              [definitionDTO],
              null,
              false,
              false,
              false
            );
            this.performUnselectPresetInBackground();
            this.onSelectPreset(shortcut, true);
          }
        }
      })
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
      userTriggered: boolean,
    ) {
      this.resetSearchEngineStates();
      if (this.state.presets.selectedPreset === targetPreset) {
        targetPreset.state.isSelected = false;
        this.state.presets.selectedPreset = null;
        this.state.currentSearch.previewShortcut = null;
        this.state.configurator.dto = this.dtoService.resetSecurityDefinitionConfigurator(this.state.configurator.dto);
      } else {
        targetPreset.state.isSelected = true;
        if (this.state.presets.selectedPreset) {
          this.state.presets.selectedPreset.state.isSelected = false;
        }
        this.state.presets.selectedPreset = targetPreset;
        const previewCopy: DTOs.SearchShortcutDTO = this.utilityService.deepCopy(targetPreset);
        previewCopy.state.isPreviewVariant = true;
        previewCopy.state.isSelected = false;
        previewCopy.state.isUserInputBlocked = true;
        this.state.currentSearch.previewShortcut = previewCopy;
        this.state.configurator.dto = this.utilityService.applyShortcutToConfigurator(targetPreset, this.state.configurator.dto);
        if (!!targetPreset && targetPreset.data.searchFilters.length > 0) {
          targetPreset.data.searchFilters.forEach((searchFilter: Array<DTOs.SecurityDefinitionDTO>) => {
            searchFilter.forEach((filter: DTOs.SecurityDefinitionDTO) => {
              filter.state.isHiddenInConfiguratorDefinitionBundle = true;
            })
          })
        }
        this.checkInitialPageLoadData();
        if (userTriggered) {
          this.restfulCommService.logEngagement(
            this.constants.core.EngagementActionList.selectPreset,
            'n/a',
            targetPreset.data.displayTitle,
            'Trade - Center Panel'
          );
          const params = this.utilityService.packDefinitionConfiguratorEmitterParams(this.state.configurator.dto);
          this.bicsDataProcessingService.convertSecurityDefinitionConfiguratorBICSOptionsEmitterParamsToCode(params);
          this.onApplyFilter(params, false, null, targetPreset);
          this.loadFreshData();
        }
      }
      this.store$.dispatch(new TradeTogglePresetEvent);
    }

    public onUnselectPreset() {
      this.performUnselectPresetInBackground();
      if (this.state.presets.recentWatchlistShortcuts.fullList.length > 0) {
        this.state.presets.recentWatchlistShortcuts.todayList = [];
        this.state.presets.recentWatchlistShortcuts.thisWeekList = [];
        this.state.presets.recentWatchlistShortcuts.lastWeekList = [];
        this.state.presets.recentWatchlistShortcuts.fullList.forEach((watchlist: DTOs.SearchShortcutDTO) => this.addRecentWatchlistToTimeSpecificShortcutlist(watchlist));
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
          this.constants.core.EngagementActionList.switchDriver,
          'n/a',
          targetDriver,
          'Trade - Center Panel'
        );
        this.state.filters.driverType = targetDriver;
        // driver update needs to be to both tables
        const newMetrics: Array<Stubs.SecurityTableHeaderConfigStub> = this.utilityService.deepCopy(this.state.table.metrics);
        newMetrics.forEach((eachMetricStub) => {
          if (eachMetricStub.content.isDriverDependent && eachMetricStub.content.isAttrChangable) {
            if (targetDriver === this.constants.core.DEFAULT_DRIVER_IDENTIFIER) {
              eachMetricStub.content.attrName = targetDriver;
              eachMetricStub.content.underlineAttrName = targetDriver;
            } else {
              eachMetricStub.content.attrName = this.constants.core.TriCoreDriverConfig[targetDriver].driverLabel;
              eachMetricStub.content.underlineAttrName = this.constants.core.TriCoreDriverConfig[targetDriver].driverLabel;
            }
          }
        });
        this.state.table.metrics = newMetrics;
        this.state.editingDriver = false;
      }
    }

    public onApplyFilter(
      params: AdhocPacks.DefinitionConfiguratorEmitterParams,
      userTriggered: boolean,
      preloadMetricFromSeeBond: globalConstants.structuring.PortfolioMetricValues,
      targetPreset: DTOs.SearchShortcutDTO = null
    ) {
      const selectedDefinitionBundle = this.utilityService.getDefinitionBundleFromConfigurator(this.state.configurator.dto, this.constants.definition.SecurityDefinitionConfiguratorGroupLabels.selected);
      this.updatedSelectedDefinitionsAfterSave(selectedDefinitionBundle);
      const modifiedParams: AdhocPacks.DefinitionConfiguratorEmitterParams = {
        filterList: []
      }
      if (params.filterList.length > 0) {
        params.filterList.forEach((list: AdhocPacks.DefinitionConfiguratorEmitterParamsItem) => {
          const isExists = modifiedParams.filterList.find((parsedList: AdhocPacks.DefinitionConfiguratorEmitterParamsItem) => parsedList.key === list.key);
          !isExists && modifiedParams.filterList.push(list);
        })
      }
      this.state.filters.securityFilters = modifiedParams.filterList;
      this.state.filters.quickFilters = this.initializePageState().filters.quickFilters;
      modifiedParams.filterList.forEach((eachFilter) => {
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
      if (modifiedParams.filterList.length > 0 && (!targetPreset || targetPreset.state.isAbleToSaveAsRecentWatchlist)) {
        const presetDisplayTitle = targetPreset && targetPreset.data ? targetPreset.data.displayTitle : '';
        this.checkExistingRecentWatchlistSearches(modifiedParams, this.state.presets.recentWatchlistShortcuts.fullList, presetDisplayTitle);
      }
      this.updateSearchMode();
      if(!!preloadMetricFromSeeBond){
        this.updateTableLayout(preloadMetricFromSeeBond);
      } else {
        this.updateTableLayout();
      }
      this.addDefinitionToSelectedDefinitionBundle(modifiedParams.filterList);
      if (!!userTriggered) {
        this.store$.dispatch(new TradeLiveUpdateInitiateNewDataFetchFromBackendInMainTableEvent());
        this.loadFreshData();
        let filterValue = '';
        modifiedParams.filterList.forEach((eachFilter) => {
          filterValue = `${filterValue} | ${eachFilter.targetAttribute}: ${eachFilter.filterBy.toString()}`; 
        });
        this.restfulCommService.logEngagement(
          this.constants.core.EngagementActionList.applyFilter,
          'n/a',
          `Filter By : ${filterValue}`,
          'Trade - Center Panel'
        );
      }
    }

    public onSelectSecurityForAnalysis(targetSecurity: DTOs.SecurityDTO) {
      this.store$.dispatch(new TradeSelectedSecurityForAnalysisEvent(this.utilityService.deepCopy(targetSecurity)));
      this.restfulCommService.logEngagement(
        this.constants.core.EngagementActionList.selectSecurityForAnalysis,
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

    public onSelectSecurityLaunchUofB(transferPack: AdhocPacks.SecurityActionLaunchUofBTransferPack) {
      this.store$.dispatch(new TradeLaunchUofBThroughSecurityActionMenu(transferPack));
    }

    private fetchBICsHierarchy() {
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getBICsCodeDictionary, {req: 'GET'}).pipe(
        first(),
        tap((serverReturn: BEBICsHierarchyBlock) => {
          if (!!serverReturn) {
            this.bicsDataProcessingService.loadBICSData(
              serverReturn,
              this.state.configurator.dto
            );
            this.populateSearchShortcuts();
            this.startIndexedDBSub();
            this.indexSearchEngineBICS(serverReturn);
            this.store$.dispatch(new TradeBICSDataLoadedEvent());
          }
        }),
        catchError(err => {
          this.restfulCommService.logError('Cannot retrieve BICs hierarchy data');
          return of('error');
        })
      ).subscribe()
    }

    private fetchTickers() {
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getTickers, {req: 'GET'}).pipe(
        first(),
        tap((serverReturn: Array<string>) => {
          if (!!serverReturn && serverReturn.length > 0) {
            this.indexSearchEngineTickers(serverReturn);
          }
        }),
        catchError(err => {
          this.restfulCommService.logError('Cannot retrieve ticker data');
          return of('error');
        })
      ).subscribe();
    }

    private populateSearchShortcuts() {
      this.state.presets = this.initializePageState().presets;
      this.state.presets.portfolioShortcutList = this.populateSingleShortcutList(this.constants.trade.PortfolioShortcuts);
      this.state.presets.ownershipShortcutList = this.populateSingleShortcutList(this.constants.trade.OwnershipShortcuts);
      this.state.presets.strategyShortcutList = this.populateSingleShortcutList(this.constants.trade.StrategyShortcuts);
      this.state.presets.trendingWatchlistShortcutList = this.populateSingleShortcutList(this.constants.trade.TrendingShortcuts);
      this.state.presets.presetsReady = true;
      const prepopulatedShortcutList = [...this.state.presets.portfolioShortcutList, ...this.state.presets.ownershipShortcutList, ...this.state.presets.strategyShortcutList, ...this.state.presets.trendingWatchlistShortcutList];
      if (prepopulatedShortcutList.length > 0) {
        prepopulatedShortcutList.forEach((shortcut: DTOs.SearchShortcutDTO) => {
          shortcut.state.isAbleToSaveAsRecentWatchlist = false;
        })
      }
    }

    private populateSingleShortcutList(
      stubList: Array<Stubs.SearchShortcutStub>
    ): Array<DTOs.SearchShortcutDTO> {
      const list: Array<DTOs.SearchShortcutDTO> = [];
      stubList.forEach((eachShortcutStub) => {
        const definitionList = eachShortcutStub.includedDefinitions.map((eachIncludedDef) => {
          const definitionDTO = this.dtoService.formSecurityDefinitionObject(this.constants.definition.SecurityDefinitionMap[eachIncludedDef.definitionKey]);
          definitionDTO.state.groupByActive = !!eachIncludedDef.groupByActive;
          if (eachIncludedDef.selectedOptions.length > 0) {
            definitionDTO.state.filterActive = true;
            if (this.constants.definition.SecurityDefinitionMap[eachIncludedDef.definitionKey].optionList.length === 0) {
              definitionDTO.data.highlightSelectedOptionList = eachIncludedDef.selectedOptions.map((eachOption) => {
                  const bicsLevel = eachIncludedDef.definitionKey === this.constants.definition.SecurityDefinitionMap.BICS_CONSOLIDATED.key ? Math.floor(eachOption.length/2) : null;
                  const optionValue = this.constants.definition.SecurityDefinitionMap[eachIncludedDef.definitionKey].securityDTOAttrBlock === 'bics' ? this.bicsDictionaryLookupService.BICSCodeToBICSName(eachOption) : eachOption;
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
          this.updateStage(this.constants.table.SECURITY_TABLE_FINAL_STAGE, this.state.fetchResult.mainTable, this.state.table.dto);
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
        this.onSelectSecurityLaunchUofB.bind(this),
        this.state.filters
      );
      this.state.fetchResult.totalCount = serverReturn.totalNumberOfSecurities;
      this.calculateBestQuoteComparerWidthAndHeight();
      this.state.fetchResult.mainTable.fetchComplete = true;
      this.updateStage(this.constants.table.SECURITY_TABLE_FINAL_STAGE, this.state.fetchResult.mainTable, this.state.table.dto);
    }

    private updateStage(
      stageNumber: number,
      targetTableBlock: Blocks.TableFetchResultBlock,
      targetTableDTO: DTOs.SecurityTableDTO
    ) {
      targetTableBlock.currentContentStage = stageNumber;
      if (targetTableBlock.currentContentStage === this.constants.table.SECURITY_TABLE_FINAL_STAGE) {
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
        if (userInitials === this.constants.core.FAILED_USER_INITIALS_FALLBACK) {
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
            this.loadOwnerInitial(this.constants.core.FAILED_USER_INITIALS_FALLBACK);
            this.restfulCommService.logError(`Can not find user, error`);
          }
          return of('error');
        })
      ).subscribe();
    }

    private loadOwnerInitial(serverReturn: string) {
      const ownerInitials = this.constants.core.DevWhitelist.indexOf(serverReturn) !== -1 ? 'DM' : serverReturn;
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
      portfolioMetric: globalConstants.structuring.PortfolioMetricValues,
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
      portfolioMetric: globalConstants.structuring.PortfolioMetricValues,
      presetDisplayTitle: string
    ){
      const targetPortfolioDefinition = filterList.find((eachDefinition) => {
        return eachDefinition.data.key === this.constants.definition.SecurityDefinitionMap.PORTFOLIO.key;
      });
      if (!!targetPortfolioDefinition) {
        const targetPreset = this.state.presets.portfolioShortcutList.find((eachShortcut) => {
          const primaryFilterGroupInShortcut = eachShortcut.data.searchFilters[0];
          const portfolioDefinitionInThisShortcut = primaryFilterGroupInShortcut.find((eachDefinition) => {
            return eachDefinition.data.key === this.constants.definition.SecurityDefinitionMap.PORTFOLIO.key;
          });
          if (portfolioDefinitionInThisShortcut.data.highlightSelectedOptionList.length === 1) {
            // always use the individual-fund presets, since "see bond" is always on a singular fund
            return portfolioDefinitionInThisShortcut.data.highlightSelectedOptionList[0].shortKey === targetPortfolioDefinition.data.highlightSelectedOptionList[0].shortKey;
          }
        });
        let targetPresetCopy: DTOs.SearchShortcutDTO;
        if (!!targetPreset) {
          targetPresetCopy = this.utilityService.deepCopy(targetPreset);
          targetPresetCopy.data.displayTitle = `${targetPresetCopy.data.displayTitle} - ${presetDisplayTitle}`;
          targetPresetCopy.state.isAbleToSaveAsRecentWatchlist = true;
          this.onSelectPreset(targetPresetCopy, false);
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
        this.onApplyFilter(params, false, portfolioMetric, targetPresetCopy);
        this.store$.dispatch(new TradeLiveUpdateInitiateNewDataFetchFromBackendInMainTableEvent());
        this.loadFreshData();
        this.state.currentSearch.redirectedFromStrurturing = true;
        this.state.currentSearch.previewShortcut.data.highlightTitle = 'From Structuring';
        this.autoLoadTableFillCurrentSearchPresetSlotlist(filterList);
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
          newLabel = newLabel.replace(this.constants.table.SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_START, '|');
          newLabel = newLabel.replace(this.constants.table.SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_END, '|');
          const array = newLabel.split('|');
          if (array.length === 3) {
            eachHeader.content.label = array[0].concat(` ${this.constants.table.SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_START}${targetFund}${this.constants.table.SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_END}`).concat(array[2]);
          }
        }
        if (eachHeader.key === 'weightFundBEV') {
          let newLabel = eachHeader.content.label;
          newLabel = newLabel.replace(this.constants.table.SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_START, '|');
          newLabel = newLabel.replace(this.constants.table.SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_END, '|');
          const array = newLabel.split('|');
          if (array.length === 3) {
            eachHeader.content.label = array[0].concat(` ${this.constants.table.SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_START}${targetFund}${this.constants.table.SECURITY_TABLE_HEADER_WEIGHT_FUND_RESERVED_DELIMITER_END} `).concat(array[2]);
          }
        }
      });
      // trigger the ngOnChanges in santa table
      this.state.table.metrics = this.utilityService.deepCopy(this.state.table.metrics);
    }

    private modifyWeightColumnHeadersUpdateActiveAndPinState(targetMetric: globalConstants.structuring.PortfolioMetricValues) {
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
      if (targetMetric === this.constants.structuring.PortfolioMetricValues.cs01) {
        fundCS01Header.content.tableSpecifics.default = {
          pinned: false,
          active: true,
          groupShow: true,
          sortActivated: this.constants.table.AggridSortOptions.desc
        };
        tableCS01Header.content.tableSpecifics.default = {
          pinned: false,
          active: true,
          groupShow: true,
          sortActivated: null
        };
        fundBEVHeader.content.tableSpecifics.default = {
          pinned: false,
          active: true,
          groupShow: false,
          sortActivated: null
        };
        tableBEVHeader.content.tableSpecifics.default = {
          pinned: false,
          active: true,
          groupShow: false,
          sortActivated: null
        };
      } else if (targetMetric === this.constants.structuring.PortfolioMetricValues.creditLeverage) {
        fundCS01Header.content.tableSpecifics.default = {
          pinned: false,
          active: true,
          groupShow: false,
          sortActivated: null
        };
        tableCS01Header.content.tableSpecifics.default = {
          pinned: false,
          active: true,
          groupShow: false,
          sortActivated: null
        };
        fundBEVHeader.content.tableSpecifics.default = {
          pinned: false,
          active: true,
          groupShow: true,
          sortActivated: this.constants.table.AggridSortOptions.desc
        };
        tableBEVHeader.content.tableSpecifics.default = {
          pinned: false,
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
      this.state.table.metrics = this.utilityService.deepCopy(this.constants.table.SecurityTableHeaderConfigs).filter((eachStub) => {
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

    private storeRecentWatchList(
      params: AdhocPacks.DefinitionConfiguratorEmitterParams,
      presetDisplayTitle: string
    ) {
      if (params.filterList.length > 0) {
        const searchShortcutDefinitionList: Array<Stubs.SearchShortcutIncludedDefinitionStub> = [];
        params.filterList.forEach((definitionItem: AdhocPacks.DefinitionConfiguratorEmitterParamsItem) => {
          const shortcutDefinition: Stubs.SearchShortcutIncludedDefinitionStub = {
            definitionKey: definitionItem.key,
            groupByActive: false,
            selectedOptions: definitionItem.key === this.constants.definition.SecurityDefinitionMap.TENOR.key ? definitionItem.filterByBlocks.map((item: Blocks.SecurityDefinitionFilterBlock) => item.shortKey) : definitionItem.filterBy.map((item: string) => item)
          }
          searchShortcutDefinitionList.push(shortcutDefinition);
        })
        const recentShortcutStub: Stubs.SearchShortcutStub = {
          displayTitle: presetDisplayTitle,
          includedDefinitions: searchShortcutDefinitionList,
          isHero: false,
          isMajor: false
        }
        const [ recentShortcut ] = this.populateSingleShortcutList([recentShortcutStub]);
        if (!presetDisplayTitle) {
          recentShortcut.data.displayTitle = this.utilityService.generateCustomizedTitleForShortcut(recentShortcut);
        }
        recentShortcut.state.isPreviewVariant = true;
        recentShortcut.state.isUserInputBlocked = true;
        const { highlightTitle } = this.state.currentSearch.previewShortcut.data;
        if (this.state.presets.selectedPreset) {
          const isAlreadyAddedToSelected = this.utilityService.checkIfPresetsAreIdentical(recentShortcut, this.state.presets.selectedPreset);
          if (!isAlreadyAddedToSelected) {
            this.state.presets.selectedPreset.state.isSelected = false;
            this.state.presets.selectedPreset = recentShortcut;
          }
        }
        this.state.currentSearch.previewShortcut = recentShortcut;
        this.state.currentSearch.previewShortcut.data.highlightTitle = highlightTitle;
        const recentShortcutCopy = this.utilityService.deepCopy(recentShortcut);
        recentShortcutCopy.state.isPreviewVariant = false;
        recentShortcutCopy.state.isUserInputBlocked = false;
        recentShortcutCopy.data.metadata.dbStoredTime = recentShortcutCopy.data.metadata.createTime;
        this.indexedDBService.retrieveAndStoreDataToIndexedDB(this.constants.indexedDB.INDEXEDDB_WATCHLIST_RECENT_TABLE_NAME, this.constants.indexedDB.IndexedDBDatabases.TradeWatchlist, recentShortcutCopy, `${this.constants.indexedDB.IndexedDBDatabases.TradeWatchlist} - (${this.constants.indexedDB.IndexedDBWatchListType.recent}) - Store Watchlist`, false);
        this.state.presets.recentWatchlistShortcuts.fullList.push(recentShortcutCopy);
        this.sortWatchlistFromLastUseTime(this.state.presets.recentWatchlistShortcuts.fullList, true);
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
        if (!isExist && watchlist.data.searchFilters.length > 0) {
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
      })
      return matchedWatchlist;
    }

    private convertFiltersForWatchlistCompare(filter: string): string {
      return filter.trim().split(' ').join('').toLowerCase();
    }

    private changeRecentWatchlistTimeStamp(
      filterList: Array<AdhocPacks.DefinitionConfiguratorEmitterParamsItem>,
      watchlist: DTOs.SearchShortcutDTO
    ) {
      if (filterList && filterList.length > 0) {
        // only update the watchlist lastUseTime and dbStoredTime if it's the preset being selected
        const isWatchlistCurrentSearch = this.checkIfWatchlistSearchExists(filterList, [watchlist]);
        if (!!isWatchlistCurrentSearch) {
          const lastUseTime = moment().unix();
          watchlist.data.metadata.lastUseTime = lastUseTime;
          const transaction = this.indexedDBService.retreiveIndexedDBTransaction(this.constants.indexedDB.INDEXEDDB_WATCHLIST_RECENT_TABLE_NAME, this.constants.indexedDB.IndexedDBDatabases.TradeWatchlist, `${this.constants.indexedDB.INDEXEDDB_WATCHLIST_RECENT_TABLE_NAME} - Change Recent TimeStamp for ${watchlist.data.uuid}`, false);
          const objectStore = this.indexedDBService.retrieveIndexedDBObjectStore(this.constants.indexedDB.INDEXEDDB_WATCHLIST_RECENT_TABLE_NAME, transaction);
          const request = this.indexedDBService.retrieveSpecificDataFromIndexedDB(objectStore, watchlist.data.uuid);
          request.onerror = (event) => {
            console.error(`${this.constants.indexedDB.IndexedDBDatabases.TradeWatchlist} (${this.constants.indexedDB.IndexedDBWatchListType.recent}) - Get stored watchlist for uuid: ${watchlist.data.uuid} error`, event)
          };
          request.onsuccess = (event) => {
            const storedWatchlist: DTOs.SearchShortcutDTO = request.result;
            const storedWatchlistCopy: DTOs.SearchShortcutDTO = this.utilityService.deepCopy(storedWatchlist);
            storedWatchlistCopy.data.metadata.lastUseTime = lastUseTime;
            const dbStoredTime = moment().unix();
            storedWatchlistCopy.data.metadata.dbStoredTime = dbStoredTime;
            watchlist.data.metadata.dbStoredTime = dbStoredTime;
            this.indexedDBService.addDataToIndexedDB(objectStore, storedWatchlistCopy, `${this.constants.indexedDB.IndexedDBDatabases.TradeWatchlist} (${this.constants.indexedDB.IndexedDBWatchListType.recent}) - Updating time stamp for uuid: ${watchlist.data.uuid}`);
          };
        }
        this.state.presets.recentWatchlistShortcuts.fullList.length > 0 && this.sortWatchlistFromLastUseTime(this.state.presets.recentWatchlistShortcuts.fullList, true);
      }
    }

    private checkExistingRecentWatchlistSearches(
      params: AdhocPacks.DefinitionConfiguratorEmitterParams,
      watchlist: Array<DTOs.SearchShortcutDTO>,
      presetDisplayTitle: string
    ) {
      if (watchlist.length > 0) {
        const existingWatchlist = this.checkIfWatchlistSearchExists(params.filterList, watchlist);
        if (!existingWatchlist) {
          this.storeRecentWatchList(params, presetDisplayTitle);
        } else {
          this.changeRecentWatchlistTimeStamp(params.filterList, existingWatchlist);
        }
      } else {
        this.indexedDBService.retrieveAndGetAllIndexedDBData(this.constants.indexedDB.INDEXEDDB_WATCHLIST_RECENT_TABLE_NAME, this.constants.indexedDB.IndexedDBDatabases.TradeWatchlist, `${this.constants.indexedDB.IndexedDBDatabases.TradeWatchlist} (${this.constants.indexedDB.IndexedDBWatchListType.recent}) - Get All Watchlists`, true).pipe(
          first()
        ).subscribe((storedRecentWatchlists: Array<DTOs.SearchShortcutDTO>) => {
          if (storedRecentWatchlists && storedRecentWatchlists.length > 0) {
            const existingWatchlist = this.checkIfWatchlistSearchExists(params.filterList, storedRecentWatchlists);
            if (!existingWatchlist) {
              this.storeRecentWatchList(params, presetDisplayTitle);
            } else {
              this.changeRecentWatchlistTimeStamp(params.filterList, existingWatchlist);
            }
          } else {
            this.storeRecentWatchList(params, presetDisplayTitle)
          }
        })
      }
    }

    private addRecentWatchlistToTimeSpecificShortcutlist(watchlist: DTOs.SearchShortcutDTO) {
      const { lastUseTime } = watchlist.data.metadata;
      const watchlistTime = moment.unix(lastUseTime).format('YYYY-MM-DD');
      const isSameCurrentDate = moment(watchlistTime).isSame(moment(), 'day');
      const isWithinThisWeek = moment(watchlistTime).isSame(moment(), 'week');
      const oneWeekAgo = moment().subtract(7, 'days');
      const isWithinLastWeek = moment(watchlistTime).isSame(moment(oneWeekAgo), 'week');
      if (isSameCurrentDate) {
        this.state.presets.recentWatchlistShortcuts.todayList.push(watchlist);
      } else if (isWithinThisWeek) {
        this.state.presets.recentWatchlistShortcuts.thisWeekList.push(watchlist);
      } else if (isWithinLastWeek) {
        this.state.presets.recentWatchlistShortcuts.lastWeekList.push(watchlist);
      } else {
        // Delete older watchlists from IndexedDB
        this.indexedDBService.retrieveAndDeleteDataFromIndexedDB(watchlist.data.uuid, this.constants.indexedDB.INDEXEDDB_WATCHLIST_RECENT_TABLE_NAME, this.constants.indexedDB.IndexedDBDatabases.TradeWatchlist, `${this.constants.indexedDB.IndexedDBDatabases.TradeWatchlist} (${this.constants.indexedDB.IndexedDBWatchListType.recent}) - Delete stored watchlist for uuid: ${watchlist.data.uuid}`, false);
      }
    }

    private sortWatchlistFromLastUseTime(
      watchlists: Array<DTOs.SearchShortcutDTO>,
      sortByRecent: boolean
    ) {
      watchlists.sort((watchlistA: DTOs.SearchShortcutDTO, watchlistB: DTOs.SearchShortcutDTO) => {
        if (watchlistA.data.metadata.lastUseTime > watchlistB.data.metadata.lastUseTime) {
          return sortByRecent ? -1 : 1;
        } else if (watchlistA.data.metadata.lastUseTime < watchlistB.data.metadata.lastUseTime) {
          return sortByRecent ? 1 : -1;
        } else {
          return 0;
        }
      })
    }

    private updateSearchMode() {
      let isInternal = false;
      this.state.configurator.dto.data.definitionList.forEach((eachDefinitionGroup) => {
        eachDefinitionGroup.data.list.forEach((eachDefinition) => {
          if (eachDefinition.state.filterActive && eachDefinition.data.internalOnly) {
            isInternal = true;
          }
        });
      });
      this.state.currentSearch.mode = isInternal ? this.constants.trade.TradeCenterPanelSearchModes.internal : this.constants.trade.TradeCenterPanelSearchModes.uob;
    }

    private updateTableLayout(portfolioMetric: globalConstants.structuring.PortfolioMetricValues = this.constants.structuring.PortfolioMetricValues.cs01) {
      const mainTableMetrics = this.constants.table.SecurityTableHeaderConfigs.filter((eachStub) => {
        const targetSpecifics = eachStub.content.tableSpecifics.tradeMain || eachStub.content.tableSpecifics.default;
        return !targetSpecifics.disabled;
      });
      // reset metrics
      this.state.table.metrics = this.utilityService.deepCopy(mainTableMetrics);
      if (this.state.currentSearch.mode === this.constants.trade.TradeCenterPanelSearchModes.internal) {
        if (this.state.filters.quickFilters.portfolios.length === 1) {
          this.modifyWeightColumnHeadersUpdateFundName();
          this.modifyWeightColumnHeadersUpdateActiveAndPinState(portfolioMetric);
        }
      } else {
        // right now only apply the default, but when we store the configs for each saved watchlist then we can use those if they are present
        this.updateTableLayoutApplyConfigOverwrite(this.constants.trade.TradeUoBDefaultSecurityTableHeaderOverwriteConfigs);
      }
    }

    private updateTableLayoutApplyConfigOverwrite(overwrites: Array<AdhocPacks.SecurityTableHeaderConfigOverwrite>) {
      this.state.table.metrics.forEach((eachHeader) => {
        const existInOverwrite = overwrites.find((eachOverwrite) => {
          return eachOverwrite.key === eachHeader.key;
        });
        if (!!existInOverwrite) {
          if (existInOverwrite.hasOwnProperty('active')) {
            eachHeader.content.tableSpecifics.default.active = existInOverwrite.active;
          }
          if (existInOverwrite.hasOwnProperty('groupShow')) {
            eachHeader.content.tableSpecifics.default.groupShow = existInOverwrite.groupShow;
          }
          if (existInOverwrite.hasOwnProperty('disabled')) {
            eachHeader.content.tableSpecifics.default.disabled = existInOverwrite.disabled;
          }
          if (existInOverwrite.hasOwnProperty('pinned')) {
            eachHeader.content.tableSpecifics.default.pinned = existInOverwrite.pinned;
          }
          if (existInOverwrite.hasOwnProperty('groupBy')) {
            if (eachHeader.key === 'ticker' && !!existInOverwrite.groupBy) {
              const tickerDefinition = this.state.currentSearch.previewShortcut.data.searchFilters[0].find((eachDefinition) => {
                return eachDefinition.data.key === this.constants.definition.SecurityDefinitionMap.TICKER.key;
              });
              if (!!tickerDefinition && tickerDefinition.data.highlightSelectedOptionList.length === 1) {
                // if user is searching for a specific ticker, then it's counter-productive to group the table by ticker
                eachHeader.content.tableSpecifics.default.groupByActive = false;
              } else {
                eachHeader.content.tableSpecifics.default.groupByActive = true;
              }
            } else {
              eachHeader.content.tableSpecifics.default.groupByActive = existInOverwrite.groupBy;
            }
          }
        }
      });
    }

    private startIndexedDBSub() {
      this.subscriptions.indexedDBReadySub = this.store$.pipe(
        select(selectWatchlistIndexedDBReady)
      ).subscribe((isReady) => {
        this.state.isIndexedDBReady = isReady;
        if (isReady) {
          this.indexedDBService.retrieveAndGetAllIndexedDBData(this.constants.indexedDB.INDEXEDDB_WATCHLIST_RECENT_TABLE_NAME, this.constants.indexedDB.IndexedDBDatabases.TradeWatchlist, `${this.constants.indexedDB.IndexedDBDatabases.TradeWatchlist} (${this.constants.indexedDB.IndexedDBWatchListType.recent}) - Get All Watchlists`, true).pipe(
            first()
          ).subscribe((storedRecentWatchlists: Array<DTOs.SearchShortcutDTO>) => {
            if (storedRecentWatchlists.length > 0) {
              this.state.presets.recentWatchlistShortcuts.fullList = [...this.state.presets.recentWatchlistShortcuts.fullList, ...storedRecentWatchlists];
              if (this.state.presets.recentWatchlistShortcuts.fullList.length > 0) {
                this.sortWatchlistFromLastUseTime(this.state.presets.recentWatchlistShortcuts.fullList, true);
                this.state.presets.recentWatchlistShortcuts.fullList.forEach((watchlist: DTOs.SearchShortcutDTO) => {
                  this.addRecentWatchlistToTimeSpecificShortcutlist(watchlist);
                })
              }
            }
          })
        }
      })
    }

    private updatedSelectedDefinitionsAfterSave(definitionBundle: DTOs.SecurityDefinitionBundleDTO) {
      let updatedList: Array<DTOs.SecurityDefinitionDTO> = [];
      let removedList: Array<DTOs.SecurityDefinitionDTO> = [];
      definitionBundle.data.list.forEach((definition: DTOs.SecurityDefinitionDTO) => {
        const listForCompare = definition.state.isFilterCapped || definition.state.isConsolidatedBICSVariant ? definition.data.highlightSelectedOptionList : definition.data.displayOptionList;
        const isNotSelected = listForCompare.every((optionBlock: Blocks.SecurityDefinitionFilterBlock) => !optionBlock.isSelected);
        if (!!isNotSelected) {
          removedList = [...removedList, definition];
        } else {
          updatedList = [...updatedList, definition];
        }
      })
      if (removedList.length > 0) {
        removedList.forEach((definition: DTOs.SecurityDefinitionDTO) => {
          this.utilityService.syncDefinitionStateBetweenSelectedAndCore(this.state.configurator.dto, definition, false);
        })
      }
      definitionBundle.data.list = updatedList;
    }

    private addDefinitionToSelectedDefinitionBundle(filterList: Array<AdhocPacks.DefinitionConfiguratorEmitterParamsItem>) {
      const filterListKeys: Array<string> = filterList.map((options: AdhocPacks.DefinitionConfiguratorEmitterParamsItem) => options.key);
      const selectedGroup = this.utilityService.getDefinitionBundleFromConfigurator(this.state.configurator.dto, this.constants.definition.SecurityDefinitionConfiguratorGroupLabels.selected);
      this.state.configurator.dto.data.definitionList.forEach((definitionBundle: DTOs.SecurityDefinitionBundleDTO) => {
        definitionBundle.data.list.forEach((definition: DTOs.SecurityDefinitionDTO) => {
          const isSelected = filterListKeys.find((key: string) => key === definition.data.key);
          if (!!isSelected) {
            const isExistsInSelectedGroup = selectedGroup.data.list.find((selectedDefinition: DTOs.SecurityDefinitionDTO) => selectedDefinition.data.key === definition.data.key);
            if (!isExistsInSelectedGroup) {
              const definitionCopy: DTOs.SecurityDefinitionDTO = this.utilityService.deepCopy(definition);
              definitionCopy.state.isHiddenInConfiguratorDefinitionBundle = false;
              definitionCopy.data.configuratorCoreDefinitionGroup = this.constants.definition.SecurityDefinitionConfiguratorGroupLabels.selected;
              definition.state.isHiddenInConfiguratorDefinitionBundle = true;
              selectedGroup.data.list.push(definitionCopy);
            }
          }
        })
      })
    }

  // General End

  // Search Engine
    public onSearchEngineInputChange(newInput: string) {
      newInput = newInput.trim();
      if (newInput !== this.state.searchEngine.activeKeyword) {
        this.state.searchEngine.activeKeyword = newInput;
        this.performTypeaheadSearch();
      }
    }

    public onClickSearchEngineSearchBonds() {
      const definitionList = [];
      if (this.state.searchEngine.constructedSearchBucket.BICS.length > 0) {
        const BICSDefinitionDTO = this.searchEngineSearchBondsGenerateDefinition(this.constants.definition.SecurityDefinitionMap.BICS_CONSOLIDATED);
        definitionList.push(BICSDefinitionDTO);
      }
      if (this.state.searchEngine.constructedSearchBucket.TICKER.length > 0) {
        const tickerDefinitionDTO = this.searchEngineSearchBondsGenerateDefinition(this.constants.definition.SecurityDefinitionMap.TICKER);
        definitionList.push(tickerDefinitionDTO);
      }
      const shortcut = this.dtoService.formSearchShortcutObject(
        definitionList,
        null,
        false,
        false,
        false
      );
      shortcut.data.displayTitle = this.utilityService.generateCustomizedTitleForShortcut(shortcut);
      this.onSelectPreset(shortcut, true);
    }

    public onSearchEngineKeyPressed(event: KeyboardEvent) {
      const searchEngine = this.state.searchEngine;
      switch (event.keyCode) {
        case this.constants.trade.SEARCH_ENGINE_BREAK_KEY:
          event.preventDefault();
          if (searchEngine.activeKeyword && searchEngine.activeKeyword.length > 0 && !!searchEngine.typeaheadEntries[searchEngine.selectedTypeaheadEntryIndex]) {
            this.selectTypeaheadEntry(searchEngine.typeaheadEntries[searchEngine.selectedTypeaheadEntryIndex]);
          }
          break;
        case this.constants.trade.SEARCH_ENGINE_DOWNWARD_KEY:
          event.preventDefault();
          if (searchEngine.typeaheadEntries.length > 1) {
            searchEngine.selectedTypeaheadEntryIndex++;
            if (searchEngine.selectedTypeaheadEntryIndex >= searchEngine.typeaheadEntries.length ) {
              searchEngine.selectedTypeaheadEntryIndex = 0;
            }
          }
          break;
        case this.constants.trade.SEARCH_ENGINE_UPWARD_KEY:
          event.preventDefault();
          if (searchEngine.typeaheadEntries.length > 1) {
            searchEngine.selectedTypeaheadEntryIndex--;
            if (searchEngine.selectedTypeaheadEntryIndex < 0) {
              searchEngine.selectedTypeaheadEntryIndex = searchEngine.typeaheadEntries.length - 1;
            }
          }
          break;
        case this.constants.trade.SEARCH_ENGINE_ENTER_KEY:
          event.preventDefault();
          if (searchEngine.typeaheadActive && searchEngine.typeaheadEntries.length > 0 && searchEngine.typeaheadEntries[searchEngine.selectedTypeaheadEntryIndex]) {
            this.selectTypeaheadEntry(searchEngine.typeaheadEntries[searchEngine.selectedTypeaheadEntryIndex]);
          }
          if (searchEngine.constructedSearchBucket.BICS.length > 0 || searchEngine.constructedSearchBucket.TICKER.length > 0) {
            this.onClickSearchEngineSearchBonds();
          }
          break;
        default:
          // code...
          break;
      }
    }

    public onClickTypeaheadEntry(targetEntry: AdhocPacks.TradeCenterPanelSearchEngineIndexEntry) {
      this.selectTypeaheadEntry(targetEntry);
    }

    public onHoverTypeaheadEntry(targetIndex: number) {
      if (this.state.searchEngine.selectedTypeaheadEntryIndex !== targetIndex) {
        this.state.searchEngine.selectedTypeaheadEntryIndex = targetIndex;
      }
    }

    public onClickRemoveLastInBucket(targetBucket: string) {
      // can't directly send the list cuz reassigning it would just create a new reference
      if (this.state.searchEngine.constructedSearchBucket[targetBucket]) {
        this.state.searchEngine.constructedSearchBucket[targetBucket].pop();
      }
    }

    private indexSearchEngineBICS(bicsData: BEBICsHierarchyBlock) {
      for (const eachCode in bicsData) {
        const leafBICSName = bicsData[eachCode].item7 || bicsData[eachCode].item6 || bicsData[eachCode].item5 || bicsData[eachCode].item4 || bicsData[eachCode].item3 || bicsData[eachCode].item2 || bicsData[eachCode].item1;
        if (leafBICSName) {
          const entry: AdhocPacks.TradeCenterPanelSearchEngineIndexEntry = {
            pristineText: leafBICSName,
            displayText: leafBICSName,
            type: `${this.constants.trade.SEARCH_ENGINE_TYPES.BICS} - lv.${this.bicsDictionaryLookupService.getBICSLevel(eachCode)}`,
            bicsLevel: this.bicsDictionaryLookupService.getBICSLevel(eachCode)
          };
          this.state.searchEngine.indexedKeywords.push(entry);
        }
      }
    }

    private indexSearchEngineTickers(tickerList: Array<string>) {
      tickerList.forEach((eachTicker) => {
        const entry: AdhocPacks.TradeCenterPanelSearchEngineIndexEntry = {
          pristineText: eachTicker,
          displayText: eachTicker,
          type: this.constants.trade.SEARCH_ENGINE_TYPES.TICKER
        };
        this.state.searchEngine.indexedKeywords.push(entry);
      });
    }

    private performTypeaheadSearch() {
      const searchEngine = this.state.searchEngine;
      if (searchEngine.activeKeyword && searchEngine.activeKeyword.length >= this.constants.trade.SEARCH_ENGINE_TYPEAHEAD_MINIMUM_CHAR_LENGTH) {
        searchEngine.typeaheadActive = true;
        searchEngine.typeaheadEntries = searchEngine.indexedKeywords.filter((eachEntry) => {
          if (this.performTypeaheadSearchMatchEntry(eachEntry, searchEngine.activeKeyword)) {
            eachEntry.displayText = this.utilityService.highlightKeywordInParagraph(eachEntry.pristineText, searchEngine.activeKeyword);
            return true;
          } else {
            return false;
          }
        });
        this.performTypeaheadSearchSortResultByRelevancy(searchEngine.typeaheadEntries, searchEngine.activeKeyword);
        if (searchEngine.typeaheadEntries.length > this.constants.trade.SEARCH_ENGINE_TYPEAHEAD_SIZE_CAP) {
          searchEngine.typeaheadEntries = searchEngine.typeaheadEntries.slice(0, this.constants.trade.SEARCH_ENGINE_TYPEAHEAD_SIZE_CAP);
        } else if (searchEngine.typeaheadEntries.length === 0) {
          searchEngine.typeaheadActive = false;
        }
      } else {
        searchEngine.typeaheadEntries = [];
        searchEngine.typeaheadActive = false;
      }
      searchEngine.selectedTypeaheadEntryIndex = 0;
    }

    private performTypeaheadSearchMatchEntry(
      targetEntry: AdhocPacks.TradeCenterPanelSearchEngineIndexEntry, 
      keyword: string
    ): boolean {
      const parsedPristineEntryText = targetEntry.pristineText.toUpperCase();
      const parsedKeyword = keyword.toUpperCase();
      if (parsedPristineEntryText.indexOf(parsedKeyword) >= 0) {
        // also checks for whether the entry is already inserted into the bucket
        if (targetEntry.type.indexOf(this.constants.trade.SEARCH_ENGINE_TYPES.BICS) >= 0) {
          const exist = this.state.searchEngine.constructedSearchBucket.BICS.find((eachEntry) => {
            return eachEntry.pristineText === targetEntry.pristineText;
          });
          return !exist;
        } else if (targetEntry.type === this.constants.trade.SEARCH_ENGINE_TYPES.TICKER) {
          const exist = this.state.searchEngine.constructedSearchBucket.TICKER.find((eachEntry) => {
            return eachEntry.pristineText === targetEntry.pristineText;
          });
          return !exist;
        }
        return false;
      } else {
        return false;
      }
    }

    private performTypeaheadSearchSortResultByRelevancy(
      targetList: Array<AdhocPacks.TradeCenterPanelSearchEngineIndexEntry>, 
      searchKeyword: string
    ) {
      targetList.sort((itemA, itemB) => {
        if (itemA.pristineText.length === searchKeyword.length && itemB.pristineText.length !== searchKeyword.length) {
          // whether it is an exact match, because the items already have a match, if their length are the same then it is an exact match
          return -64;
        } else if (itemB.pristineText.length === searchKeyword.length && itemA.pristineText.length !== searchKeyword.length) {
          return 64;
        } else if (itemA.bicsLevel === 1 && itemB.bicsLevel !== 1) {
          return -32;
        } else if (itemB.bicsLevel === 1 && itemA.bicsLevel !== 1) {
          return 32;
        } else if (itemA.displayText.indexOf('<kbd>') === 0 && itemB.displayText.indexOf('<kbd>') !== 0) {
          // whether it starts with the keyword
          return -16;
        } else if (itemB.displayText.indexOf('<kbd>') === 0 && itemA.displayText.indexOf('<kbd>') !== 0) {
          return 16;
        } else if (itemA.bicsLevel === 2 && itemB.bicsLevel !== 2) {
          return -8;
        } else if (itemB.bicsLevel === 2 && itemA.bicsLevel !== 2) {
          return 8;
        } else if (itemA.bicsLevel === 3 && itemB.bicsLevel !== 3) {
          return -4;
        } else if (itemB.bicsLevel === 3 && itemA.bicsLevel !== 3) {
          return 4;
        } else if (itemA.pristineText.length < itemB.pristineText.length) {
          return -2;
        } else if (itemA.pristineText.length > itemB.pristineText.length) {
          return 2;
        } else if (itemA.pristineText < itemB.pristineText) {
          return -1;
        } else if (itemA.pristineText > itemB.pristineText) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    private selectTypeaheadEntry(targetEntry: AdhocPacks.TradeCenterPanelSearchEngineIndexEntry) {
      const searchEngine = this.state.searchEngine;
      if (targetEntry.type.indexOf(this.constants.trade.SEARCH_ENGINE_TYPES.BICS) >= 0) {
        searchEngine.constructedSearchBucket.BICS.push(targetEntry);
      } else if (targetEntry.type === this.constants.trade.SEARCH_ENGINE_TYPES.TICKER) {
        searchEngine.constructedSearchBucket.TICKER.push(targetEntry);
      }
      searchEngine.activeKeyword = "";
      this.performTypeaheadSearch();
    }

    private searchEngineSearchBondsGenerateDefinition(targetDefinitionStub: Stubs.SecurityDefinitionStub): DTOs.SecurityDefinitionDTO {
      const definitionDTO = this.dtoService.formSecurityDefinitionObject(targetDefinitionStub);
      let constructedSearchBucket: Array<AdhocPacks.TradeCenterPanelSearchEngineIndexEntry> = null;
      if (definitionDTO.data.key === this.constants.definition.SecurityDefinitionMap.TICKER.key) {
        constructedSearchBucket = this.state.searchEngine.constructedSearchBucket.TICKER;
      } else if (definitionDTO.data.key === this.constants.definition.SecurityDefinitionMap.BICS_CONSOLIDATED.key) {
        constructedSearchBucket = this.state.searchEngine.constructedSearchBucket.BICS;
      }
      if (!!constructedSearchBucket) {
        definitionDTO.data.highlightSelectedOptionList = constructedSearchBucket.map((eachEntry) => {
          const bicsLevel = eachEntry.bicsLevel || null;
          const optionValue = eachEntry.pristineText;
          const selectedOption = this.dtoService.generateSecurityDefinitionFilterIndividualOption(
            definitionDTO.data.key,
            optionValue,
            bicsLevel
          );
          selectedOption.isSelected = true;
          return selectedOption;
        });
        definitionDTO.state.filterActive = true;
        return definitionDTO;
      } else {
        return null;
      }
    }

    private resetSearchEngineStates() {
      const indexCopy = this.state.searchEngine.indexedKeywords;
      this.state.searchEngine = this.initializePageState().searchEngine;
      this.state.searchEngine.indexedKeywords = indexCopy;
    }
  // Search Engine End
}
