import { Component, ViewEncapsulation } from '@angular/core';
import { SecurityList } from 'App/stubs/securities.stub';
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
      securityList: [],
      securityList2: [],
      securityList3: [],
      securityList4: []
    };
  }

  constructor(
    private dtoService: DTOService
  ) {
    this.initiateComponentState();
    this.populateData();
  }

  private populateData(){
    this.state.securityList = SecurityList.map((eachSecurity) => {
      return this.dtoService.formSecurityCardObject(eachSecurity);
    });
    this.state.securityList2 = cloneDeep(this.state.securityList);
    this.state.securityList2.forEach((eachSecurity) => {
      eachSecurity.state.isStencil = true;
    });
    this.state.securityList3 = cloneDeep(this.state.securityList);
    this.state.securityList3.forEach((eachSecurity) => {
      eachSecurity.state.isTable = true;
    });
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
}