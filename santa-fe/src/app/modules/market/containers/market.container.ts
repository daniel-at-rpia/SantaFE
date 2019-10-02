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
    if (this.state.securityList === targetList) {
      this.state.securityList = [];
    } else if (this.state.securityList2 === targetList) {
      this.state.securityList2 = [];
    } else if (this.state.securityList3 === targetList) {
      this.state.securityList3 = [];
    } else if (this.state.securityList4 === targetList) {
      this.state.securityList4 = [];
    } else if (this.state.securityGroupList1 === targetList) {
      this.state.securityGroupList1 = [];
    } else if (this.state.securityGroupList2 === targetList) {
      this.state.securityGroupList2 = [];
    } else if (this.state.securityGroupList3 === targetList) {
      this.state.securityGroupList3 = [];
    } else if (this.state.securityGroupList4 === targetList) {
      this.state.securityGroupList4 = [];
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

  populateGroupDataForOne(){
    this.state.securityGroupList1 = SecurityGroupList.map((eachGroup) => {
      return this.dtoService.formSecurityGroupObject(eachGroup);
    });
  }

  populateGroupDataForTwo(){
    this.state.securityGroupList2 = SecurityGroupList.map((eachGroup) => {
      return this.dtoService.formSecurityGroupObject(eachGroup);
    });
    const list2 = this.state.securityGroupList2;
    setTimeout(function(){
      list2.forEach((eachGroup) => {
        eachGroup.state.isStencil = false;
      });
    }, 2000);
  }


  populateGroupDataForThree(){
    this.state.securityGroupList3 = SecurityGroupList.map((eachGroup) => {
      return this.dtoService.formSecurityGroupObject(eachGroup);
    });
    const list3 = this.state.securityGroupList3;
    setTimeout(function(){
      list3.forEach((eachGroup) => {
        eachGroup.state.isStencil = false;
        eachGroup.data.stats.pop();
      });
    }, 2000);
  }

  populateGroupDataForFour(){
    this.state.securityGroupList4 = SecurityGroupList.map((eachGroup) => {
      return this.dtoService.formSecurityGroupObject(eachGroup);
    });
    const list4 = this.state.securityGroupList4;
    setTimeout(function(){
      list4.forEach((eachGroup) => {
        eachGroup.state.isStencil = false;
        eachGroup.data.stats.pop();
        eachGroup.data.stats.pop();
      });
    }, 2000);
  }

}