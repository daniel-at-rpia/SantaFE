  // dependencies
    import { Component, EventEmitter, Input, isDevMode, OnChanges, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
    import { select, Store } from '@ngrx/store';
    import { interval, Observable, of, Subscription, Subject } from 'rxjs';
    import { catchError, first, tap, withLatestFrom, debounceTime, distinctUntilChanged } from 'rxjs/operators';
    import * as moment from 'moment';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { LiveDataProcessingService } from 'Trade/services/LiveDataProcessingService';
    import { TradeAlertPanelState } from 'FEModels/frontend-page-states.interface';
    import { SecurityMapEntry } from 'FEModels/frontend-adhoc-packages.interface';
    import {
      SecurityTableHeaderDTO,
      AlertCountSummaryDTO,
      SecurityTableDTO,
      SecurityDTO,
      AlertDTO,
      SecurityTableRowDTO,
      NumericFilterDTO
    } from 'FEModels/frontend-models.interface';
    import { TableFetchResultBlock, TradeAlertConfigurationAxeGroupBlock } from 'FEModels/frontend-blocks.interface';
    import {
      BESecurityDTO,
      BEAlertConfigurationReturn,
      BEAlertConfigurationDTO,
      BEAlertDTO,
      BEFetchAllTradeDataReturn
    } from 'BEModels/backend-models.interface';
    import {
      PayloadGetSecurities,
      PayloadUpdateAlertConfig,
      PayloadUpdateSingleAlertConfig,
      PayloadGetTradeFullData
    } from 'BEModels/backend-payloads.interface';
    import {
      selectAlertCounts,
      selectSecurityMapContent,
      selectSecurityMapValidStatus,
      selectUserInitials
    } from 'Core/selectors/core.selectors';
    import {
      ALERT_MAX_SECURITY_SEARCH_COUNT,
      AxeAlertScope,
      ALERT_UPDATE_COUNTDOWN,
      AxeAlertType
    } from 'Core/constants/tradeConstants.constant';
    import { FullOwnerList, FilterOptionsPortfolioResearchList } from 'Core/constants/securityDefinitionConstants.constant';
    import { CoreFlushSecurityMap, CoreSendNewAlerts } from 'Core/actions/core.actions';
    import {
      TradeAlertTableReceiveNewAlertsEvent,
      TradeSelectedSecurityForAnalysisEvent,
      TradeAlertTableSendNewAlertsEvent,
      TradeLiveUpdatePassRawDataToAlertTableEvent,
      TradeLiveUpdateProcessDataCompleteInAlertTableEvent,
      TradeKeywordSearchThisSecurityEvent
    } from 'Trade/actions/trade.actions';
    import {
      selectNewAlertsForAlertTable,
      selectLiveUpdateTick,
      selectInitialDataLoadedInAlertTable,
      selectLiveUpdateProcessingRawDataInAlertTable,
      selectSelectedSecurityForAlertConfig,
      selectPresetSelected
    } from 'Trade/selectors/trade.selectors';
    import {
      SecurityTableHeaderConfigs,
      SECURITY_TABLE_FINAL_STAGE
    } from 'Core/constants/securityTableConstants.constant';
    import {
      DEFAULT_DRIVER_IDENTIFIER,
      EngagementActionList,
      AlertSubTypes,
      AlertTypes,
      KEYWORDSEARCH_DEBOUNCE_TIME,
      TriCoreDriverConfig
    } from 'Core/constants/coreConstants.constant';
    import { AlertSample } from 'Trade/stubs/tradeAlert.stub';
  //

@Component({
  selector: 'trade-alert-panel',
  templateUrl: './trade-alert-panel.container.html',
  styleUrls: ['./trade-alert-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeAlertPanel implements OnInit, OnChanges, OnDestroy {
  @Input() sidePanelsDisplayed: boolean;
  @Input() collapseConfiguration: boolean;
  @Output() configureAlert = new EventEmitter();
  @Output() saveConfig = new EventEmitter();
  @Output() showAlertTable = new EventEmitter();
  @Output() collapseAlertTable = new EventEmitter();
  state: TradeAlertPanelState;
  subscriptions = {
    userInitialsSub: null,
    securityMapSub: null,
    autoUpdateCountSub: null,
    selectedSecurityForAlertConfigSub: null,
    centerPanelPresetSelectedSub: null,
    alertCountSub: null,
    startNewUpdateSub: null,
    keywordSearchSub: null
  }
  keywordChanged$: Subject<string> = new Subject<string>();
  autoUpdateCount$: Observable<any>;
  constants = {
    // alertTypes: AlertTypes,
    alertTypes: AlertTypes,
    alertSubTypes: AlertSubTypes,
    axeAlertScope: AxeAlertScope,
    axeAlertType: AxeAlertType,
    countdown: ALERT_UPDATE_COUNTDOWN,
    fullOwnerList: FullOwnerList,
    researchList: FilterOptionsPortfolioResearchList,
    defaultMetricIdentifier: DEFAULT_DRIVER_IDENTIFIER,
    securityTableFinalStage: SECURITY_TABLE_FINAL_STAGE,
    keywordSearchDebounceTime: KEYWORDSEARCH_DEBOUNCE_TIME,
    driver: TriCoreDriverConfig
  }

  constructor(
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService,
    private processingService: LiveDataProcessingService
  ){
    window['moment'] = moment;
    this.state = this.initializePageState();
  }

  // general
    private initializePageState(): TradeAlertPanelState {
      const alertTableMetrics = SecurityTableHeaderConfigs.filter((eachStub) => {
        const targetSpecifics = eachStub.content.tableSpecifics.tradeAlert || eachStub.content.tableSpecifics.default;
        return !targetSpecifics.disabled;
      });
      const state: TradeAlertPanelState = {
        isUserPM: false,
        configureAlert: false,
        isAlertPaused: true,
        securityMap: [],
        alertUpdateTimestamp: null,
        // focusMode: false,
        configuration: {
          axe: {
            securitySearchKeyword: '',
            securityList: [],
            searchList: [],
            matchedResultCount: 0,
            searchIsValid: false
          }
        },
        autoUpdateCountdown: 4,
        alertUpdateInProgress: false,
        isCenterPanelPresetSelected: false,
        receivedActiveAlertsMap: {},
        displayAlertTable: false,
        table: {
          alertMetrics: alertTableMetrics,
          alertDto: this.dtoService.formSecurityTableObject(true, false)
        },
        fetchResult: {
          fetchTableDataFailed: false,
          fetchTableDataFailedError: '',
          alertTable: {
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
            keyword: '',
            driverType: this.constants.defaultMetricIdentifier,
            portfolios: [],
          }
        },
        alert: {
          alertTableAlertList: {},
          initialAlertListReceived: false,
          nonMarketListAxeAlertCount: 0,
          marketListAxeAlertCount: 0,
          unreadAxeAlertCount: 0,
          markAlertCount: 0,
          unreadMarkAlertCount: 0,
          tradeAlertCount: 0,
          unreadTradeAlertCount: 0,
          scopedForMarketListOnly: false,
          scopedAlertType: null,
          recentUpdatedAlertList: []
        }
      };
      return state;
    }

    public ngOnInit() {
      this.subscriptions.securityMapSub = this.store$.pipe(
        select(selectSecurityMapContent),
        withLatestFrom(
          this.store$.pipe(select(selectSecurityMapValidStatus))
        )
      ).subscribe(([mapContent, isValid]) => {
        if (!!isValid) {
          this.state.securityMap = mapContent;
          this.state.isAlertPaused = false;
          this.store$.dispatch(new CoreFlushSecurityMap());
        }
      });

      this.autoUpdateCount$ = interval(1000);
      this.subscriptions.autoUpdateCountSub = this.autoUpdateCount$.subscribe(count => {
        if (this.state.isCenterPanelPresetSelected && !this.state.isAlertPaused && !this.state.alertUpdateInProgress) {
          this.state.autoUpdateCountdown = this.state.autoUpdateCountdown + 1;
          if (this.state.autoUpdateCountdown >= this.constants.countdown) {
            this.updateAlert();
            this.state.autoUpdateCountdown = 0;
          }
          if (this.state.alert.initialAlertListReceived && this.state.fetchResult.alertTable.fetchComplete) {
            const numOfUpdate = this.marketListAlertsCountdownUpdate();
            if (numOfUpdate > 0){
              // if there is no new alert, but there are existing active marketlist alerts, then the table still needs to be updated for refreshing the countdowns
              this.state.fetchResult.alertTable.liveUpdatedRowList = this.identifyTableUpdate(this.state.fetchResult.alertTable, true);
              this.state.alert.recentUpdatedAlertList = [];
            }
          }
        }
      });
      this.subscriptions.selectedSecurityForAlertConfigSub = this.store$.pipe(
          select(selectSelectedSecurityForAlertConfig)
        ).subscribe((targetSecurity) => {
          if (!!targetSecurity) {
            const existMatchIndex = this.state.configuration.axe.securityList.findIndex((eachEntry) => {
              return eachEntry.card.data.securityID === targetSecurity.data.securityID;
            });
            if (existMatchIndex < 0) {
              this.addSecurityToWatchList(targetSecurity);
            } else {
              const targetEntry = this.state.configuration.axe.securityList[existMatchIndex];
              targetEntry.isDeleted = false;
              targetEntry.isDisabled = false;
              targetEntry.targetDriver = targetSecurity.data.alert.shortcutConfig.driver;
              targetEntry.targetRange = targetSecurity.data.alert.shortcutConfig.numericFilterDTO;
            }
            const systemAlert = this.dtoService.formSystemAlertObject('Axe Watchlist', 'Updated', `Start watching for axe on`, targetSecurity);
            this.store$.dispatch(new CoreSendNewAlerts([systemAlert]));
            this.saveAxeConfiguration();
            this.restfulCommService.logEngagement(
              EngagementActionList.sendToAlertConfig,
              targetSecurity.data.securityID,
              `Current Number of Alerts = ${this.state.configuration.axe.securityList.length}`,
              'Trade - Alert Panel'
            );
          }
      });

      this.subscriptions.centerPanelPresetSelectedSub = this.store$.pipe(
        select(selectPresetSelected)
      ).subscribe(flag => {
        this.state.isCenterPanelPresetSelected = flag;
      });

      this.subscriptions.startNewUpdateSub = this.store$.pipe(
        select(selectLiveUpdateTick),
        withLatestFrom(
          this.store$.pipe(select(selectInitialDataLoadedInAlertTable))
        )
      ).subscribe(([tick, isInitialDataLoaded]) => {
        if (tick > 0 && isInitialDataLoaded) {  // skip first beat
          if (this.state.fetchResult.fetchTableDataFailed) {
            window.location.reload(true);
          } else {
            this.fetchUpdate([]);
          }
        }
      });

      this.subscriptions.keywordSearchSub = this.keywordChanged$.pipe(
        debounceTime(this.constants.keywordSearchDebounceTime),
        distinctUntilChanged()
      ).subscribe((keyword) => {
        const targetTable = this.state.fetchResult.alertTable;
        if (!!keyword && keyword.length >= 2 && keyword != this.state.filters.quickFilters.keyword) {
          this.state.filters.quickFilters.keyword = keyword;
          targetTable.rowList = this.filterPrinstineRowList(targetTable.prinstineRowList);
          this.restfulCommService.logEngagement(
            EngagementActionList.applyKeywordSearch,
            'n/a',
            keyword,
            'Trade - Alert Panel'
          );
        } else if ((!keyword || keyword.length < 2) && !!this.state.filters.quickFilters.keyword && this.state.filters.quickFilters.keyword.length >= 2) {
          this.state.filters.quickFilters.keyword = keyword;
          targetTable.rowList = this.filterPrinstineRowList(targetTable.prinstineRowList);
        }
      });

      this.subscriptions.userInitialsSub = this.store$.pipe(
        select(selectUserInitials)
      ).subscribe((userInitials) => {
        if (userInitials) {
          this.state.isUserPM = this.constants.fullOwnerList.indexOf(userInitials) >= 0;
        }
      });
      this.loadAllConfigurations();
    }

    public ngOnChanges() {
      if (!!this.collapseConfiguration) {
        this.state.configureAlert = false;
      }
    }

    public ngOnDestroy() {
      for (const eachItem in this.subscriptions) {
        const eachSub = this.subscriptions[eachItem] as Subscription;
        eachSub.unsubscribe();
      }
    }

    private updateAlert() {
      this.state.alertUpdateInProgress = true;
      const payload = {
        "timeStamp": this.state.alertUpdateTimestamp ||  moment().hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ss.SSS")
      };
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getAlerts, {req: 'POST'}, payload).pipe(
        first(),
        tap((serverReturn: Array<BEAlertDTO>) => {
          // using synthetic alerts for dev purposes
          // serverReturn = !this.state.alert.initialAlertListReceived ? AlertSample : [];
          const filteredServerReturn = !!serverReturn ? serverReturn.filter((eachRawAlert) => {
            // no filtering logic for now
            return true;
          }) : [];
          const updateList: Array<AlertDTO> = [];
          const alertTableList: Array<AlertDTO> = [];
          const alertTableRemovalList: Array<AlertDTO> = [];  // currently the only alerts that needs to be removed are the cancelled trade alerts
          filteredServerReturn.forEach((eachRawAlert) => {
            // Trade alerts are handled differently since BE passes the same trade alerts regardless of the timestamp FE provides
            if (!!eachRawAlert.marketListAlert) {
              if (this.state.receivedActiveAlertsMap[eachRawAlert.alertId]) {
                // ignore, already have it
              } else if (!eachRawAlert.isActive) {
                // ignore, already expired
                const newAlert = this.dtoService.formAlertObjectFromRawData(eachRawAlert);
                if (newAlert.data.security && newAlert.data.security.data.securityID) {
                  alertTableList.push(newAlert);
                }
              } else {
                this.state.receivedActiveAlertsMap[eachRawAlert.alertId] = eachRawAlert.keyWord;
                const newAlert = this.dtoService.formAlertObjectFromRawData(eachRawAlert);
                updateList.push(newAlert);
                if (newAlert.data.security && newAlert.data.security.data.securityID) {
                  alertTableList.push(newAlert);
                }
              }
            } else {
              const newAlert = this.dtoService.formAlertObjectFromRawData(eachRawAlert);
              if (eachRawAlert.isCancelled) {
                // cancellation of alerts carries diff meaning depending on the alert type:
                // axe & mark & inquiry: it could be the trader entered it by mistake, but it could also be the trader changed his mind so he/she cancels the previous legitmate entry. So when such an cancelled alert comes in
                // trade: since it is past tense, so it could only be cancelled because of entered by mistake
                if (newAlert.data.type === this.constants.alertTypes.markAlert || newAlert.data.type === this.constants.alertTypes.axeAlert) {
                  !newAlert.state.isRead && alertTableList.push(newAlert);
                  updateList.push(newAlert);
                } else if (newAlert.data.type === this.constants.alertTypes.tradeAlert) {
                  alertTableRemovalList.push(newAlert);
                }
              } else {
                if (!newAlert.state.isRead && newAlert.data.isUrgent && !newAlert.state.isRead) {
                  updateList.push(newAlert);
                }
                if (newAlert.data.security && newAlert.data.security.data.securityID) {
                  alertTableList.push(newAlert);
                }
              }
            }
          });
          updateList.length > 0 && this.store$.dispatch(new CoreSendNewAlerts(this.utilityService.deepCopy(updateList)));
          if (alertTableRemovalList.length > 0) {
            console.log('remove alerts', alertTableRemovalList);
            this.populateTableRowRemovalList(alertTableRemovalList);
          }
          if (alertTableList.length > 0) {
            if (this.state.alert.initialAlertListReceived) {
              this.fetchUpdate(alertTableList);
            } else {
              this.loadFreshData(alertTableList);
            }
          }
          this.state.alertUpdateInProgress = false;
        }),
        catchError(err => {
          this.state.alertUpdateInProgress = false;
          console.error(`${this.restfulCommService.apiMap.getAlerts} failed`, err);
          return of('error');
        })
      ).subscribe();
      // timeStamp needs to be updated right after the API call initiates, NOT when it returns
      this.state.alertUpdateTimestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSS");
    }

    private marketListAlertsCountdownUpdate(): number {
      let numOfUpdate = 0;
      this.state.fetchResult.alertTable.rowList.forEach((eachRow) => {
        if (!!eachRow && !!eachRow.data.alert && !!eachRow.data.alert.state) {
          if (eachRow.data.alert.state.isMarketListVariant) {
            if (!eachRow.data.alert.state.isExpired || eachRow.data.alert.data.status.indexOf('-') >= 0) {
              numOfUpdate++;
              this.dtoService.appendAlertStatus(eachRow.data.alert);
              this.dtoService.appendAlertInfoToSecurityDTO(eachRow.data.security, eachRow.data.alert);
              this.state.table.alertDto.data.headers.forEach((eachHeader, index) =>{
                // the benefit of doing this loop is if in the future we need to refresh any other cells as well, it can be done easily by just appending to the if condition
                if (eachHeader.data.key === 'alertStatus') {
                  // minus one because securityCard is not one of the cells ( TODO: this is a bad design, what if a table has more than one security card column? should not treat it different from other columns )
                  // this basically updates the alert status cell
                  eachRow.data.cells[index-1] = this.utilityService.populateSecurityTableCellFromSecurityCard(
                    eachHeader,
                    eachRow,
                    this.dtoService.formSecurityTableCellObject(false, null, eachHeader, null, eachRow.data.alert),
                    this.constants.defaultMetricIdentifier
                  );
                }
              });
              this.state.alert.recentUpdatedAlertList.push(eachRow.data.rowId);
            }
          }
        }
      });
      return numOfUpdate;
    }
  // general end

  // overview section
    public onClickShowAllAlerts() {
      if (this.state.fetchResult.alertTable.fetchComplete) {
        if (!!this.state.alert.scopedAlertType || !this.state.displayAlertTable) {
          this.state.displayAlertTable = true;
          this.state.alert.scopedAlertType = null;
          this.state.fetchResult.alertTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.alertTable.prinstineRowList);
        } else {
          this.state.displayAlertTable = false;
        }
        if (this.state.displayAlertTable) {
          // collapse the configuration UI
          this.state.configureAlert = false;
          this.showAlertTable && this.showAlertTable.emit();
        } else {
          this.collapseAlertTable && this.collapseAlertTable.emit();
        }
        this.restfulCommService.logEngagement(
          EngagementActionList.tradeAlertClickedTab,
          'n/a',
          `All Alerts Tab - ${this.state.displayAlertTable ? 'Open' : 'Close'}`,
          'Trade - Alert Panel'
        );
      }
    }

    public onClickConfigureAlert() {
      this.state.configureAlert = !this.state.configureAlert;
      if (this.state.configureAlert) {
        this.configureAlert.emit();
        this.state.configureAlert = true;
        this.state.configuration.axe = this.initializePageState().configuration.axe;
        this.loadAllConfigurations();
        // collapse the alert table
        this.state.displayAlertTable = false;
        this.state.alert.scopedAlertType = null;
        this.restfulCommService.logEngagement(
          this.restfulCommService.engagementMap.tradeAlertOpenConfiguration,
          null,
          null,
          'Trade Alert Panel'
        );
      } else if (!this.state.displayAlertTable) {
        this.collapseAlertTable.emit();
      }
    }

    public onClickSpecificAlertTypeTab(
      targetType: AlertTypes,
      isMarketListOnly?: boolean
    ) {
      if (this.state.fetchResult.alertTable.fetchComplete) {
        const tabName = isMarketListOnly ? 'Inquiry' : targetType;
        if (targetType === this.constants.alertTypes.axeAlert) {
          if (this.state.alert.scopedAlertType !== targetType || this.state.alert.scopedForMarketListOnly !== !!isMarketListOnly) {
            this.state.displayAlertTable = true;
            this.state.alert.scopedAlertType = targetType;
            this.state.alert.scopedForMarketListOnly = !!isMarketListOnly;
            this.state.fetchResult.alertTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.alertTable.prinstineRowList);
          } else {
            this.state.displayAlertTable = false;
            this.state.alert.scopedAlertType = null;
          }
        } else {
          this.state.alert.scopedForMarketListOnly = false;
          if (this.state.alert.scopedAlertType !== targetType) {
            this.state.displayAlertTable = true;
            this.state.alert.scopedAlertType = targetType;
            this.state.fetchResult.alertTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.alertTable.prinstineRowList);
          } else {
            this.state.displayAlertTable = false;
            this.state.alert.scopedAlertType = null;
          }
        }
        if (this.state.displayAlertTable) {
          // collapse the configuration UI
          this.state.configureAlert = false;
          this.showAlertTable && this.showAlertTable.emit();
        } else {
          this.collapseAlertTable && this.collapseAlertTable.emit();
        }
        this.restfulCommService.logEngagement(
          EngagementActionList.tradeAlertClickedTab,
          'n/a',
          `${tabName} Tab - ${this.state.displayAlertTable ? 'Open' : 'Close'}`,
          'Trade - Alert Panel'
        );
      }
    }
  // overview section end

  // configuration section
    public onConfigSearchKeywordChange(keyword: string) {
      const config = this.state.configuration.axe;
      config.securitySearchKeyword = keyword;
      if (keyword.length >= 2) {
        const result = [];
        for (let i = 0; i < this.state.securityMap.length; ++i) {
          const eachEntry = this.state.securityMap[i];
          for (let keywordIndex = 0; keywordIndex < eachEntry.keywords.length; ++keywordIndex) {
            if (this.utilityService.caseInsensitiveKeywordMatch(eachEntry.keywords[keywordIndex], keyword)) {
              result.push(this.state.securityMap[i]);
              break;
            }
          }
        }
        config.matchedResultCount = result.length;
        config.searchIsValid = true;
        if ( config.matchedResultCount > 0 && config.matchedResultCount < ALERT_MAX_SECURITY_SEARCH_COUNT ) {
          config.searchIsValid = true;
          this.fetchSecurities(result);
        } else {
          config.searchIsValid = false;
        }
      } else {
        config.searchIsValid = false;
        config.matchedResultCount = 0;
        config.searchList = [];
      }
    }

    public onSelectAxeWatchlistSide(targetScope: AxeAlertScope, targetBlock: TradeAlertConfigurationAxeGroupBlock) {
      if (!!targetScope && !!targetBlock && !targetBlock.isDisabled) {
        this.addScopeToAxeWatchlistEntry(targetBlock, targetScope);
        this.restfulCommService.logEngagement(
          this.restfulCommService.engagementMap.tradeAlertConfigure,
          null,
          `Change Scope to ${targetBlock.scopes.toString()}`,
          'Trade Alert Panel'
        );
      }
    }

    public onSelectAxeWatchlistSideType(targetType: AxeAlertType, targetBlock: TradeAlertConfigurationAxeGroupBlock) {
      const currTypes: AxeAlertType[] = targetBlock.axeAlertTypes.slice();
      if (!!targetType && !!targetBlock && !targetBlock.isDisabled) {
        if (targetBlock.axeAlertTypes.indexOf(targetType) === -1) {
          targetBlock.axeAlertTypes = [targetType, ...currTypes];
        } else {
          targetBlock.axeAlertTypes = currTypes.filter((a: AxeAlertType) => a !== targetType);
        }
        this.restfulCommService.logEngagement(
          this.restfulCommService.engagementMap.tradeAlertConfigure,
          null,
          `Change AlertType to ${targetBlock.axeAlertTypes.toString()}`,
          'Trade Alert Panel'
        );
      }
    }

    public onSelectAxeAlertWatchType(targetType: AxeAlertType, targetBlock: TradeAlertConfigurationAxeGroupBlock) {
      if (!!targetType && !!targetBlock && !targetBlock.isDisabled) {
        if (targetBlock.axeAlertTypes.indexOf(targetType) === -1) {
          targetBlock.axeAlertTypes = [targetType, ...targetBlock.axeAlertTypes];
        } else {
          if (targetBlock.axeAlertTypes.length > 1) {
            targetBlock.axeAlertTypes =
              targetBlock.axeAlertTypes.filter((a: AxeAlertType) => a !== targetType);
          }
        }
        this.restfulCommService.logEngagement(
          this.restfulCommService.engagementMap.tradeAlertConfigure,
          null,
          `Change Alert Type to ${targetBlock.axeAlertTypes.toString()}`,
          'Trade Alert Panel'
        );
      }
    }

    public onClickSaveConfiguration() {
      this.saveAxeConfiguration();
      this.saveConfig.emit();
      this.state.configureAlert = false;
    }

    public onTogglePriority(targetBlock: TradeAlertConfigurationAxeGroupBlock) {
      targetBlock.isUrgent = !targetBlock.isUrgent;
      this.restfulCommService.logEngagement(
        this.restfulCommService.engagementMap.tradeAlertConfigure,
        null,
        'Priority Toggle',
        'Trade Alert Panel'
      );
    }

    public onToggleDisableTargetGroupFromAxeWatchList(targetBlock: TradeAlertConfigurationAxeGroupBlock) {
      targetBlock.isDisabled = !targetBlock.isDisabled;
      this.restfulCommService.logEngagement(
        this.restfulCommService.engagementMap.tradeAlertConfigure,
        null,
        'Toggle Disable',
        'Trade Alert Panel'
      );
    }

    public onClickRemoveSecurityFromAxeWatchList(targetBlock: TradeAlertConfigurationAxeGroupBlock) {
      targetBlock.isDeleted = true;
      this.restfulCommService.logEngagement(
        this.restfulCommService.engagementMap.tradeAlertConfigure,
        null,
        'Remove',
        'Trade Alert Panel'
      );
    }

    public onSelectAxeRangeDriver(targetBlock: TradeAlertConfigurationAxeGroupBlock, targetDriver: string) {
      targetBlock.targetDriver = targetDriver;
    }

    public onChangeAxeRangeMin(newValue, targetBlock: TradeAlertConfigurationAxeGroupBlock) {
      targetBlock.targetRange.data.minNumber = newValue === "" ? newValue : parseFloat(newValue);
      this.checkIsFilled(targetBlock);
    }

    public onChangeAxeRangeMax(newValue, targetBlock: TradeAlertConfigurationAxeGroupBlock) {
      targetBlock.targetRange.data.maxNumber = newValue === "" ? newValue : parseFloat(newValue);
      this.checkIsFilled(targetBlock);
    }

    public onClickedClearRange(targetBlock: TradeAlertConfigurationAxeGroupBlock) {
      targetBlock.targetRange.data = {
        minNumber: "",
        maxNumber: ""
      };
      this.checkIsFilled(targetBlock);
    }

    public onToggleSendEmail(targetBlock: TradeAlertConfigurationAxeGroupBlock) {
      targetBlock.sendEmail = !targetBlock.sendEmail;
    }

    private fetchSecurities(matchList: Array<SecurityMapEntry>) {
      const list = matchList.map((eachEntry) => {
        return eachEntry.secruityId;
      });
      const payload = {
        identifiers: list
      };
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getSecurityDTOs, {req: 'POST'}, payload).pipe(
        first(),
        tap((serverReturn: Array<BESecurityDTO>) => {
          this.state.configuration.axe.searchList = [];
          if (!!serverReturn) {
            serverReturn.forEach((eachRawData) => {
              const eachCard = this.dtoService.formSecurityCardObject(eachRawData.securityIdentifier, eachRawData, false, false);
              eachCard.state.isActionMenuPrimaryActionsDisabled = true;
              eachCard.state.isActionMenuMinorActionsDisabled = true;
              eachCard.state.isWidthFlexible = true;
              eachCard.api.onClickCard = this.onClickSearchResult.bind(this);
              const existInWatchlist = this.state.configuration.axe.securityList.find((eachEntry) => {
                return eachEntry.card.data.securityID === eachCard.data.securityID;
              })
              if (!!existInWatchlist) {
                eachCard.state.isSelected = true;
              }
              this.state.configuration.axe.searchList.push(eachCard);
            });
          } else {
            this.restfulCommService.logError(`'security/get-securities' API returned an empty result with this payload: ${list.toString()}`);
          }
        })
      ).subscribe();
    }

    private onClickSearchResult(targetSecurity:SecurityDTO) {
      const config = this.state.configuration.axe;
      const existMatchIndex = config.securityList.findIndex((eachEntry) => {
        return eachEntry.card.data.securityID === targetSecurity.data.securityID;
      });
      if (existMatchIndex >= 0) {
        const targetEntry: TradeAlertConfigurationAxeGroupBlock = config.securityList[existMatchIndex];
        if (config.securityList[existMatchIndex].isDeleted) {
          targetEntry.isDeleted = false;
          targetEntry.isDisabled = false;
          targetEntry.scopes = [this.constants.axeAlertScope.ask, this.constants.axeAlertScope.bid];
        } else {
          if (targetEntry.groupId) {
            // means the card exist in BE
            targetEntry.isDeleted = true;
          } else 
            // means the card was just added on FE
            config.securityList.splice(existMatchIndex, 1);
          }
      } else {
        this.addSecurityToWatchList(targetSecurity);
      }
    }

    private addSecurityToWatchList(targetSecurity: SecurityDTO) {
      const copy:SecurityDTO = this.utilityService.deepCopy(targetSecurity);
      copy.state.isSelected = false;
      copy.state.isInteractionDisabled = true;
      copy.state.isMultiLineVariant = false;
      copy.state.isWidthFlexible = true;
      const newEntry: TradeAlertConfigurationAxeGroupBlock = {
        card: copy,
        groupId: null,
        axeAlertTypes: [this.constants.axeAlertType.normal, this.constants.axeAlertType.marketList],
        scopes: copy.data.alert.shortcutConfig.side.length > 0 ? copy.data.alert.shortcutConfig.side.map((eachSide) => {return eachSide as AxeAlertScope}) : [this.constants.axeAlertScope.ask, this.constants.axeAlertScope.bid],
        targetDriver: copy.data.alert.shortcutConfig.driver || null,
        targetRange: copy.data.alert.shortcutConfig.numericFilterDTO,
        isDeleted: false,
        isDisabled: false,
        isUrgent: !!copy.data.alert.shortcutConfig.isUrgent,
        sendEmail: !!copy.data.alert.shortcutConfig.sendEmail
      };
      this.state.configuration.axe.securityList.unshift(newEntry);
      this.restfulCommService.logEngagement(
        this.restfulCommService.engagementMap.tradeAlertAddSingleSecurity,
        copy.data.securityID,
        null,
        'Trade Alert Panel'
      );
    }

    private loadAllConfigurations() {
      const config = this.state.configuration.axe;
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getAlertConfigurations, {req: 'POST'}, {}).pipe(
        first(),
        tap((serverReturn: BEAlertConfigurationReturn) => {
          if (!!serverReturn) {
            this.state.configuration.axe.securityList = [];
            this.state.isAlertPaused = false;
            for (const eachGroupId in serverReturn.Axe) {
              const eachConfiguration = serverReturn.Axe[eachGroupId];
              this.populateConfigurationFromEachGroup(eachConfiguration);
            }
          } else {
            this.restfulCommService.logError(`'Alert/get-alert-configs' API returned an empty result`);
          }
        }),
        catchError(err => {
          console.error(`${this.restfulCommService.apiMap.getAlertConfigurations} failed`, err);
          return of('error')
        })
      ).subscribe();
    }

    private populateConfigurationFromEachGroup(
      rawGroupConfig: BEAlertConfigurationDTO
    ) {
      if (!!rawGroupConfig && !!rawGroupConfig.groupFilters) {
        if (rawGroupConfig.groupFilters.SecurityIdentifier && rawGroupConfig.groupFilters.SecurityIdentifier.length > 0) {
          this.populateConfigurationFromSecurityGroup(rawGroupConfig);
        }
      }
    }

    private populateConfigurationFromSecurityGroup(rawGroupConfig: BEAlertConfigurationDTO) {
      const { WatchType } = rawGroupConfig.parameters;
      const targetScope = rawGroupConfig.subType as AxeAlertScope;
      const payload: PayloadGetSecurities = {
        identifiers: rawGroupConfig.groupFilters.SecurityIdentifier
      };
      const newEntry: TradeAlertConfigurationAxeGroupBlock = {
        card: null,
        groupId: rawGroupConfig.alertConfigID,
        axeAlertTypes: WatchType === AxeAlertType.both ? [AxeAlertType.normal, AxeAlertType.marketList] : [WatchType],
        scopes: targetScope === this.constants.axeAlertScope.both || targetScope === this.constants.axeAlertScope.liquidation ? [this.constants.axeAlertScope.ask, this.constants.axeAlertScope.bid] : [targetScope],  // from now on we will remove "liquidation" as a side option, just to be backward-compatible, in code we treat liquidation the same as "both"
        targetDriver: this.populateWatchDriverFromRawConfig(rawGroupConfig),
        targetRange: this.populateRangeNumberFilterFromRawConfig(rawGroupConfig),
        isDeleted: false,
        isDisabled: !rawGroupConfig.isEnabled,
        isUrgent: rawGroupConfig.isUrgent,
        sendEmail: !!rawGroupConfig.sendEmail
      };
      this.checkIsFilled(newEntry);
      this.state.configuration.axe.securityList.unshift(newEntry);
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getSecurityDTOs, {req: 'POST'}, payload).pipe(
        first(),
        tap((serverReturn: Array<BESecurityDTO>) => {
          if (!!serverReturn) {
            serverReturn.forEach((eachRawData) => {
              const eachCard = this.dtoService.formSecurityCardObject(eachRawData.securityIdentifier, eachRawData, false, false);
              eachCard.state.isInteractionDisabled = true;
              eachCard.state.isWidthFlexible = true;
              newEntry.card = eachCard;
            });
          } else {
            this.restfulCommService.logError(`'security/get-securities' API returned an empty result with this payload: ${payload.identifiers.toString()}`);
          }
        })
      ).subscribe();
    }

    private addScopeToAxeWatchlistEntry(targetEntry: TradeAlertConfigurationAxeGroupBlock, targetScope: AxeAlertScope) {
      if (targetScope === this.constants.axeAlertScope.liquidation) {
        if (targetEntry.scopes.indexOf(targetScope) >= 0) {
          targetEntry.scopes = [];
        } else {
          targetEntry.scopes = [targetScope];
        }
      } else if ((targetScope === this.constants.axeAlertScope.bid || this.constants.axeAlertScope.ask) && targetEntry.scopes.indexOf(this.constants.axeAlertScope.liquidation) >= 0){
        targetEntry.scopes.splice(targetEntry.scopes.indexOf(this.constants.axeAlertScope.liquidation), 1);
        targetEntry.scopes.push(targetScope);
      } else {
        if (targetEntry.scopes.indexOf(targetScope) >= 0) {
          targetEntry.scopes.splice(targetEntry.scopes.indexOf(targetScope), 1);
        } else {
          targetEntry.scopes.push(targetScope);
        }
      }
    }

    private saveAxeConfiguration() {
      if (this.state.isUserPM) {
        const entirePayload: PayloadUpdateAlertConfig = {
          alertConfigs: []
        };
        this.state.configuration.axe.securityList.forEach((eachEntry) => {
          const payload: PayloadUpdateSingleAlertConfig = {
            type: this.constants.alertTypes.axeAlert,
            subType: this.mapAxeScopesToAlertSubtypes(eachEntry.scopes),
            groupFilters: {},
            parameters: {
              WatchType: this.mapWatchTypesToWatchType(eachEntry.axeAlertTypes)
            },
            isUrgent: eachEntry.isUrgent,
            sendEmail: eachEntry.sendEmail
          };
          this.appendRangeToAxeConfigPayloads(payload, eachEntry);
          payload.groupFilters.SecurityIdentifier = [eachEntry.card.data.securityID];
          if (!!eachEntry.groupId) {
            payload.alertConfigID = eachEntry.groupId;
          }
          if (eachEntry.isDisabled) {
            payload.isEnabled = false;
          }
          if (eachEntry.isDeleted) {
            payload.isDeleted = true;
          }
          entirePayload.alertConfigs.push(payload);
        });
        this.restfulCommService.callAPI(this.restfulCommService.apiMap.updateAlertConfiguration, {req: 'POST'}, entirePayload).pipe(
          first(),
          tap(() => {
            // this is necessary because after the save, the newly added config from shortcut would need to receive its groupId popualted from BE, otherwise FE would not be able to distinguish the newly-created and already-saved-to-be alerts from the ones that user can add manually from the keyWord search
            this.loadAllConfigurations();
          }),
          catchError(err => {
            console.error(`${this.restfulCommService.apiMap.updateAlertConfiguration} failed`, entirePayload);
            this.restfulCommService.logError(`${this.restfulCommService.apiMap.updateAlertConfiguration} failed`);
            return of('error');
          })
        ).subscribe();
      }
    }

    private mapAxeScopesToAlertSubtypes(targetScopes: Array<string>): AlertSubTypes {
      if (targetScopes.includes(this.constants.axeAlertScope.ask) && targetScopes.includes(this.constants.axeAlertScope.bid)) {
        return this.constants.alertSubTypes.both;
      } else if (targetScopes.includes(this.constants.axeAlertScope.ask)) {
        return this.constants.alertSubTypes.ask;
      } else if (targetScopes.includes(this.constants.axeAlertScope.bid)) {
        return this.constants.alertSubTypes.bid;
      } else if (targetScopes.includes(this.constants.axeAlertScope.liquidation)) {
        return this.constants.alertSubTypes.liquidation;
      } else {
        return this.constants.alertSubTypes.bid;
      }
    }

    private mapWatchTypesToWatchType(alertTypes: AxeAlertType[]): AxeAlertType {
      if (alertTypes.includes(AxeAlertType.normal) && alertTypes.includes(AxeAlertType.marketList)) {
        return AxeAlertType.both;
      } else if (alertTypes.includes(AxeAlertType.normal)) {
        return AxeAlertType.normal;
      } else if (alertTypes.includes(AxeAlertType.marketList)) {
        return AxeAlertType.marketList;
      } else {
        return AxeAlertType.both;
      }
    }

    private checkIsFilled(targetBlock: TradeAlertConfigurationAxeGroupBlock) {
      if (!!targetBlock.targetRange.data.minNumber || !!targetBlock.targetRange.data.maxNumber) {
        targetBlock.targetRange.state.isFilled = true;
      } else {
        targetBlock.targetRange.state.isFilled = false;
      }
    }

    private populateWatchDriverFromRawConfig(rawGroupConfig: BEAlertConfigurationDTO): string {
      if (rawGroupConfig.parameters.UpperSpreadThreshold || rawGroupConfig.parameters.LowerSpreadThreshold) {
        return this.constants.driver.Spread.label;
      } else if (rawGroupConfig.parameters.UpperPriceThreshold || rawGroupConfig.parameters.LowerPriceThreshold) {
        return this.constants.driver.Price.label;
      } else {
        return null;
      }
    }

    private populateRangeNumberFilterFromRawConfig(rawGroupConfig: BEAlertConfigurationDTO): NumericFilterDTO {
      const dto = this.dtoService.formNumericFilterObject();
      if (rawGroupConfig.parameters.UpperSpreadThreshold || rawGroupConfig.parameters.LowerSpreadThreshold) {
        dto.data.minNumber = rawGroupConfig.parameters.LowerSpreadThreshold;
        dto.data.maxNumber = rawGroupConfig.parameters.UpperSpreadThreshold;
      } else if (rawGroupConfig.parameters.UpperPriceThreshold || rawGroupConfig.parameters.LowerPriceThreshold) {
        dto.data.minNumber = rawGroupConfig.parameters.LowerPriceThreshold;
        dto.data.maxNumber = rawGroupConfig.parameters.UpperPriceThreshold;
      }
      return dto;
    }

    private appendRangeToAxeConfigPayloads(
      payload: PayloadUpdateSingleAlertConfig,
      targetBlock: TradeAlertConfigurationAxeGroupBlock
    ) {
      if (targetBlock && targetBlock.targetDriver && targetBlock.targetRange && targetBlock.targetRange.data) {
        if (targetBlock.targetDriver === this.constants.driver.Spread.label) {
          if (targetBlock.targetRange.data.maxNumber) {
            payload.parameters.UpperSpreadThreshold = parseFloat(targetBlock.targetRange.data.maxNumber as string);
          }
          if (targetBlock.targetRange.data.minNumber) {
            payload.parameters.LowerSpreadThreshold = parseFloat(targetBlock.targetRange.data.minNumber as string);
          }
        } else if (targetBlock.targetDriver === this.constants.driver.Price.label) {
          if (targetBlock.targetRange.data.maxNumber) {
            payload.parameters.UpperPriceThreshold = parseFloat(targetBlock.targetRange.data.maxNumber as string);
          }
          if (targetBlock.targetRange.data.minNumber) {
            payload.parameters.LowerPriceThreshold = parseFloat(targetBlock.targetRange.data.minNumber as string);
          }
        }
      }
    }
  // configuration section end

  // table section
    public onTableSearchKeywordChange(newKeyword: string) {
      this.keywordChanged$.next(newKeyword);
    }

    public onSelectSecurityForAnalysis(targetSecurity: SecurityDTO) {
      this.store$.dispatch(new TradeSelectedSecurityForAnalysisEvent(this.utilityService.deepCopy(targetSecurity)));
      this.restfulCommService.logEngagement(
        EngagementActionList.selectSecurityForAnalysis,
        targetSecurity.data.securityID,
        'n/a',
        'Trade - Alert Panel'
      );
    }

    public onClickedSecurityCardSearch(targetSecurity: SecurityDTO) {
      if (targetSecurity && targetSecurity.data) {
        this.store$.dispatch(new TradeKeywordSearchThisSecurityEvent(targetSecurity.data.name));
      }
    }

    private filterPrinstineRowList(
      targetPrinstineList: Array<SecurityTableRowDTO>
    ): Array<SecurityTableRowDTO> {
      const filteredList: Array<SecurityTableRowDTO> = [];
      targetPrinstineList.forEach((eachRow) => {
        try {
          if (!!eachRow && !!eachRow.data.security && !eachRow.data.security.state.isStencil) {
            if (
              this.utilityService.caseInsensitiveKeywordMatch(eachRow.data.security.data.name, this.state.filters.quickFilters.keyword)
              || this.utilityService.caseInsensitiveKeywordMatch(eachRow.data.security.data.obligorName, this.state.filters.quickFilters.keyword)
              || this.utilityService.caseInsensitiveKeywordMatch(eachRow.data.security.data.alert.alertMessage, this.state.filters.quickFilters.keyword)) {
              if (!this.state.alert.scopedAlertType || eachRow.data.alert.data.type == this.state.alert.scopedAlertType) {
                if (this.state.alert.scopedAlertType === this.constants.alertTypes.axeAlert) {
                  // the axe tab only have non-marketList alerts, the inquiry tab only have marketList alerts
                  if (this.state.alert.scopedForMarketListOnly && eachRow.data.alert.state.isMarketListVariant) {
                    filteredList.push(eachRow);
                  } else if (!this.state.alert.scopedForMarketListOnly && !eachRow.data.alert.state.isMarketListVariant) {
                    filteredList.push(eachRow);
                  }
                } else {
                  filteredList.push(eachRow);
                }
              }
            }
          }
        } catch(err) {
          console.error('filter issue', err ? err.message : '', eachRow);
        }
      });
      return filteredList;
    }

    private calculateQuantComparerWidthAndHeight() {
      const bestSpreadList = [];
      const bestPriceList = [];
      const bestYieldList = [];
      const combinedRowList = this.state.fetchResult.alertTable.prinstineRowList;
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

    private loadFreshData(newAlertList: Array<AlertDTO>) {
      this.state.alert.nonMarketListAxeAlertCount = 0;
      this.state.alert.marketListAxeAlertCount = 0;
      this.state.alert.markAlertCount = 0;
      this.state.alert.tradeAlertCount = 0;
      this.alertCountIncrement(newAlertList);
      newAlertList.forEach((eachAlert) => {
        this.state.alert.alertTableAlertList[eachAlert.data.id] = eachAlert;
      });
      // this.loadInitialStencilTable();
      this.updateStage(0, this.state.fetchResult.alertTable, this.state.table.alertDto);
      this.fetchDataForAlertTable(true);
    }

    private loadInitialStencilTable() {
      const stencilAlertTableHeaderBuffer: Array<SecurityTableHeaderDTO> = [];
      this.state.table.alertMetrics.forEach((eachStub) => {
        const targetSpecifics = eachStub.content.tableSpecifics.tradeAlert || eachStub.content.tableSpecifics.default;
        if (eachStub.content.isForSecurityCard || targetSpecifics.active) {
          stencilAlertTableHeaderBuffer.push(this.dtoService.formSecurityTableHeaderObject(eachStub, 'tradeAlert', []));
        }
      });
      for (let i = 0; i < 10; ++i) {
        const stencilSecurity = this.dtoService.formSecurityCardObject(null, null, true, false);
        stencilSecurity.state.isInteractionDisabled = true;
        const newAlertTableRow = this.dtoService.formSecurityTableRowObject(stencilSecurity, null, true);
        stencilAlertTableHeaderBuffer.forEach((eachHeader) => {
          if (!eachHeader.state.isSecurityCardVariant) {
            if (eachHeader.state.isQuantVariant) {
              const bestQuoteStencil = this.dtoService.formQuantComparerObject(true, this.state.filters.quickFilters.driverType, null, null, false);
              newAlertTableRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, eachHeader, bestQuoteStencil, null));
            } else {
              newAlertTableRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, eachHeader, null, null));
            }
          }
        });
        this.state.fetchResult.alertTable.prinstineRowList.push(this.utilityService.deepCopy(newAlertTableRow));
      };
      this.state.fetchResult.alertTable.rowList = this.utilityService.deepCopy(this.state.fetchResult.alertTable.prinstineRowList);
    }

    private fetchUpdate(newAlertList: Array<AlertDTO>) {
      if (this.state.alert.initialAlertListReceived) {
        if (newAlertList.length > 0) {
          this.alertCountIncrement(newAlertList);
          newAlertList.forEach((eachAlert) => {
            this.state.alert.alertTableAlertList[eachAlert.data.id] = eachAlert;
          });
        }
        if (this.state.fetchResult.alertTable.fetchComplete) {
          this.fetchDataForAlertTable(false);
        }
      }
    }

    private fetchDataForAlertTable(isInitialFetch: boolean) {
      const securityList = [];
      for (const eachAlertId in this.state.alert.alertTableAlertList) {
        const eachAlert = this.state.alert.alertTableAlertList[eachAlertId];
        if (!!eachAlert.data.security) {
          const targetSecurityId = eachAlert.data.security.data.securityID;
          if (!securityList.includes(targetSecurityId)) {
            securityList.push(targetSecurityId);
          }
        }
      }
      const payload: PayloadGetTradeFullData = {
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
            this.state.displayAlertTable && this.store$.dispatch(new TradeLiveUpdatePassRawDataToAlertTableEvent());
          } else {
            this.updateStage(0, this.state.fetchResult.alertTable, this.state.table.alertDto);
          }
          this.loadDataForAlertTable(serverReturn);
        }),
        catchError(err => {
          this.restfulCommService.logError(`Get alert table failed`);
          this.store$.dispatch(new TradeLiveUpdatePassRawDataToAlertTableEvent());
          this.store$.dispatch(new TradeLiveUpdateProcessDataCompleteInAlertTableEvent());
          console.error('error', err);
          this.state.fetchResult.fetchTableDataFailed = true;
          this.state.fetchResult.fetchTableDataFailedError = err.message;
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
        null,
        this.onClickedSecurityCardSearch.bind(this)
      );
      this.calculateQuantComparerWidthAndHeight();
      this.state.fetchResult.alertTable.fetchComplete = true;
      this.updateStage(this.constants.securityTableFinalStage, this.state.fetchResult.alertTable, this.state.table.alertDto);
      if (!this.state.alert.initialAlertListReceived) {
        this.state.alert.initialAlertListReceived = true;
      }
    }

    private updateStage(
      stageNumber: number,
      targetTableBlock: TableFetchResultBlock,
      targetTableDTO: SecurityTableDTO
    ) {
      targetTableBlock.currentContentStage = stageNumber;
      if (targetTableBlock.currentContentStage === this.constants.securityTableFinalStage) {
        this.store$.pipe(
          select(selectInitialDataLoadedInAlertTable),
          withLatestFrom(
            this.store$.pipe(select(selectLiveUpdateProcessingRawDataInAlertTable))
          ),
          first(),
          tap(([isInitialDataLoaded, processingRawData]) => {
            if (isInitialDataLoaded) {
              targetTableBlock.liveUpdatedRowList = this.identifyTableUpdate(targetTableBlock, false);
              this.state.alert.recentUpdatedAlertList = [];
            } else {
              targetTableBlock.rowList = this.filterPrinstineRowList(targetTableBlock.prinstineRowList);
            }
            if (!!this.state.fetchResult.alertTable.fetchComplete) {
              this.store$.dispatch(new TradeLiveUpdateProcessDataCompleteInAlertTableEvent());
            }
          })
        ).subscribe();
      }
    }

    private alertCountIncrement(alertList: Array<AlertDTO>) {
      alertList.forEach((eachAlert) => {
        if (!this.state.alert.alertTableAlertList[eachAlert.data.id]) {
          switch (eachAlert.data.type) {
            case this.constants.alertTypes.axeAlert:
              if (eachAlert.state.isMarketListVariant) {
                this.state.alert.marketListAxeAlertCount++;
              } else {
                this.state.alert.nonMarketListAxeAlertCount++;
              }
              break;
            case this.constants.alertTypes.markAlert:
              this.state.alert.markAlertCount++;
              break;
            case this.constants.alertTypes.tradeAlert:
              this.state.alert.tradeAlertCount++;
              break;
            default:
              break;
          }
        }
      });
    }

    private alertCountDecrement(removalList: Array<AlertDTO>) {
      removalList.forEach((eachAlert) => {
        if (!this.state.alert.alertTableAlertList[eachAlert.data.id]) {
          switch (eachAlert.data.type) {
            case this.constants.alertTypes.axeAlert:
              if (eachAlert.state.isMarketListVariant) {
                this.state.alert.marketListAxeAlertCount--;
              } else {
                this.state.alert.nonMarketListAxeAlertCount--;
              }
              break;
            case this.constants.alertTypes.markAlert:
              this.state.alert.markAlertCount--;
              break;
            case this.constants.alertTypes.tradeAlert:
              this.state.alert.tradeAlertCount--;
              break;
            default:
              break;
          }
        }
      });
    }

    private identifyTableUpdate(
      targetTableBlock: TableFetchResultBlock,
      countdownUpdateOnly: boolean
    ): Array<SecurityTableRowDTO> {
      if (countdownUpdateOnly) {
        const updateList:Array<SecurityTableRowDTO> = [];
        targetTableBlock.rowList.forEach((eachRow) => {
          if (this.state.alert.recentUpdatedAlertList.indexOf(eachRow.data.rowId) >= 0) {
            updateList.push(eachRow);
          }
        });
        return updateList;
      } else {
        const newFilteredList = this.filterPrinstineRowList(targetTableBlock.prinstineRowList);
        return this.processingService.returnDiff(
          this.state.table.alertDto,
          newFilteredList,
          this.state.alert.recentUpdatedAlertList
        ).newRowList;
      }
    }

    private populateTableRowRemovalList(alertList: Array<AlertDTO>) {
      // find the corresponding row basd on the alert, since the rowIds are the alertIds in alert table
      this.state.fetchResult.alertTable.removalRowList = [];
      alertList.forEach((eachAlert) => {
        const targetRow = this.state.fetchResult.alertTable.prinstineRowList.find((eachRow) => {
          return eachRow.data.rowId === eachAlert.data.id;
        });
        if (!!targetRow) {
          !this.state.fetchResult.alertTable.removalRowList.includes(targetRow.data.rowId) && this.state.fetchResult.alertTable.removalRowList.push(targetRow.data.rowId);
          if (!!this.state.alert.alertTableAlertList[eachAlert.data.id]) {
            delete this.state.alert.alertTableAlertList[eachAlert.data.id];
          }
          const targetIndex = this.state.fetchResult.alertTable.prinstineRowList.findIndex((eachRow) => {
            return eachRow.data.rowId === eachAlert.data.id;
          });
          this.state.fetchResult.alertTable.prinstineRowList.splice(targetIndex, 1);
          this.state.fetchResult.alertTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.alertTable.prinstineRowList);
        }
      });
      this.alertCountDecrement(alertList);
    }
  // table section end

  // public onClickSendMail() {
    //   this.restfulCommService.logEngagement(
    //     EngagementActionList.sendEmail,
    //     'n/a',
    //     'n/a',
    //     this.ownerInitial,
    //     'Trade - Alert Panel'
    //   );
    //   location.href = "mailto:santa@rpia.ca?subject=Santa%20Feedback";
  // }

}
