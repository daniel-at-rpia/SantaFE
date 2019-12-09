  // dependencies
    import { Injectable } from '@angular/core';

    import { UtilityService } from 'Core/services/UtilityService';
    import { DTOService } from 'Core/services/DTOService';
    import {
      SecurityDTO,
      SecurityTableDTO,
      SecurityTableHeaderDTO,
      SecurityTableRowDTO,
      QuantComparerDTO,
      SearchShortcutDTO
    } from 'FEModels/frontend-models.interface';
    import {
      LiveDataDiffingResult
    } from 'FEModels/frontend-adhoc-packages.interface';
    import {
      BEPortfolioDTO,
      BESecurityDTO,
      BEBestQuoteDTO
    } from 'BEModels/backend-models.interface';
  // dependencies

@Injectable()
export class LiveDataProcessingService {
  constructor(
    private utilityService: UtilityService,
    private dtoService: DTOService
  ){
    const worker = new Worker('./SecurityTableWorker.worker', { type: 'module' });
    worker.onmessage = ({ data }) => {
      console.log(`page got message: ${data}`);
    };
    worker.postMessage('hello');
  }

  public loadStageOneContent(
    tableHeaderList: Array<SecurityTableHeaderDTO>,
    activeMetricType: string,
    serverReturn: Object
  ): Array<SecurityTableRowDTO> {
    const prinstineRowList: Array<SecurityTableRowDTO> = [];  // flush out the stencils
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
        const newSecurity = this.dtoService.formSecurityCardObject(eachKey, newBESecurity, false);
        serverReturn[eachKey].forEach((eachPortfolio: BEPortfolioDTO) => {
          if (eachPortfolio.quantity !== 0 && !eachPortfolio.santaSecurity.isGovt && eachPortfolio.santaSecurity.metrics) {
            this.dtoService.appendPortfolioInfoToSecurityDTO(newSecurity, eachPortfolio, activeMetricType);
          } else {
            isValidFlag = false;
          }
        });
        if (isValidFlag) {
          this.dtoService.appendPortfolioOverviewInfoForSecurityDTO(newSecurity);
          this.populateEachRowWithStageOneContent(
            tableHeaderList,
            prinstineRowList,
            newSecurity
          );
          validCount++;
        }
      }
    }
    console.log('count is', count, nonEmptyCount, validCount);
    return prinstineRowList;
  }

  public loadStageThreeContent(
    tableHeaderList: Array<SecurityTableHeaderDTO>,
    rowList: Array<SecurityTableRowDTO>,
    metricType: string,
    serverReturn
  ) {
    if (!!serverReturn) {
      const trackRowsWithoutReturn = [];
      rowList.forEach((eachPrinstineRow) => {
        const securityIdFull = eachPrinstineRow.data.security.data.securityID;
        if (!!serverReturn[securityIdFull]) {
          this.populateEachRowWithStageThreeContent(
            tableHeaderList,
            eachPrinstineRow,
            metricType,
            serverReturn[securityIdFull]
          );
        } else {
          trackRowsWithoutReturn.push(securityIdFull);
        }
      })
      if (trackRowsWithoutReturn.length > 0) {
        console.error("best quote did not return data for ", trackRowsWithoutReturn);
      }
    }
  }

  private populateEachRowWithStageThreeContent(
    tableHeaderList: Array<SecurityTableHeaderDTO>,
    targetRow: SecurityTableRowDTO,
    metricType: string,
    quote: BEBestQuoteDTO
  ){
    const bestQuoteColumnIndex = 0;  // for now the bestQuote is fixed
    const bestQuoteCell = targetRow.data.cells[bestQuoteColumnIndex];
    const newQuant = this.dtoService.formQuantComparerObject(false,
      metricType,
      quote
    );
    bestQuoteCell.data.quantComparerDTO = newQuant;
    this.utilityService.calculateMarkDiscrepancies(
      targetRow.data.security,
      newQuant,
      metricType
    );
    tableHeaderList.forEach((eachHeader, index) => {
      if (eachHeader.data.readyStage === 3) {
        targetRow.data.cells[index-1] = this.utilityService.populateSecurityTableCellFromSecurityCard(
          eachHeader,
          targetRow,
          targetRow.data.cells[index-1]
        );
      }
    });
  }

  public returnDiff(
    table: SecurityTableDTO,
    newList: Array<SecurityTableRowDTO>
  ): LiveDataDiffingResult {
    const updateList: Array<SecurityTableRowDTO> = [];
    let markDiffCount = 0;
    let quantDiffCount = 0;
    newList.forEach((eachNewRow) => {
      const oldRow = table.data.rows.find((eachOldRow) => {
        return eachOldRow.data.security.data.securityID === eachNewRow.data.security.data.securityID;
      })
      if (!!oldRow) {
        const isSecurityDiff = this.isThereDiffInSecurity(oldRow.data.security, eachNewRow.data.security);
        const isQuantDiff = this.isThereDiffInQuantComparer(oldRow.data.cells[0].data.quantComparerDTO, eachNewRow.data.cells[0].data.quantComparerDTO);
        if ( isSecurityDiff || isQuantDiff) {
          console.log('test, there is an update', oldRow, eachNewRow, isSecureContext, isQuantDiff);
          updateList.push(eachNewRow);
        }
      } else {
        updateList.push(eachNewRow);
      }
    })
    return {
      newRowList: updateList,
      markDiffCount: markDiffCount,
      quantDiffCount: quantDiffCount
    };
  }

  private populateEachRowWithStageOneContent(
    headerList: Array<SecurityTableHeaderDTO>,
    prinstineRowList: Array<SecurityTableRowDTO>,
    newSecurity: SecurityDTO
  ) {
    const newRow = this.dtoService.formSecurityTableRowObject(newSecurity);
    newSecurity.state.isTable = true;
    headerList.forEach((eachHeader, index) => {
      if (!eachHeader.state.isPureTextVariant) {
        const newCell = this.utilityService.populateSecurityTableCellFromSecurityCard(
          eachHeader,
          newRow,
          this.dtoService.formSecurityTableCellObject(false, null, eachHeader.state.isQuantVariant)
        );
        newRow.data.cells.push(newCell);
      }
    });
    prinstineRowList.push(newRow);
  }

  private isThereDiffInSecurity(
    oldSecurity: SecurityDTO,
    newSecurity: SecurityDTO
  ): boolean {
    if (oldSecurity.data.positionFirm !== newSecurity.data.positionFirm) {
      return true;
    }
    if (oldSecurity.data.mark.markRaw !== newSecurity.data.mark.markRaw) {
      return true;
    }
    return false;
  }

  private isThereDiffInQuantComparer(
    oldQuant: QuantComparerDTO,
    newQuant: QuantComparerDTO
  ): boolean {
    if (oldQuant && !newQuant) {
      return true;
    }
    if (!oldQuant && newQuant) {
      return true;
    }
    if (!oldQuant && !newQuant) {
      return false;
    }
    for (const eachAttr in oldQuant.data.bid) {
      if (oldQuant.data.bid[eachAttr] !== newQuant.data.bid[eachAttr]) {
        return false;
      }
    }
    for (const eachAttr in oldQuant.data.offer) {
      if (oldQuant.data.offer[eachAttr] !== newQuant.data.offer[eachAttr]) {
        return false;
      }
    }
    return false;
  }
}