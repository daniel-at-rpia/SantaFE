  // dependencies
    import {
      Component,
      OnInit,
      OnChanges,
      ViewEncapsulation,
      Input,
      Output,
      EventEmitter
    } from '@angular/core';
    import { of } from 'rxjs';
    import {
      tap,
      first,
      delay,
      catchError
    } from 'rxjs/operators';


    import { DTOService } from 'Core/services/DTOService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { SecurityDefinitionConfiguratorDTO,SecurityDefinitionDTO } from 'FEModels/frontend-models.interface';
    import { SecurityDefinitionFilterBlock } from 'FEModels/frontend-blocks.interface';
    import { ConfiguratorDefinitionLayout } from 'Core/constants/securityDefinitionConstants.constant';
    import {
      DefinitionConfiguratorEmitterParams,
      DefinitionConfiguratorEmitterParamsItem
    } from 'FEModels/frontend-adhoc-packages.interface';
  //

@Component({
  selector: 'security-definition-configurator',
  templateUrl: './security-definition-configurator.container.html',
  styleUrls: ['./security-definition-configurator.container.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SecurityDefinitionConfigurator implements OnInit, OnChanges {
  configuratorDefinitionlayout: Array<any>;
  @Input() configuratorData: SecurityDefinitionConfiguratorDTO;
  @Input() highlightedVariant: boolean;
  @Output() clickedSearch = new EventEmitter();
  @Output() clickedApplyFilter = new EventEmitter<DefinitionConfiguratorEmitterParams>();
  lastExecutedConfiguration: SecurityDefinitionConfiguratorDTO;

  constructor(
    private dtoService: DTOService,
    private restfulCommService: RestfulCommService,
    private utilityService: UtilityService
  ) {
  }

  ngOnInit() {
    this.configuratorData.data.definitionList.forEach((eachBundle) => {
      eachBundle.data.list.forEach((eachDefinition) => {
        if (eachDefinition.state.isLocked) {
          eachDefinition.state.isUnactivated = false;
        }
      });
    });
    if (this.configuratorData.state.groupByDisabled) {
      this.configuratorData.data.definitionList.forEach((eachBundle) => {
        eachBundle.data.list = eachBundle.data.list.filter((eachDefinition) => {
          return !!eachDefinition.data.correspondSecurityDTOAttribute;
        });
      })
      this.configuratorData.data.definitionList = this.configuratorData.data.definitionList.filter((eachBundle) => {
        return eachBundle.data.list.length > 0;
      });
    }
  }

  ngOnChanges() {
    if (!!this.configuratorData) {
      this.lastExecutedConfiguration = this.utilityService.deepCopy(this.configuratorData);
    }
  }

  public onClickLoadLongOptionListForDefinition(targetDefinition: SecurityDefinitionDTO) {
    this.configuratorData.state.isLoadingLongOptionListFromServer = true;
    this.restfulCommService.callAPI(targetDefinition.data.urlForGetLongOptionListFromServer, {req: 'GET'}).pipe(
      first(),
      delay(200),
      tap((serverReturn: Array<string>) => {
        targetDefinition.data.filterOptionList = this.dtoService.generateSecurityDefinitionFilterOptionList(targetDefinition.data.key, serverReturn);
        this.configuratorData.state.isLoadingLongOptionListFromServer = false;
      }),
      catchError(err => {
        console.log('error', err);
        return of('error');
      })
    ).subscribe();
  }

  public selectDefinitionForGrouping(targetDefinition: SecurityDefinitionDTO) {
    if (!targetDefinition.state.isLocked) {
      targetDefinition.state.groupByActive = !targetDefinition.state.groupByActive;
      // disable the two-step config workflow through commenting, so we can bring it back up easily if necessary
      // const existIndex = this.configuratorData.data.selectedDefinitionList.indexOf(targetDefinition);
      // if ( existIndex >= 0) {
      //   targetDefinition.state.isUnactivated = true;
      //   if (targetDefinition === this.configuratorData.state.showFiltersFromDefinition) {
      //     this.clearSearchFilter();
      //     this.configuratorData.state.showFiltersFromDefinition = null;
      //   }
      //   this.clearDefinitionFilterOptions(targetDefinition);
      //   this.configuratorData.data.selectedDefinitionList.splice(existIndex, 1);
      // } else {
      //   targetDefinition.state.isUnactivated = false;
      //   this.configuratorData.data.selectedDefinitionList.push(targetDefinition);
      // }
    }
  }

  public onClickDefinition(targetDefinition: SecurityDefinitionDTO) {
    if (!targetDefinition.state.isUnactivated) {
      this.clearSearchFilter();
      if (this.configuratorData.state.showFiltersFromDefinition && this.configuratorData.state.showFiltersFromDefinition.data.urlForGetLongOptionListFromServer) {
        // have to flush out the long options for performance concerns
        this.configuratorData.state.showFiltersFromDefinition.data.filterOptionList = [];
      }
      this.configuratorData.state.showFiltersFromDefinition = this.configuratorData.state.showFiltersFromDefinition === targetDefinition ? null : targetDefinition;
      if (this.configuratorData.state.showFiltersFromDefinition) {
        this.configuratorData.state.showLongFilterOptions = this.configuratorData.state.showFiltersFromDefinition.data.filterOptionList.length > 5 || !!this.configuratorData.state.showFiltersFromDefinition.data.urlForGetLongOptionListFromServer;  // any list with more than five options or need to be loaded from server is considered a long list, will need extra room on the UI
      }
    }
  }

  public onClickFilterOption(targetOption:SecurityDefinitionFilterBlock) {
    const targetDefinition = this.configuratorData.state.showFiltersFromDefinition;
    targetOption.isSelected = !targetOption.isSelected;
    let filterActive = false;
    targetDefinition.data.filterOptionList.forEach((eachOption) => {
      if (eachOption.isSelected) {
        filterActive = true;
      }
    });
    targetDefinition.state.filterActive = filterActive;
    if (this.configuratorData.state.groupByDisabled) {
      this.configuratorData.state.canApplyFilter = this.checkFilterCanApply();
    }
  }

  public onSearchKeywordChange(newKeyword) {
    if (this.configuratorData.state.showFiltersFromDefinition) {
      this.configuratorData.data.filterSearchInputValue = newKeyword;
      if (!!newKeyword && newKeyword.length >= 1) {
        this.configuratorData.state.showFiltersFromDefinition.data.filterOptionList.forEach((eachOption) => {
          if (this.applySearchFilter(eachOption, newKeyword)) {
            eachOption.isFilteredOut = false;
          } else {
            eachOption.isFilteredOut = true;
          }
        })
      } else {
        this.configuratorData.state.showFiltersFromDefinition.data.filterOptionList.forEach((eachOption) => {
          eachOption.isFilteredOut = false;
        })
      }
    }
  }

  public triggerSearch() {
    this.configuratorData.state.isLoading = true;
    this.clickedSearch.emit();
  }

  public triggerApplyFilter() {
    const params: DefinitionConfiguratorEmitterParams = {
      filterList: []
    };
    this.configuratorData.data.definitionList.forEach((eachBundle) => {
      eachBundle.data.list.forEach((eachDefinition) => {
        const activeFilters = eachDefinition.data.filterOptionList.filter((eachOption) => {
          return eachOption.isSelected;
        });
        activeFilters.length > 0 && params.filterList.push({
          targetAttribute: eachDefinition.data.correspondSecurityDTOAttribute,
          filterBy: activeFilters.map((eachFilter) => {
            return eachFilter.displayLabel;
          })
        });
      });
    });
    this.clickedApplyFilter.emit(params);
    this.lastExecutedConfiguration = this.utilityService.deepCopy(this.configuratorData);
    this.configuratorData.state.canApplyFilter = false;
  }

  private applySearchFilter(targetOption: SecurityDefinitionFilterBlock, keyword: string): boolean {
    const normalizedTarget = targetOption.displayLabel.toLowerCase();
    const normalizedKeyword = keyword.toLowerCase();
    return normalizedTarget.includes(normalizedKeyword);
  }

  private clearSearchFilter() {
    this.configuratorData.data.filterSearchInputValue = '';
    this.onSearchKeywordChange('');
  }

  private clearDefinitionFilterOptions(targetDefinition: SecurityDefinitionDTO) {
    targetDefinition.data.filterOptionList.forEach((eachOption) => {
      eachOption.isSelected = false;
    });
    targetDefinition.state.filterActive = false;
  }

  private checkFilterCanApply(): boolean {
    let canApply = false;
    this.configuratorData.data.definitionList.forEach((eachDefinitionBundle, bundleIndex) => {
      eachDefinitionBundle.data.list.forEach((eachDefinition, definitionIndex) => {
        const activeFilters = eachDefinition.data.filterOptionList.filter((eachOption) => {
          return eachOption.isSelected;
        })
        const prevActiveFilters = this.lastExecutedConfiguration.data.definitionList[bundleIndex].data.list[definitionIndex].data.filterOptionList.filter((eachOption) => {
          return eachOption.isSelected;
        })
        if (activeFilters.length === prevActiveFilters.length) {
          for (let i = 0; i < length; ++i) {
            if (activeFilters[i] !== prevActiveFilters[i]) {
              canApply = true;
              break;
            }
          }
        } else {
          canApply = true;
        }
      });
    });
    return canApply;
  }

}
