import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import { DTOService } from 'Core/services/DTOService';
import { UtilityService } from 'Core/services/UtilityService';

import { TradeCenterPanelState } from 'FEModels/frontend-page-states.interface';

import { SecurityList } from 'Core/stubs/securities.stub';

@Component({
  selector: 'trade-center-panel',
  templateUrl: './trade-center-panel.container.html',
  styleUrls: ['./trade-center-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeCenterPanel {
  state: TradeCenterPanelState;

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService
  ){
    this.initiatePageState();
  }

  private initiatePageState(){
    this.state = {
      demoList: []
    };

    SecurityList.forEach((eachSecurity) => {
      const newSecurity = this.dtoService.formSecurityCardObject(eachSecurity);
      const newObject = {
        security: newSecurity,
        comparer: this.dtoService.formQuantComparerObject()
      };
      this.state.demoList.push(newObject);
    });
  }
}