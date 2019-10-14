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
    this.state.securityGroupList.push(this.dtoService.formSecurityGroupObject(null, true));
    this.state.securityGroupList.push(this.dtoService.formSecurityGroupObject(null, true));
    this.state.securityGroupList.push(this.dtoService.formSecurityGroupObject(null, true));

    this.task$ = interval(2000);
    this.getGroupsSubscription = this.task$.pipe(
      tap(() => {
        this.state.securityGroupList.forEach((eachGroup, index) => {
          eachGroup.data = this.dtoService.formSecurityGroupObject(SecurityGroupList[index]).data;
          eachGroup.state.isStencil = false;
        });
        this.state.configurator.state.isLoading = false;
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
}