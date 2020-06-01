  // dependencies
    import {
      Component,
      EventEmitter,
      Input,
      isDevMode,
      OnChanges,
      OnDestroy,
      OnInit,
      Output,
      ViewEncapsulation
    } from '@angular/core';
    import {select, Store} from '@ngrx/store';
    import {interval, Observable, of, Subscription} from 'rxjs';
    import {catchError, first, tap, withLatestFrom} from 'rxjs/operators';
    import * as moment from 'moment';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { LiveDataProcessingService } from 'Trade/services/LiveDataProcessingService';
    import { TradeAlertPanelState } from 'FEModels/frontend-page-states.interface';
    import { SecurityMapEntry, ClickedOpenSecurityInBloombergEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';
    import {
      SecurityTableHeaderDTO,
      AlertCountSummaryDTO,
      SecurityTableDTO,
      SecurityDTO,
      AlertDTO,
      SecurityTableRowDTO
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
    // import {
    //   EngagementActionList,
    //   AlertTypes,
    //   AlertSubTypes
    // } from 'Core/constants/coreConstants.constant';
    import {
      selectAlertCounts,
      selectSecurityMapContent,
      selectSecurityMapValidStatus
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
      TradeLiveUpdateProcessDataCompleteInAlertTableEvent
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
      SecurityTableMetrics,
      SECURITY_TABLE_FINAL_STAGE
    } from 'Core/constants/securityTableConstants.constant';
    import {
      DEFAULT_DRIVER_IDENTIFIER,
      EngagementActionList,
      AlertSubTypes,
      AlertTypes
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
  @Input() ownerInitial: string;
  @Input() sidePanelsDisplayed: boolean;
  @Input() collapseConfiguration: boolean;
  @Output() configureAlert = new EventEmitter();
  @Output() saveConfig = new EventEmitter();
  @Output() showAlertTable = new EventEmitter();
  @Output() collapseAlertTable = new EventEmitter();
  state: TradeAlertPanelState;
  subscriptions = {
    securityMapSub: null,
    autoUpdateCountSub: null,
    // selectedSecurityForAlertConfigSub: null,
    centerPanelPresetSelectedSub: null,
    alertCountSub: null,
    startNewUpdateSub: null
  }
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
    securityTableFinalStage: SECURITY_TABLE_FINAL_STAGE
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
      const alertTableMetrics = SecurityTableMetrics.filter((eachStub) => {
        const targetSpecifics = eachStub.tableSpecifics.tradeAlert || eachStub.tableSpecifics.default;
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
          selectedAlert: null,
          axe: {
            myGroup: {
              card: null,
              groupId: null,
              scopes: [],
              axeAlertTypes: [],
              isDeleted: false,
              isDisabled: false,
              isUrgent: false
            },
            securitySearchKeyword: '',
            securityList: [],
            searchList: [],
            matchedResultCount: 0,
            searchIsValid: false
          },
          mark: {
            myGroup: {
              disabled: false,
              groupId: null,
              makeMoneySpread: null,
              makeMoneyPrice: null,
              loseMoneySpread: null,
              loseMoneyPrice: null
            }
          }
        },
        autoUpdateCountdown: 4,
        alertUpdateInProgress: false,
        isCenterPanelPresetSelected: false,
        receivedActiveAlertsMap: {},
        displayAlertTable: false,
        table: {
          alertMetrics: alertTableMetrics,
          alertDto: this.dtoService.formSecurityTableObject(true, false, true)
        },
        fetchResult: {
          fetchTableDataFailed: false,
          fetchTableDataFailedError: '',
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
            keyword: '',
            driverType: this.constants.defaultMetricIdentifier,
            portfolios: [],
          }
        },
        alert: {
          alertTableAlertList: {},
          initialAlertListReceived: false,
          axeAlertCount: 0,
          unreadAxeAlertCount: 0,
          markAlertCount: 0,
          unreadMarkAlertCount: 0,
          tradeAlertCount: 0,
          unreadTradeAlertCount: 0,
          scopedAlertType: null
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
        }
      });
      // this.subscriptions.selectedSecurityForAlertConfigSub = this.store$.pipe(
        //   select(selectSelectedSecurityForAlertConfig)
        // ).subscribe((targetSecurity) => {
        //   if (!!targetSecurity) {
        //     if (!this.state.configureAlert) {
        //       this.onClickConfigureAlert();
        //       this.state.configuration.selectedAlert = this.constants.alertTypes.axeAlert;
        //     }
        //     const existMatchIndex = this.state.configuration.axe.securityList.findIndex((eachEntry) => {
        //       return eachEntry.card.data.securityID === targetSecurity.data.securityID;
        //     });
        //     if (existMatchIndex < 0) {
        //       this.addSecurityToWatchList(targetSecurity);
        //     } else if (this.state.configuration.axe.securityList[existMatchIndex].isDeleted) {
        //       this.state.configuration.axe.securityList[existMatchIndex].isDeleted = false;
        //       this.state.configuration.axe.securityList[existMatchIndex].isDisabled = false;
        //     }
        //   }
      // });
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
    }

    public ngOnChanges() {
      if (!!this.collapseConfiguration) {
        this.state.configureAlert = false;
      }
      if (!!this.ownerInitial) {
        this.state.isUserPM = this.constants.fullOwnerList.indexOf(this.ownerInitial) >= 0;
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
          if (!!serverReturn) {
            const filteredServerReturn = serverReturn.filter((eachRawAlert) => {
              // no filtering logic for now
              return true;
            });
            const updateList: Array<AlertDTO> = [];
            const alertTableList: Array<AlertDTO> = [];
            filteredServerReturn.forEach((eachRawAlert) => {
              // Trade alerts are handled differently since BE passes the same trade alerts regardless of the timestamp FE provides
              if (!!eachRawAlert.marketListAlert) {
                if (this.state.receivedActiveAlertsMap[eachRawAlert.alertId]) {
                  // ignore, already have it
                } else if (!eachRawAlert.isActive) {
                  // ignore, already expired
                  const newAlert = this.dtoService.formAlertObject(eachRawAlert);
                  if (newAlert.data.security && newAlert.data.security.data.securityID) {
                    alertTableList.push(newAlert);
                  }
                } else {
                  this.state.receivedActiveAlertsMap[eachRawAlert.alertId] = eachRawAlert.keyWord;
                  const newAlert = this.dtoService.formAlertObject(eachRawAlert);
                  updateList.push(newAlert);
                  if (newAlert.data.security && newAlert.data.security.data.securityID) {
                    alertTableList.push(newAlert);
                  }
                }
              } else {
                // checking for cancelled and active alerts
                const newAlert = this.dtoService.formAlertObject(eachRawAlert);
                if (eachRawAlert.isActive) {
                  if (newAlert.data.isUrgent) {
                    updateList.push(newAlert);
                  }
                }
                if (newAlert.data.security && newAlert.data.security.data.securityID) {
                  alertTableList.push(newAlert);
                }
              }
            });
            updateList.length > 0 && this.store$.dispatch(new CoreSendNewAlerts(this.utilityService.deepCopy(updateList)));
            if (alertTableList.length > 0) {
              if (this.state.alert.initialAlertListReceived) {
                this.fetchUpdate(alertTableList);
              } else {
                this.loadFreshData(alertTableList);
              }
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

    public onClickSpecificAlertTypeTab(targetType: AlertTypes) {
      if (this.state.fetchResult.alertTable.fetchComplete) {
        if (this.state.alert.scopedAlertType !== targetType) {
          this.state.displayAlertTable = true;
          this.state.alert.scopedAlertType = targetType;
          this.state.fetchResult.alertTable.rowList = this.filterPrinstineRowList(this.state.fetchResult.alertTable.prinstineRowList);
        } else {
          this.state.displayAlertTable = false;
          this.state.alert.scopedAlertType = null;
        }
        if (this.state.displayAlertTable) {
          // collapse the configuration UI
          this.state.configureAlert = false;
          this.showAlertTable && this.showAlertTable.emit();
        } else {
          this.collapseAlertTable && this.collapseAlertTable.emit();
        }
      }
    }
  // overview section end

  // configuration section
    public selectAlertForConfigure(targetType: AlertTypes) {
      if (this.state.configuration.selectedAlert === targetType) {
        this.state.configuration.selectedAlert = null;
      } else {
        this.state.configuration.selectedAlert = targetType;
      }
    }

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
      this.saveMarkConfiguration();
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

    public onEnterMarkAlertThreshold(isMakeMoney: boolean, isSpread: boolean, value: number) {
      const targetGroup = this.state.configuration.mark.myGroup;
      if (isMakeMoney && isSpread) {
        targetGroup.makeMoneySpread = value;
      } else if (isMakeMoney && !isSpread) {
        targetGroup.makeMoneyPrice = value;
      } else if (!isMakeMoney && isSpread) {
        targetGroup.loseMoneySpread = value;
      } else if (!isMakeMoney && !isSpread) {
        targetGroup.loseMoneyPrice = value;
      }
    }

    public onToggleDisableMarkAlert() {
      this.state.configuration.mark.myGroup.disabled = !this.state.configuration.mark.myGroup.disabled;
    }

    private fetchSecurities(matchList: Array<SecurityMapEntry>) {
      const list = matchList.map((eachEntry) => {
        return eachEntry.secruityId;
      });
      const payload = {
        identifiers: list
      };
      // this.state.configuration.axe.searchList = [];
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getSecurityDTOs, {req: 'POST'}, payload).pipe(
        first(),
        tap((serverReturn: Array<BESecurityDTO>) => {
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
        if (config.securityList[existMatchIndex].isDeleted) {
          config.securityList[existMatchIndex].isDeleted = false;
          config.securityList[existMatchIndex].isDisabled = false;
          config.securityList[existMatchIndex].scopes = [this.constants.axeAlertScope.ask, this.constants.axeAlertScope.bid];
        } else {
          config.securityList.splice(existMatchIndex, 1);
        }
      } else {
        this.addSecurityToWatchList(targetSecurity);
      }
    }

    private addSecurityToWatchList(targetSecurity) {
      const targetScope = this.constants.axeAlertScope.both;
      const copy:SecurityDTO = this.utilityService.deepCopy(targetSecurity);
      copy.state.isSelected = false;
      copy.state.isInteractionDisabled = true;
      copy.state.isMultiLineVariant = false;
      copy.state.isWidthFlexible = true;
      const newEntry: TradeAlertConfigurationAxeGroupBlock = {
        card: copy,
        groupId: null,
        axeAlertTypes: this.state.configuration.axe.myGroup.axeAlertTypes,
        scopes: targetScope === this.constants.axeAlertScope.both ? [this.constants.axeAlertScope.ask, this.constants.axeAlertScope.bid] : [targetScope],
        isDeleted: false,
        isDisabled: false,
        isUrgent: true
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
            this.state.isAlertPaused = false;
            for (const eachGroupId in serverReturn.Axe) {
              const eachConfiguration = serverReturn.Axe[eachGroupId];
              this.populateConfigurationFromEachGroup(eachConfiguration);
            }
            for (const eachGroupId in serverReturn.Mark) {
              const eachConfiguration = serverReturn.Mark[eachGroupId];
              const myGroup = this.state.configuration.mark.myGroup;
              myGroup.groupId = eachGroupId;
              myGroup.disabled = !eachConfiguration.isEnabled;
              myGroup.loseMoneyPrice = eachConfiguration.parameters.LoseMoneyPriceThreshold == undefined ? null : eachConfiguration.parameters.LoseMoneyPriceThreshold;
              myGroup.loseMoneySpread = eachConfiguration.parameters.LoseMoneySpreadThreshold == undefined ? null : eachConfiguration.parameters.LoseMoneySpreadThreshold;
              myGroup.makeMoneyPrice = eachConfiguration.parameters.MakeMoneyPriceThreshold == undefined ? null : eachConfiguration.parameters.MakeMoneyPriceThreshold;
              myGroup.makeMoneySpread = eachConfiguration.parameters.MakeMoneySpreadThreshold == undefined ? null : eachConfiguration.parameters.MakeMoneySpreadThreshold;
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
        } else if (rawGroupConfig.groupFilters.Owner || rawGroupConfig.groupFilters.PrimaryPmName || rawGroupConfig.groupFilters.ResearchName) {
          this.populateConfigurationFromMyGroup(rawGroupConfig);
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
        scopes: targetScope === this.constants.axeAlertScope.both ? [this.constants.axeAlertScope.ask, this.constants.axeAlertScope.bid] : [targetScope],
        isDeleted: false,
        isDisabled: !rawGroupConfig.isEnabled,
        isUrgent: rawGroupConfig.isUrgent
      };
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

    private populateConfigurationFromMyGroup(rawGroupConfig: BEAlertConfigurationDTO) {
      const targetScope = rawGroupConfig.subType as AxeAlertScope;
      const { WatchType } = rawGroupConfig.parameters;
      this.state.configuration.axe.myGroup = {
        card: null,
        groupId: rawGroupConfig.alertConfigID,
        axeAlertTypes: WatchType === AxeAlertType.both ? [AxeAlertType.normal, AxeAlertType.marketList] : [WatchType],
        scopes: targetScope === this.constants.axeAlertScope.both ? [this.constants.axeAlertScope.ask, this.constants.axeAlertScope.bid] : [targetScope],
        isDeleted: false,
        isDisabled: !rawGroupConfig.isEnabled,
        isUrgent: rawGroupConfig.isUrgent
      };
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
        const groupPayload: PayloadUpdateSingleAlertConfig = {
          type: this.constants.alertTypes.axeAlert,
          subType: this.mapAxeScopesToAlertSubtypes(this.state.configuration.axe.myGroup.scopes),
          groupFilters: {},
          parameters: {
            WatchType: this.mapWatchTypesToWatchType(this.state.configuration.axe.myGroup.axeAlertTypes)
          },
          isUrgent: this.state.configuration.axe.myGroup.isUrgent
        };
        if (this.constants.researchList.indexOf(this.ownerInitial) >= 0) {
          groupPayload.groupFilters.ResearchName = [this.ownerInitial];
        } else {
          groupPayload.groupFilters.PrimaryPmName = [this.ownerInitial];
        }
        if (this.state.configuration.axe.myGroup.isDisabled) {
          groupPayload.isEnabled = false;
        }
        if (this.state.configuration.axe.myGroup.groupId) {
          groupPayload.alertConfigID = this.state.configuration.axe.myGroup.groupId;
        }
        entirePayload.alertConfigs.push(groupPayload);
        this.state.configuration.axe.securityList.forEach((eachEntry) => {
          const payload: PayloadUpdateSingleAlertConfig = {
            type: this.constants.alertTypes.axeAlert,
            subType: this.mapAxeScopesToAlertSubtypes(eachEntry.scopes),
            groupFilters: {},
            parameters: {
              WatchType: this.mapWatchTypesToWatchType(eachEntry.axeAlertTypes)
            },
            isUrgent: eachEntry.isUrgent
          };
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
          catchError(err => {
            console.error(`${this.restfulCommService.apiMap.updateAlertConfiguration} failed`, entirePayload);
            this.restfulCommService.logError(`${this.restfulCommService.apiMap.updateAlertConfiguration} failed`);
            return of('error');
          })
        ).subscribe();
      }
    }

    private saveMarkConfiguration() {
      if (this.state.isUserPM && this.markGroupConfigurationIsValid()) {
        const entirePayload: PayloadUpdateAlertConfig = {
          alertConfigs: []
        };
        const payload: PayloadUpdateSingleAlertConfig = {
          type: this.constants.alertTypes.markAlert,
          subType: this.constants.alertSubTypes.liquidation,
          groupFilters: {
          },
          parameters: {}
        };
        const myGroup = this.state.configuration.mark.myGroup;
        if (this.constants.researchList.indexOf(this.ownerInitial) >= 0) {
          payload.groupFilters.ResearchName = [this.ownerInitial];
        } else {
          payload.groupFilters.PrimaryPmName = [this.ownerInitial];
        }
        if (myGroup.disabled) {
          payload.isEnabled = false;
        }
        if (myGroup.groupId) {
          payload.alertConfigID = this.state.configuration.mark.myGroup.groupId;
        }
        if (myGroup.loseMoneySpread != null) {
          payload.parameters.LoseMoneySpreadThreshold = myGroup.loseMoneySpread;
        }
        if (myGroup.loseMoneyPrice != null) {
          payload.parameters.LoseMoneyPriceThreshold = myGroup.loseMoneyPrice;
        }
        if (myGroup.makeMoneySpread != null) {
          payload.parameters.MakeMoneySpreadThreshold = myGroup.makeMoneySpread;
        }
        if (myGroup.makeMoneyPrice != null) {
          payload.parameters.MakeMoneyPriceThreshold = myGroup.makeMoneyPrice;
        }
        entirePayload.alertConfigs.push(payload);
        this.restfulCommService.callAPI(this.restfulCommService.apiMap.updateAlertConfiguration, {req: 'POST'}, entirePayload).pipe(
          first(),
          catchError(err => {
            console.error(`${this.restfulCommService.apiMap.updateAlertConfiguration} failed`, entirePayload);
            this.restfulCommService.logError(`${this.restfulCommService.apiMap.updateAlertConfiguration} failed`);
            return of('error');
          })
        ).subscribe();
      }
    }

    private markGroupConfigurationIsValid(): boolean {
      const targetGroup = this.state.configuration.mark.myGroup;
      targetGroup.loseMoneySpread = isNaN(parseFloat(`${targetGroup.loseMoneySpread}`)) ? null : parseFloat(`${targetGroup.loseMoneySpread}`);
      targetGroup.loseMoneyPrice = isNaN(parseFloat(`${targetGroup.loseMoneyPrice}`)) ? null : parseFloat(`${targetGroup.loseMoneyPrice}`);
      targetGroup.makeMoneySpread = isNaN(parseFloat(`${targetGroup.makeMoneySpread}`)) ? null : parseFloat(`${targetGroup.makeMoneySpread}`);
      targetGroup.makeMoneyPrice = isNaN(parseFloat(`${targetGroup.makeMoneyPrice}`)) ? null : parseFloat(`${targetGroup.makeMoneyPrice}`);
      if (targetGroup.loseMoneySpread != null || targetGroup.loseMoneyPrice != null || targetGroup.makeMoneySpread != null || targetGroup.makeMoneyPrice != null) {
        return true
      } else {
        return false;
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
  // configuration section end

  // table section
    public onTableSearchKeywordChange(newKeyword: string) {
      const targetTable = this.state.fetchResult.alertTable;
      if (!!newKeyword && newKeyword.length >= 2 && newKeyword != this.state.filters.quickFilters.keyword) {
        this.state.filters.quickFilters.keyword = newKeyword;
        targetTable.rowList = this.filterPrinstineRowList(targetTable.prinstineRowList);
      } else if ((!newKeyword || newKeyword.length < 2) && !!this.state.filters.quickFilters.keyword && this.state.filters.quickFilters.keyword.length >= 2) {
        this.state.filters.quickFilters.keyword = newKeyword;
        targetTable.rowList = this.filterPrinstineRowList(targetTable.prinstineRowList);
      }
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

    public onClickOpenSecurityInBloomberg(pack: ClickedOpenSecurityInBloombergEmitterParams) {
      const url = `bbg://securities/${pack.targetSecurity.data.globalIdentifier}%20${pack.yellowCard}/${pack.targetBBGModule}`;
      window.open(url);
      this.restfulCommService.logEngagement(
        EngagementActionList.bloombergRedict,
        pack.targetSecurity.data.securityID,
        `BBG - ${pack.targetBBGModule}`,
        'Trade - Alert Panel'
      );
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
                filteredList.push(eachRow);
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
      newAlertList.forEach((eachAlert) => {
        this.state.alert.alertTableAlertList[eachAlert.data.id] = eachAlert;
      });
      // this.loadInitialStencilTable();
      this.updateStage(0, this.state.fetchResult.alertTable, this.state.table.alertDto);
      this.fetchDataForAlertTable(true);
      this.state.alert.axeAlertCount = 0;
      this.state.alert.markAlertCount = 0;
      this.state.alert.tradeAlertCount = 0;
      this.countAlerts(newAlertList);
    }

    private loadInitialStencilTable() {
      const stencilAlertTableHeaderBuffer: Array<SecurityTableHeaderDTO> = [];
      this.state.table.alertMetrics.forEach((eachStub) => {
        const targetSpecifics = eachStub.tableSpecifics.tradeAlert || eachStub.tableSpecifics.default;
        if (eachStub.isForSecurityCard || targetSpecifics.active) {
          stencilAlertTableHeaderBuffer.push(this.dtoService.formSecurityTableHeaderObject(eachStub, 'tradeAlert', []));
        }
      });
      for (let i = 0; i < 10; ++i) {
        const stencilSecurity = this.dtoService.formSecurityCardObject(null, null, true, false);
        stencilSecurity.state.isInteractionDisabled = true;
        const newAlertTableRow = this.dtoService.formSecurityTableRowObject(stencilSecurity, null);
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
      this.state.fetchResult.alertTable.rowList = this.utilityService.deepCopy(this.state.fetchResult.alertTable.prinstineRowList);
    }

    private fetchUpdate(newAlertList: Array<AlertDTO>) {
      if (this.state.alert.initialAlertListReceived) {
        if (newAlertList.length > 0) {
          newAlertList.forEach((eachAlert) => {
            this.state.alert.alertTableAlertList[eachAlert.data.id] = eachAlert;
          });
          this.countAlerts(newAlertList);
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
        this.onClickOpenSecurityInBloomberg.bind(this),
        null
      );
      this.calculateQuantComparerWidthAndHeight();
      this.updateStage(this.constants.securityTableFinalStage, this.state.fetchResult.alertTable, this.state.table.alertDto);
      this.state.fetchResult.alertTable.fetchComplete = true;
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
              const newFilteredList = this.filterPrinstineRowList(targetTableBlock.prinstineRowList);
              targetTableBlock.liveUpdatedRowList = this.processingService.returnDiff(targetTableDTO, newFilteredList).newRowList;
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

    private countAlerts(alertList: Array<AlertDTO>) {
      alertList.forEach((eachAlert) => {
        switch (eachAlert.data.type) {
          case this.constants.alertTypes.axeAlert:
            if (eachAlert.state.isMarketListVariant) {
              // code...
            } else {

            }
            this.state.alert.axeAlertCount++;
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
      });
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
