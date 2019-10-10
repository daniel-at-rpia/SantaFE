import { Component, ViewEncapsulation } from '@angular/core';
import { DTOService } from 'App/services/DTOService';
import {
  SecurityGroupList
} from 'App/stubs/securities.stub';
import { MarketGroupPanelState } from 'FEModels/frontend-page-states.interface';

@Component({
  selector: 'market-group-panel',
  templateUrl: './market-group-panel.container.html',
  styleUrls: ['./market-group-panel.container.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MarketGroupPanel {
  state: MarketGroupPanelState;

  private initiateComponentState(){
    this.state = {
      configurator: this.dtoService.createSecurityGroupDefinitionConfigurator(),
      securityGroupList: [],
      isConfiguratorCollapsed: false
    };
    this.onClickSearchInConfigurator();
  }

  constructor(
    private dtoService: DTOService
  ){
    this.initiateComponentState();
  }

  public onClickSearchInConfigurator(){
    this.state.securityGroupList = SecurityGroupList.map((eachGroup) => {
      return this.dtoService.formSecurityGroupObject(eachGroup);
    });
    const list = this.state.securityGroupList;
    const configurator = this.state.configurator;
    setTimeout(function(){
      list.forEach((eachGroup) => {
        eachGroup.state.isStencil = false;
        configurator.state.isLoading = false;
      });
    }, 1);
  }

  public onToggleCollapseConfigurator(){
    this.state.isConfiguratorCollapsed = !this.state.isConfiguratorCollapsed;
  }
}