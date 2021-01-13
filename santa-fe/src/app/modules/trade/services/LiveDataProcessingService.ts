  // dependencies
    import { Injectable } from '@angular/core';

    import { UtilityService } from 'Core/services/UtilityService';
    import { DTOService } from 'Core/services/DTOService';
    import { DTOs, AdhocPacks } from 'Core/models/frontend';
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
    tableHeaderList: Array<DTOs.SecurityTableHeaderDTO>,
    selectedDriver: string,
    serverReturn: BEFetchAllTradeDataReturn,
    sendToGraphCallback: (card: DTOs.SecurityDTO) => void,
    sendToAlertConfigCallback: (card: DTOs.SecurityDTO) => void
  ): Array<DTOs.SecurityTableRowDTO> {
    const rawSecurityDTOMap = serverReturn.securityDtos.securityDtos;
    const prinstineRowList: Array<DTOs.SecurityTableRowDTO> = [];
    const securityList = [];
    for (const eachKey in rawSecurityDTOMap){
      let isValidFlag = true;
      const newBESecurity:BESecurityDTO = rawSecurityDTOMap[eachKey].security;
      const newSecurity = this.dtoService.formSecurityCardObject(eachKey, newBESecurity, false, false, selectedDriver);
      newSecurity.api.onClickSendToGraph = sendToGraphCallback;
      newSecurity.api.onClickSendToAlertConfig = sendToAlertConfigCallback;
      this.dtoService.appendLastTraceInfoToSecurityDTO(newSecurity, rawSecurityDTOMap[eachKey]);
      if (!!rawSecurityDTOMap[eachKey].positions) {
        rawSecurityDTOMap[eachKey].positions.forEach((eachPortfolio: BEPortfolioDTO) => {
          // if (!eachPortfolio.security.isGovt) {
          // disabling the check for isGovt for now
          if(true){
            this.dtoService.appendPortfolioInfoToSecurityDTO(newSecurity, eachPortfolio);
          } else {
            isValidFlag = false;
          }
        });
      }
      if (isValidFlag) {
        this.dtoService.appendPortfolioOverviewInfoForSecurityDTO(newSecurity);
        this.populateEachRowWithData(
          tableHeaderList,
          prinstineRowList,
          newSecurity,
          selectedDriver,
          rawSecurityDTOMap[eachKey].bestQuotes,
          null
        );
      }
    }
    return prinstineRowList;
  }

  public loadFinalStageDataForAlertTable(
    alertDTOMap: AdhocPacks.AlertDTOMap,
    tableHeaderList: Array<DTOs.SecurityTableHeaderDTO>,
    selectedDriver: string,
    serverReturn: BEFetchAllTradeDataReturn,
    sendToGraphCallback: (card: DTOs.SecurityDTO) => void,
    sendToAlertConfigCallback: (card: DTOs.SecurityDTO) => void,
    searchCallback: (card: DTOs.SecurityDTO) => void
  ): Array<DTOs.SecurityTableRowDTO> {
    const rawSecurityDTOMap = serverReturn.securityDtos.securityDtos;
    const prinstineRowList: Array<DTOs.SecurityTableRowDTO> = [];
    const securityList = [];
    for (const eachAlertId in alertDTOMap) {
      const eachAlertDTO = alertDTOMap[eachAlertId];
      if (eachAlertDTO.data && eachAlertDTO.data.security && eachAlertDTO.data.security.data && eachAlertDTO.data.security.data.securityID) {
        const targetSecurityId = eachAlertDTO.data.security.data.securityID;
        if (rawSecurityDTOMap[targetSecurityId]) {
          const newBESecurity:BESecurityDTO = rawSecurityDTOMap[targetSecurityId].security;
          const newSecurity = this.dtoService.formSecurityCardObject(targetSecurityId, newBESecurity, false, true, selectedDriver);
          newSecurity.api.onClickSendToGraph = sendToGraphCallback;
          newSecurity.api.onClickSendToAlertConfig = sendToAlertConfigCallback;
          newSecurity.api.onClickSearch = searchCallback;
          newSecurity.state.isTradeAlertTableVariant = true;
          newSecurity.state.isActionMenuMinorActionsDisabled = true;
          this.dtoService.appendLastTraceInfoToSecurityDTO(newSecurity, rawSecurityDTOMap[targetSecurityId]);
          if (!!rawSecurityDTOMap[targetSecurityId].positions) {
            rawSecurityDTOMap[targetSecurityId].positions.forEach((eachPortfolio: BEPortfolioDTO) => {
              this.dtoService.appendPortfolioInfoToSecurityDTO(newSecurity, eachPortfolio);
            });
          }
          this.dtoService.appendPortfolioOverviewInfoForSecurityDTO(newSecurity);
          this.dtoService.appendAlertInfoToSecurityDTO(newSecurity, eachAlertDTO);
          this.populateEachRowWithData(
            tableHeaderList,
            prinstineRowList,
            newSecurity,
            selectedDriver,
            rawSecurityDTOMap[targetSecurityId].bestQuotes,
            eachAlertDTO
          );
        } else {
          console.error('security not found for alert', eachAlertDTO);
        }
      }
    };
    return prinstineRowList;
  }

  private populateEachRowWithData(
    headerList: Array<DTOs.SecurityTableHeaderDTO>,
    prinstineRowList: Array<DTOs.SecurityTableRowDTO>,
    newSecurity: DTOs.SecurityDTO,
    driverType: string,
    bestQuoteServerReturn: BEBestQuoteDTO,
    targetAlert: DTOs.AlertDTO
  ) {
    const newRow = !!targetAlert ? this.dtoService.formSecurityTableRowObject(newSecurity, targetAlert, true, targetAlert.data.id) : this.dtoService.formSecurityTableRowObject(newSecurity, null, false, newSecurity.data.securityID);
    this.populateEachRowWithBestQuoteData(
      headerList,
      newRow,
      driverType,
      bestQuoteServerReturn
    );
    headerList.forEach((eachHeader, index) => {
      if (!eachHeader.state.isSecurityCardVariant) {
        const newCell = this.utilityService.populateSecurityTableCellFromSecurityCard(
          eachHeader,
          newRow,
          this.dtoService.formSecurityTableCellObject(false, null, eachHeader, null, targetAlert),
          driverType
        );
        newRow.data.cells.push(newCell);
      }
    });
    prinstineRowList.push(newRow);
  }

  private populateEachRowWithBestQuoteData(
    tableHeaderList: Array<DTOs.SecurityTableHeaderDTO>,
    targetRow: DTOs.SecurityTableRowDTO,
    driverType: string,
    quote: BEBestQuoteDTO
  ){
    const newPriceQuant = !!quote 
      ? this.dtoService.formBestQuoteComparerObject(
          false,
          TriCoreDriverConfig.Price.label,
          quote,
          targetRow.data.security,
          false
        )
      : null;
    const newSpreadQuant = !!quote 
      ? this.dtoService.formBestQuoteComparerObject(
          false,
          TriCoreDriverConfig.Spread.label,
          quote,
          targetRow.data.security,
          false
        )
      : null;
    const newYieldQuant = !!quote 
    ? this.dtoService.formBestQuoteComparerObject(
        false,
        TriCoreDriverConfig.Yield.label,
        quote,
        targetRow.data.security,
        false
      )
    : null;
    const newAxePriceQuant = !!quote 
      ? this.dtoService.formBestQuoteComparerObject(
          false,
          TriCoreDriverConfig.Price.label,
          quote,
          targetRow.data.security,
          true
        )
      : null;
    const newAxeSpreadQuant = !!quote
      ? this.dtoService.formBestQuoteComparerObject(
        false,
        TriCoreDriverConfig.Spread.label,
        quote,
        targetRow.data.security,
        true
      )
      : null;
    const newAxeYieldQuant = !!quote
      ? this.dtoService.formBestQuoteComparerObject(
        false,
        TriCoreDriverConfig.Yield.label,
        quote,
        targetRow.data.security,
        true
      )
      : null;
    targetRow.data.bestQuotes = {
      combined: {
        bestPriceQuote: newPriceQuant,
        bestYieldQuote: newYieldQuant,
        bestSpreadQuote: newSpreadQuant
      },
      axe: {
        bestPriceQuote: newAxePriceQuant,
        bestYieldQuote: newAxeYieldQuant,
        bestSpreadQuote: newAxeSpreadQuant
      }
    }
  }

  public returnDiff(
    table: DTOs.SecurityTableDTO,
    newList: Array<DTOs.SecurityTableRowDTO>,
    diffOverwriteRowList?: Array<string>
  ): AdhocPacks.LiveDataDiffingResult {
    const updateList: Array<DTOs.SecurityTableRowDTO> = [];
    const oldRowList: Array<DTOs.SecurityTableRowDTO> = this.utilityService.deepCopy(table.data.rows);
    let markDiffCount = 0;
    let quantDiffCount = 0;

    // those lists are only used for logging purposes
    const newRowList: Array<DTOs.SecurityTableRowDTO> = [];
    const positionUpdateList: Array<DTOs.SecurityTableRowDTO> = [];
    const markUpdateList: Array<DTOs.SecurityTableRowDTO> = [];
    const newBestQuoteUpdateList: Array<DTOs.SecurityTableRowDTO> = [];
    const betterBidUpdateList: Array<DTOs.SecurityTableRowDTO> = [];
    const betterAskUpdateList: Array<DTOs.SecurityTableRowDTO> = [];
    const validityUpdateList: Array<DTOs.SecurityTableRowDTO> = [];
    const overwriteUpdateList: Array<DTOs.SecurityTableRowDTO> = [];

    newList.forEach((eachNewRow) => {
      // if this row is specified in the overwrite list, then there is no need to do diffing, just add it to the list of rows to be updated
      if (!!diffOverwriteRowList && diffOverwriteRowList.length > 0 && diffOverwriteRowList.includes(eachNewRow.data.rowId)) {
        overwriteUpdateList.push(eachNewRow);
        updateList.push(eachNewRow);
      } else {
        const oldRow = oldRowList.find((eachOldRow) => {
          return eachOldRow.data.rowId === eachNewRow.data.rowId;
        });
        if (!!oldRow) {
          const isSecurityDiff = this.isThereDiffInSecurity(oldRow.data.security, eachNewRow.data.security);
          const isBestQuoteDiff = this.isThereDiffInBestQuoteComparer(oldRow.data.cells[0].data.bestQuoteComparerDTO, eachNewRow.data.cells[0].data.bestQuoteComparerDTO);
          if ( isSecurityDiff > 0 || isBestQuoteDiff > 0) {
            this.carryOverOldRowStates(eachNewRow, oldRow);
            updateList.push(eachNewRow);
          }
          isSecurityDiff === 1 && positionUpdateList.push(eachNewRow);
          isSecurityDiff === 2 && markUpdateList.push(eachNewRow);
          if (isBestQuoteDiff === 1 || isBestQuoteDiff === 2) {
            newBestQuoteUpdateList.push(eachNewRow);
          }
          isBestQuoteDiff === 3 && betterBidUpdateList.push(eachNewRow);
          isBestQuoteDiff === 4 && betterAskUpdateList.push(eachNewRow);
          isBestQuoteDiff === 5 && validityUpdateList.push(eachNewRow);
        } else {
          updateList.push(eachNewRow);
          newRowList.push(eachNewRow);
        }
      }
    });
    if (updateList.length > 0) {
      console.log('=== new update ===');
      newRowList.length > 0 && console.log('new rows', newRowList);
      positionUpdateList.length > 0 && console.log('Position change: ', positionUpdateList);
      markUpdateList.length > 0 && console.log('Mark change: ', markUpdateList);
      newBestQuoteUpdateList.length > 0 && console.log('Best Quote overwrite: ', newBestQuoteUpdateList);
      betterBidUpdateList.length > 0 && console.log('Best Bid change: ', betterBidUpdateList);
      betterAskUpdateList.length > 0 && console.log('Best Ask change: ', betterAskUpdateList);
      validityUpdateList.length > 0 && console.log('Validity change: ', validityUpdateList);
      overwriteUpdateList.length > 0 && console.log('Overwrite update: ', overwriteUpdateList);
    }
    return {
      newRowList: updateList,
      markDiffCount: markDiffCount,
      quantDiffCount: quantDiffCount
    };
  }

  private isThereDiffInSecurity(
    oldSecurity: DTOs.SecurityDTO,
    newSecurity: DTOs.SecurityDTO
  ): number {
    if (oldSecurity.data.position.positionFirm !== newSecurity.data.position.positionFirm) {
      return 1;
    }
    if (oldSecurity.data.mark.markBackend !== newSecurity.data.mark.markBackend) {
      return 2;
    }
    return 0;
  }

  private isThereDiffInBestQuoteComparer(
    oldBestQuote: DTOs.BestQuoteComparerDTO,
    newBestQuote: DTOs.BestQuoteComparerDTO
  ): number {
    if (oldBestQuote && !newBestQuote) {
      return 1;
    }
    if (!oldBestQuote && newBestQuote) {
      return 2;
    }
    if (!oldBestQuote && !newBestQuote) {
      return -1;
    }
    for (const eachAttr in oldBestQuote.data.bid) {
      if (oldBestQuote.data.bid[eachAttr] !== newBestQuote.data.bid[eachAttr]) {
        return 3;
      }
    }
    for (const eachAttr in oldBestQuote.data.offer) {
      if (oldBestQuote.data.offer[eachAttr] !== newBestQuote.data.offer[eachAttr]) {
        return 4;
      }
    }
    if (oldBestQuote.state.bidIsStale !== newBestQuote.state.bidIsStale || oldBestQuote.state.askIsStale !== newBestQuote.state.askIsStale) {
      return 5;
    }
    return 0;
  }

  private carryOverOldRowStates(
    newRow: DTOs.SecurityTableRowDTO,
    oldRow: DTOs.SecurityTableRowDTO
  ) {
    // when an old row is overwritten with a new row, some states of the row and the security card needs to be carried over because they are changed by user interaction, if they are not carried over, it would appear like as the interaction got terminated and the row was refreshed
    // this causes bad UX, especially in case of the user is entering stuff in the alert shortcut config UI
    newRow.data.security.state = oldRow.data.security.state;
  }

  private calculateAggregateMetrics(serverReturn: BEFetchAllTradeDataReturn) {
    const rawSecurityDTOMap = serverReturn.securityDtos.securityDtos;
    const transferPack: AdhocPacks.LiveDataAggregateTransferPack = {
      fundCS01: 0,
      tableCS01: 0
    };
    for (const eachKey in rawSecurityDTOMap){
      const eachBESecurity:BESecurityDTO = rawSecurityDTOMap[eachKey].security;
      
    }
  }
}