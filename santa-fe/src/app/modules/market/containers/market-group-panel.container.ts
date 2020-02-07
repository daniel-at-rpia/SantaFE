  // dependencies
    import {
      Component,
      ViewEncapsulation,
      OnDestroy
    } from '@angular/core';
    import { Observable, Subscription } from 'rxjs';
    import {
      interval,
      from,
      of
    } from 'rxjs';
    import {
      tap,
      first,
      combineLatest,
      buffer,
      bufferTime,
      throttleTime,
      delay,
      concatMap,
      catchError
    } from 'rxjs/operators';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';

    import { MarketGroupPanelState } from 'FEModels/frontend-page-states.interface';
    import { SecurityGroupMetricBlock } from 'FEModels/frontend-blocks.interface';
    import {
      SecurityGroupDTO,
      SecurityDefinitionDTO,
      SecurityDefinitionConfiguratorDTO,
      SearchShortcutDTO
    } from 'FEModels/frontend-models.interface';
    import { BESecurityGroupDTO } from 'BEModels/backend-models.interface';
    import { PayloadGetSantaGroups } from 'BEModels/backend-payloads.interface';

    import { SecurityGroupList } from 'Core/stubs/securityGroups.stub';
    import { SecurityDefinitionStub } from 'FEModels/frontend-stub-models.interface';
    import {
      PieChartConfiguratorOptions,
      MetricRenderDelay,
      SearchShortcuts
    } from 'Core/constants/marketConstants.constant';
    import {  
      SecurityDefinitionMap
    } from 'Core/constants/securityDefinitionConstants.constant';
  //

