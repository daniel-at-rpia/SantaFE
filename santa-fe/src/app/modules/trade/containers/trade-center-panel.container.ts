  // dependencies
    import {
      Component,
      ViewEncapsulation
    } from '@angular/core';
    import { Observable, Subscription } from 'rxjs';
    import {
      interval,
      from,
      of
    } from 'rxjs';
    import {
      tap,
      first,
      combineLatest,
      buffer,
      bufferTime,
      throttleTime,
      delay,
      concatMap,
      catchError
    } from 'rxjs/operators';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';

    import { TradeCenterPanelState } from 'FEModels/frontend-page-states.interface';
    import {
      SecurityDTO,
      QuantComparerDTO
    } from 'FEModels/frontend-models.interface';
    import { BEPortfolioDTO, BESecurityDTO } from 'BEModels/backend-models.interface';
  //

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
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ){
    this.initiatePageState();
  }

  private initiatePageState() {
    this.state = {
      table: this.dtoService.formSecurityTableObject()
    };
    const payload = {
      source: 'FO',
      partitionOptions: ['Portfolio']
    };
    for (let i = 0; i < 10; ++i) {
      const stencilSecurity = this.dtoService.formSecurityCardObject(null, true);
      stencilSecurity.state.isTable = true;
      this.populateRowWithNewSecurityAndQuants(true, stencilSecurity);
    }
    this.restfulCommService.callAPI('santaPortfolio/get-santa-positions', {req: 'POST'}, payload, true).pipe(
      first(),
      tap((serverReturn) => {
        console.log('return is ', serverReturn);
        this.loadInitialDataForTable(serverReturn);
      }),
      catchError(err => {
        console.error('error', err);
        return of('error');
      })
    ).subscribe();
  }

  private loadInitialDataForTable(serverReturn: Object) {
    this.state.table.data.rows = [];  // flush out the stencils
    const securityList = [];
    let count = 0;
    let nonEmptyCount = 0;
    let validCount = 0;
    for (const eachKey in serverReturn){
      count++;
      if (serverReturn[eachKey].length > 0) {
        nonEmptyCount++;
        let sumSize = 0;
        let isValidFlag = true;
        const newBESecurity:BESecurityDTO = serverReturn[eachKey][0].santaSecurity;
        serverReturn[eachKey].forEach((eachPortfolio: BEPortfolioDTO) => {
          if (eachPortfolio.quantity !== 0 && eachPortfolio.marketValueCad !== 0 && !eachPortfolio.santaSecurity.isGovt && eachPortfolio.santaSecurity.metrics) {
          } else {
            isValidFlag = false;
          }
        });
        if (isValidFlag) {
          this.populateRowWithNewSecurityAndQuants(false, this.dtoService.formSecurityCardObject(newBESecurity, false));
          validCount++;
        }
      }
    }
    console.log('count is', count, nonEmptyCount, validCount);
    this.state.table.state.initialDataLoaded = true;
  }

  private populateRowWithNewSecurityAndQuants(
    isStencil: boolean,
    newSecurity: SecurityDTO
  ) {
    newSecurity.state.isTable = true;
    const newRow = this.dtoService.formSecurityTableRowObject(newSecurity);
    if (isStencil) {
      const stencilQuant = this.dtoService.formQuantComparerObject(true, false, null, null, null, null);
      this.state.table.data.headers.forEach((eachHeader, index) => {
        // 0 is for the security card
        if (index !== 0) {
          if (eachHeader.state.isQuantVariant) {
            newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, stencilQuant));
          } else {
            newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null));
          }
        }
      });
    } else {
      // const bestRun = this.dtoService.formQuantComparerObject(true, false, null, null, null, null);
      const bestRun = this.generateRandomQuantComparer(newSecurity);
      const bestAxe = this.generateRandomQuantComparer(newSecurity);
      this.state.table.data.headers.forEach((eachHeader, index) => {
        // 0 is for the security card
        if (index !== 0) {
          if (eachHeader.state.isQuantVariant) {
            newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, bestRun));
          } else {
            newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(false, '390'));
          }
        }
      });
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