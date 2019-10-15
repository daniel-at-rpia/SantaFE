import { Component, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  interval
} from 'rxjs';
import {
  tap,
  first
} from 'rxjs/operators';

import { DTOService } from 'App/services/DTOService';
import { SecurityGroupList } from 'App/stubs/securities.stub';
import { MarketGroupPanelState } from 'FEModels/frontend-page-states.interface';

@Component({
  selector: 'market-group-panel',
  templateUrl: './market-group-panel.container.html',
  styleUrls: ['./market-group-panel.container.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MarketGroupPanel {
  state: MarketGroupPanelState;
  task$: Observable<any>;
  getGroupsSubscription: Subscription;

  private initiateComponentState(){
    this.state = {
      configurator: this.dtoService.createSecurityGroupDefinitionConfigurator(),
      securityGroupList: [],
      visualizer: this.dtoService.formAverageVisualizerObject(),
      isConfiguratorCollapsed: false,
      isGroupDataLoaded: false,
      utility: {
        selectedWidget: 'AVERAGE_VISUALIZER'
      }
    };
  }

  constructor(
    private dtoService: DTOService
  ){
    this.initiateComponentState();
  }

  public onClickSearchInConfigurator(){
    this.state.securityGroupList = [];
    this.state.securityGroupList.push(this.dtoService.formSecurityGroupObject(null, true));
    this.state.securityGroupList.push(this.dtoService.formSecurityGroupObject(null, true));
    this.state.securityGroupList.push(this.dtoService.formSecurityGroupObject(null, true));
    this.state.securityGroupList.push(this.dtoService.formSecurityGroupObject(null, true));
    this.state.securityGroupList.push(this.dtoService.formSecurityGroupObject(null, true));
    this.state.securityGroupList.push(this.dtoService.formSecurityGroupObject(null, true));
    this.state.securityGroupList.push(this.dtoService.formSecurityGroupObject(null, true));
    this.state.securityGroupList.push(this.dtoService.formSecurityGroupObject(null, true));
    this.state.securityGroupList.push(this.dtoService.formSecurityGroupObject(null, true));
    this.initializeGroupStats();
    this.state.visualizer.state.isEmpty = false;
    this.state.visualizer.state.isStencil = true;

    this.task$ = interval(200);
    this.getGroupsSubscription = this.task$.pipe(
      tap(() => {
        this.state.securityGroupList.forEach((eachGroup, index) => {
          eachGroup.data = this.dtoService.formSecurityGroupObject(SecurityGroupList[index%3]).data;
          eachGroup.state.isStencil = false;
        });
        this.state.configurator.state.isLoading = false;
        this.state.visualizer.state.isStencil = false;
        this.state.isGroupDataLoaded = true;
        this.state.securityGroupList.length > 0 && this.updateGroupStats();
      }),
      first()
    ).subscribe();
  }

  public onToggleCollapseConfigurator(){
    this.state.isConfiguratorCollapsed = !this.state.isConfiguratorCollapsed;
    this.state.visualizer.state.isExpanded = this.state.isConfiguratorCollapsed;
    this.state.securityGroupList.forEach((eachGroup) => {
      eachGroup.state.isExpanded = this.state.isConfiguratorCollapsed;
    })
  }

  public onSwitchWidget(targetWidgetName){
    this.state.utility.selectedWidget = targetWidgetName;
  }

  public updateGroupStats(){
    this.initializeGroupStats();
    this.calculateGroupAverage();
  }

  private initializeGroupStats(){
    this.state.securityGroupList.forEach((eachGroup) => {
      eachGroup.data.stats = [];
      this.state.visualizer.data.stats.forEach((eachStat, index) => {
        if (!eachStat.isEmpty) {
          const newStat = {
            label: eachStat.label,
            value: Math.floor(Math.random()*1000),
            max: null,
            percentage: null
          };
          if (index === 2) {
            newStat.value = Math.floor(Math.random()*1000)/100;
          };
          eachGroup.data.stats.push(newStat);
        }
      });
    });
  }

  private calculateGroupAverage(){
    this.state.visualizer.data.stats.forEach((eachStat, statIndex) => {
      if (!eachStat.isEmpty) {
        let sum = 0;
        let max = 0;
        this.state.securityGroupList.forEach((eachGroup) => {
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
        let average = Math.round(sum / this.state.securityGroupList.length * 100)/100;
        eachStat.max = max;
        eachStat.value = average;
        eachStat.percentage = Math.round(average/max * 10000)/100;
        this.state.securityGroupList.forEach((eachGroup) => {
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