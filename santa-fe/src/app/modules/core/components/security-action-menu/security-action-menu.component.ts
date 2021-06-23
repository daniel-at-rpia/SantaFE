import { Component, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import * as globalConstants from 'Core/constants';
import { DTOs, Blocks, AdhocPacks } from 'Core/models/frontend';
import { BICSDataProcessingService } from 'Core/services/BICSDataProcessingService';
import { UtilityService } from 'Core/services/UtilityService';

@Component({
  selector: 'security-action-menu',
  templateUrl: './security-action-menu.component.html',
  styleUrls: ['./security-action-menu.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SecurityActionMenu {
  @Input() securityDTO: DTOs.SecurityDTO
  @Input() actionMenu: DTOs.SecurityActionMenuDTO;
  @Output() clickToLaunchUofBByTicker = new EventEmitter<AdhocPacks.SecurityActionMenuLaunchUofBEventEmitterBlock>();
  @Output() clickToLaunchUofBByBICS = new EventEmitter<AdhocPacks.SecurityActionMenuLaunchUofBEventEmitterBlock>();
  @Output() clickToSetAlert = new EventEmitter();
  @Output() clickToSendGraph = new EventEmitter();
  @Output() clickToPinRow = new EventEmitter();
  @Output() clickBloombergOptions = new EventEmitter<string>();
  constants = globalConstants;
  constructor(
    private bicsDataProcessingService: BICSDataProcessingService,
    private utilityService: UtilityService
  ) {}

  public onClickCoreAction(targetAction: Blocks.SecurityActionMenuOptionBlock) {
    if (!!targetAction) {
      const coreAction = targetAction.level > 0 ? this.actionMenu.data.allActions.find((action: Blocks.SecurityActionMenuOptionBlock) => action.rawText === targetAction.coreAction) : null;
      this.actionMenu.data.selectedCoreAction = coreAction;
      this.showNewSubActionsFromSelectedCoreAction(coreAction);
      if (!this.actionMenu.data.selectedCoreAction) {
        this.actionMenu.state.isCoreActionSelected = false;
      }
    } else {
      this.utilityService.resetActionMenuToDefaultState(this.actionMenu, false);
      this.securityDTO.state.isSelected = false;
    }
  }

  public onClickSubAction(targetAction: Blocks.SecurityActionMenuOptionBlock) {
    if (targetAction.subActions.length > 0) {
      this.actionMenu.state.isCoreActionSelected = true;
      targetAction.isAvailableSubAction = false;
      this.actionMenu.data.selectedCoreAction = targetAction;
      this.showNewSubActionsFromSelectedCoreAction(targetAction);
    } else {
      this.getCallbacksForActions(targetAction);
      this.utilityService.resetActionMenuToDefaultState(this.actionMenu, false);
    }
  }

  private showNewSubActionsFromSelectedCoreAction(targetAction: Blocks.SecurityActionMenuOptionBlock) {
    this.actionMenu.data.allActions.forEach((action: Blocks.SecurityActionMenuOptionBlock) => {
      action.isAvailableSubAction = !targetAction ? action.level === 1 : action.coreAction === targetAction.rawText;
    });
  }


  public onClickLaunchUofBTicker(ticker: string){
    if (!!ticker) {
      const object: AdhocPacks.SecurityActionMenuLaunchUofBEventEmitterBlock = {
        type: this.constants.definition.SecurityDefinitionMap.TICKER.key,
        value: ticker,
        bicsLevel: null
      }
      !!this.clickToLaunchUofBByTicker && this.clickToLaunchUofBByTicker.emit(object);
    }
  }

  public onClickLaunchUofBBICS(securityDTO: DTOs.SecurityDTO) {
    if (!!securityDTO.data && !!securityDTO.data.bics && Object.keys(securityDTO.data.bics).length > 0) {
      const category = this.bicsDataProcessingService.extractDeepestBICSCategory(securityDTO);
      if (!!category) {
        const identifier = Object.keys(securityDTO.data.bics).find(key => securityDTO.data.bics[key] === category);
        const level = identifier.split(this.constants.structuring.BICS_BREAKDOWN_FRONTEND_KEY).length > 0 ? +identifier.split(this.constants.structuring.BICS_BREAKDOWN_FRONTEND_KEY)[1] : 0;
        if (!!level) {
          const object: AdhocPacks.SecurityActionMenuLaunchUofBEventEmitterBlock = {
            type: this.constants.definition.SecurityDefinitionMap.BICS_CONSOLIDATED.key,
            value: category,
            bicsLevel: level
          }
          !!this.clickToLaunchUofBByBICS && this.clickToLaunchUofBByBICS.emit(object);
        }
      }
    }
  }

  public onClickSetAlert() {
    !!this.clickToSetAlert && this.clickToSetAlert.emit();
  }

  public onClickSendToGraph() {
    !!this.clickToSendGraph && this.clickToSendGraph.emit();
  }

  public onClickPinRow() {
    !!this.clickToPinRow && this.clickToPinRow.emit();
  }

  public onClickBloombergOptions(targetModule: string) {
    !!this.clickBloombergOptions && this.clickBloombergOptions.emit(targetModule)
  }

  private getCallbacksForActions(targetAction: Blocks.SecurityActionMenuOptionBlock) {
    const { pinRow, sendToGraph, setAlert, ticker, bics, bloombergDES, bloombergQMGR, bloombergTDH, bloombergYAS } = this.constants.security.SecurityActionMenuOptionsRawText;
    if (targetAction.rawText === pinRow) {
      this.onClickPinRow()
    } else if (targetAction.rawText === sendToGraph) {
      this.onClickSendToGraph();
    } else if (targetAction.rawText === setAlert) {
      this.onClickSetAlert();
    } else if (targetAction.rawText === ticker) {
      this.onClickLaunchUofBTicker(this.securityDTO.data.ticker);
    } else if (targetAction.rawText === bloombergDES || targetAction.rawText === bloombergQMGR || targetAction.rawText === bloombergYAS || targetAction.rawText === bloombergTDH) {
      this.onClickBloombergOptions(targetAction.rawText);
    } else if (targetAction.rawText === bics) {
      this.onClickLaunchUofBBICS(this.securityDTO);
    }
  }
}