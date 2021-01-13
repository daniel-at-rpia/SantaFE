  // dependencies
    import { Injectable } from '@angular/core';

    import { UtilityService } from 'Core/services/UtilityService';
    import { DTOService } from 'Core/services/DTOService';
    import { DTOs, Blocks, AdhocPacks } from 'Core/models/frontend';
    import {
      BEPortfolioDTO,
      BESecurityDTO,
      BEBestQuoteDTO,
      BEFetchAllTradeDataReturn
    } from 'BEModels/backend-models.interface';
    import { TriCoreDriverConfig, DEFAULT_DRIVER_IDENTIFIER } from 'Core/constants/coreConstants.constant';
    import { SecurityDefinitionMap, FilterOptionsTenorRange } from 'Core/constants/securityDefinitionConstants.constant';
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
    sendToAlertConfigCallback: (card: DTOs.SecurityDTO) => void,
    panelStateFilterBlock: Blocks.TradeCenterPanelStateFilterBlock
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
    this.calculateAggregateMetrics(prinstineRowList, panelStateFilterBlock);
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

  public filterPrinstineRowList(
    targetPrinstineList: Array<DTOs.SecurityTableRowDTO>,
    panelStateFilterBlock: Blocks.TradeCenterPanelStateFilterBlock
  ): Array<DTOs.SecurityTableRowDTO> {
    const filteredList: Array<DTOs.SecurityTableRowDTO> = [];
    targetPrinstineList.forEach((eachRow) => {
      try {
        if (!!eachRow && !!eachRow.data && !!eachRow.data.security && !eachRow.data.security.state.isStencil) {
          if (this.utilityService.caseInsensitiveKeywordMatch(eachRow.data.security.data.name, panelStateFilterBlock.quickFilters.keyword)
          || this.utilityService.caseInsensitiveKeywordMatch(eachRow.data.security.data.obligorName, panelStateFilterBlock.quickFilters.keyword)) {
            let portfolioIncludeFlag = this.filterByPortfolio(eachRow, panelStateFilterBlock);
            let ownerFlag = this.filterByOwner(eachRow, panelStateFilterBlock);
            let strategyFlag = this.filterByStrategy(eachRow, panelStateFilterBlock);
            let tenorFlag = this.filterByTenor(eachRow, panelStateFilterBlock);
            let securityLevelFilterResultCombined = true;
            if (panelStateFilterBlock.securityFilters.length > 0) {
              const securityLevelFilterResult = panelStateFilterBlock.securityFilters.map((eachFilter) => {
                return this.filterBySecurityAttribute(eachRow, eachFilter, panelStateFilterBlock);
              });
              // as long as one of the filters failed, this security will not show
              securityLevelFilterResultCombined = securityLevelFilterResult.filter((eachResult) => {
                return eachResult;
              }).length === securityLevelFilterResult.length;
            }
            strategyFlag && ownerFlag && securityLevelFilterResultCombined && portfolioIncludeFlag && tenorFlag && filteredList.push(eachRow);
          }
        } else {
          filteredList.push(eachRow);
        }
      } catch(err) {
        console.error('filter issue', err ? err.message : '', eachRow);
      }
    });
    return filteredList;
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

  private filterBySecurityAttribute(
    targetRow: DTOs.SecurityTableRowDTO,
    targetFilter: AdhocPacks.DefinitionConfiguratorEmitterParamsItem,
    panelStateFilterBlock: Blocks.TradeCenterPanelStateFilterBlock
  ): boolean {
    const targetAttribute = targetFilter.targetAttribute;
    const filterBy = targetFilter.filterBy;
    let includeFlag = false;
    if (targetAttribute === 'portfolios' || targetAttribute === 'owner' || targetAttribute === 'strategyList' || targetAttribute === 'tenor') {
      // bypass those filters since they are handled via individual functions
      return true;
    } else if (targetAttribute === 'seniority') {
      return this.filterBySeniority(targetRow, panelStateFilterBlock);
    } else if (targetFilter.targetAttributeBlock === 'bics') {
      return this.filterByBICS(targetRow, targetFilter, panelStateFilterBlock);
    } else {
      filterBy.forEach((eachValue) => {
        if (targetRow.data.security.data[targetAttribute] === eachValue) {
          includeFlag = true;
        }
      });
      return includeFlag;
    }
  }

  private filterByPortfolio(
    targetRow: DTOs.SecurityTableRowDTO,
    panelStateFilterBlock: Blocks.TradeCenterPanelStateFilterBlock
  ): boolean {
    const targetSecurity = targetRow.data.security;
    let includeFlag = false;
    if (panelStateFilterBlock.quickFilters.portfolios.length > 0) {
      targetRow.data.security.data.position.positionCurrent = 0;
      targetRow.data.security.data.cs01CadCurrent = 0;
      targetRow.data.security.data.cs01LocalCurrent = 0;
      panelStateFilterBlock.quickFilters.portfolios.forEach((eachPortfolio) => {
        const portfolioExist = targetRow.data.security.data.portfolios.find((eachPortfolioBlock) => {
          return eachPortfolioBlock.portfolioName === eachPortfolio;
        });
        if (!!portfolioExist) {
          targetRow.data.security.data.position.positionCurrent = targetRow.data.security.data.position.positionCurrent + portfolioExist.quantity;
          targetRow.data.security.data.cs01CadCurrent = targetRow.data.security.data.cs01CadCurrent + portfolioExist.cs01Cad;
          targetRow.data.security.data.cs01LocalCurrent = targetRow.data.security.data.cs01LocalCurrent + portfolioExist.cs01Local;
          targetRow.data.security.data.weight.fundCS01Pct = panelStateFilterBlock.quickFilters.portfolios.length === 1 ? this.utilityService.round(portfolioExist.cs01WeightPct*100, 2) : null;  // only show fund pct if the user is looking at a specific fund, would always be the case when the user launches Trade through Structuring.
          includeFlag = true;
        }
      });
    } else {
      includeFlag = true;
      targetRow.data.security.data.position.positionCurrent = targetRow.data.security.data.position.positionFirm;
      targetRow.data.security.data.cs01CadCurrent = targetRow.data.security.data.cs01CadFirm;
      targetRow.data.security.data.cs01LocalCurrent = targetRow.data.security.data.cs01LocalFirm;
    }
    targetRow.data.security.data.position.positionCurrentInMM = this.utilityService.parsePositionToMM(targetRow.data.security.data.position.positionCurrent, false, true);
    targetRow.data.security.data.cs01CadCurrentInK = this.utilityService.parseNumberToThousands(targetRow.data.security.data.cs01CadCurrent, false);
    targetRow.data.security.data.cs01LocalCurrentInK = this.utilityService.parseNumberToThousands(targetRow.data.security.data.cs01LocalCurrent, false);
    return includeFlag;
  }

  private filterByOwner(
    targetRow: DTOs.SecurityTableRowDTO,
    panelStateFilterBlock: Blocks.TradeCenterPanelStateFilterBlock
  ): boolean {
    let includeFlag = false;
    if (panelStateFilterBlock.quickFilters.owner.length > 0) {
      panelStateFilterBlock.quickFilters.owner.forEach((eachOwner) => {
        const ownerExist = targetRow.data.security.data.owner.indexOf(eachOwner) > -1;
        if (!!ownerExist) {
          includeFlag = true;
        }
      });
    } else {
      includeFlag = true;
    }
    return includeFlag;
  }

  private filterBySeniority(
    row: DTOs.SecurityTableRowDTO,
    panelStateFilterBlock: Blocks.TradeCenterPanelStateFilterBlock
  ): boolean {
    let includeFlag = false;
    const filterObj = panelStateFilterBlock.securityFilters.filter(f => f.targetAttribute === 'seniority')[0];
    if (filterObj) {
      const includes = filterObj.filterBy.map(v => v.toLowerCase());
      const {seniority} = row.data.security.data;
      const seniorityName = seniority.split(' - ')[1];
      includeFlag = includes.indexOf(seniorityName.toLowerCase()) !== -1;
    }
    return includeFlag;
  }

  private filterByStrategy(
    targetRow: DTOs.SecurityTableRowDTO,
    panelStateFilterBlock: Blocks.TradeCenterPanelStateFilterBlock
  ): boolean {
    let includeFlag = false;
    if (panelStateFilterBlock.quickFilters.strategy.length > 0) {
      panelStateFilterBlock.quickFilters.strategy.forEach((eachStrategy) => {
        const strategyExist = targetRow.data.security.data.strategyList.indexOf(eachStrategy) > -1;
        if (!!strategyExist) {
          includeFlag = true;
        }
      });
    } else {
      includeFlag = true;
    }
    return includeFlag;
  }

  private filterByBICS(
    targetRow: DTOs.SecurityTableRowDTO,
    targetFilter: AdhocPacks.DefinitionConfiguratorEmitterParamsItem,
    panelStateFilterBlock: Blocks.TradeCenterPanelStateFilterBlock
  ): boolean {
    let includeFlag = false;
    if (targetFilter.key === SecurityDefinitionMap.BICS_CONSOLIDATED.key) {
      targetFilter.filterBy.forEach((eachValue) => {
        if (targetRow.data.security.data.bics[targetFilter.targetAttribute].indexOf(eachValue) === 0) {
          includeFlag = true;
        }
      });
    } else {
      targetFilter.filterBy.forEach((eachValue) => {
        if (targetRow.data.security.data.bics[targetFilter.targetAttribute] === eachValue) {
          includeFlag = true;
        }
      });
    }
    return includeFlag;
  }

  private filterByTenor(
    targetRow: DTOs.SecurityTableRowDTO,
    panelStateFilterBlock: Blocks.TradeCenterPanelStateFilterBlock
  ): boolean {
    let includeFlag = false;
    if (panelStateFilterBlock.quickFilters.tenor.length > 0) {
      panelStateFilterBlock.quickFilters.tenor.forEach((eachTenor) => {
        const targetRange = FilterOptionsTenorRange[eachTenor];
        if (!!targetRow && !!targetRow.data.security && targetRow.data.security.data.tenor >= targetRange.min && targetRow.data.security.data.tenor <= targetRange.max) {
          includeFlag = true;
        }
      });
    } else {
      includeFlag = true;
    }
    return includeFlag;
  }

  private calculateAggregateMetrics(
    targetPrinstineList: Array<DTOs.SecurityTableRowDTO>,
    panelStateFilterBlock: Blocks.TradeCenterPanelStateFilterBlock
  ) {
    // right now it's just for the two columns that displays table weight cs01 and credit leverage, but this process works for others
    const matchedRows = this.filterPrinstineRowList(targetPrinstineList, panelStateFilterBlock);
    let tableCS01Aggregate = 0;
    matchedRows.forEach((eachRow) => {
      if (!!eachRow && !!eachRow.data.security) {
        const eachRowCs01 = eachRow.data.security.data.position.positionCurrent;
        tableCS01Aggregate = tableCS01Aggregate + eachRowCs01;
      }
    });
    matchedRows.forEach((eachRow) => {
      if (!!eachRow && !!eachRow.data.security) {
        const eachRowCs01 = eachRow.data.security.data.position.positionCurrent;
        eachRow.data.security.data.weight.groupCS01Pct = this.utilityService.round(eachRowCs01/tableCS01Aggregate*100, 2);
      }
    })
  }
}