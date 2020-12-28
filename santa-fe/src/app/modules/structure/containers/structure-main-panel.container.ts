import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { DTOService } from 'Core/services/DTOService';
import { StructureMainPanelState } from 'FEModels/frontend-page-states.interface';
import { selectMetricLevel, selectSetViewData } from 'Structure/selectors/structure.selectors';
import { selectUserInitials } from 'Core/selectors/core.selectors';
import {
  selectReloadFundDataPostEdit,
  selectMainPanelUpdateTick,
  selectActiveBreakdownViewFilter,
  selectActivePortfolioViewFilter
} from 'Structure/selectors/structure.selectors';
import {
  RestfulCommService,
  UtilityService,
  BICsDataProcessingService,
  BICSDictionaryLookupService
} from 'Core/services';
import {
  PortfolioMetricValues,
  SUPPORTED_PORTFOLIO_LIST,
  BEPortfolioTargetMetricValues,
  BICS_BREAKDOWN_SUBLEVEL_CATEGORY_PREFIX,
  BICS_BREAKDOWN_BACKEND_GROUPOPTION_IDENTIFER,
  BreakdownViewFilter
} from 'Core/constants/structureConstants.constants';
import { PortfolioStructuringSample } from 'Structure/stubs/structure.stub';
import {
  PortfolioBreakdownDTO,
  PortfolioFundDTO,
  TargetBarDTO
} from 'Core/models/frontend/frontend-models.interface';
import { BEPortfolioStructuringDTO, BEStructuringBreakdownBlock } from 'App/modules/core/models/backend/backend-models.interface';
import { CoreSendNewAlerts } from 'Core/actions/core.actions';
import {
  PayloadGetPortfolioStructures,
  PayloadSetView
} from 'App/modules/core/models/backend/backend-payloads.interface';
import { StructureSetViewData, AdhocExtensionBEMetricBreakdowns } from 'FEModels/frontend-adhoc-packages.interface';
import {
  SecurityDefinitionMap
} from 'Core/constants/securityDefinitionConstants.constant';
import { BICsHierarchyBlock } from 'Core/models/frontend/frontend-blocks.interface';

@Component({
    selector: 'structure-main-panel',
    templateUrl: './structure-main-panel.container.html', 
    styleUrls: ['./structure-main-panel.container.scss'],
    encapsulation: ViewEncapsulation.Emulated
})

export class StructureMainPanel implements OnInit, OnDestroy {
  state: StructureMainPanelState; 
  subscriptions = {
    updateSub: null,
    ownerInitialsSub: null,
    selectedMetricLevelSub: null,
    reloadFundUponEditSub: null,
    viewData: null,
    activeBreakdownViewFilterSub: null,
    activePortfolioViewFilterSub: null
  };
  constants = {
    cs01: PortfolioMetricValues.cs01,
    creditLeverage: PortfolioMetricValues.creditLeverage,
    supportedFundList: SUPPORTED_PORTFOLIO_LIST,
    breakdownViewFilter: BreakdownViewFilter
  };
  
  constructor(
    private dtoService: DTOService,
    private store$: Store<any>,
    private restfulCommService: RestfulCommService,
    private utilityService: UtilityService,
    private bicsDataProcessingService: BICsDataProcessingService,
    private bicsDictionaryLookupService: BICSDictionaryLookupService
  ) {
    this.state = this.initializePageState();
  }
  
  private initializePageState(): StructureMainPanelState { 
    const state: StructureMainPanelState = {
      ownerInitial: null,
      isUserPM: false,
      selectedMetricValue: this.constants.cs01,
      activeBreakdownViewFilter: null,
      activePortfolioViewFilter: [],
      fetchResult: {
        fundList: [],
        fetchFundDataFailed: false,
        fetchFundDataFailedError: ''
      }
    }
    return state; 
  }
  
