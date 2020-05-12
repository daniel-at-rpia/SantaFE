  // dependencies
    import {Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
    import {of, Subscription} from 'rxjs';
    import {catchError, first, tap, withLatestFrom} from 'rxjs/operators';
    import {select, Store} from '@ngrx/store';

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
      SecurityTableDTO
    } from 'FEModels/frontend-models.interface';
    import { TradeCenterTableBlock } from 'FEModels/frontend-blocks.interface';
    import {PayloadGetTradeFullData} from 'BEModels/backend-payloads.interface';
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
      selectBestQuoteValidWindow,
      selectNewAlertsForAlertTable,
      selectLiveUpdateProcessingRawData
    } from 'Trade/selectors/trade.selectors';
    import {
      TradeLiveUpdatePassRawDataEvent,
      TradeLiveUpdateProcessDataCompleteEvent,
      TradeSelectedSecurityForAnalysisEvent,
      TradeSecurityTableRowDTOListForAnalysisEvent,
      TradeSelectedSecurityForAlertConfigEvent,
      TradeTogglePresetEvent,
      TradeSwitchDriverEvent,
      TradeSetFocusMode,
      TradeAlertTableReceiveNewAlertsEvent
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
    validWindowSub: null,
    newAlertsForAlertTableSub: null
  };
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
    const mainTableMetrics = SecurityTableMetrics.filter((eachStub) => {
      const targetSpecifics = eachStub.tableSpecifics.tradeMain || eachStub.tableSpecifics.default;
      return !targetSpecifics.disabled;
    });
    const alertTableMetrics = SecurityTableMetrics.filter((eachStub) => {
      const targetSpecifics = eachStub.tableSpecifics.tradeAlert || eachStub.tableSpecifics.default;
      return !targetSpecifics.disabled;
    });
    const state: TradeCenterPanelState = {
      bestQuoteValidWindow: null,
      isFocusMode: false,
      displayAlertTable: false,
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
        dto: this.dtoService.formSecurityTableObject(true),
        alertMetrics: alertTableMetrics,
        alertDto: this.dtoService.formSecurityTableObject(true)
      },
      fetchResult: {
        fetchTableDataFailed: false,
        fetchTableDataFailedError: '',
        mainTable: {
          currentContentStage: 0,
          fetchComplete: false,
          rowList: [],
          prinstineRowList: [],
          liveUpdatedRowList: []
        },
        alertTable: {
          currentContentStage: 0,
          fetchComplete: false,
          rowList: [],
          prinstineRowList: [],
          liveUpdatedRowList: []
        }
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
      },
      alert: {
        alertTableAlertList: [],
        initialAlertListReceived: false,
        delayedLoadingFreshDataForAlert: false,
        newAlertsCount: 0
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

    this.subscriptions.newAlertsForAlertTableSub = this.store$.pipe(
      select(selectNewAlertsForAlertTable)
    ).subscribe((list: Array<AlertDTO>) => {
      if (list) {
        if (list.length > 0) {
          list.forEach((eachAlert) => {
            this.state.alert.alertTableAlertList.push(eachAlert);
          });
          this.store$.dispatch(new TradeAlertTableReceiveNewAlertsEvent());
        }
        if (this.state.alert.delayedLoadingFreshDataForAlert) {
          this.state.alert.delayedLoadingFreshDataForAlert = false;
          this.fetchAllData(true);
        }
      }
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
      const newMetrics: Array<SecurityTableMetricStub> = this.utilityService.deepCopy(this.state.table.metrics);
      const newAlertMetrics: Array<SecurityTableMetricStub> = this.utilityService.deepCopy(this.state.table.alertMetrics);
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
      newAlertMetrics.forEach((eachMetricStub) => {
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
      this.state.table.alertMetrics = newAlertMetrics;
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
      this.state.fetchResult.mainTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.mainTable.prinstineRowList);
    // }
    this.restfulCommService.logEngagement(
      EngagementActionList.applyFilter,
      'n/a',
      'n/a',
      'Trade - Center Panel'
    );
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
    this.restfulCommService.logEngagement(
      EngagementActionList.sendToAlertConfig,
      targetSecurity.data.securityID,
      'n/a',
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
    const targetTable = this.state.displayAlertTable ? this.state.fetchResult.alertTable : this.state.fetchResult.mainTable;
    if (!!newKeyword && newKeyword.length >= 2 && newKeyword != this.state.filters.quickFilters.keyword) {
      this.state.filters.quickFilters.keyword = newKeyword;
      targetTable.rowList = this.filterPrinstineRowList(targetTable.prinstineRowList);
    } else if ((!newKeyword || newKeyword.length < 2) && !!this.state.filters.quickFilters.keyword && this.state.filters.quickFilters.keyword.length >= 2) {
      this.state.filters.quickFilters.keyword = newKeyword;
      targetTable.rowList = this.filterPrinstineRowList(targetTable.prinstineRowList);
    }
  }

  public onSwitchTable() {
    this.state.displayAlertTable = !this.state.displayAlertTable;
    if (this.state.displayAlertTable) {
      this.state.alert.newAlertsCount = 0;
    }
    const keywordCopy = this.state.filters.quickFilters.keyword;
    this.state.filters.quickFilters.keyword = '';
    this.onSearchKeywordChange(keywordCopy);
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
    this.updateStage(0, this.state.fetchResult.alertTable, this.state.table.alertDto);
    if (this.state.alert.initialAlertListReceived) {
      // only load fresh data once the initial alert list is received, this is in order to follow the rule that alert table and main table are always updated at the same time, this rule dramatically reduces the complexity in code to hanlde the two concurrent data fetching processes
      this.fetchAllData(true);
    } else {
      this.state.alert.delayedLoadingFreshDataForAlert = true;
    }
  }

  private loadInitialStencilTable() {
    const stencilMainTableHeaderBuffer: Array<SecurityTableHeaderDTO> = [];
    const stencilAlertTableHeaderBuffer: Array<SecurityTableHeaderDTO> = [];
    this.state.table.metrics.forEach((eachStub) => {
      const targetSpecifics = eachStub.tableSpecifics.tradeMain || eachStub.tableSpecifics.default;
      if (eachStub.isForSecurityCard || targetSpecifics.active) {
        stencilMainTableHeaderBuffer.push(this.dtoService.formSecurityTableHeaderObject(eachStub, 'tradeMain', []));
      }
    });
    this.state.table.alertMetrics.forEach((eachStub) => {
      const targetSpecifics = eachStub.tableSpecifics.tradeAlert || eachStub.tableSpecifics.default;
      if (eachStub.isForSecurityCard || targetSpecifics.active) {
        stencilAlertTableHeaderBuffer.push(this.dtoService.formSecurityTableHeaderObject(eachStub, 'tradeAlert', []));
      }
    });
    for (let i = 0; i < 10; ++i) {
      const stencilSecurity = this.dtoService.formSecurityCardObject(null, null, true);
      stencilSecurity.state.isInteractionDisabled = true;
      const newMainTableRow = this.dtoService.formSecurityTableRowObject(stencilSecurity);
      stencilMainTableHeaderBuffer.forEach((eachHeader) => {
        if (!eachHeader.state.isSecurityCardVariant) {
          if (eachHeader.state.isQuantVariant) {
            const bestQuoteStencil = this.dtoService.formQuantComparerObject(true, this.state.filters.quickFilters.driverType, null, null, false);
            newMainTableRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, true, bestQuoteStencil, null));
          } else {
            newMainTableRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, false, null, null));
          }
        }
      });
      this.state.fetchResult.mainTable.prinstineRowList.push(this.utilityService.deepCopy(newMainTableRow));
      const newAlertTableRow = this.dtoService.formSecurityTableRowObject(stencilSecurity);
      stencilAlertTableHeaderBuffer.forEach((eachHeader) => {
        if (!eachHeader.state.isSecurityCardVariant) {
          if (eachHeader.state.isQuantVariant) {
            const bestQuoteStencil = this.dtoService.formQuantComparerObject(true, this.state.filters.quickFilters.driverType, null, null, false);
            newAlertTableRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, true, bestQuoteStencil, null));
          } else {
            newAlertTableRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, false, null, null));
          }
        }
      });
      this.state.fetchResult.alertTable.prinstineRowList.push(this.utilityService.deepCopy(newAlertTableRow));
    };
    this.state.fetchResult.mainTable.rowList = this.utilityService.deepCopy(this.state.fetchResult.mainTable.prinstineRowList);
    this.state.fetchResult.alertTable.rowList = this.utilityService.deepCopy(this.state.fetchResult.alertTable.prinstineRowList);
  }

  private fetchAllData(isInitialFetch: boolean) {
    this.fetchDataForMainTable(isInitialFetch);
    this.fetchDataForAlertTable(isInitialFetch);
  }

  private fetchDataForMainTable(isInitialFetch: boolean) {
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
    this.state.fetchResult.mainTable.fetchComplete = false;
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getPortfolios, { req: 'POST' }, payload, false, false).pipe(
      first(),
      tap((serverReturn) => {
        if (!isInitialFetch) {
          !this.state.displayAlertTable && this.store$.dispatch(new TradeLiveUpdatePassRawDataEvent());
        } else {
          this.updateStage(0, this.state.fetchResult.mainTable, this.state.table.dto);
        }
        this.loadDataForMainTable(serverReturn);
      }),
      catchError(err => {
        this.restfulCommService.logError(`Get portfolios failed`);
        this.store$.dispatch(new TradeLiveUpdatePassRawDataEvent());
        this.store$.dispatch(new TradeLiveUpdateProcessDataCompleteEvent());
        this.updateStage(this.constants.securityTableFinalStage, this.state.fetchResult.mainTable, this.state.table.dto);
        console.error('error', err);
        this.state.fetchResult.fetchTableDataFailed = true;
        this.state.fetchResult.fetchTableDataFailedError = err.message;
        this.state.fetchResult.mainTable.prinstineRowList = [];
        this.state.fetchResult.mainTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.mainTable.prinstineRowList);
        this.state.fetchResult.alertTable.prinstineRowList = [];
        this.state.fetchResult.alertTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.alertTable.prinstineRowList);
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
      this.onClickOpenSecurityInBloomberg.bind(this),
      this.onSelectSecurityForAlertConfig.bind(this)
    );
    this.calculateQuantComparerWidthAndHeight();
    this.state.fetchResult.mainTable.fetchComplete = true;
    this.updateStage(this.constants.securityTableFinalStage, this.state.fetchResult.mainTable, this.state.table.dto);
  }

  private fetchDataForAlertTable(isInitialFetch: boolean) {
    const securityList = [];
    this.state.alert.alertTableAlertList.forEach((eachAlert) => {
      const targetSecurityId = eachAlert.data.security.data.securityID;
      if (!securityList.includes(targetSecurityId)) {
        securityList.push(targetSecurityId);
      }
    });
    const payload: PayloadGetTradeFullData = {
      maxNumberOfSecurities: 2000,
      groupIdentifier: {},
      groupFilters: {
        SecurityIdentifier: securityList
      }
    };
    this.state.fetchResult.alertTable.fetchComplete = false;
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getPortfolios, { req: 'POST' }, payload, false, false).pipe(
      first(),
      tap((serverReturn) => {
        if (!isInitialFetch) {
          this.state.displayAlertTable && this.store$.dispatch(new TradeLiveUpdatePassRawDataEvent());
        } else {
          this.updateStage(0, this.state.fetchResult.alertTable, this.state.table.alertDto);
        }
        this.loadDataForAlertTable(serverReturn);
      }),
      catchError(err => {
        this.restfulCommService.logError(`Get alert table failed`);
        this.store$.dispatch(new TradeLiveUpdatePassRawDataEvent());
        this.store$.dispatch(new TradeLiveUpdateProcessDataCompleteEvent());
        console.error('error', err);
        this.state.fetchResult.fetchTableDataFailed = true;
        this.state.fetchResult.fetchTableDataFailedError = err.message;
        this.state.fetchResult.mainTable.prinstineRowList = [];
        this.state.fetchResult.mainTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.mainTable.prinstineRowList);
        this.state.fetchResult.alertTable.prinstineRowList = [];
        this.state.fetchResult.alertTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.alertTable.prinstineRowList);
        return of('error');
      })
    ).subscribe();
  }

  private loadDataForAlertTable(serverReturn: BEFetchAllTradeDataReturn){
    this.state.fetchResult.alertTable.prinstineRowList = [];  // flush out the stencils
    this.state.fetchResult.alertTable.prinstineRowList = this.processingService.loadFinalStageDataForAlertTable(
      this.state.alert.alertTableAlertList,
      this.state.table.alertDto.data.headers,
      this.state.filters.quickFilters.driverType,
      serverReturn,
      this.onSelectSecurityForAnalysis.bind(this),
      this.onClickOpenSecurityInBloomberg.bind(this),
      this.onSelectSecurityForAlertConfig.bind(this)
    );
    this.calculateQuantComparerWidthAndHeight();
    this.updateStage(this.constants.securityTableFinalStage, this.state.fetchResult.alertTable, this.state.table.alertDto);
    this.state.fetchResult.alertTable.fetchComplete = true;
    // this.state.fetchResult.alertTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.alertTable.prinstineRowList);
  }

  private updateStage(
    stageNumber: number,
    targetTableBlock: TradeCenterTableBlock,
    targetTableDTO: SecurityTableDTO
  ) {
    targetTableBlock.currentContentStage = stageNumber;
    if (targetTableBlock.currentContentStage === this.constants.securityTableFinalStage) {
      this.store$.pipe(
        select(selectInitialDataLoaded),
        withLatestFrom(
          this.store$.pipe(select(selectLiveUpdateProcessingRawData))
        ),
        first(),
        tap(([isInitialDataLoaded, processingRawData]) => {
          if (isInitialDataLoaded) {
            const newFilteredList = this.filterPrinstineRowList(targetTableBlock.prinstineRowList);
            targetTableBlock.liveUpdatedRowList = this.processingService.returnDiff(targetTableDTO, newFilteredList).newRowList;
            if (targetTableBlock === this.state.fetchResult.alertTable && !this.state.displayAlertTable) {
              this.state.alert.newAlertsCount = targetTableBlock.liveUpdatedRowList.length;
            }
          } else {
            targetTableBlock.rowList = this.filterPrinstineRowList(targetTableBlock.prinstineRowList);
            if (targetTableBlock === this.state.fetchResult.alertTable && !this.state.displayAlertTable) {
              this.state.alert.newAlertsCount = targetTableBlock.rowList.length;
            }
          }
          // only dispatch the action when both tables are done
          if (!!this.state.fetchResult.alertTable.fetchComplete && !!this.state.fetchResult.mainTable.fetchComplete) {
            this.store$.dispatch(new TradeLiveUpdateProcessDataCompleteEvent());
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
            // only main table will apply security-level filters
            if (!this.state.displayAlertTable) {
              // as long as one of the filters failed, this security will not show
              securityLevelFilterResultCombined = securityLevelFilterResult.filter((eachResult) => {
                return eachResult;
              }).length === securityLevelFilterResult.length;
            }
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
    targetRow.data.security.data.position.positionCurrentInMM = this.utilityService.parsePositionToMM(targetRow.data.security.data.position.positionCurrent, false);
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
    const combinedRowList = this.state.fetchResult.mainTable.prinstineRowList.concat(this.state.fetchResult.alertTable.prinstineRowList);
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
    // const maxSize = this.utilityService.findPercentile(sizeList, QUANT_COMPARER_PERCENTILE);
    const maxSize = 50;

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
    const targetTable = this.state.displayAlertTable ? this.state.fetchResult.alertTable : this.state.fetchResult.mainTable;
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
  onToggleFocusMode() {
    this.state.isFocusMode = !this.state.isFocusMode;
    this.store$.dispatch(new TradeSetFocusMode(this.state.isFocusMode));
  }
}
