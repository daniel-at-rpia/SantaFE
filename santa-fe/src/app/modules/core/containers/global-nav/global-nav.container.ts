// dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { Router, NavigationEnd } from '@angular/router';
    import { interval, Observable, of, Subscription } from 'rxjs';
    import { catchError, filter, first, tap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { GlobalNavState } from 'FEModels/frontend-page-states.interface';
    import { selectUserInitials, selectGlobalWorkflowNewState } from 'Core/selectors/core.selectors';
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
    newGlobalWorkflowStateSub: null
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
      }
    };
    return state;
  }

  constructor(
    private router: Router,
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
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
        const removeForwardSlash = event.urlAfterRedirects.slice(1);
        const modulePortion = removeForwardSlash.split('/').length > 0 ? removeForwardSlash.split('/')[0] : '';
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
      const newState = this.dtoService.formGlobalWorkflow(this.constants.moduleUrl.structuring, true);
      this.state.menuIsActive = false;
      this.router.navigateByUrl(`/${newState.data.module}/${newState.data.uuid}`);
      this.store$.dispatch(new CoreGlobalWorkflowSendNewState(newState));
    }
  }

  public onClickNavigateToTradeModule() {
    if (this.state.currentModule !== this.constants.moduleUrl.trade) {
      const newState = this.dtoService.formGlobalWorkflow(this.constants.moduleUrl.trade, true);
      this.state.menuIsActive = false;
      this.router.navigateByUrl(`/${newState.data.module}/${newState.data.uuid}`);
      this.store$.dispatch(new CoreGlobalWorkflowSendNewState(newState));
    }
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
