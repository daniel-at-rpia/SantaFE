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

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { TradeAlertPanelState } from 'FEModels/frontend-page-states.interface';
    import { SecurityMapEntry } from 'FEModels/frontend-adhoc-packages.interface';
    import { SecurityDTO } from 'FEModels/frontend-models.interface';
    import { TradeAlertConfigurationAxeSecurityBlock } from 'FEModels/frontend-blocks.interface';
    import {
      BESecurityDTO,
      BEAlertConfigurationReturn,
      BEAlertConfigurationDTO
    } from 'BEModels/backend-models.interface';
    import { PayloadGetSecurities } from 'BEModels/backend-payloads.interface';
    import {
      EngagementActionList,
      AlertTypes
    } from 'Core/constants/coreConstants.constant';
    import {
      selectSecurityMapContent,
      selectSecurityMapValidStatus
    } from 'Core/selectors/core.selectors';
    import {
      ALERT_MAX_SECURITY_SEARCH_COUNT,
      AxeAlertScope
    } from 'Core/constants/tradeConstants.constant';
    import { AlertSample } from 'Trade/stubs/tradeAlert.stub';
    import { CoreSendNewAlerts } from 'Core/actions/core.actions';
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
  state: TradeAlertPanelState;
  subscriptions = {
    securityMapSub: null
  }
  constants = {
    axeAlertScope: AxeAlertScope
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
      isAlertPaused: false,
      testDto: this.dtoService.createSecurityDefinitionConfigurator(true, true),
      securityMap: [],
      configuration: {
        selectedAlert: null,
        axe: {
          securitySearchKeyword: '',
          securityList: [],
          searchList: [],
          matchedResultCount: 0,
          searchIsValid: false,
          bidGroupId: null,
          askGroupId: null,
          bothGroupId: null,
          liquidationGroupId: null
        },
        mark: {

        }
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

  public onClickConfigureAlert() {
    this.configureAlert.emit();
    this.state.configureAlert = true;
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

  public onSelectAxeWatchlistSide(targetScope: AxeAlertScope, targetBlock: TradeAlertConfigurationAxeSecurityBlock) {
    if (!!targetScope && !!targetBlock) {
      const existIndex = targetBlock.scopes.indexOf(targetScope);
      if (existIndex >= 0) {
        targetBlock.scopes.splice(existIndex, 1);
      } else {
        targetBlock.scopes.push(targetScope);
      }
    }
  }

  public onClickSaveConfiguration() {
    this.saveAxeConfiguration();
  }

  public onClickUpdateAlert() {
    const updateList = [];
    AlertSample.forEach((eachRawAlert) => {
      const newAlert = this.dtoService.formAlertObject(eachRawAlert);
      updateList.push(newAlert);
    });
    this.store$.dispatch(new CoreSendNewAlerts(this.utilityService.deepCopy(updateList)));
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
      const copy:SecurityDTO = this.utilityService.deepCopy(targetSecurity);
      copy.state.isSelected = false;
      copy.state.isInteractionDisabled = true;
      this.loadSecurityToAxeWatchlist(copy, this.constants.axeAlertScope.bid);
    }
  }

  private loadAllConfigurations() {
    const config = this.state.configuration.axe;
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getAlertConfigurations, {req: 'GET'}).pipe(
      first(),
      tap((serverReturn: BEAlertConfigurationReturn) => {
        if (!!serverReturn) {
          for (const eachGroupId in serverReturn.Axe) {
            const eachConfiguration = serverReturn.Axe[eachGroupId];
            if (eachConfiguration.subType === 'Both') {
              config.bothGroupId = eachConfiguration.alertConfigID;
              this.populateConfigurationFromEachGroup(eachConfiguration, this.constants.axeAlertScope.bid);
              this.populateConfigurationFromEachGroup(eachConfiguration, this.constants.axeAlertScope.ask);
            } else {
              if (eachConfiguration.subType == this.constants.axeAlertScope.bid) {
                config.bidGroupId = eachConfiguration.alertConfigID;
                this.populateConfigurationFromEachGroup(eachConfiguration, this.constants.axeAlertScope.bid);
              } else if (eachConfiguration.subType == this.constants.axeAlertScope.ask) {
                config.askGroupId = eachConfiguration.alertConfigID;
                this.populateConfigurationFromEachGroup(eachConfiguration, this.constants.axeAlertScope.bid);
              } else if (eachConfiguration.subType == this.constants.axeAlertScope.liquidation) {
                config.liquidationGroupId = eachConfiguration.alertConfigID;
                this.populateConfigurationFromEachGroup(eachConfiguration, this.constants.axeAlertScope.liquidation);
              }
            }
          }
        } else {
          this.restfulCommService.logError(`'Alert/get-alert-configs' API returned an empty result`, null);
        }
      })
    ).subscribe();
  }

  private populateConfigurationFromEachGroup(
    rawGroupConfig: BEAlertConfigurationDTO,
    targetScope: AxeAlertScope
  ) {
    if (!!rawGroupConfig && !!rawGroupConfig.groupFilters && rawGroupConfig.groupFilters.SecurityIdentifier && rawGroupConfig.groupFilters.SecurityIdentifier.length > 0) {
      const payload: PayloadGetSecurities = {
        identifiers: rawGroupConfig.groupFilters.SecurityIdentifier
      };
      this.restfulCommService.callAPI(this.restfulCommService.apiMap.getSecurityDTOs, {req: 'POST'}, payload).pipe(
        first(),
        tap((serverReturn: Array<BESecurityDTO>) => {
          if (!!serverReturn) {
            serverReturn.forEach((eachRawData) => {
              const eachCard = this.dtoService.formSecurityCardObject(eachRawData.securityIdentifier, eachRawData, false);
              eachCard.state.isInteractionDisabled = true;
              eachCard.state.isWidthFlexible = true;
              this.loadSecurityToAxeWatchlist(eachCard, targetScope);
            });
          } else {
            this.restfulCommService.logError(`'security/get-securities' API returned an empty result with this payload: ${payload.identifiers.toString()}`, null);
          }
        })
      ).subscribe();
    }
  }

  private loadSecurityToAxeWatchlist(
    targetSecurity: SecurityDTO,
    targetScope: AxeAlertScope
  ) {
    // when entering this function from onClickSearchResult(), the existMatchIndex in here will always be -1, because it was pre-handled differerntly in onClickSearchResult()
    const config = this.state.configuration.axe;
    const existMatchIndex = config.securityList.findIndex((eachEntry) => {
      return eachEntry.card.data.securityID === targetSecurity.data.securityID;
    });
    if (existMatchIndex < 0) {
      const newEntry: TradeAlertConfigurationAxeSecurityBlock = {
        card: targetSecurity,
        scopes: [targetScope]
      };
      config.securityList.unshift(newEntry);
    } else {
      const existEntry = config.securityList[existMatchIndex];
      this.addScopeToAxeWatchlistEntry(existEntry, targetScope);
    }
  }

  private addScopeToAxeWatchlistEntry(targetEntry: TradeAlertConfigurationAxeSecurityBlock, targetScope: AxeAlertScope) {
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