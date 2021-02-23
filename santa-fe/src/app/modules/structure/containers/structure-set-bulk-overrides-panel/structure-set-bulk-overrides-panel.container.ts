  // dependencies
    import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
    import { of, Subscription } from 'rxjs';
    import { catchError, first, tap } from 'rxjs/operators';
    import { Store, select } from '@ngrx/store';

    import { DTOs, Blocks, AdhocPacks } from 'Core/models/frontend';
    import { DTOService, UtilityService, RestfulCommService, BICsDataProcessingService, BICSDictionaryLookupService, GlobalWorkflowIOService } from 'Core/services';
    import { SantaContainerComponentBase } from 'Core/containers/santa-container-component-base';
    import { StructureSetBulkOverridesPanelState } from 'Core/models/frontend/frontend-page-states.interface';
    import {
      STRUCTURE_SET_BULK_OVERRIDES_MODAL_ID,
      CustomeBreakdownConfiguratorDefinitionLayout,
      BICS_OVERRIDES_IDENTIFIER,
      BICS_OVERRIDES_TITLE
    } from 'Core/constants/structureConstants.constants';
    import {
      PayloadUpdatePortfolioOverridesForAllPortfolios,
      PayloadGetPortfolioOverride
    } from 'Core/models/backend/backend-payloads.interface';
    import { BEStructuringFundBlockWithSubPortfolios } from 'Core/models/backend/backend-models.interface';
    import { ModalService } from 'Form/services/ModalService';
    import { CoreSendNewAlerts } from 'Core/actions/core.actions';
    import { SecurityDefinitionMap } from 'App/modules/core/constants/securityDefinitionConstants.constant';
    import { StructureSendSetBulkOverridesTransferEvent } from 'Structure/actions/structure.actions';
    import { selectSetBulkOverridesEvent } from 'Structure/selectors/structure.selectors';
  //
@Component({
  selector: 'structure-set-bulk-overrides-panel',
  templateUrl: './structure-set-bulk-overrides-panel.container.html',
  styleUrls: ['./structure-set-bulk-overrides-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class StructureSetBulkOverrides extends SantaContainerComponentBase implements OnInit {
  state: StructureSetBulkOverridesPanelState;
  subscriptions = {
    setBulkOverridesSub: null
  }
  constants = {
    setBulkOverridesModalId: STRUCTURE_SET_BULK_OVERRIDES_MODAL_ID,
    configuratorLayout: CustomeBreakdownConfiguratorDefinitionLayout,
    BICSOverrideIdentifier: BICS_OVERRIDES_IDENTIFIER,
    BICSOverrideTitle: BICS_OVERRIDES_TITLE
  }
  constructor(
    private store$: Store<any>,
    private bicsService: BICsDataProcessingService,
    private bicsLookUpService: BICSDictionaryLookupService,
    private dtoService: DTOService,
    private modalService: ModalService,
    private restfulCommService: RestfulCommService,
    private utilityService: UtilityService,
    protected globalWorkflowIOService: GlobalWorkflowIOService
  ){
    super(globalWorkflowIOService);
    this.state = this.initializePageState();
  }

  private initializePageState(): StructureSetBulkOverridesPanelState {
    const state: StructureSetBulkOverridesPanelState = {
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
    this.subscriptions.setBulkOverridesSub = this.store$.pipe(select(selectSetBulkOverridesEvent)).subscribe((state:boolean) =>{
      if (!!state) {
        this.bicsService.loadBICSOptionsIntoConfigurator(this.state.configurator.dto);
      }
    })
    this.modalService.setModalTitle(this.constants.setBulkOverridesModalId, 'Add Overrides To All Funds');
    this.modalService.bindModalSaveCallback(this.constants.setBulkOverridesModalId, this.submitOverrideChanges.bind(this));
    this.modalService.bindModalCloseCallback(this.constants.setBulkOverridesModalId, this.closeModal.bind(this));
    return this.ngOnInit();
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
    this.state.configurator.dto = this.dtoService.resetSecurityDefinitionConfigurator(this.state.configurator.dto, this.constants.configuratorLayout);
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
    const originalBucketIdentifier = this.utilityService.formBucketIdentifierForOverride(simpleBucket);
    const parsedDisplayBucket = originalBucketIdentifier.replace(this.constants.BICSOverrideIdentifier, this.constants.BICSOverrideTitle);
    const editRow: Blocks.StructureSetBulkOverridesEditRow = {
      displayRowTitle: title,
      modifiedDisplayRowTitle: title,
      rowIdentifier: title,
      displayBucket: parsedDisplayBucket,
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
      this.store$.dispatch(new CoreSendNewAlerts([this.dtoService.formSystemAlertObject('Warning', 'Add Overrides', 'Can not submit new overrides because no change is detected', null)]));
      return false;
    }
  }

  private closeModal(): boolean {
    // reset states upon closing modal
    this.state.editRowList = [];
    this.state.configurator.display = false;
    this.state.configurator.dto.state.showFiltersFromDefinition = null;
    this.state.configurator.newOverrideNameCache = null;
    this.state.configurator.dto = this.dtoService.resetSecurityDefinitionConfigurator(this.state.configurator.dto, this.constants.configuratorLayout);
    return true;
  }
}

