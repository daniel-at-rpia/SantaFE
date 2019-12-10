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
    import { TriCoreMetricConfig } from 'Core/constants/coreConstants.constant';
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
        console.warn("best quote did not return data for ", trackRowsWithoutReturn);
      }
    }
  }

  private populateEachRowWithStageThreeContent(
    tableHeaderList: Array<SecurityTableHeaderDTO>,
    targetRow: SecurityTableRowDTO,
    metricType: string,
    quote: BEBestQuoteDTO
  ){
    const bestQuoteHeaderIndex = tableHeaderList.findIndex((eachHeader) => {
      return eachHeader.state.isQuantVariant;
    });
    const bestQuoteCell = targetRow.data.cells[bestQuoteHeaderIndex - 1];
    const newPriceQuant = this.dtoService.formQuantComparerObject(
      false,
      TriCoreMetricConfig.Price.label,
      quote
    );
    const newSpreadQuant = this.dtoService.formQuantComparerObject(
      false,
      TriCoreMetricConfig.Spread.label,
      quote
    );
    const newYieldQuant = this.dtoService.formQuantComparerObject(
      false,
      TriCoreMetricConfig.Yield.label,
      quote
    );
    targetRow.data.bestQuotes = {
      bestPriceQuote: newPriceQuant,
      bestYieldQuote: newYieldQuant,
      bestSpreadQuote: newSpreadQuant
    }
    const targetQuantLocationFromRow = tableHeaderList[bestQuoteHeaderIndex].data.targetQuantLocationFromRow;
    bestQuoteCell.data.quantComparerDTO = targetRow.data.bestQuotes[targetQuantLocationFromRow];
    tableHeaderList.forEach((eachHeader, index) => {
      if (eachHeader.data.readyStage === 3) {
        targetRow.data.cells[index-1] = this.utilityService.populateSecurityTableCellFromSecurityCard(
          eachHeader,
          targetRow,
          targetRow.data.cells[index-1],
          metricType
        );
      }
    });
  }

  public returnDiff(
    table: SecurityTableDTO,
    newList: Array<SecurityTableRowDTO>
  ): LiveDataDiffingResult {
    const updateList: Array<SecurityTableRowDTO> = [];
    const oldRowList: Array<SecurityTableRowDTO> = this.utilityService.deepCopy(table.data.rows);
    let markDiffCount = 0;
    let quantDiffCount = 0;
    newList.forEach((eachNewRow) => {
      const oldRow = oldRowList.find((eachOldRow) => {
        return eachOldRow.data.security.data.securityID === eachNewRow.data.security.data.securityID;
      });
      if (!!oldRow) {
        const isSecurityDiff = this.isThereDiffInSecurity(oldRow.data.security, eachNewRow.data.security);
        const isQuantDiff = this.isThereDiffInQuantComparer(oldRow.data.cells[0].data.quantComparerDTO, eachNewRow.data.cells[0].data.quantComparerDTO);
        if ( isSecurityDiff > 0 || isQuantDiff > 0) {
          console.log('Diffing Logic test, there is an update', oldRow, eachNewRow, isSecurityDiff, isQuantDiff);
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
        if (eachHeader.data.readyStage === 1 || eachHeader.data.readyStage === 2) {
          const newCell = this.utilityService.populateSecurityTableCellFromSecurityCard(
            eachHeader,
            newRow,
            this.dtoService.formSecurityTableCellObject(false, null, eachHeader.state.isQuantVariant),
            null
          );
          newRow.data.cells.push(newCell);
        } else {
          const emptyCell = this.dtoService.formSecurityTableCellObject(false, null, eachHeader.state.isQuantVariant);
          newRow.data.cells.push(emptyCell);
        }
      }
    });
    prinstineRowList.push(newRow);
  }

  private isThereDiffInSecurity(
    oldSecurity: SecurityDTO,
    newSecurity: SecurityDTO
  ): number {
    if (oldSecurity.data.positionFirm !== newSecurity.data.positionFirm) {
      return 1;
    }
    if (oldSecurity.data.mark.markRaw !== newSecurity.data.mark.markRaw) {
      return 2;
    }
    return 0;
  }

  private isThereDiffInQuantComparer(
    oldQuant: QuantComparerDTO,
    newQuant: QuantComparerDTO
  ): number {
    if (oldQuant && !newQuant) {
      return 1;
    }
    if (!oldQuant && newQuant) {
      return 2;
    }
    if (!oldQuant && !newQuant) {
      return -1;
    }
    for (const eachAttr in oldQuant.data.bid) {
      if (oldQuant.data.bid[eachAttr] !== newQuant.data.bid[eachAttr]) {
        return 3;
      }
    }
    for (const eachAttr in oldQuant.data.offer) {
      if (oldQuant.data.offer[eachAttr] !== newQuant.data.offer[eachAttr]) {
        return 4;
      }
    }
    return 0;
  }
}