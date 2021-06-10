  // dependencies
    import { Component, OnInit, OnChanges, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
    import { of } from 'rxjs';
    import { tap, first, catchError } from 'rxjs/operators';
    import { DTOs, Blocks, AdhocPacks } from 'Core/models/frontend';
    import { DTOService } from 'Core/services/DTOService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { BICSDataProcessingService } from 'App/modules/core/services/BICSDataProcessingService';
    import * as globalConstants from 'Core/constants';
    import { BICSDictionaryLookupService } from 'Core/services/BICSDictionaryLookupService';
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
  constants = globalConstants;

  constructor(
    private dtoService: DTOService,
    private restfulCommService: RestfulCommService,
    private utilityService: UtilityService,
    private bicsDataProcessingService: BICSDataProcessingService,
    private bicsDictionaryLookupService: BICSDictionaryLookupService
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
      if (!this.lastExecutedConfiguration) {
        // no last executed config means it is being initialized for the first time
        this.configuratorData.data.definitionList.forEach((eachBundle) => {
          eachBundle.data.list.forEach((eachDefinition) => {
            if (eachDefinition.data.key === this.constants.definition.SecurityDefinitionMap.COUNTRY.key) {
              this.fetchCountryCode(eachDefinition);
            }
            if (eachDefinition.data.key === this.constants.definition.SecurityDefinitionMap.TICKER.key) {
              this.fetchTicker(eachDefinition);
            }
          });
        });
      }
      this.lastExecutedConfiguration = this.utilityService.deepCopy(this.configuratorData);
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
      if (this.configuratorData.state.showFiltersFromDefinition !== targetDefinition) {
        if (targetDefinition.state.isFilterCapped) {
         targetDefinition.data.displayOptionList = [];
         if (targetDefinition.data.highlightSelectedOptionList.length > 0) {
          targetDefinition.data.highlightSelectedOptionList.forEach((selectedOption: Blocks.SecurityDefinitionFilterBlock) => {
            targetDefinition.data.displayOptionList.push(selectedOption);
          })
         }
        } else {
          if (targetDefinition.data.highlightSelectedOptionList.length > 0) {
            targetDefinition.data.highlightSelectedOptionList.forEach((eachSelectedOption) => {
              const existInDisplay = targetDefinition.data.displayOptionList.find((eachDisplayOption) => {
                return eachDisplayOption.key === eachSelectedOption.key;
              });
              if (!!existInDisplay) {
                existInDisplay.isSelected = true;
              }
            });
          }
        }
        this.configuratorData.state.showFiltersFromDefinition = targetDefinition;
        this.boostConfigurator.emit();
      } else {
        this.configuratorData.state.showFiltersFromDefinition = null;
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
    if (targetDefinition.data.configuratorCoreDefinitionGroup === this.constants.definition.SecurityDefinitionConfiguratorGroupLabels.selected) {
      this.utilityService.syncDefinitionStateBetweenSelectedAndCore(this.configuratorData, targetDefinition, true);
    }
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
            this.configuratorData.state.showFiltersFromDefinition.data.displayOptionList = newKeyword !== '' ? this.utilityService.getCustomDisplayOptionListForConfiguator(newKeyword, this.configuratorData, this.constants.definition.DEFINITION_DISPLAY_OPTION_CAPPED_THRESHOLD) : [];
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
    // Prevents selected group from having no definitions
    this.checkAndApplyChangesToEmptySelectedGroup();
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
      const targetCode = this.bicsDictionaryLookupService.BICSNameToBICSCode(targetOption.shortKey, targetOption.bicsLevel);
      const newList = this.bicsDictionaryLookupService.getSubLevelCategoryNames(targetCode);
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
        const parentLevelCode = this.bicsDictionaryLookupService.BICSNameToBICSCode(consolidatedBICSDefinition.state.currentFilterPathInConsolidatedBICS[consolidatedBICSDefinition.state.currentFilterPathInConsolidatedBICS.length-1], newLevel-1);
        newList = this.bicsDictionaryLookupService.getSubLevelCategoryNames(parentLevelCode);
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

  public clearAllSelectedOptions(targetDefinition: DTOs.SecurityDefinitionDTO) {
    this.utilityService.clearSelectedOptionsFromDefinition(targetDefinition, this.configuratorData);
    if (this.configuratorData.state.groupByDisabled) {
      this.configuratorData.state.canApplyFilter = this.checkFilterCanApply();
    }
  }

  private clearSearchFilter(hasAppliedFilter: boolean) {
    this.configuratorData.data.filterSearchInputValue = '';
    this.onSearchKeywordChange('', hasAppliedFilter);
  }

  private checkFilterCanApply(): boolean {
    let canApply = false;
    const parsedLastExecueted = this.lastExecutedConfiguration.data.definitionList.filter((definitionBundle: DTOs.SecurityDefinitionBundleDTO) => definitionBundle.data.label !== this.constants.definition.SecurityDefinitionConfiguratorGroupLabels.selected);
    const parsedCurrentConfiguration = this.configuratorData.data.definitionList.filter((definitionBundle: DTOs.SecurityDefinitionBundleDTO) => definitionBundle.data.label !== this.constants.definition.SecurityDefinitionConfiguratorGroupLabels.selected);
    const prevCompareCopy = this.utilityService.deepCopy(this.lastExecutedConfiguration);
    const currentCompareCopy = this.utilityService.deepCopy(this.configuratorData);
    prevCompareCopy.data.definitionList = parsedLastExecueted;
    currentCompareCopy.data.definitionList = parsedCurrentConfiguration;
    currentCompareCopy.data.definitionList.forEach((eachDefinitionBundle, bundleIndex) => {
      eachDefinitionBundle.data.list.forEach((eachDefinition, definitionIndex) => {
        const activeFilters = eachDefinition.state.isConsolidatedBICSVariant || eachDefinition.state.isFilterCapped ? eachDefinition.data.highlightSelectedOptionList.filter((eachOption) => {
          return eachOption.isSelected;
        }) : eachDefinition.data.displayOptionList.filter((eachOption) => {
          return eachOption.isSelected;
        })
        let previousListForCompare: Array<Blocks.SecurityDefinitionFilterBlock>;
        if (eachDefinition.state.isFilterCapped) {
          previousListForCompare = prevCompareCopy.data.definitionList[bundleIndex].data.list[definitionIndex].data.highlightSelectedOptionList;
        } else {
          previousListForCompare = eachDefinition.state.isConsolidatedBICSVariant ? prevCompareCopy.data.definitionList[bundleIndex].data.list[definitionIndex].data.highlightSelectedOptionList : prevCompareCopy.data.definitionList[bundleIndex].data.list[definitionIndex].data.displayOptionList;
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
    return !!targetDefinition.data.prinstineFilterOptionList ? targetDefinition.data.prinstineFilterOptionList.length > this.constants.definition.DEFINITION_CAPPED_THRESHOLD : false;
  }

  private checkAndApplyChangesToEmptySelectedGroup() {
    // If no changes were made in the other definitions and everything in the configurator is unselected, then apply Quoted Today definition to be in selected group
    const selectedDefinitionBundle = this.utilityService.getDefinitionBundleFromConfigurator(this.configuratorData, this.constants.definition.SecurityDefinitionConfiguratorGroupLabels.selected);
    if (selectedDefinitionBundle.data.list.length === 0) {
      // check if user clears everything in selected group, but makes changes within the definitions in the core groups 
      let isUpdatedDefinitionExists = false;
      this.configuratorData.data.definitionList.forEach((definitionBundle: DTOs.SecurityDefinitionBundleDTO) => {
        if (definitionBundle.data.label !== this.constants.definition.SecurityDefinitionConfiguratorGroupLabels.selected && !isUpdatedDefinitionExists) {
          definitionBundle.data.list.forEach((definition: DTOs.SecurityDefinitionDTO) => {
            if (definition.data.highlightSelectedOptionList.length > 0 && !isUpdatedDefinitionExists) {
              isUpdatedDefinitionExists = true;
            }
          })
        }
      })
      if (!isUpdatedDefinitionExists) {
        const quotedTodayDefinition = this.utilityService.getDefinitionFromDefinitionBundle(this.configuratorData, this.constants.definition.SecurityDefinitionConfiguratorGroupLabels.standard, this.constants.definition.SecurityDefinitionMap.QUOTED_TODAY.key);
        const activeOption = quotedTodayDefinition.data.displayOptionList.find((option: Blocks.SecurityDefinitionFilterBlock) => option.shortKey === 'Y');
        quotedTodayDefinition.data.highlightSelectedOptionList.push(activeOption);
        activeOption.isSelected = true;
      }
    }
  }
}
