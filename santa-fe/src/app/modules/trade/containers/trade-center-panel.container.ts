import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import { DTOService } from 'Core/services/DTOService';
import { UtilityService } from 'Core/services/UtilityService';

import { TradeCenterPanelState } from 'FEModels/frontend-page-states.interface';
import { QuantComparerDTO } from 'FEModels/frontend-models.interface';

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

  private initiatePageState() {
    this.state = {
      demoList: []
    };

    SecurityList.forEach((eachSecurity) => {
      const newSecurity = this.dtoService.formSecurityCardObject(eachSecurity);
      const leftNumber = Math.round(Math.random() * 300) + 200;
      const rightNumber = Math.round(Math.random() * 100) + leftNumber;
      const leftSize = Math.round(Math.random() * 100);
      const rightSize = Math.round(Math.random() * 100);
      const newObject = {
        security: newSecurity,
        comparer: this.dtoService.formQuantComparerObject(leftNumber, leftSize, rightNumber, rightSize)
      };
      this.state.demoList.push(newObject);
    });
    this.calculateQuantComparerWidthAndHeight();
  }

  private calculateQuantComparerWidthAndHeight() {
    let maxNumber = 0;
    let maxSize = 0;
    this.state.demoList.forEach((eachDemo) => {
      const eachComparer: QuantComparerDTO = eachDemo.comparer;
      maxNumber = eachComparer.data.left.number > maxNumber ? eachComparer.data.left.number : maxNumber;
      maxNumber = eachComparer.data.right.number > maxNumber ? eachComparer.data.right.number : maxNumber;
      maxSize = eachComparer.data.left.size > maxSize ? eachComparer.data.left.size : maxSize;
      maxSize = eachComparer.data.right.size > maxSize ? eachComparer.data.right.size : maxSize;
    });

    this.state.demoList.forEach((eachDemo) => {
      const eachComparer: QuantComparerDTO = eachDemo.comparer;
      eachComparer.style.left.lineWidth = Math.round(eachComparer.data.left.number/maxNumber * 100);
      eachComparer.style.left.lineHeight = Math.round(eachComparer.data.left.size/maxSize * 100);
      eachComparer.style.right.lineWidth = Math.round(eachComparer.data.right.number/maxNumber * 100);
      eachComparer.style.right.lineHeight = Math.round(eachComparer.data.right.size/maxSize * 100);
    })
  }

}