  public ngOnInit() {
    this.state = this.initializePageState();
    this.subscriptions.ownerInitialsSub = this.store$.pipe(
      select(selectUserInitials)
    ).subscribe((value) => {
        this.state.ownerInitial = value;
    });
    this.subscriptions.selectedMetricLevelSub = this.store$.pipe(
      select(selectMetricLevel)
    ).subscribe((value) => {
      const metric = value === this.constants.cs01 ? this.constants.cs01 : this.constants.creditLeverage
      this.state.selectedMetricValue = metric;
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
    });
    this.subscriptions.viewData = this.store$.pipe(select(selectSetViewData)).subscribe((value: StructureSetViewData) => {
      if (!!value) {
        this.updateViewData(value);
      }
    })
    this.subscriptions.reloadFundUponEditSub = this.store$.pipe(
      select(selectReloadFundDataPostEdit)
    ).subscribe((targetFund: BEPortfolioStructuringDTO) => {
      if (!!targetFund) {
        const targetFundCopy = this.utilityService.deepCopy(targetFund);
        this.loadFund(targetFundCopy);
      }
    });
    this.subscriptions.updateSub = this.store$.pipe(
      select(selectMainPanelUpdateTick)
    ).subscribe((tick) => {
      if (tick >= 0) {
        this.fullUpdate();
      }
    });
    this.subscriptions.activeBreakdownViewFilterSub = this.store$.pipe(
      select(selectActiveBreakdownViewFilter)
    ).subscribe((activeFilter) => {
      this.state.activeBreakdownViewFilter = activeFilter;
      this.state.fetchResult.fundList.forEach((eachFund) => {
        this.updateTargetFundBreakdownDisplay(eachFund);
      });
    });
    this.subscriptions.activePortfolioViewFilterSub = this.store$.pipe(
      select(selectActivePortfolioViewFilter)
    ).subscribe((activeFilter) => {
      this.state.activePortfolioViewFilter = activeFilter;
    });
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(eachItem)) {
        const eachSub = this.subscriptions[eachItem] as Subscription;
        eachSub.unsubscribe();
      }
    }
  }

  private fullUpdate() {
    const initialWaitForIcons = this.loadStencilFunds.bind(this);
    setTimeout(() => {
      initialWaitForIcons();
    }, 200);
    const loadData = this.fetchFunds.bind(this);
    setTimeout(() => {
      loadData();
    }, 500);
  }

  private loadStencilFunds() {
    this.state.fetchResult.fundList = this.constants.supportedFundList.map((eachPortfolioName) => {
      const eachFund = this.dtoService.formStructureFundObject(PortfolioStructuringSample, true, this.state.selectedMetricValue);
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
    //If nothing is passed in, BE assumes current date
    let payload: PayloadGetPortfolioStructures;
    const endpoint = this.restfulCommService.apiMap.getPortfolioStructures;
    this.state.fetchResult.fetchFundDataFailed && this.resetAPIErrors();
    this.restfulCommService.callAPI(endpoint, { req: 'POST' }, payload, false, false).pipe(
      first(),
      tap((serverReturn: Array<BEPortfolioStructuringDTO>) => {
        this.processStructureData(serverReturn);
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
        return of('error')
      })
    ).subscribe()
  }

  private updateViewData(data: StructureSetViewData) {
    const currentFunds = this.utilityService.deepCopy(this.state.fetchResult.fundList);
    this.loadStencilFunds();
    const { bucket, view, displayCategory} = data;
    const payload: PayloadSetView = {
      bucket: bucket,
      view: view
    }
    const endpoint = this.restfulCommService.apiMap.setView;
    let totalBucketValues = '';
    const displayViewValue = !!view ? view : 'removed';
    for (let values in bucket) {
      if (!!bucket[values]) {
        totalBucketValues = totalBucketValues === '' ? `${bucket[values]}` : `${totalBucketValues} ${bucket[values]}`
      }
    }

    const messageDetails = `${displayCategory}, with view value ${displayViewValue}`;
    this.state.fetchResult.fetchFundDataFailed && this.resetAPIErrors();
    this.restfulCommService.callAPI(endpoint, { req: 'POST' }, payload, false, false).pipe(
      first(),
      tap((serverReturn: Array<BEPortfolioStructuringDTO>) => {
        this.processStructureData(serverReturn);
        const completeAlertMessage = `Successfully updated ${messageDetails}`;
        const alert = this.dtoService.formSystemAlertObject('Structuring', 'Updated', `${completeAlertMessage}`, null);
        this.store$.dispatch(new CoreSendNewAlerts([alert]));
        this.restfulCommService.logEngagement(
          this.restfulCommService.engagementMap.portfolioStructureSetView,
          null,
          `View value for ${displayCategory} updated as ${displayViewValue}. Set by ${this.state.ownerInitial}`,
          'Portfolio Structure Breakdown'
        )
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
    rawData: BEPortfolioStructuringDTO,
    fund: PortfolioFundDTO
  ) {
    // Create regular BICs breakdown with sublevels here to avoid circular dependencies with using BICS and DTO service
    const {
      customBreakdown: customBICSBreakdown,
      customDefinitionList: customBICSDefinitionList
    } = this.dtoService.formCustomRawBreakdownData(
      rawData,
      rawData.breakdowns['BicsCodeLevel1'],
      ['BicsCodeLevel2', 'BicsCodeLevel3', 'BicsCodeLevel4']
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
    const isCs01 = this.state.selectedMetricValue === PortfolioMetricValues.cs01;
    const BICSBreakdown = this.dtoService.formPortfolioBreakdown(false, customBICSBreakdown, parsedCustomBICSDefinitionList, isCs01);
    BICSBreakdown.data.title = 'BICS';
    BICSBreakdown.data.definition = this.dtoService.formSecurityDefinitionObject(SecurityDefinitionMap.BICS_LEVEL_1);
    BICSBreakdown.data.indexName = rawData.indexShortName;
    BICSBreakdown.data.portfolioName = rawData.portfolioShortName;
    fund.data.children.push(BICSBreakdown);
  }

  private formCustomBICsBreakdownWithSubLevelsPopulateCustomLevel(
    rawData: BEPortfolioStructuringDTO,
    customBICSBreakdown: BEStructuringBreakdownBlock,
    customBICSDefinitionList: Array<string>
  ) {
    // After retrieving the rows with targets, get their corresponding hierarchy lists in order to get the parent categories to be displayed
    for (let code in customBICSBreakdown.breakdown) {
      const targetLevel: number = (customBICSBreakdown.breakdown[code] as AdhocExtensionBEMetricBreakdowns).customLevel;
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
                (customBICSBreakdown.breakdown[category.code] as AdhocExtensionBEMetricBreakdowns).customLevel = category.bicsLevel;
                (customBICSBreakdown.breakdown[category.code] as AdhocExtensionBEMetricBreakdowns).code = category.code;
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

  private processStructureData(serverReturn: Array<BEPortfolioStructuringDTO>) {
    if (!!serverReturn) {
      this.state.fetchResult.fundList = [];
      serverReturn.forEach(eachFund => {
        this.loadFund(eachFund);
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

  private loadFund(rawData: BEPortfolioStructuringDTO) {
    if (this.constants.supportedFundList.indexOf(rawData.portfolioShortName) >= 0) {
      this.bicsDataProcessingService.setRawBICsData(rawData);
      const newFund = this.dtoService.formStructureFundObject(rawData, false, this.state.selectedMetricValue);
      if (!!newFund) {
        this.formCustomBICsBreakdownWithSubLevels(rawData, newFund);
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
      default:
        // code...
        break;
    }
  }

}