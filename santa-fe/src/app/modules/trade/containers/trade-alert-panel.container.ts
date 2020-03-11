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
    import { BESecurityDTO } from 'BEModels/backend-models.interface';
    import {
      EngagementActionList,
      AlertTypes
    } from 'Core/constants/coreConstants.constant';
    import {
      selectSecurityMapContent,
      selectSecurityMapValidStatus
    } from 'Core/selectors/core.selectors';
    import { ALERT_MAX_SECURITY_SEARCH_COUNT } from 'Core/constants/tradeConstants.constant';
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
          matchedResultCount: null,
          searchIsValid: false
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
      console.log('test, found match', result);
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

  public onSelectSide(targetSide: string, targetBlock: TradeAlertConfigurationAxeSecurityBlock) {
    if (!!targetSide && !!targetBlock) {
      if (targetSide === 'bid') {
        targetBlock.bidSelected = !targetBlock.bidSelected;
      } else if (targetSide === 'ask') {
        targetBlock.askSelected = !targetBlock.askSelected;
      }
    }
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
      config.securityList.unshift({
        card: copy,
        bidSelected: true,
        askSelected: true
      });
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