  // dependencies
    import { Injectable } from '@angular/core';

    import { UtilityService } from 'Core/services/UtilityService';
    import { DTOService } from 'Core/services/DTOService';
    import {
      SecurityDTO,
      SecurityTableHeaderDTO,
      SecurityTableRowDTO,
      QuantComparerDTO,
      SearchShortcutDTO
    } from 'FEModels/frontend-models.interface';
    import {
      PayloadGetPositions,
      PayloadGetBestQuotes
    } from 'BEModels/backend-payloads.interface';
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
        const newSecurity = this.dtoService.formSecurityCardObject(newBESecurity, false);
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
}