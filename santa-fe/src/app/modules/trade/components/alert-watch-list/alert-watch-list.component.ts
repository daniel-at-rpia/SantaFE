    import {Component, Input, OnInit, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
    import { DTOs, Blocks } from 'Core/models/frontend';
    import { AxeAlertScope, AxeAlertType } from 'App/modules/core/constants/tradeConstants.constant';
    import { TriCoreDriverConfig } from 'Core/constants/coreConstants.constant';


@Component({
  selector: 'alert-watch-list',
  templateUrl: './alert-watch-list.component.html',
  styleUrls: ['./alert-watch-list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class AlertWatchList implements OnInit {
  @Input() eachSecurityBlock: DTOs.TradeAlertConfigurationAxeGroupBlockDTO;
  @Output() selectAxeWatchlistSide = new EventEmitter<Blocks.SelectAxeWatchlistSide>();
  @Output() selectAxeWatchlistType = new EventEmitter<Blocks.SelectAxeWatchlistType>();
  @Output() changeAxeWatchlistRangeMin = new EventEmitter<Blocks.SelectAxeWatchlistRangeValue>();
  @Output() changeAxeWatchlistRangeMax = new EventEmitter<Blocks.SelectAxeWatchlistRangeValue>();
  @Output() clickAxeWatchlistClearRange = new EventEmitter<DTOs.TradeAlertConfigurationAxeGroupBlockDTO>();
  @Output() selectAxeWatchlistRangeDriver = new EventEmitter<Blocks.SelectAxeWatchlistRangeDriver>();
  @Output() toggleAxeWatchlistPriority = new EventEmitter<DTOs.TradeAlertConfigurationAxeGroupBlockDTO>();
  @Output() toggleAxeWatchlistSendEmail = new EventEmitter<DTOs.TradeAlertConfigurationAxeGroupBlockDTO>();
  @Output() toggleDisableTargetGroupFromAxeWatchlist = new EventEmitter<DTOs.TradeAlertConfigurationAxeGroupBlockDTO>();
  @Output() clickRemoveSecurityFromAxeWatchlist = new EventEmitter<DTOs.TradeAlertConfigurationAxeGroupBlockDTO>();

  constants = {
    axeAlertScope: AxeAlertScope,
    axeAlertType: AxeAlertType,
    driver: TriCoreDriverConfig,
  }

  constructor() {}

  ngOnInit() {}

  public onSelectAxeAlertWatchlistSide(targetScope: AxeAlertScope, targetBlock: DTOs.TradeAlertConfigurationAxeGroupBlockDTO) {
    const emitObject = {targetScope, targetBlock};
    this.selectAxeWatchlistSide.emit(emitObject)
  }

  public onSelectAxeAlertWatchlistType(targetType: AxeAlertType, targetBlock: DTOs.TradeAlertConfigurationAxeGroupBlockDTO) {
    const emitObject = {targetType, targetBlock};
    this.selectAxeWatchlistType.emit(emitObject)
  }

  public onChangeAxeWatchlistRangeMin(newValue, targetBlock: DTOs.TradeAlertConfigurationAxeGroupBlockDTO) {
    this.changeAxeWatchlistRangeMin.emit({newValue, targetBlock})
  }

  public onChangeAxeWatchlistRangeMax(newValue, targetBlock: DTOs.TradeAlertConfigurationAxeGroupBlockDTO) {
    this.changeAxeWatchlistRangeMax.emit({newValue, targetBlock})
  }

  public onClickAxeWatchlistClearRange(targetBlock: DTOs.TradeAlertConfigurationAxeGroupBlockDTO) {
    this.clickAxeWatchlistClearRange.emit(targetBlock);
  }

  public onSelectAxeWatchlistRangeDriver(targetBlock: DTOs.TradeAlertConfigurationAxeGroupBlockDTO, targetDriver: string) {
    const emitObject = {targetBlock, targetDriver};
    this.selectAxeWatchlistRangeDriver.emit(emitObject);
  }

  public onToggleAxeWatchlistPriority(targetBlock: DTOs.TradeAlertConfigurationAxeGroupBlockDTO) {
    this.toggleAxeWatchlistPriority.emit(targetBlock)
  }

  public onToggleAxeWatchlistSendEmail(targetBlock: DTOs.TradeAlertConfigurationAxeGroupBlockDTO) {
    this.toggleAxeWatchlistSendEmail.emit(targetBlock);
  }

  public onToggleDisableTargetGroupFromAxeWatchlist(targetBlock: DTOs.TradeAlertConfigurationAxeGroupBlockDTO) {
    this.toggleDisableTargetGroupFromAxeWatchlist.emit(targetBlock);
  }

  public onClickRemoveSecurityFromAxeWatchlist(targetBlock: DTOs.TradeAlertConfigurationAxeGroupBlockDTO) {
    this.clickRemoveSecurityFromAxeWatchlist.emit(targetBlock);
  }
 }