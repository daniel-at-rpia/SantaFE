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
      table: this.dtoService.formSecurityTableObject(),
      demoList: []
    };
    for (let i = 0; i < 30; ++i) {
      const stencilSecurity = this.dtoService.formSecurityCardObject(null, true);
      stencilSecurity.state.isTable = true;
      const stencilComparer = this.dtoService.formQuantComparerObject(true, false, null, null, null, null);
      const newObject = {
        security: stencilSecurity,
        comparer: stencilComparer
      };
      this.state.demoList.push(newObject);
    }
    const func = () => {
      this.loadDemoData();
    };
    setTimeout(func.bind(this), 300);
  }

  private loadDemoData() {
    this.state.demoList = [];
    SecurityList.forEach((eachSecurity) => {
      const newSecurity = this.dtoService.formSecurityCardObject(eachSecurity, false);
      newSecurity.state.isTable = true;
      const isSpread = this.utilityService.isIG(newSecurity.data.ratingValue);
      const bidNumber = isSpread ?  Math.round(Math.random() * 300) + 200 : Math.round(Math.random() * 30) + 90;
      const offerNumber = isSpread ? bidNumber - Math.round(Math.random() * 100) + 25 : bidNumber + Math.round(Math.random() * 10) - 12;
      const bidSize = Math.round(Math.random() * 100) + 10;
      const offerSize = Math.round(Math.random() * 100) + 10;
      const newObject = {
        security: newSecurity,
        comparer: this.dtoService.formQuantComparerObject(false, isSpread, bidNumber, bidSize, offerNumber, offerSize)
      };
      this.state.demoList.push(newObject);
      this.state.table.data.rows.push(this.dtoService.formSecurityTableRowObject(newSecurity));
    });
    this.calculateQuantComparerWidthAndHeight();
  }

  private calculateQuantComparerWidthAndHeight() {
    let maxSpreadAbsDelta = 0;
    let maxPriceAbsDelta = 0;
    let maxSize = 0;
    this.state.demoList.forEach((eachDemo) => {
      const eachComparer: QuantComparerDTO = eachDemo.comparer;
      if (eachComparer.data.isSpread) {
        maxSpreadAbsDelta = Math.abs(eachComparer.data.delta) > maxSpreadAbsDelta ? Math.abs(eachComparer.data.delta) : maxSpreadAbsDelta
      } else {
        maxPriceAbsDelta = Math.abs(eachComparer.data.delta) > maxPriceAbsDelta ? Math.abs(eachComparer.data.delta) : maxPriceAbsDelta;
      }
      maxSize = eachComparer.data.bid.size > maxSize ? eachComparer.data.bid.size : maxSize;
      maxSize = eachComparer.data.offer.size > maxSize ? eachComparer.data.offer.size : maxSize;
    });

    this.state.demoList.forEach((eachDemo) => {
      const eachComparer: QuantComparerDTO = eachDemo.comparer;
      eachComparer.style.lineWidth = eachComparer.data.isSpread ? this.calculateSingleQuantComparerWidth(eachComparer.data.delta, maxSpreadAbsDelta): this.calculateSingleQuantComparerWidth(eachComparer.data.delta, maxPriceAbsDelta);
      eachComparer.style.bidLineHeight = Math.round(eachComparer.data.bid.size/maxSize * 100);
      eachComparer.style.offerLineHeight = Math.round(eachComparer.data.offer.size/maxSize * 100);
      eachComparer.state.isCalculated = true;
    });
  }

  private calculateSingleQuantComparerWidth(delta: number, maxAbsDelta: number): number {
    if (delta < 0 ) {
      return 100;
    } else {
      return 100 - Math.round(delta / maxAbsDelta * 10)*10;
    }
  }

}