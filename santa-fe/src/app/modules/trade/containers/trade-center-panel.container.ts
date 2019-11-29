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
      SearchShortcutDTO
    } from 'FEModels/frontend-models.interface';
    import { PayloadGetPositions } from 'BEModels/backend-payloads.interface';
    import {
      BEPortfolioDTO,
      BESecurityDTO,
      BEBestQuoteDTO
    } from 'BEModels/backend-models.interface';

    import { TriCoreMetricConfig } from 'Core/constants/coreConstants.constant';
    import { SecurityTableMetrics } from 'Core/constants/securityTableConstants.constant';
    import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';
    import {
      PortfolioList,
      QUANT_COMPARER_PERCENTILE,
      SearchShortcuts
    } from 'Core/constants/tradeConstants.constant';
    import { DefinitionConfiguratorEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';
  //

@Component({
  selector: 'trade-center-panel',
  templateUrl: './trade-center-panel.container.html',
  styleUrls: ['./trade-center-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeCenterPanel {
  state: TradeCenterPanelState;
  constants = {
    portfolioList: PortfolioList,
    searchShortcuts: SearchShortcuts,
    securityGroupDefinitionMap: SecurityDefinitionMap
  }

  private initializePageState() {
    this.state = {
      currentContentStage: 0,
      presets: {
        selectedPreset: null,
        shortcutList: []
      },
      configurator: {
        dto: this.dtoService.createSecurityDefinitionConfigurator(true)
      },
      table: {
        metrics: SecurityTableMetrics,
        dto: this.dtoService.formSecurityTableObject()
      },
      fetchResult: {
        fetchTableDataFailed: false,
        fetchTableDataFailedError: '',
        rowList: [],
        prinstineRowList: []
      },
      filters: {
        quickFilters: {
          metricType: TriCoreMetricConfig.TSpread.label,
          portfolios: ['DOF'],
          keyword: ''
        },
        securityFilters: []
      }
    };
    this.populateSearchShortcuts();
  }

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ){
    this.initializePageState();
  }

  public onSelectPreset(targetPreset: SearchShortcutDTO) {
    if (this.state.presets.selectedPreset === targetPreset) {
      targetPreset.state.isSelected = false;
      this.state.presets.selectedPreset = null;
    } else {
      targetPreset.state.isSelected = true;
      this.state.presets.selectedPreset = targetPreset;
      setTimeout(this.loadFreshData.bind(this), 500);
    }
  }

  public onClickQuickFilterList(targetList, targetItem) {
    if (targetList.indexOf(targetItem) >= 0) {
      if (targetList === this.state.filters.quickFilters.portfolios) {
        this.state.filters.quickFilters.portfolios = targetList.filter((eachItem) => {
          return eachItem !== targetItem;
        })
      }
    } else {
      targetList.push(targetItem);
    }
    this.updateRowListWithFilters();
  }

  public onSwitchMetric(targetMetric) {
    if (this.state.filters.quickFilters.metricType !== targetMetric) {
      this.state.filters.quickFilters.metricType = targetMetric;
      const thrityDayDeltaMetric = this.state.table.metrics[7];
      if (thrityDayDeltaMetric.label === '30 Day Delta') {
        thrityDayDeltaMetric.attrName = TriCoreMetricConfig[targetMetric].metricLabel;
        thrityDayDeltaMetric.underlineAttrName = TriCoreMetricConfig[targetMetric].metricLabel;
      } else {
        console.error('Code Maintainence flag: this is not the 30 day delta');
      }
      this.loadFreshData(); 
    }
  }

  public onApplyFilter(params: DefinitionConfiguratorEmitterParams) {
    this.state.filters.securityFilters = params.filterList;
    this.updateRowListWithFilters();
  }

  private populateSearchShortcuts(){
    this.constants.searchShortcuts.forEach((eachShortcutStub) => {
      const definitionList = eachShortcutStub.includedDefinitions.map((eachIncludedDef) => {
        const definitionDTO = this.dtoService.formSecurityDefinitionObject(this.constants.securityGroupDefinitionMap.find((eachDef) => {return eachDef.key === eachIncludedDef.definitionKey}));
        definitionDTO.state.groupByActive = !!eachIncludedDef.groupByActive;
        if (eachIncludedDef.selectedOptions.length > 0) {
          definitionDTO.state.filterActive = true;
          definitionDTO.data.filterOptionList.forEach((eachFilterOption) => {
            if (eachIncludedDef.selectedOptions.indexOf(eachFilterOption.shortKey) >= 0) {
              eachFilterOption.isSelected = true;
            }
          });
        }
        return definitionDTO;
      });
      this.state.presets.shortcutList.push(this.dtoService.formSearchShortcutObject(definitionList, eachShortcutStub.displayTitle));
    });
  }

  private loadFreshData() {
    this.state.fetchResult.prinstineRowList = [];
    this.updateStage(0);
    this.loadInitialStencilTable();
    this.fetchStageOneContent();
  }

  private loadInitialStencilTable() {
    const stencilHeaderBuffer: Array<SecurityTableHeaderDTO> = [];
    SecurityTableMetrics.forEach((eachStub) => {
      if (eachStub.label === 'Security' || eachStub.active) {
        stencilHeaderBuffer.push(this.dtoService.formSecurityTableHeaderObject(eachStub));
      }
    });
    for (let i = 0; i < 10; ++i) {
      const stencilSecurity = this.dtoService.formSecurityCardObject(null, true);
      stencilSecurity.state.isTable = true;
      const newRow = this.dtoService.formSecurityTableRowObject(stencilSecurity);
      stencilHeaderBuffer.forEach((eachHeader) => {
        if (eachHeader.data.displayLabel !== 'Security') {
          if (eachHeader.state.isQuantVariant) {
            const bestQuoteStencil = this.dtoService.formQuantComparerObject(true, this.state.filters.quickFilters.metricType, null);
            newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, true, bestQuoteStencil));
          } else {
            newRow.data.cells.push(this.dtoService.formSecurityTableCellObject(true, null, false));
          }
        }
      });
      this.state.fetchResult.prinstineRowList.push(newRow);
    };
    this.state.fetchResult.rowList = this.utilityService.deepCopy(this.state.fetchResult.prinstineRowList);
  }

  private fetchStageOneContent() {
    const payload : PayloadGetPositions = {
      source: 'FO',
      partitionOptions: ['Portfolio', 'Strategy']
    };
    this.restfulCommService.callAPI('santaPortfolio/get-santa-credit-positions', {req: 'POST'}, payload, true, false).pipe(
      first(),
      tap((serverReturn) => {
        console.log('return is ', serverReturn);
        this.loadStageOneContent(serverReturn);
      }),
      catchError(err => {
        console.error('error', err);
        this.state.fetchResult.fetchTableDataFailed = true;
        this.state.fetchResult.fetchTableDataFailedError = err.message;
        this.state.fetchResult.prinstineRowList = [];
        this.updateRowListWithFilters();
        return of('error');
      })
    ).subscribe();
  }

  private loadStageOneContent(serverReturn: Object) {
    this.state.fetchResult.prinstineRowList = [];  // flush out the stencils
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
            newSecurity.data.position = newSecurity.data.position + eachPortfolio.quantity;
            newSecurity.data.portfolios.push(eachPortfolio.portfolioShortName);
            if (eachPortfolio.strategyName.length > 0 && newSecurity.data.portfolioStrategies.indexOf(eachPortfolio.strategyName) < 0) {
              newSecurity.data.portfolioStrategies = newSecurity.data.portfolioStrategies.length === 0 ? `${eachPortfolio.strategyName}` : `${newSecurity.data.portfolioStrategies} & ${eachPortfolio.strategyName}`;
            }
            if (eachPortfolio.portfolioShortName === 'DOF' || eachPortfolio.portfolioShortName === 'SOF') {
              newSecurity.data.positionHF = newSecurity.data.positionHF + eachPortfolio.quantity;
            } else if (eachPortfolio.portfolioShortName === 'STIP' || eachPortfolio.portfolioShortName === 'FIP' || eachPortfolio.portfolioShortName === 'CIP') {
              newSecurity.data.positionNLF = newSecurity.data.positionNLF + eachPortfolio.quantity;
            }
          } else {
            isValidFlag = false;
          }
        });
        if (isValidFlag) {
          newSecurity.data.positionInMM = this.utilityService.parsePositionToMM(newSecurity.data.position, false);
          newSecurity.data.positionHFInMM = this.utilityService.parsePositionToMM(newSecurity.data.positionHF, false);
          newSecurity.data.positionNLFInMM = this.utilityService.parsePositionToMM(newSecurity.data.positionNLF, false);
          this.populateEachRowWithStageOneContent(newSecurity);
          validCount++;
        }
      }
    }
    console.log('count is', count, nonEmptyCount, validCount);
    // right now stage 1 and stage 2 are combined
    this.updateStage(2);
    this.fetchStageThreeContent();
  }

  private fetchStageThreeContent() {
    const payload = {
      quoteMetric: this.state.filters.quickFilters.metricType,
      identifiers: []
    };
    this.state.fetchResult.prinstineRowList.forEach((eachRow) => {
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
        this.state.fetchResult.fetchTableDataFailed = true;
        this.state.fetchResult.fetchTableDataFailedError = err.message;
        this.state.fetchResult.prinstineRowList = [];
        this.updateRowListWithFilters();
        return of('error');
      })
    ).subscribe();
  }

  private loadStageThreeContent(serverReturn) {
    for (const eachKey in serverReturn) {
      const securityId = this.utilityService.extractSecurityId(eachKey);
      const results = this.state.fetchResult.prinstineRowList.filter((eachRow) => {
        return eachRow.data.security.data.securityID === securityId;
      });
      if (!!results && results.length > 0) {
        const targetRow = results[0];
        this.populateEachRowWithStageThreeContent(targetRow, serverReturn[eachKey]);
      }
    }
    this.calculateQuantComparerWidthAndHeight();
    this.updateStage(3);
    // deepcopy & re-assign trigger change on table
    // const updatedRowList = this.utilityService.deepCopy(this.state.prinstineRowList);
    // this.state.prinstineRowList = updatedRowList;
  }

  private populateEachRowWithStageOneContent(
    newSecurity: SecurityDTO
  ) {
    const newRow = this.dtoService.formSecurityTableRowObject(newSecurity);
    newSecurity.state.isTable = true;
    this.state.table.dto.data.headers.forEach((eachHeader, index) => {
      // TODO: once implemented two-step process to fetch security data, this if statement should only populate stage one metrics
      this.populateEachCellWithStageOneContent(eachHeader, newRow);
    });
    this.state.fetchResult.prinstineRowList.push(newRow);
  }

  private populateEachCellWithStageOneContent(
    targetHeader: SecurityTableHeaderDTO,
    targetRow: SecurityTableRowDTO
  ) {
    if (!targetHeader.state.isPureTextVariant) {
      const newCell = this.utilityService.populateSecurityTableCellFromSecurityCard(
        targetHeader,
        targetRow,
        this.dtoService.formSecurityTableCellObject(false, null, targetHeader.state.isQuantVariant)
      );
      targetRow.data.cells.push(newCell);
    }
  }

  private populateEachRowWithStageThreeContent(
    targetRow: SecurityTableRowDTO,
    quote: BEBestQuoteDTO
  ){
    const bestQuoteColumnIndex = 0;  // for now the bestQuote is fixed
    const bestQuoteCell = targetRow.data.cells[bestQuoteColumnIndex];
    const newQuant = this.dtoService.formQuantComparerObject(false,
      this.state.filters.quickFilters.metricType,
      quote
    );
    bestQuoteCell.data.quantComparerDTO = newQuant;
  }

  private updateStage(stageNumber: number) {
    this.updateRowListWithFilters();
    this.state.currentContentStage = stageNumber;
  }

  private updateRowListWithFilters() {
    const filteredList: Array<SecurityTableRowDTO> = [];
    this.state.fetchResult.prinstineRowList.forEach((eachRow) => {
      if (this.state.filters.quickFilters.keyword.length < 3 || eachRow.data.security.data.name.indexOf(this.state.filters.quickFilters.keyword) >= 0) {
        let portfolioIncludeFlag = this.filterByPortfolio(eachRow);
        let securityLevelFilterResultCombined = true;
        if (this.state.filters.securityFilters.length > 0) {
          const securityLevelFilterResult = this.state.filters.securityFilters.map((eachFilter) => {
            return this.filterBySecurityAttribute(eachRow, eachFilter.targetAttribute, eachFilter.filterBy);
          });
          // as long as one of the filters failed, this security will not show
          securityLevelFilterResultCombined = securityLevelFilterResult.filter((eachResult) => {
            return eachResult;
          }).length === securityLevelFilterResult.length;
        }
        securityLevelFilterResultCombined && portfolioIncludeFlag && filteredList.push(eachRow);
      }
    });
    this.state.fetchResult.rowList = this.utilityService.deepCopy(filteredList);
  }

  private filterBySecurityAttribute(targetRow: SecurityTableRowDTO, targetAttribute: string, filterBy: Array<string>): boolean {
    let includeFlag = false;
    filterBy.forEach((eachValue) => {
      if (targetRow.data.security.data[targetAttribute] === eachValue) {
        includeFlag = true;
      }
    });
    return includeFlag;
  }

  // private filterByCurrency(targetRow: SecurityTableRowDTO): boolean {
  //   let includeFlag = false;
  //   this.state.filters.quickFilters.currency.forEach((eachCurrency) => {
  //     if (targetRow.data.security.data.currency === eachCurrency) {
  //       includeFlag = true;
  //     }
  //   });
  //   return includeFlag;
  // }

  // private filterBySecurityType(targetRow: SecurityTableRowDTO): boolean {
  //   let includeFlag = false;
  //   this.state.filters.quickFilters.securityType.forEach((eachType) => {
  //     if (targetRow.data.security.data.securityType === eachType) {
  //       includeFlag = true;
  //     }
  //   });
  //   return includeFlag;
  // }

  private filterByPortfolio(targetRow: SecurityTableRowDTO): boolean {
    let includeFlag = false;
    this.state.filters.quickFilters.portfolios.forEach((eachPortfolio) => {
      if (targetRow.data.security.data.portfolios.indexOf(eachPortfolio) >= 0) {
        includeFlag = true;
      }
    });
    return includeFlag;
  }

  private calculateQuantComparerWidthAndHeight() {
    const bestRunList = [];
    this.state.fetchResult.prinstineRowList.forEach((eachRow) => {
      const targetCell = eachRow.data.cells[0];
      !!targetCell.data.quantComparerDTO && bestRunList.push(targetCell.data.quantComparerDTO);
    });
    this.calculateQuantComparerWidthAndHeightPerSet(bestRunList);
    // const bestAxeList = this.state.prinstineRowList.map((eachRow) => {
    //   const targetCell = eachRow.data.cells[5];
    //   return targetCell.data.quantComparerDTO;
    // });
    // this.calculateQuantComparerWidthAndHeightPerSet(bestAxeList);
  }

  private calculateQuantComparerWidthAndHeightPerSet(list: Array<QuantComparerDTO>) {
    const deltaList = [];
    const sizeList = [];
    list.forEach((eachComparer) => {
      if (!!eachComparer && eachComparer.state.hasBid && eachComparer.state.hasOffer) {
        deltaList.push(Math.abs(eachComparer.data.delta));
        sizeList.push(eachComparer.data.bid.size, eachComparer.data.offer.size);
      }
    });
    const maxDelta = this.utilityService.findPercentile(deltaList, QUANT_COMPARER_PERCENTILE);
    const maxSize = this.utilityService.findPercentile(sizeList, QUANT_COMPARER_PERCENTILE);

    list.forEach((eachComparer) => {
      if (eachComparer.state.hasBid && eachComparer.state.hasOffer) {
        eachComparer.style.lineWidth = this.calculateSingleQuantComparerWidth(eachComparer.data.delta, maxDelta);
      } else {
        eachComparer.style.lineWidth = 15;
      }
      eachComparer.style.bidLineHeight = Math.round(eachComparer.data.bid.size/maxSize * 100);
      eachComparer.style.offerLineHeight = Math.round(eachComparer.data.offer.size/maxSize * 100);
      eachComparer.state.isCalculated = true;
    });
  }

  private calculateSingleQuantComparerWidth(delta: number, maxAbsDelta: number): number {
    if (delta < 0 ) {
      return 100;
    } else {
      const result = 100 - Math.round(delta / maxAbsDelta * 100);
      return result;
    }
  }

}