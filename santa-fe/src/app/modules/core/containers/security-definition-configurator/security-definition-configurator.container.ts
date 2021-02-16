  // dependencies
    import { Component, OnInit, OnChanges, ViewEncapsulation, Input, Output, EventEmitter, isDevMode } from '@angular/core';
    import { of } from 'rxjs';
    import { tap, first, delay, catchError } from 'rxjs/operators';
    import { DTOs, Blocks, AdhocPacks } from 'Core/models/frontend';
    import { DTOService } from 'Core/services/DTOService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { BICsDataProcessingService } from 'Core/services/BICsDataProcessingService';
    import {
      ConfiguratorDefinitionLayout,
      DEFINITION_CAPPED_THRESHOLD,
      SecurityDefinitionMap,
      DEFINITION_DISPLAY_OPTION_CAPPED_THRESHOLD
    } from 'Core/constants/securityDefinitionConstants.constant';
  //

@Component({
  selector: 'security-definition-configurator',
  templateUrl: './security-definition-configurator.container.html',
  styleUrls: ['./security-definition-configurator.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SecurityDefinitionConfigurator implements OnInit, OnChanges {
  configuratorDefinitionlayout: Array<any>;
  @Input() configuratorData: DTOs.SecurityDefinitionConfiguratorDTO;
  @Input() highlightedVariant: boolean;
  @Output() clickedSearch = new EventEmitter();
  @Output() clickedApplyFilter = new EventEmitter<AdhocPacks.DefinitionConfiguratorEmitterParams>();
  lastExecutedConfiguration: DTOs.SecurityDefinitionConfiguratorDTO;
  @Output() buryConfigurator = new EventEmitter();
  @Output() boostConfigurator = new EventEmitter();
  constants = {
    map: SecurityDefinitionMap,
    cappedAmount: DEFINITION_DISPLAY_OPTION_CAPPED_THRESHOLD,
  }

  constructor(
    private dtoService: DTOService,
    private restfulCommService: RestfulCommService,
    private utilityService: UtilityService,
    private bicsDataProcessingService: BICsDataProcessingService
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
        });
      });
    }
  }

  public selectDefinitionForGrouping(targetDefinition: DTOs.SecurityDefinitionDTO) {
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

  public onClickDefinition(targetDefinition: DTOs.SecurityDefinitionDTO, hasAppliedFilter: boolean = false) {
    if (!!targetDefinition && !targetDefinition.state.isUnactivated) {
      this.clearSearchFilter(hasAppliedFilter);
      this.configuratorData.state.showFiltersFromDefinition = this.configuratorData.state.showFiltersFromDefinition === targetDefinition ? null : targetDefinition;
      if (this.configuratorData.state.showFiltersFromDefinition) {
        if (this.configuratorData.state.showFiltersFromDefinition.state.isFilterCapped) {
         this.configuratorData.state.showFiltersFromDefinition.data.displayOptionList = [];
         if (this.configuratorData.state.showFiltersFromDefinition.data.highlightSelectedOptionList.length > 0) {
          this.configuratorData.state.showFiltersFromDefinition.data.highlightSelectedOptionList.forEach((selectedOption: Blocks.SecurityDefinitionFilterBlock) => {
            this.configuratorData.state.showFiltersFromDefinition.data.displayOptionList.push(selectedOption);
          })
         }
        }
        const definitionShown = this.configuratorData.state.showFiltersFromDefinition;
        this.boostConfigurator.emit();
      } else {
        this.buryConfigurator.emit();
      }
    }
  }

  public onClickFilterOption(targetOption:Blocks.SecurityDefinitionFilterBlock) {
    const targetDefinition = this.configuratorData.state.showFiltersFromDefinition;
    targetOption.isSelected = !targetOption.isSelected;
    if (targetOption.isSelected) {
      targetDefinition.data.highlightSelectedOptionList.push(targetOption);
    } else {
      targetDefinition.data.highlightSelectedOptionList = targetDefinition.data.highlightSelectedOptionList.filter((eachFilter) => {
        return eachFilter.key !== targetOption.key;
      });
      const findExistingOptionItem = targetDefinition.data.displayOptionList.find((option: Blocks.SecurityDefinitionFilterBlock) => option.shortKey === targetOption.shortKey);
      if (!!findExistingOptionItem) {
        findExistingOptionItem.isSelected = false;
      }
    }
    let filterActive = false;
    targetDefinition.data.displayOptionList.forEach((eachOption) => {
      if (eachOption.isSelected || this.configuratorData.state.showFiltersFromDefinition.data.highlightSelectedOptionList.length > 0) {
        filterActive = true;
      }
    });
    targetDefinition.state.filterActive = filterActive;
    if (this.configuratorData.state.groupByDisabled) {
      this.configuratorData.state.canApplyFilter = this.checkFilterCanApply();
    }
  }

  public onSearchKeywordChange(newKeyword: string, hasAppliedFilter: boolean = false) {
    if (this.configuratorData.state.showFiltersFromDefinition) {
      this.configuratorData.data.filterSearchInputValue = newKeyword;
      // Checking for empty string when ticker is selected
      if (newKeyword.length >= 0) {
        if (this.configuratorData.state.showFiltersFromDefinition.state.isFilterCapped) {
          if (!hasAppliedFilter) {
            this.configuratorData.state.showFiltersFromDefinition.data.displayOptionList = newKeyword !== '' ? this.utilityService.getCustomDisplayOptionListForConfiguator(newKeyword, this.configuratorData, this.constants.cappedAmount) : [];
          }
        } else {
          this.configuratorData.state.showFiltersFromDefinition.data.displayOptionList.forEach((eachOption) => {
            if (this.utilityService.applySearchFilterForConfigurator(eachOption, newKeyword)) {
              eachOption.isFilteredOut = false;
            } else {
              eachOption.isFilteredOut = true;
            }
          })
        }
        this.configuratorData.state.showFiltersFromDefinition.data.totalMatchingResults = newKeyword !== '' ? this.configuratorData.state.showFiltersFromDefinition.data.displayOptionList.length : 0;
      } else {
        this.configuratorData.state.showFiltersFromDefinition.data.displayOptionList.forEach((eachOption) => {
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
    this.lastExecutedConfiguration = this.utilityService.deepCopy(this.configuratorData);
    this.configuratorData.state.groupByDisabled && this.onClickDefinition(this.configuratorData.state.showFiltersFromDefinition, true);
    const params = this.utilityService.packDefinitionConfiguratorEmitterParams(this.configuratorData);
    this.bicsDataProcessingService.convertSecurityDefinitionConfiguratorBICSOptionsEmitterParamsToCode(params);
    this.clickedApplyFilter.emit(params);
    this.configuratorData.state.canApplyFilter = false;
  }

  public onClickConsolidatedBICSDiveIn(targetOption: Blocks.SecurityDefinitionFilterBlock) {
    const consolidatedBICSDefinition = this.configuratorData.state.showFiltersFromDefinition;
    if (!!consolidatedBICSDefinition) {
      consolidatedBICSDefinition.state.currentFilterPathInConsolidatedBICS.push(targetOption.shortKey);
      const level = consolidatedBICSDefinition.state.currentFilterPathInConsolidatedBICS.length+1;
      const newList = this.bicsDataProcessingService.getSubLevelList(targetOption.shortKey, level-1);
      consolidatedBICSDefinition.data.displayOptionList = this.dtoService.generateSecurityDefinitionFilterOptionList(consolidatedBICSDefinition.data.key, newList, level);
      consolidatedBICSDefinition.data.displayOptionList.forEach((eachOption) => {
        const existInSelected = consolidatedBICSDefinition.data.highlightSelectedOptionList.find((eachSelectedOption) => {
          return eachOption.key === eachSelectedOption.key;
        });
        eachOption.isSelected = !!existInSelected;
      });
    }
  }

  public onClickConsolidatedBICSDiveOut(targetLevelText: string, index: number) {
    const consolidatedBICSDefinition = this.configuratorData.state.showFiltersFromDefinition;
    if (!!consolidatedBICSDefinition) {
      consolidatedBICSDefinition.state.currentFilterPathInConsolidatedBICS = consolidatedBICSDefinition.state.currentFilterPathInConsolidatedBICS.slice(0, index);
      const newLevel = consolidatedBICSDefinition.state.currentFilterPathInConsolidatedBICS.length+1;
      let newList = [];
      if (newLevel > 1) {
        newList = this.bicsDataProcessingService.getSubLevelList(
          consolidatedBICSDefinition.state.currentFilterPathInConsolidatedBICS[consolidatedBICSDefinition.state.currentFilterPathInConsolidatedBICS.length-1],
          newLevel-1
        );
      } else {
        newList = this.bicsDataProcessingService.returnAllBICSBasedOnHierarchyDepth(
          newLevel
        );
      }
      consolidatedBICSDefinition.data.displayOptionList = this.dtoService.generateSecurityDefinitionFilterOptionList(consolidatedBICSDefinition.data.key, newList, newLevel);
      consolidatedBICSDefinition.data.displayOptionList.forEach((eachOption) => {
        const existInSelected = consolidatedBICSDefinition.data.highlightSelectedOptionList.find((eachSelectedOption) => {
          return eachOption.key === eachSelectedOption.key;
        });
        eachOption.isSelected = !!existInSelected;
      });
    }
  }

  private clearSearchFilter(hasAppliedFilter: boolean) {
    this.configuratorData.data.filterSearchInputValue = '';
    this.onSearchKeywordChange('', hasAppliedFilter);
  }

  private clearDefinitionFilterOptions(targetDefinition: DTOs.SecurityDefinitionDTO) {
    targetDefinition.data.displayOptionList.forEach((eachOption) => {
      eachOption.isSelected = false;
    });
    targetDefinition.state.filterActive = false;
  }

  private checkFilterCanApply(): boolean {
    let canApply = false;
    this.configuratorData.data.definitionList.forEach((eachDefinitionBundle, bundleIndex) => {
      eachDefinitionBundle.data.list.forEach((eachDefinition, definitionIndex) => {
        const activeFilters = eachDefinition.state.isBICSVariant || eachDefinition.state.isFilterCapped ? eachDefinition.data.highlightSelectedOptionList.filter((eachOption) => {
          return eachOption.isSelected;
        }) : eachDefinition.data.displayOptionList.filter((eachOption) => {
          return eachOption.isSelected;
        })
        let previousListForCompare: Array<Blocks.SecurityDefinitionFilterBlock>;
        if (eachDefinition.state.isFilterCapped) {
          previousListForCompare = this.configuratorData.state.showFiltersFromDefinition.data.highlightSelectedOptionList.length > 0 ? this.lastExecutedConfiguration.data.definitionList[bundleIndex].data.list[definitionIndex].data.highlightSelectedOptionList : this.lastExecutedConfiguration.data.definitionList[bundleIndex].data.list[definitionIndex].data.prinstineFilterOptionList;
        } else {
          previousListForCompare = eachDefinition.state.isBICSVariant ? this.lastExecutedConfiguration.data.definitionList[bundleIndex].data.list[definitionIndex].data.highlightSelectedOptionList : this.lastExecutedConfiguration.data.definitionList[bundleIndex].data.list[definitionIndex].data.displayOptionList;
        }
        const prevActiveFilters = !eachDefinition.state.isFilterCapped ? previousListForCompare.filter((eachOption) => eachOption.isSelected ) : previousListForCompare;
        if (activeFilters.length === prevActiveFilters.length) {
          activeFilters.forEach((activeFilter: Blocks.SecurityDefinitionFilterBlock) => {
            const match = prevActiveFilters.find((prevFilter: Blocks.SecurityDefinitionFilterBlock) => activeFilter.key === prevFilter.key);
            if (!match) {
              canApply = true
            }
          })
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

  private fetchCountryCode(targetDefinition: DTOs.SecurityDefinitionDTO) {
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getCountries, {req: 'GET'}).pipe(
      first(),
      tap((serverReturn: Array<string>) => {
        this.dtoService.loadSecurityDefinitionOptions(targetDefinition, serverReturn);
      }),
      catchError(err => {
        this.restfulCommService.logError('Cannot retrieve country data');
        return of('error');
      })
    ).subscribe();
  }

  private fetchTicker(targetDefinition: DTOs.SecurityDefinitionDTO) {
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getTickers, {req: 'GET'}).pipe(
      first(),
      tap((serverReturn: Array<string>) => {
        this.dtoService.loadSecurityDefinitionOptions(targetDefinition, serverReturn);
        targetDefinition.state.isFilterCapped = this.checkIfDefinitionFilterOptionListIsCapped(targetDefinition);
      }),
      catchError(err => {
        this.restfulCommService.logError('Cannot retrieve country data');
        return of('error');
      })
    ).subscribe();
  }

  private checkIfDefinitionFilterOptionListIsCapped(targetDefinition: DTOs.SecurityDefinitionDTO): boolean {
    return !!targetDefinition.data.prinstineFilterOptionList ? targetDefinition.data.prinstineFilterOptionList.length > DEFINITION_CAPPED_THRESHOLD : false;
  }

}
