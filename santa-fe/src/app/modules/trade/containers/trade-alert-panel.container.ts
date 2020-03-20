  // dependencies
    import {
      Component,
      ViewEncapsulation,
      Input,
      Output,
      EventEmitter,
      OnInit,
      OnChanges,
      OnDestroy
    } from '@angular/core';
    import { Store, select } from '@ngrx/store';
    import {
      Observable,
      Subscription,
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
    import * as moment from 'moment';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { TradeAlertPanelState } from 'FEModels/frontend-page-states.interface';
    import { SecurityMapEntry } from 'FEModels/frontend-adhoc-packages.interface';
    import { SecurityDTO } from 'FEModels/frontend-models.interface';
    import { TradeAlertConfigurationAxeGroupBlock } from 'FEModels/frontend-blocks.interface';
    import {
      BESecurityDTO,
      BEAlertConfigurationReturn,
      BEAlertConfigurationDTO,
      BEAlertDTO
    } from 'BEModels/backend-models.interface';
    import { PayloadGetSecurities, PayloadUpdateAlertConfig } from 'BEModels/backend-payloads.interface';
    import {
      EngagementActionList,
      AlertTypes,
      AlertSubTypes
    } from 'Core/constants/coreConstants.constant';
    import {
      selectSecurityMapContent,
      selectSecurityMapValidStatus
    } from 'Core/selectors/core.selectors';
    import {
      ALERT_MAX_SECURITY_SEARCH_COUNT,
      AxeAlertScope,
      ALERT_UPDATE_COUNTDOWN
    } from 'Core/constants/tradeConstants.constant';
    import { AlertSample } from 'Trade/stubs/tradeAlert.stub';
    import { CoreFlushSecurityMap, CoreSendNewAlerts } from 'Core/actions/core.actions';
    import { selectSelectedSecurityForAlertConfig } from 'Trade/selectors/trade.selectors';
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
  state: TradeAlertPanelState;
  subscriptions = {
    securityMapSub: null,
    autoUpdateCountSub: null,
    selectedSecurityForAlertConfigSub: null
  }
  autoUpdateCount$: Observable<any>;
  constants = {
    alertTypes: AlertTypes,
    alertSubTypes: AlertSubTypes,
    axeAlertScope: AxeAlertScope,
    countdown: ALERT_UPDATE_COUNTDOWN
  }

  constructor(
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService,
  ){
    this.state = this.initializePageState();
  }

  private initializePageState(): TradeAlertPanelState {
    const state: TradeAlertPanelState = {
      configureAlert: false,
      isAlertPaused: true,
      testDto: this.dtoService.createSecurityDefinitionConfigurator(true, true),
      securityMap: [],
      alertUpdateTimestamp: null,
      configuration: {
        selectedAlert: null,
        axe: {
          myGroup: {
            card: null,
            groupId: null,
            scopes: []
          },
          securitySearchKeyword: '',
          securityList: [],
          searchList: [],
          matchedResultCount: 0,
          searchIsValid: false
        },
        mark: {

        }
      },
      autoUpdateCountdown: 0,
      alertUpdateInProgress: false
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
        this.store$.dispatch(new CoreFlushSecurityMap());
      }
    });

    this.autoUpdateCount$ = interval(1000);
    this.subscriptions.autoUpdateCountSub = this.autoUpdateCount$.subscribe(count => {
      if (!this.state.isAlertPaused && !this.state.alertUpdateInProgress) {
        this.state.autoUpdateCountdown = this.state.autoUpdateCountdown + 1;
        if (this.state.autoUpdateCountdown >= this.constants.countdown) {
          this.updateAlert();
          this.state.autoUpdateCountdown = 0;
        }
      }
    });
    this.subscriptions.selectedSecurityForAlertConfigSub = this.store$.pipe(
      select(selectSelectedSecurityForAlertConfig)
    ).subscribe((targetSecurity) => {
      if (!!targetSecurity) {
        if (!this.state.configureAlert) {
          this.onClickConfigureAlert();
        }
        const existMatchIndex = this.state.configuration.axe.securityList.findIndex((eachEntry) => {
          return eachEntry.card.data.securityID === targetSecurity.data.securityID;
        });
        if (existMatchIndex < 0) {
          this.addSecurityToWatchList(targetSecurity);
        }
      }
    });
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

  public onClickConfigureAlert() {
    this.configureAlert.emit();
    this.state.configureAlert = true;
    this.loadAllConfigurations();
  }

  public onTogglePauseAlert() {
    this.state.isAlertPaused = !this.state.isAlertPaused;
  }

  public selectAlertForConfigure(targetType: AlertTypes) {
    this.state.configuration.selectedAlert = targetType;
  }

  public onSearchKeywordChange(keyword: string) {
    const config = this.state.configuration.axe;
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
    if (!!targetScope && !!targetBlock) {
      this.addScopeToAxeWatchlistEntry(targetBlock, targetScope);
    }
  }

  public onClickSaveConfiguration() {
    this.saveAxeConfiguration();
    this.saveConfig.emit();
    this.state.configureAlert = false;
  }

  public onClickUpdateAlert() {
    this.updateAlert();
  }

  private fetchSecurities(matchList: Array<SecurityMapEntry>) {
    const list = matchList.map((eachEntry) => {
      return eachEntry.secruityId;
    });
    const payload = {
      identifiers: list
    };
    this.state.configuration.axe.searchList = [];
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getSecurityDTOs, {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn: Array<BESecurityDTO>) => {
        if (!!serverReturn) {
          serverReturn.forEach((eachRawData) => {
            const eachCard = this.dtoService.formSecurityCardObject(eachRawData.securityIdentifier, eachRawData, false);
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
          this.restfulCommService.logError(`'security/get-securities' API returned an empty result with this payload: ${list.toString()}`, null);
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
      config.securityList.splice(existMatchIndex, 1);
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
      scopes: targetScope === this.constants.axeAlertScope.both ? [this.constants.axeAlertScope.ask, this.constants.axeAlertScope.bid] : [targetScope]
    };
    this.state.configuration.axe.securityList.unshift(newEntry);
  }

  private loadAllConfigurations() {
    const config = this.state.configuration.axe;
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getAlertConfigurations, {req: 'GET'}).pipe(
      first(),
      tap((serverReturn: BEAlertConfigurationReturn) => {
        if (!!serverReturn) {
          this.state.isAlertPaused = false;
          for (const eachGroupId in serverReturn.Axe) {
            const eachConfiguration = serverReturn.Axe[eachGroupId];
            this.populateConfigurationFromEachGroup(eachConfiguration);
          }
        } else {
          this.restfulCommService.logError(`'Alert/get-alert-configs' API returned an empty result`, null);
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
      } else if (rawGroupConfig.groupFilters.Owner && rawGroupConfig.groupFilters.Owner.length > 0) {
        this.populateConfigurationFromMyGroup(rawGroupConfig);
      }
    }
  }

  private populateConfigurationFromSecurityGroup(rawGroupConfig: BEAlertConfigurationDTO) {
    const targetScope = rawGroupConfig.subType as AxeAlertScope;
    const payload: PayloadGetSecurities = {
      identifiers: rawGroupConfig.groupFilters.SecurityIdentifier
    };
    const newEntry: TradeAlertConfigurationAxeGroupBlock = {
      card: null,
      groupId: rawGroupConfig.alertConfigID,
      scopes: targetScope === this.constants.axeAlertScope.both ? [this.constants.axeAlertScope.ask, this.constants.axeAlertScope.bid] : [targetScope]
    };
    this.state.configuration.axe.securityList.unshift(newEntry);
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getSecurityDTOs, {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn: Array<BESecurityDTO>) => {
        if (!!serverReturn) {
          serverReturn.forEach((eachRawData) => {
            const eachCard = this.dtoService.formSecurityCardObject(eachRawData.securityIdentifier, eachRawData, false);
            eachCard.state.isInteractionDisabled = true;
            eachCard.state.isWidthFlexible = true;
            newEntry.card = eachCard;
          });
        } else {
          this.restfulCommService.logError(`'security/get-securities' API returned an empty result with this payload: ${payload.identifiers.toString()}`, null);
        }
      })
    ).subscribe();
  }

  private populateConfigurationFromMyGroup(rawGroupConfig: BEAlertConfigurationDTO) {
    const targetScope = rawGroupConfig.subType as AxeAlertScope;
    this.state.configuration.axe.myGroup = {
      card: null,
      groupId: rawGroupConfig.alertConfigID,
      scopes: targetScope === this.constants.axeAlertScope.both ? [this.constants.axeAlertScope.ask, this.constants.axeAlertScope.bid] : [targetScope]
    }
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
    const groupPayload: PayloadUpdateAlertConfig = {
      alertConfig: {
        type: this.constants.alertTypes.axeAlert,
        subType: this.mapAxeScopesToAlertSubtypes(this.state.configuration.axe.myGroup.scopes),
        groupFilters: {
          Owner: [this.ownerInitial]
        }
      }
    };
    this.saveSingleAxeConfiguration(groupPayload, this.state.configuration.axe.myGroup);
    this.state.configuration.axe.securityList.forEach((eachEntry) => {
      const payload: PayloadUpdateAlertConfig = {
        alertConfig: {
          type: this.constants.alertTypes.axeAlert,
          subType: this.mapAxeScopesToAlertSubtypes(eachEntry.scopes),
          groupFilters: {}
        }
      }
      payload.alertConfig.groupFilters.SecurityIdentifier = [eachEntry.card.data.securityID];
      this.saveSingleAxeConfiguration(payload, eachEntry);
    });
  }

  private saveSingleAxeConfiguration(
    payload: PayloadUpdateAlertConfig,
    targetEntry: TradeAlertConfigurationAxeGroupBlock
  ) {
    if (!!targetEntry.groupId) {
      payload.alertConfig.alertConfigID = targetEntry.groupId;
    }
    if (targetEntry.scopes.length === 0) {
      payload.alertConfig.isEnabled = false;
    }
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.updateAlertConfiguration, {req: 'POST'}, payload).pipe(
      first(),
      catchError(err => {
        console.error(`${this.restfulCommService.apiMap.updateAlertConfiguration} failed`, payload);
        this.restfulCommService.logError(`${this.restfulCommService.apiMap.updateAlertConfiguration} failed`, null);
        return of('error');
      })
    ).subscribe();
  }

  private updateAlert() {
    this.state.alertUpdateInProgress = true;
    const payload = {
      "timeStamp": this.state.alertUpdateTimestamp ||  moment().hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ss.SSS")
    };
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getAlerts, {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn: Array<BEAlertDTO>) => {
        if (!!serverReturn && serverReturn.length > 0) {
          const updateList = [];
          serverReturn.forEach((eachRawAlert) => {
            if (eachRawAlert.isActive) {
              const newAlert = this.dtoService.formAlertObject(eachRawAlert);
              updateList.push(newAlert);
            }
          });
          updateList.length > 0 && this.store$.dispatch(new CoreSendNewAlerts(this.utilityService.deepCopy(updateList)));
        }
        this.state.alertUpdateInProgress = false;
      }),
      catchError(err => {
        this.state.alertUpdateInProgress = false;
        console.error(`${this.restfulCommService.apiMap.getAlerts} failed`, err);
        return of('error')
      })
    ).subscribe();
    // timeStamp needs to be updated right after the API call initiates, NOT when it returns
    this.state.alertUpdateTimestamp = moment().format("YYYY-MM-DDTHH:mm:ss.SSS");
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
      return null;
    }
  }

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