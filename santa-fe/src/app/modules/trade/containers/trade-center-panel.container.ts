  // dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { of, Subscription, Subject } from 'rxjs';
    import { catchError, first, tap, withLatestFrom, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

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
      SearchShortcutDTO,
      AlertDTO,
      SecurityTableDTO,
      AlertCountSummaryDTO
    } from 'FEModels/frontend-models.interface';
    import { TableFetchResultBlock } from 'FEModels/frontend-blocks.interface';
    import { PayloadGetTradeFullData } from 'BEModels/backend-payloads.interface';
    import {
      BEPortfolioDTO,
      BESecurityDTO,
      BEBestQuoteDTO,
      BEFetchAllTradeDataReturn
    } from 'BEModels/backend-models.interface';
    import { DefinitionConfiguratorEmitterParams, SecurityMapEntry } from 'FEModels/frontend-adhoc-packages.interface';
    import {
      TriCoreDriverConfig,
      DEFAULT_DRIVER_IDENTIFIER,
      EngagementActionList,
      AlertTypes,
      KEYWORDSEARCH_DEBOUNCE_TIME,
      FAILED_USER_INITIALS_FALLBACK,
      DevWhitelist
    } from 'Core/constants/coreConstants.constant';
    import { selectAlertCounts, selectUserInitials } from 'Core/selectors/core.selectors';
    import { CoreLoadSecurityMap, CoreUserLoggedIn } from 'Core/actions/core.actions';
    import {
      SecurityTableHeaderConfigs,
      SECURITY_TABLE_FINAL_STAGE
    } from 'Core/constants/securityTableConstants.constant';
    import { SecurityDefinitionMap, FullOwnerList } from 'Core/constants/securityDefinitionConstants.constant';
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
      selectKeywordSearchInMainTable
    } from 'Trade/selectors/trade.selectors';
    import {
      TradeLiveUpdatePassRawDataToMainTableEvent,
      TradeLiveUpdateProcessDataCompleteInMainTableEvent,
      TradeSelectedSecurityForAnalysisEvent,
      TradeSecurityTableRowDTOListForAnalysisEvent,
      TradeSelectedSecurityForAlertConfigEvent,
      TradeTogglePresetEvent,
      TradeAlertTableReceiveNewAlertsEvent
    } from 'Trade/actions/trade.actions';
    import { SecurityTableHeaderConfigStub, SearchShortcutStub } from 'FEModels/frontend-stub-models.interface';
  //

