// dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { Router, NavigationEnd } from '@angular/router';
    import { interval, Observable, of, Subscription } from 'rxjs';
    import { catchError, filter, first, tap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { GlobalWorkflowIOService } from 'Core/services/GlobalWorkflowIOService';
    import { GlobalNavState } from 'FEModels/frontend-page-states.interface';
    import {
      selectUserInitials,
      selectGlobalWorkflowNewState,
      selectGlobalWorkflowUpdateTradeState,
      selectGlobalWorkflowUpdateStructureState
    } from 'Core/selectors/core.selectors';
    import { CoreGlobalWorkflowSendNewState } from 'Core/actions/core.actions';
    import { SeniorityLegendList, RatingLegendList } from 'Core/stubs/securities.stub';
    import { SeniorityValueToLevelMapping, RatingValueToLevelMapping } from 'Core/constants/securityDefinitionConstants.constant';
    import { BESecurityDTO } from 'Core/models/backend/backend-models.interface';
    import { GlobalNavLegendBlock } from 'Core/models/frontend/frontend-blocks.interface';
    import { NavigationModule } from 'Core/constants/coreConstants.constant';
    import { GlobalWorkflowStateDTO } from 'FEModels/frontend-models.interface';
//

declare const VERSION: string;

@Component({
  selector: 'global-nav',
  templateUrl: './global-nav.container.html',
  styleUrls: ['./global-nav.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class GlobalNav implements OnInit, OnChanges, OnDestroy {
  state: GlobalNavState;
  subscriptions = {
    userInitialsSub: null,
    navigationStartSub: null,
    newGlobalWorkflowStateSub: null,
    currentTradeStateChangeSub: null,
    currentStructureStateChangeSub: null
  };
  constants = {
    seniorityMapping: SeniorityValueToLevelMapping,
    ratingMapping: RatingValueToLevelMapping,
    moduleUrl: NavigationModule
  }

  private initializePageState(): GlobalNavState {
    const state: GlobalNavState = {
      menuIsActive: false,
      version: VERSION,
      user: 'Anonymous User',
      currentModule: null,
      legend: {
        seniority: this.loadLegend(this.constants.seniorityMapping, SeniorityLegendList),
        rating: this.loadLegend(this.constants.ratingMapping, RatingLegendList)
      },
      currentState: {
        trade: this.utilityService.generateUUID(),  // the default current state is a fresh new state
        structure: this.utilityService.generateUUID()  // the default current state is a fresh new state
      }
    };
    return state;
  }

  constructor(
    private router: Router,
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService,
    private globalWorkflowIOService: GlobalWorkflowIOService
  ) {
    this.state = this.initializePageState();
  }

  public ngOnInit() {
    this.subscriptions.userInitialsSub = this.store$.pipe(
      select(selectUserInitials)
    ).subscribe((userInitials) => {
      if (userInitials) {
        this.state.user = userInitials;
      }
    });
    this.subscriptions.navigationStartSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const modulePortion = this.utilityService.getModulePortionFromNavigation(event);
        const stateId = this.utilityService.getStateUUIDFromNavigation(event);
        stateId !== 'n/a' && this.globalWorkflowIOService.updateCurrentState(stateId);
        switch (modulePortion) {
          case this.constants.moduleUrl.trade:
            this.state.currentModule = this.constants.moduleUrl.trade;
            break;
          case this.constants.moduleUrl.structuring:
            this.state.currentModule = this.constants.moduleUrl.structuring;
            break;
          case this.constants.moduleUrl.market:
            this.state.currentModule = this.constants.moduleUrl.market;
            break;
          default:
            console.error('Navigation Failure', event);
            this.restfulCommService.logError(`Navigation Failure, ${event.url}`);
            break;
        }
      }
    });
    this.subscriptions.newGlobalWorkflowStateSub = this.store$.pipe(
      select(selectGlobalWorkflowNewState)
    ).subscribe(
      (newState: GlobalWorkflowStateDTO) => {
        if (!!newState && !!newState.data.uuid && !!newState.data.module) {
          // automatically navigate to new module as long as the new state is not in the same module as the currentModule
          if (this.state.currentModule !== newState.data.module) {
            switch (newState.data.module) {
              case this.constants.moduleUrl.structuring:
                this.router.navigateByUrl(`/${this.constants.moduleUrl.structuring}/${newState.data.uuid}`);
                break;
              case this.constants.moduleUrl.trade:
                this.router.navigateByUrl(`/${this.constants.moduleUrl.trade}/${newState.data.uuid}`);
                break;
              default:
                break;
            }
          }
        }
      }
    );
    this.subscriptions.currentTradeStateChangeSub = this.store$.pipe(
      select(selectGlobalWorkflowUpdateTradeState)
    ).subscribe((newStateId: string) => {
      if (!!newStateId) {
        this.state.currentState.trade = newStateId;
      }
    });
    this.subscriptions.currentStructureStateChangeSub = this.store$.pipe(
      select(selectGlobalWorkflowUpdateStructureState)
    ).subscribe((newStateId: string) => {
      if (!!newStateId) {
        this.state.currentState.structure = newStateId;
      }
    });
  }

  public ngOnChanges() {
  }

  public ngOnDestroy() {
  }

  public onClickNavTrigger() {
    this.state.menuIsActive = !this.state.menuIsActive;
  }

  public onClickNavCTA() {
    this.state.menuIsActive = false;
  }

  public onClickNavigateToStructuringModule() {
    if (this.state.currentModule !== this.constants.moduleUrl.structuring) {
      this.state.menuIsActive = false;
      const navigateToStructuring = () => {
        const newState = this.dtoService.formGlobalWorkflow(this.constants.moduleUrl.structuring, true);
        this.router.navigateByUrl(`/${this.constants.moduleUrl.structuring}/${this.state.currentState.structure}`);
        // no need to record this state, since it's meant as going to a diff module with a fresh state, recording it causs problem in history
      };
      setTimeout(navigateToStructuring.bind(this), 500);
    }
  }

  public onClickNavigateToTradeModule() {
    if (this.state.currentModule !== this.constants.moduleUrl.trade) {
      this.state.menuIsActive = false;
      const navigateToTrade = () => {
        this.router.navigateByUrl(`/${this.constants.moduleUrl.trade}/${this.state.currentState.trade}`);
        // no need to record this state, since it's meant as going to a diff module with a fresh state, recording it causs problem in history
      }
      setTimeout(navigateToTrade.bind(this), 500);
    };
  }

  private loadLegend(mapping, stubList: Array<BESecurityDTO>): Array<GlobalNavLegendBlock> {
    let level = 0;
    const legendBlockList = stubList.map((eachStub)=>{
      const card = this.dtoService.formSecurityCardObject(null, eachStub, false, false);
      card.state.isInteractionDisabled = true;
      card.state.isWidthFlexible = true;
      let legend: string = '';
      if (mapping.length > level) {
        mapping[level].values.forEach((eachText, index) => {
          if (index === 0) {
            legend = `${eachText}`;
          } else {
            legend = `${legend} ∙ ${eachText}`;
          }
        });
      }
      level++;
      return {
        card: card,
        legend: legend
      };
    });
    return legendBlockList;
  }

}
