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
      isGroupDataLoaded: false
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
    this.state.visualizer = this.dtoService.formAverageVisualizerObject();
    this.state.visualizer.state.isEmpty = false;
    this.state.visualizer.state.isStencil = true;

    this.task$ = interval(2000);
    this.getGroupsSubscription = this.task$.pipe(
      tap(() => {
        this.state.securityGroupList.forEach((eachGroup, index) => {
          eachGroup.data = this.dtoService.formSecurityGroupObject(SecurityGroupList[index]).data;
          eachGroup.state.isStencil = false;
        });
        this.state.configurator.state.isLoading = false;
        this.state.visualizer.state.isStencil = false;
        this.state.isGroupDataLoaded = true;
        this.state.securityGroupList.length > 0 && this.calculateGroupAverage();
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

  private calculateGroupAverage(){
    this.state.visualizer.data.stats.forEach((eachStat, statIndex) => {
      let sum = 0;
      let max = 0;
      this.state.securityGroupList.forEach((eachGroup) => {
        // this IF is only a safe check, should always pass
        if (eachGroup.data.stats.length >= statIndex+1) {
          const targetStat = eachGroup.data.stats[statIndex];
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
        // this IF is only a safe check, should always pass
        if (eachGroup.data.stats.length >= statIndex+1) {
          const targetStat = eachGroup.data.stats[statIndex];
          targetStat.max = max;
          targetStat.percentage = Math.round(targetStat.value/targetStat.max * 10000)/100;
        }
      });
    });
  }
}