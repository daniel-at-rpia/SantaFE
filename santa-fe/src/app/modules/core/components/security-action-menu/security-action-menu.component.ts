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
  constants = {
    globalConstants,
    actionBtnClass: 'sat-securityActionMenu__content-actionBtn'
  };
  constructor(
    private bicsDataProcessingService: BICSDataProcessingService,
    private dtoService: DTOService
  ) {}

  public getClassWithPositioningIdentifier(action: Blocks.SecurityActionMenuOptionBlock): string {
    return `${this.constants.actionBtnClass}--${action.positionIdentifier}`;
  }

  public onClickCoreAction(targetAction: Blocks.SecurityActionMenuOptionBlock) {
    const targetLevel = targetAction.level - 1;
    if (targetLevel > 0) {
      const previousAction = this.actionMenu.data.allActions.find((action: Blocks.SecurityActionMenuOptionBlock) => action.rawText === targetAction.parentAction);
      this.actionMenu.data.selectedCoreAction = previousAction;
      this.getSubActionsFromSelectedAction(previousAction);
    } else {
      this.actionMenu = this.dtoService.formSecurityActionMenuDTO(true, null);
    }
  }

  public onClickSubAction(targetAction: Blocks.SecurityActionMenuOptionBlock) {
    if (targetAction.subActions.length > 0) {
      this.actionMenu.state.isCoreActionSelected = true;
      targetAction.isAvailableSubAction = false;
      this.getSubActionsFromSelectedAction(targetAction);
    } else {
      this.getCallbacksForActions(targetAction);
      this.actionMenu = this.dtoService.formSecurityActionMenuDTO(false, null);
    }
  }

  private getSubActionsFromSelectedAction(targetAction: Blocks.SecurityActionMenuOptionBlock) {
    this.actionMenu.data.selectedCoreAction = {...targetAction};
    this.actionMenu.data.allActions.forEach((action: Blocks.SecurityActionMenuOptionBlock) => {
      action.isAvailableSubAction = targetAction.rawText === action.parentAction;
    })
  }


  public onClickLaunchUofBTicker(ticker: string){
    if (!!ticker) {
      const object: AdhocPacks.SecurityActionMenuLaunchUofBEventEmitterBlock = {
        type: this.constants.globalConstants.definition.SecurityDefinitionMap.TICKER.key,
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
        const level = identifier.split(this.constants.globalConstants.structuring.BICS_BREAKDOWN_FRONTEND_KEY).length > 0 ? +identifier.split(this.constants.globalConstants.structuring.BICS_BREAKDOWN_FRONTEND_KEY)[1] : 0;
        if (!!level) {
          const object: AdhocPacks.SecurityActionMenuLaunchUofBEventEmitterBlock = {
            type: this.constants.globalConstants.definition.SecurityDefinitionMap.BICS_CONSOLIDATED.key,
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
    const { pinRow, sendToGraph, setAlert, ticker, bics, bloombergDES, bloombergQMGR, bloombergTDH, bloombergYAS } = this.constants.globalConstants.trade.SecurityActionMenuOptionsRawText;
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