import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { StructureSetOverridesAcrossFundsPanelState } from 'Core/models/frontend/frontend-page-states.interface';
import {
  STRUCTURE_SET_BULK_OVERRIDES_MODAL_ID,
  CustomeBreakdownConfiguratorDefinitionLayout
} from 'Core/constants/structureConstants.constants';
import { DTOService } from 'Core/services/DTOService';
import { DTOs, Blocks, AdhocPacks } from 'Core/models/frontend';
import {
  PayloadUpdatePortfolioOverridesForAllPortfolios,
  PayloadGetPortfolioOverride
} from 'Core/models/backend/backend-payloads.interface';
import { BEStructuringFundBlockWithSubPortfolios } from 'Core/models/backend/backend-models.interface';
import { BICsDataProcessingService } from 'Core/services/BICsDataProcessingService';
import { BICSDictionaryLookupService } from 'Core/services/BICSDictionaryLookupService'
import { ModalService } from 'Form/services/ModalService';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { UtilityService } from 'Core/services/UtilityService'
import { CoreSendNewAlerts } from 'Core/actions/core.actions';
import { SecurityDefinitionMap } from 'App/modules/core/constants/securityDefinitionConstants.constant';
import { StructureUpdateMainPanelEvent } from 'Structure/actions/structure.actions'; 

