import { Component, ViewEncapsulation } from '@angular/core';
import { SecurityList } from 'app/stubs/securities.stub';
import { DTOService } from 'app/services/DTOService';

@Component({
  selector: 'market-container',
  templateUrl: './market.container.html',
  styleUrls: ['./market.container.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MarketContainer {
  state: any;
  stub: any;

  private initiateComponentState(){
    this.state = {
      securityList: []
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
  }
}