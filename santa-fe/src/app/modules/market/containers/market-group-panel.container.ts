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
  searchServerReturn$: Observable<BESecurityGroupDTO>;
  searchServerReturnPackedInChunk$: Observable<Array<BESecurityGroupDTO>>;
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
  }

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private http: HttpClient
  ){
    this.initiateComponentState();
  }

  ngOnDestroy(){
    this.getGroupsFromSearchSub.unsubscribe();
  }

  public onClickSearchInConfigurator(){
    this.startSearch();
    const payload = {
      "groupOptions": ["Ccy", "Tenor"],
      "yyyyMMdd": 20190920,
      "source": "FO",
      "tenorOptions": ["2Y", "3Y", "5Y", "7Y", "10Y", "30Y"]
    };
    this.http.post<any>('https://rpiadev01:1225/santaGroup/get-santa-groups', payload, {}).pipe(
      tap((serverReturn) => 
        console.log('return is ', serverReturn)),
      catchError(err => {
        console.log('error', err);
        return of('error');
      })
    ).subscribe();

    this.http.put<any>('https://rpiadev01:1225/santaSecurity/get-santa-securities', {}, {}).pipe(
      tap((serverReturn) => 
        console.log('return is ', serverReturn)),
      catchError(err => {
        console.log('error', err);
        return of('error');
      })
    ).subscribe();
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
  }

  private startSearch(){
    this.state.isGroupDataLoaded = false;
    this.state.utility.visualizer.state.isEmpty = false;
    this.state.utility.visualizer.state.isStencil = true;
    this.state.searchResult.renderProgress = 0;
    this.performSearch();
  }

  private performSearch(){
    this.state.searchResult.securityGroupList = SecurityGroupList.map((eachStub) => {
      return this.dtoService.formSecurityGroupObject(null, true);
    });
    this.initializeGroupStats();

    this.searchServerReturn$ = from(SecurityGroupList).pipe(
      concatMap(item => of(item).pipe(delay(150)))
    );
    this.searchServerReturnPackedInChunk$ = this.searchServerReturn$.pipe(
      bufferTime(1000)
    );
    let index = 0;
    this.getGroupsFromSearchSub = this.searchServerReturnPackedInChunk$.pipe(
      delay(2000),  // this delay is to simulate the delay from server
      tap((arrayOfGroups:Array<BESecurityGroupDTO>) => {
        console.log('received', arrayOfGroups);
        arrayOfGroups.forEach((eachGroup) => {
          const targetGroupCard = this.state.searchResult.securityGroupList[index];
          this.dtoService.updateSecurityGroupObject(eachGroup, targetGroupCard);
          this.initializeStatForGroup(targetGroupCard);
          index++;
        });
        this.state.searchResult.renderProgress = Math.round(index/SecurityGroupList.length*100);
        if (index === SecurityGroupList.length) {
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
          label: eachStat.label,
          value: this.utilityService.retrieveGroupMetricValue(eachStat.label, targetGroup),
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
            return eachGroupStat.label === eachStat.label;
          });
          if (!!targetStat) {
            sum = sum + targetStat.value;
            if (max < targetStat.value) {
              max = targetStat.value;
            }
          }
        });
        let average = Math.round(sum / respectiveLength * 100)/100;
        eachStat.max = max;
        eachStat.value = average;
        eachStat.percentage = Math.round(average/max * 10000)/100;
        this.state.searchResult.securityGroupList.forEach((eachGroup) => {
          const targetStat = eachGroup.data.stats.find((eachGroupStat) => {
            return eachGroupStat.label === eachStat.label;
          });
          if (!!targetStat) {
            targetStat.max = max;
            targetStat.percentage = Math.round(targetStat.value/targetStat.max * 10000)/100;
          }
        });
      }
    });
  }
}