@Component({
  selector: 'trade-center-panel',
  templateUrl: './trade-center-panel.container.html',
  styleUrls: ['./trade-center-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeCenterPanel implements OnInit, OnDestroy {
  state: TradeCenterPanelState;
  subscriptions = {
    userInitialsSub: null,
    startNewUpdateSub: null,
    securityIDListFromAnalysisSub: null,
    validWindowSub: null,
    keywordSearchSub: null,
    receiveKeywordSearchInMainTable: null
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
    devWhitelist: DevWhitelist
  }

  private initializePageState(): TradeCenterPanelState {
    const mainTableMetrics = SecurityTableHeaderConfigs.filter((eachStub) => {
      const targetSpecifics = eachStub.content.tableSpecifics.tradeMain || eachStub.content.tableSpecifics.default;
      return !targetSpecifics.disabled;
    });
    const state: TradeCenterPanelState = {
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
        metrics: mainTableMetrics,
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
        }
      },
      filters: {
        keyword: {
          defaultValueForUI: ''
        },
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
        this.state.filters.quickFilters.keyword = keyword;
        targetTable.rowList = this.filterPrinstineRowList(targetTable.prinstineRowList);
        this.restfulCommService.logEngagement(
          EngagementActionList.applyKeywordSearch,
          'n/a',
          keyword,
          'Trade - Center Panel'
        );
      } else if (!keyword || keyword.length < 2) {
        this.state.filters.quickFilters.keyword = keyword;
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
        this.populateSearchShortcuts();
      }
    });
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

  public onUnselectPreset() {
    this.state.presets.selectedPreset.state.isSelected = false;
    this.state.presets.selectedPreset = null;
    this.state.configurator.dto = this.dtoService.createSecurityDefinitionConfigurator(true);
    this.state.filters.quickFilters = this.initializePageState().filters.quickFilters;
    // const alertTableCopy = this.utilityService.deepCopy(this.state.fetchResult.alertTable);
    this.state.fetchResult = this.initializePageState().fetchResult;
    // this.state.fetchResult.alertTable = alertTableCopy;
    this.store$.dispatch(new TradeTogglePresetEvent);
  }

  public buryConfigurator() {
    this.state.configurator.boosted = false;
  }

  public boostConfigurator() {
    this.state.configurator.boosted = true;
  }

  public onSwitchDriver(targetDriver) {
    if (this.state.filters.quickFilters.driverType !== targetDriver) {
      this.restfulCommService.logEngagement(
        EngagementActionList.switchDriver,
        'n/a',
        targetDriver,
        'Trade - Center Panel'
      );
      this.state.filters.quickFilters.driverType = targetDriver;
      // driver update needs to be to both tables
      const newMetrics: Array<SecurityTableHeaderConfigStub> = this.utilityService.deepCopy(this.state.table.metrics);
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

  public onApplyFilter(params: DefinitionConfiguratorEmitterParams, logEngagement: boolean) {
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
    this.state.fetchResult.mainTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.mainTable.prinstineRowList);
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

  public onSelectSecurityForAnalysis(targetSecurity: SecurityDTO) {
    this.store$.dispatch(new TradeSelectedSecurityForAnalysisEvent(this.utilityService.deepCopy(targetSecurity)));
    this.restfulCommService.logEngagement(
      EngagementActionList.selectSecurityForAnalysis,
      targetSecurity.data.securityID,
      'n/a',
      'Trade - Center Panel'
    );
  }

  public onSelectSecurityForAlertConfig(targetSecurity: SecurityDTO) {
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
    this.state.fetchResult.mainTable.prinstineRowList = [];
    this.loadInitialStencilTable();
    this.updateStage(0, this.state.fetchResult.mainTable, this.state.table.dto);
    this.fetchAllData(true);
  }

  private loadInitialStencilTable() {
    const stencilMainTableHeaderBuffer: Array<SecurityTableHeaderDTO> = [];
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
          if (eachHeader.state.isQuantVariant) {
            const bestQuoteStencil = this.dtoService.formQuantComparerObject(true, this.state.filters.quickFilters.driverType, null, null, false);
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
        // SecurityIdentifier: ['79', '6113', '19454', '1233|4.6Y']
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
      this.state.filters.quickFilters.driverType,
      serverReturn,
      this.onSelectSecurityForAnalysis.bind(this),
      this.onSelectSecurityForAlertConfig.bind(this)
    );
    this.calculateQuantComparerWidthAndHeight();
    this.state.fetchResult.mainTable.fetchComplete = true;
    this.updateStage(this.constants.securityTableFinalStage, this.state.fetchResult.mainTable, this.state.table.dto);
  }

  private updateStage(
    stageNumber: number,
    targetTableBlock: TableFetchResultBlock,
    targetTableDTO: SecurityTableDTO
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
          if (isInitialDataLoaded) {
            const newFilteredList = this.filterPrinstineRowList(targetTableBlock.prinstineRowList);
            targetTableBlock.liveUpdatedRowList = this.processingService.returnDiff(targetTableDTO, newFilteredList).newRowList;
          } else {
            targetTableBlock.rowList = this.filterPrinstineRowList(targetTableBlock.prinstineRowList);
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
    targetPrinstineList: Array<SecurityTableRowDTO>
  ): Array<SecurityTableRowDTO> {
    const filteredList: Array<SecurityTableRowDTO> = [];
    targetPrinstineList.forEach((eachRow) => {
      try {
        if (this.utilityService.caseInsensitiveKeywordMatch(eachRow.data.security.data.name, this.state.filters.quickFilters.keyword)
        || this.utilityService.caseInsensitiveKeywordMatch(eachRow.data.security.data.obligorName, this.state.filters.quickFilters.keyword)) {
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
      } catch(err) {
        console.error('filter issue', err ? err.message : '', eachRow);
      }
    });
    return filteredList;
  }

  private filterBySecurityAttribute(targetRow: SecurityTableRowDTO, targetAttribute: string, filterBy: Array<string>): boolean {
    let includeFlag = false;
    if (targetAttribute === 'portfolios' || targetAttribute === 'owner' || targetAttribute === 'strategyList') {
      // bypass portfolio filter since it is handled via this.filterByPortfolio() and this.filterByOwner() and this.filterByStrategy()
      return true;
    } else if (targetAttribute === 'seniority'){
      return this.filterBySeniority(targetRow);
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
      targetRow.data.security.data.position.positionCurrent = 0;
      targetRow.data.security.data.cs01CadCurrent = 0;
      targetRow.data.security.data.cs01LocalCurrent = 0;
      this.state.filters.quickFilters.portfolios.forEach((eachPortfolio) => {
        const portfolioExist = targetRow.data.security.data.portfolios.find((eachPortfolioBlock) => {
          return eachPortfolioBlock.portfolioName === eachPortfolio;
        });
        if (!!portfolioExist) {
          targetRow.data.security.data.position.positionCurrent = targetRow.data.security.data.position.positionCurrent + portfolioExist.quantity;
          targetRow.data.security.data.cs01CadCurrent = targetRow.data.security.data.cs01CadCurrent + portfolioExist.cs01Cad;
          targetRow.data.security.data.cs01LocalCurrent = targetRow.data.security.data.cs01LocalCurrent + portfolioExist.cs01Local;
          includeFlag = true;
        }
      });
    } else {
      includeFlag = true;
      targetRow.data.security.data.position.positionCurrent = targetRow.data.security.data.position.positionFirm;
      targetRow.data.security.data.cs01CadCurrent = targetRow.data.security.data.cs01CadFirm;
      targetRow.data.security.data.cs01LocalCurrent = targetRow.data.security.data.cs01LocalFirm;
    }
    targetRow.data.security.data.position.positionCurrentInMM = this.utilityService.parsePositionToMM(targetRow.data.security.data.position.positionCurrent, false, true);
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

  private filterBySeniority(row: SecurityTableRowDTO): boolean {
    let includeFlag = false;
    const filterObj = this.state.filters.securityFilters.filter(f => f.targetAttribute === 'seniority')[0];
    if (filterObj) {
      const includes = filterObj.filterBy.map(v => v.toLowerCase());
      const {seniority} = row.data.security.data;
      const seniorityName = seniority.split(' - ')[1];
      includeFlag = includes.indexOf(seniorityName.toLowerCase()) !== -1;
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
    this.utilityService.calculateQuantComparerWidthAndHeightPerSet(bestSpreadList);
    this.utilityService.calculateQuantComparerWidthAndHeightPerSet(bestYieldList);
    this.utilityService.calculateQuantComparerWidthAndHeightPerSet(bestPriceList);
  }

  private processSecurityIDsFromAnalysis(securityIDList: any[]) {
    const targetTable = this.state.fetchResult.mainTable;
    if (securityIDList) {
      if (securityIDList.length > 0) {
        let securityTableRowDTOList: SecurityTableRowDTO[] = [];
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
      tap((serverReturn: Object) => {
        if (!!serverReturn) {
          const map:Array<SecurityMapEntry> = [];
          for (const eachSecurityId in serverReturn) {
            map.push({
              keywords: serverReturn[eachSecurityId],
              secruityId: eachSecurityId
            });
          }
          this.store$.dispatch(new CoreLoadSecurityMap(map));
        } else {
          this.restfulCommService.logError('Failed to load SecurityId map, can not populate alert configuration');
        }
      })
    ).subscribe();
  }
}