@Component({
  selector: 'market-group-panel',
  templateUrl: './market-group-panel.container.html',
  styleUrls: ['./market-group-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class MarketGroupPanel implements OnDestroy {
  state: MarketGroupPanelState;
  searchServerReturn$: Observable<SecurityGroupDTO>;
  searchServerReturnPackedInChunk$: Observable<Array<SecurityGroupDTO>>;
  getGroupsFromSearchSub: Subscription;
  PieChartConfigurationOptions = PieChartConfiguratorOptions;
  constants = {
    securityGroupDefinitionMap: SecurityDefinitionMap,
    searchShortcuts: SearchShortcuts
  }

  private initiateComponentState(){
    this.state = {
      powerModeActivated: false,
      landscapeViewActivated: false,
      isConfiguratorCollapsed: false,
      isGroupDataLoaded: false,
      configurator: {
        dto: this.dtoService.createSecurityDefinitionConfigurator(false),
        showSelectedGroupConfig: false,
        cachedOriginalConfig: null,
        shortcutList: [],
        selectedShortcut: null
      },
      utility: {
        selectedWidget: 'AVERAGE_VISUALIZER',
        visualizer: this.dtoService.formAverageVisualizerObject(),
        pieConfigurator: {
          left: {
            selected: false,
            options: [],
            displayText: '',
            activeMetric: null
          },
          right: {
            selected: false,
            options: [],
            displayText: '',
            activeMetric: null
          }
        }
      },
      searchResult: {
        securityGroupList: [],
        renderProgress: 0,
        searchFailed: false,
        searchFailedError: ''
      }
    };
    this.state.utility.pieConfigurator.left.options = this.PieChartConfigurationOptions.left.map((eachOption) => {
      const targetDefinition = this.constants.securityGroupDefinitionMap[eachOption];
      return targetDefinition;
    });
    this.state.utility.pieConfigurator.right.options = this.PieChartConfigurationOptions.right.map((eachOption) => {
      const targetDefinition = this.constants.securityGroupDefinitionMap[eachOption];
      return targetDefinition;
    });
    this.onSelectPieConfiguratorMetric(this.state.utility.pieConfigurator.left, this.state.utility.pieConfigurator.left.options[5]);
    this.onSelectPieConfiguratorMetric(this.state.utility.pieConfigurator.right, this.state.utility.pieConfigurator.right.options[2]);
    this.populateSearchShortcuts();
  }

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ){
    this.initiateComponentState();
  }

  ngOnDestroy(){
    this.getGroupsFromSearchSub.unsubscribe();
  }

  public switchMode() {
    this.state.powerModeActivated = !this.state.powerModeActivated;
    if (this.state.powerModeActivated) {
      if (this.state.configurator.selectedShortcut) {
        this.onClearConfig();
        this.state.configurator.dto = this.utilityService.applyShortcutToConfigurator(this.state.configurator.selectedShortcut, this.state.configurator.dto);
      }
      this.toggleLandscapeView(true, false);
    }
  }

  public toggleLandscapeView(overwrite?: boolean, overwriteValue?: boolean) {
    if (overwrite || !this.state.powerModeActivated) {
      this.state.landscapeViewActivated = overwrite ? overwriteValue : !this.state.landscapeViewActivated;
      this.state.searchResult.securityGroupList.forEach((eachGroup) => {
        eachGroup.state.isLandscapeView = this.state.landscapeViewActivated;
      });
    }
  }

  public onClickSearchShortcut(targetShortcut: SearchShortcutDTO){
    if (this.state.configurator.selectedShortcut && this.state.configurator.selectedShortcut !== targetShortcut) {
      this.state.configurator.selectedShortcut.state.isSelected = false;
    }
    targetShortcut.state.isSelected = !targetShortcut.state.isSelected;
    this.state.configurator.selectedShortcut = this.state.configurator.selectedShortcut === targetShortcut ? null : targetShortcut;
    if (this.state.configurator.selectedShortcut) {
      this.state.configurator.shortcutList.forEach((eachShortcut) => {
        eachShortcut.state.isUserInputBlocked = true;
      });
      this.startSearch(this.state.configurator.selectedShortcut.data.configuration);
    } else {
      this.state.searchResult.securityGroupList = [];
      this.state.isGroupDataLoaded = false;
      this.state.utility.visualizer.state.isEmpty = true;
    }
  }

  public onClickSearchInConfigurator(){
    this.startSearch(this.utilityService.flattenDefinitionList(this.state.configurator.dto));
  }

  public onToggleCollapseConfigurator(){
    this.state.isConfiguratorCollapsed = !this.state.isConfiguratorCollapsed;
    this.state.utility.visualizer.state.isExpanded = this.state.isConfiguratorCollapsed;
    this.state.searchResult.securityGroupList.forEach((eachGroup) => {
      eachGroup.state.isExpanded = this.state.isConfiguratorCollapsed;
    })
  }

  public onSwitchWidget(targetWidgetName){
    this.state.utility.selectedWidget = targetWidgetName;
  }

  public onClickPieConfigurator(targetPieConfigurator){
    targetPieConfigurator.selected = !targetPieConfigurator.selected;
  }

  public onSelectPieConfiguratorMetric(targetPieConfigurator, targetMetric: SecurityDefinitionStub){
    targetPieConfigurator.activeMetric = targetMetric;
    targetPieConfigurator.displayText = targetMetric.displayName;
  }

  public updateGroupStats(){
    this.initializeGroupStats();
    this.calculateGroupAverage(this.state.searchResult.securityGroupList.length);
    this.updateSort();
  }

  public updateSort(){
    if (this.state.searchResult.securityGroupList.length > 0) {
      let primarySortIndex, secondarySortIndex, tertiarySortIndex;
      const indexRetrieveTarget = this.state.searchResult.securityGroupList[0];
      indexRetrieveTarget.data.stats.forEach((eachStat, index) => {
        const matchedMetricFromVisualizer = this.state.utility.visualizer.data.stats.find((eachVisualizerStat) => {
          return eachVisualizerStat.label === eachStat.label && eachVisualizerStat.deltaScope === eachStat.deltaScope;
        });
        if (matchedMetricFromVisualizer.sortHierarchy === 1) {
          primarySortIndex = index;
        } else if (matchedMetricFromVisualizer.sortHierarchy === 2) {
          secondarySortIndex = index;
        } else if (matchedMetricFromVisualizer.sortHierarchy === 3) {
          tertiarySortIndex = index;
        }
      });
      this.updateSortData(primarySortIndex, secondarySortIndex, tertiarySortIndex);
      if (primarySortIndex >= 0) {
        // if there is at least a primarySortIndex, then it's worth to sort
        this.performSort();
      } else {
        this.performDefaultSort();
        // default sorting algorithm
      }
    }
  }

  public onSecurityGroupSelected(targetGroup: SecurityGroupDTO){
    const selectedGroupList = [];
    this.state.searchResult.securityGroupList.forEach((eachGroup) => {
      eachGroup.state.isSelected && selectedGroupList.push(eachGroup);
    });
    if (selectedGroupList.length > 0) {
      this.updateConfigurator(selectedGroupList);
    } else {
      this.onRestoreConfig();
    }
  }

  public onRestoreConfig(){
    const cacheState = this.utilityService.deepCopy(this.state.configurator.dto.state);
    this.state.configurator.dto = this.utilityService.deepCopy(this.state.configurator.cachedOriginalConfig);
    this.state.configurator.dto.state = cacheState;
    this.state.configurator.dto.state.showFiltersFromDefinition
    this.state.configurator.cachedOriginalConfig = null;
    this.state.configurator.showSelectedGroupConfig = false;
  }

  public onClearConfig(){
    this.state.configurator.dto = this.dtoService.createSecurityDefinitionConfigurator(false);
  }

  private populateSearchShortcuts(){
    this.constants.searchShortcuts.forEach((eachShortcutStub) => {
      const definitionList = eachShortcutStub.includedDefinitions.map((eachIncludedDef) => {
        const definitionDTO = this.dtoService.formSecurityDefinitionObject(this.constants.securityGroupDefinitionMap[eachIncludedDef.definitionKey]);
        definitionDTO.state.groupByActive = !!eachIncludedDef.groupByActive;
        if (eachIncludedDef.selectedOptions.length > 0) {
          definitionDTO.state.filterActive = true;
          definitionDTO.data.filterOptionList.forEach((eachFilterOption) => {
            if (eachIncludedDef.selectedOptions.indexOf(eachFilterOption.shortKey) >= 0) {
              eachFilterOption.isSelected = true;
            }
          });
        }
        return definitionDTO;
      });
      this.state.configurator.shortcutList.push(this.dtoService.formSearchShortcutObject(definitionList, eachShortcutStub.displayTitle, true, !!eachShortcutStub.isMajor));
    });
  }

  private startSearch(definitionList: Array<SecurityDefinitionDTO>){
    this.state.configurator.cachedOriginalConfig = null;
    this.state.configurator.showSelectedGroupConfig = false;
    this.state.isGroupDataLoaded = false;
    this.state.utility.visualizer.state.isEmpty = false;
    this.state.utility.visualizer.state.isStencil = true;
    this.state.searchResult.searchFailed = false;
    this.state.searchResult.renderProgress = 0;
    const payload = this.formSearchPayload(definitionList);
    this.performSearch(payload);
  }

  private formSearchPayload(definitionList: Array<SecurityDefinitionDTO>): PayloadGetSantaGroups{
    const payload: PayloadGetSantaGroups = {
      source: "Default",
      groupDefinition: {},
      groupFilters: {}
    };
    definitionList.forEach((eachDefinition) => {
      if (eachDefinition.state.groupByActive || eachDefinition.state.isLocked) {
        const attributeName = this.utilityService.convertFEKey(eachDefinition.data.key);
        if (attributeName !== 'n/a') {
          payload.groupDefinition[attributeName] = [];
        }
      }
      if (eachDefinition.state.filterActive) {
        const attributeName = this.utilityService.convertFEKey(eachDefinition.data.key);
        if (attributeName !== 'n/a') {
          payload.groupFilters[attributeName] = [];
          eachDefinition.data.filterOptionList.forEach((eachOption) => {
            if (eachOption.isSelected) {
              payload.groupFilters[attributeName].push(eachOption.displayLabel);
            }
          });
        }
      }
    });
    return payload;
  }

  private performSearch(payload: PayloadGetSantaGroups){
    this.state.searchResult.securityGroupList = [this.dtoService.formSecurityGroupObject(null), this.dtoService.formSecurityGroupObject(null), this.dtoService.formSecurityGroupObject(null)];
    this.initializeGroupStats();
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.getGroups, {req: 'POST'}, payload, true).pipe(
      first(),
      tap((serverReturn) => {
        console.log('return is ', serverReturn);
        //this.loadSearchResults(serverReturn);
        this.loadSimpleSearchResults(serverReturn);
      }),
      catchError(err => {
        console.log('error', err);
        this.state.searchResult.searchFailed = true;
        this.state.searchResult.searchFailedError = err.message;
        this.searchComplete();
        return of('error');
      })
    ).subscribe();
  }

  private loadSimpleSearchResults(serverReturn){
    if (!!serverReturn) {
      this.state.searchResult.securityGroupList = serverReturn.map((eachRawGroup) => {
        const newGroupDTO = this.dtoService.formSecurityGroupObject(eachRawGroup);
        newGroupDTO.state.isLandscapeView = this.state.landscapeViewActivated;
        return newGroupDTO;
      });
    } else {
      this.state.searchResult.securityGroupList = [];
    }
    this.state.searchResult.renderProgress = 100;
    this.initializeGroupStats();
    this.updateSort();
    setTimeout(this.searchComplete.bind(this), MetricRenderDelay);
  }

  // private loadSearchResults(serverReturn){
    //   this.state.searchResult.securityGroupList = serverReturn.map((eachStub) => {
    //     return this.dtoService.formSecurityGroupObject(eachStub, false);
    //   });
    //   this.initializeGroupStats();
    //   this.updateSort();

    //   this.searchServerReturn$ = from(this.state.searchResult.securityGroupList).pipe(
    //     concatMap(item => of(item).pipe(delay(150)))
    //   );
    //   this.searchServerReturnPackedInChunk$ = this.searchServerReturn$.pipe(
    //     bufferTime(1000)
    //   );
    //   let fullyLoadedCount = 0;
      
    //   this.getGroupsFromSearchSub = this.searchServerReturnPackedInChunk$.pipe(
    //     //delay(2000),  // this delay is to simulate the delay from server
    //     tap((arrayOfGroups:Array<SecurityGroupDTO>) => {
    //       console.log('received', arrayOfGroups);
    //       arrayOfGroups.forEach((eachGroup) => {
    //         // when sort is already active before the search, the index of the rawData is likely not gonna be the same as the index of the DTOs, therefore need to do "find"
    //         let rawData;
    //         if (this.state.utility.visualizer.data.stats[0].sortHierarchy > 0 || this.state.utility.visualizer.data.stats[1].sortHierarchy > 0 || this.state.utility.visualizer.data.stats[2].sortHierarchy > 0) {
    //           rawData = serverReturn.find((eachRawGroup) => {
    //             return eachRawGroup.name === eachGroup.data.name;
    //           });
    //         } else {
    //           rawData = serverReturn[fullyLoadedCount];
    //         }
    //         this.dtoService.updateSecurityGroupWithPieCharts(rawData, eachGroup);
    //         fullyLoadedCount++;
    //       });
    //       this.state.searchResult.renderProgress = Math.round(fullyLoadedCount/serverReturn.length*100);
    //       if (fullyLoadedCount === serverReturn.length) {
    //         this.searchComplete();
    //       }
    //     })
    //   ).subscribe();
  // }

  private searchComplete(){
    if (this.state.configurator.selectedShortcut) {
      this.state.configurator.shortcutList.forEach((eachShortcut) => {
        eachShortcut.state.isUserInputBlocked = false;
      });
    }
    if (this.state.searchResult.securityGroupList.length > 0) {
      this.calculateGroupAverage(this.state.searchResult.securityGroupList.length);
    }
    this.state.searchResult.securityGroupList.forEach((eachGroup) => {
      eachGroup.state.isMetricCompleted = true;
    });
    this.state.utility.visualizer.state.isStencil = false;
    this.state.configurator.dto.state.isLoading = false;
    this.state.isGroupDataLoaded = true;
    !!this.getGroupsFromSearchSub && this.getGroupsFromSearchSub.unsubscribe();
  }

  private initializeGroupStats(){
    this.state.utility.visualizer.data.stats.forEach((eachStat) => {
      eachStat.value = 0;
      eachStat.percentage = 75;
    });
    this.state.searchResult.securityGroupList.forEach((eachGroup) => {
      eachGroup.data.stats = [];
      this.initializeStatForGroup(eachGroup);
    });
  }

  private initializeStatForGroup(targetGroup: SecurityGroupDTO){
    this.state.utility.visualizer.data.stats.forEach((eachStat, index) => {
      if (!eachStat.isEmpty) {
        const newStat:SecurityGroupMetricBlock = {
          isEmpty: eachStat.isEmpty,
          sortHierarchy: eachStat.sortHierarchy > 0 ? eachStat.sortHierarchy : null,
          deltaScope: eachStat.deltaScope,
          label: eachStat.label,
          value: this.utilityService.retrieveGroupMetricValue(eachStat, targetGroup),
          absMax: null,
          percentage: null
        };
        targetGroup.data.stats.push(newStat);
      }
    });
  }

  private calculateGroupAverage(respectiveLength: number){
    this.state.utility.visualizer.data.stats.forEach((eachStat, statIndex) => {
      if (!eachStat.isEmpty) {
        let sum = 0;
        let absMax = 0;
        this.state.searchResult.securityGroupList.forEach((eachGroup) => {
          const targetStat = eachGroup.data.stats.find((eachGroupStat) => {
            return eachGroupStat.label === eachStat.label && eachGroupStat.deltaScope === eachStat.deltaScope;
          });
          if (!!targetStat) {
            sum = sum + targetStat.value;
            if (absMax < Math.abs(targetStat.value)) {
              absMax = Math.abs(targetStat.value);
            }
          }
        });
        let average = !!eachStat.deltaScope ? Math.round(sum / respectiveLength * 10)/10 : Math.round(sum / respectiveLength);
        eachStat.absMax = absMax;
        eachStat.value = average;
        eachStat.percentage = Math.round(Math.sqrt(Math.abs(average))/Math.sqrt(absMax) * 100);
        this.state.searchResult.securityGroupList.forEach((eachGroup) => {
          const targetStat = eachGroup.data.stats.find((eachGroupStat) => {
            return eachGroupStat.label === eachStat.label && eachGroupStat.deltaScope === eachStat.deltaScope;
          });
          if (!!targetStat) {
            targetStat.absMax = absMax;
            targetStat.percentage = Math.round(Math.sqrt(Math.abs(targetStat.value))/Math.sqrt(targetStat.absMax) * 100);
          }
        });
      }
    });
  }

  private updateSortData(primarySortIndex: number, secondarySortIndex: number, tertiarySortIndex: number){
    this.state.searchResult.securityGroupList.forEach((eachGroup) => {
      eachGroup.data.stats.forEach((eachStat) => {
        eachStat.sortHierarchy = null;
      });
      if (primarySortIndex >= 0 && primarySortIndex <= 2) {
        eachGroup.data.sort.primarySortMetricValue = eachGroup.data.stats[primarySortIndex].value;
        eachGroup.data.stats[primarySortIndex].sortHierarchy = 1;
      }
      if (secondarySortIndex >= 0 && secondarySortIndex <= 2) {
        eachGroup.data.sort.secondarySortMetricValue = eachGroup.data.stats[secondarySortIndex].value;
        eachGroup.data.stats[secondarySortIndex].sortHierarchy = 2;
      }
      if (tertiarySortIndex >= 0 && tertiarySortIndex <= 2) {
        eachGroup.data.sort.tertiarySortMetricValue = eachGroup.data.stats[tertiarySortIndex].value;
        eachGroup.data.stats[tertiarySortIndex].sortHierarchy = 3;
      }
    });
  }

  private performSort(){
    this.state.searchResult.securityGroupList.sort((groupA, groupB) => {
      if (groupA.data.sort.primarySortMetricValue < groupB.data.sort.primarySortMetricValue) {
        return 9;
      } else if(groupA.data.sort.primarySortMetricValue > groupB.data.sort.primarySortMetricValue){
        return -9;
      } else if (groupA.data.sort.secondarySortMetricValue < groupB.data.sort.secondarySortMetricValue) {
        return 4;
      } else if (groupA.data.sort.secondarySortMetricValue > groupB.data.sort.secondarySortMetricValue) {
        return -4;
      } else if (groupA.data.sort.tertiarySortMetricValue < groupB.data.sort.tertiarySortMetricValue) {
        return 1;
      } else if (groupA.data.sort.tertiarySortMetricValue > groupB.data.sort.tertiarySortMetricValue) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  private performDefaultSort(){
    this.state.searchResult.securityGroupList.sort((groupA, groupB) => {
      if (groupA.data.numOfSecurities < groupB.data.numOfSecurities) {
        return 1;
      } else if (groupA.data.numOfSecurities > groupB.data.numOfSecurities) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  private updateConfigurator(selectedGroupList: Array<SecurityGroupDTO>){
    if (!this.state.configurator.cachedOriginalConfig) {
      this.state.configurator.cachedOriginalConfig = this.utilityService.deepCopy(this.state.configurator.dto);
    }
    const newConfig = this.dtoService.createSecurityDefinitionConfigurator(false);
    selectedGroupList.forEach((eachGroup) => {
      this.updateConfiguratorPerGroup(eachGroup, newConfig);
    });
    this.state.configurator.dto = newConfig;
    this.state.configurator.showSelectedGroupConfig = true;
  }

  private updateConfiguratorPerGroup(targetGroup: SecurityGroupDTO, config: SecurityDefinitionConfiguratorDTO){
    for (const eachBEDefinition in targetGroup.data.definitionConfig) {
      const targetDefinition = this.utilityService.convertBEKey(eachBEDefinition);
      const targetDefinitionValue = targetGroup.data.definitionConfig[eachBEDefinition][0];
      if (!!targetDefinition) {
        config.data.definitionList.forEach((eachBundle) => {
          eachBundle.data.list.forEach((eachDefinition) => {
            if (eachDefinition.data.key === targetDefinition && !eachDefinition.state.isLocked) {
              eachDefinition.state.groupByActive = true;
              let allFiltersAreSelected = true;
              eachDefinition.data.filterOptionList.forEach((eachFilter) => {
                if (eachDefinition.data.key === 'TENOR') {
                  if (eachFilter.shortKey === this.utilityService.convertBETenorToFE(targetDefinitionValue)) {
                    eachFilter.isSelected = true;
                    eachDefinition.state.filterActive = true;
                  }
                } else {
                  if (eachFilter.shortKey === targetDefinitionValue) {
                    eachFilter.isSelected = true;
                    eachDefinition.state.filterActive = true;
                  };
                }
                if (!eachFilter.isSelected) {
                  allFiltersAreSelected = false;
                }
              });
              if (allFiltersAreSelected) {
                eachDefinition.data.filterOptionList.forEach((eachFilter) => {
                  eachFilter.isSelected = false;
                });
                eachDefinition.state.filterActive = false;
              }
            }
          });
        })
      }
    }
  }
}