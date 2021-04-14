  // dependencies
    import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
    import { Router } from '@angular/router';
    import { of, Subscription } from 'rxjs';
    import { catchError, first, tap, filter, withLatestFrom } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';
    import * as moment from 'moment';

    import {
      DTOService,
      RestfulCommService,
      UtilityService,
      BICSDataProcessingService,
      BICSDictionaryLookupService,
      GlobalWorkflowIOService
    } from 'Core/services';
    import { SantaContainerComponentBase } from 'Core/containers/santa-container-component-base';
    import { StructureMainPanelState } from 'FEModels/frontend-page-states.interface';
    import { StructureFullDataLoadedEvent } from 'Structure/actions/structure.actions';
    import { selectUserInitials } from 'Core/selectors/core.selectors';
    import {
      selectReloadFundDataPostEdit,
      selectMainPanelUpdateTick,
      selectActiveBreakdownViewFilter,
      selectActivePortfolioViewFilter,
      selectDataDatestamp,
      selectActiveSubPortfolioFilter,
      selectActiveDeltaScope,
      selectMetricLevel,
      selectSetViewData,
      selectFullDataLoadedEvent,
      selectOverrideDataTransferEvent,
      selectSetBulkOverridesTransferEvent
    } from 'Structure/selectors/structure.selectors';
    import {
      PortfolioMetricValues,
      SUPPORTED_PORTFOLIO_LIST,
      BEPortfolioTargetMetricValues,
      BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX,
      BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER,
      BreakdownViewFilter,
      DeltaScope,
      BICSBEBreakdownIdentifiers
    } from 'Core/constants/structureConstants.constants';
    import { PortfolioStructuringSample } from 'Structure/stubs/structure.stub';
    import {
      PortfolioBreakdownDTO,
      PortfolioFundDTO,
      TargetBarDTO
    } from 'Core/models/frontend/frontend-models.interface';
    import {
      BEStructuringFundBlock,
      BEStructuringBreakdownBlock,
      BEGetPortfolioStructureServerReturn,
      BEStructuringBreakdownMetricBlock,
      BEStructuringFundBlockWithSubPortfolios,
      BEStructuringBreakdownBlockWithSubPortfolios,
      BEStructuringOverrideBlockWithSubPortfolios,
      BEStructuringOverrideBlock,
      BEStructuringOverrideBaseBlock,
      BECreateOverrideBlock,
      BEStructuringOverrideBaseBlockWithSubPortfolios,
      BEPortfolioDTO,
      BEUpdateOverrideBlock,
      BEStructuringBreakdownMetricBlockWithSubPortfolios,
      BEStructuringSetViewReturn
    } from 'App/modules/core/models/backend/backend-models.interface';
    import {
      CoreSendNewAlerts,
      CoreMainThreadOccupiedState,
      CoreMainThreadUnoccupiedState
    } from 'Core/actions/core.actions';
    import {
      PayloadGetPortfolioStructures,
      PayloadSetView,
      PayloadModifyOverrides
    } from 'App/modules/core/models/backend/backend-payloads.interface';
    import {
      StructureSetViewTransferPack,
      AdhocExtensionBEStructuringBreakdownMetricBlock
    } from 'FEModels/frontend-adhoc-packages.interface';
    import {
      SecurityDefinitionMap
    } from 'Core/constants/securityDefinitionConstants.constant';
    import { BICsHierarchyBlock } from 'Core/models/frontend/frontend-blocks.interface';
    import { AdhocPacks, Blocks, DTOs } from 'App/modules/core/models/frontend';
  //

@Component({
    selector: 'structure-main-panel',
    templateUrl: './structure-main-panel.container.html', 
    styleUrls: ['./structure-main-panel.container.scss'],
    encapsulation: ViewEncapsulation.Emulated
})

export class StructureMainPanel extends SantaContainerComponentBase implements OnInit, OnDestroy {
  state: StructureMainPanelState; 
  subscriptions = {
    receiveNewDateSub: null,
    updateSub: null,
    ownerInitialsSub: null,
    selectedMetricLevelSub: null,
    reloadFundUponEditSub: null,
    viewData: null,
    activeBreakdownViewFilterSub: null,
    activePortfolioViewFilterSub: null,
    activeSubPortfolioViewFilterSub: null,
    activeDeltaScopeSub: null,
    overrideDataTransferSub: null,
    setBulkOverrideDataTransferSub: null
  };
  constants = {
    cs01: PortfolioMetricValues.cs01,
    creditLeverage: PortfolioMetricValues.creditLeverage,
    supportedFundList: SUPPORTED_PORTFOLIO_LIST,
    breakdownViewFilter: BreakdownViewFilter,
    deltaScope: DeltaScope,
    currentDeltaScope: 'Now',
    bicsBEIdentifiers: BICSBEBreakdownIdentifiers
  };
  
  constructor(
    protected utilityService: UtilityService,
    protected globalWorkflowIOService: GlobalWorkflowIOService,
    protected router: Router,
    private dtoService: DTOService,
    private store$: Store<any>,
    private restfulCommService: RestfulCommService,
    private bicsDataProcessingService: BICSDataProcessingService,
    private bicsDictionaryLookupService: BICSDictionaryLookupService
  ) {
    super(utilityService, globalWorkflowIOService, router);
    this.state = this.initializePageState();
  }
  
  private initializePageState(): StructureMainPanelState { 
    const state: StructureMainPanelState = {
      ownerInitial: null,
      isUserPM: false,
      currentDataDatestamp: null,
      selectedMetricValue: this.constants.cs01,
      activeBreakdownViewFilter: null,
      activePortfolioViewFilter: [],
      activeSubPortfolioFilter: null,
      activeDeltaScope: null,
      fetchResult: {
        fundList: [],
        fetchFundDataFailed: false,
        fetchFundDataFailedError: '',
        rawServerReturnCache: null
      },
      overrideModifications: {
        totalNumberOfNecessaryCalls: 0,
        callCount: 0
      }
    }
    return state; 
  }
  
