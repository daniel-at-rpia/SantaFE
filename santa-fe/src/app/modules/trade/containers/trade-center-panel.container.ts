  // dependencies
    import {
      Component,
      ViewEncapsulation,
      OnInit,
      OnDestroy
    } from '@angular/core';
    import { Observable, Subscription } from 'rxjs';
    import {
      interval,
      of
    } from 'rxjs';
    import {
      tap,
      first,
      delay,
      catchError,
      withLatestFrom,
      filter
    } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import { LiveDataProcessingService } from 'Trade/services/LiveDataProcessingService';
    import { TradeCenterPanelState } from 'FEModels/frontend-page-states.interface';
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

    import { TriCoreMetricConfig } from 'Core/constants/coreConstants.constant';
    import {
      SecurityTableMetrics,
      SECURITY_TABLE_FINAL_STAGE,
      THIRTY_DAY_DELTA_METRIC_INDEX
    } from 'Core/constants/securityTableConstants.constant';
    import { SecurityDefinitionMap } from 'Core/constants/securityDefinitionConstants.constant';
    import {
      PortfolioList,
      QUANT_COMPARER_PERCENTILE,
      SearchShortcuts
    } from 'Core/constants/tradeConstants.constant';
    import { DefinitionConfiguratorEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';
    import {
      selectLiveUpdateTick,
      selectInitialDataLoaded
    } from 'Trade/selectors/trade.selectors';
    import {
      TradeLiveUpdateProcessDataCompleteEvent,
      TradeTogglePresetEvent,
      TradeLiveUpdatePassRawDataEvent,
      TradeToggleMetricEvent
    } from 'Trade/actions/trade.actions';
  //

@Component({
  selector: 'trade-center-panel',
  templateUrl: './trade-center-panel.container.html',
  styleUrls: ['./trade-center-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeCenterPanel implements OnInit, OnDestroy {
  state: TradeCenterPanelState;
  subscriptions = {
    startNewUpdateSub: null
  }
  constants = {
    portfolioList: PortfolioList,
    searchShortcuts: SearchShortcuts,
    securityGroupDefinitionMap: SecurityDefinitionMap,
    securityTableFinalStage: SECURITY_TABLE_FINAL_STAGE,
    thirtyDayDeltaIndex: THIRTY_DAY_DELTA_METRIC_INDEX
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
        dto: this.dtoService.formSecurityTableObject(true)
      },
      fetchResult: {
        fetchTableDataFailed: false,
        fetchTableDataFailedError: '',
        rowList: [],
        prinstineRowList: [],
        liveUpdatedRowList: []
      },
      filters: {
        quickFilters: {
          metricType: TriCoreMetricConfig.Spread.label,
          portfolios: [],
          keyword: ''
        },
        securityFilters: []
      }
    };
    this.populateSearchShortcuts();
  }

  constructor(
    private store$: Store<any>,
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService,
    private processingService: LiveDataProcessingService
  ){
    this.initializePageState();
  }

  public ngOnInit() {
    this.subscriptions.startNewUpdateSub = this.store$.pipe(
      select(selectLiveUpdateTick),
      withLatestFrom(
        this.store$.pipe(select(selectInitialDataLoaded))
      )
    ).subscribe(([tick, isInitialDataLoaded]) => {
      if (tick > 0 && isInitialDataLoaded) {  // skip first beat
        this.fetchStageOneContent(false);
      }
    });
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      const eachSub = this.subscriptions[eachItem] as Subscription;
      eachSub.unsubscribe();
    }
  }

  public onSelectPreset(targetPreset: SearchShortcutDTO) {
    if (this.state.presets.selectedPreset === targetPreset) {
      targetPreset.state.isSelected = false;
      this.state.presets.selectedPreset = null;
      this.state.configurator.dto = this.dtoService.createSecurityDefinitionConfigurator(true);
    } else {
      targetPreset.state.isSelected = true;
      this.state.presets.selectedPreset = targetPreset;
      this.utilityService.applyShortcutToConfigurator(targetPreset, this.state.configurator.dto);
      const params = this.utilityService.packDefinitionConfiguratorEmitterParams(this.state.configurator.dto);
      this.onApplyFilter(params);
      this.loadFreshData();
    }
    this.store$.dispatch(new TradeTogglePresetEvent);
  }

  public onUnselectPreset() {
    this.state.presets.selectedPreset.state.isSelected = false;
    this.state.presets.selectedPreset = null;
    this.state.configurator.dto = this.dtoService.createSecurityDefinitionConfigurator(true);
    this.store$.dispatch(new TradeTogglePresetEvent);
  }

  public onSwitchMetric(targetMetric) {
    if (this.state.filters.quickFilters.metricType !== targetMetric) {
      this.state.filters.quickFilters.metricType = targetMetric;
      const thrityDayDeltaMetric = this.state.table.metrics[this.constants.thirtyDayDeltaIndex];
      if (thrityDayDeltaMetric.label === '30 Day Delta') {
        thrityDayDeltaMetric.attrName = TriCoreMetricConfig[targetMetric].metricLabel;
        thrityDayDeltaMetric.underlineAttrName = TriCoreMetricConfig[targetMetric].metricLabel;
      } else {
        console.error('Code Maintainence flag: this is not the 30 day delta');
      }
      // TODO: remove this event and all associated logic from ngrx
      // this.store$.dispatch(new TradeToggleMetricEvent());
    }
  }

  public onApplyFilter(params: DefinitionConfiguratorEmitterParams) {
    this.state.filters.securityFilters = params.filterList;
    this.state.filters.quickFilters.portfolios = [];
    params.filterList.forEach((eachFilter) => {
      if (eachFilter.targetAttribute === 'portfolios') {
        this.state.filters.quickFilters.portfolios = eachFilter.filterBy;
      };
    });
    if (this.state.currentContentStage === this.constants.securityTableFinalStage) {
      this.state.fetchResult.rowList = this.FilterPrinstineRowList();
    }
  }

  private populateSearchShortcuts(){
    this.constants.searchShortcuts.forEach((eachShortcutStub) => {
      const definitionList = eachShortcutStub.includedDefinitions.map((eachIncludedDef) => {
        const definitionDTO = this.dtoService.formSecurityDefinitionObject(this.constants.securityGroupDefinitionMap[eachIncludedDef.definitionKey]);
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
      this.state.presets.shortcutList.push(this.dtoService.formSearchShortcutObject(definitionList, eachShortcutStub.displayTitle, false));
    });
  }

  private loadFreshData() {
    this.state.fetchResult.prinstineRowList = [];
    this.loadInitialStencilTable();
    this.updateStage(0);
    this.fetchStageOneContent(true);
  }

  private loadInitialStencilTable() {
    const stencilHeaderBuffer: Array<SecurityTableHeaderDTO> = [];
    SecurityTableMetrics.forEach((eachStub) => {
      if (eachStub.label === 'Security' || eachStub.active) {
        stencilHeaderBuffer.push(this.dtoService.formSecurityTableHeaderObject(eachStub));
      }
    });
    for (let i = 0; i < 10; ++i) {
      const stencilSecurity = this.dtoService.formSecurityCardObject(null, null, true);
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

  private fetchStageOneContent(isInitialFetch: boolean) {
    const payload : PayloadGetPositions = {
      partitionOptions: ['Portfolio', 'Strategy']
    };
    this.restfulCommService.callAPI('santaPortfolio/get-santa-credit-positions', {req: 'POST'}, payload, false, false).pipe(
      first(),
      tap((serverReturn) => {
        if (!isInitialFetch) {
          this.store$.dispatch(new TradeLiveUpdatePassRawDataEvent());
        } else {
          this.updateStage(0);
        }
        this.loadStageOneContent(serverReturn);
      }),
      catchError(err => {
        console.error('error', err);
        this.state.fetchResult.fetchTableDataFailed = true;
        this.state.fetchResult.fetchTableDataFailedError = err.message;
        this.state.fetchResult.prinstineRowList = [];
        this.state.fetchResult.rowList = this.FilterPrinstineRowList();
        return of('error');
      })
    ).subscribe();
  }

  private loadStageOneContent(serverReturn: Object) {
    this.state.fetchResult.prinstineRowList = [];  // flush out the stencils
    this.state.fetchResult.prinstineRowList = this.processingService.loadStageOneContent(
      this.state.table.dto.data.headers,
      this.state.filters.quickFilters.metricType,
      serverReturn
    );
    // right now stage 1 and stage 2 are combined
    // this.updateStage(2); // disabling this now for a smoothier transition on the UI
    this.fetchStageThreeContent();
  }

  private fetchStageThreeContent() {
    const payload: PayloadGetBestQuotes = {
      quoteMetric: this.state.filters.quickFilters.metricType,
      identifiers: []
    };
    this.state.fetchResult.prinstineRowList.forEach((eachRow) => {
      const newSecurityId = eachRow.data.security.data.securityID;
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
        this.state.fetchResult.rowList = this.FilterPrinstineRowList();
        return of('error');
      })
    ).subscribe();
  }

  private loadStageThreeContent(serverReturn) {
    this.processingService.loadStageThreeContent(this.state.table.dto.data.headers, this.state.fetchResult.prinstineRowList, this.state.filters.quickFilters.metricType, serverReturn);
    this.calculateQuantComparerWidthAndHeight();
    this.updateStage(3);
  }

  private updateStage(stageNumber: number) {
    this.state.currentContentStage = stageNumber;
    if (this.state.currentContentStage === this.constants.securityTableFinalStage) {
      this.store$.pipe(
        select(selectInitialDataLoaded),
        first(),
        tap(isInitialDataLoaded => {
          if (isInitialDataLoaded) {
            const newFilteredList = this.FilterPrinstineRowList();
            this.state.fetchResult.liveUpdatedRowList = this.processingService.returnDiff(this.state.table.dto, newFilteredList).newRowList;
          } else {
            this.state.fetchResult.rowList = this.FilterPrinstineRowList();
          }
          this.store$.dispatch(new TradeLiveUpdateProcessDataCompleteEvent());
        })
      ).subscribe();
    }
  }

  private FilterPrinstineRowList(): Array<SecurityTableRowDTO> {
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
    return filteredList;
  }

  private filterBySecurityAttribute(targetRow: SecurityTableRowDTO, targetAttribute: string, filterBy: Array<string>): boolean {
    let includeFlag = false;
    if (targetAttribute === 'portfolios') {
      // bypass portfolio filter since it is handled via this.filterByPortfolio()
      return true;
    } else {
      filterBy.forEach((eachValue) => {
        if (targetRow.data.security.data[targetAttribute] === eachValue) {
          includeFlag = true;
        }
      });
      return includeFlag;
    }
  }

  private filterByPortfolio(targetRow: SecurityTableRowDTO): boolean {
    const targetSecurity = targetRow.data.security;
    let includeFlag = false;
    if (this.state.filters.quickFilters.portfolios.length > 0) {
      targetRow.data.security.data.positionCurrent = 0;
      this.state.filters.quickFilters.portfolios.forEach((eachPortfolio) => {
        const portfolioExist = targetRow.data.security.data.portfolios.find((eachPortfolioBlock) => {
          return eachPortfolioBlock.portfolioName === eachPortfolio;
        });
        if (!!portfolioExist) {
          targetRow.data.security.data.positionCurrent = targetRow.data.security.data.positionCurrent + portfolioExist.quantity;
          includeFlag = true;
        }
      });
    } else {
      includeFlag = true;
      targetRow.data.security.data.positionCurrent = targetRow.data.security.data.positionFirm;
    }
    targetRow.data.security.data.positionCurrentInMM = this.utilityService.parsePositionToMM(targetRow.data.security.data.positionCurrent, false);
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