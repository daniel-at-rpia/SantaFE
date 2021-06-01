import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import * as globalConstants from 'Core/constants';
import { DTOs, Blocks, AdhocPacks } from 'Core/models/frontend';
import { SecurityActionMenuOptionsRawText } from '../../constants/tradeConstants.constant';
import { UtilityService } from 'Core/services/UtilityService';
import { BICSDataProcessingService } from 'Core/services/BICSDataProcessingService';

@Component({
  selector: 'security-action-menu',
  templateUrl: './security-action-menu.component.html',
  styleUrls: ['./security-action-menu.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SecurityActionMenu implements OnInit {
  @Input() securityDTO: DTOs.SecurityDTO
  @Input() actionMenu: DTOs.SecurityActionMenuDTO;
  @Output() clickToLaunchUofBByTicker = new EventEmitter<AdhocPacks.SecurityActionMenuLaunchUofBEventEmitterBlock>();
  @Output() clickToLaunchUofBByBICS = new EventEmitter<AdhocPacks.SecurityActionMenuLaunchUofBEventEmitterBlock>();
  @Output() clickToSetAlert = new EventEmitter();
  @Output() clickToSendGraph = new EventEmitter();
  @Output() clickToSearch = new EventEmitter();
  @Output() clickToPinRow = new EventEmitter();
  @Output() clickBloombergOptions = new EventEmitter<string>();
  constants = globalConstants;
  constructor(
    private utilityService: UtilityService,
    private bicsDataProcessingService: BICSDataProcessingService
  ) {}

  public ngOnInit() {
    if (!!this.actionMenu && !!this.securityDTO && !!this.securityDTO.data) {
      const copy = this.utilityService.deepCopy(this.actionMenu);
      this.actionMenu = copy;
    }
  }

  public onClickCoreAction(targetAction: Blocks.SecurityActionMenuOptionBlock) {
    const targetLevel = targetAction.level - 1;
    if (targetLevel > 0) {
      const previousCoreAction = this.getPreviousCoreAction(targetAction, targetLevel);
      this.actionMenu.data.selectedCoreAction = previousCoreAction;
      this.actionMenu.data.availableSubActions = this.getSubActionsFromCoreAction(previousCoreAction.subActions);
    } else {
      this.actionMenu.data.availableSubActions = this.utilityService.getSecurityActionMenuSubActionsFromLevel(1);
      this.actionMenu.data.selectedCoreAction = null;
      //this.actionMenu.state.isCoreActionSelected = false;
    }
  }

  public onClickSubAction(targetAction: Blocks.SecurityActionMenuOptionBlock) {
    if (targetAction.subActions.length > 0) {
      this.actionMenu.state.isCoreActionSelected = true;
      this.onDiveInToSubAction(targetAction);
    } else {
      this.getCallbacksForActions(targetAction);
    }
  }

  private onDiveInToSubAction(targetAction: Blocks.SecurityActionMenuOptionBlock) {
    this.actionMenu.data.selectedCoreAction = targetAction;
    this.actionMenu.data.availableSubActions = this.getSubActionsFromCoreAction(targetAction.subActions);
  }

  private getSubActionsFromCoreAction(targetSubActions: Array<SecurityActionMenuOptionsRawText>): Array<Blocks.SecurityActionMenuOptionBlock> {
    const selectedSubActions = this.constants.trade.SecurityActionMenuList.filter((optionBlock: Blocks.SecurityActionMenuOptionBlock) => targetSubActions.indexOf(optionBlock.rawText) >= 0);
    return selectedSubActions;
  }

  private getPreviousCoreAction(
    targetSubAction: Blocks.SecurityActionMenuOptionBlock,
    targetLevel: number
  ): Blocks.SecurityActionMenuOptionBlock {
    const selectedActionsList = this.constants.trade.SecurityActionMenuList.filter((optionBlock: Blocks.SecurityActionMenuOptionBlock) => optionBlock.level === targetLevel && optionBlock.subActions.length > 0);
    const selectedPreviousCoreAction = selectedActionsList.find((optionBlock: Blocks.SecurityActionMenuOptionBlock) => {
      const isCoreActionBlock = optionBlock.subActions.find((subActions: SecurityActionMenuOptionsRawText) => subActions === targetSubAction.rawText);
      return isCoreActionBlock;
    })
    return selectedPreviousCoreAction;
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

  public onClickSearch() {
    !!this.clickToSearch && this.clickToSearch.emit();
  }

  public onClickPinRow() {
    !!this.clickToPinRow && this.clickToPinRow.emit();
  }

  public onClickBloombergOptions(targetModule: string) {
    !!this.clickBloombergOptions && this.clickBloombergOptions.emit(targetModule)
  }

  private getCallbacksForActions(targetAction: Blocks.SecurityActionMenuOptionBlock) {
    const { pinRow, sendToGraph, setAlert, ticker, bics, bloombergDES, bloombergQMGR, bloombergTDH, bloombergYAS } = this.constants.trade.SecurityActionMenuOptionsRawText;
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