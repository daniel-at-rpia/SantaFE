// dependencies
    import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
    import { interval, Observable, of, Subscription } from 'rxjs';
    import { catchError, filter, first, tap } from 'rxjs/operators';
    import { select, Store } from '@ngrx/store';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { GlobalNavState } from 'FEModels/frontend-page-states.interface';
    import { selectUserInitials } from 'Core/selectors/core.selectors';
    import { SeniorityLegendList, RatingLegendList } from 'Core/stubs/securities.stub';
    import { SeniorityValueToLevelMapping, RatingValueToLevelMapping } from 'Core/constants/securityDefinitionConstants.constant';
    import { BESecurityDTO } from 'Core/models/backend/backend-models.interface';
    import { GlobalNavLegendBlock } from 'Core/models/frontend/frontend-blocks.interface';
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
    userInitialsSub: null
  };
  constants = {
    seniorityMapping: SeniorityValueToLevelMapping,
    ratingMapping: RatingValueToLevelMapping
  }

  private initializePageState(): GlobalNavState {
    const state: GlobalNavState = {
      menuIsActive: false,
      version: VERSION,
      user: 'Anonymous User',
      legend: {
        seniority: this.loadLegend(this.constants.seniorityMapping, SeniorityLegendList),
        rating: this.loadLegend(this.constants.ratingMapping, RatingLegendList)
      }
    };
    return state;
  }

  constructor(
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
  }

  public ngOnChanges() {
  }

  public ngOnDestroy() {
  }

  public onClickNavTrigger() {
    this.state.menuIsActive = !this.state.menuIsActive;
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
