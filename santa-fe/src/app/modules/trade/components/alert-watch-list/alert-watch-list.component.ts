    import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
    import { TradeAlertConfigurationAxeGroupBlockDTO, SecurityDTO } from 'FEModels/frontend-models.interface';
    import { SelectAxeWatchlistSide, SelectAxeWatchlistType, SelectAxeWatchlistRangeValue, SelectAxeWatchlistRangeDriver } from 'Core/models/frontend/frontend-blocks.interface';
    import { AxeAlertScope, AxeAlertType } from 'App/modules/core/constants/tradeConstants.constant';
    import { TriCoreDriverConfig } from 'Core/constants/coreConstants.constant';


@Component({
  selector: 'alert-watch-list',
  templateUrl: './alert-watch-list.component.html',
  styleUrls: ['./alert-watch-list.component.scss']
})

export class AlertWatchList implements OnInit {
  @Input() eachSecurityBlock: TradeAlertConfigurationAxeGroupBlockDTO;
  @Output() selectAxeWatchlistSide = new EventEmitter<SelectAxeWatchlistSide>();
  @Output() selectAxeWatchlistType = new EventEmitter<SelectAxeWatchlistType>();
  @Output() changeAxeWatchlistRangeMin = new EventEmitter<SelectAxeWatchlistRangeValue>();
  @Output() changeAxeWatchlistRangeMax = new EventEmitter<SelectAxeWatchlistRangeValue>();
  @Output() clickAxeWatchlistClearRange = new EventEmitter<TradeAlertConfigurationAxeGroupBlockDTO>();
  @Output() selectAxeWatchlistRangeDriver = new EventEmitter<SelectAxeWatchlistRangeDriver>();
  @Output() toggleAxeWatchlistPriority = new EventEmitter<TradeAlertConfigurationAxeGroupBlockDTO>();
  @Output() toggleAxeWatchlistSendEmail = new EventEmitter<TradeAlertConfigurationAxeGroupBlockDTO>();
  @Output() toggleDisableTargetGroupFromAxeWatchlist = new EventEmitter<TradeAlertConfigurationAxeGroupBlockDTO>();
  @Output() clickRemoveSecurityFromAxeWatchlist = new EventEmitter<TradeAlertConfigurationAxeGroupBlockDTO>();

  constants = {
    axeAlertScope: AxeAlertScope,
    axeAlertType: AxeAlertType,
    driver: TriCoreDriverConfig,
  }

  constructor() {}

  ngOnInit() {}

  public onSelectAxeAlertWatchlistSide(targetScope: AxeAlertScope, targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    const emitObject = {targetScope, targetBlock};
    this.selectAxeWatchlistSide.emit(emitObject)
  }

  public onSelectAxeAlertWatchlistType(targetType: AxeAlertType, targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    const emitObject = {targetType, targetBlock};
    this.selectAxeWatchlistType.emit(emitObject)
  }

  public onChangeAxeWatchlistRangeMin(newValue, targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.changeAxeWatchlistRangeMin.emit({newValue, targetBlock})
  }

  public onChangeAxeWatchlistRangeMax(newValue, targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.changeAxeWatchlistRangeMax.emit({newValue, targetBlock})
  }

  public onClickAxeWatchlistClearRange(targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.clickAxeWatchlistClearRange.emit(targetBlock);
  }

  public onSelectAxeWatchlistRangeDriver(targetBlock: TradeAlertConfigurationAxeGroupBlockDTO, targetDriver: string) {
    const emitObject = {targetBlock, targetDriver};
    this.selectAxeWatchlistRangeDriver.emit(emitObject);
  }

  public onToggleAxeWatchlistPriority(targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.toggleAxeWatchlistPriority.emit(targetBlock)
  }

  public onToggleAxeWatchlistSendEmail(targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.toggleAxeWatchlistSendEmail.emit(targetBlock);
  }

  public onToggleDisableTargetGroupFromAxeWatchlist(targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.toggleDisableTargetGroupFromAxeWatchlist.emit(targetBlock);
  }

  public onClickRemoveSecurityFromAxeWatchlist(targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.clickRemoveSecurityFromAxeWatchlist.emit(targetBlock);
  }
 }