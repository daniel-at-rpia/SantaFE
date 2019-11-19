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
    import { PayloadGetPositions } from 'BEModels/backend-payloads.interface';
    import { BEPortfolioDTO, BESecurityDTO } from 'BEModels/backend-models.interface';

    import { SecurityTableMetrics } from 'Core/constants/coreConstants.constant';
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
    this.initializePageState();
  }

  private initializePageState() {
    this.state = {
      table: this.dtoService.formSecurityTableObject()
    };
    this.loadDefaultTableHeaders();
    for (let i = 0; i < 10; ++i) {
      const stencilSecurity = this.dtoService.formSecurityCardObject(null, true);
      stencilSecurity.state.isTable = true;
      this.populateRowWithNewSecurityAndQuants(true, stencilSecurity);
    };
    this.fetchStageOneContent();
  }

  private loadDefaultTableHeaders() {
    this.state.table.data.headers = SecurityTableMetrics.map((eachStub) => {
      return this.dtoService.formSecurityTableHeaderObject(eachStub);
    });
      // this.dtoService.formSecurityTableHeaderObject('Security', false),
      // this.dtoService.formSecurityTableHeaderObject('Best Quote (Bid vs Ask)', true),
      // this.dtoService.formSecurityTableHeaderObject('Mark', false),
      // this.dtoService.formSecurityTableHeaderObject('Mark Discrepancy', false),
      // this.dtoService.formSecurityTableHeaderObject('Position', false),
      // this.dtoService.formSecurityTableHeaderObject('30 day delta', false),
      // this.dtoService.formSecurityTableHeaderObject('Quote Count (48hrs)', false)
  }

  private fetchStageOneContent() {
    const payload : PayloadGetPositions = {
      source: 'FO',
      partitionOptions: ['Portfolio']
    };
    this.restfulCommService.callAPI('santaPortfolio/get-santa-credit-positions', {req: 'POST'}, payload, true).pipe(
      first(),
      tap((serverReturn) => {
        console.log('return is ', serverReturn);
        this.loadStageOneContent(serverReturn);
      }),
      catchError(err => {
        console.error('error', err);
        return of('error');
      })
    ).subscribe();
  }

  private loadStageOneContent(serverReturn: Object) {
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
        const newSecurity = this.dtoService.formSecurityCardObject(newBESecurity, false);
        serverReturn[eachKey].forEach((eachPortfolio: BEPortfolioDTO) => {
          if (eachPortfolio.quantity !== 0 && eachPortfolio.marketValueCad !== 0 && !eachPortfolio.santaSecurity.isGovt && eachPortfolio.santaSecurity.metrics) {
            newSecurity.data.position = newSecurity.data.position + eachPortfolio.marketValueCad;
          } else {
            isValidFlag = false;
          }
        });
        if (isValidFlag) {
          newSecurity.data.positionInMM = this.utilityService.parsePositionToMM(newSecurity.data.position);
          this.populateRowWithNewSecurityAndQuants(false, newSecurity);
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
    const bestQuote = this.dtoService.formQuantComparerObject(true, false, null, null, null, null);
    // const bestQuote = this.generateRandomQuantComparer(newSecurity);
    this.state.table.data.headers.forEach((eachHeader, index) => {
      if (!eachHeader.state.isPureTextVariant) {
        if (eachHeader.state.isQuantVariant) {
          newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, true, null));
        } else {
          // TODO: once implemented two-step process to fetch security data, this if statement should only populate stage one metrics
          if (isStencil || eachHeader.data.readyStage > 2) {
            newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, 'PLACE', false));
          } else {
            const value = (newRow.data.security.data[eachHeader.data.attrName] == null || newRow.data.security.data[eachHeader.data.attrName] === 'n/a') ? 'n/a' : newRow.data.security.data[eachHeader.data.attrName];
            newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(false, value, false));
          }
        }
      }
    });
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