  public ngOnInit() {
    this.state = this.initializePageState();
    this.subscriptions.receiveNewDateSub = this.store$.pipe(
      filter((datestampInUnix) => {
        return this.stateActive;
      }),
      select(selectDataDatestamp)
    ).subscribe((datestampInUnix) => {
      this.state.currentDataDatestamp = moment.unix(datestampInUnix);
      this.fullUpdate();
    });
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      filter((value) => {
        return this.stateActive;
      }),
      select(selectUserInitials)
    ).subscribe((value) => {
        this.state.ownerInitial = value;
    });
    this.subscriptions.selectedMetricLevelSub = this.store$.pipe(
      filter((value) => {
        return this.stateActive;
      }),
      select(selectMetricLevel),
      withLatestFrom(this.store$.pipe(select(selectFullDataLoadedEvent)))
    ).subscribe(([value, fullDataLoaded]) => {
      // check for the initial data loaded from fullUpdate() which conflicts with the code in switching metric
      const metric = value === this.constants.cs01 ? this.constants.cs01 : this.constants.creditLeverage
      this.state.selectedMetricValue = metric;
      if (fullDataLoaded) {
        this.state.fetchResult.fundList.forEach(fund => {
          fund.state.isStencil = true; 
          //Switch active and inactive target bars
          fund.data.creditLeverageTargetBar.state.isInactiveMetric = this.state.selectedMetricValue === this.constants.cs01;
          fund.data.cs01TargetBar.state.isInactiveMetric = this.state.selectedMetricValue === this.constants.creditLeverage;
          fund.data.creditDurationTargetBar.state.isInactiveMetric = this.state.selectedMetricValue === this.constants.creditLeverage;
          //Switch values to be displayed in breakdowns
          fund.data.children.forEach(breakdown => {
            breakdown.state.isDisplayingCs01 = this.state.selectedMetricValue === this.constants.cs01;
            breakdown.state.isStencil = true;
            const targetList  = breakdown.state.isDisplayingCs01 ? breakdown.data.rawCs01CategoryList : breakdown.data.rawLeverageCategoryList;
            targetList.forEach(target => {
              target.data.moveVisualizer.state.isStencil = true;
              target.state.isStencil = true;
            })
          })
          setTimeout(() => {
            fund.state.isStencil = false;
          }, 500)
        })
      }
    });
    this.subscriptions.viewData = this.store$.pipe(
      filter((value) => {
        return this.stateActive;
      }),
      select(selectSetViewData)
    ).subscribe((value: StructureSetViewTransferPack) => {
      if (!!value) {
        this.updateViewData(value);
      }
    })
    this.subscriptions.reloadFundUponEditSub = this.store$.pipe(
      filter((targetFund) => {
        return this.stateActive;
      }),
      select(selectReloadFundDataPostEdit)
    ).subscribe((targetFund: BEStructuringFundBlockWithSubPortfolios) => {
      if (!!targetFund) {
        const targetFundCopy: BEStructuringFundBlockWithSubPortfolios = this.utilityService.deepCopy(targetFund);
        const bicsBreakdownList = this.extractBICSBreakdownFromRawFundData(targetFundCopy);
        bicsBreakdownList.forEach((bicsBreakdown: BEStructuringBreakdownBlockWithSubPortfolios) => {
          this.bicsDataProcessingService.populateServerReturnBICSBreakdownWithRemainingEmptyRows(bicsBreakdown);
        })
        this.updateRawServerReturnCache(targetFundCopy);
        let deltaRawDataFromCache: BEStructuringFundBlockWithSubPortfolios = null;
        if (!!this.state.fetchResult.rawServerReturnCache[this.state.activeDeltaScope] && this.state.fetchResult.rawServerReturnCache[this.state.activeDeltaScope].length > 0) {
          deltaRawDataFromCache = this.state.fetchResult.rawServerReturnCache[this.state.activeDeltaScope].find((eachFund) => {
            return eachFund.portfolioId === targetFund.portfolioId;
          });
        }
        this.loadFund(
          this.extractSubPortfolioFromFundReturn(targetFundCopy), 
          !!deltaRawDataFromCache ? this.extractSubPortfolioFromFundReturn(deltaRawDataFromCache) : null
        );
      }
    });
    this.subscriptions.updateSub = this.store$.pipe(
      filter((tick) => {
        return this.stateActive;
      }),
      select(selectMainPanelUpdateTick)
    ).subscribe((tick) => {
      if (tick > 0) {  // ignore the initial page load
        this.fullUpdate();
      }
    });
    this.subscriptions.activeBreakdownViewFilterSub = this.store$.pipe(
      filter((activeFilter) => {
        return this.stateActive;
      }),
      select(selectActiveBreakdownViewFilter)
    ).subscribe((activeFilter) => {
      this.state.activeBreakdownViewFilter = activeFilter;
      this.state.fetchResult.fundList.forEach((eachFund) => {
        this.updateTargetFundBreakdownDisplay(eachFund);
      });
    });
    this.subscriptions.activePortfolioViewFilterSub = this.store$.pipe(
      filter((activeFilter) => {
        return this.stateActive;
      }),
      select(selectActivePortfolioViewFilter)
    ).subscribe((activeFilter) => {
      this.state.activePortfolioViewFilter = activeFilter;
    });
    this.subscriptions.activeSubPortfolioViewFilterSub = this.store$.pipe(
      filter((activeFilter) => {
        return this.stateActive;
      }),
      select(selectActiveSubPortfolioFilter)
    ).subscribe((activeFilter) => {
      this.state.activeSubPortfolioFilter = activeFilter;
      if (!!this.state.fetchResult.rawServerReturnCache) {
        this.processStructureData(
          this.extractSubPortfolioFromFullServerReturn(this.state.fetchResult.rawServerReturnCache.Now),
          this.extractSubPortfolioFromFullServerReturn(this.state.fetchResult.rawServerReturnCache[this.state.activeDeltaScope])
        );
      }
    });
    this.subscriptions.activeDeltaScopeSub = this.store$.pipe(
      filter((activeScope) => {
        return this.stateActive;
      }),
      select(selectActiveDeltaScope)
    ).subscribe((activeScope) => {
      this.state.activeDeltaScope = activeScope;
      if (!!this.state.fetchResult.rawServerReturnCache) {
        this.processStructureData(
          this.extractSubPortfolioFromFullServerReturn(this.state.fetchResult.rawServerReturnCache.Now),
          this.extractSubPortfolioFromFullServerReturn(this.state.fetchResult.rawServerReturnCache[activeScope])
        );
      }
    });
    this.subscriptions.overrideDataTransferSub = this.store$.pipe(
      filter((overrideData) => {
        return this.stateActive
      }),
      select(selectOverrideDataTransferEvent)
    ).subscribe((overrideData: AdhocPacks.StructureSetTargetOverrideTransferPack) => {
      if (!!overrideData) {
        for (let payload in overrideData) {
          if (overrideData[payload] && overrideData[payload].portfolioOverrides && overrideData[payload].portfolioOverrides.length > 0) {
            this.state.overrideModifications.totalNumberOfNecessaryCalls++;
          }
        }
        this.makeOverrideAPICalls(overrideData);
      }
    })
    this.subscriptions.setBulkOverrideDataTransferSub = this.store$.pipe(
      filter((setBulkOverrideData) => {
        return this.stateActive
      }),
      select(selectSetBulkOverridesTransferEvent)
    ).subscribe((setBulkOverrideData: AdhocPacks.StructureSetBulkOverrideTransferPack) => {
      if (!!setBulkOverrideData) {
        this.makeCreateBulkOverrideAPICall(setBulkOverrideData);
      }
    })
    return super.ngOnInit();
  }

  private fullUpdate() {
    const initialWaitForIcons = this.loadStencilFunds.bind(this);
    setTimeout(() => {
      initialWaitForIcons();
    }, 1);
    const loadData = this.fetchFunds.bind(this);
    setTimeout(() => {
      loadData();
    }, 500);
  }

  private loadStencilFunds() {
    this.state.fetchResult.fundList = this.constants.supportedFundList.map((eachPortfolioName) => {
      const eachFund = this.dtoService.formStructureFundObject(this.extractSubPortfolioFromFundReturn(PortfolioStructuringSample.Now[0]), null, true, this.state.selectedMetricValue, this.state.activeDeltaScope);
      eachFund.data.portfolioShortName = eachPortfolioName;
      eachFund.data.displayChildren = eachFund.data.children;
      return eachFund;
    });
  }

  private resetAPIErrors() {
    this.state.fetchResult.fetchFundDataFailed = false;
    this.state.fetchResult.fetchFundDataFailedError = '';
  }

  private sortFunds(funds: Array<PortfolioFundDTO>) {
    funds.sort((fundA, fundB) => {
      const fundAShortName = fundA.data.portfolioShortName;
      const fundBShortName = fundB.data.portfolioShortName;
      return this.constants.supportedFundList.indexOf(fundAShortName) - this.constants.supportedFundList.indexOf(fundBShortName);
    })
  }

  private setEmptyTargetBar(targetBar: TargetBarDTO) {
    targetBar.state.isDataUnavailable = true;
    targetBar.state.isStencil = false;
    targetBar.data.displayedResults = '-';
  }

  private fetchFunds() {
    this.store$.dispatch(new CoreMainThreadOccupiedState(true));
    const allDeltaScopes = [];
    for (const eachDeltaKey in this.constants.deltaScope) {
      allDeltaScopes.push(this.constants.deltaScope[eachDeltaKey]);
    }
    let payload: PayloadGetPortfolioStructures = {
      yyyyMMdd: parseInt(this.state.currentDataDatestamp.format('YYYYMMDD')),
      deltaTypes: allDeltaScopes
    };
    const endpoint = this.restfulCommService.apiMap.getPortfolioStructures;
    this.state.fetchResult.fetchFundDataFailed && this.resetAPIErrors();
    this.restfulCommService.callAPI(endpoint, { req: 'POST' }, payload, false, false).pipe(
      first(),
      tap((serverReturn: BEGetPortfolioStructureServerReturn) => {
        for (let delta in serverReturn) {
          if (serverReturn[delta]) {
            this.updateRawServerReturnWithRawDataForAllRows(serverReturn[delta]);
          }
        }
        this.state.fetchResult.rawServerReturnCache = serverReturn;
        this.processStructureData(
          this.extractSubPortfolioFromFullServerReturn(serverReturn.Now),
          this.extractSubPortfolioFromFullServerReturn(serverReturn[this.state.activeDeltaScope])
        );
        const isViewingHistoricalData = !this.state.currentDataDatestamp.isSame(moment(), 'day');
        this.state.fetchResult.fundList.forEach((eachFund) => {
          eachFund.state.isViewingHistoricalData = isViewingHistoricalData;
        });
        this.store$.dispatch(new CoreMainThreadUnoccupiedState(false));
        this.store$.dispatch(new StructureFullDataLoadedEvent(true));
      }),
      catchError(err => {
        setTimeout(() => {
          this.state.fetchResult.fetchFundDataFailed = true;
          this.state.fetchResult.fetchFundDataFailedError = err.message;
          this.state.fetchResult.fundList.forEach(eachFund => {
            eachFund.state.isDataUnavailable = this.state.fetchResult.fetchFundDataFailed;
            this.setEmptyTargetBar(eachFund.data.creditLeverageTargetBar);
            this.setEmptyTargetBar(eachFund.data.cs01TargetBar);
            this.setEmptyTargetBar(eachFund.data.creditDurationTargetBar);
          })
        }, 500);
        this.restfulCommService.logError('Get Portfolio Structures API called failed')
        console.error(`${endpoint} failed`, err);
        this.store$.dispatch(new CoreMainThreadOccupiedState(false));
        return of('error')
      })
    ).subscribe();
  }

  private updateViewData(data: StructureSetViewTransferPack) {
    // const currentFunds = this.utilityService.deepCopy(this.state.fetchResult.fundList);
    // this.loadStencilFunds();
    const { bucket, view, displayCategory} = data;
    const payload: PayloadSetView = {
      buckets: bucket,
      views: view
    }
    const endpoint = this.restfulCommService.apiMap.setView;
    let totalBucketValues = '';
    const [ updatedView ] = view;
    const displayViewValue = !!updatedView ? updatedView : 'removed';
    for (let values in bucket) {
      if (!!bucket[values]) {
        totalBucketValues = totalBucketValues === '' ? `${bucket[values]}` : `${totalBucketValues} ${bucket[values]}`
      }
    }
    const messageDetails = `${displayCategory}, with view value ${displayViewValue}`;
    this.state.fetchResult.fetchFundDataFailed && this.resetAPIErrors();
    this.restfulCommService.callAPI(endpoint, { req: 'POST' }, payload, false, false).pipe(
      first(),
      tap((serverReturn: BEStructuringSetViewReturn) => {
        // this.updateRawServerReturnWithRawDataForAllRows(serverReturn);
        // this.state.fetchResult.rawServerReturnCache.Now = serverReturn;
        // this.processStructureData(
        //   this.extractSubPortfolioFromFullServerReturn(serverReturn),
        //   this.extractSubPortfolioFromFullServerReturn(this.state.fetchResult.rawServerReturnCache.Dod)
        // );
        if (!!serverReturn) {
          for (const eachFundId in serverReturn) {
            const eachFundReturn = serverReturn[eachFundId];
            if (eachFundReturn.portfolioOverride) {
              for (const eachBucketOption in eachFundReturn.portfolioOverride) {
                for (const eachBucketOptionValues in eachFundReturn.portfolioOverride[eachBucketOption]) {
                  this.updateDataInRawServerReturnCache(
                    eachFundReturn.portfolioOverride[eachBucketOption][eachBucketOptionValues],
                    this.constants.currentDeltaScope,
                    true
                  );
                }
              }
            }
          }
          const completeAlertMessage = `Successfully updated ${messageDetails}`;
          const alert = this.dtoService.formSystemAlertObject('Structuring', 'Updated', `${completeAlertMessage}`, null);
          this.store$.dispatch(new CoreSendNewAlerts([alert]));
          this.restfulCommService.logEngagement(
            this.restfulCommService.engagementMap.portfolioStructureSetView,
            null,
            `View value for ${displayCategory} updated as ${displayViewValue}. Set by ${this.state.ownerInitial}`,
            'Portfolio Structure Breakdown'
          );
          this.refreshMainPanelUIWithNewDataForOverrideAPICalls();
        } else {
          // no need to do anything except showing the error prompt, the best way is to expect the user to refresh
          const completeAlertMessage = `Failed to update ${messageDetails}, please refresh page.`;
          const alert = this.dtoService.formSystemAlertObject('Structuring', 'Failure', `${completeAlertMessage}`, null);
          this.store$.dispatch(new CoreSendNewAlerts([alert]));
        }
      }),
      catchError(err => {
        setTimeout(() => {
          this.state.fetchResult.fetchFundDataFailed = true;
          this.state.fetchResult.fetchFundDataFailedError = err.message;
          this.state.fetchResult.fundList = currentFunds;
          const completeAlertMessage = `Unable to update ${messageDetails}`;
          const alert = this.dtoService.formSystemAlertObject('Structuring', 'ERROR', completeAlertMessage, null);
          alert.state.isError = true;
          this.store$.dispatch(new CoreSendNewAlerts([alert]));
        }, 500)
        this.restfulCommService.logError('Set Analyst View API call failed')
        console.error(`${endpoint} failed`, err);
        return of('error')
      })
    ).subscribe()
  }

  private formCustomBICsBreakdownWithSubLevels(
    rawData: BEStructuringFundBlock,
    deltaRawData: BEStructuringFundBlock,
    fund: PortfolioFundDTO
  ) {
    // Create regular BICs breakdown with sublevels here to avoid circular dependencies with using BICS and DTO service
    const {
      customBreakdown: customBICSBreakdown,
      customDefinitionList: customBICSDefinitionList
    } = this.dtoService.formCustomRawBreakdownData(
      rawData,
      rawData.breakdowns[this.constants.bicsBEIdentifiers.bicsCodeLevel1],
      [this.constants.bicsBEIdentifiers.bicsCodeLevel2, this.constants.bicsBEIdentifiers.bicsCodeLevel3, this.constants.bicsBEIdentifiers.bicsCodeLevel4, this.constants.bicsBEIdentifiers.bicsCodeLevel5, this.constants.bicsBEIdentifiers.bicsCodeLevel6, this.constants.bicsBEIdentifiers.bicsCodeLevel7]
    );
    this.formCustomBICsBreakdownWithSubLevelsPopulateCustomLevel(
      rawData,
      customBICSBreakdown,
      customBICSDefinitionList
    );
    const parsedCustomBICSDefinitionList = this.formCustomBICsBreakdownWithSubLevelsConvertBicsCode(
      customBICSBreakdown,
      customBICSDefinitionList
    );
    const customDeltaBICSBreakdown = deltaRawData 
      ? this.dtoService.formCustomRawBreakdownData(
          deltaRawData,
          deltaRawData.breakdowns.BicsCodeLevel1,
          [this.constants.bicsBEIdentifiers.bicsCodeLevel2, this.constants.bicsBEIdentifiers.bicsCodeLevel3, this.constants.bicsBEIdentifiers.bicsCodeLevel4, this.constants.bicsBEIdentifiers.bicsCodeLevel5, this.constants.bicsBEIdentifiers.bicsCodeLevel6, this.constants.bicsBEIdentifiers.bicsCodeLevel7]
        ).customBreakdown
      : null;
    if (!!customDeltaBICSBreakdown) {
      this.formCustomBICsBreakdownWithSubLevelsPopulateCustomLevel(
        deltaRawData,
        customDeltaBICSBreakdown,
        customBICSDefinitionList
      );
      this.formCustomBICsBreakdownWithSubLevelsConvertBicsCode(
        customDeltaBICSBreakdown,
        customBICSDefinitionList
      );
    }
    const isCs01 = this.state.selectedMetricValue === PortfolioMetricValues.cs01;
    const BICSBreakdown = this.dtoService.formPortfolioBreakdown(
      false,
      customBICSBreakdown,
      customDeltaBICSBreakdown,
      parsedCustomBICSDefinitionList,
      isCs01
    );
    BICSBreakdown.data.title = 'BICS';
    BICSBreakdown.data.definition = this.dtoService.formSecurityDefinitionObject(SecurityDefinitionMap.BICS_LEVEL_1);
    BICSBreakdown.data.indexName = rawData.indexShortName;
    BICSBreakdown.data.portfolioName = rawData.portfolioShortName;
    fund.data.children.push(BICSBreakdown);
  }

  private formCustomBICsBreakdownWithSubLevelsPopulateCustomLevel(
    rawData: BEStructuringFundBlock,
    customBICSBreakdown: BEStructuringBreakdownBlock,
    customBICSDefinitionList: Array<string>
  ) {
    // After retrieving the rows with targets, get their corresponding hierarchy lists in order to get the parent categories to be displayed
    for (let code in customBICSBreakdown.breakdown) {
      const targetLevel: number = (customBICSBreakdown.breakdown[code] as AdhocExtensionBEStructuringBreakdownMetricBlock).customLevel;
      // level 3+ since level 2 parent categories would already be in the breakdown
      if (!!customBICSBreakdown.breakdown[code] && targetLevel >= 3) {
        const targetHierarchyList: Array<BICsHierarchyBlock> = this.bicsDataProcessingService.getTargetSpecificHierarchyList(
          code,
          targetLevel
        );
        if (targetHierarchyList.length > 0) {
          targetHierarchyList.forEach((category: BICsHierarchyBlock) => {
            const existingCategory = customBICSBreakdown.breakdown[category.code];
            if (!existingCategory) {
              const formattedBEBICSKey = `${BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER}${category.bicsLevel}`;
              const categoryBEData = rawData.breakdowns[formattedBEBICSKey].breakdown[category.code];
              if (!!categoryBEData) {
                customBICSBreakdown.breakdown[category.code] = categoryBEData;
                (customBICSBreakdown.breakdown[category.code] as AdhocExtensionBEStructuringBreakdownMetricBlock).customLevel = category.bicsLevel;
                (customBICSBreakdown.breakdown[category.code] as AdhocExtensionBEStructuringBreakdownMetricBlock).code = category.code;
                customBICSDefinitionList.push(category.code);
              }
            }
          });
        }
      }
    }
  }

  private formCustomBICsBreakdownWithSubLevelsConvertBicsCode(
    customBICSBreakdown: BEStructuringBreakdownBlock,
    customBICSDefinitionList: Array<string>
  ): Array<string> {
    // convert bicsCode to bics names
    const parsedCustomBICSDefinitionList = customBICSDefinitionList.map((eachCode) => {
      return this.bicsDictionaryLookupService.BICSCodeToBICSName(eachCode, true);
    })
    const parsedCustomBICSDefinitionListNoNull = parsedCustomBICSDefinitionList.filter((eachName) => {return !!eachName});
    for (let subCategory in customBICSBreakdown.breakdown) {
      const name = this.bicsDictionaryLookupService.BICSCodeToBICSName(subCategory, true);
      customBICSBreakdown.breakdown[name] = customBICSBreakdown.breakdown[subCategory];
    }
    return parsedCustomBICSDefinitionListNoNull;
  }

  private processStructureData(
    serverReturn: Array<BEStructuringFundBlock>,
    deltaServerReturn: Array<BEStructuringFundBlock>
  ) {
    if (!!serverReturn) {
      this.state.fetchResult.fundList = [];
      serverReturn.forEach((eachFund, index) => {
        if (!!deltaServerReturn) {
          if (!!deltaServerReturn[index]) {
            this.loadFund(eachFund, deltaServerReturn[index]);
          } else {
            console.error('DeltaServerReturn does not have valid data');
          }
        } else {
          this.loadFund(eachFund, null)
        }
      })
      try {
        this.state.fetchResult.fundList.length > 1 && this.sortFunds(this.state.fetchResult.fundList);
      } catch (err) {
        console.error('Sort fund failure');
        this.restfulCommService.logError('Structuring Sort Fund Failure');
      }
    }
  }

  private getSortedBreakdownDisplayListForFund(breakdowns: Array<PortfolioBreakdownDTO>): Array<PortfolioBreakdownDTO> {
    breakdowns.sort((breakdownA: PortfolioBreakdownDTO, breakdownB: PortfolioBreakdownDTO) => {
      if (breakdownA.state.isOverrideVariant && !breakdownB.state.isOverrideVariant) {
        return -4;
      } else if (!breakdownA.state.isOverrideVariant && breakdownB.state.isOverrideVariant) {
        return 4;
      } else if (breakdownA.data.title < breakdownB.data.title) {
        return -1;
      } else if (breakdownA.data.title > breakdownB.data.title) {
        return 1;
      } else {
        return 0;
      }
    })
    return breakdowns;
  }

  private loadFund(
    rawData: BEStructuringFundBlock,
    deltaRawData: BEStructuringFundBlock
  ) {
    if (this.constants.supportedFundList.indexOf(rawData.portfolioShortName) >= 0) {
      this.bicsDataProcessingService.setRawBICsData(rawData, deltaRawData);
      const newFund = this.dtoService.formStructureFundObject(rawData, deltaRawData, false, this.state.selectedMetricValue, this.state.activeDeltaScope);
      if (!!newFund) {
        this.formCustomBICsBreakdownWithSubLevels(rawData, deltaRawData, newFund);
        if (newFund.data.children.length > 0) {
          newFund.data.children = this.getSortedBreakdownDisplayListForFund(newFund.data.children);
        }
      }
      const alreadyExist = this.state.fetchResult.fundList.findIndex((eachFund) => {
        return eachFund.data.portfolioId === newFund.data.portfolioId;
      })
      this.updateTargetFundBreakdownDisplay(newFund);
      if (alreadyExist >= 0) {
        this.state.fetchResult.fundList[alreadyExist] = newFund;
      } else {
        this.state.fetchResult.fundList.push(newFund);
      }
    }
  }

  private updateTargetFundBreakdownDisplay(targetFund: PortfolioFundDTO) {
    if (targetFund.state.isStencil) {
      targetFund.data.displayChildren = targetFund.data.children;
    } else {
      switch (this.state.activeBreakdownViewFilter) {
        case this.constants.breakdownViewFilter.overridesOnly:
          targetFund.data.displayChildren = targetFund.data.children.filter((eachChild) => {
            return eachChild.state.isOverrideVariant;
          });
          break;
        case this.constants.breakdownViewFilter.BICSOnly:
          targetFund.data.displayChildren = targetFund.data.children.filter((eachChild) => {
            return eachChild.data.backendGroupOptionIdentifier.indexOf(BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER) === 0 && !eachChild.state.isOverrideVariant;
          });
          break;
        case this.constants.breakdownViewFilter.regularsOnly:
          targetFund.data.displayChildren = targetFund.data.children.filter((eachChild) => {
            return eachChild.data.backendGroupOptionIdentifier.indexOf(BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER) < 0 && !eachChild.state.isOverrideVariant;
          });
          break;
        case this.constants.breakdownViewFilter.all:
          targetFund.data.displayChildren = targetFund.data.children.filter((eachChild) => {
            return true;  // simply to retain the same behavior as other filters that generates a new reference
          });
          break;
        default:
          // code...
          break;
      }
    }
  }

  private extractSubPortfolioFromFullServerReturn(targetListWithSubPortfolios: Array<BEStructuringFundBlockWithSubPortfolios>): Array<BEStructuringFundBlock> {
    if (!!targetListWithSubPortfolios) {
      const targetListWithoutSubPortfolios: Array<BEStructuringFundBlock> = targetListWithSubPortfolios.map((eachFundWithSub) => {
        return this.extractSubPortfolioFromFundReturn(eachFundWithSub);
      });
      return targetListWithoutSubPortfolios;
    } else {
      return null;
    }
  }

  private extractSubPortfolioFromFundReturn(fundReturn: BEStructuringFundBlockWithSubPortfolios): BEStructuringFundBlock {
    const {
      target: targetWithSub,
      currentTotals: currentTotalsWithSub,
      breakdowns: breakdownsWithSub,
      overrides: overridesWithSub,
      ...inheritFundValues
    } = fundReturn;
    const subPortfolio = this.utilityService.convertFESubPortfolioTextToBEKey(this.state.activeSubPortfolioFilter);
    const eachFundWithoutSub: BEStructuringFundBlock = {
      target: {
        target: targetWithSub.target[subPortfolio],
        portfolioTargetId: targetWithSub.portfolioTargetId,
        portfolioId: targetWithSub.portfolioId,
        date: targetWithSub.date
      },
      currentTotals: currentTotalsWithSub[subPortfolio],
      breakdowns: {},
      overrides: {},
      ...inheritFundValues
    };
    for (const eachBreakdownKey in breakdownsWithSub) {
      const eachBreakdownWithSub:BEStructuringBreakdownBlockWithSubPortfolios = breakdownsWithSub[eachBreakdownKey];
      const {
        breakdown: breakdownCategoriesWithSub,
        ...inheritBreakdownValues
      } = eachBreakdownWithSub;
      const eachBreakdownWithoutSub: BEStructuringBreakdownBlock = {
        breakdown: {},
        ...inheritBreakdownValues
      };
      for (const eachCategoryKey in breakdownCategoriesWithSub) {
        const eachCategoryWithSub = breakdownCategoriesWithSub[eachCategoryKey];
        const eachBreakdownCategoryWithoutSub: BEStructuringBreakdownMetricBlock = {
          metricBreakdowns: eachCategoryWithSub.metricBreakdowns[subPortfolio],
          view: eachCategoryWithSub.view
        };
        eachBreakdownWithoutSub.breakdown[eachCategoryKey] = eachBreakdownCategoryWithoutSub;
      }
      eachFundWithoutSub.breakdowns[eachBreakdownKey] = eachBreakdownWithoutSub;
    }
    for (let bucket in overridesWithSub) {
      if (overridesWithSub[bucket]) {
        eachFundWithoutSub.overrides[bucket] = {};
        for (let category in overridesWithSub[bucket]) {
          if (overridesWithSub[bucket][category]) {
            const {
              breakdown: overrideCategoriesWithSub,
              ...inheritOverrideValues
            } = overridesWithSub[bucket][category];
            const eachOverrideWithoutSub: BEStructuringOverrideBaseBlock = {
              breakdown: {
                metricBreakdowns: overrideCategoriesWithSub.metricBreakdowns[subPortfolio],
                view: overrideCategoriesWithSub.view
              },
              ...inheritOverrideValues
            };
            eachFundWithoutSub.overrides[bucket][category] = eachOverrideWithoutSub;
          }
        }
      }
    }
    return eachFundWithoutSub;
  }

  private updateRawServerReturnCache(newFundData: BEStructuringFundBlockWithSubPortfolios) {
    // TODO: integrate with delta when implemented
    this.state.fetchResult.rawServerReturnCache.Now.forEach((eachFund, index) => {
      if (eachFund.portfolioId === newFundData.portfolioId) {
        this.state.fetchResult.rawServerReturnCache.Now[index] = newFundData;
      }
    });
  }

  private updateRawServerReturnWithRawDataForAllRows(rawFunds: Array<BEStructuringFundBlockWithSubPortfolios>) {
    rawFunds.forEach((fund: BEStructuringFundBlockWithSubPortfolios) => {
      const bicsBreakdownList = this.extractBICSBreakdownFromRawFundData(fund);
      bicsBreakdownList.forEach((bicsBreakdown: BEStructuringBreakdownBlockWithSubPortfolios) => {
        this.bicsDataProcessingService.populateServerReturnBICSBreakdownWithRemainingEmptyRows(bicsBreakdown);
      })
    })
  }

  private extractBICSBreakdownFromRawFundData(fund: BEStructuringFundBlockWithSubPortfolios): Array<BEStructuringBreakdownBlockWithSubPortfolios> {
    const breakdownList = Object.keys(fund.breakdowns).filter(category => category.includes(BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER)).map(category => fund.breakdowns[category]);
    return breakdownList;
  }

  private getDeltaSpecificFundFromRawServerReturnCache(
    portfolioID: number,
    delta: string
  ): BEStructuringFundBlockWithSubPortfolios{
    const fund: BEStructuringFundBlockWithSubPortfolios = this.state.fetchResult.rawServerReturnCache[delta].find((fund: BEStructuringFundBlockWithSubPortfolios) => fund.portfolioId === +(portfolioID));
    return fund;
  }

  private updateOverrides(payload: PayloadModifyOverrides) {
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.updatePortfolioOverrides, {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn: BEUpdateOverrideBlock) => {
        if (!!serverReturn && serverReturn.length > 0) {
          this.state.overrideModifications.callCount++;
          if (this.state.overrideModifications.callCount <= this.state.overrideModifications.totalNumberOfNecessaryCalls) {
            serverReturn.forEach((updatedOverride: BEStructuringOverrideBaseBlockWithSubPortfolios) => {
              this.updateDataInRawServerReturnCache(updatedOverride, this.constants.currentDeltaScope, true);
            })
            this.store$.dispatch(
              new CoreSendNewAlerts([
                this.dtoService.formSystemAlertObject(
                  'Structuring',
                  'Success',
                  `Successfully updated overrides`,
                  null
                )]
              )
            );
            this.refreshMainPanelUIWithNewDataForOverrideAPICalls();
          }
        }
      }),
      catchError(err => {
        this.store$.dispatch(
          new CoreSendNewAlerts([
            this.dtoService.formSystemAlertObject(
              'Structuring',
              'Error',
              `Unable to update new overrides`,
              null
            )]
          )
        );
        this.restfulCommService.logError('Update Override API failed, unable to create new overrides')
        console.error(`${this.restfulCommService.apiMap.updatePortfolioOverrides} failed`, err);
        return of('error')
      })
    ).subscribe()
  }

  private createOverrides(payload: PayloadModifyOverrides) {
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.createPortfolioOverrides, {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn: BECreateOverrideBlock) => {
        if (!!serverReturn) {
          this.state.overrideModifications.callCount++;
          if (this.state.overrideModifications.callCount <= this.state.overrideModifications.totalNumberOfNecessaryCalls) {
            this.iterateDeltaServerReturnWithNewOverridesToUpdateRawCache(serverReturn);
            this.store$.dispatch(
              new CoreSendNewAlerts([
                this.dtoService.formSystemAlertObject(
                  'Structuring',
                  'Success',
                  `Successfully created new overrides`,
                  null
                )]
              )
            );
            this.refreshMainPanelUIWithNewDataForOverrideAPICalls();
          }
        }
      }),
      catchError(err => {
        this.store$.dispatch(
          new CoreSendNewAlerts([
            this.dtoService.formSystemAlertObject(
              'Structuring',
              'Error',
              `Unable to create new overrides`,
              null
            )]
          )
        );
        this.restfulCommService.logError('Create Override API failed, unable to create new overrides')
        console.error(`${this.restfulCommService.apiMap.createPortfolioOverrides} failed`, err);
        return of('error')
      })
    ).subscribe()
  }

  private deleteOverrides(payload: PayloadModifyOverrides) {
    const formattedPayloadList = payload.portfolioOverrides.map((override: BEStructuringOverrideBaseBlockWithSubPortfolios) => ({portfolioId: override.portfolioId, simpleBucket: override.simpleBucket}));
    const modifiedPayloadFull: PayloadModifyOverrides = {
      portfolioOverrides: formattedPayloadList
    }
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.deletePortfolioOverrides, {req: 'POST'}, modifiedPayloadFull).pipe(
      first(),
      tap((serverReturn: boolean) => {
        this.state.overrideModifications.callCount++;
        if (serverReturn) {
          if (this.state.overrideModifications.callCount <= this.state.overrideModifications.totalNumberOfNecessaryCalls) {
            if (this.state.overrideModifications.callCount <= this.state.overrideModifications.totalNumberOfNecessaryCalls) {
              const deltas = [this.constants.currentDeltaScope, this.constants.deltaScope.dod, this.constants.deltaScope.wow, this.constants.deltaScope.mom, this.constants.deltaScope.ytd, this.constants.deltaScope.tMinusTwo];
              payload.portfolioOverrides.forEach((override: BEStructuringOverrideBaseBlockWithSubPortfolios) => {
                const overrideToBeDeleted: BEStructuringOverrideBaseBlockWithSubPortfolios = {...override, breakdown: null};
                deltas.forEach(delta => {
                  this.updateDataInRawServerReturnCache(overrideToBeDeleted, delta, true);
                })
              });
              this.store$.dispatch(
                new CoreSendNewAlerts([
                  this.dtoService.formSystemAlertObject(
                    'Structuring',
                    'Success',
                    `Successfully deleted overrides`,
                    null
                  )]
                )
              );
              this.refreshMainPanelUIWithNewDataForOverrideAPICalls();
            }
          }
        }
      }),
      catchError(err => {
        this.store$.dispatch(
          new CoreSendNewAlerts([
            this.dtoService.formSystemAlertObject(
              'Structuring',
              'Error',
              `Unable to delete new overrides`,
              null
            )]
          )
        );
        this.restfulCommService.logError('Delete Override API failed, unable to create new overrides')
        console.error(`${this.restfulCommService.apiMap.deletePortfolioOverrides} failed`, err);
        return of('error')
      })
    ).subscribe()
  }

  private updateDataInRawServerReturnCache(
    updateData: BEStructuringOverrideBaseBlockWithSubPortfolios | BEStructuringBreakdownBlockWithSubPortfolios,
    delta: string,
    isOverride: boolean
  ) {
    // This function serves to update data in the raw server cache
    // Used to update data in both breakdowns and overrides
    // Can be used to delete, update, or create overrides or breakdowns in the cache
    const existingFundDeltaData: BEStructuringFundBlockWithSubPortfolios = this.getDeltaSpecificFundFromRawServerReturnCache(updateData.portfolioId, delta);
    if (!!existingFundDeltaData) {
      if (isOverride) {
        const updatedOverrideRawData = updateData as BEStructuringOverrideBaseBlockWithSubPortfolios;
        if (existingFundDeltaData.overrides) {
          if (updatedOverrideRawData.rawBucketOptionsText && updatedOverrideRawData.rawBucketOptionsValuesText) {
            // Create new overrides
            const { portfolioId, portfolioOverrideId, indexId, bucket, simpleBucket, title, breakdown } = updatedOverrideRawData;
            // Stored data excludes the raw bucketOptions and bucketOptionsValues text
            const storedData: BEStructuringOverrideBaseBlockWithSubPortfolios = { portfolioId, portfolioOverrideId, indexId, bucket, simpleBucket, title, breakdown };
            if (existingFundDeltaData.overrides[updatedOverrideRawData.rawBucketOptionsText]) {
              // Create a new override within an existing bucket option
              existingFundDeltaData.overrides[updatedOverrideRawData.rawBucketOptionsText][updatedOverrideRawData.rawBucketOptionsValuesText] = storedData;
            } else {
              // Create a new override for a new bucket option
              existingFundDeltaData.overrides[updatedOverrideRawData.rawBucketOptionsText] = {
                [updatedOverrideRawData.rawBucketOptionsValuesText]: storedData
              }
            }
          } else {
            for (let existingBucketOption in existingFundDeltaData.overrides) {
              if (existingFundDeltaData.overrides[existingBucketOption]) {
                for (let existingBucketOptionValues in existingFundDeltaData.overrides[existingBucketOption]) {
                  if (existingFundDeltaData.overrides[existingBucketOption][existingBucketOptionValues]) {
                    if (existingFundDeltaData.overrides[existingBucketOption][existingBucketOptionValues].portfolioOverrideId === updatedOverrideRawData.portfolioOverrideId) {
                      if (!updatedOverrideRawData.breakdown) {
                        // Deleting an existing override
                        delete existingFundDeltaData.overrides[existingBucketOption][existingBucketOptionValues];
                      } else {
                        // Updating an existing override
                        existingFundDeltaData.overrides[existingBucketOption][existingBucketOptionValues] = updatedOverrideRawData;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  private makeOverrideAPICalls(overridesData: AdhocPacks.StructureSetTargetOverrideTransferPack) {
    const { updatePayload, createPayload, deletePayload } = overridesData;
    updatePayload.portfolioOverrides.length > 0 && this.updateOverrides(updatePayload);
    createPayload.portfolioOverrides.length > 0 && this.createOverrides(createPayload);
    deletePayload.portfolioOverrides.length > 0 && this.deleteOverrides(deletePayload);
  }

  private makeCreateBulkOverrideAPICall(bulkOverrideData: AdhocPacks.StructureSetBulkOverrideTransferPack) {
    const { pack: payload } = bulkOverrideData;
    this.restfulCommService.callAPI(this.restfulCommService.apiMap.createPortfolioOverridesForAllPortfolios, {req: 'POST'}, payload).pipe(
      first(),
      tap((serverReturn: BECreateOverrideBlock) => {
        if(serverReturn) {
          this.iterateDeltaServerReturnWithNewOverridesToUpdateRawCache(serverReturn);
          this.store$.dispatch(
            new CoreSendNewAlerts([
              this.dtoService.formSystemAlertObject(
                'Structuring',
                'Success',
                `Successfully created overrides across all portfolios`,
                null
              )]
            )
          );
          this.processStructureData(
            this.extractSubPortfolioFromFullServerReturn(this.state.fetchResult.rawServerReturnCache.Now),
            this.extractSubPortfolioFromFullServerReturn(this.state.fetchResult.rawServerReturnCache[this.state.activeDeltaScope])
          );
        }
      }),
      catchError(err => {
        this.store$.dispatch(
          new CoreSendNewAlerts([
            this.dtoService.formSystemAlertObject(
              'Structuring',
              'Error',
              `Unable to create new overrides across funds`,
              null
            )]
          )
        );
        this.restfulCommService.logError('Create Portfolio Override For All Portfolios API failed, unable to create new overrides across all portfolios')
        console.error(`${this.restfulCommService.apiMap.createPortfolioOverridesForAllPortfolios} failed`, err);
        return of('error')
      })
    ).subscribe()
  }

  private iterateDeltaServerReturnWithNewOverridesToUpdateRawCache(serverReturn: BECreateOverrideBlock) {
    for (let delta in serverReturn) {
      if (serverReturn[delta]) {
        for (let portfolioID in serverReturn[delta]) {
          if (serverReturn[delta][portfolioID]) {
            for (let bucketOptions in serverReturn[delta][portfolioID]) {
              if (serverReturn[delta][portfolioID][bucketOptions]) {
                for (let bucketOptionsValues in serverReturn[delta][portfolioID][bucketOptions]) {
                  if (serverReturn[delta][portfolioID][bucketOptions][bucketOptionsValues]) {
                    const updatedDeltaData = serverReturn[delta][portfolioID][bucketOptions][bucketOptionsValues];
                    updatedDeltaData.rawBucketOptionsText = bucketOptions;
                    updatedDeltaData.rawBucketOptionsValuesText = bucketOptionsValues;
                    this.updateDataInRawServerReturnCache(updatedDeltaData, delta, true);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  private refreshMainPanelUIWithNewDataForOverrideAPICalls() {
    if (this.state.overrideModifications.callCount === this.state.overrideModifications.totalNumberOfNecessaryCalls) {
      this.processStructureData(
        this.extractSubPortfolioFromFullServerReturn(this.state.fetchResult.rawServerReturnCache.Now),
        this.extractSubPortfolioFromFullServerReturn(this.state.fetchResult.rawServerReturnCache[this.state.activeDeltaScope])
      );
    }
  }
}