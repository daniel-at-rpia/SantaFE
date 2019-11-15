import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import { DTOService } from 'Core/services/DTOService';
import { UtilityService } from 'Core/services/UtilityService';

import { TradeCenterPanelState } from 'FEModels/frontend-page-states.interface';
import {
  SecurityDTO,
  QuantComparerDTO
} from 'FEModels/frontend-models.interface';

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
    for (let i = 0; i < 10; ++i) {
      const stencilSecurity = this.dtoService.formSecurityCardObject(null, true);
      stencilSecurity.state.isTable = true;
      this.populateRowWithNewSecurityAndQuants(true, stencilSecurity);
    }
    const func = () => {
      this.state.table = this.dtoService.formSecurityTableObject();
      this.loadDemoData();
      this.loadDemoData();
      this.loadDemoData();
      this.loadDemoData();
      this.loadDemoData();
      this.loadDemoData();
      this.loadDemoData();
      this.loadDemoData();
      this.loadDemoData();
      this.loadDemoData();
      // this.loadDemoData();
      // this.loadDemoData();
      // this.loadDemoData();
      // this.loadDemoData();
      this.calculateQuantComparerWidthAndHeight();
    };
    setTimeout(func.bind(this), 500);
  }

  private loadDemoData() {
    SecurityList.forEach((eachSecurity) => {
      const newSecurity = this.dtoService.formSecurityCardObject(eachSecurity, false);
      newSecurity.state.isTable = true;
      this.populateRowWithNewSecurityAndQuants(false, newSecurity);
    });
  }

  private populateRowWithNewSecurityAndQuants(
    isStencil: boolean,
    newSecurity: SecurityDTO
  ) {
    const newRow = this.dtoService.formSecurityTableRowObject(newSecurity);
    if (isStencil) {
      const stencilQuant = this.dtoService.formQuantComparerObject(true, false, null, null, null, null);
      newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, stencilQuant));
      newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null));
      newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null));
      newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null));
      newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null));
      newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null));
    } else {
      const bestRun = this.generateRandomQuantComparer(newSecurity);
      const bestAxe = this.generateRandomQuantComparer(newSecurity);
      newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(false, null, bestRun));
      newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(false, '390'));
      newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(false, '-5'));
      newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(false, 'Long'));
      newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(false, '+4'));
      newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(false, '12'));
    }
    this.state.table.data.rows.push(newRow);
  }

  private generateRandomQuantComparer(newSecurity: SecurityDTO): QuantComparerDTO {
    const isSpread = this.utilityService.isIG(newSecurity.data.ratingValue);
    const bidNumber = isSpread ?  Math.round(Math.random() * 300) + 200 : Math.round(Math.random() * 30) + 90;
    const offerNumber = isSpread ? bidNumber - Math.round(Math.random() * 100) + 21 : bidNumber + Math.round(Math.random() * 10) - 10;
    const bidSize = Math.round(Math.random() * 100) + 10;
    const offerSize = Math.round(Math.random() * 100) + 10;
    return this.dtoService.formQuantComparerObject(false, isSpread, bidNumber, bidSize, offerNumber, offerSize);
  }

  private calculateQuantComparerWidthAndHeight() {
    const bestRunList = this.state.table.data.rows.map((eachRow) => {
      const targetCell = eachRow.data.cells[0];
      return targetCell.data.quantComparerDTO;
    });
    this.calculateQuantComparerWidthAndHeightPerSet(bestRunList);
    const bestAxeList = this.state.table.data.rows.map((eachRow) => {
      const targetCell = eachRow.data.cells[5];
      return targetCell.data.quantComparerDTO;
    });
    this.calculateQuantComparerWidthAndHeightPerSet(bestAxeList);
  }

  private calculateQuantComparerWidthAndHeightPerSet(list: Array<QuantComparerDTO>) {
    let maxSpreadAbsDelta = 0;
    let maxPriceAbsDelta = 0;
    let maxSize = 0;
    list.forEach((eachComparer) => {
      if (eachComparer.data.isSpread) {
        maxSpreadAbsDelta = Math.abs(eachComparer.data.delta) > maxSpreadAbsDelta ? Math.abs(eachComparer.data.delta) : maxSpreadAbsDelta
      } else {
        maxPriceAbsDelta = Math.abs(eachComparer.data.delta) > maxPriceAbsDelta ? Math.abs(eachComparer.data.delta) : maxPriceAbsDelta;
      }
      maxSize = eachComparer.data.bid.size > maxSize ? eachComparer.data.bid.size : maxSize;
      maxSize = eachComparer.data.offer.size > maxSize ? eachComparer.data.offer.size : maxSize;
    });

    list.forEach((eachComparer) => {
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