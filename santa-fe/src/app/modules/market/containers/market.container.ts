import { Component, ViewEncapsulation } from '@angular/core';
import {
  SecurityList,
  SecurityGroupList
} from 'App/stubs/securities.stub';
import { DTOService } from 'App/services/DTOService';
import { cloneDeep } from 'App/services/UtilityService';
import { MarketState } from 'FEModels/frontend-page-states.interface';

@Component({
  selector: 'market-container',
  templateUrl: './market.container.html',
  styleUrls: ['./market.container.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MarketContainer {
  state: MarketState;
  stub: any;

  private initiateComponentState(){
    this.state = {
      configurator: this.dtoService.createSecurityGroupDefinitionConfigurator(),
      securityList: [],
      securityList2: [],
      securityList3: [],
      securityList4: [],
      securityGroupList1: [],
      securityGroupList2: [],
      securityGroupList3: [],
      securityGroupList4: []
    };
  }

  constructor(
    private dtoService: DTOService
  ) {
    this.initiateComponentState();
  }

  private populateData(){
  }

  removeData(targetList){
    if (targetList === this.state.configurator) {
      this.state.configurator = null;
    } else {
      for (let key in this.state) {
        if (this.state[key] === targetList) {
          this.state[key] = [];
        }
      }
    }
  }

  populateDataForOne(){
    this.state.securityList = SecurityList.map((eachSecurity) => {
      return this.dtoService.formSecurityCardObject(eachSecurity);
    });
  }

  populateDataForTwo(){
    this.state.securityList2 = cloneDeep(this.state.securityList);
    this.state.securityList2.forEach((eachSecurity) => {
      eachSecurity.state.isStencil = true;
    });
  }

  populateDataForThree(){
    this.state.securityList3 = cloneDeep(this.state.securityList);
    this.state.securityList3.forEach((eachSecurity) => {
      eachSecurity.state.isTable = true;
    });
  }

  populateDataForFour(){
    this.state.securityList4 = cloneDeep(this.state.securityList);
    this.state.securityList4.forEach((eachSecurity) => {
      eachSecurity.state.isStencil = true;
    });
    const orginList = this.state.securityList;
    const list4 = this.state.securityList4;
    setTimeout(function(){
      list4.forEach((eachSecurity, index) => {
        eachSecurity.state.isStencil = false;
        eachSecurity.data.name = orginList[index].data.name;
        eachSecurity.data.ratingValue = orginList[index].data.ratingValue;
      });
    }, 2000);
  }

  populateGroupDefinitionConfigurator(){
    this.state.configurator = this.dtoService.createSecurityGroupDefinitionConfigurator();
  }

}