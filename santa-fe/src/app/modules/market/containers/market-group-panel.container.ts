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
import { HttpClient, HttpParams } from '@angular/common/http';

import { DTOService } from 'App/services/DTOService';
import { UtilityService } from 'App/services/UtilityService';
import { RestfulCommService } from 'App/services/RestfulCommService';

import { MarketGroupPanelState } from 'FEModels/frontend-page-states.interface';
import { SecurityGroupMetricBlock } from 'FEModels/frontend-blocks.interface';
import { SecurityGroupDTO } from 'FEModels/frontend-models.interface';
import { BESecurityGroupDTO } from 'BEModels/backend-models.interface';

import { SecurityGroupList } from 'App/stubs/securities.stub';
import { SecurityDefinitionStub } from 'App/models/frontend/frontend-stub-models.interface';
import {
  PieChartConfiguratorOptions,
  SecurityGroupDefinitionMap
} from 'App/stubs/marketModuleSpecifics.stub';

@Component({
  selector: 'market-group-panel',
  templateUrl: './market-group-panel.container.html',
  styleUrls: ['./market-group-panel.container.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MarketGroupPanel implements OnDestroy {
  state: MarketGroupPanelState;
  searchServerReturn$: Observable<SecurityGroupDTO>;
  searchServerReturnPackedInChunk$: Observable<Array<SecurityGroupDTO>>;
  getGroupsFromSearchSub: Subscription;
  PieChartConfigurationOptions = PieChartConfiguratorOptions;
  SecurityGroupDefinitionMap = SecurityGroupDefinitionMap;

  private initiateComponentState(){
    this.state = {
      configurator: this.dtoService.createSecurityGroupDefinitionConfigurator(),
      isConfiguratorCollapsed: false,
      isGroupDataLoaded: false,
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
        renderProgress: 0
      }
    };
    this.state.utility.pieConfigurator.left.options = this.PieChartConfigurationOptions.left.map((eachOption) => {
      const targetDefinition = SecurityGroupDefinitionMap.find((eachDefinition) => {
        return eachDefinition.key === eachOption;
      })
      return targetDefinition;
    });
    this.state.utility.pieConfigurator.right.options = this.PieChartConfigurationOptions.right.map((eachOption) => {
      const targetDefinition = SecurityGroupDefinitionMap.find((eachDefinition) => {
        return eachDefinition.key === eachOption;
      })
      return targetDefinition;
    });
    this.onSelectPieConfiguratorMetric(this.state.utility.pieConfigurator.left, this.state.utility.pieConfigurator.left.options[5]);
    this.onSelectPieConfiguratorMetric(this.state.utility.pieConfigurator.right, this.state.utility.pieConfigurator.right.options[2]);
    const payload = {
      "groupOptions": ["Ccy", "Tenor"],
      "yyyyMMdd": 20190920,
      "source": "FO",
      "tenorOptions": ["2Y", "3Y", "5Y", "7Y", "10Y", "30Y"]
    };
    this.restfulCommonService.callAPI('https://rpiadev01:1225/santaSecurity/get-santa-securities', {req: 'GET'}, payload).pipe(
      tap((serverReturn) => {
        console.log('return is ', serverReturn)
      }),
      catchError(err => {
        console.log('error', err);
        return of('error');
      })
    ).subscribe();
  }

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommonService: RestfulCommService
  ){
    this.initiateComponentState();
  }

  ngOnDestroy(){
    this.getGroupsFromSearchSub.unsubscribe();
  }

  public onClickSearchInConfigurator(){
    this.startSearch();
    // this.http.post<any>('https://rpiadev01:1225/santaGroup/get-santa-groups', payload, {}).pipe(
    //   tap((serverReturn) => 
    //     console.log('return is ', serverReturn)),
    //   catchError(err => {
    //     console.log('error', err);
    //     return of('error');
    //   })
    // ).subscribe();

    // this.http.options<any>('https://rpiadev01:1225/santaSecurity/get-santa-securities', {}).pipe(
    //   tap((serverReturn) => 
    //     console.log('return is ', serverReturn)),
    //   catchError(err => {
    //     console.log('error', err);
    //     return of('error');
    //   })
    // ).subscribe();
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
      } else{
        // default sorting algorithm
      }
    }
  }

  private startSearch(){
    this.state.isGroupDataLoaded = false;
    this.state.utility.visualizer.state.isEmpty = false;
    this.state.utility.visualizer.state.isStencil = true;
    this.state.searchResult.renderProgress = 0;
    this.performSearch();
  }

  private performSearch(){
    // using stubs
    const serverReturn = SecurityGroupList;

    this.state.searchResult.securityGroupList = serverReturn.map((eachStub) => {
      return this.dtoService.formSecurityGroupObject(eachStub, false);
    });
    this.initializeGroupStats();
    this.updateSort();

    this.searchServerReturn$ = from(this.state.searchResult.securityGroupList).pipe(
      concatMap(item => of(item).pipe(delay(150)))
    );
    this.searchServerReturnPackedInChunk$ = this.searchServerReturn$.pipe(
      bufferTime(1000)
    );
    let fullyLoadedCount = 0;
    
    this.getGroupsFromSearchSub = this.searchServerReturnPackedInChunk$.pipe(
      delay(2000),  // this delay is to simulate the delay from server
      tap((arrayOfGroups:Array<SecurityGroupDTO>) => {
        console.log('received', arrayOfGroups);
        arrayOfGroups.forEach((eachGroup) => {
          // when sort is already active before the search, the index of the rawData is likely not gonna be the same as the index of the DTOs, therefore need to do "find"
          let rawData;
          if (this.state.utility.visualizer.data.stats[0].sortHierarchy > 0 || this.state.utility.visualizer.data.stats[1].sortHierarchy > 0 || this.state.utility.visualizer.data.stats[2].sortHierarchy > 0) {
            rawData = serverReturn.find((eachRawGroup) => {
              return eachRawGroup.groupName === eachGroup.data.name;
            });
          } else {
            rawData = serverReturn[fullyLoadedCount];
          }
          //this.state.searchResult.securityGroupList[index];
          this.dtoService.updateSecurityGroupWithPieCharts(rawData, eachGroup);
          //this.initializeStatForGroup(targetGroupCard);
          fullyLoadedCount++;
        });
        this.state.searchResult.renderProgress = Math.round(fullyLoadedCount/SecurityGroupList.length*100);
        if (fullyLoadedCount === SecurityGroupList.length) {
          this.searchComplete();
        }
      })
    ).subscribe();
  }

  private searchComplete(){
    this.state.searchResult.securityGroupList.forEach((eachGroup) => {
      eachGroup.state.averageCalculationComplete = true;
    });
    this.calculateGroupAverage(this.state.searchResult.securityGroupList.length);
    this.state.utility.visualizer.state.isStencil = false;
    this.state.configurator.state.isLoading = false;
    this.state.isGroupDataLoaded = true;
    this.getGroupsFromSearchSub.unsubscribe();
  }

  private initializeGroupStats(){
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
          max: null,
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
        let max = 0;
        this.state.searchResult.securityGroupList.forEach((eachGroup) => {
          const targetStat = eachGroup.data.stats.find((eachGroupStat) => {
            return eachGroupStat.label === eachStat.label && eachGroupStat.deltaScope === eachStat.deltaScope;
          });
          if (!!targetStat) {
            sum = sum + targetStat.value;
            if (max < targetStat.value) {
              max = targetStat.value;
            }
          }
        });
        let average = !!eachStat.deltaScope ? Math.round(sum / respectiveLength * 10000)/10000 : Math.round(sum / respectiveLength * 100)/100;
        eachStat.max = max;
        eachStat.value = average;
        eachStat.percentage = Math.round(Math.abs(average)/max * 10000)/100;
        this.state.searchResult.securityGroupList.forEach((eachGroup) => {
          const targetStat = eachGroup.data.stats.find((eachGroupStat) => {
            return eachGroupStat.label === eachStat.label && eachGroupStat.deltaScope === eachStat.deltaScope;
          });
          if (!!targetStat) {
            targetStat.max = max;
            targetStat.percentage = Math.round(Math.abs(targetStat.value)/targetStat.max * 10000)/100;
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
}