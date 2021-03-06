  // dependencies
    import { Component, OnInit, OnChanges, ViewEncapsulation, Input, Output, EventEmitter, isDevMode } from '@angular/core';
    import { of } from 'rxjs';
    import { tap, first, delay, catchError } from 'rxjs/operators';

    import { DTOService } from 'Core/services/DTOService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { SecurityDefinitionConfiguratorDTO,SecurityDefinitionDTO } from 'FEModels/frontend-models.interface';
    import { SecurityDefinitionFilterBlock } from 'FEModels/frontend-blocks.interface';
    import {
      ConfiguratorDefinitionLayout,
      SecurityDefinitionMap,
      FILTER_OPTION_LIST_EXTREME_LONG_THRESHOLD
    } from 'Core/constants/securityDefinitionConstants.constant';
    import {
      DefinitionConfiguratorEmitterParams,
      DefinitionConfiguratorEmitterParamsItem
    } from 'FEModels/frontend-adhoc-packages.interface';
  //

@Component({
  selector: 'security-definition-configurator',
  templateUrl: './security-definition-configurator.container.html',
  styleUrls: ['./security-definition-configurator.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SecurityDefinitionConfigurator implements OnInit, OnChanges {
  configuratorDefinitionlayout: Array<any>;
  @Input() configuratorData: SecurityDefinitionConfiguratorDTO;
  @Input() highlightedVariant: boolean;
  @Output() clickedSearch = new EventEmitter();
  @Output() clickedApplyFilter = new EventEmitter<DefinitionConfiguratorEmitterParams>();
  lastExecutedConfiguration: SecurityDefinitionConfiguratorDTO;
  @Output() buryConfigurator = new EventEmitter();
  @Output() boostConfigurator = new EventEmitter();
  constants = {
    map: SecurityDefinitionMap,
    extremeLongThreshold: FILTER_OPTION_LIST_EXTREME_LONG_THRESHOLD
  }

  constructor(
    private dtoService: DTOService,
    private restfulCommService: RestfulCommService,
    private utilityService: UtilityService
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (!!this.configuratorData) {
      if (this.configuratorData.state.securityAttrOnly) {
        this.hideFiltersForGroupByDisabledVariant();
      }
      if (!this.configuratorData.state.groupByDisabled) {
        this.configuratorData.data.definitionList.forEach((eachBundle) => {
          eachBundle.data.list.forEach((eachDefinition) => {
            if (eachDefinition.state.isLocked) {
              eachDefinition.state.isUnactivated = false;
            }
          });
        });
      }
      this.lastExecutedConfiguration = this.utilityService.deepCopy(this.configuratorData);
      this.configuratorData.data.definitionList.forEach((eachBundle) => {
        eachBundle.data.list.forEach((eachDefinition) => {
          if (eachDefinition.data.key === this.constants.map.COUNTRY.key) {
            this.fetchCountryCode(eachDefinition);
          }
          if (eachDefinition.data.key === this.constants.map.TICKER.key) {
            this.fetchTicker(eachDefinition);
          }
        })
      });
    }
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
    if (!!targetDefinition && !targetDefinition.state.isUnactivated) {
      this.clearSearchFilter();
      this.configuratorData.state.showFiltersFromDefinition = this.configuratorData.state.showFiltersFromDefinition === targetDefinition ? null : targetDefinition;
      if (!!this.configuratorData.state.showFiltersFromDefinition && !!this.configuratorData.state.showFiltersFromDefinition.state.isExtremeLongVariant) {
        this.updateExtremeLongCount(targetDefinition, this.configuratorData.state.showFiltersFromDefinition.data.prinstineFilterOptionListForExtremeLong.length);
      }
      if (this.configuratorData.state.showFiltersFromDefinition) {
        this.boostConfigurator.emit();
      } else {
        this.buryConfigurator.emit();
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
    if (targetDefinition.state.isExtremeLongVariant) {
      if (targetOption.isSelected) {
        targetDefinition.data.highlightSelectedOptionList.indexOf(targetOption) < 0 && targetDefinition.data.highlightSelectedOptionList.push(targetOption);
      } else {
        targetDefinition.data.highlightSelectedOptionList = targetDefinition.data.highlightSelectedOptionList.filter((eachFilter) => {
          return eachFilter.key !== targetOption.key;
        })
      }
    } else {
      targetDefinition.data.highlightSelectedOptionList = targetDefinition.data.filterOptionList.filter((eachFilter) => {
        return !!eachFilter.isSelected;
      });
    }
  }

  public onSearchKeywordChange(newKeyword) {
    const targetDefinition = this.configuratorData.state.showFiltersFromDefinition;
    if (!!targetDefinition) {
      this.configuratorData.data.filterSearchInputValue = newKeyword;
      if (targetDefinition.state.isExtremeLongVariant) {
        if (!!newKeyword && newKeyword.length >= 1) {
          const resultList = targetDefinition.data.prinstineFilterOptionListForExtremeLong.filter((eachOption) => {
            return this.applySearchFilter(eachOption, newKeyword);
          });
          this.updateExtremeLongCount(targetDefinition, resultList.length);
          if (this.configuratorData.state.showFiltersFromDefinitionExtremeLongCount < this.constants.extremeLongThreshold) {
            targetDefinition.data.filterOptionList = this.utilityService.deepCopy(resultList);
          }
        } else {
          targetDefinition.data.filterOptionList = [];
          this.updateExtremeLongCount(targetDefinition, this.configuratorData.state.showFiltersFromDefinition.data.prinstineFilterOptionListForExtremeLong.length);
        }
      } else {
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
  }

  public triggerSearch() {
    this.configuratorData.state.isLoading = true;
    this.clickedSearch.emit();
  }

  public triggerApplyFilter() {
    this.configuratorData.state.groupByDisabled && this.onClickDefinition(this.configuratorData.state.showFiltersFromDefinition);
    const params = this.utilityService.packDefinitionConfiguratorEmitterParams(this.configuratorData);
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
          for (let i = 0; i < activeFilters.length; ++i) {
            if (activeFilters[i].shortKey !== prevActiveFilters[i].shortKey) {
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

  private hideFiltersForGroupByDisabledVariant() {
    if (this.configuratorData.state.groupByDisabled) {
      this.configuratorData.data.definitionList.forEach((eachBundle) => {
        eachBundle.data.list = eachBundle.data.list.filter((eachDefinition) => {
          return !!eachDefinition.data.securityDTOAttr;
        });
      })
      this.configuratorData.data.definitionList = this.configuratorData.data.definitionList.filter((eachBundle) => {
        return eachBundle.data.list.length > 0;
      });
    }
  }

  private fetchCountryCode(targetDefinition: SecurityDefinitionDTO) {
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getCountries, {req: 'GET'}).pipe(
      first(),
      tap((serverReturn: Array<string>) => {
        targetDefinition.data.filterOptionList = this.dtoService.generateSecurityDefinitionFilterOptionList(this.constants.map.COUNTRY.key, serverReturn);
      }),
      catchError(err => {
        this.restfulCommService.logError('Cannot retrieve country data');
        return of('error');
      })
    ).subscribe();
  }

  private fetchTicker(targetDefinition: SecurityDefinitionDTO) {
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getTickers, {req: 'GET'}).pipe(
      first(),
      tap((serverReturn: Array<string>) => {
        targetDefinition.data.prinstineFilterOptionListForExtremeLong = this.dtoService.generateSecurityDefinitionFilterOptionList(this.constants.map.TICKER.key, serverReturn);
        targetDefinition.state.isExtremeLongVariant = true;
      }),
      catchError(err => {
        this.restfulCommService.logError('Cannot retrieve country data');
        return of('error');
      })
    ).subscribe();
  }

  private updateExtremeLongCount(targetDefinition: SecurityDefinitionDTO, count: number) {
    this.configuratorData.state.showFiltersFromDefinitionExtremeLongCount = count;
    this.configuratorData.state.showFiltersFromDefinitionExtremeLongCountPromptText = `There are <kbd>${count}</kbd> ${targetDefinition.data.name}s, use search to filter it down to less than 200 to see.`
  }

}
