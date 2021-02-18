import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { of, Subscription } from 'rxjs';
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
import { StructureSendSetBulkOverridesTransferEvent } from 'Structure/actions/structure.actions';
import { selectSetBulkOverridesEvent } from 'Structure/selectors/structure.selectors';
@Component({
  selector: 'structure-set-bulk-overrides-panel',
  templateUrl: './structure-set-bulk-overrides-panel.container.html',
  styleUrls: ['./structure-set-bulk-overrides-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureSetBulkOverrides implements OnInit {
  state: StructureSetOverridesAcrossFundsPanelState;
  subscriptions = {
    setBulkOverridesSub: null
  }
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
    this.subscriptions.setBulkOverridesSub = this.store$.pipe(select(selectSetBulkOverridesEvent)).subscribe((state:boolean) =>{
      if (!!state) {
        this.bicsService.loadBICSOptionsIntoConfigurator(this.state.configurator.dto);
      }
    })
    this.modalService.setModalTitle(this.constants.setBulkOverridesModalId, 'Set Overrides Across Multiple Funds');
    this.modalService.bindModalSaveCallback(this.constants.setBulkOverridesModalId, this.submitOverrideChanges.bind(this));
    this.modalService.bindModalCloseCallback(this.constants.setBulkOverridesModalId, this.closeModal.bind(this));
  }

  public ngOnDestroy() {
    for (const eachItem in this.subscriptions) {
      if (this.subscriptions[eachItem]) {
        const eachSub = this.subscriptions[eachItem] as Subscription;
        eachSub.unsubscribe()
      }
    }
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
      this.sortEditRows();
      this.setRowAsEvenState();
    }
    this.state.configurator.display = false;
    this.state.configurator.dto = this.dtoService.createSecurityDefinitionConfigurator(true, false, false, this.constants.configuratorLayout);
    this.bicsService.loadBICSOptionsIntoConfigurator(this.state.configurator.dto);
  }

  public onSelectForRemoval(category: Blocks.StructureSetBulkOverridesEditRow) {
    const modifiedEditRowList = this.state.editRowList.filter((row: Blocks.StructureSetBulkOverridesEditRow) => row.rowIdentifier !== category.rowIdentifier);
    this.state.editRowList = modifiedEditRowList;
    this.sortEditRows();
    this.setRowAsEvenState()
  }

  public onEditRowRenamed(targetName: string, targetRow: Blocks.StructureSetBulkOverridesEditRow) {
    targetRow.modifiedDisplayRowTitle = targetName;
  }

  private createEditRow(title: string, simpleBucket: Blocks.StructureBucketDataBlock): Blocks.StructureSetBulkOverridesEditRow {
    const editRow: Blocks.StructureSetBulkOverridesEditRow = {
      displayRowTitle: title,
      modifiedDisplayRowTitle: title,
      rowIdentifier: title,
      displayBucket: this.utilityService.formBucketIdentifierForOverride(simpleBucket),
      simpleBucket: simpleBucket,
      isEven: false
    }
    return editRow;
  }

  private updateRowIdentifier(simpleBucket: Blocks.StructureBucketDataBlock, rowNumber: number): string {
    const values: Array<string> = [];
    for (let groupOption in simpleBucket) {
      if (simpleBucket[groupOption]) {
        simpleBucket[groupOption].forEach((option:string) => values.push(option));
      }
    }
    const rowIdentifier = `Row${rowNumber}-${values.join('-')}`;
    return rowIdentifier;
  }

  private sortEditRows() {
    this.state.editRowList.sort((rowA: Blocks.StructureSetBulkOverridesEditRow, rowB: Blocks.StructureSetBulkOverridesEditRow) => {
      if (rowA.displayBucket < rowB.displayBucket) {
        return -1;
      } else if (rowA.displayBucket > rowB.displayBucket) {
        return 1;
      } else if (rowA.displayRowTitle < rowB.displayRowTitle) {
        return -4
      } else if (rowA.displayRowTitle > rowB.displayRowTitle) {
        return 4;
      } else {
        return 0;
      }
    })
    this.state.editRowList.forEach((editRow: Blocks.StructureSetBulkOverridesEditRow, index: number) => {
      const updatedIdentifier = this.updateRowIdentifier(editRow.simpleBucket,index);
      editRow.rowIdentifier = updatedIdentifier;
    })
  }

  private setRowAsEvenState() {
    this.state.editRowList.forEach((row:Blocks.StructureSetBulkOverridesEditRow, index: number) => row.isEven = index % 2 === 0);
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
    const updatePayloadTransferPack: AdhocPacks.StructureSetBulkOverridesTransferPack = {
      overrides: updatePayload
    };
    if (updatePayloadTransferPack.overrides.length > 0) {
      this.store$.dispatch(new StructureSendSetBulkOverridesTransferEvent(updatePayloadTransferPack));
      this.state.editRowList = [];
      return true;
    } else {
      this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Warning', 'Set Target', 'Can not submit new target because no change is detected', null)]));
      return false;
    }
  }

  private closeModal(): boolean {
    // reset states upon closing modal
    this.state.editRowList = [];
    this.state.configurator.display = false;
    this.state.configurator.dto.state.showFiltersFromDefinition = null;
    this.state.configurator.newOverrideNameCache = null;
    if (!!this.state.configurator.dto.data.definitionList) {
      this.state.configurator.dto.data.definitionList.forEach((definition: DTOs.SecurityDefinitionBundleDTO) => {
        if (definition.data.list.length > 0) {
          definition.data.list.forEach((option: DTOs.SecurityDefinitionDTO) => {
            option.state.filterActive = false;
            if (option.data.displayOptionList.length > 0) {
              option.data.displayOptionList.forEach((displayOption: Blocks.SecurityDefinitionFilterBlock) => {
                displayOption.isSelected = false;
              })
            }
            option.data.highlightSelectedOptionList = [];
          })
        }
      })
    }
    return true;
  }
}

