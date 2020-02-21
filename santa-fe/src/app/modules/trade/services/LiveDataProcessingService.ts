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
      BEBestQuoteDTO,
      BEFetchAllTradeDataReturn
    } from 'BEModels/backend-models.interface';
    import { TriCoreDriverConfig, DEFAULT_DRIVER_IDENTIFIER } from 'Core/constants/coreConstants.constant';
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

  public loadFinalStageData(
    tableHeaderList: Array<SecurityTableHeaderDTO>,
    selectedDriver: string,
    serverReturn: BEFetchAllTradeDataReturn,
    sendToGraphCallback: Function,
    openSecurityInBloombergCallback: Function
  ): Array<SecurityTableRowDTO> {
    const prinstineRowList: Array<SecurityTableRowDTO> = [];  // flush out the stencils
    const securityList = [];
    let count = 0;
    let nonEmptyCount = 0;
    let validCount = 0;
    for (const eachKey in serverReturn){
      count++;
      nonEmptyCount++;
      let sumSize = 0;
      let isValidFlag = true;
      const newBESecurity:BESecurityDTO = serverReturn[eachKey].security;
      const newSecurity = this.dtoService.formSecurityCardObject(eachKey, newBESecurity, false, selectedDriver);
      newSecurity.state.isInteractionThumbDownDisabled = true;
      newSecurity.api.onClickSendToGraph = sendToGraphCallback;
      newSecurity.api.onClickOpenSecurityInBloomberg = openSecurityInBloombergCallback;
      serverReturn[eachKey].positions.forEach((eachPortfolio: BEPortfolioDTO) => {
        // if (!eachPortfolio.security.isGovt) {
        // disabling the check for isGovt for now
        if(true){
          this.dtoService.appendPortfolioInfoToSecurityDTO(newSecurity, eachPortfolio);
        } else {
          isValidFlag = false;
        }
      });
      if (isValidFlag) {
        this.dtoService.appendPortfolioOverviewInfoForSecurityDTO(newSecurity);
        this.populateEachRowWithData(
          tableHeaderList,
          prinstineRowList,
          newSecurity,
          selectedDriver,
          serverReturn[eachKey].bestQuotes
        );
        validCount++;
      }
    }
    console.log('count is', count, nonEmptyCount, validCount);
    return prinstineRowList;
  }

  private populateEachRowWithData(
    headerList: Array<SecurityTableHeaderDTO>,
    prinstineRowList: Array<SecurityTableRowDTO>,
    newSecurity: SecurityDTO,
    driverType: string,
    bestQuoteServerReturn: BEBestQuoteDTO
  ) {
    const newRow = this.dtoService.formSecurityTableRowObject(newSecurity);
    this.populateEachRowWithBestQuoteData(
      headerList,
      newRow,
      driverType,
      bestQuoteServerReturn
    );
    headerList.forEach((eachHeader, index) => {
      if (!eachHeader.state.isPureTextVariant) {
        // data only comes in final stage right now, no need for this logic at the moment
        // if (eachHeader.data.readyStage === 1 || eachHeader.data.readyStage === 2) {
          const newCell = this.utilityService.populateSecurityTableCellFromSecurityCard(
            eachHeader,
            newRow,
            this.dtoService.formSecurityTableCellObject(false, null, eachHeader.state.isQuantVariant),
            driverType
          );
          newRow.data.cells.push(newCell);
        // } else {
        //   const emptyCell = this.dtoService.formSecurityTableCellObject(false, null, eachHeader.state.isQuantVariant);
        //   newRow.data.cells.push(emptyCell);
        // }
      }
    });
    prinstineRowList.push(newRow);
  }

  private populateEachRowWithBestQuoteData(
    tableHeaderList: Array<SecurityTableHeaderDTO>,
    targetRow: SecurityTableRowDTO,
    driverType: string,
    quote: BEBestQuoteDTO
  ){
    const bestQuoteHeaderIndex = tableHeaderList.findIndex((eachHeader) => {
      return eachHeader.state.isQuantVariant;
    });
    const bestQuoteCell = targetRow.data.cells[bestQuoteHeaderIndex - 1];
    const newPriceQuant = !!quote 
      ? this.dtoService.formQuantComparerObject(
          false,
          TriCoreDriverConfig.Price.label,
          quote,
          targetRow.data.security
        ) 
      : null;
    const newSpreadQuant = !!quote 
      ? this.dtoService.formQuantComparerObject(
          false,
          TriCoreDriverConfig.Spread.label,
          quote,
          targetRow.data.security
        )
      : null;
    const newYieldQuant = !!quote 
    ? this.dtoService.formQuantComparerObject(
        false,
        TriCoreDriverConfig.Yield.label,
        quote,
        targetRow.data.security
      )
    : null;
    targetRow.data.bestQuotes = {
      bestPriceQuote: newPriceQuant,
      bestYieldQuote: newYieldQuant,
      bestSpreadQuote: newSpreadQuant
    }
  }

  public returnDiff(
    table: SecurityTableDTO,
    newList: Array<SecurityTableRowDTO>
  ): LiveDataDiffingResult {
    const updateList: Array<SecurityTableRowDTO> = [];
    const oldRowList: Array<SecurityTableRowDTO> = this.utilityService.deepCopy(table.data.rows);
    let markDiffCount = 0;
    let quantDiffCount = 0;

    // those lists are only used for logging purposes
    const positionUpdateList: Array<SecurityTableRowDTO> = [];
    const markUpdateList: Array<SecurityTableRowDTO> = [];
    const newQuantUpdateList: Array<SecurityTableRowDTO> = [];
    const betterBidUpdateList: Array<SecurityTableRowDTO> = [];
    const betterAskUpdateList: Array<SecurityTableRowDTO> = [];

    newList.forEach((eachNewRow) => {
      const oldRow = oldRowList.find((eachOldRow) => {
        return eachOldRow.data.security.data.securityID === eachNewRow.data.security.data.securityID;
      });
      if (!!oldRow) {
        const isSecurityDiff = this.isThereDiffInSecurity(oldRow.data.security, eachNewRow.data.security);
        const isQuantDiff = this.isThereDiffInQuantComparer(oldRow.data.cells[0].data.quantComparerDTO, eachNewRow.data.cells[0].data.quantComparerDTO);
        if ( isSecurityDiff > 0 || isQuantDiff > 0) {
          updateList.push(eachNewRow);
        }
        isSecurityDiff === 1 && positionUpdateList.push(eachNewRow);
        isSecurityDiff === 2 && markUpdateList.push(eachNewRow);
        if (isQuantDiff === 1 || isQuantDiff === 2) {
          newQuantUpdateList.push(eachNewRow);
        }
        isQuantDiff === 3 && betterBidUpdateList.push(eachNewRow);
        isQuantDiff === 4 && betterAskUpdateList.push(eachNewRow);
      } else {
        updateList.push(eachNewRow);
      }
    });
    if (updateList.length > 0) {
      console.log('=== new update ===');
      console.log('Position change: ', positionUpdateList);
      console.log('Mark change: ', markUpdateList);
      console.log('Best Quote overwrite: ', newQuantUpdateList);
      console.log('Best Bid change: ', betterBidUpdateList);
      console.log('Best Ask change: ', betterAskUpdateList);
    }
    return {
      newRowList: updateList,
      markDiffCount: markDiffCount,
      quantDiffCount: quantDiffCount
    };
  }

  private isThereDiffInSecurity(
    oldSecurity: SecurityDTO,
    newSecurity: SecurityDTO
  ): number {
    if (oldSecurity.data.positionFirm !== newSecurity.data.positionFirm) {
      return 1;
    }
    if (oldSecurity.data.mark.markBackend !== newSecurity.data.mark.markBackend) {
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