@Component({
  selector: 'structure-set-bulk-overrides-panel',
  templateUrl: './structure-set-bulk-overrides-panel.container.html',
  styleUrls: ['./structure-set-bulk-overrides-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureSetBulkOverrides implements OnInit {
  state: StructureSetOverridesAcrossFundsPanelState;
  // subscriptions = {
  //   setOverridesAcrossAllFundsSub: null
  // }
  constants = {
    setBulkOverridesModalId: STRUCTURE_SET_BULK_OVERRIDES_MODAL_ID,
    configuratorLayout: CustomeBreakdownConfiguratorDefinitionLayout,
  }
  constructor(
    private store$: Store<any>,
    private bicsService: BICsDataProcessingService,
    private bicsLookUpService: BICSDictionaryLookupService,
    private dtoService: DTOService,
    private modalService: ModalService,
    private restfulCommService: RestfulCommService,
    private utilityService: UtilityService
  ){
    this.state = this.initializePageState();
  }

  private initializePageState(): StructureSetOverridesAcrossFundsPanelState {
    const state: StructureSetOverridesAcrossFundsPanelState = {
      editRowList: [],
      configurator: {
        dto: this.dtoService.createSecurityDefinitionConfigurator(true, false, false, this.constants.configuratorLayout),
        display: false,
        newOverrideNameCache: null
      }
    };
    return state;
  }

  public ngOnInit() {
    this.state = this.initializePageState();
    this.state.configurator.dto = this.dtoService.createSecurityDefinitionConfigurator(true, false, false, this.constants.configuratorLayout);
    this.bicsService.loadBICSOptionsIntoConfigurator(this.state.configurator.dto);
    this.modalService.setModalTitle(this.constants.setBulkOverridesModalId, 'Set Overrides Across Multiple Funds');
    this.modalService.bindModalSaveCallback(this.constants.setBulkOverridesModalId, this.submitTargetChanges.bind(this));
  }

  public onClickNewOverrideRow() {
    this.state.configurator.display = !this.state.configurator.display;
  }

  public onApplyConfiguratorFilter(params: AdhocPacks.DefinitionConfiguratorEmitterParams) {
    if (params.filterList.length === 0) {
      const alert = this.dtoService.formSystemAlertObject('Apply Blocked', 'Empty Bucket', `Define the bucket with value before apply`, null);
      this.store$.dispatch(new CoreSendNewAlerts([alert]));
    } else {
      this.state.configurator.newOverrideNameCache = null;
      const simpleBucket = {}
      let bucketToString = '';
      params.filterList.forEach((eachItem) => {
        const property = this.utilityService.convertFEKey(eachItem.key);
        if (!!property) {
          simpleBucket[property] = eachItem.filterBy;
        }
        eachItem.filterBy.forEach((eachValue) => {
          const displayTitle = eachItem.key === SecurityDefinitionMap.BICS_CONSOLIDATED.key ? this.bicsLookUpService.BICSCodeToBICSName(eachValue) : eachValue;
          bucketToString = bucketToString === '' ? `${displayTitle}` : `${bucketToString}, ${displayTitle}`;
        });
      });
      const newEditRow = this.createEditRow(bucketToString, simpleBucket)
      this.state.editRowList.push(newEditRow);
    }
    this.state.configurator.display = false;
    this.state.configurator.dto = this.dtoService.createSecurityDefinitionConfigurator(true, false, false, this.constants.configuratorLayout);
    this.bicsService.loadBICSOptionsIntoConfigurator(this.state.configurator.dto);
  }

  public onSelectForRemoval(category: Blocks.StructureSetBulkOverridesEditRow) {
    const modifiedEditRowList = this.state.editRowList.filter((row: Blocks.StructureSetBulkOverridesEditRow) => row.rowIdentifier !== category.rowIdentifier);
    this.state.editRowList = modifiedEditRowList;
  }

  public onEditRowRenamed(targetName: string, targetRow: Blocks.StructureSetBulkOverridesEditRow) {
    targetRow.modifiedDisplayRowTitle = targetName;
  }

  private createEditRow(title: string, bucket: Blocks.StructureBucketDataBlock): Blocks.StructureSetBulkOverridesEditRow {
    const editRow: Blocks.StructureSetBulkOverridesEditRow = {
      displayRowTitle: title,
      modifiedDisplayRowTitle: title,
      rowIdentifier: title,
      simpleBucket: bucket,
      isEven: false
    }
    return editRow;
  }

  private submitTargetChanges(): boolean {
    this.submitOverrideChanges();
    return true;
  }

  private traverseEditRowsToFormUpdateOverridePayload(): Array<PayloadUpdatePortfolioOverridesForAllPortfolios> {
    const payload: Array<PayloadUpdatePortfolioOverridesForAllPortfolios> = [];
    this.state.editRowList.forEach((eachRow: Blocks.StructureSetBulkOverridesEditRow) => {
      const eachPayload: PayloadUpdatePortfolioOverridesForAllPortfolios = {
        portfolioOverride: {
          simpleBucket: eachRow.simpleBucket,
          title: eachRow.displayRowTitle
        }
      };
      if (eachRow.modifiedDisplayRowTitle !== eachRow.displayRowTitle) {
        eachPayload.portfolioOverride.title = eachRow.modifiedDisplayRowTitle;
      }
      payload.push(eachPayload);
    });
    return payload;
  }

  private submitOverrideChanges(): boolean {
    const updatePayload: Array<PayloadUpdatePortfolioOverridesForAllPortfolios> = this.traverseEditRowsToFormUpdateOverridePayload();
    const necessaryUpdateNumOfCalls = updatePayload.length;
    if (updatePayload.length > 0) {
      let callCount = 0;
      updatePayload.forEach((eachPayload) => {
        this.restfulCommService.callAPI(this.restfulCommService.apiMap.updatePortfolioOverridesForAllPortfolios, {req: 'POST'}, eachPayload).pipe(
          first(),
          tap((serverReturn: BEStructuringFundBlockWithSubPortfolios) => {
            callCount++;
            if (callCount === necessaryUpdateNumOfCalls) {
              this.store$.dispatch(
                new CoreSendNewAlerts([
                  this.dtoService.formSystemAlertObject(
                    'Structuring',
                    'Updated',
                    `Successfully Updated All Funds With New Overrides`,
                    null
                  )]
                )
              );
              this.store$.dispatch(new StructureUpdateMainPanelEvent());
            }
          }),
          catchError(err => {
            console.error('update breakdown failed');
            this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Error', 'Set Target', 'update breakdown failed', null)]));
            return of('error');
          })
        ).subscribe();
      });
      return true;
    } else {
      this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Warning', 'Set Target', 'Can not submit new target because no change is detected', null)]));
      return false;
    }
  }
}

