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
      SecurityTableHeaderDTO,
      SecurityTableRowDTO,
      QuantComparerDTO,
    } from 'FEModels/frontend-models.interface';
    import { PayloadGetPositions } from 'BEModels/backend-payloads.interface';
    import {
      BEPortfolioDTO,
      BESecurityDTO,
      BEQuoteDTO
    } from 'BEModels/backend-models.interface';

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
      table: this.dtoService.formSecurityTableObject(),
      rowList: []
    };
    this.loadDefaultTableHeaders();
    for (let i = 0; i < 10; ++i) {
      const stencilSecurity = this.dtoService.formSecurityCardObject(null, true);
      stencilSecurity.state.isTable = true;
      this.populateEachRowWithStageOneContent(true, stencilSecurity);
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
    this.state.rowList = [];  // flush out the stencils
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
          if (eachPortfolio.quantity !== 0 && eachPortfolio.marketValueCad !== 0 && !eachPortfolio.santaSecurity.isGovt && eachPortfolio.santaSecurity.metrics && eachPortfolio.portfolioShortName === 'DOF') {
            newSecurity.data.position = newSecurity.data.position + eachPortfolio.marketValueCad;
          } else {
            isValidFlag = false;
          }
        });
        if (isValidFlag) {
          newSecurity.data.positionInMM = this.utilityService.parsePositionToMM(newSecurity.data.position);
          this.populateEachRowWithStageOneContent(false, newSecurity);
          validCount++;
        }
      }
    }
    console.log('count is', count, nonEmptyCount, validCount);
    this.state.table.state.initialDataLoaded = true;
    this.fetchStageThreeContent();
  }

  private fetchStageThreeContent(){
    const payload = {
      quoteMetric: "TSpread",
      identifiers: []
    };
    const test = this.state.rowList.forEach((eachRow) => {
      const newSecurityId = {
        "SecurityId": eachRow.data.security.data.securityID
      };
      payload.identifiers.push(newSecurityId);
    });
    this.restfulCommService.callAPI('liveQuote/get-best-quotes', {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn) => {
        this.loadStageThreeContent(serverReturn);
      }),
      catchError(err => {
        console.log('liveQuote/get-best-quotes failed', err);
        return of('error');
      })
    ).subscribe();
  }

  private loadStageThreeContent(serverReturn){
    for (const eachKey in serverReturn) {
      const securityId = this.utilityService.extractSecurityId(eachKey);
      const results = this.state.rowList.filter((eachRow) => {
        return eachRow.data.security.data.securityID === securityId;
      });
      if (!!results && results.length > 0) {
        const targetRow = results[0];
        this.populateEachRowWithStageThreeContent(targetRow, serverReturn[eachKey]);
      }
    }
    // deepcopy & re-assign trigger change on table
    const updatedRowList = this.utilityService.deepCopy(this.state.rowList);
    this.state.rowList = updatedRowList;
  }

  private populateEachRowWithStageOneContent(
    isStencil: boolean,
    newSecurity: SecurityDTO
  ) {
    const newRow = this.dtoService.formSecurityTableRowObject(newSecurity);
    newSecurity.state.isTable = true;
    this.state.table.data.headers.forEach((eachHeader, index) => {
      // TODO: once implemented two-step process to fetch security data, this if statement should only populate stage one metrics
      if (isStencil) {
        this.populateEachCellWithStageOneContent(eachHeader, newRow, true, false);
      } else if(eachHeader.data.readyStage > 2) {
        this.populateEachCellWithStageOneContent(eachHeader, newRow, false, false);
      } else {
        this.populateEachCellWithStageOneContent(eachHeader, newRow, false, true);
      }
    });
    this.state.rowList.push(newRow);
  }

  private populateEachCellWithStageOneContent(
    targetHeader: SecurityTableHeaderDTO,
    targetRow: SecurityTableRowDTO,
    isStencil: boolean,
    dataReady: boolean
  ) {
    if (!targetHeader.state.isPureTextVariant) {
      if (!dataReady) {
        if (targetHeader.state.isQuantVariant) {
          const bestQuoteStencil = this.dtoService.formQuantComparerObject(true, false, null, null, null, null, null, null);
          if (isStencil) {
            targetRow.data.cells.push(this.dtoService.formSecurityTableCellObject(isStencil, null, true, bestQuoteStencil));
          } else {
            targetRow.data.cells.push(this.dtoService.formSecurityTableCellObject(isStencil, null, true, null));
          }
        } else {
          targetRow.data.cells.push(this.dtoService.formSecurityTableCellObject(isStencil, null, false));
        }
      } else {
        if (!targetHeader.state.isQuantVariant) { // just a safe check, best quotes don't come in at stage one
          let value;
          if (targetHeader.data.isPartOfMetricPack) {
            value = this.utilityService.retrieveSecurityMetricFromMetricPack(targetRow.data.security, targetHeader);
          } else {
            value = targetRow.data.security.data[targetHeader.data.attrName];
          }
          value = (value == null || value === 'n/a') ? 'n/a' : value;
          targetRow.data.cells.push(this.dtoService.formSecurityTableCellObject(false, value, false));
        }
      }
    }
  }

  private populateEachRowWithStageThreeContent(
    targetRow: SecurityTableRowDTO,
    quote: BEQuoteDTO
  ){
    const bestQuoteColumnIndex = 0;  // for now the bestQuote is fixed
    const bestQuoteCell = targetRow.data.cells[bestQuoteColumnIndex];
    const newQuant = this.dtoService.formQuantComparerObject(false,
      true,
      quote.bidQuote,
      Math.round(quote.bidQuantity/100000)/10,
      quote.bidDealer, 
      quote.askQuote,
      Math.round(quote.askQuantity/100000)/10,
      quote.askDealer
    );
    bestQuoteCell.data.quantComparerDTO = newQuant;
  }

  private calculateQuantComparerWidthAndHeight() {
    const bestRunList = this.state.rowList.map((eachRow) => {
      const targetCell = eachRow.data.cells[0];
      return targetCell.data.quantComparerDTO;
    });
    this.calculateQuantComparerWidthAndHeightPerSet(bestRunList);
    const bestAxeList = this.state.rowList.map((eachRow) => {
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